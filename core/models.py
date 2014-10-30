from datetime import datetime

from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=128)

    def __unicode__(self):
        return self.name


class Transaction(models.Model):
    transaction_date = models.DateField(blank=True, default=datetime.now)
    transaction_type = models.CharField(max_length=32, blank=True)
    short_code = models.CharField(max_length=32, blank=True)
    account_number = models.CharField(max_length=32, blank=True)
    description = models.CharField(max_length=128, blank=True)
    debit_amount = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    credit_amount = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    balance = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)

    ignored = models.BooleanField(default=False)
    category = models.ManyToManyField(Category, blank=True, null=True)

    class Meta:
        ordering = ('-transaction_date',)

    def __unicode__(self):
        return '%s - %s' % (self.description, self.debit_amount)
