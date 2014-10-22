# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('transaction_date', models.DateField(auto_now_add=True)),
                ('transaction_type', models.CharField(max_length=32, blank=True)),
                ('short_code', models.CharField(max_length=32, blank=True)),
                ('account_number', models.CharField(max_length=32, blank=True)),
                ('description', models.CharField(max_length=32, blank=True)),
                ('debit_amount', models.FloatField(null=True, blank=True)),
                ('credit_amount', models.FloatField(null=True, blank=True)),
                ('balance', models.FloatField(null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
