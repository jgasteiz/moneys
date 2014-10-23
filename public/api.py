from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.response import Response

from core.models import Expense
from core.serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ViewSet):
    model = Expense
    paginate_by = 20
    serializer = ExpenseSerializer

    def get_all_expenses(self, request):
        page_num = request.GET.get('page', 1)
        paginate_by = request.GET.get('paginate_by', self.paginate_by)

        queryset = self.model.objects.all()
        paginator = Paginator(queryset, paginate_by)
        page = paginator.page(page_num)

        serializer = self.serializer(page.object_list, many=True)

        return dict(
            page=page_num,
            has_next=page.has_next(),
            has_previous=page.has_previous(),
            results=serializer.data
        )

    def get_expenses_by_date(self, request):
        date = request.GET.get('date')
        splitted_date = date.split('-')

        year = splitted_date[0]
        queryset = self.model.objects.filter(transaction_date__year=year)

        if len(splitted_date) == 2:
            month = splitted_date[1]
            queryset = queryset.filter(transaction_date__month=month)

        serializer = self.serializer(queryset, many=True)

        return dict(
            results=serializer.data
        )

    def list(self, request):
        if 'date' in request.GET:
            response_data = self.get_expenses_by_date(request)
        else:
            response_data = self.get_all_expenses(request)

        return Response(response_data)

    def retrieve(self, request, pk=None):
        queryset = Expense.objects.all()
        expense = get_object_or_404(queryset, pk=pk)
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)
