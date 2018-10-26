// 添加请求拦截器
let form_data = new FormData();
let loading

function makeFormData(obj, form_data) {
    const data = [];
    if (obj instanceof File) {
        data.push({key: "", value: obj});
    }
    else if (obj instanceof Array) {
        for (var j = 0, len = obj.length; j < len; j++) {
            var arr = makeFormData(obj[j]);
            for (var k = 0, l = arr.length; k < l; k++) {
                var key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
                data.push({key: key, value: arr[k].value})
            }
        }
    }
    else if (typeof obj == 'object') {
        for (var j in obj) {
            var arr = makeFormData(obj[j]);
            for (var k = 0, l = arr.length; k < l; k++) {
                var key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
                data.push({key: key, value: arr[k].value})
            }
        }
    }
    else {
        data.push({key: "", value: obj});
    }
    if (!!form_data) {
        // 封装
        for (var i = 0, len = data.length; i < len; i++) {
            form_data.append(data[i].key, data[i].value)
        }
    }
    else {
        return data;
    }
}

fly.interceptors.request.use((request) => {
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
    return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        // 只将请求结果的data字段返回
        // wx.hideLoading()
        loading.close()
        return response
    }, (err) => {
        loading.close()
        // 发生网络错误后会走到这里
        // wx.showToast({
        //     title: '请求超时',
        //     icon: 'none'
        // })
        // return Promise.resolve("ssss")
    }
)

function ajax(url, data = {}, type) {
    return new Promise(function (resolve, reject) {
        // 执行异步ajax请求
        let promise
        if (type === 'GET') {
            // 准备url query参数数据
            let dataStr = '' // 数据拼接字符串
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&'
            })
            if (dataStr !== '') {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
            // 发送get请求
            promise = fly.get(url)
        } else {
            // 发送post请求
            makeFormData(data, form_data)
            promise = fly.post(url, form_data)
        }
        promise.then(function (response) {
            // 成功了调用resolve()
            resolve(response.data)
        }).catch(function (error) {
            // 失败了调用reject()
            reject(error)
        })
    })
}

const ImgBaseUrl ='http://192.168.1.21'
const Base_url = 'http://192.168.1.21'
//所有轮播
//列表广告
const bannerList = () => ajax(Base_url + '/api/allbanner/bannerlist')

//优惠相关
//优惠底层图片和文案
const discountList = () => ajax(Base_url + '/api/alldiscount/discountlist')
//今日钜惠
const todayDiscountList = (longitude_latitude, page) => ajax(Base_url + '/api/alldiscount/todydiscountlist', {longitude_latitude, page})
//很优惠
const firmDiscountList = (longitude_latitude, page) => ajax(Base_url + '/api/alldiscount/firmdiscountlist', {longitude_latitude, page})
//优惠信息
const informationDiscountList = (longitude_latitude, page) => ajax(Base_url + '/api/alldiscount/informationdiscountlist', {longitude_latitude, page})

//搜索展示
//热搜
const hotSearchList = () => ajax(Base_url + '/api/allsearch/hotsearchlist')

//所有分类
//分类
const shopCatelist = () => ajax(Base_url + '/api/allshopcate/shopcatelist')


//店铺套餐
//套餐
const allShopGoodList = (store_id,longitude_latitude,status) => ajax(Base_url + '/api/allshopgoods/shopgoodslist',{store_id,longitude_latitude,status})

//智能排序
//排序
const allSort = (sort_status, longitude_latitude, page) => ajax(Base_url + '/api/allsort/sortlist', {sort_status, longitude_latitude, page})

//分类下的店铺
//店铺列表
const storeList = (shopcate_id, longitude_latitude, page) => ajax(Base_url + '/api/allstore/storelist', {shopcate_id, longitude_latitude, page})
//小编推荐
const recommendList = (longitude_latitude) => ajax(Base_url + '/api/allstore/recommendlist', {longitude_latitude})
//小编更多推荐
const MoreRecommendList = (longitude_latitude,page) => ajax(Base_url + '/api/allstore/morerecommendlist',{longitude_latitude,page})
//商家推荐列表
const shopGoodList = (longitude_latitude) => ajax(Base_url + '/api/allstore/shopgoodslist', {longitude_latitude})
//更多商家推荐列表
const moreShopGoodsList = (longitude_latitude,page) => ajax(Base_url + '/api/allstore/moreshopgoodslist',{longitude_latitude,page})



