// 添加请求拦截器
fly.interceptors.request.use((request) => {
    // 给所有请求添加自定义header
    // request.headers['X-Tag'] = 'flyio'
    // 打印出请求体
    // console.log(request.body)
    // 终止请求
    // var err=new Error("xxx")
    // err.request=request
    // return Promise.reject(new Error(""))

    // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
    // wx.showLoading()
    return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        // 只将请求结果的data字段返回
        // wx.hideLoading()
        return response
    }, (err) => {
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
            promise = fly.post(url, data)
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


const Base_url = 'http://192.168.1.21'
//所有轮播
const bannerList = () => ajax(Base_url + '/api/allbanner/bannerlist')
//分类
const shopCatelist = () => ajax(Base_url + '/api/allshopcate/shopcatelist')
//分类下的店铺
const storeList = (shopcate_id, longitude_latitude) => ajax(Base_url + '/api/allstore/storelist', {shopcate_id, longitude_latitude})
//小编推荐
const recommendList = (longitude_latitude) => ajax(Base_url + '/api/allstore/recommendlist', {longitude_latitude})
//商家推荐列表
const shopGoodList = (longitude_latitude) => ajax(Base_url + '/api/allstore/shopgoodslist' ,{longitude_latitude})
