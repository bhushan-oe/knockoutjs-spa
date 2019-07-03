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

        // This is Home page viewModel

        function pageViewModel() {
            var self = this;
            self.name = ko.observable('Home');
            self.content = ko.observable('Home default content')
        }
        // This is productListing Page ViewModel

        function productViewModel() {
        var self = this;
        self.title = 'Product';
        self.productid = 1;
        self.skuid = 1;
        
        self.jsonData = ko.observableArray();
        self.sizeAll = ko.observableArray();
        self.colorAll = ko.observableArray();
        self.brandAll = ko.observableArray();
        self.ratingAll = ko.observableArray();
        self.sizeFlag = ko.observable(false);
        self.brandFlag = ko.observable(false);
        self.colorFlag = ko.observable(false);
        self.ratingFlag = ko.observable(false);
        self.selectedMinPrice = ko.observable(100);
        self.selectedMaxPrice = ko.observable(0);
        self.selectedSize = ko.observable();
        self.selectedBrand = ko.observableArray();
        self.selectedColor = ko.observableArray();
        self.selectedRating = ko.observable();
        self.screenWidth = ko.observable($(window).width());         
        var bundleArray = [];
        var alljsondata = [];
        var filteredArray = [];
        //self.defaultImag = ko.observable('http://monitoring-1878379754.us-west-2.elb.amazonaws.com/Photos/pour-femme-original_1.jpeg');
        
        $.getJSON('http://demo2828034.mockable.io/search/shirts', function(data){
            var itemArray = [];
            var smplsizeAll = [];
            var smplbrandAll = [];
            var smplcolorAll = [];
            var smplratingAll = [];
            alljsondata = data['items'];
            // console.log(alljsondata);
            $.each(data["items"], function(i, item){
                itemArray.push(item.prodId);
                smplsizeAll.push(item.size);
                smplbrandAll.push(item.brand);
                smplcolorAll.push(item.color);
                smplratingAll.push(item.rating);
            });  
            var prodIdList = [];
            $.each(itemArray, function(i, el){
                if($.inArray(el, prodIdList) === -1) prodIdList.push(el);
            });


            sizeAll = [];
            $.each(smplsizeAll, function(i, el){
                if($.inArray(el, sizeAll) === -1) sizeAll.push(el);
            });
            colorAll = [];
            $.each(smplcolorAll, function(i, el){
                if($.inArray(el, colorAll) === -1) colorAll.push(el);
            });
            brandAll = [];
            $.each(smplbrandAll, function(i, el){
                if($.inArray(el, brandAll) === -1) brandAll.push(el);
            });
            ratingAll = [];
            $.each(smplratingAll, function(i, el){
                if($.inArray(el, ratingAll) === -1) ratingAll.push(el);
            });
    
            //console.log(ratingAll)
            
            // console.log(itemObject.color)
            
            for(x = 0; x < prodIdList.length; x++){
                var itemObject =  {
                    prodId : "",
                    productsAll : [],
                    color : [],
                    size : [],
                    colorUrl:[],
                    rating : "",
                    brand : "",
                    price : []
                };
                itemObject.prodId = prodIdList[x];
                smplcolor = [];
                smplsize = []
                samplcolorurl = [];
                smplprice = [];
                for(y = 0; y < data["items"].length; y++){
                    
                    if(prodIdList[x] == data["items"][y].prodId){
                        itemObject.productsAll.push(data["items"][y]);
                        smplcolor.push(data["items"][y].color);
                        smplsize.push(data["items"][y].size);
                        itemObject.rating = data["items"][y].rating;
                        itemObject.brand = data["items"][y].brand;
                        smplprice.push(data["items"][y].price)

                        if(Array.isArray(data["items"][y].imageurl)){
                            samplcolorurl = data["items"][y].imageurl;    
                        }else{
                            samplcolorurl.push(data["items"][y].imageurl)
                        }
                    }
                    //console.log(itemObject);
                    $.each(smplcolor, function(i, el){
                        if($.inArray(el, itemObject.color) === -1) itemObject.color.push(el);
                    });
                    $.each(smplsize, function(i, el){
                        if($.inArray(el, itemObject.size) === -1) itemObject.size.push(el);
                    });
                    $.each(samplcolorurl, function(i, el){
                        if($.inArray(el, itemObject.colorUrl) === -1) itemObject.colorUrl.push(el);
                    });
                    $.each(smplprice, function(i, el){
                        if($.inArray(el, itemObject.price) === -1) itemObject.price.push(el);
                    });

                }
                bundleArray.push(itemObject);
            }
            //console.log(bundleArray);
            vm.Product.jsonData(bundleArray);
            vm.Product.ratingSort();
            vm.Product.sizeAll(sizeAll);
            vm.Product.colorAll(colorAll);
            vm.Product.brandAll(brandAll);
            vm.Product.ratingAll(ratingAll);
        });

    
        self.colorHover = function (data, event){
            //console.log(data[0], data[1])
            $("#"+data[1].prodId).css('background-image', 'url('+ data[1].colorUrl[data[0]]+')');

            var colorSizes = [];
            $.each(data[1].productsAll, function(ind, prod){
                if(prod.color == data[2]){
                    colorSizes.push(prod.size);
                }
            })
            var sizeId = data[1].prodId+'_size'
            // console.log(colorSizes.toString());
            $("#"+sizeId).text("Size : "+colorSizes.toString());

            if(data[1].price[data[0]] != undefined){
                $(".priceTag"+data[1].prodId).text(' '+data[1].price[data[0]]);
            }

        }

        self.showAllSizeFilter = function(){
            // console.log("showAllSizeFilter");
            vm.Product.sizeFlag(true);
            $("#showSizeTag").css('display', 'none');
            $("#hideSizeTag").css('display', 'inline')
        }
        self.showAllBrandFilter = function(){
            //console.log("showAllbrandFilter");
            vm.Product.brandFlag(true);
            $("#showBrandTag").css('display', 'none');
            $("#hideBrandTag").css('display', 'inline')
        }
        self.showAllColorFilter = function(){
            //console.log("showAllcolorFilter");
            vm.Product.colorFlag(true);
            $("#showColorTag").css('display', 'none')
            $("#hideColorTag").css('display', 'inline')
        }

        self.hideAllSizeFilter = function(){
            // console.log("hideAllSizeFilter")
            vm.Product.sizeFlag(false);
            $("#hideSizeTag").css('display', 'none')
            $("#showSizeTag").css('display', 'inline');
            
            
        }
        self.hideAllBrandFilter = function(){
            //console.log("hideAllBrandFilter")
            vm.Product.brandFlag(false);
            $("#showBrandTag").css('display', 'inline')
            $("#hideBrandTag").css('display', 'none')
        }
        self.hideAllColorFilter = function(){
            //console.log("hideAllColorFilter")
            vm.Product.colorFlag(false);
            $("#showColorTag").css('display', 'inline')
            $("#hideColorTag").css('display', 'none')
        }
        self.priceLowtoHigh = function(){
            $("#priceLtHSort").css('font-weight', 'bold');
            $("#priceHtLSort").css('font-weight', 'normal');
            $("#popSort").css('font-weight', 'normal');
            var priceLowtoHighArray = bundleArray;
            //console.log(bundleArray[0].productsAll[0].price)
            priceLowtoHighArray.sort((a,b) => (a.productsAll[0].price > b.productsAll[0].price) ? 1 : ((b.productsAll[0].price > a.productsAll[0].price) ? -1 : 0));
            vm.Product.jsonData(priceLowtoHighArray);
        }        
        self.priceHightoLow = function(){
            $("#priceHtLSort").css('font-weight', 'bold');
            $("#priceLtHSort").css('font-weight', 'normal');
            $("#popSort").css('font-weight', 'normal');
            //console.log("here");
            var priceHightoLowArray = bundleArray;
            //console.log(bundleArray[0].productsAll[0].price)
            priceHightoLowArray.sort((a,b) => (a.productsAll[0].price > b.productsAll[0].price) ? -1 : ((b.productsAll[0].price > a.productsAll[0].price) ? 1 : 0));
            vm.Product.jsonData(priceHightoLowArray);
        }
        self.ratingSort = function(){
            $("#popSort").css('font-weight', 'bold');
            $("#priceLtHSort").css('font-weight', 'normal');
            $("#priceHtLSort").css('font-weight', 'normal');
            var ratingSortArray = bundleArray;
            ratingSortArray.sort((a,b) => (a.rating > b.rating) ? -1 : ((b.rating > a.rating) ? 1 : 0));
            vm.Product.jsonData(ratingSortArray);
        }
        self.showFacetSection = function(){
            $(".bredScrum").css('display', 'none');
            $(".filterDiv").css('display', 'block');
        }
        self.showSortSection = function(){
            $(".filterDiv").css('display', 'none');
            // $(".bredScrum").css('display', 'block');
        }
        self.addToFavourite = function(abc){
            $("#heart"+abc).css('color', 'red');
        }

        self.removeSize = function(){
            self.selectedSize('');
        }
        
        self.applyFacets = ko.computed(function(){
            $("#noProcuctsfound").css('display', 'none')
            var tryArray = [];
            //console.log(self.selectedRating());
            //console.log(self.selectedMinPrice(), self.selectedMaxPrice(), self.selectedSize(), self.selectedBrand(), self.selectedColor(), self.selectedRating() )
            var minPrice = parseInt(self.selectedMinPrice());
            var maxPrice = parseInt(parseInt(self.selectedMaxPrice()) + parseInt(self.selectedMinPrice()));
            //console.log(minPrice , maxPrice);
            //console.log(bundleArray)
            
            var aftrpriceArray = [];
            var aftrSizeArray = [];
            var aftrBrandArray = [];
            var aftrColorArray = [];
            var aftrRatingArray = [];  

            if(maxPrice != 100){
                $.each(alljsondata, function(ind, elem){
                    if(minPrice < elem.price && elem.price < maxPrice){
                        aftrpriceArray.push(elem);
                    }
                });
            }else{
                aftrpriceArray = alljsondata;
            }
            //console.log('aftrPrice'+aftrpriceArray);

            if(self.selectedSize()){
                $.each(aftrpriceArray, function(ind, elem){
                     //console.log(self.selectedSize())
                     if(elem.size == self.selectedSize()){
                        aftrSizeArray.push(elem);
                    }
                    // for(p = 0; p < self.selectedSize().length; p++){
                        //console.log(self.selectedSize()[p]);
                        //if(elem.size == self.selectedSize()[p]){
                            //console.log(self.selectedMinPrice(), self.selectedMaxPrice(), self.selectedSize(), self.selectedBrand(), self.selectedColor(), self.selectedRating() )
                            //aftrSizeArray.push(elem);
                        //}
                    // }
                }); 
            }else{
                // console.log(alljsondata);
                aftrSizeArray = aftrpriceArray;
            }
            //console.log('AftrSiezArray : '+aftrSizeArray);  


            if(self.selectedBrand().length != 0){
                $.each(aftrSizeArray, function(ind , elem){
                    for(q = 0; q < self.selectedBrand().length; q++){
                        if(elem.brand == self.selectedBrand()[q]){
                            aftrBrandArray.push(elem);
                        }
                    }
                });
            }else{
                aftrBrandArray = aftrSizeArray;
            }             
            //console.log('aftrBrandArray'+aftrBrandArray);
        

            if(self.selectedColor().length != 0){
                $.each(aftrBrandArray, function(ind, elem){
                    for(q = 0; q < self.selectedColor().length; q++){
                        if(elem.color == self.selectedColor()[q]){
                            aftrColorArray.push(elem);
                        }
                    }
                });
            }else{
                aftrColorArray = aftrBrandArray;
            }
            //console.log(aftrColorArray)

            if(self.selectedRating()){
                $.each(aftrColorArray, function(ind, elem){
                    //console.log(parseFloat(elem.rating) , parseInt(self.selectedRating()))
                    if(parseFloat(elem.rating) > parseInt(self.selectedRating())){
                        aftrRatingArray.push(elem);
                    }
                });
            }else{
                aftrRatingArray = aftrColorArray;
            }
            //console.log(aftrRatingArray);

            $.each(bundleArray, function(ind, elem){
                $.each(aftrRatingArray, function(i, prod){
                    if(elem.prodId == prod.prodId){
                        tryArray.push(elem);
                        return false;
                    }
                })
            });
            //console.log(tryArray.length)
            if(tryArray.length == 0){
                $("#noProcuctsfound").css('display', 'block')
                $("#noProcuctsfound").html("<h1 style='padding : 25px;'>oops.....<br> No product Found !</h1>");
            }
                
            self.jsonData(tryArray);
            //console.log(tryArray)
        
        });     

    }

    // Objects of each ViewModel
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

    $(document).on('click', '.panel-heading', function(e){
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
