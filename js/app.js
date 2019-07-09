var filterDiv = function(){
    if($(window).width() < 900)
    {
        $("#fl").toggleClass('hidefilter showfilter');
        $("#sh").removeClass('showsortBy');
        $("#sh").addClass('hidesortBy');
    }
}

var sortDiv = function(){
        $("#sh").toggleClass('hidesortBy showsortBy');
        $("#fl").removeClass('showfilter');
        $("#fl").addClass('hidefilter');
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
            self.searchText =ko.observable();
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
// Sort By Asecnding and Desecnding                   
            self.SortByAsecnding = function(){
                $("#a1").css({"font-weight":"normal"});
                $("#a2").css({"font-weight":"bold"});
                $("#a3").css({"font-weight":"normal"});               
                self.productArray.sort((a,b)=>(a.sku[0].price <b.sku[0].price)?-1:((a.sku[0].price > b.sku[0].price)? 1 : 0));
            };

            self.SortByDesecnding = function(){
                $("#a1").css({"font-weight":"normal"});
                $("#a2").css({"font-weight":"normal"});
                $("#a3").css({"font-weight":"bold"});
                 self.productArray.sort((a,b)=>(a.sku[0].price >b.sku[0].price)?-1:((a.sku[0].price < b.sku[0].price)? 1 : 0));
            };

            self.SortByPopularity = function(){
                $("#a1").css({"font-weight":"bold"});
                $("#a2").css({"font-weight":"normal"});
                $("#a3").css({"font-weight":"normal"});
                self.productArray.sort((a,b)=>(a.sku[0].rating >b.sku[0].rating)?-1:((a.sku[0].rating < b.sku[0].rating)? 1 : 0));               
        
            };
        
// Apply Filters
            self.applyFilter = function(filterArray){
                var clonedArr = $.extend(true, [], self.allProduct());
                console.log('cloned arr',clonedArr);
                var temp=[]; 
                console.log(filterArray);       
             filterArray.map(function(a,b){console.log(a,b)});

                for (var fascet in filterArray){
                    for(var SelectedValue of filterArray[fascet]){
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
                    self.selectSize('');
                    self.selectColor('');
                    self.selectBrand('');
                    self.selectedRating('');
              
                }
            };

            self.fascetsComputed = ko.computed(function() {
                console.log(self.selectSize(),self.selectBrand(),self.selectColor(),self.selectedRating());
                if(self.selectSize().length > 1) { 
                    self.selectSize().shift(); 
                } 
                if(self.selectedRating().length > 1) { 
                    self.selectedRating().shift(); 
                }
                    var filterArray =[];
                    if (self.selectSize().length != 0){
                        filterArray["size"]=self.selectSize() ;
                    }
                    if (self.selectBrand().length != 0){
                        filterArray["brand"]=self.selectBrand();
                    }
                    if (self.selectColor().length != 0){
                        filterArray["color"]=self.selectColor();
                    }
                     if (self.selectedRating().length != 0){
                        filterArray["rating"]=self.selectedRating();
                    }
                    if (!jQuery.isEmptyObject(filterArray)){
                        self.applyFilter(filterArray);
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
                    var dataArray = [];
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

                        result.items.map(function(ob){ 
                            if(pr = dataArray.find(p => p.prodId == ob.prodId)){
                                pr.sku.push(ob);
                                if($.inArray(ob.color, pr.color) === -1){
                                    pr.color.push(ob.color);
                                }
                                if($.inArray(ob.size, pr.size) === -1){
                                    pr.size.push(ob.size);
                                }
                                if($.inArray(ob.brand, pr.brand) === -1){
                                    pr.brand.push(ob.brand);
                                }
                                if($.inArray(ob.rating, pr.rating) === -1){
                                    pr.rating.push(ob.rating);
                                }
                            }
                            else{
                                var skuArr = [];
                                var colorTempArr = [];
                                var sizeTempArr = [];
                                var brandTempArr = [];
                                var ratingTempArr =[];
                                skuArr.push(ob);
                                dataArray.push({'prodId':ob.prodId , 'sku':skuArr,'color':colorTempArr,'size': sizeTempArr, 'brand': brandTempArr, 'rating':ratingTempArr});

                            } 

                            if($.inArray(ob.brand, allbr) === -1) 
                                allbr.push(ob.brand);

                            if($.inArray(ob.size, allsz) === -1) 
                                allsz.push(ob.size);

                            if($.inArray(ob.color, allcl) === -1) 
                                allcl.push(ob.color);
                         }); 

                            vm.Products.allProduct(dataArray);
                            vm.Products.productArray(dataArray); 
                            vm.Products.SortByPopularity();                         
                            vm.Products.allSize(allsz);
                            vm.Products.allBrand(allbr);
                            vm.Products.allColor(allcl);  
                            
                        },

                        error(err){
                        console.log("error",err);
                        }
                    }); 
                    
                    $(".header").css("display","block");
                    vm.Main.chosenPageId(this.params.page);     
                    vm.Main.template("productListingPage")
                    vm.Page.name("productListingPage");
                    
                });
            }).run('#Home');
        ko.applyBindings(vm);
    });

})(jQuery);
