from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.response import Response

from core.models import Transaction, Category
from core.serializers import TransactionSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    model = Category
    serializer = CategorySerializer


class TransactionViewSet(viewsets.ViewSet):
    model = Transaction
    paginate_by = 20
    serializer = TransactionSerializer

    def get_all_transactions(self, request):
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

    def get_transactions_by_date(self, request):
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

    def post(self, request):
        action = request.DATA.get('action')
        if action == 'ignore':
            ids = request.DATA.get('ids')
            for transaction_id in ids:
                transaction = self.model.objects.get(id=transaction_id)
                transaction.ignored = True
                transaction.save()
        elif action == 'unignore':
            ids = request.DATA.get('ids')
            for transaction_id in ids:
                transaction = self.model.objects.get(id=transaction_id)
                transaction.ignored = False
                transaction.save()
        elif action == 'categorise':
            ids = request.DATA.get('ids')
            categories = request.DATA.get('categories')

            for transaction_id in ids:
                transaction = Transaction.objects.get(id=transaction_id)
                for category_id in categories:
                    category = Category.objects.get(id=category_id)
                    transaction.category.add(category)
                transaction.save()
        return Response()

    def list(self, request):
        if 'date' in request.GET:
            response_data = self.get_transactions_by_date(request)
        else:
            response_data = self.get_all_transactions(request)

        return Response(response_data)

    def retrieve(self, request, pk=None):
        queryset = self.model.objects.all()
        transaction = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer(transaction)
        return Response(serializer.data)
