"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// 添加请求拦截器
var loading = void 0;

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
        for (var j in obj) {
            var arr = makeFormData(obj[j]);
            for (var k = 0, l = arr.length; k < l; k++) {
                var key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
                data.push({ key: key, value: arr[k].value });
            }
        }
    } else {
        data.push({ key: "", value: obj });
    }
    if (!!form_data) {
        // 封装
        for (var i = 0, len = data.length; i < len; i++) {
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
    // var err=new Error("xxx")
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
    // if(localStorage.uid === 'null'){
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

// const ImgBaseUrl ='http://192.168.1.21'
var ImgBaseUrl = 'https://shop.zhihuimall.com.cn:443/zhihuishop/public';
// const Base_url = 'http://192.168.1.21'
var Base_url = 'https://shop.zhihuimall.com.cn:443/zhihuishop/public/index.php';

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
var todayDiscountList = function todayDiscountList(longitude_latitude, page) {
    return ajax(Base_url + '/api/alldiscount/todydiscountlist', { longitude_latitude: longitude_latitude, page: page });
};
//很优惠
var firmDiscountList = function firmDiscountList(longitude_latitude, page) {
    return ajax(Base_url + '/api/alldiscount/firmdiscountlist', { longitude_latitude: longitude_latitude, page: page });
};
//优惠信息
var informationDiscountList = function informationDiscountList(longitude_latitude, page) {
    return ajax(Base_url + '/api/alldiscount/informationdiscountlist', { longitude_latitude: longitude_latitude, page: page });
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
var shopGoodsSearchList = function shopGoodsSearchList(search_key, longitude_latitude, uid) {
    return ajax(Base_url + '/api/allsearch/shopgoodssearchlist', { search_key: search_key, longitude_latitude: longitude_latitude, uid: uid });
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

//店铺套餐
//套餐
var allShopGoodList = function allShopGoodList(store_id, longitude_latitude, status) {
    return ajax(Base_url + '/api/allshopgoods/shopgoodslist', { store_id: store_id, longitude_latitude: longitude_latitude, status: status });
};

//智能排序
//排序
var allSort = function allSort(sort_status, longitude_latitude, page) {
    return ajax(Base_url + '/api/allsort/sortlist', { sort_status: sort_status, longitude_latitude: longitude_latitude, page: page });
};

//分类下的店铺
//店铺列表
var storeList = function storeList(shopcate_id, longitude_latitude, page) {
    return ajax(Base_url + '/api/allstore/storelist', { shopcate_id: shopcate_id, longitude_latitude: longitude_latitude, page: page });
};
//小编推荐
var recommendList = function recommendList(longitude_latitude) {
    return ajax(Base_url + '/api/allstore/recommendlist', { longitude_latitude: longitude_latitude });
};
//小编更多推荐
var MoreRecommendList = function MoreRecommendList(longitude_latitude, page) {
    return ajax(Base_url + '/api/allstore/morerecommendlist', { longitude_latitude: longitude_latitude, page: page });
};
//商家推荐列表
var shopGoodList = function shopGoodList(longitude_latitude) {
    return ajax(Base_url + '/api/allstore/shopgoodslist', { longitude_latitude: longitude_latitude });
};
//更多商家推荐列表
var moreShopGoodsList = function moreShopGoodsList(longitude_latitude, page) {
    return ajax(Base_url + '/api/allstore/moreshopgoodslist', { longitude_latitude: longitude_latitude, page: page });
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

// 初始化
var vConsole = new VConsole();
console.log('Hello world');

//# sourceMappingURL=fly-compile.js.map