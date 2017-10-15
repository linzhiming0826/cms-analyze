# encoding:utf-8
from django.shortcuts import render


def test(request):
    '''
    分析页面
    '''
    return render(request, 'test.html')