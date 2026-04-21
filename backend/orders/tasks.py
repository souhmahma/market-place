from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_order_confirmation_email(order_id):
    """Email envoyé au customer après paiement"""
    from .models import Order
    order = Order.objects.get(id=order_id)

    items_list = "\n".join([
        f"- {item.product.name} x{item.quantity} → {item.subtotal()}€"
        for item in order.items.all()
    ])

    send_mail(
        subject = f"Confirmation commande #{order.id}",
        message = f"""
Bonjour {order.customer.username},

Votre commande #{order.id} a bien été confirmée.

Récapitulatif :
{items_list}

Total : {order.total_amount}€
Commission : {order.commission_amount}€

Merci pour votre achat !
        """,
        from_email    = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [order.customer.email],
    )
    return f"Email envoyé pour commande #{order_id}"

@shared_task
def send_shop_approved_email(shop_id):
    """Email envoyé au vendeur quand sa boutique est approuvée"""
    from shops.models import Shop
    shop = Shop.objects.get(id=shop_id)

    send_mail(
        subject = f"Votre boutique '{shop.name}' est approuvée !",
        message = f"""
Bonjour {shop.owner.username},

Bonne nouvelle ! Votre boutique "{shop.name}" a été approuvée.
Vous pouvez maintenant ajouter vos produits.
        """,
        from_email    = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [shop.owner.email],
    )
    return f"Email envoyé pour boutique #{shop_id}"

@shared_task
def send_shop_rejected_email(shop_id):
    """Email envoyé au vendeur quand sa boutique est rejetée"""
    from shops.models import Shop
    shop = Shop.objects.get(id=shop_id)

    send_mail(
        subject = f"Votre boutique '{shop.name}' a été rejetée",
        message = f"""
Bonjour {shop.owner.username},

Malheureusement, votre boutique "{shop.name}" n'a pas été approuvée.
Veuillez contacter le support pour plus d'informations.
        """,
        from_email    = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [shop.owner.email],
    )
    return f"Email rejet envoyé pour boutique #{shop_id}"

@shared_task
def send_product_approved_email(product_id):
    """Email envoyé au vendeur quand son produit est approuvé"""
    from products.models import Product
    product = Product.objects.get(id=product_id)

    send_mail(
        subject = f"Votre produit '{product.name}' est approuvé !",
        message = f"""
Bonjour {product.shop.owner.username},

Votre produit "{product.name}" est maintenant visible sur la marketplace.
        """,
        from_email    = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [product.shop.owner.email],
    )
    return f"Email envoyé pour produit #{product_id}"

@shared_task
def send_low_stock_alert(product_id):
    """Alerte vendeur quand stock < 5"""
    from products.models import Product
    product = Product.objects.get(id=product_id)

    send_mail(
        subject = f"Stock faible — {product.name}",
        message = f"""
Bonjour {product.shop.owner.username},

Attention ! Le stock de "{product.name}" est faible : {product.stock} unités restantes.
Pensez à réapprovisionner.
        """,
        from_email    = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [product.shop.owner.email],
    )
    return f"Alerte stock envoyée pour produit #{product_id}"

@shared_task
def send_moderator_new_shop_email(shop_id):
    """Email envoyé aux modérateurs quand une nouvelle boutique est en attente"""
    from shops.models import Shop
    from accounts.models import User

    shop = Shop.objects.get(id=shop_id)

    # Récupère tous les modérateurs
    moderators = User.objects.filter(role='moderator')
    emails = [m.email for m in moderators if m.email]

    if not emails:
        return "Aucun modérateur trouvé"

    send_mail(
        subject = f"🏪 Nouvelle boutique en attente — {shop.name}",
        message = f"""
Bonjour,

Une nouvelle boutique est en attente de validation :

Nom      : {shop.name}
Vendeur  : {shop.owner.username}
Email    : {shop.owner.email}
Description : {shop.description}

Connectez-vous pour approuver ou rejeter cette boutique.
        """,
        from_email     = settings.DEFAULT_FROM_EMAIL,
        recipient_list = emails,
    )
    return f"Email modérateur envoyé pour boutique #{shop_id}"


@shared_task
def send_moderator_new_product_email(product_id):
    """Email envoyé aux modérateurs quand un nouveau produit est en attente"""
    from products.models import Product
    from accounts.models import User

    product    = Product.objects.get(id=product_id)
    moderators = User.objects.filter(role='moderator')
    emails     = [m.email for m in moderators if m.email]

    if not emails:
        return "Aucun modérateur trouvé"

    send_mail(
        subject = f"📦 Nouveau produit en attente — {product.name}",
        message = f"""
Bonjour,

Un nouveau produit est en attente de validation :

Produit  : {product.name}
Boutique : {product.shop.name}
Prix     : {product.price}€
Stock    : {product.stock}
Description : {product.description}

Connectez-vous pour approuver ou rejeter ce produit.
        """,
        from_email     = settings.DEFAULT_FROM_EMAIL,
        recipient_list = emails,
    )
    return f"Email modérateur envoyé pour produit #{product_id}"

@shared_task
def send_product_rejected_email(product_id):
    """Email envoyé au vendeur quand son produit est rejeté"""
    from products.models import Product
    product = Product.objects.get(id=product_id)

    send_mail(
        subject = f"Votre produit '{product.name}' a été rejeté",
        message = f"""
Bonjour {product.shop.owner.username},

Malheureusement, votre produit "{product.name}" n'a pas été approuvé.
Veuillez contacter le support pour plus d'informations.
        """,
        from_email     = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [product.shop.owner.email],
    )
    return f"Email rejet envoyé pour produit #{product_id}"