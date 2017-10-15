# encoding:utf-8
import json
from django.shortcuts import render
from django.http import HttpResponse
from cms.service.s_analyze import SAnalyze
from cms.common.json_encoder import CJsonEncoder


def manage(request):
    '''
    分析页面
    '''
    return render(request, 'analyze/manage.html')


def names(request):
    '''
    获取所有的配置名称
    '''
    result = json.dumps({'result': SAnalyze.get_names()})
    return HttpResponse(result, content_type="application/json")


def get_info(request):
    '''
    获取配置
    '''
    id = request.GET.get('id', 0)
    result = json.dumps({'result': SAnalyze.get_info(id)})
    return HttpResponse(result, content_type="application/json")


def handle_info(request):
    '''
    处理数据
    '''
    SAnalyze.handle_info(request.POST.copy())
    result = json.dumps({'code': 1, 'message': 'success'})
    return HttpResponse(result, content_type="application/json")


def del_info(request):
    '''
    删除数据
    '''
    id = request.GET.get('id', 0)
    SAnalyze.del_info(id)
    result = json.dumps({'code': 1, 'message': 'success'})
    return HttpResponse(result, content_type="application/json")


def show(request):
    '''
    列表展示页面
    '''
    id = request.GET.get('id', 0)
    info = SAnalyze.get_json_info(id)
    return render(request, 'analyze/show.html', info)


def get_data(request):
    '''
    获取表报数据
    '''
    params = request.GET.copy()
    result = SAnalyze.get_data(params)
    return HttpResponse(
        json.dumps(result, cls=CJsonEncoder, sort_keys=False),
        content_type="application/json")
