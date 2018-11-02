"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// 添加请求拦截器
var loading = void 0;
var jssdkconfig = void 0;

// localStorage.longitude_latitude = '120,30'
localStorage.uid = 2121;

// 全局变量
var uid = localStorage.uid;
var longitude_latitude = localStorage.longitude_latitude;
var area = localStorage.area;
var area_id = localStorage.area_id;

function makeFormData(obj, form_data) {
    var data = [];
    if (obj instanceof File) {
        data.push({ key: "", value: obj });
    } else if (obj instanceof Array) {
        for (var j = 0, len = obj.length; j < len; j++) {
            var arr = makeFormData(obj[j]);
            for (var k = 0, l = arr.length; k < l; k++) {
                var key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
                data.push({ key: key, value: arr[k].value });
            }
        }
    } else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == 'object') {
        for (var _j in obj) {
            var _arr = makeFormData(obj[_j]);
            for (var _k = 0, _l = _arr.length; _k < _l; _k++) {
                var _key = !!form_data ? _j + _arr[_k].key : "[" + _j + "]" + _arr[_k].key;
                data.push({ key: _key, value: _arr[_k].value });
            }
        }
    } else {
        data.push({ key: "", value: obj });
    }
    if (!!form_data) {
        // 封装
        for (var i = 0, _len = data.length; i < _len; i++) {
            form_data.append(data[i].key, data[i].value);
        }
    } else {
        return data;
    }
}

fly.interceptors.request.use(function (request) {
    // 给所有请求添加自定义header
    // request.headers['X-Tag'] = 'flyio'
    // request.headers['Content-Type'] = 'application/json'
    // 打印出请求体
    // console.log(request.body)
    // 终止请求
    // let err=new Error("xxx")
    // err.request=request
    // return Promise.reject(new Error(""))

    // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
    loading = app.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    //路由拦截
    // if(localStorage.uid === 'null' || !localStorage.uid || localStorage.uid ===undefined){
    //     location.assign('https://shop.zhihuimall.com.cn/app/index.php?i=1604&c=entry&mid=8811&do=shop&m=vslai_shop')
    // }
    return request;
});

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(function (response) {
    // 只将请求结果的data字段返回
    // wx.hideLoading()
    loading.close();
    return response;
}, function (err) {
    loading.close();
    // 发生网络错误后会走到这里
    // wx.showToast({
    //     title: '请求超时',
    //     icon: 'none'
    // })
    // return Promise.resolve("ssss")
});

function ajax(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "POST";

    return new Promise(function (resolve, reject) {
        // 执行异步ajax请求
        var promise = void 0;
        if (type === 'GET') {
            // 准备url query参数数据
            var dataStr = ''; // 数据拼接字符串
            Object.keys(data).forEach(function (key) {
                dataStr += key + '=' + data[key] + '&';
            });
            if (dataStr !== '') {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
                url = url + '?' + dataStr;
            }
            // 发送get请求
            promise = fly.get(url);
        } else {
            // 发送post请求
            var form_data = new FormData();
            makeFormData(data, form_data);
            promise = fly.post(url, form_data);
        }
        promise.then(function (response) {
            // 成功了调用resolve()
            resolve(response.data);
        }).catch(function (error) {
            // 失败了调用reject()
            reject(error);
        });
    });
}

var ImgBaseUrl = 'http://192.168.1.15';
// const ImgBaseUrl ='https://shop.zhihuimall.com.cn:443/zhihuishop/public'
var Base_url = 'http://192.168.1.15';
// const Base_url = 'https://shop.zhihuimall.com.cn:443/zhihuishop/public/index.php'

//获取权限
var wxConfig = function wxConfig(url) {
    return ajax(Base_url + '/api/allaccesstoken/tokenlist', { url: url });
};
//获取当前地址
var districts = function districts(longitude_latitude) {
    return ajax(Base_url + '/api/allaccesstoken/longlat', { longitude_latitude: longitude_latitude });
};

//所有轮播
//列表广告
var bannerList = function bannerList() {
    return ajax(Base_url + '/api/allbanner/bannerlist');
};

//优惠相关
//优惠底层图片和文案
var discountList = function discountList() {
    return ajax(Base_url + '/api/alldiscount/discountlist');
};
//今日钜惠
var todayDiscountList = function todayDiscountList(longitude_latitude, page, area_id) {
    return ajax(Base_url + '/api/alldiscount/todydiscountlist', { longitude_latitude: longitude_latitude, page: page, area_id: area_id });
};
//很优惠
var firmDiscountList = function firmDiscountList(longitude_latitude, page, area_id) {
    return ajax(Base_url + '/api/alldiscount/firmdiscountlist', { longitude_latitude: longitude_latitude, page: page, area_id: area_id });
};
//优惠信息
var informationDiscountList = function informationDiscountList(longitude_latitude, page, area_id) {
    return ajax(Base_url + '/api/alldiscount/informationdiscountlist', { longitude_latitude: longitude_latitude, page: page, area_id: area_id });
};

//商家二维码
//商家二维码
var storeImg = function storeImg(uid, longitude_latitude) {
    return ajax(Base_url + '/api/allstoreimg/storeimglist', { uid: uid, longitude_latitude: longitude_latitude }, "GET");
};
//判断否是商家
var isaShop = function isaShop(uid) {
    return ajax(Base_url + '/api/allstoreimg/isashop', { uid: uid }, "GET");
};

//需求发布
//需求发布
var newsAdd = function newsAdd(uid, content) {
    return ajax(Base_url + '/api/allnews/newsadd', { uid: uid, content: content });
};

//搜索展示
//热搜
var hotSearchList = function hotSearchList() {
    return ajax(Base_url + '/api/allsearch/hotsearchlist');
};
//套餐搜索
var shopGoodsSearchList = function shopGoodsSearchList(search_key, longitude_latitude, uid, area_id) {
    return ajax(Base_url + '/api/allsearch/shopgoodssearchlist', { search_key: search_key, longitude_latitude: longitude_latitude, uid: uid, area_id: area_id });
};
//搜索历史
var historySearchList = function historySearchList(uid) {
    return ajax(Base_url + '/api/allsearch/historysearchlist', { uid: uid });
};
//删除搜索历史
var deleteHistory = function deleteHistory(uid) {
    return ajax(Base_url + '/api/allsearch/delhistorysearchlist', { uid: uid });
};

//所有分类
//分类
var shopCatelist = function shopCatelist() {
    return ajax(Base_url + '/api/allshopcate/shopcatelist');
};
//更多分类
var moreShopCateList = function moreShopCateList() {
    return ajax(Base_url + '/api/allshopcate/moreshopcatelist');
};

//店铺套餐
//套餐
var allShopGoodList = function allShopGoodList(store_id, longitude_latitude, status) {
    return ajax(Base_url + '/api/allshopgoods/shopgoodslist', { store_id: store_id, longitude_latitude: longitude_latitude, status: status });
};

//智能排序
//排序
var allSort = function allSort(sort_status, longitude_latitude, page, area_id) {
    return ajax(Base_url + '/api/allsort/sortlist', { sort_status: sort_status, longitude_latitude: longitude_latitude, page: page, area_id: area_id });
};

//分类下的店铺
//店铺列表
var storeList = function storeList(shopcate_id, type, longitude_latitude, page, area_id) {
    return ajax(Base_url + '/api/allstore/storelist', { shopcate_id: shopcate_id, type: type, longitude_latitude: longitude_latitude, page: page, area_id: area_id });
};
//小编推荐
var recommendList = function recommendList(longitude_latitude, area_id) {
    return ajax(Base_url + '/api/allstore/recommendlist', { longitude_latitude: longitude_latitude, area_id: area_id });
};
//小编更多推荐
var MoreRecommendList = function MoreRecommendList(longitude_latitude, page, area_id) {
    return ajax(Base_url + '/api/allstore/morerecommendlist', { longitude_latitude: longitude_latitude, page: page, area_id: area_id });
};
//商家推荐列表
var shopGoodList = function shopGoodList(longitude_latitude, area_id) {
    var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return ajax(Base_url + '/api/allstore/shopgoodslist', { longitude_latitude: longitude_latitude, area_id: area_id, page: page });
};
//更多商家推荐列表
var moreShopGoodsList = function moreShopGoodsList(longitude_latitude, page, area_id) {
    return ajax(Base_url + '/api/allstore/moreshopgoodslist', { longitude_latitude: longitude_latitude, page: page, area_id: area_id });
};

// 商家入驻相关
// 地区列表
var areaList = function areaList(region_type, parent_id) {
    return ajax(Base_url + '/api/allarea/arealist', { region_type: region_type, parent_id: parent_id });
};
//图片上传
var upLoadImgToOur = function upLoadImgToOur(src) {
    return ajax(Base_url + '/api/allarea/uploadimg', { src: src });
};
// 一级分类选择
var oneCate = function oneCate() {
    return ajax(Base_url + '/api/allarea/onecate');
};
// 二级分类选择
var twoCate = function twoCate(p_id) {
    return ajax(Base_url + '/api/allarea/twocate', { p_id: p_id });
};
// 商家入驻添加
var storeAdd = function storeAdd(uid, shopcate_id, shopchildcate_id, province_id, city_id, area_id, street_id, community_id, shop_name, phone, name, address, id_card, id_card_positive_photo, id_card_negative_photo, business_license) {
    return ajax(Base_url + '/api/allarea/storeadd', { uid: uid, shopcate_id: shopcate_id, shopchildcate_id: shopchildcate_id, province_id: province_id, city_id: city_id, area_id: area_id, street_id: street_id, community_id: community_id, shop_name: shop_name, phone: phone, name: name, address: address, id_card: id_card, id_card_positive_photo: id_card_positive_photo, id_card_negative_photo: id_card_negative_photo, business_license: business_license });
};

// 关于订单
// 预订单添加
var orderList = function orderList(uid, store_id, goods_id, rule, preset_time, full_reduce, realprice) {
    return ajax(Base_url + '/api/allorder/orderlist', { uid: uid, store_id: store_id, goods_id: goods_id, rule: rule, preset_time: preset_time, full_reduce: full_reduce, realprice: realprice });
};
// 预订单详情
var budgetOrderList = function budgetOrderList(uid, store_id, goods_id) {
    return ajax(Base_url + '/api/allorder/budgetorderlist', { uid: uid, store_id: store_id, goods_id: goods_id });
};
// 当前用户是否存在手机号
var memberPhone = function memberPhone(uid) {
    return ajax(Base_url + '/api/allorder/memberphone', { uid: uid });
};
// 当前用户添加预留手机号
var addmemberphone = function addmemberphone(uid, phone) {
    return ajax(Base_url + '/api/allorder/addmemberphone', { uid: uid, phone: phone });
};

//关于城市选择
var citySelectList = function citySelectList() {
    return ajax(Base_url + '/api/allcityselect/cityselectlist');
};
//城市列表
var citySearchList = function citySearchList(area) {
    return ajax(Base_url + '/api/allcityselect/citysearchlist', { area: area });
};

// 初始化
var vConsole = new VConsole();
console.log('Hello world');

//# sourceMappingURL=fly-compile.js.map