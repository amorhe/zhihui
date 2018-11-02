let app = new Vue({
    el: "#app",
    data: {
        search_key:'',
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        address: '',
        longitude_latitude: '',
        allLoaded: true,
        loading: false,//判断是否加载数据
        loading_more: true,//控制是否发送ajax请求
    },
    computed: {
        cate() {
            let arr = []
            let arr2 = []
            this.shopCateListData.forEach(c => {
                if (arr2.length === 8) {
                    arr2 = []
                }
                if (arr2.length === 0) {
                    arr.push(arr2)
                }
                arr2.push(c)
            })
            return arr
        }
    },
    methods: {
        GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        async getWxConfig() {

            let that = this
            let url = window.location.href
            console.log(url)

            let result = await wxConfig(url)
            result = JSON.parse(result.data)
            this.jssdkconfig = result
            console.log(result)
            jssdkconfig = this.jssdkconfig

            wx.config({
                debug: false,
                appId: jssdkconfig.appId,
                timestamp: jssdkconfig.timestamp,
                nonceStr: jssdkconfig.nonceStr,
                signature: jssdkconfig.signature,
                jsApiList: [
                    'getLocation',
                ]
            });

            wx.ready(function () {
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        console.log(JSON.stringify(res))
                        // console.log(localStorage.jsdk)
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        localStorage.longitude_latitude = longitude + ',' + latitude
                        that.longitude_latitude = longitude + ',' + latitude
                        localStorage.setItem('longitude_latitude', that.longitude_latitude)
                        that.getRecommendList(longitude + ',' + latitude);
                        that.getShopGoodList(longitude + ',' + latitude);
                        that.getAllSort(1, longitude + ',' + latitude, 1)
                        that.getDistrict(latitude + ',' + longitude)
                    }
                });
            })
            wx.error(function (res) {
                console.log(`err:${res}`)
            });

        },
        async loadingMore() {
            if (this.allLoaded === false) {
                return
            }
            if ($(window).scrollTop() + $(window).height() + 100 >= $(document).height()) {
                // console.log(1)
                this.allLoaded = false
                this.loading = true;
                this.sortPage++;
                let result
                if (this.loading_more) {
                    this.loading_more = false //禁止浏览器发送ajax请求
                    result = await allSort(this.sort_status, this.longitude_latitude, this.sortPage)
                    if (result.code === 1) {//判断接受是否成功
                        this.loading = false
                        console.log(this.allSortList.length, result.data.total)
                        if (this.allSortList.length === result.data.total) {
                            return
                        } else {
                            this.loading_more = true
                            this.allSortList = [...this.allSortList, ...result.data.data];
                        }
                    } else {
                        setTimeout(() => {
                            this.loading = false
                            this.loading_more = true
                        }, 1000)
                    }
                } else {
                    this.loading = false
                }
            }
        },
        getRequest() {
            var url = window.location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
    },
    created() {
    },

    mounted() {
        //路由拦截
        // if (localStorage.uid === 'null') {
        //     location.assign('https://shop.zhihuimall.com.cn/app/index.php?i=1604&c=entry&mid=8811&do=shop&m=vslai_shop')
        // }

    }
})
