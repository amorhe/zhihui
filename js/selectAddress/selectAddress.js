let app = new Vue({
    el: "#app",
    data: {
        search_key: '',
        citySelectLists:''
    },
    methods: {
        back() {
            history.go(-1)
        },
        changeAddress(lat_lng,area_id,area){
            localStorage.longitude_latitude = lat_lng
            localStorage.area_id = area_id
            localStorage.area = area
            window.location.assign('./index.html')
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
        async getCitySelectList(){
            let result = await citySelectList()
            console.log(result)
            if (result.code === 1){
                this.citySelectLists = result.data
            }
        }
    },
    mounted() {
        //路由拦截。。。
        // if (!localStorage.longitude_latitude) {
        //     location.assign('./index.html')
        // }

        setTimeout(() => {
            this.getCitySelectList()
        })

    },
})
