'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = new Vue({
    el: "#app",
    data: {
        dialogFormVisible: false,
        form: {
            name: ''
        },
        isshop: '',
        addnews: "",
        storeImg: '',
        jssdkconfig: '',
        baseImgUrl: ImgBaseUrl,
        banner: [],
        shopCateListData: [],
        recommendList: [],
        shopGoodList: [],
        discountList: [],
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
        handleCommand: function handleCommand(command) {
            if (command === 'getStoreListImg') {
                this.getStoreListImg();
            } else if (command === 'open3') {
                this.open3();
            } else {
                this.goToApp();
            }
        },
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
        getCitySearchList: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return citySearchList(area);

                            case 2:
                                result = _context.sent;

                                console.log(result);
                                localStorage.area_id = result.data.id;

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getCitySearchList() {
                return _ref.apply(this, arguments);
            }

            return getCitySearchList;
        }(),
        getIsShop: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var uid, result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                uid = localStorage.uid;
                                _context2.next = 3;
                                return isaShop(uid);

                            case 3:
                                result = _context2.sent;

                                console.log(result);
                                this.isshop = result.code;

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getIsShop() {
                return _ref2.apply(this, arguments);
            }

            return getIsShop;
        }(),
        getWxConfig: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var that, url, result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                that = this;
                                url = window.location.href;

                                console.log(url);

                                _context3.next = 5;
                                return wxConfig(url);

                            case 5:
                                result = _context3.sent;

                                result = JSON.parse(result.data);
                                jssdkconfig = result;
                                console.log(result);

                                wx.config({
                                    debug: false,
                                    appId: jssdkconfig.appId,
                                    timestamp: jssdkconfig.timestamp,
                                    nonceStr: jssdkconfig.nonceStr,
                                    signature: jssdkconfig.signature,
                                    jsApiList: ['getLocation']
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
                                            that.getRecommendList(longitude_latitude);
                                            that.getShopGoodList(longitude_latitude);
                                            that.getAllSort(1, longitude_latitude, 1);
                                            that.getDistrict(longitude_latitude);
                                        }
                                    });
                                });
                                wx.error(function (res) {
                                    console.log('err:' + res);
                                });

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getWxConfig() {
                return _ref3.apply(this, arguments);
            }

            return getWxConfig;
        }(),
        getStoreListImg: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var result;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return storeImg(uid, longitude_latitude);

                            case 2:
                                result = _context4.sent;

                                console.log(result);
                                this.storeImg = result.data;

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getStoreListImg() {
                return _ref4.apply(this, arguments);
            }

            return getStoreListImg;
        }(),
        addNews: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(content) {
                var uid, result;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(content === "")) {
                                    _context5.next = 3;
                                    break;
                                }

                                this.$message({
                                    message: '需求不能为空',
                                    type: 'error',
                                    duration: 1000
                                });
                                return _context5.abrupt('return');

                            case 3:
                                uid = localStorage.uid;
                                _context5.next = 6;
                                return newsAdd(uid, content);

                            case 6:
                                result = _context5.sent;

                                if (result.code === 1) {
                                    this.$message({
                                        message: result.message,
                                        type: 'success',
                                        duration: 1000
                                    });
                                }

                                this.dialogFormVisible = false;
                                console.log(result);

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function addNews(_x) {
                return _ref5.apply(this, arguments);
            }

            return addNews;
        }(),
        getBanner: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var result;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return bannerList();

                            case 2:
                                result = _context6.sent;

                                this.banner = result.data;
                                console.log(result);

                            case 5:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function getBanner() {
                return _ref6.apply(this, arguments);
            }

            return getBanner;
        }(),
        getDistrict: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var result;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return districts(longitude_latitude);

                            case 2:
                                result = _context7.sent;

                                this.address = result.result.ad_info.district;
                                localStorage.area = this.address;
                                this.getCitySelectList();
                                console.log(result.result.ad_info.district);

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function getDistrict() {
                return _ref7.apply(this, arguments);
            }

            return getDistrict;
        }(),
        getShopCateList: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                var result;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return shopCatelist();

                            case 2:
                                result = _context8.sent;

                                this.shopCateListData = result.data;
                                console.log(result);

                            case 5:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function getShopCateList() {
                return _ref8.apply(this, arguments);
            }

            return getShopCateList;
        }(),
        getRecommendList: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var result;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return recommendList(longitude_latitude, area_id);

                            case 2:
                                result = _context9.sent;

                                if (result.code === 1) {
                                    this.recommendList = result.data.data;
                                    console.log(result);
                                }

                            case 4:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function getRecommendList() {
                return _ref9.apply(this, arguments);
            }

            return getRecommendList;
        }(),
        getShopGoodList: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var result;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return shopGoodList(longitude_latitude, area_id);

                            case 2:
                                result = _context10.sent;

                                if (result.code === 1) {
                                    this.shopGoodList = result.data;
                                    console.log(result);
                                }

                            case 4:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function getShopGoodList() {
                return _ref10.apply(this, arguments);
            }

            return getShopGoodList;
        }(),
        getDiscountList: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                var result;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return discountList();

                            case 2:
                                result = _context11.sent;

                                if (result.code === 1) {
                                    console.log(result);
                                    this.discountList = result.data;
                                }

                            case 4:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function getDiscountList() {
                return _ref11.apply(this, arguments);
            }

            return getDiscountList;
        }(),
        getAllSort: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(sort_status, sortPage) {
                var result;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                this.allLoaded = true;
                                this.sortPage = 1;
                                this.index_foot = [0, 0, 0];
                                this.index_foot[sort_status - 1] = 1;
                                this.sort_status = sort_status;
                                _context12.next = 7;
                                return allSort(sort_status, longitude_latitude, '', '', sortPage, area_id);

                            case 7:
                                result = _context12.sent;

                                if (result.code === 1) {
                                    console.log(result);
                                    this.allSortList = result.data.data;
                                }

                            case 9:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function getAllSort(_x2, _x3) {
                return _ref12.apply(this, arguments);
            }

            return getAllSort;
        }(),
        loadingMore: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                var _this = this;

                var result;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                if (!(this.allLoaded === false)) {
                                    _context13.next = 2;
                                    break;
                                }

                                return _context13.abrupt('return');

                            case 2:
                                if (!($(window).scrollTop() + $(window).height() + 100 >= $(document).height())) {
                                    _context13.next = 27;
                                    break;
                                }

                                // console.log(1)
                                this.allLoaded = false;
                                this.loading = true;
                                this.sortPage++;
                                result = void 0;

                                if (!this.loading_more) {
                                    _context13.next = 26;
                                    break;
                                }

                                this.loading_more = false; //禁止浏览器发送ajax请求
                                _context13.next = 11;
                                return allSort(this.sort_status, longitude_latitude, '', '', this.sortPage, area_id);

                            case 11:
                                result = _context13.sent;

                                if (!(result.code === 1)) {
                                    _context13.next = 23;
                                    break;
                                }

                                //判断接受是否成功
                                this.loading = false;
                                console.log(this.allSortList.length, result.data.total);

                                if (!(this.allSortList.length === result.data.total)) {
                                    _context13.next = 19;
                                    break;
                                }

                                return _context13.abrupt('return');

                            case 19:
                                this.loading_more = true;
                                this.allSortList = [].concat(_toConsumableArray(this.allSortList), _toConsumableArray(result.data.data));

                            case 21:
                                _context13.next = 24;
                                break;

                            case 23:
                                setTimeout(function () {
                                    _this.loading = false;
                                    _this.loading_more = true;
                                }, 1000);

                            case 24:
                                _context13.next = 27;
                                break;

                            case 26:
                                this.loading = false;

                            case 27:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function loadingMore() {
                return _ref13.apply(this, arguments);
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
        },
        open3: function open3() {
            this.dialogFormVisible = true;
        }
    },
    created: function created() {
        var _this2 = this;

        setTimeout(function () {
            // let uid = this.GetQueryString('uid')
            // localStorage.uid = uid
            // alert(localStorage.uid)
            _this2.getIsShop();
            _this2.getBanner();
            _this2.getShopCateList();
            _this2.getDiscountList();
            //定位检测
            if (localStorage.longitude_latitude) {
                if (localStorage.area) {
                    _this2.address = localStorage.area;
                }
                _this2.getCitySearchList();
                _this2.getRecommendList(longitude_latitude);
                _this2.getShopGoodList(longitude_latitude);
                _this2.getAllSort(1, _this2.sortPage);
            } else {
                _this2.getWxConfig();
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
        setInterval(function () {
            var banner = new Swiper('#banner', {
                autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    disableOnInteraction: true
                },
                // loop: true,
                pagination: {
                    el: '.swiper-pagination'
                },
                width: innerWidth,
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true //修改swiper的父元素时，自动初始化swiper
            });
        }, 15000);
        var banner = new Swiper('#banner', {
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: true
            },
            // loop: true,
            pagination: {
                el: '.swiper-pagination'
            },
            width: innerWidth,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true //修改swiper的父元素时，自动初始化swiper
        });
        console.log(banner.slides.length);
        console.log(banner.activeIndex);
        if (banner.slides.length === banner.activeIndex - 1) {
            banner.slideTo(0, 1000, false);
        }
        var recommend = new Swiper('#recommend', {
            freeMode: true,
            slidesPerView: 1.3,
            spaceBetween: 20,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true //修改swiper的父元素时，自动初始化swiper
        });
        var shopGoodList = new Swiper('#shopGoodList', {
            freeMode: true,
            slidesPerView: 1.3,
            spaceBetween: 20,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true //修改swiper的父元素时，自动初始化swiper
        });
    }
});

//# sourceMappingURL=index-compile.js.map