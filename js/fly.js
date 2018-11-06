// 添加请求拦截器
let loading
let jssdkconfig

// localStorage.longitude_latitude = '120,30'
localStorage.uid = 1212

// 全局变量
let uid = localStorage.uid
let longitude_latitude = localStorage.longitude_latitude
let area = localStorage.area
let area_id = localStorage.area_id

function makeFormData(obj, form_data) {
    const data = [];
    if (obj instanceof File) {
        data.push({key: "", value: obj});
    }
    else if (obj instanceof Array) {
        for (let j = 0, len = obj.length; j < len; j++) {
            let arr = makeFormData(obj[j]);
            for (let k = 0, l = arr.length; k < l; k++) {
                let key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
                data.push({key: key, value: arr[k].value})
            }
        }
    }
    else if (typeof obj == 'object') {
        for (let j in obj) {
            let arr = makeFormData(obj[j]);
            for (let k = 0, l = arr.length; k < l; k++) {
                let key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
                data.push({key: key, value: arr[k].value})
            }
        }
    }
    else {
        data.push({key: "", value: obj});
    }
    if (!!form_data) {
        // 封装
        for (let i = 0, len = data.length; i < len; i++) {
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

function ajax(url, data = {}, type="POST") {
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
            let form_data = new FormData();
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



const ImgBaseUrl ='http://192.168.1.15'
// const ImgBaseUrl ='https://shop.zhihuimall.com.cn:443/zhihuishop/public'
const Base_url = 'http://192.168.1.15'
// const Base_url = 'https://shop.zhihuimall.com.cn:443/zhihuishop/public/index.php'

//获取权限
const wxConfig = (url) => ajax(Base_url + '/api/allaccesstoken/tokenlist',{url})
//获取当前地址
const districts = (longitude_latitude) => ajax(Base_url + '/api/allaccesstoken/longlat',{longitude_latitude})


//所有轮播
//列表广告
const bannerList = () => ajax(Base_url + '/api/allbanner/bannerlist')

//优惠相关
//优惠底层图片和文案
const discountList = () => ajax(Base_url + '/api/alldiscount/discountlist')
//今日钜惠
const todayDiscountList = (longitude_latitude, page,area_id) => ajax(Base_url + '/api/alldiscount/todydiscountlist', {longitude_latitude, page,area_id})
//很优惠
const firmDiscountList = (longitude_latitude, page,area_id) => ajax(Base_url + '/api/alldiscount/firmdiscountlist', {longitude_latitude, page,area_id})
//优惠信息
const informationDiscountList = (longitude_latitude, page,area_id) => ajax(Base_url + '/api/alldiscount/informationdiscountlist', {longitude_latitude, page,area_id})

//商家二维码
//商家二维码
const storeImg = (uid,longitude_latitude) => ajax(Base_url + '/api/allstoreimg/storeimglist',{uid,longitude_latitude},"GET")
//判断否是商家
const isaShop = (uid) => ajax(Base_url + '/api/allstoreimg/isashop',{uid},"GET")

//需求发布
//需求发布
const newsAdd = (uid,content) => ajax(Base_url + '/api/allnews/newsadd',{uid,content})


//搜索展示
//热搜
const hotSearchList = () => ajax(Base_url + '/api/allsearch/hotsearchlist')
//套餐搜索
const shopGoodsSearchList =  (search_key,longitude_latitude,uid,area_id) => ajax(Base_url + '/api/allsearch/shopgoodssearchlist',{search_key,longitude_latitude,uid,area_id})
//搜索历史
const historySearchList = (uid) => ajax(Base_url + '/api/allsearch/historysearchlist',{uid})
//删除搜索历史
const deleteHistory = (uid) => ajax(Base_url + '/api/allsearch/delhistorysearchlist',{uid});

//所有分类
// 一级分类
const shopCatelist = () => ajax(Base_url + '/api/allshopcate/shopcatelist')
// 更多分类
const moreShopCateList = () => ajax(Base_url + '/api/allshopcate/moreshopcatelist')
// 二级分类
const twoShopCateList = (p_id) => ajax(Base_url + '/api/allshopcate/twoshopcateList',{p_id})
// 更多二级分类列表
const moreTwoShopCateList = (p_id) => ajax(Base_url + '/api/allshopcate/moretwoshopcateList',{p_id})

//店铺套餐
//套餐
const allShopGoodList = (store_id,longitude_latitude,status) => ajax(Base_url + '/api/allshopgoods/shopgoodslist',{store_id,longitude_latitude,status})

//智能排序
//排序
const allSort = (sort_status, longitude_latitude,type,shopcate_id ,page,area_id) => ajax(Base_url + '/api/allsort/sortlist', {sort_status, longitude_latitude,type,shopcate_id,page,area_id})

//分类下的店铺
//店铺列表
const storeList = (shopcate_id,type,longitude_latitude, page, area_id) => ajax(Base_url + '/api/allstore/storelist', {shopcate_id,type, longitude_latitude, page, area_id})
//小编推荐
const recommendList = (longitude_latitude,area_id) => ajax(Base_url + '/api/allstore/recommendlist', {longitude_latitude,area_id})
//小编更多推荐
const MoreRecommendList = (longitude_latitude,page,area_id) => ajax(Base_url + '/api/allstore/morerecommendlist',{longitude_latitude,page,area_id})
//商家推荐列表
const shopGoodList = (longitude_latitude,area_id,page = 1) => ajax(Base_url + '/api/allstore/shopgoodslist', {longitude_latitude,area_id,page})
//更多商家推荐列表
const moreShopGoodsList = (longitude_latitude,page,area_id) => ajax(Base_url + '/api/allstore/moreshopgoodslist',{longitude_latitude,page,area_id})

// 商家入驻相关
// 地区列表
const areaList = (region_type,parent_id) => ajax(Base_url + '/api/allarea/arealist',{region_type,parent_id})
//图片上传
const upLoadImgToOur = (src) => ajax(Base_url + '/api/allarea/uploadimg',{src})
// 一级分类选择
const oneCate = () => ajax(Base_url + '/api/allarea/onecate')
// 二级分类选择
const twoCate = (p_id) => ajax(Base_url + '/api/allarea/twocate',{p_id})
// 商家入驻添加
const storeAdd = (uid,shopcate_id,shopchildcate_id,province_id,city_id,area_id,street_id,community_id,shop_name,phone,name,address,id_card,id_card_positive_photo,id_card_negative_photo,business_license) => ajax(Base_url + '/api/allarea/storeadd',{uid,shopcate_id,shopchildcate_id,province_id,city_id,area_id,street_id,community_id,shop_name,phone,name,address,id_card,id_card_positive_photo,id_card_negative_photo,business_license})


// 关于订单
// 预订单添加
const orderList = (uid,store_id,goods_id,rule,preset_time,full_reduce,realprice) => ajax(Base_url + '/api/allorder/orderlist',{uid,store_id,goods_id,rule,preset_time,full_reduce,realprice})
// 预订单详情
const budgetOrderList = (uid,store_id,goods_id) => ajax(Base_url + '/api/allorder/budgetorderlist',{uid,store_id,goods_id})
// 当前用户是否存在手机号
const memberPhone = (uid) => ajax(Base_url + '/api/allorder/memberphone',{uid})
// 当前用户添加预留手机号
const addmemberphone = (uid,phone) => ajax(Base_url + '/api/allorder/addmemberphone',{uid,phone})

//关于城市选择
const citySelectList = () => ajax(Base_url + '/api/allcityselect/cityselectlist')
//城市列表
const citySearchList = (area) => ajax(Base_url + '/api/allcityselect/citysearchlist',{area})
//城市搜索
const citySearchSelectList = (search_city) => ajax(Base_url + '/api/allcityselect/citysearchselectlist',{search_city})

// 初始化
let vConsole = new VConsole();
console.log('Hello world');

