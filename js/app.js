;(function($){
    $(document).ready(function(){       
        function viewModel() {
            var self = this;
            self.searchData = ko.observable();
            self.chosenPageId = ko.observable();
            self.pages = ko.observableArray(["Home", "ProductList", "Product"]);
            self.template = ko.observable();
            self.demo = "ProductList";
            self.goToPage = function (page){
                location.hash = page;
            }
            self.goToProduct = function (productid){
                location.hash = 'Product/'+ productid;
            }
        }
        function pageViewModel() {
            var self = this;
            self.name = ko.observable('Home');
            self.content = ko.observable('Home default content')
        }
        function productViewModel() {
        var self = this;
        var bundleArray = [];
        self.displayProduct = ko.observableArray();
        self.sizeAll = ko.observableArray();
        self.colorAll = ko.observableArray();
        self.brandAll = ko.observableArray();
        self.ratingAll = ko.observableArray();
        self.ratingNumbers = ko.observableArray([1, 2, 3, 4]);
        self.sizeFlag = ko.observable(true);
        self.brandFlag = ko.observable(true);
        self.colorFlag = ko.observable(true);
        self.selectedMinPrice = ko.observable(0);
        self.selectedMaxPrice = ko.observable(0);
        self.selectedSize = ko.observableArray();
        self.selectedBrand = ko.observableArray();
        self.selectedColor = ko.observableArray();
        self.selectedRating = ko.observable();
        self.listItems = ko.observable(5); 
        self.categories = ko.observableArray();   
        var sizeAll = [];
        var brandAll = [];
        var colorAll = [];
        var category = [];  
         
        $.getJSON('http://demo2828034.mockable.io/search/shirts', function(data){
            self.getProductLevelArray(data['items']);
        });

        self.getProductLevelArray = function(skuLevelArray){
            skuLevelArray.map(function(eachSku){
                
                if(found = bundleArray.find(alrdy => alrdy.prodId === eachSku.prodId)){
                    found.productsAll.push(eachSku);
                    if($.inArray(eachSku.color, found.color) == -1){
                        found.color.push(eachSku.color)
                    }
                    if($.inArray(eachSku.size, found.size) == -1){
                        found.size.push(eachSku.size);
                    }
                    if($.inArray(eachSku.price, found.price) == -1){
                        found.price.push(eachSku.price);
                    }
                    if($.inArray(eachSku.imageurl, found.colorUrl) == -1){
                        found.colorUrl.push(eachSku.imageurl);
                    }
                }
                else{
                    var itemObject =  {
                        prodId : "",
                        name : "",
                        productsAll : [],
                        color : [],
                        size : [],
                        colorUrl:[],
                        rating : "",
                        brand : [],
                        price : []
                    };
                    itemObject.prodId = eachSku.prodId;
                    itemObject.name = eachSku.name;
                    itemObject.productsAll.push(eachSku);
                    itemObject.color.push(eachSku.color);
                    itemObject.size.push(eachSku.size);
                    itemObject.colorUrl.push(eachSku.imageurl);
                    itemObject.rating = eachSku.rating;
                    itemObject.brand.push(eachSku.brand);
                    itemObject.price.push(eachSku.price);
                    
                    bundleArray.push(itemObject);
                }
                if($.inArray(eachSku.size, sizeAll) == -1){
                    sizeAll.push(eachSku.size);
                }
                if($.inArray(eachSku.color, colorAll) == -1){
                    colorAll.push(eachSku.color);
                }
                if($.inArray(eachSku.brand, brandAll) == -1){
                    brandAll.push(eachSku.brand);
                }
                if($.inArray(eachSku.category, category) == -1){
                    category.push(eachSku.category);
                }
            });
            vm.Product.displayProduct(bundleArray);
            vm.Product.ratingSort();
            vm.Product.sizeAll(sizeAll);
            vm.Product.colorAll(colorAll);
            vm.Product.brandAll(brandAll);
            vm.Product.categories(category);
        }

        self.choosenColorImage = function (data, event){
            $("#"+data[1].prodId).css('background-image', 'url('+ data[1].colorUrl[data[0]]+')');
            var colorSizes = [];
            $.each(data[1].productsAll, function(ind, prod){
                if(prod.color == data[2]){
                    colorSizes.push(prod.size);
                }
            })
            var sizeId = data[1].prodId+'_size'
            $("#"+sizeId).text("Size : "+colorSizes.toString());
            if(data[1].price[data[0]] != undefined){
                $(".priceTag"+data[1].prodId).text(' '+data[1].price[data[0]]);
            }
        }
        self.toggleSize = function(){
            if(self.sizeFlag() == true)
                self.sizeFlag(false);
            else
                self.sizeFlag(true)
        }
        self.toggleBrand = function(){
            if(self.brandFlag() == true)
                self.brandFlag(false);
            else
                self.brandFlag(true)
        }
        self.toggleColor = function(){
            if(self.colorFlag() == true)
                self.colorFlag(false);
            else
                self.colorFlag(true)
        }
       
        self.priceLowtoHigh = function(){
            $("#priceLtHSort").siblings().css('font-weight', 'normal')
            $("#priceLtHSort").css('font-weight', 'bold');
            var priceLowtoHighArray = self.displayProduct();
            priceLowtoHighArray.sort((a,b) => (a.productsAll[0].price > b.productsAll[0].price) ? 1 : ((b.productsAll[0].price > a.productsAll[0].price) ? -1 : 0));
            vm.Product.displayProduct(priceLowtoHighArray);
        }

        self.priceHightoLow = function(){
            $("#priceHtLSort").siblings().css('font-weight', 'normal')
            $("#priceHtLSort").css('font-weight', 'bold');
            var priceHightoLowArray = self.displayProduct();
            priceHightoLowArray.sort((a,b) => (a.productsAll[0].price > b.productsAll[0].price) ? -1 : ((b.productsAll[0].price > a.productsAll[0].price) ? 1 : 0));
            vm.Product.displayProduct(priceHightoLowArray);
        }
        self.ratingSort = function(){
            $("#popSort").siblings().css('font-weight', 'normal')
            $("#popSort").css('font-weight', 'bold');
            var ratingSortArray = self.displayProduct();
            ratingSortArray.sort((a,b) => (a.rating > b.rating) ? -1 : ((b.rating > a.rating) ? 1 : 0));
            vm.Product.displayProduct(ratingSortArray);
        }

        self.showSortSection = function(){
            $(".filterDiv").css('display', 'none');
        }
        self.addToFavourite = function(heartId){
            $("#heart"+heartId).toggleClass('far fa-heart far fa-heart redHeart');
        }

        self.applyFacets = ko.computed(function(){
            if(self.selectedSize().length > 1){
                self.selectedSize.shift();
            }
            if(self.selectedColor().length > 1){
                self.selectedColor.shift();
            }
            var minPrice = parseInt(self.selectedMinPrice());
            var maxPrice = parseInt(self.selectedMaxPrice());
            var aftrpriceFiltered = [];
            var aftrSizeFiltered = [];
            var aftrBrandFiltered = [];
            var aftrColorFiltered = [];
            var aftrRatingFiltered = [];  

            function getFiltered(itemArray, selectedFilterArray, para){
                var filtered = [];
                itemArray.map(function(item){
                  if(para == 'size')
                    facet = item.size;
                  if(para == 'brand')
                  facet = item.brand;
                  if(para == 'color')
                  facet = item.color;

                  selectedFilterArray.filter(function(i){
                      if($.inArray(i, facet) != -1){
                        filtered.push(item);
                      }
                  });
                  
                })
                return filtered;
              }

            if(maxPrice != 0){
                bundleArray.map(function(elem){
                    if(minPrice < elem.price[0] && elem.price[0] < maxPrice){
                        aftrpriceFiltered.push(elem);
                    }
                });
            }else{
                aftrpriceFiltered = bundleArray;
            }
            if(self.selectedSize().length != 0){
                aftrSizeFiltered = getFiltered(aftrpriceFiltered, self.selectedSize(), 'size')
            }else{
                aftrSizeFiltered = aftrpriceFiltered;
            }
            if(self.selectedBrand().length != 0){
                aftrBrandFiltered = getFiltered(aftrSizeFiltered, self.selectedBrand(), 'brand');
            }else{
                aftrBrandFiltered = aftrSizeFiltered;
            }
            if(self.selectedColor().length != 0){
                aftrColorFiltered = getFiltered(aftrBrandFiltered, self.selectedColor(), 'color');
            }else{
                aftrColorFiltered = aftrBrandFiltered;
            }
            if(self.selectedRating()){
                aftrColorFiltered.map(function(e){
                    if(parseFloat(e.rating) >= parseInt(self.selectedRating())){
                        aftrRatingFiltered.push(e);
                    }
                })
            }else{
                aftrRatingFiltered = aftrColorFiltered;
            }
             self.displayProduct(aftrRatingFiltered);
        });     
    }

    var vm = {
        Main: new viewModel(),
        Page: new pageViewModel(),
        Product: new productViewModel
    };

    Sammy(function () {
            this.get('#Home', function () {
                vm.Main.chosenPageId(this.params.page);     
                vm.Main.template("landing-template")
                vm.Page.name("Home")
                $.get('./server/home.json',function(data){
                    vm.Page.name(data.title);
                    vm.Page.content(data.content);
                })
            });
            this.get('#ProductList', function () {
                
                vm.Main.chosenPageId(this.params.page);     
                vm.Main.template("productList-template")
                
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

    $(document).on('click', '.panelHeading', function(e){
        var $this = $(this);
        if(!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.addClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        } else {
           
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.removeClass('panel-collapsed');
           
            $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
    });
    $('.rating').on('change', function() {
        $('.rating').not(this).prop('checked', false);  
    });
})(jQuery);