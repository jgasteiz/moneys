from rest_framework import serializers
from core.models import Transaction, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')


class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(many=True, slug_field='name')

    class Meta:
        model = Transaction
        fields = ('id', 'transaction_date', 'transaction_type', 'short_code',
                  'account_number', 'description', 'debit_amount',
                  'credit_amount', 'balance', 'ignored', 'category')
