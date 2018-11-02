"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0") {
    $("select").css("background", "none");
}

function getBase64Image(imgElem) {
    return imgElem.replace(/^data:image\/(jpeg|jpg);base64,/, "");
}

var app = new Vue({
    el: '#app',
    data: {
        shop_name: '',
        name: '',
        phone: '',
        id_card: '',
        address: '',
        jssdkconfig: '',
        province: [],
        sProvince: '',
        city: [],
        sCity: '',
        area: [],
        sArea: '',
        country: [],
        sCountry: '',
        agency: [],
        sAgency: [],
        localId: {
            front: '',
            back: '',
            card: ''
        },
        oneCate: '',
        sOneCate: '',
        twoCate: '',
        sTwoCate: ''
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

                            case 10:
                            case "end":
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
        upLoadImg: function upLoadImg(event, which) {
            var _this = this;

            console.log(event);
            var formData = new FormData();
            formData.append("file", event.target.files[0]);
            $.ajax({
                url: Base_url + '/api/allarea/uploadimg',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false, //不可缺
                processData: false, //不可缺
                success: function success(res) {
                    console.log(res.data);
                    _this.localId[which] = res.data;
                    // alert(JSON.stringify(this.localId))
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
        },
        getProvince: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return areaList(1, 0);

                            case 2:
                                result = _context2.sent;

                                console.log(result);
                                this.province = result;
                                this.sProvince = result[0].id;
                                this.getCity(result[0].id);

                            case 7:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getProvince() {
                return _ref2.apply(this, arguments);
            }

            return getProvince;
        }(),
        getCity: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(provinceId) {
                var result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return areaList(2, provinceId);

                            case 2:
                                result = _context3.sent;

                                if (!(result === false)) {
                                    _context3.next = 9;
                                    break;
                                }

                                this.city = '';
                                this.area = '';
                                this.country = '';
                                this.agency = '';
                                return _context3.abrupt("return");

                            case 9:
                                console.log(result);
                                this.city = result;
                                this.sCity = result[0].id;
                                this.getArea(result[0].id);

                            case 13:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getCity(_x) {
                return _ref3.apply(this, arguments);
            }

            return getCity;
        }(),
        getArea: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(CityId) {
                var result;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return areaList(3, CityId);

                            case 2:
                                result = _context4.sent;

                                if (!(result === false)) {
                                    _context4.next = 8;
                                    break;
                                }

                                this.area = '';
                                this.country = '';
                                this.agency = '';
                                return _context4.abrupt("return");

                            case 8:
                                console.log(result);
                                this.area = result;
                                this.sArea = result[0].id;
                                this.getCountry(result[0].id);

                            case 12:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getArea(_x2) {
                return _ref4.apply(this, arguments);
            }

            return getArea;
        }(),
        getCountry: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(areaId) {
                var result;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return areaList(4, areaId);

                            case 2:
                                result = _context5.sent;

                                if (!(result === false)) {
                                    _context5.next = 7;
                                    break;
                                }

                                this.country = '';
                                this.agency = '';
                                return _context5.abrupt("return");

                            case 7:
                                console.log(result);
                                this.country = result;
                                this.sCountry = result[0].id;
                                this.getAgency(result[0].id);

                            case 11:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function getCountry(_x3) {
                return _ref5.apply(this, arguments);
            }

            return getCountry;
        }(),
        getAgency: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(countryId) {
                var result;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return areaList(5, countryId);

                            case 2:
                                result = _context6.sent;

                                if (!(result === false)) {
                                    _context6.next = 6;
                                    break;
                                }

                                this.agency = '';
                                return _context6.abrupt("return");

                            case 6:
                                this.sAgency = result[0].id;
                                console.log(result);
                                this.agency = result;

                            case 9:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function getAgency(_x4) {
                return _ref6.apply(this, arguments);
            }

            return getAgency;
        }(),
        getOneCate: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var result;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return oneCate();

                            case 2:
                                result = _context7.sent;

                                if (result.code === 1) {
                                    console.log(result);
                                    this.oneCate = result.data;
                                    this.sOneCate = result.data[0].id;
                                    this.getTwoCate(this.sOneCate);
                                }

                            case 4:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function getOneCate() {
                return _ref7.apply(this, arguments);
            }

            return getOneCate;
        }(),
        getTwoCate: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(p_id) {
                var result;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return twoCate(p_id);

                            case 2:
                                result = _context8.sent;

                                if (!(result.code === 1)) {
                                    _context8.next = 9;
                                    break;
                                }

                                if (!(result.data === null)) {
                                    _context8.next = 6;
                                    break;
                                }

                                return _context8.abrupt("return");

                            case 6:
                                console.log(result.data);
                                this.twoCate = result.data;
                                this.sTwoCate = result.data[0].id;

                            case 9:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function getTwoCate(_x5) {
                return _ref8.apply(this, arguments);
            }

            return getTwoCate;
        }(),
        adds: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var uid, shopcate_id, shopchildcate_id, province_id, city_id, area_id, street_id, community_id, province, city, area, street, community, address, id_card_positive_photo, id_card_negative_photo, business_license, shop_name, phone, name, id_card, result;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                uid = localStorage.uid;
                                shopcate_id = this.sOneCate;
                                shopchildcate_id = this.sTwoCate;
                                province_id = this.sProvince;
                                city_id = this.sCity;
                                area_id = this.sArea;
                                street_id = this.sCountry;
                                community_id = this.sAgency;
                                province = this.province.filter(function (item) {
                                    return item.id === province_id;
                                })[0].region_name;
                                city = this.city.filter(function (item) {
                                    return item.id === city_id;
                                })[0].region_name;
                                area = this.area.filter(function (item) {
                                    return item.id === area_id;
                                })[0].region_name;
                                street = void 0;

                                if (this.country) {
                                    street = this.country.filter(function (item) {
                                        return item.id === street_id;
                                    })[0].region_name;
                                } else {
                                    street = "";
                                }
                                community = void 0;

                                if (this.agency) {
                                    community = this.agency.filter(function (item) {
                                        return item.id === community_id;
                                    })[0].region_name;
                                } else {
                                    community = "";
                                }
                                console.log(province);
                                console.log(city);
                                console.log(area);
                                console.log(street);
                                console.log(community);
                                address = province + city + area + street + community;

                                console.log(address);
                                id_card_positive_photo = this.localId.back;
                                id_card_negative_photo = this.localId.front;
                                business_license = this.localId.card;
                                shop_name = this.shop_name, phone = this.phone, name = this.name, id_card = this.id_card;

                                if (!uid, !shopcate_id, !shopchildcate_id, !province_id, !city_id, !area_id, !street_id, !community_id, !shop_name, !phone, !name, !address, !id_card, !id_card_positive_photo, !id_card_negative_photo, !business_license) {
                                    this.$message({
                                        message: "请检查数据",
                                        type: 'error',
                                        duration: 1000
                                    });
                                    // return
                                }
                                _context9.next = 29;
                                return storeAdd(uid, shopcate_id, shopchildcate_id, province_id, city_id, area_id, street_id, community_id, shop_name, phone, name, address, id_card, id_card_positive_photo, id_card_negative_photo, business_license);

                            case 29:
                                result = _context9.sent;

                                if (!(result.code === 1)) {
                                    _context9.next = 33;
                                    break;
                                }

                                this.$message({
                                    message: result.message,
                                    type: 'success',
                                    duration: 1000
                                });
                                return _context9.abrupt("return");

                            case 33:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function adds() {
                return _ref9.apply(this, arguments);
            }

            return adds;
        }()
    },
    created: function created() {
        var _this2 = this;

        setTimeout(function () {
            _this2.getProvince();
            _this2.getOneCate();
        }, 100);
    }
});

//# sourceMappingURL=application-compile.js.map