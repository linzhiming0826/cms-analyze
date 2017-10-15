/*
Navicat MySQL Data Transfer

Source Server         : 10.1.26.114
Source Server Version : 50718
Source Host           : 10.1.26.114:3306
Source Database       : cms

Target Server Type    : MYSQL
Target Server Version : 50718
File Encoding         : 65001

Date: 2017-10-15 09:19:36
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for analyze_config
-- ----------------------------
DROP TABLE IF EXISTS `analyze_config`;
CREATE TABLE `analyze_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL DEFAULT '' COMMENT '名字',
  `database` tinyint(4) NOT NULL DEFAULT '1' COMMENT '数据库的类型 0.cms 1.crawl',
  `query_sql` text NOT NULL COMMENT 'sql语句',
  `config` text NOT NULL COMMENT '所有的配置选项',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '是否有效 1.有效 -1无效',
  `insert_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '插入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
