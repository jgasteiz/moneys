from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns(
    'public.views',

    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', 'home', name='home'),
    url(r'^import_csv/$', 'import_csv', name='import_csv'),
    url(r'^new_expense/$', 'new_expense', name='new_expense'),
)
