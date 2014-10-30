from rest_framework import serializers
from core.models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'transaction_date', 'transaction_type', 'short_code',
                  'account_number', 'description', 'debit_amount',
                  'credit_amount', 'balance', 'ignored')
