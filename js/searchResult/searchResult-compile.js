'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = new Vue({
    el: "#app",
    data: {
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        allSortList: [],
        sort_status: 1,
        sortPage: 1,
        index_foot: [1, 0, 0],
        address: '',
        allLoaded: true,
        loading: false, //判断是否加载数据
        loading_more: true //控制是否发送ajax请求
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
        goToSearch: function goToSearch() {
            location.assign('./search.html');
        },
        GetQueryString: function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getShopGoodsSearchList: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var search_key, uid, result, obj, arr, i, a;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                search_key = this.getRequest().search_key;
                                uid = localStorage.uid;
                                _context.next = 4;
                                return shopGoodsSearchList(search_key, longitude_latitude, uid, area_id);

                            case 4:
                                result = _context.sent;

                                if (result.code === 1) {
                                    if (result.data !== null) {
                                        obj = {};
                                        arr = [];

                                        for (i = 0; i < result.data.length; i++) {
                                            // console.log(result.data[i]);
                                            if (result.data[i] !== null) {
                                                for (a in result.data[i]) {
                                                    // console.log(a);
                                                    // console.log(result.data[i][a]);
                                                    obj[a] = result.data[i][a];
                                                    // console.log(`obj:${JSON.stringify(obj)}`);
                                                }
                                                arr.push(obj);
                                                // console.log(arr);
                                            }
                                        }
                                        this.allSortList = arr;
                                        console.log(this.allSortList);
                                        console.log(_typeof(result.data[0]));
                                    }
                                }

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getShopGoodsSearchList() {
                return _ref.apply(this, arguments);
            }

            return getShopGoodsSearchList;
        }(),
        loadingMore: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var _this = this;

                var result, obj, arr, i, a;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.allLoaded === false)) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt('return');

                            case 2:
                                if (!($(window).scrollTop() + $(window).height() + 100 >= $(document).height())) {
                                    _context2.next = 30;
                                    break;
                                }

                                // console.log(1)
                                this.allLoaded = false;
                                this.loading = true;
                                this.sortPage++;
                                result = void 0;

                                if (!this.loading_more) {
                                    _context2.next = 29;
                                    break;
                                }

                                this.loading_more = false; //禁止浏览器发送ajax请求
                                _context2.next = 11;
                                return allSort(this.sort_status, longitude_latitude, this.sortPage);

                            case 11:
                                result = _context2.sent;

                                if (!(result.code === 1)) {
                                    _context2.next = 26;
                                    break;
                                }

                                //判断接受是否成功
                                this.loading = false;
                                console.log(this.allSortList.length, result.data.total);

                                if (!(this.allSortList.length === result.data.total)) {
                                    _context2.next = 19;
                                    break;
                                }

                                return _context2.abrupt('return');

                            case 19:
                                this.loading_more = true;
                                obj = {};
                                arr = [];

                                if (result.code === 1) {
                                    if (result.data !== null) {
                                        for (i = 0; i < result.data.length; i++) {
                                            // console.log(result.data[i]);
                                            if (result.data[i] !== null) {
                                                for (a in result.data[i]) {
                                                    // console.log(a);
                                                    // console.log(result.data[i][a]);
                                                    obj[a] = result.data[i][a];
                                                    // console.log(`obj:${JSON.stringify(obj)}`);
                                                }
                                                arr.push(obj);
                                                // console.log(arr);
                                            }
                                        }
                                        this.allSortList = arr;
                                        console.log(this.allSortList);
                                        console.log(_typeof(result.data[0]));
                                    }
                                }
                                this.allSortList = [].concat(_toConsumableArray(this.allSortList), arr);

                            case 24:
                                _context2.next = 27;
                                break;

                            case 26:
                                setTimeout(function () {
                                    _this.loading = false;
                                    _this.loading_more = true;
                                }, 1000);

                            case 27:
                                _context2.next = 30;
                                break;

                            case 29:
                                this.loading = false;

                            case 30:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function loadingMore() {
                return _ref2.apply(this, arguments);
            }

            return loadingMore;
        }(),
        goTo: function goTo(url, id, longitude_latitude, status) {
            location.assign(url + '?id=' + id + '&status=' + status);
        },
        getRequest: function getRequest() {
            var url = window.location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
    },
    created: function created() {
        var _this2 = this;

        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html');
        }

        setTimeout(function () {
            _this2.getShopGoodsSearchList();
        });
    },
    mounted: function mounted() {}
});

//# sourceMappingURL=searchResult-compile.js.map