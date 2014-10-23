from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.response import Response

from core.models import Expense
from core.serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ViewSet):
    paginate_by = 20

    def list(self, request):
        page_num = request.GET.get('page', 1)

        queryset = Expense.objects.all()
        paginator = Paginator(queryset, self.paginate_by)
        page = paginator.page(page_num)

        serializer = ExpenseSerializer(page.object_list, many=True)
        return Response(dict(
            page=page_num,
            has_next=page.has_next(),
            has_previous=page.has_previous(),
            results=serializer.data
        ))

    def retrieve(self, request, pk=None):
        queryset = Expense.objects.all()
        expense = get_object_or_404(queryset, pk=pk)
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)
