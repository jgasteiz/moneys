# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20141022_1935'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expense',
            name='transaction_date',
            field=models.DateField(default=datetime.datetime.now, blank=True),
        ),
    ]
