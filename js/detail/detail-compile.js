'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function removeSameItem(arr) {
    return Array.from(new Set(arr));
}

var jssdkconfig = void 0;
var app = new Vue({
    el: "#app",
    data: {
        dataSelect: -1,
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        show3: false,
        selected: -1,
        status: '',
        store_id: '',
        alert: false,
        detail: {},
        longitude_latitude: '',
        page: 1,
        allLoaded: true,
        loading: false, //判断是否加载数据
        loading_more: true //控制是否发送ajax请求
    },
    computed: {
        timeSel: function timeSel() {
            if (this.detail.shop_goods_time) {
                var arr = [];
                arr = this.detail.shop_goods_time.map(function (item) {
                    return item.rule;
                });
                arr = removeSameItem(arr);
                return arr;
            }
        }
    },
    mounted: function mounted() {
        var _this = this;

        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html');
        }

        var mySwiper = new Swiper('.swiper-container', {
            width: innerWidth,
            slidesPerView: 6,
            freeMode: true,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true //修改swiper的父元素时，自动初始化swiper
        });

        var store_id = this.GetQueryString('id');
        this.store_id = store_id;
        var status = this.GetQueryString('status');
        this.status = status;
        setTimeout(function () {
            _this.getWxConfig();
        });
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
                                if (jssdkconfig) {
                                    localStorage.setItem('jsdk', jssdkconfig);
                                    console.log(jssdkconfig.appId, jssdkconfig.timestamp, jssdkconfig.nonceStr, jssdkconfig.signature);
                                }

                                wx.config({
                                    debug: false,
                                    appId: jssdkconfig.appId,
                                    timestamp: jssdkconfig.timestamp,
                                    nonceStr: jssdkconfig.nonceStr,
                                    signature: jssdkconfig.signature,
                                    jsApiList: ['openLocation', 'getLocation']
                                });
                                wx.ready(function () {
                                    wx.checkJsApi({
                                        jsApiList: ['getNetworkType', 'previewImage', 'getLocation'],
                                        success: function success(res) {
                                            console.log(JSON.stringify(res));
                                        }
                                    });
                                    wx.getLocation({
                                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                        success: function success(res) {
                                            console.log(JSON.stringify(res));
                                            // alert(localStorage.jsdk)
                                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                            that.longitude_latitude = longitude + ',' + latitude;

                                            that.getStoreList(that.store_id, that.longitude_latitude, that.status);
                                        }
                                    });
                                });

                                wx.error(function (res) {
                                    console.log('err:' + res);
                                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                                });
                                // https://shop.zhihuimall.com.cn/app/index.php?i=1604&c=entry&mid=8811&do=shop&m=vslai_shop&p=location&latitude=30.25961&longitude=120.13026

                            case 14:
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
        selectDate: function selectDate(index) {
            this.dataSelect = index;
        },
        toMap: function toMap() {
            var that = this;
            // location.href = `./map.html?longitude_latitude=${this.detail.longitude_latitude}&title=${encodeURIComponent(this.detail.address)}&content=${encodeURIComponent(this.detail.shop_name)}`
            wx.openLocation({
                latitude: that.detail.longitude_latitude.split(',')[1] - 0, // 纬度，浮点数，范围为90 ~ -90
                longitude: that.detail.longitude_latitude.split(',')[0] - 0, // 经度，浮点数，范围为180 ~ -180。
                name: that.detail.shop_name, // 位置名
                address: that.detail.address, // 地址详情说明
                scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        },
        toDetail: function toDetail() {
            location.href = './room_booking.html';
        },
        back: function back() {
            history.go(-1);
        },
        showDetail: function showDetail(i) {
            this.show3 = i;
        },
        filterTime: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(v, i) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.selected = i;
                                _context2.next = 3;
                                return this.getStoreList(this.store_id, this.longitude_latitude, this.status);

                            case 3:
                                if (this.detail.shop_goods) {
                                    this.detail.shop_goods = this.detail.shop_goods.filter(function (item) {
                                        return item.rule === v;
                                    });
                                }

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function filterTime(_x, _x2) {
                return _ref2.apply(this, arguments);
            }

            return filterTime;
        }(),
        GetQueryString: function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getStoreList: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(store_id, longitude_latitude, status) {
                var result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return allShopGoodList(store_id, longitude_latitude, status);

                            case 2:
                                result = _context3.sent;

                                if (result.code === 0) {
                                    alert(result.message);
                                }
                                if (result.code === 1) {
                                    console.log(result.data);
                                    this.detail = result.data;
                                }

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getStoreList(_x3, _x4, _x5) {
                return _ref3.apply(this, arguments);
            }

            return getStoreList;
        }()
    }
});

//# sourceMappingURL=detail-compile.js.map