let app = new Vue({
    el: "#app",
    data: {
        historysearchList: '',
        search_key: '',
        hotSearchList: [],
        shopList: [],
        page: 1,
        longitude_latitude: '',
        allLoaded: true,
        loading: false,//判断是否加载数据
        loading_more: true,//控制是否发送ajax请求
    },
    computed:{
        color(){
            let arr = []
            for (let i = 0; i < 30 ; i++){
                let h =  Math.floor(Math.random() * 255)+1
                arr.push(h)
            }
            return arr
        }
    },
    methods: {
        back() {
            history.go(-1)
        },
        goTo(url, id, longitude_latitude, status) {
            location.assign(`${url}?id=${id}&longitude_latitude=${longitude_latitude}&status=${status}`)
        },
        goToSearch(search_key) {
            if (search_key === '') {
                this.$message({
                    message: '搜索条件不能为空',
                    type: 'error',
                })
                return
            }
            location.assign(`./searchResult.html?search_key=${search_key}`)
        },
        GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },

        async getHotSearchList() {
            let result = await hotSearchList()
            if (result.code === 0) {
                alert(result.message)
            }
            if (result.code === 1) {
                console.log(result.data)
                this.hotSearchList = result.data
            }
        },
        async getHistorySearchList() {
            let uid = localStorage.uid
            let result = await historySearchList(uid)
            if (result.code === 0) {
                alert(result.message)
            }
            if (result.code === 1) {
                console.log(result.data)
                this.historysearchList = result.data
            }
        },
        async deleteHistoryList() {
            let uid = localStorage.uid
            let result = await deleteHistory(uid)
            if (result.code === 0) {
                alert(result.message)
            }
            if (result.code === 1) {
                console.log(result.data)
                window.history.go(0)
            }
        }

    },
    mounted() {
        //路由拦截。。。
        // if (!localStorage.longitude_latitude) {
        //     location.assign('./index.html')
        // }

        setTimeout(() => {
            this.getHotSearchList()
            this.getHistorySearchList()
        })

    },
})
