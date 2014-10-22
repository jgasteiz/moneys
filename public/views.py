import csv
import datetime
from decimal import Decimal

from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect
from django.views.generic import ListView, FormView, CreateView

from core.forms import CSVForm, ExpenseForm
from core.models import Expense

EXPENSE_PROPERTIES = {
    'transaction_date': 'Transaction Date',
    'transaction_type': 'Transaction Type',
    'short_code': 'Sort Code',
    'account_number': 'Account Number',
    'description': 'Transaction Description',
    'debit_amount': 'Debit Amount',
    'credit_amount': 'Credit Amount',
    'balance': 'Balance',
}
CSV_HEADERS = [EXPENSE_PROPERTIES[key] for key in EXPENSE_PROPERTIES]


class Home(ListView):
    template_name = 'home.html'
    model = Expense

    def get_context_data(self, **kwargs):
        ctx = super(Home, self).get_context_data(**kwargs)
        ctx.update(dict(
            form=ExpenseForm()
        ))
        return ctx

home = Home.as_view()


class ImportCSV(FormView):
    form_class = CSVForm
    success_url = reverse_lazy('home')
    template_name = 'import_csv.html'

    def post(self, request, *args, **kwargs):

        form = self.form_class(data=request.POST, files=request.FILES)
        if form.is_valid():

            def _get_prop_value(csv_row, header_idxs, model_property_name):
                csv_header = EXPENSE_PROPERTIES[model_property_name]
                return csv_row[header_idxs[csv_header]]

            def _get_duration(duration=[]):
                if len(duration) == 2:
                    return datetime.time(0, int(duration[0]), int(duration[1]))
                if len(duration) == 3:
                    return datetime.time(
                        int(duration[0]), int(duration[1]), int(duration[2]))
                else:
                    return datetime.time(0, 5)

            # Expense.objects.all().delete()
            csv_file = request.FILES['csv_file']

            spamreader = csv.reader(csv_file, delimiter=',', quotechar='|')

            csv_header_idxs = {}
            for row in spamreader:
                if spamreader.line_num == 1:
                    for idx, col in enumerate(row):
                        if col in CSV_HEADERS:
                            csv_header_idxs[col] = idx
                else:

                    transaction_date = _get_prop_value(row, csv_header_idxs, 'transaction_date')
                    date_tmp = datetime.datetime.strptime(transaction_date, '%d/%m/%Y')
                    transaction_date = date_tmp.strftime("%Y-%m-%d")

                    transaction_type = _get_prop_value(row, csv_header_idxs, 'transaction_type')
                    short_code = _get_prop_value(row, csv_header_idxs, 'short_code')
                    account_number = _get_prop_value(row, csv_header_idxs, 'account_number')
                    description = _get_prop_value(row, csv_header_idxs, 'description')

                    debit_amount = _get_prop_value(row, csv_header_idxs, 'debit_amount')
                    debit_amount = Decimal(debit_amount) if debit_amount != '' else None

                    credit_amount = _get_prop_value(row, csv_header_idxs, 'credit_amount')
                    credit_amount = Decimal(credit_amount) if credit_amount != '' else None

                    balance = _get_prop_value(row, csv_header_idxs, 'balance')
                    balance = Decimal(balance) if balance != '' else None

                    qry = Expense.objects.filter(
                        transaction_date=transaction_date,
                        transaction_type=transaction_type,
                        description=description,
                        debit_amount=debit_amount,
                        credit_amount=credit_amount
                    )

                    if len(qry) == 0:
                        Expense.objects.create(
                            transaction_date=transaction_date,
                            transaction_type=transaction_type,
                            short_code=short_code,
                            account_number=account_number,
                            description=description,
                            debit_amount=debit_amount,
                            credit_amount=credit_amount,
                            balance=balance
                        )

        return HttpResponseRedirect(self.get_success_url())

import_csv = ImportCSV.as_view()


class NewExpense(CreateView):
    form_class = ExpenseForm
    model = Expense
    success_url = reverse_lazy('home')
    template_name = 'new_expense.html'

new_expense = NewExpense.as_view()
