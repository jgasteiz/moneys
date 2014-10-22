from django.contrib import admin
from .models import Expense


class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('transaction_date', 'description', 'debit_amount', 'credit_amount',
                    'balance', 'transaction_type')

admin.site.register(Expense, ExpenseAdmin)
