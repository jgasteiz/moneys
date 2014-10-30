from django.contrib import admin
from .models import Transaction, Category


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_date', 'description', 'debit_amount', 'credit_amount',
                    'balance', 'transaction_type',)

admin.site.register(Transaction, TransactionAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Category, CategoryAdmin)
