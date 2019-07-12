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
            self.minPrice = ko.observable(50);
            self.maxPrice = ko.observable(700);
            self.selectedMinPrice = ko.observable();
            self.selectedMaxPrice = ko.observable();
            self.colorFlag = ko.observable(false);
            self.brandFlag = ko.observable(false);
            self.sizeFlag = ko.observable(false);
            self.allColor = ko.observableArray();
            self.allBrand = ko.observableArray();
            self.selectSize = ko.observableArray();
            self.selectColor = ko.observableArray();
            self.selectBrand = ko.observableArray();
            self.filterArray = ko.observableArray();
            self.selectedRating = ko.observableArray();
            self.category = ko.observableArray();
            self.currentRequestedSortBy = ko.observable('popularity');


            //Price Range Filter
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
            

            setTimeout(function () {
                console.log(vm.Product.selectedMinPrice())
                $("#slider-range").slider({
                    range: true,
                    min: vm.Product.minPrice(),
                    max: vm.Product.maxPrice(),
                    values: [vm.Product.selectedMinPrice(), vm.Product.selectedMaxPrice()],
                    slide: function (event, ui) {
                        $("#amount").val("Min: $" + ui.values[0] + "      Max: $" + ui.values[1]);
                        vm.Product.selectedMinPrice(ui.values[0]);
                        vm.Product.selectedMaxPrice(ui.values[1]);
                    }
                });

                $("#amount").val("Min: $" + $("#slider-range").slider("values", 0) +
                    "      Max: $" + $("#slider-range").slider("values", 1));
            }, 1000);

            //Sorting
            self.sortBy = function(value){
                if(value === 'popularity'){
                    self.currentRequestedSortBy('popularity');
                    self.productArray.sort((a,b) => (a.sku[0].rating > b.sku[0].rating) ? -1: ((b.sku[0].rating < a.sku[0].rating) ? -1 : 0));
                }

                if (value === 'ascending') {
                    self.currentRequestedSortBy('ascending');
                    self.productArray.sort((a, b) => (a.sku[0].price < b.sku[0].price) ? -1 : ((b.sku[0].price > a.sku[0].price) ? -1 : 0));
                }                

                if(value === 'descending'){
                    self.currentRequestedSortBy('descending');
                    self.productArray.sort((a, b) => (a.sku[0].price > b.sku[0].price) ? -1 : ((b.sku[0].price < a.sku[0].price) ? -1 : 0));
                }
            }

            //Applying Filters
            self.applyFilter = function (filterArray) {
            
                    var filteredArray = $.extend(true, [], self.allProduct());
                    var temp = [];

                    for(var filter in filterArray){
                        filterArray[filter].map(function(SelectedValue){
                            filteredArray.map(function(product){
                                if(filter == 'size'){
                                    if($.inArray(SelectedValue, product.size) != -1){
                                        if(!temp.find(p => p.prodId == product.prodId))
                                            temp.push(product);
                                    }
                                }
                                if (filter == 'color') {
                                    if ($.inArray(SelectedValue, product.color) != -1) {
                                        if (!temp.find(p => p.prodId == product.prodId))
                                            temp.push(product);
                                    }
                                }
                                if (filter == 'brand') {
                                    if ($.inArray(SelectedValue, product.brand) != -1) {
                                        if (!temp.find(p => p.prodId == product.prodId))
                                            temp.push(product);
                                    }
                                }
                                if (filter == 'rating') {
                                    if (SelectedValue <= product.rating[0]) {
                                        if (!temp.find(p => p.prodId == product.prodId))
                                            temp.push(product);
                                    }
                                }
                            });
                        });
                        filteredArray = temp;
                        temp = [];
                    }
                    console.log(filteredArray);
                

                if(filteredArray.length != 0)
                    self.productArray(filteredArray);
                else {
                    $('input: checkbox').prop('checked', false);
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
                
                if(self.selectSize().length > 1)
                    self.selectSize().shift();

                if(self.selectedRating().length > 1)
                    self.selectedRating().shift();

                if(self.selectColor(),length > 1)
                    self.selectColor().shift();
                
                var filterArray = [];
                if (self.selectSize().length != 0) {
                    filterArray["size"] = self.selectSize();
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
            Product: new productViewModel()
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
                    console.log(vm.Product.selectedMinPrice(), "...", vm.Product.minPrice());
                    result.items.map(function (ob){
                        
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
       
                    
                    vm.Product.productArray(dataArray); 
                    vm.Product.allProduct(dataArray);
                    vm.Product.sortBy('popularity'); 
                    
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