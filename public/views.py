import csv
import json
import datetime
from decimal import Decimal

from django.http import HttpResponse, HttpResponseBadRequest
from django.views.generic import TemplateView

from core.forms import CSVForm
from core.models import Transaction

TRANSACTION_PROPERTIES = {
    'transaction_date': 'Transaction Date',
    'transaction_type': 'Transaction Type',
    'short_code': 'Sort Code',
    'account_number': 'Account Number',
    'description': 'Transaction Description',
    'debit_amount': 'Debit Amount',
    'credit_amount': 'Credit Amount',
    'balance': 'Balance',
}
CSV_HEADERS = [TRANSACTION_PROPERTIES[key] for key in TRANSACTION_PROPERTIES]


class Home(TemplateView):
    template_name = 'index.html'

home = Home.as_view()


def import_csv(request, *args, **kwargs):
    form = CSVForm(data=request.POST, files=request.FILES)

    if form.is_valid():

        def _get_prop_value(csv_row, header_idxs, model_property_name):
            csv_header = TRANSACTION_PROPERTIES[model_property_name]
            return csv_row[header_idxs[csv_header]]

        csv_file = request.FILES['csv_file']

        spamreader = csv.reader(csv_file, delimiter=',', quotechar='|')

        csv_header_idxs = {}
        for row in spamreader:
            if spamreader.line_num == 1:
                for idx, col in enumerate(row):
                    if col in CSV_HEADERS:
                        csv_header_idxs[col] = idx
            else:

                transaction_type = _get_prop_value(row, csv_header_idxs, 'transaction_type')

                transaction_date = _get_prop_value(row, csv_header_idxs, 'transaction_date')
                date_tmp = datetime.datetime.strptime(transaction_date, '%d/%m/%Y')
                transaction_date = date_tmp.strftime("%Y-%m-%d")

                short_code = _get_prop_value(row, csv_header_idxs, 'short_code')
                account_number = _get_prop_value(row, csv_header_idxs, 'account_number')
                description = _get_prop_value(row, csv_header_idxs, 'description')

                debit_amount = _get_prop_value(row, csv_header_idxs, 'debit_amount')
                debit_amount = Decimal(debit_amount) if debit_amount != '' else None

                credit_amount = _get_prop_value(row, csv_header_idxs, 'credit_amount')
                credit_amount = Decimal(credit_amount) if credit_amount != '' else None

                balance = _get_prop_value(row, csv_header_idxs, 'balance')
                balance = Decimal(balance) if balance != '' else None

                qry = Transaction.objects.filter(
                    transaction_date=transaction_date,
                    transaction_type=transaction_type,
                    description=description,
                    debit_amount=debit_amount,
                    credit_amount=credit_amount
                )

                if len(qry) == 0:
                    Transaction.objects.create(
                        transaction_date=transaction_date,
                        transaction_type=transaction_type,
                        short_code=short_code,
                        account_number=account_number,
                        description=description,
                        debit_amount=debit_amount,
                        credit_amount=credit_amount,
                        balance=balance
                    )

        return HttpResponse(json.dumps(dict(message='CSV imported successfully')),
                            content_type='application/json')
    else:
        return HttpResponseBadRequest()
