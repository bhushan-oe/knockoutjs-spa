;
(function($) {

    $(document).ready(function() {
        function viewModel() {
            var self = this;
            self.searchCategory = ko.observable('');

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
            self.selectedCategory = ko.observableArray();
            self.selectedMinPrice = ko.observable(100);
            self.selectedMaxPrice = ko.observable(800);
            self.brandFlag = ko.observable(false);
            self.colorFlag = ko.observable(false);
            self.sizeFlag = ko.observable(false);
            self.priceFlag = ko.observable(false);
            self.ratingFlag = ko.observable(false);
            var dataArray = [];
            var tempDataArray = [];
            var self = this;
            $.ajax({
                url: "http://demo2828034.mockable.io/search/shirts",
                success: function(result) {
                    var filterOptions = loadFilteroptions(result.items);

                    self.filterCategories(filterOptions.brands, 'brands');

                    self.filterCategories(filterOptions.rating, 'rating');

                    self.filterCategories(filterOptions.colors, 'colors');

                    self.filterCategories(filterOptions.size, 'size');

                    self.filterCategories(filterOptions.category, 'category');

                    self.filterCategories(filterOptions.colors, 'colors');

                    self.filterCategories(filterOptions.price, 'price');

                    self.toggleFilter = function(id, flag) {
                        vm.Products[flag](true);
                        $("#" + id).css('display', 'none');
                    };
                    self.ratingSort = function(e, _this) {
                        $(_this.currentTarget).css({ 'font-weight': 'bold' });
                        var ratingSortArray = vm.Products.productArray();
                        ratingSortArray.sort((a, b) => (a.skuId[0].rating > b.skuId[0].rating) ? -1 : ((b.skuId[0].rating > a.skuId[0].rating) ? 1 : 0));
                        vm.Products.productArray(ratingSortArray);
                    }
                    self.priceLowtoHigh = function(e, _this) {
                        $(_this.currentTarget).css({ 'font-weight': 'bold' });
                        var priceLowtoHighArray = vm.Products.productArray();
                        priceLowtoHighArray.sort((a, b) => (a.skuId[0].price > b.skuId[0].price) ? 1 : ((b.skuId[0].price > a.skuId[0].price) ? -1 : 0));
                        vm.Products.productArray(priceLowtoHighArray);

                    }
                    self.priceHightoLow = function(e, _this) {
                        $(_this.currentTarget).css({ 'font-weight': 'bold' });
                        var priceHightoLowArray = vm.Products.productArray();
                        priceHightoLowArray.sort((a, b) => (a.skuId[0].price > b.skuId[0].price) ? -1 : ((b.skuId[0].price > a.skuId[0].price) ? 1 : 0));
                        vm.Products.productArray(priceHightoLowArray);
                    }

                    self.handleCategoryClick = function(e) {
                        self.selectedCategory([]);
                        self.selectedCategory.push(e);
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
                    var isPresentInArray = function(prop, arr) {
                        var i = $.inArray(prop, arr);
                        return i < 0 ? false : true;
                    };
                    self.productArray(tempDataArray);
                    var minPrice = parseInt(self.selectedMinPrice());
                    var maxPrice = parseInt(self.selectedMaxPrice());
                    var aftrpriceArray = [];
                    var priceFilter = [];
                    if (maxPrice != 100) {
                        $.each(tempDataArray, function(ind, elem) {

                            for (i = 0; i < elem.skuId.length; i++)
                                if (minPrice < elem.skuId[0].price && elem.skuId[0].price < maxPrice) {
                                    aftrpriceArray.push(elem);
                                    $.each(aftrpriceArray, function(i, col) {
                                        if ($.inArray(col, priceFilter) === -1) priceFilter.push(col);
                                    });
                                }
                        });
                    } else {
                        priceFilter = tempDataArray;
                    }
                    //Start filters Functionality
                    self.applyFilters = ko.computed(function() {
                        var pMinFilter = self.selectedMinPrice();
                        var pMaxFilter = self.selectedMaxPrice();
                        var bFilter = self.selectedBrand();
                        var cFilters = self.selectedColor();
                        var rFilter = self.selectedRating();
                        var sFilter = self.selectedSize();
                        var cateFilter = self.selectedCategory();

                        if (bFilter.length > 0 || cFilters.length > 0 || rFilter.length > 0 || sFilter.length > 0 || cateFilter.length > 0 || pMinFilter > 100 || pMaxFilter < 800) {
                            var filtered = ko.utils.arrayFilter(priceFilter, function(items) {
                                var filterData = ko.utils.arrayFilter(items.skuId, function(data) {
                                    return (bFilter.length > 0 ? isPresentInArray(data.brand, bFilter) : true) &&
                                        (cFilters.length > 0 ? isPresentInArray(data.color, cFilters) : true) &&
                                        (sFilter.length > 0 ? isPresentInArray(data.size, sFilter) : true) &&
                                        (cateFilter.length > 0 ? isPresentInArray(data.category, cateFilter) : true) &&
                                        (data.price < pMaxFilter) &&
                                        (data.price > pMinFilter) &&
                                        (rFilter.length > 0 ? isPresentInArray(data.rating.toString(), rFilter) : true);

                                });
                                if (filterData.length > 0) return filterData;
                            });

                            self.productArray(filtered);
                        } else {
                            return self.productArray(tempDataArray);
                        }
                    });
                    //End filters Functionality
                }

            });
            self.productArray = ko.observableArray();
            self.DispcolorSize = function(product, color) {
                var size = [],
                    img, price;
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
            self.filterCategories = function(arr, category) {
                var _arr = [];
                $.each(arr, function(i, col) {
                    if ($.inArray(col, _arr) === -1) _arr.push(col);
                });
                vm[category](_arr);
            };

        }

        var checkWidth = function() {
            var w = $(window);

            return w;
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
            checkWidth: ko.observable()
        };

        var w = $(window);
        w.resize(function() {
            vm.checkWidth(w.width());
        });

        w.load(function() {
            vm.checkWidth(w.width());
        });

        Sammy(function() {
            this.get('#Home', function() {
                $(".header").css("display", "none");
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("searchingPage");
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