'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = new Vue({
    el: "#app",
    data: {
        search_key: '',
        citySelectLists: '',
        citySearchSelectList: ''
    },
    methods: {
        back: function back() {
            history.go(-1);
        },
        changeAddress: function changeAddress(lat_lng, area_id, area) {
            localStorage.longitude_latitude = lat_lng;
            localStorage.area_id = area_id;
            localStorage.area = area;
            window.location.assign('./index.html');
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
        getCitySelectList: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return citySelectList();

                            case 2:
                                result = _context.sent;

                                console.log(result);
                                if (result.code === 1) {
                                    this.citySelectLists = result.data;
                                }

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getCitySelectList() {
                return _ref.apply(this, arguments);
            }

            return getCitySelectList;
        }(),
        getCitySearchSelectList: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(search_key) {
                var result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return citySearchSelectList(search_key);

                            case 2:
                                result = _context2.sent;

                                if (!(result.code === 1)) {
                                    _context2.next = 9;
                                    break;
                                }

                                if (result.data) {
                                    _context2.next = 7;
                                    break;
                                }

                                this.$message({
                                    message: "暂不支持此地址",
                                    type: 'error',
                                    duration: 1000
                                });
                                return _context2.abrupt('return');

                            case 7:
                                this.citySearchSelectList = result.data;
                                console.log(result);

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getCitySearchSelectList(_x) {
                return _ref2.apply(this, arguments);
            }

            return getCitySearchSelectList;
        }()
    },
    mounted: function mounted() {
        var _this = this;

        //路由拦截。。。
        // if (!localStorage.longitude_latitude) {
        //     location.assign('./index.html')
        // }

        setTimeout(function () {
            _this.getCitySelectList();
        });
    }
});

//# sourceMappingURL=selectAddress-compile.js.map