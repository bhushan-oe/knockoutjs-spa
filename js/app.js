; (function ($) {

    $(document).ready(function () {

        function viewModel() {
            var self = this;
            self.chosenPageId = ko.observable();
            self.pages = ko.observableArray(["Home", "About", "Product"]);
            self.template = ko.observable();
            self.plp = "product-listing-page";
            self.goToPage = function (page) {
                console.log(page);
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
        // function aboutViewModel() {
        //     var self = this;
        //     self.name = 'About';
        // }
        function productViewModel() {
            var self = this;
            self.productArray = ko.observableArray();
            self.allProduct = ko.observableArray();
            self.allSize = ko.observableArray();
            // self.minPrice = ko.observableArray(100);
            // self.maxPrice = ko.observableArray(200);
            // self.selectedMinPrice = ko.observableArray(100);
            // self.selectedMaxPrice = ko.observableArray(200);
            // self.allColor = ko.observableArray();
            // self.allBrand = ko.observableArray();
            // self.selectSize = ko.observableArray();
            // self.selectColor = ko.observableArray();
            // self.selectBrand = ko.observableArray();
            // self.filterArray = ko.observableArray();
            // self.selectedRating = ko.observableArray();
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
                console.log("");

                var dataArray = [];
                var newDataArray = [];
                var allsz = [];
                var allcl = [];
                var allbr = [];

                $.ajax({url: "http://demo2828034.mockable.io/search/shirts", success: function(result){
                    // var clonedArr = result["items"];
                    // clonedArr.sort((a,b)=>(a.price < b.price)?-1:((a.price > b.price)? 1:0));
                    // vm.Products.minPrice(clonedArr[0].price);
                    // vm.Products.maxPrice(clonedArr[clonedArr.length-1].price);
                    // vm.Products.selectedMinPrice(vm.Products.minPrice());
                    // vm.Products.selectedMaxPrice(vm.Products.maxPrice());
                    
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
                    // console.log(newDataArray, vm.Products.minPrice(), vm.Products.maxPrice(), vm.Products.selectedMinPrice(),vm.Products.selectedMaxPrice());
                    // vm.Products.allProduct(newDataArray);
                    console.log(newDataArray, vm.Product.productArray());
                        vm.Product.productArray(newDataArray); 
                        // vm.Products.SortByPopularity(); 
                    console.log(vm.Product.productArray()); 
                        // vm.Products.allSize(allsz);
                        // vm.Products.allBrand(allbr);
                        // vm.Products.allColor(allcl);     
                    },

                    error(err){
                    console.log("error",err);                    
                    }
                });
                //vm.Page.name("About")

            });
            this.get('#Product', function () {
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("product-template")
                //vm.Page.name("About")
                //fetch product details here
            });

            this.get('#Product/:productid', function () {
                vm.Main.chosenPageId("Product");
                vm.Main.template("product-template")
                //this.params.productid
                //vm.Page.name("About")
                //fetch product details here
            });

            // this.get('#:page', function () {
            //     vm.Main.chosenPageId(this.params.page);     
            //     vm.Main.template("page-template") 
            // });
        }).run('#Home');
        ko.applyBindings(vm);

    });

})(jQuery);