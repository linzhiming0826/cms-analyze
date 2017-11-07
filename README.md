嗨，大家好。这次跟大家分享一下一个通用的报表配置。可以极大的较少开发报表的时间，提高工作效率。

该组件基于bootstrap、echarts、datatables、django等。

如果大家需要加入自己的权限控制，可以参考我之前写的cms后台。
[点我](https://github.com/linzhiming0826/cms)

### 功能

    1.多个数据库切换查询。
    2.普通sql语句、存储过程。
    3.参数可为空。
    4.自定义查询参数控件。
    5.导出表格。
    6.图标与表格的列名参数自定义等。
    ....

### sql配置说明

    此配置最为简单。
    查询参数名字对应着查询控件中的id，以下查询展示配置中会进行说明。
    例子：
    1.存储过程
        CALL qyer_line_distribution(@condition1,@condition2,@condition3,@condition4)
    2.语句
        SELECT depart,destination,sales,pv,rate FROM stat_qyer_line WHERE date>=@condition1 AND date<=@condition2 {canEmpty} AND depart=@condition3 {endcanEmpty} {canEmpty} AND destination=@condition4 {endcanEmpty}  GROUP BY depart,destination ORDER BY sales DESC,pv DESC LIMIT @condition5
        如果参数允许为空，那么请在条件前后加个{canEmpty} {endcanEmpty}包含起来。当程序识别到对应的参数为空时，就会自动进行语句的删除以及参数的去除。


### 查询展示配置说明

    分成三部分，极大的保留了官网原来的配置名称与配置方法，不改动其原本，使用原生态的才是最好的。
    1.查询控件配置(params)
        目前支持三种控件：文本框、下拉框、时间框。
    2.表格参数配置(data)
        1.重命名列名。
        2.列名排序。
        未来将加入各种datatables官网拥有的各种配置，针对于个性化。
    3.图表参数配置(chart)
        1.x轴对应的列名 chart-x
            支持多个列名同时拼接，默认以-链接。
        2.y轴对应的列名（column）、描述（name）、y轴的左右侧（yAxisIndex）、类型：折线、柱状等（type）

    以下结合具体json配置进行说明
    {
    "params": [
        {
            "type": "3",//1.文本框 2.时间框 3.下拉框
            "id": "condition3",//id 对应着sql语句中的参数名称
            "value": "<option value=\"\">全部</option><option value=\"北京/天津\">北京/天津</option><option value=\"上海/杭州\">上海/杭州</option><option value=\"成都/重庆\">成都/重庆</option><option value=\"广州/深圳\">广州/深圳</option><option value=\"港澳台\">港澳台</option><option value=\"国内其他\">国内其他</option><option value=\"海外\">海外</option>",//文本框的值，支持html
            "desctription": "出发地："//控件说明、会出现在文本框前面
        },
        {
            "type": "1",
            "id": "condition4",
            "value": "三亚",
            "desctription": "目的地："
        },
        {
            "type": "2",
            "id": "condition1",
            "value": "",
            "desctription": "日期：",
            "offset": "-8" //偏移量，当类型为2时，此参数将拥有绝对的优先级。默认为与当前时间的偏差（天），可为正数负数
        },
        {
            "type": "2",
            "id": "condition2",
            "value": "",
            "desctription": "~",
            "offset": "-1"
        }
    ],
    "data": {
        "title": {
            "date": "日期",//数据中查询出的字段date因为映射成日期
            "depart": "出发地",
            "destination": "目的地",
            "sales": "销量",
            "pv": "pv",
            "rate": "比率"
        },
        "order": [ //优先以第二列倒序进行排序 [0,1,2,3] 'desc' or 'asc'
            [
                1,
                "desc"
            ]
        ]
    },
    "chart": {
        "x": {
            "column": [
                "date" //x轴的字段为date
            ]
        },
        "y": {
            "series": [
                {
                    "type": "bar",//为柱状图
                    "yAxisIndex": 0,//值表示在左侧y轴
                    "column": "sales",//对应字段名为column
                    "name": "销量" //描述为销量
                },
                {
                    "type": "bar",
                    "yAxisIndex": 0,
                    "column": "pv",
                    "name": "pv"
                },
                {
                    "type": "line",
                    "yAxisIndex": 1,
                    "column": "rate",
                    "name": "比率"
                }
            ]
        }
    }
}

### 部分功能截图

页面布局很后端程序员化，比较粗矿，但是简单好用。各位看官多多担待。

![](/img/0.png)
![](/img/1.png)
![](/img/2.png)
![](/img/3.png)

### 尾言

当你一直在重复的做一件事情的时候，你就会想办法去简化流程，提高效率。
这个就是程序的力量，可以让你有更多的时间做更重要的事情。
这个组件会一直更新升级，只要我还从事数据分析工作。
最后还是那句话，如果有任何问题与意见随时欢迎沟通与交流。


### 更新记录

2017.11.7 新增展示类型的配置选项（可以单独查看图表、数据、或者图表数据）

### THE END