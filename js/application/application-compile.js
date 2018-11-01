'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var jssdkconfig = void 0;

function getBase64Image(imgElem) {
    return imgElem.replace(/^data:image\/(jpeg|jpg);base64,/, "");
}

var app = new Vue({
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
            card: ''
        }
    },
    methods: {
        getWxConfig: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var that, url, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                that = this;
                                url = window.location.href;

                                console.log(url);

                                _context.next = 5;
                                return wxConfig(url);

                            case 5:
                                result = _context.sent;

                                result = JSON.parse(result.data);
                                this.jssdkconfig = result;
                                console.log(result);
                                jssdkconfig = this.jssdkconfig;

                                wx.config({
                                    debug: false,
                                    appId: jssdkconfig.appId,
                                    timestamp: jssdkconfig.timestamp,
                                    nonceStr: jssdkconfig.nonceStr,
                                    signature: jssdkconfig.signature,
                                    jsApiList: ['getLocation', 'chooseImage', 'uploadImage']
                                });

                                wx.ready(function () {
                                    wx.getLocation({
                                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                        success: function success(res) {
                                            console.log(JSON.stringify(res));
                                            // console.log(localStorage.jsdk)
                                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                            localStorage.longitude_latitude = longitude + ',' + latitude;
                                            that.longitude_latitude = longitude + ',' + latitude;
                                            localStorage.setItem('longitude_latitude', that.longitude_latitude);
                                        }
                                    });
                                });
                                wx.error(function (res) {
                                    console.log('err:' + res);
                                });

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getWxConfig() {
                return _ref.apply(this, arguments);
            }

            return getWxConfig;
        }(),
        chooseImage: function chooseImage(which) {
            var _this = this;

            var images = {
                localId: [],
                serverId: []
            };
            wx.chooseImage({
                count: 1, //设置一次能选择的图片的数量
                sizeType: ['original', 'compressed'], //指定是原图还是压缩,默认二者都有
                sourceType: ['album', 'camera'], //可以指定来源是相册还是相机,默认二者都有
                success: function success(res) {
                    images.localId = res.localIds;
                    _this.localId[which] = res.localIds[0];
                    alert(JSON.stringify(_this.localId));
                }
            });
        },
        upLoadImg: function upLoadImg(event, which) {
            var _this2 = this;

            console.log(event);
            var formData = new FormData();
            formData.append("file", event.target.files[0]);
            $.ajax({
                url: 'https://shop.zhihuimall.com.cn:443/zhihuishop/public/index.php/api/allarea/uploadimg',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false, //不可缺
                processData: false, //不可缺
                success: function success(res) {
                    console.log(res.data);
                    _this2.localId[which] = res.data;
                    alert(JSON.stringify(_this2.localId));
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
    created: function created() {
        var _this3 = this;

        setTimeout(function () {
            _this3.getWxConfig();
        }, 100);
    }
});

//# sourceMappingURL=application-compile.js.map