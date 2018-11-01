let jssdkconfig

function getBase64Image(imgElem) {
    return imgElem.replace(/^data:image\/(jpeg|jpg);base64,/, "");
}

let app = new Vue({
    el: '#app',
    data: {
        shop_name: '',
        master_name: '',
        telephone: '',
        idCard: '',
        address: '',
        jssdkconfig: '',
        localId: {
            front: '',
            back: '',
            card: '',
        }
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
        chooseImage(which) {
            let images = {
                localId: [],
                serverId: []
            };
            wx.chooseImage({
                count: 1,//设置一次能选择的图片的数量
                sizeType: ['original', 'compressed'],//指定是原图还是压缩,默认二者都有
                sourceType: ['album', 'camera'],//可以指定来源是相册还是相机,默认二者都有
                success: (res) => {
                    images.localId = res.localIds;
                    this.localId[which] = res.localIds[0];
                    alert(JSON.stringify(this.localId))
                }
            });
        },
        upLoadImg(event, which) {
            console.log(event);
            var formData = new FormData();
            formData.append("file", event.target.files[0]);
            $.ajax({
                url: 'https://shop.zhihuimall.com.cn:443/zhihuishop/public/index.php/api/allarea/uploadimg',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,    //不可缺
                processData: false,    //不可缺
                success: (res) => {
                    console.log(res.data)
                    this.localId[which] = res.data;
                    alert(JSON.stringify(this.localId))
                }
            });

            // var input = event.target;
            // var reader = new FileReader();
            // reader.onload = function () {
            //     alert(reader)
            //     // var database64 = getBase64Image(reader.result);
            //     $.ajax({
            //         url: Base_url + '/api/allarea/uploadimg',
            //         type: "POST",
            //         dataType:'',
            //         data: {"url": reader.result},
            //         success: function (data) {
            //             var url = data["data"];
            //             $("#user_img").attr("src", url);
            //             alert(data)
            //         }
            //     });
            // };
            // reader.readAsDataURL(input.files[0]);
        }
    },
    created() {
        setTimeout(() => {
            this.getWxConfig()
        }, 100)
    },
})
