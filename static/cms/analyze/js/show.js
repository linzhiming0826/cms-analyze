var id = request('id');
$(function() {
    //初始化日期输入框
    initDateInput();
    //初始化数据
    initData();
});

//初始化数据
function initData() {
    if (checkLock('btn-search'))
        return
    addLock('btn-search', '查询中');
    $.ajax({
        url: "/analyze/getDtata?" + getParams(),
        type: 'GET',
        timeout: 5000,
        dataType: 'json',
        success: function(result, textStatus, jqXHR) {
            if (result) {
                $("#source-data").val(JSON.stringify(result.data));
                $("#source-config").val(JSON.stringify(result.config));
            } else {
                $("#source-data").val('[]');
                $("#source-config").val('{}');
            }
            //初始化图表
            initChart();
            //初始化表格
            initTable();
            removeLock('btn-search', '查询');
        },
        error: function(xhr, textStatus) {
            console.log(textStatus)
        }
    })
}
//获取url上面的参数
function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (var i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}

//时间的加减
function addDays(days) {
    var nDate = new Date();
    var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
    var rDate = new Date(millSeconds);
    var year = rDate.getFullYear();
    var month = rDate.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = rDate.getDate();
    if (date < 10) date = "0" + date;
    return (year + "-" + month + "-" + date);
}

//设置文本输入框
function initDateInput() {
    //1.查找需要改变的时间id
    //2.检查是否动态配置时间
    //3.进行时间控件的设置
    var ids = params.split('|');
    for (var i = 0; i < ids.length; i++) {
        if (ids[i].length > 0) {
            var offset = $('#' + ids[i]).attr('data-offset');
            if (offset != undefined && offset.length > 0) {
                var value = addDays(offset);
                $('#' + ids[i]).val(value);
            }
            $('#' + ids[i]).datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                language: 'zh-CN',
                minView: 2
            });
        }
    }
}

//注册搜索事件
$('#btn-search').click(function() {
    initData();
});

//获取请求参数
function getParams() {
    var params = ['search_id=' + id]
    $('#my-form').children('input,select,textarea').each(function() {
        _id = $(this).attr('id');
        value = $(this).val();
        params.push(_id + "=" + value);
    });
    return params.join('&');
}

//获取纵坐标数组
function getChartLengend(series) {
    var legend = new Array();
    for (var i = 0; i < series.length; i++) {
        legend.push(series[i].name);
    }
    return legend;
}

//获取横坐标数组
function getChartXAxisDatad(column, data) {
    var xAxisData = new Array();
    for (var i = 0; i < data.length; i++) {
        var value = new Array();
        for (var j = 0; j < column.length; j++) {
            for (key in data[i]) {
                if (key == column[j]) {
                    value.push(data[i][key]);
                }
            }
        }
        if (value.length > 0) {
            xAxisData.push(value.join('-'));
        }
    }
    return xAxisData;
}

//获取纵坐标顺序
function getChartYSeries(ySeries, data) {
    var series = new Array();
    for (var i = 0; i < ySeries.length; i++) {
        var serieData = new Array();
        for (var j = 0; j < data.length; j++) {
            for (key in data[j]) {
                if (key == ySeries[i].column) {
                    serieData.push(data[j][key]);
                }
            }
        }
        series.push({
            'name': ySeries[i].name,
            'type': ySeries[i].type,
            'data': serieData,
            'yAxisIndex': ySeries[i].yAxisIndex,
            'markPoint': {
                'data': [{
                    'type': 'max',
                    'name': '最大值'
                }, {
                    'type': 'min',
                    'name': '最小值'
                }]
            },
            'markLine': {
                'data': [{
                    'type': 'average',
                    'name': '平均值'
                }]
            }
        });
    }
    return series;
}

//获取图表配置
function getChartData() {
    var data = $('#source-data').val();
    data = JSON.parse(data);
    var config = $('#source-config').val();
    config = JSON.parse(config);
    chartConfig = config.chart;
    if (config.chart != undefined) {
        //获取纵坐标数组
        var legend = getChartLengend(config.chart.y.series);
        //获取横坐标数据
        var xAxisData = getChartXAxisDatad(config.chart.x.column, data);
        //获取纵坐标顺序
        var series = getChartYSeries(config.chart.y.series, data);
        return {
            "legend": legend,
            "xAxisData": xAxisData,
            "series": series
        }
    }
    return {
        "legend": [],
        "xAxisData": [],
        "series": []
    }
}
//获取图表配置
function initChart() {
    data = getChartData();
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
        title: {
            text: '',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: data.legend
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['line', 'bar', 'stack', 'tiled']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: data.xAxisData,
            triggerEvent: true
        }],
        yAxis: [{
            type: 'value',
            position: 'left'
        }, {
            type: 'value',
            position: 'right'
        }],
        series: data.series
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//去除字典中的key
function removeKey(data) {
    var result = new Array();
    for (var i = 0; i < data.length; i++) {
        var r = new Array();
        for (key in data[i]) {
            r.push(data[i][key]);
        }
        result.push(r);
    }
    return result;
}

//获取表格数据
function getTableData() {
    var data = $('#source-data').val();
    return removeKey(JSON.parse(data));
}

//获取表格的表头
function getTableHead() {
    var data = $('#source-data').val();
    data = JSON.parse(data);
    var config = $('#source-config').val();
    config = JSON.parse(config);
    if (data.length > 0) {
        var status = config.data.title != undefined
        var result = '';
        for (key in data[0]) {
            if (status && config.data.title.hasOwnProperty(key)) {
                result += "<th>" + config.data.title[key] + "</th>"
            } else {
                result += "<th>" + data[0][key] + "</th>"
            }
        }
        return result;
    }
    return '';
}

//获取表格排序
function getOrderConfig() {
    var data = $('#source-data').val();
    data = JSON.parse(data);
    var config = $('#source-config').val();
    config = JSON.parse(config);
    return data.length > 0 ? config.data.order : [];
}

//展示方式（表格）
function initTable() {
    //1.渲染表头
    //2.渲染数据部分
    var headHtml = getTableHead();
    $('#my-table-thead').html(headHtml);
    var data = getTableData();
    if ($.fn.DataTable.isDataTable("#my-table")) {
        $('#my-table').DataTable().clear().destroy();
    }
    if (data.length <= 0)
        return
    var order = getOrderConfig();
    $('#my-table').DataTable({
        dom: 'Bfrtip',
        buttons: [{
            extend: 'excelHtml5',
            text: '导出',
            title: title, //导出的excel标题
            className: 'btn btn-primary', //按钮的class样式
            charset: 'UTF-8'
        }],
        paging: false,
        info: false,
        searching: false,
        autoWidth: false,
        data: data,
        order: order
    });
}

//检测合法性
function checkLock(id) {
    if ($("#" + id).hasClass('disabled')) {
        alert('正在操作请稍后');
        return true;
    }
    return false;
}

//加锁
function addLock(id, text) {
    $("#" + id).addClass('disabled');
    $("#" + id).html(text);
}

//移除锁
function removeLock(id, text) {
    $("#" + id).removeClass('disabled');
    $("#" + id).html(text);
}