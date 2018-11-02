let app = new Vue({
    el: "#app",
    data: {
        baseImgUrl: ImgBaseUrl,
        shopList: [],
        page: 1,
        allLoaded: true,
        loading: false,//判断是否加载数据
        loading_more: true,//控制是否发送ajax请求
    },
    mounted() {
        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html')
        }
        setTimeout(() => {
            this.getStoreList(longitude_latitude, this.page)
        })
    },
    methods: {
        goTo(url, id, status) {
            location.assign(`${url}?id=${id}&status=${status}`)
        },
        back() {
            history.go(-1)
        },
        GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        async getStoreList(page) {
            let result = await todayDiscountList(longitude_latitude, page, area_id)
            if (result.code === 0) {
                alert(result.message)
            }
            if (result.code === 1) {
                console.log(result.data)
                let arr = []
                for (let i in result.data) {
                    arr.push(result.data[i])
                }
                this.shopList = arr
                console.log(arr);
                if (this.shopList.length === result.data.total + 1) {
                    this.allLoaded = false
                }
            }
        },
        async loadingMore() {
            if (this.allLoaded === false) {
                return
            }
            if ($(window).scrollTop() + $(window).height() + 10 >= $(document).height()) {
                this.allLoaded = false
                this.loading = true;
                this.page++;
                let result
                if (this.loading_more) {
                    this.loading_more = false //禁止浏览器发送ajax请求
                    result = await todayDiscountList(longitude_latitude, this.page, area_id)
                    if (result.code === 1) {//判断接受是否成功
                        this.loading = false
                        // console.log(this.allSortList.length, result.data.total)
                        if (this.shopList.length === result.data.total + 1) {
                            console.log('没有更多数据')
                            return
                        } else {
                            this.loading_more = true
                            let arr = []
                            for (let i in result.data) {
                                arr.push(result.data[i])
                            }
                            this.shopList = arr
                            this.shopList = [...this.shopList, ...arr];
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
    }
})
