# encoding:utf-8
from enum import Enum, unique


@unique
class DbEnum(Enum):
    CMS = 0
    CRAWL = 1


if __name__ == '__main__':
    print(DbEnum(1))
