from django.shortcuts import render
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
# Create your views here.

class TaskViewSet(viewsets.ModelViewSet):
    # this tell the view which data to fetch
    queryset = Task.objects.all()

    # this tells the view which translator to use
    serializer_class = TaskSerializer