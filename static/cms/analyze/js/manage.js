$(function() {
    initInfo();
    $('#txt-config').change(function() {
        var val = $('#txt-config').val();
        if (val) {
            try {
                json = JSON.parse(val);
            } catch (e) {
                alert('Error in parsing json. ' + e);
            }
        } else {
            json = {};
        }
        $('#editor').jsonEditor(json, {
            change: function(data) {
                $('#txt-config').val(JSON.stringify(data));
            }
        });
    });
});

var json = {};

//初始化信息
function initInfo(type) {
    //1.首先获取所有的名称
    //2.其次根据默认的名称获取相应的数据配置
    $.ajax({
        url: '/analyze/names',
        type: 'GET',
        timeout: 5000,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            var tpl = document.getElementById('tpl-user').innerHTML;
            if (data.result.length > 0) {
                var html = template.render(tpl, {
                    result: data.result
                });
                $("#sl-names").empty().append(html);
                //获取详细信息
                getInfo();
            }
        },
        error: function(xhr, textStatus) {
            //发生错误的回调函数
            console.log(textStatus)
        }
    })
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

//获取数据信息
function getInfo() {
    var id = $.trim($("#sl-names").val());
    if (id == undefined || id.length <= 0)
        return
    if (checkLock('btn-search'))
        return
    addLock('btn-search', '查询中');
    $.ajax({
        url: '/analyze/getInfo',
        type: 'GET',
        timeout: 5000,
        data: {
            id: id,
            i: Math.random()
        },
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            if (data.result) {
                result = data.result;
                $('#sl-database').val(result.database);
                $('#txt-name').val(result.name);
                $('#txt-query_sql').val(result.query_sql);
                json = JSON.parse(result.config);
                $('#editor').jsonEditor(json, {
                    change: function(data) {
                        $('#txt-config').val(JSON.stringify(data));
                    }
                });
                $('#txt-config').val(result.config);
            }
            removeLock('btn-search', '查询');
        },
        error: function(xhr, textStatus) {
            console.log(textStatus)
        }
    })
}

//新增或者保存配置信息
function handleInfo(type) {
    var database = $('#sl-database').val();
    var name = $('#txt-name').val();
    var query_sql = $('#txt-query_sql').val();
    var config = $('#txt-config').val();
    var id = $('#sl-names').val();
    if (type == 1)
        id = 0
    var btnId = type == 1 ? "btn-add" : "btn-save";
    var btnActionText = type == 1 ? "新增中" : "保存中";
    var btnCommonText = type == 1 ? "新增" : "保存";
    if (checkLock(btnId))
        return
    addLock(btnId, btnActionText);
    $.ajax({
        url: '/analyze/handleInfo',
        type: 'post',
        timeout: 5000,
        data: {
            id: id,
            database: database,
            name: encodeURI(name),
            query_sql: encodeURI(query_sql),
            config: encodeURI(config),
            i: Math.random()
        },
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            if (data.code == 1) {
                type == 1 ? initInfo() : getInfo();
                removeLock(btnId, btnCommonText);
            }
        },
        error: function(xhr, textStatus) {
            console.log(textStatus)
        }
    })
}

//删除信息
function delInfo() {
    var id = $('#sl-names').val();
    if (confirm('确定要删除嘛')) {
        if (checkLock('btn-delete'))
            return
        addLock('btn-delete', '删除中');
        $.ajax({
            url: '/analyze/delInfo',
            type: 'get',
            timeout: 5000,
            data: {
                id: id,
                i: Math.random()
            },
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if (data.code == 1) {
                    initInfo();
                    removeLock('btn-delete', '删除');
                }
            },
            error: function(xhr, textStatus) {
                console.log(textStatus)
            }
        })
    }
}

//查看结果
function searchResult() {
    var id = $('#sl-names').val();
    window.open('/analyze/show?id=' + id);
}