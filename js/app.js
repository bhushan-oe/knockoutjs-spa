;(function ($) {

    $(function () {   

        function viewModel() {
            this.template = ko.observable();
            this.goToProductList = function (page) {
                location.hash = "#/" + page;
            }
        }

        function homeViewModel() {
            this.searchName = ko.observable();
        }

        function getUniqueRecords(arr) {
            return ko.utils.arrayGetDistinctValues(arr);
        }

        var sortMethod = "popularity";

        function brandSort(brandA, brandB) {
            var val = 0;
            var sortedBrandA = brandA.selectedProductList().sort(productSort);
            var sortedBrandB = brandB.selectedProductList().sort(productSort);
            var brandAVal = sortedBrandA[0];
            var brandBVal = sortedBrandB[0];

            brandA.selectedProductList(sortedBrandA);
            brandA.setDefaultProductList();
            brandB.selectedProductList(sortedBrandB);
            brandB.setDefaultProductList();

            switch (sortMethod) {
                case "HighToLow":
                    val = HighToLowSort(brandAVal.price(), brandBVal.price());
                    break;
                case "LowToHigh":
                    val = LowToHighSort(brandAVal.price(), brandBVal.price());
                    break;
                default:
                    val = HighToLowSort(brandAVal.rating(), brandBVal.rating());
            }
            return val;
        }

        function productSort(productA, productB) {
            var val = 0;
            switch (sortMethod) {
                case "HighToLow":
                    val = HighToLowSort(productA.price(), productB.price());
                    break;
                case "LowToHigh":
                    val = LowToHighSort(productA.price(), productB.price());
                    break;
                default:
                    val = HighToLowSort(productA.rating(), productB.rating());
            }
            return val;
        }

        function LowToHighSort(valA, valB) {
            return valA < valB ? -1 : valA > valB ? 1 : 0;
        }
        function HighToLowSort(valA, valB) {
            return valA > valB ? -1 : valA < valB ? 1 : 0;
        }

        function productListViewModel() {
            var self = this;

            self.golbalBrandList = ko.observableArray([]);

            self.productBrandList = ko.observableArray();

            self.brandList = ko.computed(function () {
                var productBrandNames = ko.utils.arrayMap(self.golbalBrandList(), function (productBrand) {
                    return productBrand.brand();
                });
                return getUniqueRecords(productBrandNames);
            });

            self.categoryList = ko.computed(function () {
                var categoryNames = ko.utils.arrayMap(self.golbalBrandList(), function (productBrand) {
                    return productBrand.category();
                });

                return getUniqueRecords(categoryNames);
            });

            self.colorList = ko.computed(function () {
                var colorNames = [];
                ko.utils.arrayForEach(self.golbalBrandList(), function (productBrand) {
                    ko.utils.arrayForEach(productBrand.brandProductList(), function (currentProduct) {
                        colorNames.push(currentProduct.color());
                    });
                });

                return getUniqueRecords(colorNames);
            });

            self.sizeList = ko.computed(function () {
                var sizes = [];
                ko.utils.arrayForEach(self.golbalBrandList(), function (productBrand) {
                    ko.utils.arrayForEach(productBrand.brandProductList(), function (currentProduct) {
                        sizes.push(currentProduct.size());
                    });
                });
                return getUniqueRecords(sizes);
            });

            self.ratingList = ko.computed(function () {
                var ratings = [];
                ko.utils.arrayForEach(self.golbalBrandList(), function (productBrand) {
                    ko.utils.arrayForEach(productBrand.brandProductList(), function (currentProduct) {
                        ratings.push(Math.floor(currentProduct.rating()));
                    });
                });
                return getUniqueRecords(ratings);
            });

            self.sortingMethod = ko.observable("popularity");

            self.sortBy = function (method) {
                if (sortMethod == method) {
                    return;
                }
                sortMethod = method;
                self.sortingMethod(method);
                self.productBrandList(self.productBrandList().sort(brandSort));
            };

            self.selectedBrandList = ko.observableArray([]);
            self.selectedCategory = ko.observable();
            self.minPriceVal = 0;
            self.maxPriceVal = 1000;
            self.minPrice = ko.observable(self.minPriceVal);
            self.maxPrice = ko.observable(self.maxPriceVal);
            self.selectedColor = ko.observable();
            self.selectedSizeList = ko.observableArray([]);
            self.selectedRatingList = ko.observableArray([]);

            self.clearCategoryFilter = function () {
                self.selectedCategory(undefined);
                self.filterdAction();
            }

            self.clearBrandFilter = function () {
                self.selectedBrandList([]);
                self.filterdAction();
            }

            self.clearColorFilter = function () {
                self.selectedColor(undefined);
                self.filterdAction();
            }

            self.clearSizeFilter = function () {
                self.selectedSizeList([]);
                self.filterdAction();
            }

            self.clearRatingFilter = function () {
                self.selectedRatingList([]);
                self.filterdAction();
            }

            self.filterdCategory = function (category) {
                self.selectedCategory(category);
                self.filterdAction();
            }

            self.filterdAction = function () {

                if (self.selectedBrandList().length == 0 && self.selectedCategory() == undefined && self.selectedColor() == undefined && self.selectedSizeList().length == 0 && self.selectedRatingList().length == 0 && self.minPrice() == self.minPriceVal && self.maxPrice() == self.maxPriceVal) {
                    ko.utils.arrayForEach(self.golbalBrandList(), function (productBrand) {
                        productBrand.setDefaultSelectedProductList();
                    });

                    self.productBrandList(self.golbalBrandList().sort(brandSort));
                }
                else {

                    var filteredProductbrandList = [];
                    if (!(self.selectedBrandList().length == 0 && self.selectedCategory() == undefined)) {
                        filteredProductbrandList = ko.utils.arrayFilter(self.golbalBrandList(), function (productBrand) {
                            return (self.selectedBrandList().length == 0 ? true : self.selectedBrandList.indexOf(productBrand.brand()) != -1) && (self.selectedCategory() == undefined ? true : self.selectedCategory() == productBrand.category());
                        });
                    }
                    else {
                        ko.utils.arrayForEach(self.golbalBrandList(), function (globalBrand) {
                            filteredProductbrandList.push(globalBrand);
                        });
                    }

                    if (!(self.selectedSizeList().length == 0 && self.selectedColor() == undefined && self.selectedRatingList().length == 0 && self.minPrice() == self.minPriceVal && self.maxPrice() == self.maxPriceVal)) {
                        for (var i = 0; i < filteredProductbrandList.length; ++i) {
                            var productBrand = filteredProductbrandList[i];
                            var filteredProducts = self.filteredProduct(productBrand.brandProductList());
                            if (filteredProducts == undefined || filteredProducts.length == 0) {
                                productBrand.selectedProductList([]); // need to comment out these 2 lines
                                productBrand.setDefaultProductList();
                                filteredProductbrandList.splice(i, 1);
                                --i;
                            }
                            else {
                                productBrand.selectedProductList(filteredProducts);
                                productBrand.setDefaultProductList();
                            }

                        }                        
                    }
                    else {
                        ko.utils.arrayForEach(filteredProductbrandList, function (productBrand) {
                            productBrand.setDefaultSelectedProductList(); // it will set seletced as well as default product list also
                        });
                    }

                    self.productBrandList(filteredProductbrandList.sort(brandSort));

                }
                return true;
            }

            self.filteredProduct = function productFilter(products) {
                var filteredProducts = ko.utils.arrayFilter(products, function (product) {
                    return (self.selectedSizeList().length == 0 ? true : self.selectedSizeList().indexOf(product.size()) != -1)
                        && (self.selectedColor() == undefined ? true : self.selectedColor() == product.color())
                        && (self.selectedRatingList().length == 0 ? true : isRatingPresent(product.rating()))
                        && ((self.minPrice() == undefined || self.maxPrice() == undefined) ? true : (product.price() >= parseInt(self.minPrice()) && product.price() <= parseInt(self.maxPrice())));
                });
                return filteredProducts;
            }

            function isRatingPresent(rating) {
                var ratingToBeAbove = self.selectedRatingList().sort()[0];                
                return rating >= ratingToBeAbove;
            }

            self.setDefaultBrandList = function () {
                self.productBrandList(self.golbalBrandList().sort(brandSort));
            }

            self.addProductBrand = function (productBrand) {
                self.golbalBrandList.push(productBrand);
            };
        }

        function productBrand() {
            var self = this;
            self.prodId = ko.observable();
            self.brand = ko.observable();
            self.name = ko.observable();
            self.category = ko.observable();

            self.brandProductList = ko.observableArray([]);
            self.selectedProductList = ko.observableArray([]);
            self.productList = ko.observableArray([]);
           
            self.addProduct = function (product) {
                self.brandProductList.push(product);               
            };

            self.setDefaultSelectedProductList = function () {
                self.selectedProductList(self.brandProductList());
                self.setDefaultProductList();
            };

            self.colorList = ko.computed(function () {
                var colors = ko.utils.arrayMap(self.selectedProductList(), function (product) {
                    return product.color();
                });

                var distinctColors = ko.utils.arrayGetDistinctValues(colors);
                return distinctColors;
            });

            self.setDefaultProductList = function () {
                var defaultProductList = ko.utils.arrayFilter(self.selectedProductList(), function (product) {
                    return product.color() == self.colorList()[0];
                });
                self.productList(defaultProductList);
            };

            self.sizeList = ko.computed(function () {
                var sizes = ko.utils.arrayMap(self.productList(), function (product) {
                    return product.size();
                });
              
                return sizes;
            });

            self.selectedProduct = ko.computed(function () {
                return self.productList()[0];
            });

            self.setProduct = function (color) {             
                var filteredProductList = ko.utils.arrayFilter(self.selectedProductList(), function (product) {
                    return color == product.color();
                });
                self.productList(filteredProductList);
            };
        }

        function Product() {
            var self = this;
            self.skuId = ko.observable();
            self.color = ko.observable();
            self.imageurl = ko.observable();
            self.size = ko.observable();
            self.rating = ko.observable();
            self.price = ko.observable();
            self.liked = ko.observable(false);
            self.addFavourite = function () {
                self.liked(true);
            }
        }

        function productViewModel() {
            var self = this;
            self.template = ko.observable('productDisplayPage-template');
        }

        var vm = {
            Main: new viewModel(),
            Home: new homeViewModel(),
            ProductList: new productListViewModel(),
            ProductDesiplay: new productViewModel()
        };      

        var app = $.sammy('#main', function () {

            this.get('#/', function (context) {
                vm.Home.searchName("serachProduct");
                vm.Main.template("landingPage-template");
            });
            var brandObj = {};
            var productBrandList = {};
            function BrandObject(prodId, brand, name, category) {
                this.prodId = prodId;
                this.brand = brand;
                this.name = name;
                this.category = category;
            }
            function productObject(skuId, color, imageurl, size, rating, price) {
                this.skuId = skuId;
                this.color = color;
                this.imageurl = imageurl;
                this.size = size;
                this.rating = rating;
                this.price = price;
            }
            this.get('#/serachProduct', function (context) {
                this.load('http://demo2828034.mockable.io/search/shirts')
                    .then(function (data) {
                        $.each(data["items"], function (index, product) {
                          //context.log("Product Desc --> " + product.prodId + " : " + product.skuId + " brand: " + product.brand, " color: " + product.color);
                            var productObj = new productObject(product.skuId, product.color.trim(), product.imageurl, product.size, product.rating, product.price);
                            if (productBrandList[product.brand] == undefined) {
                                productBrandList[product.brand] = [];
                            }
                            if (brandObj[product.brand] == undefined) {
                                var brandObject = new BrandObject(product.prodId, product.brand, product.name, product.category);
                                brandObj[product.brand] = brandObject;
                            }
                            productBrandList[product.brand].push(productObj);

                        });
                        vm.ProductList = new productListViewModel();
                        for (const key in brandObj) {
                            var brandObject = brandObj[key];
                            var productBrandObj = new productBrand();
                            productBrandObj.prodId(brandObject.prodId);
                            productBrandObj.category(brandObject.category);
                            productBrandObj.name(brandObject.name);
                            productBrandObj.brand(key);
                            ko.utils.arrayForEach(productBrandList[key], function (brandProduct) {
                                var productObj = new Product();
                                productObj.skuId(brandProduct.skuId);
                                productObj.color(brandProduct.color);
                                productObj.size(brandProduct.size);
                                productObj.rating(brandProduct.rating);
                                productObj.price(brandProduct.price);
                                productObj.imageurl(brandProduct.imageurl);                              
                                productBrandObj.addProduct(productObj);
                            });
                            productBrandObj.setDefaultSelectedProductList();
                            vm.ProductList.addProductBrand(productBrandObj);
                        }
                        vm.ProductList.setDefaultBrandList();
                        vm.Main.template("productListPage-template");                                                                    
                    });
            });

        });

        app.run('#/');
        ko.applyBindings(vm);
    });

})(jQuery);