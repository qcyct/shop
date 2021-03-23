/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50529
Source Host           : localhost:3306
Source Database       : shop

Target Server Type    : MYSQL
Target Server Version : 50529
File Encoding         : 65001

Date: 2020-02-18 14:45:36
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `activityimg`
-- ----------------------------
DROP TABLE IF EXISTS `activityimg`;
CREATE TABLE `activityimg` (
  `activityimgId` int(11) NOT NULL AUTO_INCREMENT,
  `activityimgurl` varchar(255) DEFAULT NULL,
  `activityimgtype` enum('3','2','1') DEFAULT NULL COMMENT '1-主页轮播图 2-今日秒杀轮播图 3-今日热销轮播图',
  `activityimgpageurl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`activityimgId`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of activityimg
-- ----------------------------
INSERT INTO `activityimg` VALUES ('1', 'http://127.0.0.1:3000/public/img/admin/activityimg/1574222669700-shop_11.jpg', '1', null);
INSERT INTO `activityimg` VALUES ('2', 'http://pic22.nipic.com/20120707/7810793_141450383167_2.jpg', '3', '/page/index/index');
INSERT INTO `activityimg` VALUES ('4', 'http://pic22.nipic.com/20120707/7810793_141450383167_2.jpg', '2', null);
INSERT INTO `activityimg` VALUES ('5', 'http://pic22.nipic.com/20120707/7810793_141450383167_2.jpg', '3', null);
INSERT INTO `activityimg` VALUES ('6', 'http://127.0.0.1:3000/public/img/admin/activityimg/1574223960395-shop_09.jpg', '1', '');
INSERT INTO `activityimg` VALUES ('7', 'http://127.0.0.1:3000/public/img/admin/activityimg/1574224115908-shop_18.jpg', '1', '');
INSERT INTO `activityimg` VALUES ('8', 'http://127.0.0.1:3000/public/img/admin/activityimg/1574863775569-shop_11.jpg', '1', '');
INSERT INTO `activityimg` VALUES ('9', 'http://127.0.0.1:3000/public/img/admin/activityimg/1575464944797-shop_01.jpg', '1', '');

-- ----------------------------
-- Table structure for `address`
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `addressId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `addressName` varchar(255) DEFAULT NULL,
  `addresstel` varchar(255) DEFAULT NULL,
  `isDefault` tinyint(4) DEFAULT '0',
  `detailed` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`addressId`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES ('1', '27', '张三2', '15656441999', '0', '深南大道1111号无名摩登大厦6楼A2', '{\"label\":\"贵州省-六盘水市-钟山区\",\"value\":[23,1,0],\"cityCode\":\"520201\"}');
INSERT INTO `address` VALUES ('2', '27', '李白', '1', '0', '11', '{\"label\":\"北京市-市辖区-西城区\",\"value\":[0,0,1],\"cityCode\":\"110102\"}');
INSERT INTO `address` VALUES ('3', '27', '11', '12', '0', '333', '{\"label\":\"北京市-市辖区-西城区\",\"value\":[0,0,1],\"cityCode\":\"110102\"}');
INSERT INTO `address` VALUES ('6', '27', '11', '121', '0', '2131', '{\"label\":\"北京市-市辖区-朝阳区\",\"value\":[0,0,2],\"cityCode\":\"110105\"}');
INSERT INTO `address` VALUES ('8', '27', '杜甫', '11221555', '1', '撒打算', '{\"label\":\"安徽省-合肥市-瑶海区\",\"value\":[11,0,0],\"cityCode\":\"340102\"}');

-- ----------------------------
-- Table structure for `admin`
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `sex` varchar(255) DEFAULT '女',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('1', 'admin', 'admin', 'http://127.0.0.1:3000/public/img/admin/admin/1574066745113-shop_19.jpg', '男');
INSERT INTO `admin` VALUES ('3', '1', '1', 'http://127.0.0.1:3000/public/img/admin/admin/1574072096333-shop_11.jpg', '男');
INSERT INTO `admin` VALUES ('4', 'admin', 'admin1', 'http://127.0.0.1:3000/public/img/admin/admin/1575025613767-shop_12.jpg', '男');

-- ----------------------------
-- Table structure for `category`
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `categoryId` int(11) NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`categoryId`),
  UNIQUE KEY `categoryName` (`categoryName`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('1', '运动鞋');
INSERT INTO `category` VALUES ('2', '布鞋');
INSERT INTO `category` VALUES ('4', '帆布鞋');
INSERT INTO `category` VALUES ('31', '皮鞋');
INSERT INTO `category` VALUES ('33', '凉鞋');
INSERT INTO `category` VALUES ('36', '哈哈');
INSERT INTO `category` VALUES ('37', '测试');

-- ----------------------------
-- Table structure for `categoryinfo`
-- ----------------------------
DROP TABLE IF EXISTS `categoryinfo`;
CREATE TABLE `categoryinfo` (
  `categoryinfoId` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) NOT NULL,
  `categoryinfoName` varchar(255) DEFAULT NULL,
  `categoryinfoUrl` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`categoryinfoId`),
  UNIQUE KEY `categoryinfoName` (`categoryinfoName`,`categoryId`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of categoryinfo
-- ----------------------------
INSERT INTO `categoryinfo` VALUES ('10', '1', '大码', 'http://127.0.0.1:3000/public/img/admin/category/1575028568980-shop_03.jpg');
INSERT INTO `categoryinfo` VALUES ('11', '1', '小码', 'http://127.0.0.1:3000/public/img/admin/category/1575028568980-shop_03.jpg');
INSERT INTO `categoryinfo` VALUES ('15', '36', '你好', 'http://127.0.0.1:3000/public/img/admin/category/1575028568980-shop_03.jpg');
INSERT INTO `categoryinfo` VALUES ('16', '36', '你好1', 'http://127.0.0.1:3000/public/img/admin/category/1575028568980-shop_03.jpg');
INSERT INTO `categoryinfo` VALUES ('17', '1', '测试', 'http://127.0.0.1:3000/public/img/admin/category/1575465055473-shop_01.jpg');

-- ----------------------------
-- Table structure for `coupon`
-- ----------------------------
DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon` (
  `couponId` int(11) NOT NULL AUTO_INCREMENT,
  `goodsId` int(11) DEFAULT NULL,
  `salerId` int(11) DEFAULT NULL,
  `couponMon` int(11) DEFAULT NULL,
  `couponMin` int(255) DEFAULT NULL,
  `startTime` date DEFAULT NULL,
  `endTime` date DEFAULT NULL,
  PRIMARY KEY (`couponId`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of coupon
-- ----------------------------
INSERT INTO `coupon` VALUES ('48', '19', '1', '10', '10', '2019-12-02', '2019-12-26');

-- ----------------------------
-- Table structure for `flash`
-- ----------------------------
DROP TABLE IF EXISTS `flash`;
CREATE TABLE `flash` (
  `flashId` int(11) NOT NULL AUTO_INCREMENT,
  `goodsId` int(11) NOT NULL,
  `salerId` int(11) NOT NULL,
  `flashtime` time DEFAULT NULL,
  `flashNum` int(11) DEFAULT NULL,
  `flashMon` int(11) DEFAULT NULL,
  `flashPayNum` int(11) DEFAULT '0',
  PRIMARY KEY (`flashId`),
  UNIQUE KEY `goodsId` (`goodsId`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of flash
-- ----------------------------
INSERT INTO `flash` VALUES ('2', '11', '1', '17:00:00', '202', '20', '0');
INSERT INTO `flash` VALUES ('3', '1', '1', '15:00:00', '20', '20', '0');
INSERT INTO `flash` VALUES ('4', '2', '1', '22:00:00', '202', '20', '0');
INSERT INTO `flash` VALUES ('7', '10', '1', '19:00:00', '20', '20', '0');
INSERT INTO `flash` VALUES ('9', '4', '1', '21:00:00', '11', '11', '0');
INSERT INTO `flash` VALUES ('10', '6', '1', '19:00:00', '20', '20', '0');
INSERT INTO `flash` VALUES ('12', '5', '1', '15:15:35', '202', '20', '0');

-- ----------------------------
-- Table structure for `goods`
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `goodsId` int(11) NOT NULL AUTO_INCREMENT,
  `goodsName` varchar(255) DEFAULT NULL,
  `goodsSale` varchar(255) DEFAULT NULL,
  `goodsFactory` varchar(255) DEFAULT NULL,
  `goodsPayNum` int(11) DEFAULT '0',
  `goodsImg` varchar(255) DEFAULT NULL,
  `goodImgList` varchar(10000) DEFAULT NULL,
  `salerId` int(11) DEFAULT NULL,
  `goodsType` varchar(255) DEFAULT NULL,
  `goodsTypeTwo` varchar(255) DEFAULT NULL,
  `goodsNum` int(11) DEFAULT NULL,
  `goodsTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `goodsNumber` varchar(255) DEFAULT '[]',
  PRIMARY KEY (`goodsId`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('18', '下一页', '23', '3', '17', 'http://127.0.0.1:3000/public/img/admin/goods/1575025734377-shop_18.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1575025734377-shop_18.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1575025734378-shop_19.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1575465023573-shop_01.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1575465023574-shop_02.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1575465023574-shop_03.jpg\"]', '15', '运动鞋', '大码', '121', '2020-02-17 22:48:55', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('19', '11', '2', '212', '26', 'http://127.0.0.1:3000/public/img/admin/goods/1575028644617-shop_09.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1575028644617-shop_09.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1575028644618-shop_10.jpg\"]', '1', '哈哈', '你好1', '118', '2020-02-17 22:44:17', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('1', '11', '11', '11', '6', 'http://127.0.0.1:3000/public/img/admin/1574512867706-shop_18.jpg', '[\"http://127.0.0.1:3000/public/img/admin/1574512867706-shop_18.jpg\",\"http://127.0.0.1:3000/public/img/admin/1574512867708-shop_19.jpg\"]', '1', '运动鞋', '小码', '11', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('2', '德国DMK进口牛奶  欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒', '29', '69', '7', 'https://www.thorui.cn/img/product/11.jpg', '[\"https://www.thorui.cn/img/product/11.jpg\",\"https://www.thorui.cn/img/product/2.png\",\"https://www.thorui.cn/img/product/33.jpg\",\"https://www.thorui.cn/img/product/4.png\",\"https://www.thorui.cn/img/product/55.jpg\",\"https://www.thorui.cn/img/product/6.png\",\"https://www.thorui.cn/img/product/7.jpg\"]', '1', '布鞋', '大码', '100', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('16', 'ss', '12', '12', '1', 'http://127.0.0.1:3000/public/img/admin/goods/1575025672559-shop_12.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1575025672559-shop_12.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1575025672560-shop_11.jpg\"]', '12', '运动鞋', '大码', '121', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('17', 'sssss', '111', '111', '15', 'http://127.0.0.1:3000/public/img/admin/goods/1575025708417-shop_01.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1575025708417-shop_01.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1575025708417-shop_02.jpg\"]', '11', '运动鞋', '大码', '121', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('4', '百雀羚套装女补水保湿护肤品', '1599', '2899', '36', 'https://www.thorui.cn/img/product/11.jpg', '[\"https://www.thorui.cn/img/product/11.jpg\",\"https://www.thorui.cn/img/product/2.png\",\"https://www.thorui.cn/img/product/33.jpg\",\"https://www.thorui.cn/img/product/4.png\",\"https://www.thorui.cn/img/product/55.jpg\",\"https://www.thorui.cn/img/product/6.png\",\"https://www.thorui.cn/img/product/7.jpg\"]', '1', '布鞋', '大码', '100', '2020-02-18 14:38:07', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('5', '百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋', '599', '899', '8', 'https://www.thorui.cn/img/product/11.jpg', '[\"https://www.thorui.cn/img/product/11.jpg\",\"https://www.thorui.cn/img/product/2.png\",\"https://www.thorui.cn/img/product/33.jpg\",\"https://www.thorui.cn/img/product/4.png\",\"https://www.thorui.cn/img/product/55.jpg\",\"https://www.thorui.cn/img/product/6.png\",\"https://www.thorui.cn/img/product/7.jpg\"]', '1', '布鞋', '小码', '100', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('6', '短袖睡衣女夏季薄款休闲家居服短裤套装女可爱韩版清新学生两件套 短袖粉色长颈鹿 M码75-95斤', '599', '899', '2', 'https://www.thorui.cn/img/product/6.png', '[\"https://www.thorui.cn/img/product/6.png\",\"https://www.thorui.cn/img/product/7.jpg\",\"https://www.thorui.cn/img/product/8.jpg\"]', '1', '布鞋', '小码', '100', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('10', '红烧牛肉面', '47', '15', '5', 'http://127.0.0.1:3000/public/img/admin/1574507476598-shop_11.jpg', '[\"http://127.0.0.1:3000/public/img/admin/1574507476598-shop_11.jpg\",\"http://127.0.0.1:3000/public/img/admin/1574507476598-shop_12.jpg\"]', '1', '运动鞋', '大码', '100', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('13', '123', '1', '15', '4', 'http://127.0.0.1:3000/public/img/admin/goods/1574258646832-QQ图片20191009222016.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1574258646832-QQ图片20191009222016.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1574258689566-shop_03.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1574258689569-shop_04.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1574258689570-shop_06.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1574258689571-shop_12.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1574258689571-shop_13.jpg\"]', '15', '运动鞋', '大码', '11', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('14', '112', '12', '212', '25', 'http://127.0.0.1:3000/public/img/admin/goods/1574512764683-shop_08.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1574512764683-shop_08.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1574512764684-shop_09.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1574512764684-shop_10.jpg\"]', '15', '运动鞋', '大码', '121', '2020-02-17 16:55:48', '[]');
INSERT INTO `goods` VALUES ('20', '11', '11', '212', '0', 'http://127.0.0.1:3000/public/img/admin/goods/1581864111736-img4.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1581864111736-img4.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1581864111740-img5.jpg\"]', '11', '运动鞋', '小码', '121', '2020-02-16 22:58:22', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('21', '11', '33', '44', '0', 'http://127.0.0.1:3000/public/img/admin/goods/1581865658266-img5.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1581865658266-img5.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1581865658267-img6.jpg\"]', '55', '运动鞋', '大码', '22', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('22', '11', '2', '3', '0', 'http://127.0.0.1:3000/public/img/admin/goods/1581865684783-img4.jpg', '[\"http://127.0.0.1:3000/public/img/admin/goods/1581865684783-img4.jpg\",\"http://127.0.0.1:3000/public/img/admin/goods/1581865684794-img5.jpg\"]', '4', '运动鞋', '大码', '22', '2020-02-17 16:43:37', '[\"22\",\"11\",\"33\"]');
INSERT INTO `goods` VALUES ('23', '11', '2', '22', '0', 'http://127.0.0.1:3000/public/img/admin/1581867147421-img4.jpg', '[\"http://127.0.0.1:3000/public/img/admin/1581867147421-img4.jpg\",\"http://127.0.0.1:3000/public/img/admin/1581867147426-img5.jpg\"]', '1', '运动鞋', '大码', '11', '2020-02-16 23:32:36', '[\"22\",\"11\",\"33\"]');

-- ----------------------------
-- Table structure for `isusing`
-- ----------------------------
DROP TABLE IF EXISTS `isusing`;
CREATE TABLE `isusing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salerIsusing` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of isusing
-- ----------------------------
INSERT INTO `isusing` VALUES ('1', '使用中');
INSERT INTO `isusing` VALUES ('2', '已停用');

-- ----------------------------
-- Table structure for `orders`
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `content` mediumtext,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `money` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `type` enum('unpaid','back','unreceived','received') DEFAULT 'unreceived',
  PRIMARY KEY (`orderId`)
) ENGINE=MyISAM AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES ('4', '27', '[{\"goodsId\":1,\"goodsName\":\"欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）\",\"count\":1,\"money\":5207,\"goodsNumber\":\"22\",\"salerId\":1,\"isDeliver\":1}]', '2019-11-18 21:54:35', '3593', '甘肃省 金昌市 永昌县', 'unreceived');
INSERT INTO `orders` VALUES ('3', '27', '[{\"goodsId\":1,\"goodsName\":\"欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）\",\"count\":1,\"money\":5207,\"salerId\":1,\"isDeliver\":1}]', '2019-11-19 21:54:38', '5207', '广东省 珠海市 ', 'unreceived');
INSERT INTO `orders` VALUES ('8', '27', '[{\"goodsId\":10,\"goodsName\":\"红烧牛肉面\",\"count\":1,\"money\":45,\"salerId\":1,\"isDeliver\":1}]', '2019-11-20 21:54:42', '45', '', 'unreceived');
INSERT INTO `orders` VALUES ('9', '27', '[{\"goodsId\":10,\"goodsName\":\"红烧牛肉面\",\"count\":1,\"money\":45,\"salerId\":1,\"isDeliver\":1},{\"goodsId\":5,\"goodsName\":\"百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋\",\"count\":1,\"money\":599,\"salerId\":1,\"isDeliver\":1}]', '2019-11-29 21:54:45', '644', '', 'unreceived');
INSERT INTO `orders` VALUES ('10', '27', '[{\"goodsId\":5,\"goodsName\":\"百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋\",\"count\":1,\"money\":599,\"salerId\":1,\"isDeliver\":1}]', '2019-11-29 21:54:48', '599', '', 'unreceived');
INSERT INTO `orders` VALUES ('5', '27', '[{\"goodsId\":1,\"goodsName\":\"欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）\",\"count\":1,\"money\":599,\"salerId\":1}]', '2019-11-23 21:54:51', '599', '', 'unreceived');
INSERT INTO `orders` VALUES ('7', '27', '[{\"goodsId\":1,\"goodsName\":\"欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）\",\"count\":1,\"money\":600,\"salerId\":1}]', '2019-11-30 21:54:56', '600', '', 'unreceived');
INSERT INTO `orders` VALUES ('6', '27', '[{\"goodsId\":1,\"goodsName\":\"欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）\",\"count\":1,\"money\":599,\"salerId\":1}]', '2019-11-21 21:55:01', '599', '', 'unreceived');
INSERT INTO `orders` VALUES ('11', '27', '[{\"goodsId\":5,\"goodsName\":\"百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋\",\"count\":1,\"money\":599,\"salerId\":1}]', '2019-11-21 15:12:14', '644', null, 'unreceived');
INSERT INTO `orders` VALUES ('24', '27', '[{\"goodsId\":2,\"goodsName\":\"德国DMK进口牛奶  欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒\",\"count\":4,\"money\":116,\"salerId\":1}]', '2019-12-03 21:21:33', '116', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('25', '27', '[{\"goodsId\":14,\"goodsName\":\"112\",\"count\":19,\"money\":228,\"salerId\":15}]', '2019-12-03 21:47:03', '228', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('26', '27', '[{\"goodsId\":19,\"goodsName\":\"11\",\"count\":1,\"money\":2,\"salerId\":1}]', '2019-12-03 21:47:52', '2', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('22', '27', '[{\"goodsId\":19,\"goodsName\":\"11\",\"count\":1,\"money\":2,\"salerId\":1}]', '2019-12-03 21:18:11', '2', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('23', '27', '[{\"goodsId\":17,\"goodsName\":\"sssss\",\"count\":15,\"money\":1665,\"salerId\":11}]', '2019-12-03 21:19:04', '1665', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('27', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-04 11:42:30', '23', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('28', '27', '[{\"goodsId\":5,\"goodsName\":\"百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋\",\"count\":4,\"money\":80,\"salerId\":1}]', '2019-12-04 14:27:01', '80', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('29', '27', '[{\"goodsId\":5,\"goodsName\":\"百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋\",\"count\":1,\"money\":20,\"salerId\":1}]', '2019-12-04 15:56:17', '20', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('30', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-04 15:59:36', '23', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('31', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-04 16:44:49', '23', '北京市-市辖区-西城区11', 'unreceived');
INSERT INTO `orders` VALUES ('32', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":5,\"money\":115,\"salerId\":15},{\"goodsId\":19,\"goodsName\":\"11\",\"count\":11,\"money\":22,\"salerId\":1}]', '2019-12-04 21:22:47', '137', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('33', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-04 21:23:17', '23', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('34', '27', '[{\"goodsId\":2,\"goodsName\":\"德国DMK进口牛奶  欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒\",\"count\":1,\"money\":20,\"salerId\":1}]', '2019-12-04 21:24:02', '20', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('35', '27', '[{\"goodsId\":5,\"goodsName\":\"百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋\",\"count\":1,\"money\":599,\"salerId\":1},{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-04 21:39:13', '602', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('36', '27', '[{\"goodsId\":19,\"goodsName\":\"11\",\"count\":6,\"money\":12,\"salerId\":1},{\"goodsId\":1,\"goodsName\":\"11\",\"count\":4,\"money\":44,\"salerId\":1},{\"goodsId\":2,\"goodsName\":\"德国DMK进口牛奶  欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒\",\"count\":1,\"money\":20,\"salerId\":1},{\"goodsId\":4,\"goodsName\":\"百雀羚套装女补水保湿护肤品\",\"count\":1,\"money\":11,\"salerId\":1}]', '2019-12-04 21:42:25', '77', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('37', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-31 15:33:22', '23', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('38', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-31 15:34:41', '23', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('39', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-31 15:35:17', '23', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('40', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2019-12-31 15:44:52', '23', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('41', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2020-01-11 22:28:38', '23', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('42', '27', '[{\"goodsId\":18,\"goodsName\":\"下一页\",\"count\":1,\"money\":23,\"salerId\":15}]', '2020-01-11 22:28:50', '23', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('43', '27', '[{\"goodsId\":10,\"goodsName\":\"红烧牛肉面\",\"count\":1,\"money\":47,\"salerId\":1},{\"goodsId\":14,\"goodsName\":\"112\",\"count\":1,\"money\":12,\"salerId\":15}]', '2020-01-28 17:06:09', '59', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('44', '27', '[{\"goodsId\":4,\"goodsName\":\"百雀羚套装女补水保湿护肤品\",\"count\":1,\"money\":1599,\"salerId\":1}]', '2020-01-31 15:14:01', '1599', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('45', '27', '[{\"goodsId\":10,\"goodsName\":\"红烧牛肉面\",\"count\":1,\"money\":47,\"salerId\":1}]', '2020-01-31 15:34:42', '47', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('46', '27', '[{\"goodsId\":19,\"goodsName\":\"11\",\"count\":3,\"money\":6,\"salerId\":1}]', '2020-02-17 22:44:17', '6', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('47', '27', '[{\"goodsId\":4,\"goodsName\":\"百雀羚套装女补水保湿护肤品\",\"count\":1,\"money\":1599,\"goodsNumber\":\"22\",\"salerId\":1}]', '2020-02-17 22:48:55', '23', '安徽省-合肥市-瑶海区撒打算', 'unreceived');
INSERT INTO `orders` VALUES ('48', '27', '[{\"goodsId\":4,\"goodsName\":\"百雀羚套装女补水保湿护肤品\",\"count\":1,\"money\":1599,\"goodsNumber\":\"22\",\"salerId\":1}]', '2020-02-18 14:38:07', '1599', '安徽省-合肥市-瑶海区撒打算', 'unreceived');

-- ----------------------------
-- Table structure for `saler`
-- ----------------------------
DROP TABLE IF EXISTS `saler`;
CREATE TABLE `saler` (
  `salerId` int(11) NOT NULL AUTO_INCREMENT,
  `salerUrl` varchar(255) DEFAULT '',
  `salerName` varchar(255) DEFAULT NULL,
  `salerPass` varchar(255) DEFAULT 'admin',
  `salerPhone` varchar(255) DEFAULT NULL,
  `salerAddress` varchar(255) DEFAULT NULL,
  `salerIsusing` varchar(255) DEFAULT '使用中',
  `salerTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`salerId`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of saler
-- ----------------------------
INSERT INTO `saler` VALUES ('1', 'http://127.0.0.1:3000/public/img/admin/saler/1575464992037-shop_08.jpg', '你好22', '11', '11', '北京', '使用中', '2019-11-16 16:59:37');
INSERT INTO `saler` VALUES ('3', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('4', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2020-05-01 00:00:00');
INSERT INTO `saler` VALUES ('5', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '已停用', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('6', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('7', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('9', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('10', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('11', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('12', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-11-28 00:00:00');
INSERT INTO `saler` VALUES ('13', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('14', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('15', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('16', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('17', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('18', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('19', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('20', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('21', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('22', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('23', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', ' 白居易', null, '112', '北京', '使用中', '2019-10-15 00:00:00');
INSERT INTO `saler` VALUES ('24', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '白居易', null, '22', '22', '使用中', '2019-10-25 16:58:22');
INSERT INTO `saler` VALUES ('28', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '李白', null, '158636698777', '成都', '使用中', '2019-10-25 17:35:16');
INSERT INTO `saler` VALUES ('29', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '111', null, '22222222222', '', '使用中', '2019-10-25 17:39:16');
INSERT INTO `saler` VALUES ('31', 'http://127.0.0.1:3000/public/img/admin/saler/1573898870626-Cache_-69e1bd1049059181.jpg', '杂货店', 'admin', '152', '背景', '已停用', '2019-11-16 18:07:21');
INSERT INTO `saler` VALUES ('32', 'http://127.0.0.1:3000/public/img/admin/saler/1573899221394-QQ图片20191009222016.jpg', '就有店铺', '21', '110', '121', '使用中', '2019-11-30 18:14:02');
INSERT INTO `saler` VALUES ('33', 'http://127.0.0.1:3000/public/img/admin/saler/1575025299931-shop_12.jpg', '123', '13123', '3123', '2312', '使用中', '2019-11-29 19:01:25');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL,
  `userCountry` varchar(255) DEFAULT NULL,
  `userUrl` varchar(255) DEFAULT NULL,
  `userSex` varchar(255) DEFAULT NULL,
  `usercontent` varchar(255) DEFAULT '""',
  `beginMoney` varchar(255) DEFAULT '0',
  `openid` varchar(255) DEFAULT NULL,
  `session_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '李白', null, 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '男', null, '110', null, null);
INSERT INTO `user` VALUES ('4', '李白', null, 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '男', null, '110', null, null);
INSERT INTO `user` VALUES ('5', '李白', null, 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '男', null, '110', null, null);
INSERT INTO `user` VALUES ('6', '李白', null, 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '男', null, '110', null, null);
INSERT INTO `user` VALUES ('7', '李白', null, 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '男', null, '110', null, null);
INSERT INTO `user` VALUES ('10', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('13', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('14', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('15', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('16', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('17', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('18', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('19', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('20', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('21', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('22', '李白', null, null, '男', null, '110', null, null);
INSERT INTO `user` VALUES ('27', '。。', '', 'https://wx.qlogo.cn/mmopen/vi_32/AgQKkqIeL26yF8EicWTChmOeicCmdFMqIB0HMjSyehgiab0Dktut0WiagPdhzlJelZUaMxXT2IA3PkYUNoNTnTicVYg/132', '未知', 'svhdbhasbj1', '35801', 'omiwO5CUdC1CeXVAoxvcBbLFkYb8', 'OvAM7aHoKNXfZmzTnYCl3Q==');

-- ----------------------------
-- Table structure for `usercoupon`
-- ----------------------------
DROP TABLE IF EXISTS `usercoupon`;
CREATE TABLE `usercoupon` (
  `userCouponId` int(11) NOT NULL AUTO_INCREMENT,
  `couponId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userCouponId`),
  UNIQUE KEY `couponId` (`couponId`,`userId`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of usercoupon
-- ----------------------------
INSERT INTO `usercoupon` VALUES ('1', '2', '27', '2019-11-30 14:48:12');
INSERT INTO `usercoupon` VALUES ('2', '4', '27', '2019-11-30 14:50:24');
INSERT INTO `usercoupon` VALUES ('3', '6', '27', '2019-12-01 20:33:49');
INSERT INTO `usercoupon` VALUES ('4', '5', '27', '2019-12-01 20:34:09');
INSERT INTO `usercoupon` VALUES ('5', '7', '27', '2019-12-01 20:42:30');
INSERT INTO `usercoupon` VALUES ('7', '49', '27', '2019-12-04 21:32:28');
