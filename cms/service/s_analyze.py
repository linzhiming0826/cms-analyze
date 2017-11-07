# encoding:utf-8
import re
import demjson
import urllib
from cms.common.mysql_dbs import Dbs
from cms.enums.db import DbEnum
from cms.common.util import Util


class SAnalyze:
    @classmethod
    def get_names(self):
        '''
        获取所有的配置名称
        '''
        sql = 'select id,name from analyze_config where status>-1'
        return Dbs.get_cms().query(sql)

    @classmethod
    def get_info(self, id):
        '''
        根据id获取信息
        '''
        if id > 0:
            sql = 'select name,`database`,query_sql,config,view_type from analyze_config where status>-1 and id=%s'
            result = Dbs.get_cms().query(sql, id)
            if result:
                return result[0]

    @classmethod
    def _is_exist(self, name):
        '''
        获取该查询是否存在
        '''
        sql = 'select id from analyze_config where status>-1 and name=%s'
        result = Dbs.get_cms().get(sql, name)
        return True if result and result['id'] else False

    @classmethod
    def _add_data(self, data):
        '''
        新增数据
        '''
        if self._is_exist(data['name']):
            return
        sql = 'insert into analyze_config(name,`database`,query_sql,config,view_type) values(%s,%s,%s,%s,%s)'
        Dbs.get_cms().execute(sql, data['name'], data['database'],
                              data['query_sql'], data['config'],
                              data['view_type'])

    @classmethod
    def _update_data(self, data):
        '''
        更新数据
        '''
        sql = 'update analyze_config set name=%s,`database`=%s,query_sql=%s,config=%s,view_type=%s where id=%s'
        Dbs.get_cms().execute(sql, data['name'], data['database'],
                              data['query_sql'], data['config'],
                              data['view_type'], data['id'])

    @classmethod
    def handle_info(self, data):
        '''
        新增或者删除数据
        '''
        data['name'] = urllib.unquote(data['name'].encode('utf-8'))
        data['query_sql'] = urllib.unquote(data['query_sql'].encode('utf-8'))
        data['config'] = urllib.unquote(
            data['config'].encode('utf-8')).replace('\n', '').replace('\t', '')
        self._update_data(data) if int(
            data['id']) > 0 else self._add_data(data)

    @classmethod
    def del_info(self, id):
        '''
        删除数据
        '''
        sql = 'update analyze_config set status=-1 where id=%s'
        Dbs.get_cms().execute(sql, id)

    @classmethod
    def get_json_info(self, id):
        '''
        根据id获取信息
        '''
        info = self.get_info(id)
        if info:
            info['config'] = demjson.decode(info['config'])
        return info

    @classmethod
    def _get_can_empty_params(self, query_sql):
        '''
        根据sql获取可空参数list
        '''
        pattern = re.compile(r'{canEmpty}(.*?){endcanEmpty}', re.S)
        return re.findall(pattern, query_sql)

    @classmethod
    def _handle_sql_and_params(self, query_sql, dic):
        '''
        处理sql语句，替换可空的参数（如果参数真的为空）
        '''
        can_empty_params = self._get_can_empty_params(query_sql)
        for key, value in dic.items():
            param_config = '@' + key
            for can_empty_param in can_empty_params:
                if not value and param_config in can_empty_param:
                    # 值为空则进行屏蔽
                    query_sql = query_sql.replace(can_empty_param, '')
                    # 删除参数化的值
                    dic.pop(key)
            # 如果是数字转成int
            if Util.is_num(value):
                dic[key] = int(value)
            # 将参数进行参数化
            query_sql = query_sql.replace(param_config, '%s')
        # 去除可空参数配置
        query_sql = query_sql.replace('{canEmpty}', '').replace(
            '{endcanEmpty}', '')
        keys = sorted(dic)
        params = [dic[x] for x in keys if x != 'search_id']
        return query_sql, params

    @classmethod
    def get_data(self, dic):
        '''
        获取数据
        '''
        id = dic.get('search_id', 0)
        info = self.get_info(id)
        if info:
            database = DbEnum(int(info['database']))
            query_sql, params = self._handle_sql_and_params(info['query_sql'],
                                                            dic)
            data = Dbs.get(database).query(query_sql, *params)
            config = demjson.decode(info['config'])
            return {"data": data, "config": config}
