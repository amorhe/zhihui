'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = new Vue({
    el: "#app",
    data: {
        search_key: '',
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        address: '',
        list: []
    },
    computed: {
        cate: function cate() {
            var arr = [];
            var arr2 = [];
            this.shopCateListData.forEach(function (c) {
                if (arr2.length === 8) {
                    arr2 = [];
                }
                if (arr2.length === 0) {
                    arr.push(arr2);
                }
                arr2.push(c);
            });
            return arr;
        }
    },
    methods: {
        GetQueryString: function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        goTo: function goTo(url, id, status) {
            location.assign(url + '?id=' + id + '&status=' + status);
        },
        getList: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return moreShopCateList();

                            case 2:
                                result = _context.sent;

                                console.log(result);
                                if (result.code === 1) {
                                    this.list = result.data;
                                }

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getList() {
                return _ref.apply(this, arguments);
            }

            return getList;
        }(),
        getWxConfig: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var that, url, result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                that = this;
                                url = window.location.href;

                                console.log(url);

                                _context2.next = 5;
                                return wxConfig(url);

                            case 5:
                                result = _context2.sent;

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
                                    jsApiList: ['getLocation']
                                });
                                wx.ready();

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getWxConfig() {
                return _ref2.apply(this, arguments);
            }

            return getWxConfig;
        }(),
        getRequest: function getRequest() {
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
        }
    },
    created: function created() {
        var _this = this;

        setTimeout(function () {
            _this.getList();
        });
    },
    mounted: function mounted() {
        //路由拦截
        // if (localStorage.uid === 'null') {
        //     location.assign('https://shop.zhihuimall.com.cn/app/index.php?i=1604&c=entry&mid=8811&do=shop&m=vslai_shop')
        // }

    }
});

//# sourceMappingURL=allList-compile.js.map