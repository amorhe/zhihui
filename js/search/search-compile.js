'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = new Vue({
    el: "#app",
    data: {
        historysearchList: '',
        search_key: '',
        hotSearchList: [],
        shopList: [],
        page: 1,
        longitude_latitude: '',
        allLoaded: true,
        loading: false, //判断是否加载数据
        loading_more: true //控制是否发送ajax请求
    },
    methods: {
        back: function back() {
            history.go(-1);
        },
        goTo: function goTo(url, id, longitude_latitude, status) {
            location.assign(url + '?id=' + id + '&longitude_latitude=' + longitude_latitude + '&status=' + status);
        },
        goToSearch: function goToSearch(search_key) {
            if (search_key === '') {
                this.$message({
                    message: '搜索条件不能为空',
                    type: 'error'
                });
                return;
            }
            location.assign('./searchResult.html?search_key=' + search_key);
        },
        GetQueryString: function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getHotSearchList: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return hotSearchList();

                            case 2:
                                result = _context.sent;

                                if (result.code === 0) {
                                    alert(result.message);
                                }
                                if (result.code === 1) {
                                    console.log(result.data);
                                    this.hotSearchList = result.data;
                                }

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getHotSearchList() {
                return _ref.apply(this, arguments);
            }

            return getHotSearchList;
        }(),
        getHistorySearchList: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var uid, result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                uid = localStorage.uid;
                                _context2.next = 3;
                                return historySearchList(uid);

                            case 3:
                                result = _context2.sent;

                                if (result.code === 0) {
                                    alert(result.message);
                                }
                                if (result.code === 1) {
                                    console.log(result.data);
                                    this.historysearchList = result.data;
                                }

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getHistorySearchList() {
                return _ref2.apply(this, arguments);
            }

            return getHistorySearchList;
        }(),
        deleteHistoryList: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var uid, result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                uid = localStorage.uid;
                                _context3.next = 3;
                                return deleteHistory(uid);

                            case 3:
                                result = _context3.sent;

                                if (result.code === 0) {
                                    alert(result.message);
                                }
                                if (result.code === 1) {
                                    console.log(result.data);
                                    window.history.go(0);
                                }

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function deleteHistoryList() {
                return _ref3.apply(this, arguments);
            }

            return deleteHistoryList;
        }()
    },
    mounted: function mounted() {
        var _this = this;

        //路由拦截。。。
        if (!localStorage.longitude_latitude) {
            location.assign('./index.html');
        }

        setTimeout(function () {
            _this.getHotSearchList();
            _this.getHistorySearchList();
        });
    }
});

//# sourceMappingURL=search-compile.js.map