let app = new Vue({
    el: "#app",
    data: {
        form: {
            name: '',
        },
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        shopCateListData: [],
        allSortList: [],
        sort_status: 1,
        sortPage: 1,
        address: '',
        allLoaded: true,
        loading: false,//判断是否加载数据
        loading_more: true,//控制是否发送ajax请求
        index_foot: [1, 0, 0],
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
        async getShopCateList() {
            let result = await twoShopCateList(this.GetQueryString('id'))
            this.shopCateListData = result.data
            console.log(result)
        },
        async getAllSort(sort_status,sortPage) {
            this.allLoaded = true
            this.sortPage = 1
            this.index_foot = [0, 0, 0]
            this.index_foot[sort_status - 1] = 1
            this.sort_status = sort_status

            let result = await allSort(sort_status, longitude_latitude,2,this.GetQueryString('id'), sortPage,area_id)
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
                    result = await allSort(this.sort_status, longitude_latitude, 1,this.GetQueryString('id') ,this.sortPage,area_id)
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
    },
    created() {
        setTimeout(() => {
            this.getShopCateList();
            this.getAllSort(1,this.sortPage)

            if (localStorage.longitude_latitude) {
                if (localStorage.area) {
                    this.address = localStorage.area
                }
            }
        },100)
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
    },
})
