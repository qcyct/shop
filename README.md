### 商城小程序uniapp

#### 前言

使用uniapp+node+mysql开发的微信小程序商城

小程序功能：购物车、秒杀、优惠劵、分类、用户授权登录、收货地址、积分充值、订单状态显示

后台：

#### 技术

前端：Js Es6 uniapp layui

后端：nodeJS epxress框架 mysql数据库

#### 页面

![主页](https://images.gitee.com/uploads/images/2020/1016/094506_5e5cfbf1_5004132.jpeg "index.jpg")

![优惠劵](https://images.gitee.com/uploads/images/2020/1016/094602_9945ea9c_5004132.jpeg "24017938-cbef13813c951e7d.jpg")

![秒杀](https://images.gitee.com/uploads/images/2020/1016/094652_d984f881_5004132.jpeg "24017938-64118c03d50bf947.jpg")

![个人中心](https://images.gitee.com/uploads/images/2020/1016/094732_7f4a73ab_5004132.jpeg "24017938-9bf9099abd19c0d0.jpg")

![商品详情](https://images.gitee.com/uploads/images/2020/1016/094817_e692d8c5_5004132.jpeg "24017938-a1066644f511dfbb.jpg")

![分类](https://images.gitee.com/uploads/images/2020/1016/094849_4568d299_5004132.jpeg "24017938-3c418e4b317c4d7b.jpg")

![订单](https://images.gitee.com/uploads/images/2020/1016/094926_78bc70d7_5004132.jpeg "24017938-3cd8f29ad9b7aae8.jpg")

![购物车](https://images.gitee.com/uploads/images/2020/1016/095005_0fb8b34a_5004132.jpeg "24017938-d30c5398863d3eaa.jpg")

![后台](https://images.gitee.com/uploads/images/2020/1016/095102_ccafaa50_5004132.jpeg "24017938-5aed37016f1d66f9.jpg")

![后台](https://images.gitee.com/uploads/images/2020/1016/095110_80b8d9e2_5004132.jpeg "24017938-a847c5c89b3722d6.jpg")

![后台](https://images.gitee.com/uploads/images/2020/1016/095159_001be3cf_5004132.jpeg "24017938-5aed37016f1d66f9.jpg")

内容过多就不一一阐述.....

* * *

#### 安装

##### 开发的软件

| 软件名称           | 版本                                                        | 图标                                                         |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------ |
| HBuilder X         | 最新就可以                                                  | ![](https://images.gitee.com/uploads/images/2021/0322/224551_f9c6d707_5004132.png) |
| 微信小程序开发工具 | 最新就可以                                                  | ![](https://images.gitee.com/uploads/images/2021/0322/224626_ae0bcb13_5004132.png) |
| navicat            | 数据库的可视化工具，如果你手写sql语句能力很牛，可以不用这个 | ![](https://images.gitee.com/uploads/images/2021/0322/225239_8cec26ef_5004132.png) |

##### 开发环境

| 环境名称  | 版本                                                   |
| --------- | ------------------------------------------------------ |
| node、npm | 最新就好                                               |
| mysql     | 5.x的版本最好，8.x的版本可以出现问题（有些字段不支持） |


##### 步骤

1.  点赞项目（重点哦！！！）
2.  下载项目

![](https://images.gitee.com/uploads/images/2021/0322/225120_520e8cd0_5004132.png)

3. 数据库
+ 数据库sql导入
![](https://images.gitee.com/uploads/images/2021/0322/225516_be1c24ce_5004132.png)

+ 修改数据库配置
![](https://images.gitee.com/uploads/images/2021/0322/230535_897e080d_5004132.png )

![](https://images.gitee.com/uploads/images/2021/0322/230702_a7b0a659_5004132.png)

4. 小程序配置

+ 后端配置
     ![](https://images.gitee.com/uploads/images/2021/0322/230535_897e080d_5004132.png )

   ![](https://images.gitee.com/uploads/images/2021/0323/104717_10b0f661_5004132.png)


+ 前端配置

  ![](https://images.gitee.com/uploads/images/2021/0323/105044_17ae697a_5004132.png)

	![](https://images.gitee.com/uploads/images/2021/0323/105114_420af03b_5004132.png)
 5. 启动后端Node服务

   + 进入cmd窗口

   ![](https://images.gitee.com/uploads/images/2021/0322/225649_0dee5bbd_5004132.png)


   + 下载启动工具npm i nodemon -g

     ![](https://images.gitee.com/uploads/images/2021/0322/230801_2d2de712_5004132.png)

   + 下载依赖 npm i（如果网卡，可以采用cnpm）

     ![](https://images.gitee.com/uploads/images/2021/0322/230900_ede5929e_5004132.png)

   + 启动服务 npm run start

     ![](https://images.gitee.com/uploads/images/2021/0322/231111_256dc452_5004132.png)
     
  + 访问http://127.0.0.1:3000/进入后台管理

    

6. 启动小程序

   * 下载[https://www.dcloud.io/hbuilderx.html](https://www.dcloud.io/hbuilderx.html) 编辑器

   * 启动https://blog.csdn.net/qq_41988143/article/details/106122566
   
     

##### 注意

数据库最好是5.x的版本

###### 欢迎反馈问题，主页有联系方式，也可以留言

