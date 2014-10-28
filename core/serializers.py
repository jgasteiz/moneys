from rest_framework import serializers
from core.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('id', 'transaction_date', 'transaction_type', 'short_code',
                  'account_number', 'description', 'debit_amount',
                  'credit_amount', 'balance', 'ignored')
