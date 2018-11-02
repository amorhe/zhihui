"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = new Vue({
    el: "#app",
    data: {
        baseImgUrl: ImgBaseUrl,
        shopList: [],
        page: 1,
        allLoaded: true,
        loading: false, //判断是否加载数据
        loading_more: true //控制是否发送ajax请求
    },
    methods: {
        back: function back() {
            history.go(-1);
        },
        goTo: function goTo(url, id, status) {
            location.assign(url + "?id=" + id + "&status=" + status);
        },
        GetQueryString: function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getStoreList: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(page) {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return informationDiscountList(longitude_latitude, this.page, area_id);

                            case 2:
                                result = _context.sent;

                                if (result.code === 0) {
                                    alert(result.message);
                                }
                                if (result.code === 1) {
                                    console.log(result.data);
                                    this.shopList = result.data;
                                }

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getStoreList(_x) {
                return _ref.apply(this, arguments);
            }

            return getStoreList;
        }(),
        loadingMore: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var _this = this;

                var result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.allLoaded === false)) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt("return");

                            case 2:
                                if (!($(window).scrollTop() + $(window).height() + 100 >= $(document).height())) {
                                    _context2.next = 26;
                                    break;
                                }

                                // alert(1)
                                this.allLoaded = false;
                                this.loading = true;
                                this.page++;
                                result = void 0;

                                if (!this.loading_more) {
                                    _context2.next = 25;
                                    break;
                                }

                                this.loading_more = false; //禁止浏览器发送ajax请求
                                _context2.next = 11;
                                return informationDiscountList(longitude_latitude, this.page, area_id);

                            case 11:
                                result = _context2.sent;

                                if (!(result.code === 1)) {
                                    _context2.next = 22;
                                    break;
                                }

                                //判断接受是否成功
                                this.loading = false;

                                if (!(this.shopList.length === result.data.total)) {
                                    _context2.next = 18;
                                    break;
                                }

                                return _context2.abrupt("return");

                            case 18:

                                this.loading_more = true;
                                this.shopList = [].concat(_toConsumableArray(this.shopList), _toConsumableArray(result.data));

                            case 20:
                                _context2.next = 23;
                                break;

                            case 22:
                                setTimeout(function () {
                                    _this.loading = false;
                                    _this.loading_more = true;
                                }, 1000);

                            case 23:
                                _context2.next = 26;
                                break;

                            case 25:
                                this.loading = false;

                            case 26:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function loadingMore() {
                return _ref2.apply(this, arguments);
            }

            return loadingMore;
        }()
    },
    mounted: function mounted() {
        var _this2 = this;

        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html');
        }

        var id = this.GetQueryString('id');
        setTimeout(function () {
            _this2.getStoreList(id, longitude_latitude);
        });
    }
});

//# sourceMappingURL=business-compile.js.map