;
(function($) {

    $(document).ready(function() {
        function viewModel() {
            var self = this;
            self.chosenPageId = ko.observable();
            self.template = ko.observable();
            self.plp = "plppage";
            self.goToPage = function(page) {
                location.hash = page;
            }
            self.goToProduct = function(productid) {
                location.hash = 'Product/' + productid;

            }
        }

        function pageViewModel() {
            var self = this;
            self.name = ko.observable('Home');
            self.content = ko.observable('Home default content')
        }

        function loadFilteroptions(products) {
            var brands = [];
            var colors = [];
            var size = [];
            var rating = [];
            var category = [];
            var price = [];

            products.forEach(function(product) {
                brands.push(product.brand);
                colors.push(product.color);
                size.push(product.size);
                rating.push(product.rating);
                category.push(product.category);
                price.push(product.price);
            });

            return {
                brands: brands,
                colors: colors,
                size: size,
                rating: rating,
                category: category,
                price: price
            }
        }

        function productsViewModel() {
            var self = this;
            self.selectedSize = ko.observableArray();
            self.selectedBrand = ko.observableArray();
            self.selectedColor = ko.observableArray();
            self.selectedRating = ko.observableArray();
            self.selectedMinPrice = ko.observable(100);
            self.selectedMaxPrice = ko.observable(0);
            self.brandFlag = ko.observable(false);
            self.colorFlag = ko.observable(false);
            self.sizeFlag = ko.observable(false);
            self.priceFlag = ko.observable(false);
            var bundleArray = [];
            var dataArray = [];
            var tempDataArray = [];
            var self = this;
            $.ajax({
                url: "http://demo2828034.mockable.io/search/shirts",
                success: function(result) {
                    var filterOptions = loadFilteroptions(result.items);
                    var newbrand = [];
                    var newcolor = [];
                    var newsize = [];
                    var newrating = [];
                    var newprice = [];
                    var newcategory = [];

                    $.each(filterOptions.brands, function(i, col) {
                        if ($.inArray(col, newbrand) === -1) newbrand.push(col);
                    });
                    vm.brands(newbrand);

                    $.each(filterOptions.colors, function(i, col) {
                        if ($.inArray(col, newcolor) === -1) newcolor.push(col);
                    });
                    vm.colors(newcolor);

                    $.each(filterOptions.size, function(i, col) {
                        if ($.inArray(col, newsize) === -1) newsize.push(col);
                    });
                    vm.size(newsize);


                    $.each(filterOptions.rating, function(i, col) {
                        if ($.inArray(col, newrating) === -1) newrating.push(col);
                    });
                    vm.rating(newrating);

                    $.each(filterOptions.category, function(i, col) {
                        if ($.inArray(col, newcategory) === -1) newcategory.push(col);
                    });
                    vm.category(newcategory);

                    $.each(filterOptions.price, function(i, col) {
                        if ($.inArray(col, newprice) === -1) newprice.push(col);
                    });
                    vm.price(newprice);

                    self.showAllBrandFilter = function() {
                        vm.Products.brandFlag(true);
                        $("#showBrandTag").css('display', 'none')
                    }
                    self.showAllColorFilter = function() {
                        vm.Products.colorFlag(true);
                        $("#showColorTag").css('display', 'none')
                    }
                    self.showAllSizeFilter = function() {
                        vm.Products.priceFlag(true);
                        $("#showSizeTag").css('display', 'none')
                    }
                    self.ratingSort = function() {
                        $("#popSort").css('font-weight', 'bold');
                        $("#priceLtHSort").css('font-weight', 'normal');
                        $("#priceHtLSort").css('font-weight', 'normal');
                        var ratingSortArray = tempDataArray;
                        ratingSortArray.sort((a, b) => (a.skuId[0].rating > b.skuId[0].rating) ? -1 : ((b.skuId[0].rating > a.skuId[0].rating) ? 1 : 0));
                        vm.Products.productArray(ratingSortArray);
                    }
                    self.priceLowtoHigh = function() {
                        $("#priceLtHSort").css('font-weight', 'bold');
                        $("#priceHtLSort").css('font-weight', 'normal');
                        $("#popSort").css('font-weight', 'normal');
                        var priceLowtoHighArray = tempDataArray;
                        priceLowtoHighArray.sort((a, b) => (a.skuId[0].price > b.skuId[0].price) ? 1 : ((b.skuId[0].price > a.skuId[0].price) ? -1 : 0));
                        vm.Products.productArray(priceLowtoHighArray);
                    }
                    self.priceHightoLow = function() {
                        $("#priceHtLSort").css('font-weight', 'bold');
                        $("#priceLtHSort").css('font-weight', 'normal');
                        $("#popSort").css('font-weight', 'normal');
                        var priceHightoLowArray = tempDataArray;
                        priceHightoLowArray.sort((a, b) => (a.skuId[0].price > b.skuId[0].price) ? -1 : ((b.skuId[0].price > a.skuId[0].price) ? 1 : 0));
                        vm.Products.productArray(priceHightoLowArray);
                    }

                    for (var object in result.items) {
                        var isPresent = true;
                        for (var temp in dataArray) {
                            if (temp == result.items[object].prodId) {
                                dataArray[temp].push(result.items[object]);
                                isPresent = false;
                            }
                        }
                        if (isPresent === true)
                            dataArray[result.items[object].prodId] = [result.items[object]];

                    }
                    for (var sameProdId in dataArray) {
                        var tryArray = [];

                        var colorArr = [];
                        var sizeArr = [];
                        var newColorArr = [];
                        var newSizeArr = [];
                        for (var skuId in dataArray[sameProdId]) {
                            colorArr.push(dataArray[sameProdId][skuId].color);
                            sizeArr.push(dataArray[sameProdId][skuId].size);
                        }
                        $.each(colorArr, function(i, col) {
                            if ($.inArray(col, newColorArr) === -1) newColorArr.push(col);
                        });
                        $.each(sizeArr, function(i, col) {
                            if ($.inArray(col, newSizeArr) === -1) newSizeArr.push(col);
                        });

                        tempDataArray.push({ 'prodId': sameProdId, 'skuId': dataArray[sameProdId], 'color': newColorArr, 'size': newSizeArr });

                    }
                    self.applyFilters = ko.computed(function() {
                        var BrandArray = [];
                        var SizeArray = [];
                        var aftrpriceArray = [];
                        var aftrColorArray = [];
                        var minPrice = parseInt(self.selectedMinPrice());
                        var maxPrice = parseInt(parseInt(self.selectedMaxPrice()) + parseInt(self.selectedMinPrice()));
                        if (maxPrice != 100) {
                            $.each(tempDataArray, function(ind, elem) {

                                for (i = 0; i < elem.skuId.length; i++)
                                    if (minPrice < elem.skuId[0].price && elem.skuId[0].price < maxPrice) {
                                        aftrpriceArray.push(elem);
                                    }
                            });
                        } else {
                            aftrpriceArray = tempDataArray;
                        }

                        if (self.selectedSize().length != 0) {
                            $.each(aftrpriceArray, function(ind, elem) {
                                for (p = 0; p < self.selectedSize().length; p++) {

                                    for (i = 0; i < elem.size.length; i++)
                                        if (elem.size[i] == self.selectedSize()[p]) {
                                            SizeArray.push(elem);
                                        }
                                }

                            });

                        } else {
                            SizeArray = aftrpriceArray;

                        }
                        var filtBrandArr = [];
                        if (self.selectedBrand().length != 0) {
                            $.each(SizeArray, function(ind, elem) {
                                for (q = 0; q < self.selectedBrand().length; q++) {
                                    for (j = 0; j < elem.skuId.length; j++)

                                        if (elem.skuId[j].brand == self.selectedBrand()[q]) {
                                            BrandArray.push(elem);
                                            $.each(BrandArray, function(i, col) {
                                                if ($.inArray(col, filtBrandArr) === -1) filtBrandArr.push(col);
                                            });
                                        }

                                }
                            });
                        } else {
                            filtBrandArr = SizeArray;
                        }
                        if (self.selectedColor().length != 0) {
                            $.each(filtBrandArr, function(ind, elem) {
                                for (q = 0; q < self.selectedColor().length; q++) {
                                    for (i = 0; i < elem.color.length; i++)
                                        if (elem.color[i] == self.selectedColor()[q]) {
                                            aftrColorArray.push(elem);
                                        }
                                }
                            });
                        } else {
                            aftrColorArray = filtBrandArr;
                        }
                        self.productArray(aftrColorArray);
                    })

                }

            });
            self.productArray = ko.observableArray();
            self.myFunction = function(product, color) {
                var size = [];
                var img;
                var price;
                for (var skuId in product.skuId) {
                    if (color == product.skuId[skuId].color) {
                        size.push(product.skuId[skuId].size);
                        img = product.skuId[skuId].imageurl;
                        price = product.skuId[skuId].price;
                    }
                }
                $("#" + product.prodId).css('background-image', 'url(' + img + ')');
                $("#" + product.prodId + "size").text('size :' + size);
                $("#" + product.prodId + "price").text(' ' + price);

            }
        }

        var vm = {
            Main: new viewModel(),
            Page: new pageViewModel(),
            Products: new productsViewModel(),
            brands: ko.observableArray([]),
            colors: ko.observableArray([]),
            size: ko.observableArray([]),
            rating: ko.observableArray([]),
            category: ko.observableArray([]),
            price: ko.observableArray([]),

        };
        Sammy(function() {
            this.get('#Home', function() {
                $(".header").css("display", "none");
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("searching-page");
                vm.Page.name("Home");
            });

            this.get('#plppage', function() {

                $(".header").css("display", "none");
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("plppage");
                vm.Page.name("plppage");

            });

        }).run('#Home');
        ko.applyBindings(vm);
    });

})(jQuery);