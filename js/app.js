var filterDiv = function(){
  
    if($(window).width() < 900)
    {
        $(".hideMobilefilter").css({"display":"block"});
        $(".hideMobilesortBy").css({"display":"none"});
    }
}

var sortDiv = function(){
        $(".hideMobilefilter").css({"display":"none"});
        $(".hideMobilesortBy").css({"display":"block"});
}
;(function($){
    $(document).on('click', '.panel-heading.clickable', function(e){ 
        var $this = $(this); 
        if(!$this.hasClass('panel-collapsed')) { 
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
    
    
    $(document).ready(function(){
       

        function viewModel() {
            var self = this;
            self.chosenPageId = ko.observable();
            self.pages = ko.observableArray(["Home", "About", "Product"]);
            self.template = ko.observable();
            self.plp = "productListingPage";
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

        function productsViewModel() {
            var self = this;            
            self.productArray = ko.observableArray();
            self.allProduct = ko.observableArray();
            self.allSize = ko.observableArray();
            self.minPrice = ko.observable(100);
            self.maxPrice = ko.observable(200);
            self.selectedMinPrice = ko.observable(100);
            self.selectedMaxPrice = ko.observable(200); 
            self.allColor = ko.observableArray();
            self.allBrand = ko.observableArray();
            self.selectSize = ko.observableArray();
            self.selectColor = ko.observableArray();
            self.selectBrand = ko.observableArray();
            self.filterArray = ko.observableArray();
            self.selectedRating = ko.observableArray();
            
            self.pricefilter =ko.computed(function(){ 
                if(self.selectSize().length != 0 || self.selectBrand().length != 0 || self.selectColor().length != 0 || self.selectedRating().length != 0 ) 
                    var tempArr = $.extend(true, [], self.productArray());
                else 
                var tempArr = $.extend(true, [], self.allProduct()); 
                var temp =[]; 
                for(var y in  tempArr) { 
                    if(tempArr[y].sku[0].price >= self.selectedMinPrice() && tempArr[y].sku[0].price <= self.selectedMaxPrice())
                     temp.push(tempArr[y]); 
                }
                if(temp.length!=0){
                    self.productArray(temp); 
                } 
                else { 
                    self.productArray(self.allProduct()); 
                } 
            });
           
            self.SortByAsecnding = function(){
                $("#a1").css({"font-weight":"normal"});
                $("#a2").css({"font-weight":"bold"});
                $("#a3").css({"font-weight":"normal"});
                var clonedArr = $.extend(true, [], self.productArray());
                clonedArr.sort((a,b)=>(a.sku[0].price <b.sku[0].price)?-1:((a.sku[0].price > b.sku[0].price)? 1 : 0));
                self.productArray(clonedArr);
            };

            self.SortByDesecnding = function(){
                $("#a1").css({"font-weight":"normal"});
                $("#a2").css({"font-weight":"normal"});
                $("#a3").css({"font-weight":"bold"});
                var clonedArr = $.extend(true, [], self.productArray());
                clonedArr.sort((a,b)=>(a.sku[0].price >b.sku[0].price)?-1:((a.sku[0].price < b.sku[0].price)? 1 : 0));
                self.productArray(clonedArr);
            };

            self.SortByPopularity = function(){
                $("#a1").css({"font-weight":"bold"});$("#a2").css({"font-weight":"normal"});$("#a3").css({"font-weight":"normal"});
                var clonedArr = $.extend(true, [], self.productArray());
                clonedArr.sort((a,b)=>(a.sku[0].rating >b.sku[0].rating)?-1:((a.sku[0].rating < b.sku[0].rating)? 1 : 0));
                self.productArray(clonedArr);
        
            };
        

            self.applyFilter = function(fascetsArray){
                var clonedArr = $.extend(true, [], self.allProduct());
                var temp=[];
                for (var fascet in fascetsArray){
                    for(var SelectedValue of fascetsArray[fascet]){
                        for (var CurrentIndex in clonedArr){
                            if(fascet=="size"){
                                if ($.inArray(SelectedValue,clonedArr[CurrentIndex].size) != -1){
                                    temp.push(clonedArr[CurrentIndex]);
                                }
                            }
                            if(fascet=="color"){
                                if ($.inArray(SelectedValue,clonedArr[CurrentIndex].color) != -1){
                                    temp.push(clonedArr[CurrentIndex]);
                                }
                            }
                            if(fascet=="brand"){
                                if ($.inArray(SelectedValue,clonedArr[CurrentIndex].brand) != -1){
                                    temp.push(clonedArr[CurrentIndex]);
                                }
                            }
                            if(fascet=="rating"){
                                if (SelectedValue <= clonedArr[CurrentIndex].rating[0]){
                                    temp.push(clonedArr[CurrentIndex]);
                                }
                            }
                        }
                    }
                    clonedArr=temp;
                    temp=[];
                }
                var another_ar =[];
                $.each(clonedArr, function(i, el) { 
                    if($.inArray(el, another_ar) === -1) 
                    another_ar.push(el); 
                }); 
                if(another_ar.length!=0){ 
                    self.productArray(another_ar); 
                }
                else
                {
                    $('input:checkbox').prop('checked', false);
                    alert("Serched item Not found");
                    self.productArray(self.allProduct());
                    self.selectSize().length=0;
                    self.selectColor().length=0;
                    self.selectBrand().length=0;
                    self.selectedRating().length=0;
              
                }
            };

            self.fascetsComputed = ko.computed(function() {
               
                console.log(self.selectSize(),self.selectBrand(),self.selectColor(),self.selectedRating());
                    var fascetsArray =[];
                    if (self.selectSize().length != 0){
                        fascetsArray["size"]=self.selectSize() ;
                    }
                    if (self.selectBrand().length != 0){
                        fascetsArray["brand"]=self.selectBrand();
                    }
                    if (self.selectColor().length != 0){
                        fascetsArray["color"]=self.selectColor();
                    }
                     if (self.selectedRating().length != 0){
                        fascetsArray["rating"]=self.selectedRating();
                    }
                    if (!jQuery.isEmptyObject(fascetsArray)){
                        self.applyFilter(fascetsArray);
                    }   
                    else{
                        self.productArray(self.allProduct());
                    }

               
           });


        //color select 
            self.colorSelect = function(product,color){
                console.log(product,color);
                var size = [];
                var img;
                var price;
                for(var sku in product.sku){
                    if(color == product.sku[sku].color){
                        size.push(product.sku[sku].size);
                        img = product.sku[sku].imageurl;
                        price =product.sku[sku].price;
                    }
                }
                console.log(product.prodId, img,size, price);
                $("#"+product.prodId).css('background-image', 'url('+ img+')');
                $("#"+product.prodId+"size").text('size :'+size);
                $("#"+product.prodId+"price").text(' '+price);
            }

        // Add Product to wishlist 
            self.addToWishList = function(product){
                $("#"+product.prodId+"heart").toggleClass('far fa-heart heart fas fa-heart redHeart');
            }        
        }
        

        var vm = {
            Main: new viewModel(),
            Page: new pageViewModel(),
            Products: new productsViewModel()
        };

        Sammy(function () {
                this.get('#Home', function () {
                    $(".header").css("display","none");
                    console.log("HOMEPAGE",this.params.page);
                    vm.Main.chosenPageId(this.params.page);     
                    vm.Main.template("landing-page");
                    vm.Page.name("Home");
                });

                this.get('#productListingPage', function () {
                    console.log("plp page");

                    var dataArray = [];
                    var newDataArray = [];
                    var allsz = [];
                    var allcl = [];
                    var allbr = [];

                    $.ajax({url: "http://demo2828034.mockable.io/search/shirts", success: function(result){
                        var clonedArr = result["items"];
                        clonedArr.sort((a,b)=>(a.price <b.price)?-1:((a.price > b.price)? 1 : 0));
                         vm.Products.minPrice(clonedArr[0].price);
                         vm.Products.maxPrice(clonedArr[clonedArr.length-1].price);
                         vm.Products.selectedMinPrice(vm.Products.minPrice());
                         vm.Products.selectedMaxPrice(vm.Products.maxPrice());
         
                        for (var ob in result.items){
                            $.each(result.items, function(i, el) {
                                if($.inArray(el.brand, allbr) === -1) 
                                allbr.push(el.brand);
                                });
                            $.each(result.items, function(i, el) {
                                if($.inArray(el.size, allsz) === -1) 
                                    allsz.push(el.size);
                                });
                            $.each(result.items, function(i, el) {
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
                                     if($.inArray(el, newColorArr) === -1) newColorArr.push(el);
                                });

                                $.each(brandArr, function(i, el) {
                                    if($.inArray(el, newBrandArr) === -1) newBrandArr.push(el);
                                }); 

                                $.each(sizeArr, function(i, el) {
                                    if($.inArray(el, newSizeArr) === -1) newSizeArr.push(el);
                                });

                                //console.log(newColorArr,newSizeArr);
                                newDataArray.push({'prodId':productArrId, 'sku':dataArray[productArrId], 'color':newColorArr, 'size':newSizeArr, 'brand':newBrandArr, 'rating':newRatingArr});
                            }
                            console.log(newDataArray ,vm.Products.minPrice(),vm.Products.maxPrice(),vm.Products.selectedMinPrice(),vm.Products.selectedMaxPrice()); 

                            vm.Products.allProduct(newDataArray);
                            vm.Products.productArray(newDataArray); 
                            vm.Products.SortByPopularity(); 
                                                    
                            vm.Products.allSize(allsz);
                            vm.Products.allBrand(allbr);
                            vm.Products.allColor(allcl);     
                        },

                        error(err){
                        console.log("error",err);
                        }
                    }); 
                    

                    console.log('allsize',vm.Products.allSize(),vm.Products.allColor(),vm.Products.allBrand());
                    $(".header").css("display","block");
                    vm.Main.chosenPageId(this.params.page);     
                    vm.Main.template("productListingPage")
                    vm.Page.name("productListingPage");
                    
                });
            }).run('#Home');
        ko.applyBindings(vm);
    });

})(jQuery);
