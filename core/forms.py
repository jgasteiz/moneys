from django.core.urlresolvers import reverse
from crispy_forms.bootstrap import FormActions
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Div, Layout, HTML
from django import forms


class CSVForm(forms.Form):
    csv_file = forms.FileField()

    def __init__(self, *args, **kwargs):
        super(CSVForm, self).__init__(*args, **kwargs)
        helper = FormHelper()
        helper.form_class = 'form'
        helper.attrs['name'] = 'form'
        self.helper = helper
        self.helper.layout = Layout(
            Div(
                'csv_file',
            ),
            FormActions(
                Submit('import', 'Import'),
                HTML('<a class="btn btn-default" href="%s">Cancel</a>' % reverse('home')),
            )
        )
