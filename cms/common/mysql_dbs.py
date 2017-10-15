# encoding:utf-8
from mysql_core import MySQLCore
from cms.enums.db import DbEnum


# 获取数据库链接方法
class Dbs:
    @classmethod
    def get_cms(self):
        '''
        获取cms数据库
        '''
        return MySQLCore(
            host="127.0.0.1",
            database="cms",
            user="root",
            password="123456")

    @classmethod
    def get_crawl(self):
        '''
        获取爬虫数据库
        '''
        return MySQLCore(
            host="127.0.0.1",
            database="crawl",
            user="root",
            password="123456")

    @classmethod
    def get(self, enum):
        if enum == DbEnum.CMS:
            return self.get_cms()
        elif enum == DbEnum.CRAWL:
            return self.get_crawl()


if __name__ == '__main__':
    Dbs.get_cms()
