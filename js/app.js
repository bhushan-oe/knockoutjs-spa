var filterDiv = function(){
    if($(window).width() < 990){
        $("#filterMobileDiv").toggleClass('hidefilter showfilter');
        $("#sortByHide").removeClass('showSortBy');
        $("#sortByHide").addClass('hideSortBy');
    }
}

var sortDiv = function () {
    $("#sortByHide").toggleClass('hideSortBy showSortBy');
    $("#filterMobileDiv").removeClass('showfilter');
    $("#filterMobileDiv").addClass('hidefilter');
}

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
});

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
            self.searchedData = ko.observable();
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
            self.category = ko.observableArray();

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
            self.applyFilter = function (filterArray) {
            
                var clonedArr = $.extend(true, [], self.allProduct());
                var temp = [];
                filterArray.map(function (a,b) {
                   
                });

                for (var facet in filterArray) {
                    
                    for (var SelectedValue of filterArray[facet]) {
                        
                        for (var CurrentIndex in clonedArr) {
                            if (facet === "size") {
                                
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
                    self.selectSize('');
                    self.selectColor('');
                    self.selectBrand('');
                    self.selectedRating('');
                }
            };

            //Filters
            self.facetsComputed = ko.computed(function(){
                
               
                var temp =[];
                var filterArray = [];
                if (self.selectSize().length != 0) {
                    temp.push(self.selectSize());
                    filterArray["size"] = temp;
                }
                if (self.selectBrand().length != 0) {
                    filterArray["brand"] = self.selectBrand();
                }
                if (self.selectColor().length != 0) {
                    filterArray["color"] = self.selectColor();
                }
                if (self.selectedRating().length != 0) {
                    filterArray["rating"] = self.selectedRating();
                }
             
                if (!jQuery.isEmptyObject(filterArray)) {
                    
                    self.applyFilter(filterArray);
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

            //Wishlist
            self.addToWishList = function (product) {
                $("#" + product.prodId + "heart").toggleClass('far fa-heart fas fa-heart redHeart');
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
                var allCategory = [];

                $.ajax({url: "http://demo2828034.mockable.io/search/shirts", success: function(result){
                    var clonedArr = result["items"];
                    clonedArr.sort((a,b)=>(a.price < b.price)?-1:((a.price > b.price)? 1:0));
                    vm.Product.minPrice(clonedArr[0].price);
                    vm.Product.maxPrice(clonedArr[clonedArr.length-1].price);
                    vm.Product.selectedMinPrice(vm.Product.minPrice());
                    vm.Product.selectedMaxPrice(vm.Product.maxPrice());
                    
                    result.items.map(function (ob){
                        console.log(ob);
                        if(pr = dataArray.find(p => p.prodId == ob.prodId)){
                            pr.sku.push(ob);
                            if($.inArray(ob.color, pr.color) === -1)
                                pr.color.push(ob.color);
                            
                            if($.inArray(ob.size, pr.size) === -1)
                                pr.size.push(ob.size);

                            if($.inArray(ob.brand, pr.brand) === -1)
                                pr.brand.push(ob.brand);

                            if($.inArray(ob.rating, pr.rating) === -1)
                                pr.rating.push(ob.rating);
                        }

                        else{
                            var skuArr = [];
                            var colorTempArr = [ob.color];
                            var sizeTempArr = [ob.size];
                            var brandTempArr = [ob.brand];
                            var ratingTempArr = [ob.rating];
                            skuArr.push(ob);
                            dataArray.push({'prodId': ob.prodId, 'sku': skuArr, 'color': colorTempArr, 'size': sizeTempArr, 'brand': brandTempArr, 'rating': ratingTempArr});
                        }

                        if($.inArray(ob.brand, allbr) === -1)
                            allbr.push(ob.brand);

                        if($.inArray(ob.size, allsz) === -1)
                            allsz.push(ob.size);
                        if($.inArray(ob.color, allcl) === -1)
                            allcl.push(ob.color);
                        if($.inArray(ob.category, allCategory) === -1)
                            allCategory.push(ob.category);
                    });
                    console.log(allCategory);
                    
                    vm.Product.productArray(dataArray); 
                    vm.Product.allProduct(dataArray);
                    vm.Product.SortByPopularity(); 
                    
                    vm.Product.allSize(allsz);
                    vm.Product.allBrand(allbr);
                    vm.Product.allColor(allcl);    
                    vm.Product.category(allCategory);
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