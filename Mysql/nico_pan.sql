/*
 Navicat Premium Data Transfer

 Source Server         : 101.37.18.151
 Source Server Type    : MySQL
 Source Server Version : 50729
 Source Host           : 101.37.18.151:3306
 Source Schema         : nico_pan

 Target Server Type    : MySQL
 Target Server Version : 50729
 File Encoding         : 65001

 Date: 16/03/2020 22:29:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `filename` varchar(100) NOT NULL COMMENT '文件名',
  `path` varchar(100) NOT NULL COMMENT '路径',
  `category` varchar(15) NOT NULL COMMENT '分类',
  `size` double NOT NULL COMMENT '大小',
  `father` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for folder
-- ----------------------------
DROP TABLE IF EXISTS `folder`;
CREATE TABLE `folder` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `foldername` varchar(255) DEFAULT NULL,
  `children` varchar(255) DEFAULT NULL,
  `categary` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(15) NOT NULL,
  `password` varchar(15) NOT NULL,
  `logintime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, 'nico', '19990722', '2020-03-16 20:32:14');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
