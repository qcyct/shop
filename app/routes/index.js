var express = require('express');
var router = express.Router();
// let { GetopenID, appId, AppSecret, getBase64, setBase64, isgender } = require('../config');
let { formateDate, urlf2z, urlf2zList } = require('../util.js');
let { isAdminLogin, getUserList, getUserCount, GetUsersById, DeleteUserById, getSalerList,
  getSalerCount, GetSalerById, GetSalerIsusing, DeleteSalerById, UpdateSalerById, addSaler,
  getGoodsCount, GetGoodsList, getCategoryCount, GetCategoryList, GetCategory, AddCategory,
  getCategoryByName, AddCategoryInfo, DeleteCategory, DeleteCategoryInfo, GetAdminList, getAdminCount,
  GetAdminById, UpdateAdminById, DeleteAdminById, addAdmin, GetactivityimgList, getActivityimgCount,
  GetActivityimgById, DeleteActivityimgById, UpdateActivityimgById, addActivityimg, GetGoodsById, addGoods,
  DeleteGoodsById, UpdateGoods
} = require('../mysql/index');
let { isSalerLogin } = require('../mysql/saler')
let upload = require('../util/multer/index')
let request = require('request')
router.post('/isAdminLogin', async (req, res, next) => {
  let { username, password, code } = req.body;
  /**
   * 验证码功能
   */
  // try {
  //   const sessionCaptcha = req.session.captcha.toLowerCase();
  //   if (sessionCaptcha != code) {
  //     return res.json({
  //       flog: 0,
  //       data: '验证码不正确'
  //     });
  //   }
  // } catch (error) {
  //   return res.json({
  //     flog: 0,
  //     data: '验证码不正确'
  //   });
  // }

  //登录验证
  let data = await isAdminLogin({
    username,
    password
  });
  if (!data.length) {
    let data = await isSalerLogin({
      salerPhone: username,
      salerPass: password
    });
    if (!data.length) {
      jsonData = {
        code: 0,
        data: "账号或者密码错误"
      }
    } else {
      jsonData = {
        code: 1,
        data: {
          "access_token": username,
          "name": username,
          "type": "saler",
          "userId": data[0].salerId,
          "salerPhone": data[0].salerPhone
        }
      }
      req.session.AdminInfo = {
        username: data[0].salerName,
        userId: data[0].salerId,
        url: data[0].salerUrl,
        type: "saler",
        salerPhone: data[0].salerPhone
      }
    }
  } else {
    jsonData = {
      code: 1,
      data: {
        "access_token": username,
        "name": username,
        "type": "admin",
        "userId": data[0].id
      }
    }
    req.session.AdminInfo = {
      username: username,
      userId: data[0].id,
      url: data[0].url,
      type: "admin"
    }
  }
  return res.json(jsonData)
});

router.get('/adminInfo', async (req, res, next) => {
  if (!req.session.AdminInfo) {
    return res.json({
      code: 500,
      msg: "未登录"
    })
  }
  res.json(
    {
      "code": 200,
      "user": {
        "userId": req.session.AdminInfo.userId,
        "username": req.session.AdminInfo.username,
        "nickName": req.session.AdminInfo.username,
        "url": req.session.AdminInfo.url,
        "type": req.session.AdminInfo.type
      }
    }
  )
});

//用户信息
router.get('/getUserList', async (req, res, next) => {
  let { page, limit, userId, userName, userSex, isusing } = req.query;
  let count = await getUserCount();
  let pageNum = Math.ceil((count / limit));
  if (page > pageNum) {
    return res.json({
      code: 1,
      data: "数据已经加载完毕"
    });
  }
  var num = (page - 1) * limit;
  let data = await getUserList(num, limit, {
    userId, userName, userSex, isusing
  });
  res.json({
    code: 0,
    data: data.data,
    count: data.count
  })
})

//查询用户
router.get('/GetUsersById', async (req, res, next) => {
  let id = req.query.editNo;
  let data = await GetUsersById(id);
  res.json({
    code: 1,
    data
  })
})

//删除用户
router.get('/DeleteUserById', async (req, res, next) => {
  let id = req.query.userId;
  let data = await DeleteUserById(id);
  res.json({
    code: 1,
    data
  })
})

//商家信息
router.get('/getSalerList', async (req, res, next) => {
  let { page, limit, salerId, salerName } = req.query;
  let count = await getSalerCount();
  let pageNum = Math.ceil((count / limit));
  if (page > pageNum) {
    return res.json({
      code: 1,
      data: "数据已经加载完毕"
    });
  }
  var num = (page - 1) * limit;
  let data = await getSalerList(num, limit, {
    salerId, salerName
  });
  data.data.forEach(item => {
    item.salerTime = formateDate(item.salerTime)
  })
  res.json({
    code: 0,
    data: data.data,
    count: data.count
  })
})

//查询商家
router.get('/GetSalerById', async (req, res, next) => {
  let id = req.query.editNo;
  let data = await GetSalerById(id);
  data.forEach(item => {
    item.salerTime = formateDate(item.salerTime)
  })
  res.json({
    code: 1,
    data
  })
})

//删除商家
router.get('/DeleteSalerById', async (req, res, next) => {
  let id = req.query.salerId;
  let data = await DeleteSalerById(id);
  res.json({
    code: 1,
    data
  })
})

//商家使用情况
router.get('/GetSalerIsusing', async (req, res, next) => {
  let data = await GetSalerIsusing();
  res.json({
    code: 1,
    data
  })
})

//更新商家信息
router.post('/UpdateSalerById', upload.single('salerUrl'), async (req, res, next) => {
  let { salerId, salerName, salerIsusing, salerTime, salerPhone, salerAddress, salerUrl } = req.body;
  salerUrl = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
  let data = await UpdateSalerById(salerId, { salerName, salerIsusing, salerTime, salerPhone, salerAddress, salerUrl });
  res.json({
    code: 1,
    data
  })
})

//添加商家
router.post('/addSaler', upload.single('salerUrl'), async (req, res, next) => {
  let { salerName, salerIsusing, salerPhone, salerAddress, salerTime, salerPass } = req.body;
  let salerUrl = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
  let data = await addSaler({ salerUrl, salerName, salerPass, salerPhone, salerAddress, salerIsusing, salerTime })
  res.json({
    code: 1,
    data
  })
})

//商品分类
router.get('/GetCategoryList', async (req, res, next) => {
  let { page, limit, categoryId } = req.query;
  let count = await getCategoryCount();
  let pageNum = Math.ceil((count / limit));
  if (page > pageNum) {
    return res.json({
      code: 1,
      data: "数据已经加载完毕"
    });
  }
  var num = (page - 1) * limit;
  let data = await GetCategoryList(num, limit, {
    categoryId
  });
  res.json({
    code: 0,
    data: data.data,
    count: data.count
  })
})

router.get('/GetCategory', async (req, res, next) => {
  let data = await GetCategory();
  let categoryData = [];
  let categoryItem = null;
  data[0].forEach(item => {
    categoryItem = {
      id: item.categoryId,
      title: item.categoryName
    }
    data[1].forEach(type => {
      if (type.categoryId == item.categoryId) {
        if (!categoryItem["children"]) {
          categoryItem["children"] = [];
        }
        categoryItem["children"].push({
          id: type.categoryinfoId,
          title: type.categoryinfoName
        })
      }
    })
    categoryData.push(categoryItem)
  })
  res.json({
    code: 1,
    data: categoryData
  })
})

//添加商品分类
router.post('/AddCategory', upload.single('categoryinfoUrl'), async (req, res, next) => {
  let { categoryNameVal, categoryinfoName, categoryinfoUrl } = req.body;
  await AddCategory({ categoryName: categoryNameVal });
  if (categoryinfoName) {
    let { categoryId } = await getCategoryByName(categoryNameVal);
    categoryinfoUrl = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
    await AddCategoryInfo({
      categoryId: categoryId,
      categoryinfoName: categoryinfoName,
      categoryinfoUrl: categoryinfoUrl
    })
  }
  res.json({
    code: 1,
    data: "添加成功"
  })
})

//删除商品分类
router.post('/DeleteCategory', async (req, res, next) => {
  let { categoryinfoId, categoryId } = req.body;
  if (!categoryinfoId) {
    await DeleteCategory(categoryId)
  } else {
    console.log(111)
    await DeleteCategoryInfo(categoryinfoId)
  }
  res.json({
    code: 1,
    data: "删除成功"
  })
})

//管理员信息
router.get('/GetAdminList', async (req, res, next) => {
  let { page, limit, id, name } = req.query;
  let count = await getAdminCount();
  let pageNum = Math.ceil((count / limit));
  if (page > pageNum) {
    return res.json({
      code: 1,
      data: "数据已经加载完毕"
    });
  }
  var num = (page - 1) * limit;
  let data = await GetAdminList(num, limit, {
    id, name
  });
  res.json({
    code: 0,
    data: data.data,
    count: data.count
  })
})

//查询管理员
router.get('/GetAdminById', async (req, res, next) => {
  let id = req.query.editNo;
  let data = await GetAdminById(id);
  res.json({
    code: 1,
    data
  })
})

//更新管理员信息
router.post('/UpdateAdminById', upload.single('url'), async (req, res, next) => {
  let { id, name, password, sex, url } = req.body;
  url = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
  let data = await UpdateAdminById(id, { name, password, sex, url });
  res.json({
    code: 1,
    data
  })
})

//删除管理员
router.post('/DeleteAdminById', async (req, res, next) => {
  let { id } = req.body;
  await DeleteAdminById(id);
  res.json({
    code: 1,
    data: "删除成功"
  })
})

//添加管理员
router.post('/addAdmin', upload.single('url'), async (req, res, next) => {
  let { name, password, sex, url } = req.body;
  url = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
  let data = await addAdmin({ name, password, sex, url });
  res.json({
    code: 1,
    data
  })
})

//修改管理员密码
router.post('/UpdateAdminPassById', async (req, res, next) => {
  let { oldPsw, newPsw } = req.body;
  let id = req.session.AdminInfo.userId;
  let username = req.session.AdminInfo.username;
  let admin = await isAdminLogin({
    username,
    password: oldPsw
  });
  if (admin.length) {
    await UpdateAdminById(id, {
      password: newPsw
    })
    return res.json({
      code: 200,
      msg: "修改密码成功"
    })
  } else {
    return res.json({
      code: 500,
      msg: "旧密码错误"
    })
  }

})

//活动图信息
router.get('/GetactivityimgList', async (req, res, next) => {
  let { page, limit, activityimgtype } = req.query;
  let count = await getActivityimgCount();
  let pageNum = Math.ceil((count / limit));
  if (page > pageNum) {
    return res.json({
      code: 1,
      data: "数据已经加载完毕"
    });
  }
  var num = (page - 1) * limit;
  let data = await GetactivityimgList(num, limit, { activityimgtype });
  res.json({
    code: 0,
    data: data.data,
    count: data.count
  })
})

//查询活动图
router.get('/GetActivityimgById', async (req, res, next) => {
  let id = req.query.editNo;
  let data = await GetActivityimgById(id);
  res.json({
    code: 1,
    data
  })
})

//删除活动图
router.post('/DeleteActivityimgById', async (req, res, next) => {
  let { activityimgId } = req.body;
  await DeleteActivityimgById(activityimgId);
  res.json({
    code: 1,
    data: "删除成功"
  })
})

//活动图位置
router.get('/GetActivityimgtype', async (req, res, next) => {
  let data = require('../public/json/Activityimgtype.json');
  res.json({
    code: 1,
    data
  })
})

//修改活动图
router.post('/UpdateActivityimgById', upload.single('activityimgurl'), async (req, res, next) => {
  let { activityimgId, activityimgpageurl, activityimgtype, activityimgurl } = req.body;
  activityimgurl = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
  let data = await UpdateActivityimgById(activityimgId, { activityimgurl, activityimgtype, activityimgpageurl });
  res.json({
    code: 1,
    data: "修改成功"
  })
})

//添加活动图
router.post('/addActivityimg', upload.single('activityimgurl'), async (req, res, next) => {
  let { activityimgpageurl, activityimgtype, activityimgurl } = req.body;
  activityimgurl = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
  await addActivityimg({ activityimgurl, activityimgtype, activityimgpageurl });
  res.json({
    code: 1,
    data: "添加成功"
  })
})

//商品信息
router.get('/GetGoodsList', async (req, res, next) => {
  let { page, limit, goodsId, goodsName } = req.query;
  let count = await getGoodsCount();
  let pageNum = Math.ceil((count / limit));
  if (page > pageNum) {
    return res.json({
      code: 1,
      data: "数据已经加载完毕"
    });
  }
  var num = (page - 1) * limit;
  let data = await GetGoodsList(num, limit, {
    goodsId, goodsName
  });
  data.data.forEach(item => {
    item.goodImgList = JSON.parse(item.goodImgList)
    item.goodsNumber = JSON.parse(item.goodsNumber)
  })
  res.json({
    code: 0,
    data: data.data,
    count: data.count
  })
})

//查询商品
router.get('/GetGoodsById', async (req, res, next) => {
  let id = req.query.editNo;
  let data = await GetGoodsById(id);
  data.forEach(item => {
    item.goodImgList = JSON.parse(item.goodImgList)
    item.goodsNumber = JSON.parse(item.goodsNumber)
    item.goodsTime = formateDate(item.goodsTime)
  })
  res.json({
    code: 1,
    data
  })
})

//添加商品
router.post('/addGoods', upload.array('goodsImg', 10), async (req, res, next) => {
  let countFile = req.files.length;
  let { goodsName, goodsSale, goodsFactory, goodsNum, salerId, goodsType, goodsTypeTwo, goodsNumber } = req.body;
  if (countFile === 0) {
    return res.json({
      code: 0,
      msg: "至少上传一张图片"
    })
  }
  let goodImgList = urlf2zList(req);
  let goodsImg = goodImgList[0];
  goodImgList = JSON.stringify(goodImgList);
  await addGoods({
    goodsName, goodsSale, goodsFactory, goodsNum,
    goodsImg: goodsImg, goodsNumber,
    goodImgList: goodImgList,
    salerId, goodsType, goodsTypeTwo
  })
  res.json({
    code: 1,
    data: "添加成功"
  })

})

//删除商品
router.post('/DeleteGoodsById', async (req, res, next) => {
  let { goodsId } = req.body;
  await DeleteGoodsById(goodsId);
  res.json({
    code: 1,
    data: "删除成功"
  })
})

//修改商品
router.post('/UpdateGoods', upload.array('goodsImg', 10), async (req, res, next) => {
  let { goodsId, goodsName, goodsSale, goodsFactory, goodsType, goodsNum, goodsPayNum, salerId, goodsTypeTwo, goodImgList, goodsNumber } = req.body;
  let goodImgListUpdate = urlf2zList(req);
  goodImgList = JSON.parse(goodImgList);
  goodImgList = goodImgList.concat(goodImgListUpdate);
  let goodsImg = goodImgList[0];
  goodImgList = JSON.stringify(goodImgList);
  if (!goodImgList.length) {
    return res.json({
      code: 0,
      msg: "至少上传一张图片"
    })
  }
  await UpdateGoods(goodsId, {
    goodsName, goodsSale, goodsFactory, goodsType, goodsNum, goodsPayNum, salerId, goodsTypeTwo, goodImgList, goodsImg, goodsNumber
  })
  res.json({
    code: 1,
    data: "修改成功"
  })
})


module.exports = router;
