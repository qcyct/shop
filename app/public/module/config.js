layui.define(function (exports) {

    var config = {
        base_server: 'http://127.0.0.1:3000/', // 接口地址，实际项目请换成http形式的地址
        base_server_saler: 'http://127.0.0.1:3000/saler/',
        tableName: 'easyweb',  // 存储表名
        autoRender: false,  // 窗口大小改变后是否自动重新渲染表格，解决layui数据表格非响应式的问题，目前实现的还不是很好，暂时关闭该功能
        pageTabs: true,   // 是否开启多标签
        // 获取缓存的token
        getToken: function () {
            var t = layui.data(config.tableName).token;
            if (t) {
                return JSON.parse(t);
            }
        },
        // 清除user
        removeToken: function () {
            layui.data(config.tableName, {
                key: 'token',
                remove: true
            });
        },
        // 缓存token
        putToken: function (token) {
            layui.data(config.tableName, {
                key: 'token',
                value: JSON.stringify(token)
            });
        },
        // 导航菜单，最多支持三级，因为还有判断权限，所以渲染左侧菜单很复杂，无法做到递归，你需要更多极请联系我添加，添加可以无限添加，只是无法做到递归
        menus: [{
            name: '用户管理',
            icon: 'layui-icon-username',
            url: '#!userTable',
            path: '../components/system/userTable.html'
        }, {
            name: '笔记管理',
            icon: 'layui-icon-read',
            url: '#!articleTable',
            path: '../components/system/articleTable.html'
        }, {
            name: '管理员管理',
            icon: 'layui-icon-friends',
            url: '#!adminTable',
            path: '../components/system/adminTable.html'
        },
        {
            icon: 'layui-icon-home',
            name: '商家管理',
            url: '#!saleTable',
            path: '../components/system/saleTable.html'
        },
        {
            icon: 'layui-icon-cart',
            name: '商品管理',
            url: '#!goodsTable',
            path: '../components/system/goodsTable.html'
        },
        {
            icon: 'layui-icon-app',
            name: "商品分类",
            url: "#!categoryTable",
            path: '../components/system/categoryTable.html'
        },
        {
            icon: 'layui-icon-carousel',
            name: "活动图片",
            url: "#!activityimgTable",
            path: '../components/system/activityimgTable.html'
        }
        ],
        salermenus: [
            {
                name: '主页',
                icon: 'layui-icon-username',
                url: '#!salerShow',
                path: "../components/saler/salerShow.html"
            },
            {
                name: '商品信息',
                icon: 'layui-icon-cart',
                url: '#!goodsTableBysaler',
                path: "../components/saler/goodsTableBysaler.html"
            },
            {
                name: '订单信息',
                icon: 'layui-icon-list',
                url: '#!ordersTableBysaler',
                path: "../components/saler/ordersTableBysaler.html"
            },
            {
                name: '商家信息',
                icon: 'layui-icon-home',
                url: '#!salerInfo',
                path: "../components/saler/salerInfo.html"
            },
            {
                name: '商品优惠卷',
                icon: 'layui-icon-form',
                url: '#!couponTable',
                path: "../components/saler/couponTable.html"
            },
            {
                name: "秒杀活动",
                icon: 'layui-icon-star-fill',
                url: '#!flashTable',
                path: "../components/saler/flashTable.html"
            }
        ],
        adminmenus: [
            {
                name: '用户管理',
                icon: 'layui-icon-username',
                url: '#!userTable',
                path: '../components/system/userTable.html'
            }, {
                name: '管理员管理',
                icon: 'layui-icon-friends',
                url: '#!adminTable',
                path: '../components/system/adminTable.html'
            },
            {
                icon: 'layui-icon-home',
                name: '商家管理',
                url: '#!saleTable',
                path: '../components/system/saleTable.html'
            },
            {
                icon: 'layui-icon-cart',
                name: '商品管理',
                url: '#!goodsTable',
                path: '../components/system/goodsTable.html'
            },
            {
                icon: 'layui-icon-app',
                name: "商品分类",
                url: "#!categoryTable",
                path: '../components/system/categoryTable.html'
            },
            {
                icon: 'layui-icon-carousel',
                name: "活动图片",
                url: "#!activityimgTable",
                path: '../components/system/activityimgTable.html'
            }
        ],
        // 当前登录的用户
        getUser: function () {
            var u = layui.data(config.tableName).login_user;
            if (u) {
                return JSON.parse(u);
            }
        },
        // 缓存user
        putUser: function (user) {
            layui.data(config.tableName, {
                key: 'login_user',
                value: JSON.stringify(user)
            });
        }
    };
    exports('config', config);
});
