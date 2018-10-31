function removeSameItem(arr) {
    return Array.from(new Set(arr))
}

let jssdkconfig
let app = new Vue({
    el: "#app",
    data: {
        dataSelect: -1,
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        show3: false,
        selected: -1,
        status: '',
        store_id: '',
        alert: false,
        detail: {},
        longitude_latitude: '',
        page: 1,
        allLoaded: true,
        loading: false,//判断是否加载数据
        loading_more: true,//控制是否发送ajax请求
    },
    computed: {
        timeSel() {
            if (this.detail.shop_goods_time) {
                let arr = []
                arr = this.detail.shop_goods_time.map(item => item.rule)
                arr = removeSameItem(arr)
                return arr
            }
        }
    },
    mounted() {
        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html')
        }

        var mySwiper = new Swiper('.swiper-container', {
            width: innerWidth,
            slidesPerView: 6,
            freeMode: true,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        })

        let store_id = this.GetQueryString('id')
        this.store_id = store_id
        let status = this.GetQueryString('status')
        this.status = status
        setTimeout(() => {
            this.getWxConfig()
        })
    },
    methods: {
        async getWxConfig() {
            let that = this
            let url = window.location.href
            console.log(url)
            let result = await wxConfig(url)
            result = JSON.parse(result.data)
            this.jssdkconfig = result
            console.log(result)
            jssdkconfig = this.jssdkconfig
            if (jssdkconfig) {
                localStorage.setItem('jsdk', jssdkconfig)
                console.log(jssdkconfig.appId, jssdkconfig.timestamp, jssdkconfig.nonceStr, jssdkconfig.signature)
            }

            wx.config({
                debug: false,
                appId: jssdkconfig.appId,
                timestamp: jssdkconfig.timestamp,
                nonceStr: jssdkconfig.nonceStr,
                signature: jssdkconfig.signature,
                jsApiList: [
                    'openLocation',
                    'getLocation',
                ]
            });
            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: [
                        'getNetworkType',
                        'previewImage',
                        'getLocation'
                    ],
                    success: function (res) {
                        console.log(JSON.stringify(res));
                    }
                });
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        console.log(JSON.stringify(res))
                        // alert(localStorage.jsdk)
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        that.longitude_latitude = longitude + ',' + latitude


                        that.getStoreList(that.store_id, that.longitude_latitude, that.status)
                    }
                });
            })

            wx.error(function (res) {
                console.log(`err:${res}`)
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
            // https://shop.zhihuimall.com.cn/app/index.php?i=1604&c=entry&mid=8811&do=shop&m=vslai_shop&p=location&latitude=30.25961&longitude=120.13026

        },
        selectDate(index) {
            this.dataSelect = index
        },
        toMap() {
            let that = this
            // location.href = `./map.html?longitude_latitude=${this.detail.longitude_latitude}&title=${encodeURIComponent(this.detail.address)}&content=${encodeURIComponent(this.detail.shop_name)}`
            wx.openLocation({
                latitude: that.detail.longitude_latitude.split(',')[1] - 0, // 纬度，浮点数，范围为90 ~ -90
                longitude: that.detail.longitude_latitude.split(',')[0] - 0, // 经度，浮点数，范围为180 ~ -180。
                name: that.detail.shop_name, // 位置名
                address: that.detail.address, // 地址详情说明
                scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        },
        toDetail() {
            location.href = './room_booking.html'
        },
        back() {
            history.go(-1)
        },
        showDetail(i) {
            this.show3 = i
        },
        async filterTime(v, i) {
            this.selected = i
            await this.getStoreList(this.store_id, this.longitude_latitude, this.status)
            if (this.detail.shop_goods) {
                this.detail.shop_goods = this.detail.shop_goods.filter(item => item.rule === v)
            }

        },
        GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        async getStoreList(store_id, longitude_latitude, status) {
            let result = await allShopGoodList(store_id, longitude_latitude, status)
            if (result.code === 0) {
                alert(result.message)
            }
            if (result.code === 1) {
                console.log(result.data)
                this.detail = result.data
            }
        },
    }
})
