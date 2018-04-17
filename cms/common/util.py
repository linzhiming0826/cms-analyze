# encoding:utf-8


class Util:
    @classmethod
    def is_num(self, content):
        '''
        是否为数字(不包含正负数符号)
        '''
        try:
            int(content)
            return True
        except:
            return False

    @classmethod
    def get_num(self, content):
        '''
        将字符串转成数字
        '''
        try:
            return int(content)
        except:
            return 0


if __name__ == '__main__':
    print(Util.get_num('-100'))
