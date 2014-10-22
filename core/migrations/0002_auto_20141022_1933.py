# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expense',
            name='balance',
            field=models.DecimalField(max_digits=9, decimal_places=2, blank=True),
        ),
        migrations.AlterField(
            model_name='expense',
            name='credit_amount',
            field=models.DecimalField(max_digits=9, decimal_places=2, blank=True),
        ),
        migrations.AlterField(
            model_name='expense',
            name='debit_amount',
            field=models.DecimalField(max_digits=9, decimal_places=2, blank=True),
        ),
    ]
