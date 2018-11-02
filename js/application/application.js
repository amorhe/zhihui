if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0") {
    $("select").css("background", "none");
}

function getBase64Image(imgElem) {
    return imgElem.replace(/^data:image\/(jpeg|jpg);base64,/, "");
}

let app = new Vue({
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
            card: '',
        },
        oneCate: '',
        sOneCate: '',
        twoCate: '',
        sTwoCate: ''
    },
    methods: {
        async getWxConfig() {

            let that = this
            let url = window.location.href
            console.log(url)

            let result = await wxConfig(url)
            result = JSON.parse(result.data)
            this.jssdkconfig = result
            console.log(result)
            jssdkconfig = this.jssdkconfig
        },
        upLoadImg(event, which) {
            console.log(event);
            var formData = new FormData();
            formData.append("file", event.target.files[0]);
            $.ajax({
                url: Base_url+'/api/allarea/uploadimg',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,    //不可缺
                processData: false,    //不可缺
                success: (res) => {
                    console.log(res.data)
                    this.localId[which] = res.data;
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
        async getProvince() {
            let result = await areaList(1, 0)
            console.log(result);
            this.province = result
            this.sProvince = result[0].id
            this.getCity(result[0].id)
        },
        async getCity(provinceId) {
            let result = await areaList(2, provinceId)
            if (result === false) {
                this.city = ''
                this.area = ''
                this.country = ''
                this.agency = ''
                return
            }
            console.log(result);
            this.city = result
            this.sCity = result[0].id
            this.getArea(result[0].id)
        },
        async getArea(CityId) {
            let result = await areaList(3, CityId)
            if (result === false) {
                this.area = ''
                this.country = ''
                this.agency = ''
                return
            }
            console.log(result);
            this.area = result
            this.sArea = result[0].id
            this.getCountry(result[0].id)
        },
        async getCountry(areaId) {
            let result = await areaList(4, areaId)
            if (result === false) {
                this.country = ''
                this.agency = ''
                return
            }
            console.log(result);
            this.country = result
            this.sCountry = result[0].id
            this.getAgency(result[0].id)
        },
        async getAgency(countryId) {
            let result = await areaList(5, countryId)
            if (result === false) {
                this.agency = ''
                return
            }
            this.sAgency = result[0].id
            console.log(result);
            this.agency = result
        },
        async getOneCate() {
            let result = await oneCate()
            if (result.code === 1) {
                console.log(result)
                this.oneCate = result.data
                this.sOneCate = result.data[0].id
                this.getTwoCate(this.sOneCate)
            }
        },
        async getTwoCate(p_id) {
            let result = await twoCate(p_id)
            if (result.code === 1) {
                if (result.data === null) {
                    return
                }
                console.log(result.data)
                this.twoCate = result.data
                this.sTwoCate = result.data[0].id
            }
        },
        async adds() {
            let uid = localStorage.uid
            let shopcate_id = this.sOneCate
            let shopchildcate_id = this.sTwoCate
            let province_id = this.sProvince
            let city_id = this.sCity
            let area_id = this.sArea
            let street_id = this.sCountry
            let community_id = this.sAgency

            let province = this.province.filter((item) => item.id === province_id)[0].region_name
            let city = this.city.filter((item) => item.id === city_id)[0].region_name
            let area = this.area.filter((item) => item.id === area_id)[0].region_name
            let street
            if (this.country) {
                street = this.country.filter((item) => item.id === street_id)[0].region_name
            }else{
                street = ""
            }
            let community
            if (this.agency) {
                community = this.agency.filter((item) => item.id === community_id)[0].region_name
            }else{
                community = ""
            }
            console.log(province);
            console.log(city);
            console.log(area);
            console.log(street);
            console.log(community);
            let address = province + city + area + street + community
            console.log(address);
            let id_card_positive_photo = this.localId.back
            let id_card_negative_photo = this.localId.front
            let business_license = this.localId.card
            let {shop_name, phone, name, id_card} = this
            if (!uid, !shopcate_id, !shopchildcate_id, !province_id, !city_id, !area_id, !street_id, !community_id,!shop_name, !phone, !name, !address, !id_card, !id_card_positive_photo, !id_card_negative_photo, !business_license) {
                this.$message({
                    message: "请检查数据",
                    type: 'error',
                    duration: 1000
                })
                // return
            }
            let result = await storeAdd(uid, shopcate_id, shopchildcate_id, province_id, city_id, area_id, street_id, community_id, shop_name, phone, name, address, id_card, id_card_positive_photo, id_card_negative_photo, business_license)
            if (result.code === 1){
                this.$message({
                    message: result.message,
                    type: 'success',
                    duration: 1000
                })
                return
            }
        }
    },
    created() {
        setTimeout(() => {
            this.getProvince()
            this.getOneCate()
        }, 100)
    },
})
