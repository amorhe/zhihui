let app = new Vue({
    el: "#app",
    data: {
        search_key: '',
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        address: '',
        list:[],
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
        goTo(url, id, status) {
            location.assign(`${url}?id=${id}&status=${status}`)
        },
        async getList() {
            let result = await moreShopCateList()
            console.log(result);
            if (result.code === 1){
                this.list = result.data
            }
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
            wx.ready()
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
            this.getList()
        })

    },

    mounted() {
        //路由拦截
        // if (localStorage.uid === 'null') {
        //     location.assign('https://shop.zhihuimall.com.cn/app/index.php?i=1604&c=entry&mid=8811&do=shop&m=vslai_shop')
        // }

    }
})
