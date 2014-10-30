from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import routers

from public.api import TransactionViewSet


router = routers.DefaultRouter()
router.register(r'transactions', TransactionViewSet, base_name='transactions')

urlpatterns = patterns(
    'public.views',

    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', 'home', name='home'),
    url(r'^import_csv/$', 'import_csv', name='import_csv'),
    url(r'^api/', include(router.urls)),
)
