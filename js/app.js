; (function ($) {
    $(document).ready(function () {
        function viewModel() {
            var self = this;
            self.chosenPageId = ko.observable();
            self.pages = ko.observableArray(["Home", "About", "Product"]);
            self.template = ko.observable();
            self.plp = "Plp";
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

            // observable plp products
            self.Products = ko.observableArray();

            // observable all products(for calculation)
            self.ProductsWithoutFilter = ko.observableArray();

            // observable filtered products(for filtering)
            self.filteredPlpArray = ko.observableArray();

            // observable filters
            self.lowestPrice = ko.observable();
            self.highestPrice = ko.observable();
            self.middlePrice = ko.observable();
            self.distinctRatings = ko.observableArray();
            self.distinctColors = ko.observableArray();
            self.distinctSizes = ko.observableArray();
            self.distinctBrands = ko.observableArray();
            self.showFilterDisplayLimit = ko.observable(5);
            self.distingRatings = ko.observableArray([4, 3, 2, 1]);

            // for displaying price range
            self.minRange = ko.observable();
            self.maxRange = ko.observable();
            self.minRange(self.lowestPrice);
            self.maxRange(self.highestPrice);

            // for filter calculations
            self.chosenColor = ko.observableArray();
            self.chosenSize = ko.observableArray();
            self.chosenBrand = ko.observableArray();
            self.chosenRating = ko.observableArray();

            //forNoavailableproductsonfilter
            self.areProductsAvailable = ko.observable(true);

            // filterchnagefunction : calculate products for each filter
            self.AllFiltersChange = ko.computed(function () {
                var newPlpArray = [];
                var filtersToApply = [];
                if (self.chosenBrand().length != 0) {
                    filtersToApply.push("brand");
                    newPlpArray = self.applyfilters(self.chosenBrand(), self.ProductsWithoutFilter(),"brand");
                }

                if (self.chosenSize().length != 0) {
                    var last_size = self.chosenSize()[self.chosenSize().length - 1];
                    self.chosenSize().length = 0;
                    self.chosenSize().push(last_size);
                    if (newPlpArray.length != 0)
                        newPlpArray = self.applyfilters(self.chosenSize(), newPlpArray , "size");
                    else
                        newPlpArray = self.applyfilters(self.chosenSize(), self.ProductsWithoutFilter() ,"size");
                }
                if (self.chosenColor().length != 0) {
                    if (newPlpArray.length != 0)
                        newPlpArray = self.applyfilters(self.chosenColor(), newPlpArray, "color");
                    else
                        newPlpArray = self.applyfilters(self.chosenColor(), self.ProductsWithoutFilter(), "color");
                }

                if (self.chosenRating().length != 0) {
                    var last_rating = self.chosenRating()[self.chosenRating().length - 1];
                    self.chosenRating().length = 0;
                    self.chosenRating().push(last_rating);
                    if (newPlpArray.length != 0)
                        newPlpArray = self.applyfilters(self.chosenRating(), newPlpArray,"rating");
                    else
                        newPlpArray = self.applyfilters(self.chosenRating(), self.ProductsWithoutFilter(),"rating");
                }

                if (parseInt(self.maxRange()) > parseInt(self.minRange())) {
                    if (newPlpArray.length != 0)
                        newPlpArray = self.applyPricing(newPlpArray);
                    else
                        newPlpArray = self.applyPricing(self.ProductsWithoutFilter());
                }
                // remove duplicates from filtered array
                let removeduplicatedArray = [];
                $.each(newPlpArray, function (i, el) {
                    if ($.inArray(el, removeduplicatedArray) === -1) removeduplicatedArray.push(el);
                });

                // if filteres are applied but no product is available
                self.areProductsAvailable(true);
                if ((self.chosenSize().length != 0 || self.chosenBrand().length != 0 || self.chosenColor().length != 0 || self.chosenRating().length != 0) && newPlpArray.length == 0) {
                    self.areProductsAvailable(false);
                }

                self.filteredPlpArray(removeduplicatedArray);

                if (self.filteredPlpArray().length != 0) {
                    self.Products(self.filteredPlpArray());
                }
                else {
                    self.Products(self.ProductsWithoutFilter());
                }

            });

            // apply price filter on products
            // input 1. filteredarray OR totalarray of products
            // output products array having given min/max pricing
            self.applyPricing = function (arr) {
                var priceArr = [];
                for (var sku in arr) {

                    for (var productWithSize in arr[sku]["Sku"]) {
                        if ((arr[sku]["Sku"][productWithSize].price >= parseInt(self.minRange())) && (arr[sku]["Sku"][productWithSize].price <= parseInt(self.maxRange()))) {
                            priceArr.push(arr[sku]);
                        }
                    }
                }
                return priceArr;
            }

            // apply filter on products
            // input 1. selected filter 2. filteredarray OR totalarray of products 3.filter to apply
            // output products array including given sizes
            self.applyfilters = function (selectedfilterArray, arr, filterChosed) {
                var filteredArray = [];
                for(var filter in selectedfilterArray){
                    for (var eachProduct in arr) {
                        if (filterChosed == "size") {
                            if ($.inArray(selectedfilterArray[filter], arr[eachProduct].size) != -1) {
                                filteredArray.push(arr[eachProduct]);
                            }
                        }
                        if (filterChosed == "brand") {
                            if ($.inArray(selectedfilterArray[filter], arr[eachProduct].brand) != -1) {
                                filteredArray.push(arr[eachProduct]);
                            }
                        }
                        if (filterChosed == "color") {
                            if ($.inArray(selectedfilterArray[filter], arr[eachProduct].color) != -1) {
                                filteredArray.push(arr[eachProduct]);
                            }
                        }
                        if (filterChosed == "rating") {
                            if (parseInt(selectedfilterArray[filter], 10) < arr[eachProduct].rating) {
                                filteredArray.push(arr[eachProduct]);
                            }
                        }
                    }

                }
                return filteredArray;
            }

            // sort by low to high price function
            self.SortByPriceLowToHigh = function () {
                $("#SortByPriceHighToLow").css({ "font-weight": "normal" });
                $("#SortByPriceLowToHigh").css({ "font-weight": "bold" });
                $("#SortByPopularity").css({ "font-weight": "normal" });
                var lowtohighpricearr = $.extend(true, [], self.Products());
                lowtohighpricearr.sort((a, b) => (a.Sku[0].price < b.Sku[0].price) ? -1 : ((a.Sku[0].price > b.Sku[0].price) ? 1 : 0));
                self.Products(lowtohighpricearr);
            };

            // sort by high to low price function            
            self.SortByPriceHighToLow = function () {
                $("#SortByPriceHighToLow").css({ "font-weight": "bold" });
                $("#SortByPriceLowToHigh").css({ "font-weight": "normal" });
                $("#SortByPopularity").css({ "font-weight": "normal" });
                var hightolowpricearr = $.extend(true, [], self.Products());
                hightolowpricearr.sort((a, b) => (a.Sku[0].price > b.Sku[0].price) ? -1 : ((a.Sku[0].price < b.Sku[0].price) ? 1 : 0));
                self.Products(hightolowpricearr);
            };

            // sort by popularity function
            self.SortByPopularity = function () {
                $("#SortByPriceHighToLow").css({ "font-weight": "normal" });
                $("#SortByPriceLowToHigh").css({ "font-weight": "normal" });
                $("#SortByPopularity").css({ "font-weight": "bold" });
                var popularityarr = $.extend(true, [], self.Products());
                popularityarr.sort((a, b) => (a.Sku[0].rating > b.Sku[0].rating) ? -1 : ((a.Sku[0].rating < b.Sku[0].rating) ? 1 : 0));
                self.Products(popularityarr);
            };

            // for opening and closing panels of filters
            self.color_flag = ko.observable(false);
            self.size_flag = ko.observable(false);
            self.brand_flag = ko.observable(false);
            self.rating_flag = ko.observable(false);
            self.showSizeFilter = ko.observable(false);
            self.showBrandFilter = ko.observable(false);
            self.showColorFilter = ko.observable(false);
            self.showRatingFilter = ko.observable(false);

            self.brandPanelVisible = function () {
                this.showBrandFilter() ? this.showBrandFilter(false) : this.showBrandFilter(true);
            }
            self.brandFilterVisible = function () {
                this.brand_flag() ? this.brand_flag(false) : this.brand_flag(true);
            }

            self.sizePanelVisible = function () {
                this.showSizeFilter() ? this.showSizeFilter(false) : this.showSizeFilter(true);
            }

            self.sizeFilterVisible = function () {
                this.size_flag() ? this.size_flag(false) : this.size_flag(true);
            }

            self.colorPanelVisible = function () {
                this.showColorFilter() ? this.showColorFilter(false) : this.showColorFilter(true);
            }

            self.colorFilterVisible = function () {
                this.color_flag() ? this.color_flag(false) : this.color_flag(true);
            }

            self.ratingPanelVisible = function () {
                this.showRatingFilter() ? this.showRatingFilter(false) : this.showRatingFilter(true);
            }

            // color click changing price and size for sku
            self.ColorClick = function (product, clr) {
                var sizeArr = [];
                var img;
                var priceCurrent;
                $.each(product.Sku, function (index, value) {
                    if (value.color == clr) {
                        sizeArr.push(value.size);
                        img = value.imageurl;
                        priceCurrent = value.price;
                    }
                });

                var size = product.Sku[0].prodId + "_size";
                var priceId = product.Sku[0].prodId + "_price";
                $("#" + size).html("Size:" + sizeArr + " ");
                $("#" + priceId).html(priceCurrent);
                $("#" + product.Sku[0].prodId).attr("src", img);

            }

            self.favouritesArray = ko.observableArray();

            //addtoFavourites
            self.addToFavourite = function (id) {
                if (self.favouritesArray().includes(id)) {
                    for (var item in self.favouritesArray()) {
                        if (self.favouritesArray()[item] == id)
                            delete self.favouritesArray()[item];
                    }
                    $("#heart" + id).css('color', 'rgb(194, 193, 193)');
                } else {
                    self.favouritesArray().push(id);
                    $("#heart" + id).css('color', 'red');
                }

            }

            self.changeColor = function (product) {
                var color_span = product.Sku[0].prodId + "heart";
                $("#" + color_span).toggleClass('fas fa-heart heart fas fa-heart redHeart');
            }

            self.title = 'Product';
            self.productid = 1;
            self.skuid = 1;
        }

        var vm = {
            Main: new viewModel(),
            Page: new pageViewModel(),
            Product: new productViewModel()
        };




        Sammy(function () {
            this.get('#Home', function () {
                $(".navbar1").css({ "display": "none" });
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("page-template")
                vm.Page.name("Home")
            });

            this.get('#Plp', function () {
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("plp-template");
                $.getJSON('http://demo2828034.mockable.io/search/shirts', function (data) {

                    // create another similar array for array operations
                    var arrayForPriceRange = data["items"];
                    arrayForPriceRange.sort((a, b) => (a.price < b.price) ? -1 : ((a.price > b.price) ? 1 : 0));
                    vm.Product.lowestPrice(arrayForPriceRange[0].price);
                    vm.Product.highestPrice(arrayForPriceRange[arrayForPriceRange.length - 1].price);
                    vm.Product.middlePrice(arrayForPriceRange[arrayForPriceRange.length - 1].price - arrayForPriceRange[0].price);

                    // for filter calculation
                    var caculationsArray = data["items"];
                    var uniqueSizes = [];
                    var uniqueBrands = [];
                    var uniqueColors = [];
                    var uniqueRatings = [];
                    var distinctProductIds = [];
                    for (i = 0; i < caculationsArray.length; i++) {

                        if (uniqueSizes.indexOf(caculationsArray[i].size) === -1) {
                            uniqueSizes.push(caculationsArray[i].size);
                        }
                        if (uniqueBrands.indexOf(caculationsArray[i].brand) === -1) {
                            uniqueBrands.push(caculationsArray[i].brand);
                        }
                        if (uniqueColors.indexOf(caculationsArray[i].color) === -1) {
                            uniqueColors.push(caculationsArray[i].color);
                        }
                        if (uniqueRatings.indexOf(caculationsArray[i].rating) === -1) {
                            uniqueRatings.push(caculationsArray[i].rating);
                        }
                        if (distinctProductIds.indexOf(caculationsArray[i].prodId) === -1) {
                            distinctProductIds.push(caculationsArray[i].prodId);
                        }
                    }

                    // array for showing length and showing unique products
                    var uniqueProducts = [];

                    for (var j = 0; j < distinctProductIds.length; j++) {
                        var skuArrPerProduct = [];
                        var sizeArrPerProduct = [];
                        var brandArrPerProduct = [];
                        var colorArrPerProduct = [];
                        var ratingArrPerProduct = [];

                        $.each(data["items"], function (i, item) {
                            if (distinctProductIds[j] == item.prodId) {
                                skuArrPerProduct.push(item);
                                if (sizeArrPerProduct.indexOf(item.size) === -1) {
                                    sizeArrPerProduct.push(item.size);
                                }
                                if (brandArrPerProduct.indexOf(item.brand) === -1) {
                                    brandArrPerProduct.push(item.brand);
                                }
                                if (colorArrPerProduct.indexOf(item.color) === -1) {
                                    colorArrPerProduct.push(item.color);
                                }
                                if (ratingArrPerProduct.indexOf(item.rating) === -1) {
                                    ratingArrPerProduct.push(item.rating);
                                }
                            }
                        })
                        //push unique products
                        uniqueProducts.push({ "id ": distinctProductIds[j], "Sku": skuArrPerProduct, "color": colorArrPerProduct, "size": sizeArrPerProduct, "brand": brandArrPerProduct, "rating": ratingArrPerProduct });
                    }

                    // create filters and plp product array
                    vm.Product.Products(uniqueProducts);
                    vm.Product.ProductsWithoutFilter(uniqueProducts);
                    vm.Product.distinctSizes(uniqueSizes);
                    vm.Product.distinctColors(uniqueColors);
                    vm.Product.distinctBrands(uniqueBrands);
                    vm.Product.distinctRatings(uniqueRatings);
                    vm.Product.SortByPopularity();

                });
            });
            this.get('#Product', function () {

                vm.Main.chosenPageId(this.params.page);

                vm.Main.template("product-template")
            });
            this.get('#Product/:productid', function () {

                vm.Main.chosenPageId("Product");

                vm.Main.template("product-template")

            });
        }).run('#Home');
        ko.applyBindings(vm);
    });




})(jQuery);
