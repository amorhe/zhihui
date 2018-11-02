let app = new Vue({
    el: "#app",
    data: {
        baseImgUrl:ImgBaseUrl,
        shopList: [],
        page: 1,
        allLoaded: true,
        loading: false,//判断是否加载数据
        loading_more: true,//控制是否发送ajax请求
    },
    methods: {
        back() {
            history.go(-1)
        },
        goTo(url, id, status) {
            location.assign(`${url}?id=${id}&status=${status}`)
        },
        GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        async getStoreList(page) {
            let result = await informationDiscountList(longitude_latitude, this.page,area_id)
            if (result.code === 0) {
                alert(result.message)
            }
            if (result.code === 1) {
                console.log(result.data)
                this.shopList = result.data
            }
        },
        async loadingMore() {
            if (this.allLoaded === false) {
                return
            }
            if ($(window).scrollTop() + $(window).height() + 100 >= $(document).height()) {
                // alert(1)
                this.allLoaded = false
                this.loading = true;
                this.page++;
                let result
                if (this.loading_more) {
                    this.loading_more = false //禁止浏览器发送ajax请求
                    result = await informationDiscountList(longitude_latitude, this.page,area_id)
                    if (result.code === 1) {//判断接受是否成功
                        this.loading = false
                        if (this.shopList.length === result.data.total) {
                            return
                        } else {

                            this.loading_more = true
                            this.shopList = [...this.shopList, ...result.data];
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
    },
    mounted() {
        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html')
        }

        let id = this.GetQueryString('id')
        setTimeout(() => {
            this.getStoreList(id, longitude_latitude)
        })
    },
})
