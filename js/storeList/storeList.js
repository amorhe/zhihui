let app = new Vue({
    el: "#app",
    data: {
        baseImgUrl:ImgBaseUrl,
        id:0,
        shopCateListData:[],
        shopList: [],
        longitude_latitude: '',
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

        let longitude_latitude = this.GetQueryString('longitude_latitude')
        this.longitude_latitude = longitude_latitude
        let id = this.GetQueryString('id')
        this.id = id
        setTimeout(() => {
            this.getStoreList(this.id,this.longitude_latitude, this.page)
            this.getShopCateList()
        })
    },
    methods: {
        async getShopCateList() {
            let result = await shopCatelist()
            result = result.data.filter(item => item.id === this.id - 0)
            this.shopCateListData = result[0].catename
            document.title = this.shopCateListData
        },
        back() {
            history.go(-1)
        },
        goTo(url, id, longitude_latitude, status) {
            location.assign(`${url}?id=${id}&longitude_latitude=${longitude_latitude}&status=${status}`)
        },
        GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        async getStoreList(id,longitude_latitude, page) {
            let result = await storeList(id,longitude_latitude, page)
            if (result.code === 0) {
                console.log(result.message)
            }
            if (result.code === 1) {
                console.log(result.data)
                this.shopList = result.data.data
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
                    result = await storeList(this.id,this.longitude_latitude, this.page)
                    if (result.code === 1) {//判断接受是否成功
                        this.loading = false
                        // console.log(this.allSortList.length, result.data.total)
                        if (this.shopList.length === result.data.total + 1) {
                            console.log('没有更多数据')
                            return
                        } else {
                            this.loading_more = true
                            this.shopList = [...this.shopList, ...res.data.data];
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
