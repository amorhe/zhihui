let app = new Vue({
    el: "#app",
    data: {
        dialogFormVisible: false,
        form: {
            name: '',
        },
        isshop: '',
        addnews: "",
        storeImg: '',
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        banner: [],
        shopCateListData: [],
        recommendList: [],
        shopGoodList: [],
        discountList: [],
        allSortList: [],
        sort_status: 1,
        sortPage: 1,
        index_foot: [1, 0, 0],
        address: '',
        allLoaded: true,
        loading: false,//判断是否加载数据
        loading_more: true,//控制是否发送ajax请求
    },
    computed: {
        cate() {
            let arr = []
            let arr2 = []
            if (this.shopCateListData) {
                this.shopCateListData.forEach(c => {
                    if (arr2.length === 8) {
                        arr2 = []
                    }
                    if (arr2.length === 0) {
                        arr.push(arr2)
                    }
                    arr2.push(c)
                })
            }
            return arr
        }
    },
    methods: {
        handleCommand(command) {
            if (command === 'getStoreListImg') {
                this.getStoreListImg()
            } else if (command === 'open3') {
                this.open3()
            } else {
                this.goToApp()
            }

        },
        goToSearch() {
            location.assign('./search.html')
        },
        goToApp() {
            location.assign('./application.html')
        },
        GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        async getCitySearchList() {
            let result = await citySearchList(area)
            console.log(result);
            localStorage.area_id = result.data.id
        },
        async getIsShop() {
            let uid = localStorage.uid
            let result = await isaShop(uid)
            console.log(result)
            this.isshop = result.code
        },
        async getWxConfig() {

            let that = this
            let url = window.location.href
            console.log(url)

            let result = await wxConfig(url)
            result = JSON.parse(result.data)
            jssdkconfig = result
            console.log(result)

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
                        that.getRecommendList(longitude_latitude);
                        that.getShopGoodList(longitude_latitude);
                        that.getAllSort(1, longitude_latitude, 1)
                        that.getDistrict(longitude_latitude)
                    }
                });
            })
            wx.error(function (res) {
                console.log(`err:${res}`)
            });

        },
        async getStoreListImg() {
            let result = await storeImg(uid, longitude_latitude)
            console.log(result)
            this.storeImg = result.data
        },
        async addNews(content) {
            if (content === "") {
                this.$message({
                    message: '需求不能为空',
                    type: 'error',
                    duration: 1000
                })
                return
            }
            let uid = localStorage.uid
            let result = await newsAdd(uid, content)
            if (result.code === 1) {
                this.$message({
                    message: result.message,
                    type: 'success',
                    duration: 1000
                })
            }

            this.dialogFormVisible = false
            console.log(result)
        },
        async getBanner() {
            let result = await bannerList()
            this.banner = result.data
            console.log(result)
        },
        async getDistrict() {
            let result = await districts(longitude_latitude)
            this.address = result.result.ad_info.district
            localStorage.area = this.address
            this.getCitySelectList()
            console.log(result.result.ad_info.district)
        },
        async getShopCateList() {
            let result = await shopCatelist()
            this.shopCateListData = result.data
            console.log(result)
        },
        async getRecommendList() {
            let result = await recommendList(longitude_latitude, area_id)
            if (result.code === 1) {
                this.recommendList = result.data.data
                console.log(result)
            }
        },
        async getShopGoodList() {
            let result = await shopGoodList(longitude_latitude, area_id)
            if (result.code === 1) {
                this.shopGoodList = result.data
                console.log(result)
            }
        },
        async getDiscountList() {
            let result = await discountList()
            if (result.code === 1) {
                console.log(result)
                this.discountList = result.data
            }
        },
        async getAllSort(sort_status) {
            this.allLoaded = true
            this.sortPage = 1
            this.sort_status = sort_status
            let result = await allSort(sort_status, longitude_latitude, '', '', this.sortPage, area_id)
            if (result.code === 1) {
                console.log(result)
                this.allSortList = result.data.data
            }
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
                    result = await allSort(this.sort_status, longitude_latitude, '', '', this.sortPage, area_id)
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
        goTo(url, id, status) {
            location.assign(`${url}?id=${id}&status=${status}`)
        },
        goToDetail(i) {
            const url = ['./todaySale.html', './sale.html', './business.html']
            this.goTo(url[i], '',)
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
        open3() {
            this.dialogFormVisible = true
        }
    },
    created() {
        setTimeout(() => {
            // let uid = this.GetQueryString('uid')
            // localStorage.uid = uid
            // alert(localStorage.uid)
            this.getIsShop()
            this.getBanner();
            this.getShopCateList();
            this.getDiscountList();
            //定位检测
            if (localStorage.longitude_latitude) {
                if (localStorage.area) {
                    this.address = localStorage.area
                }
                this.getCitySearchList()
                this.getRecommendList(longitude_latitude);
                this.getShopGoodList(longitude_latitude);
                this.getAllSort(1, this.sortPage)
            } else {
                this.getWxConfig()
            }

        }, 100)
    },

    mounted() {
        //路由拦截
        // if (localStorage.uid === 'null') {
        //     location.assign('https://shop.zhihuimall.com.cn/app/index.php?i=1604&c=entry&mid=8811&do=shop&m=vslai_shop')
        // }

        let shopCatelist = new Swiper('#shopCatelist', {
            width: innerWidth,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        })
        setTimeout(()=>{
            let banner = new Swiper('#banner', {
                autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    disableOnInteraction: true,
                },
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                },
                width: innerWidth,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
            })
        })
        let banner = new Swiper('#banner', {
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: true,
            },
            // loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            width: innerWidth,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        })
        console.log(banner.slides.length);
        console.log(banner.activeIndex);
        if (banner.slides.length === banner.activeIndex - 1) {
            banner.slideTo(0, 1000, false);
        }
        let recommend = new Swiper('#recommend', {
            freeMode: true,
            slidesPerView: 1.3,
            spaceBetween: 20,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        })
        let shopGoodList = new Swiper('#shopGoodList', {
            freeMode: true,
            slidesPerView: 1.3,
            spaceBetween: 20,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        })
    },
})
