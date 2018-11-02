let app = new Vue({
    el: "#app",
    data: {
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
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
        goToSearch(){
            location.assign('./search.html')
        },
        GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        async getShopGoodsSearchList() {
            let search_key = this.getRequest().search_key
            let uid = localStorage.uid
            let result = await shopGoodsSearchList(search_key, longitude_latitude, uid,area_id)
            this.allSortList = result.data
            console.log(result)
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
                    result = await allSort(this.sort_status, longitude_latitude, this.sortPage)
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
        goTo(url, id, longitude_latitude, status) {
            location.assign(`${url}?id=${id}&status=${status}`)
        },
        getRequest() {
            var url = window.location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
    },
    created() {
        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html')
        }

        setTimeout(() => {
            this.getShopGoodsSearchList()
        })
    },

    mounted() {

    },
})
