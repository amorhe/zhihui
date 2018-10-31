let jssdkconfig
let app = new Vue({
    el: '#app',
    data: {
        shop_name: '',
        master_name: '',
        telephone: '',
        idCard: '',
        address: '',
        jssdkconfig: '',
        localId:''
    },
    methods: {
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
                    'chooseImage',
                    'uploadImage',
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
                    }
                });
            })
            wx.error(function (res) {
                console.log(`err:${res}`)
            });

        },
        chooseImage() {
            let images = {
                localId: [],
                serverId: []
            };
            wx.chooseImage({
                count:1,//设置一次能选择的图片的数量
                sizeType:['original','compressed'],//指定是原图还是压缩,默认二者都有
                sourceType:['album','camera'],//可以指定来源是相册还是相机,默认二者都有
                success:  (res) => {
                    images.localId = res.localIds;
                    this.localId = res.localIds[0];
                    alert(res)
                }
            });
        },
        upLoadImg(){
            if (images.localId.length == 0) {
                alert('请先使用 chooseImage 接口选择图片');
                return;
            }
            var i = 0, length = images.localId.length;
            images.serverId = [];
            function upload() {
                wx.uploadImage({
                    localId: images.localId[i],
                    isShowProgressTips: 1,
                    success: function (res) {
                        i++;
                        //alert('已上传：' + i + '/' + length);
                        images.serverId.push(res.serverId);
                        if (i < length) {
                            upload();
                        }
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
            upload();
        }

    },
    created() {
        setTimeout(() => {
            this.getWxConfig()
        }, 100)
    },
})
