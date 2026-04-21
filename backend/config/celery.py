import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('marketplace')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Celery découvre automatiquement les tasks.py de chaque app
app.autodiscover_tasks()