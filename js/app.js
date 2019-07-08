; (function ($) {

    $(document).on('click', '.panel-heading.clickable', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.addClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    }
    else {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.removeClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
})

    $(document).ready(function () {

        function viewModel() {
            var self = this;
            self.chosenPageId = ko.observable();
            self.pages = ko.observableArray(["Home", "About", "Product"]);
            self.template = ko.observable();
            self.plp = "product-listing-page";
            self.goToPage = function (page) {
                location.hash = page;
            }
            self.goToProduct = function (productid) {
                location.hash = 'Product/' + productid;
            }
        }
        function pageViewModel() {
            var self = this;
            self.name = ko.observable('Home');
            self.content = ko.observable('Home default content')
        }
        
        function productViewModel() {
            var self = this;
            self.productArray = ko.observableArray();
            self.allProduct = ko.observableArray();
            self.allSize = ko.observableArray();
            self.minPrice = ko.observableArray();
            self.maxPrice = ko.observableArray();
            self.selectedMinPrice = ko.observableArray();
            self.selectedMaxPrice = ko.observableArray();
            self.color_flag = ko.observable(false);
            self.brand_flag = ko.observable(false);
            self.size_flag = ko.observable(false);
            self.allColor = ko.observableArray();
            self.allBrand = ko.observableArray();
            self.selectSize = ko.observableArray();
            self.selectColor = ko.observableArray();
            self.selectBrand = ko.observableArray();
            self.filterArray = ko.observableArray();
            self.selectedRating = ko.observableArray();

            self.priceFilter = ko.computed(function(){
                var tempArr, temp = [];
                if(self.selectSize().length != 0 || self.selectBrand().length != 0 || self.selectColor().length != 0 || self.selectedRating().length != 0)
                    tempArr = $.extend(true, [], self.productArray());
                else
                    tempArr = $.extend(true, [], self.allProduct());

                for(var y in tempArr){
                    if( tempArr[y].sku[0].price >= self.selectedMinPrice() && tempArr[y].sku[0].price <= self.selectedMaxPrice())
                        temp.push(tempArr[y]);
                }
                if(temp.length != 0)
                    self.productArray(temp);
                else
                    self.productArray(self.allProduct());
            });
            
            self.SortByPopularity = function (){
                var clonedArr = $.extend(true, [], self.productArray());
                clonedArr.sort((a,b) => (a.sku[0].rating > b.sku[0].rating) ? -1 : ((a.sku[0].rating < b.sku[0].rating) ? 1 : 0));
                self.productArray(clonedArr);
            }

            self.SortByAscending = function(){
                var clonedArr = $.extend(true,[],self.productArray());
                clonedArr.sort((a,b) => (a.sku[0].price > b.sku[0].price) ? -1 : ((a.sku[0].price < b.sku[0].price) ? 1 : 0));
                self.productArray(clonedArr);
            }

            self.SortDescending = function(){
                var clonedArr = $.extend(true,[],self.productArray());
                clonedArr.sort((a,b) => (a.sku[0].price < b.sku[0].price) ? -1 : ((a.sku[0].price > b.sku[0].price) ? 1 : 0));
                self.productArray(clonedArr);
            }

            //Applying Filters
            self.applyFilter = function (facetsArray) {
            console.log("apply ", facetsArray);
                var clonedArr = $.extend(true, [], self.allProduct());
                var temp = [];
                for (var facet in facetsArray) {
                    console.log("apply ", facet);
                    for (var SelectedValue of facetsArray[facet]) {
                        console.log("apply ", facetsArray[facet]);
                        for (var CurrentIndex in clonedArr) {
                            if (facet === "size") {
                                console.log("in IF", SelectedValue[0], clonedArr[CurrentIndex].size, $.inArray(SelectedValue[0], clonedArr[CurrentIndex].size));
                                if ($.inArray(SelectedValue[0], clonedArr[CurrentIndex].size) != -1) {
                                    temp.push(clonedArr[CurrentIndex]);
                                   
                                }
                            }
                            if (facet == "color") {
                                if ($.inArray(SelectedValue, clonedArr[CurrentIndex].color) != -1) {
                                    temp.push(clonedArr[CurrentIndex]);
                                }
                            }
                            if (facet == "brand") {
                                if ($.inArray(SelectedValue, clonedArr[CurrentIndex].brand) != -1) {
                                    temp.push(clonedArr[CurrentIndex]);
                                }
                            }
                            if (facet == "rating") {
                                if (SelectedValue <= clonedArr[CurrentIndex].rating[0]) {
                                    temp.push(clonedArr[CurrentIndex]);
                                }
                            }
                        }
                    }
                    clonedArr = temp;
                    temp = [];
                }
                var another_ar = [];
                $.each(clonedArr, function (i, el) {
                    if ($.inArray(el, another_ar) === -1)
                        another_ar.push(el);
                });
                if (another_ar.length != 0) {
                    self.productArray(another_ar);
                }
                else {
                    $('input:checkbox').prop('checked', false);
                    alert("Serched item Not found");
                    self.productArray(self.allProduct());
                    self.selectSize().length = 0;
                    self.selectColor().length = 0;
                    self.selectBrand().length = 0;
                    self.selectedRating().length = 0;
                }
            };

            //Filters
            self.facetsComputed = ko.computed(function(){
                
                console.log(self.selectSize(), self.selectBrand(), self.selectColor(), self.selectedRating());
                var temm =[];
                var facetsArray = [];
                if (self.selectSize().length != 0) {
                    temm.push(self.selectSize());
                    facetsArray["size"] = temm;
                }
                if (self.selectBrand().length != 0) {
                    facetsArray["brand"] = self.selectBrand();
                }
                if (self.selectColor().length != 0) {
                    facetsArray["color"] = self.selectColor();
                }
                if (self.selectedRating().length != 0) {
                    facetsArray["rating"] = self.selectedRating();
                }
             
                if (!jQuery.isEmptyObject(facetsArray)) {
                    console.log("calling fun");
                    self.applyFilter(facetsArray);
                }
                else {
                    self.productArray(self.allProduct());
                }
            });

            self.brand_flagfun = function(){
                if(this.brand_flag() == false)
                    this.brand_flag(true);
                else
                    this.brand_flag(false);
            }

            self.color_flagfun = function(){
                if(this.color_flag() == false)
                    this.color_flag(true);
                else
                    this.color_flag(false);
            }

            self.size_flagfun = function(){
                if(this.size_flag == false)
                    this.size_flag(true);
                else
                    this.size_flag(false);
            }
           

            //Color selection
            self.colorSelect = function(product, color){
                console.log(product,color);
                var img, price, size = [];
                for(var sku in product.sku){
                    if(color == product.sku[sku].color){
                        size.push(product.sku[sku].size);
                        img = product.sku[sku].imageurl;
                        price = product.sku[sku].price;
                    }
                }
                $("#"+product.prodId).css({'background-image': 'url('+img+')'});
                $("#"+product.prodId+"size").text('size: '+size);
                $('#'+product.prodId+"price").text('$ '+price);
            }
        }

        var vm = {
            Main: new viewModel(),
            Page: new pageViewModel(),
            Product: new productViewModel
        };

        Sammy(function () {
            this.get('#Home', function () {
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("landing-page")
                vm.Page.name("Home")
                $.get('./server/home.json', function (data) {
                    vm.Page.name(data.title);
                    vm.Page.content(data.content);
                })
            });
            this.get('#product-listing-page', function () {
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("product-listing-page")

                var dataArray = [];
                var newDataArray = [];
                var allsz = [];
                var allcl = [];
                var allbr = [];

                $.ajax({url: "http://demo2828034.mockable.io/search/shirts", success: function(result){
                    var clonedArr = result["items"];
                    clonedArr.sort((a,b)=>(a.price < b.price)?-1:((a.price > b.price)? 1:0));
                    vm.Product.minPrice(clonedArr[0].price);
                    vm.Product.maxPrice(clonedArr[clonedArr.length-1].price);
                    vm.Product.selectedMinPrice(vm.Product.minPrice());
                    vm.Product.selectedMaxPrice(vm.Product.maxPrice());
                    
                    for(var ob in result.items){
                        $.each(result.items, function(i, el){
                            if($.inArray(el.brand, allbr) === -1)
                                allbr.push(el.brand);
                        });
                        $.each(result.items, function(i, el){
                            if($.inArray(el.size, allsz) === -1)
                                allsz.push(el.size);
                        });
                        $.each(result.items, function(i, el){
                            if($.inArray(el.color, allcl) === -1)
                                allcl.push(el.color);
                        });

                        var flag = true;
                        for(var temp in dataArray){
                            if(temp == result.items[ob].prodId){
                                dataArray[temp].push(result.items[ob]);
                                flag = false;
                            }
                        }

                        if(flag === true)
                            dataArray[result.items[ob].prodId] = [result.items[ob]];
                    }

                    for(var productArrId in dataArray){
                        var colorArr = [];
                        var sizeArr = [];
                        var brandArr = [];
                        var ratingArr = [];
                        var newRatingArr = [];
                        var newColorArr = [];
                        var newSizeArr = [];
                        var newBrandArr = [];
                               
                        for(var sku in dataArray[productArrId]){
                            colorArr.push(dataArray[productArrId][sku].color);
                            sizeArr.push(dataArray[productArrId][sku].size);
                            brandArr.push(dataArray[productArrId][sku].brand);
                            ratingArr.push(dataArray[productArrId][sku].rating);
                        }
                        $.each(ratingArr, function(i,el){
                            if($.inArray(el,newRatingArr) === -1)
                                newRatingArr.push(el);
                        })
                        $.each(colorArr, function(i, el) {
                            if($.inArray(el, newColorArr) === -1) 
                                newColorArr.push(el);
                        });

                        $.each(brandArr, function(i, el) {
                            if($.inArray(el, newBrandArr) === -1)
                                newBrandArr.push(el);
                        }); 

                        $.each(sizeArr, function(i, el) {
                            if($.inArray(el, newSizeArr) === -1) 
                                newSizeArr.push(el);
                        });            
                        newDataArray.push({ 'prodId': productArrId, 'sku':dataArray[productArrId], 'color': newColorArr, 'size':newSizeArr, 'brand':newBrandArr, 'rating':newRatingArr})    
                    }
                    console.log(newDataArray, vm.Product.minPrice(), vm.Product.maxPrice(), vm.Product.selectedMinPrice(),vm.Product.selectedMaxPrice());
                    
                    
                    vm.Product.productArray(newDataArray); 
                    vm.Product.allProduct(newDataArray);
                    vm.Product.SortByPopularity(); 
                    
                    vm.Product.allSize(allsz);
                    vm.Product.allBrand(allbr);
                    vm.Product.allColor(allcl);    
                },

                error(err){
                    console.log("error",err);                    
                }
                });

            });
        }).run('#Home');
        ko.applyBindings(vm);

    });

})(jQuery);