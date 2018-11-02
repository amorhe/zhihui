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
    mounted: function mounted() {
        var _this = this;

        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html');
        }
        setTimeout(function () {
            _this.getStoreList(1);
        });
    },

    methods: {
        loadingMore: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _this2 = this;

                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(this.allLoaded === false)) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt("return");

                            case 2:
                                if (!($(window).scrollTop() + $(window).height() + 100 >= $(document).height())) {
                                    _context.next = 27;
                                    break;
                                }

                                // alert(1)
                                this.allLoaded = false;
                                this.loading = true;
                                this.page++;
                                result = void 0;

                                if (!this.loading_more) {
                                    _context.next = 26;
                                    break;
                                }

                                this.loading_more = false; //禁止浏览器发送ajax请求
                                _context.next = 11;
                                return firmDiscountList(longitude_latitude, this.page, area_id);

                            case 11:
                                result = _context.sent;

                                if (!(result.code === 1)) {
                                    _context.next = 23;
                                    break;
                                }

                                //判断接受是否成功
                                this.loading = false;
                                console.log(this.allSortList.length, result.data.total);

                                if (!(this.allSortList.length === result.data.total)) {
                                    _context.next = 19;
                                    break;
                                }

                                return _context.abrupt("return");

                            case 19:

                                this.loading_more = true;
                                this.shopList = [].concat(_toConsumableArray(this.shopList), _toConsumableArray(result.data.data));

                            case 21:
                                _context.next = 24;
                                break;

                            case 23:
                                setTimeout(function () {
                                    _this2.loading = false;
                                    _this2.loading_more = true;
                                }, 1000);

                            case 24:
                                _context.next = 27;
                                break;

                            case 26:
                                this.loading = false;

                            case 27:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function loadingMore() {
                return _ref.apply(this, arguments);
            }

            return loadingMore;
        }(),
        back: function back() {
            history.go(-1);
        },
        goTo: function goTo(url, id, longitude_latitude, status) {
            location.assign(url + "?id=" + id + "&longitude_latitude=" + longitude_latitude + "&status=" + status);
        },
        GetQueryString: function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getStoreList: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(page) {
                var result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return firmDiscountList(longitude_latitude, page, area_id);

                            case 2:
                                result = _context2.sent;

                                if (result.code === 0) {
                                    alert(result.message);
                                }
                                if (result.code === 1) {
                                    console.log(result.data);
                                    this.shopList = result.data.data;
                                }

                            case 5:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getStoreList(_x) {
                return _ref2.apply(this, arguments);
            }

            return getStoreList;
        }()
    }
});

//# sourceMappingURL=sale-compile.js.map