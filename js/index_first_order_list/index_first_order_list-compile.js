'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = new Vue({
    el: "#app",
    data: {
        form: {
            name: ''
        },
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        shopCateListData: [],
        allSortList: [],
        sort_status: 1,
        sortPage: 1,
        address: '',
        allLoaded: true,
        loading: false, //判断是否加载数据
        loading_more: true, //控制是否发送ajax请求
        index_foot: [1, 0, 0]
    },
    computed: {
        cate: function cate() {
            var arr = [];
            var arr2 = [];
            if (this.shopCateListData) {
                this.shopCateListData.forEach(function (c) {
                    if (arr2.length === 8) {
                        arr2 = [];
                    }
                    if (arr2.length === 0) {
                        arr.push(arr2);
                    }
                    arr2.push(c);
                });
            }

            return arr;
        }
    },
    methods: {
        goToSearch: function goToSearch() {
            location.assign('./search.html');
        },
        goToApp: function goToApp() {
            location.assign('./application.html');
        },
        GetQueryString: function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getShopCateList: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return twoShopCateList(this.GetQueryString('id'));

                            case 2:
                                result = _context.sent;

                                this.shopCateListData = result.data;
                                console.log(result);

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getShopCateList() {
                return _ref.apply(this, arguments);
            }

            return getShopCateList;
        }(),
        getAllSort: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(sort_status, sortPage) {
                var result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.allLoaded = true;
                                this.sortPage = 1;
                                this.index_foot = [0, 0, 0];
                                this.index_foot[sort_status - 1] = 1;
                                this.sort_status = sort_status;

                                _context2.next = 7;
                                return allSort(sort_status, longitude_latitude, 1, this.GetQueryString('id'), sortPage, area_id);

                            case 7:
                                result = _context2.sent;

                                if (result.code === 1) {
                                    console.log(result);
                                    this.allSortList = result.data.data;
                                }

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getAllSort(_x, _x2) {
                return _ref2.apply(this, arguments);
            }

            return getAllSort;
        }(),
        loadingMore: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this = this;

                var result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!(this.allLoaded === false)) {
                                    _context3.next = 2;
                                    break;
                                }

                                return _context3.abrupt('return');

                            case 2:
                                if (!($(window).scrollTop() + $(window).height() + 100 >= $(document).height())) {
                                    _context3.next = 27;
                                    break;
                                }

                                // console.log(1)
                                this.allLoaded = false;
                                this.loading = true;
                                this.sortPage++;
                                result = void 0;

                                if (!this.loading_more) {
                                    _context3.next = 26;
                                    break;
                                }

                                this.loading_more = false; //禁止浏览器发送ajax请求
                                _context3.next = 11;
                                return allSort(this.sort_status, longitude_latitude, 1, this.GetQueryString('id'), this.sortPage, area_id);

                            case 11:
                                result = _context3.sent;

                                if (!(result.code === 1)) {
                                    _context3.next = 23;
                                    break;
                                }

                                //判断接受是否成功
                                this.loading = false;
                                console.log(this.allSortList.length, result.data.total);

                                if (!(this.allSortList.length === result.data.total)) {
                                    _context3.next = 19;
                                    break;
                                }

                                return _context3.abrupt('return');

                            case 19:
                                this.loading_more = true;
                                this.allSortList = [].concat(_toConsumableArray(this.allSortList), _toConsumableArray(result.data.data));

                            case 21:
                                _context3.next = 24;
                                break;

                            case 23:
                                setTimeout(function () {
                                    _this.loading = false;
                                    _this.loading_more = true;
                                }, 1000);

                            case 24:
                                _context3.next = 27;
                                break;

                            case 26:
                                this.loading = false;

                            case 27:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function loadingMore() {
                return _ref3.apply(this, arguments);
            }

            return loadingMore;
        }(),
        goTo: function goTo(url, id, status) {
            location.assign(url + '?id=' + id + '&status=' + status);
        },
        goToDetail: function goToDetail(i) {
            var url = ['./todaySale.html', './sale.html', './business.html'];
            this.goTo(url[i], '');
        },
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
        var _this2 = this;

        setTimeout(function () {
            _this2.getShopCateList();
            _this2.getAllSort(1, _this2.sortPage);

            if (localStorage.longitude_latitude) {
                if (localStorage.area) {
                    _this2.address = localStorage.area;
                }
            }
        }, 100);
    },
    mounted: function mounted() {
        //路由拦截
        // if (localStorage.uid === 'null') {
        //     location.assign('https://shop.zhihuimall.com.cn/app/index.php?i=1604&c=entry&mid=8811&do=shop&m=vslai_shop')
        // }

        var shopCatelist = new Swiper('#shopCatelist', {
            width: innerWidth,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true //修改swiper的父元素时，自动初始化swiper
        });
    }
});

//# sourceMappingURL=index_first_order_list-compile.js.map