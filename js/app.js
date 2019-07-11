;(function($){
    $(document).ready(function(){
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
        function viewModel() {
            var self = this;
            self.chosenPageId = ko.observable();
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
            self.minPrice = ko.observable();
            self.maxPrice = ko.observable();
            self.selectedMinPrice = ko.observable();
            self.selectedMaxPrice = ko.observable(); 
            self.allColor = ko.observableArray();
            self.allBrand = ko.observableArray();
            self.allCategory = ko.observableArray();
            self.allRating = ko.observableArray();
            self.selectSize = ko.observableArray();
            self.selectColor = ko.observableArray();
            self.selectBrand = ko.observableArray();
            self.selectedRating = ko.observableArray();
            self.currentSelctedSortBy = ko.observable('popularity');
            
            self.pricefilter =ko.computed(function(){ 
                if(self.selectSize().length != 0 || self.selectBrand().length != 0 || self.selectColor().length != 0 || self.selectedRating().length != 0 ) 
                    var tempArr = $.extend(true, [], self.productArray());
                else 
                var tempArr = $.extend(true, [], self.allProduct());

                var temp =[];
                tempArr.map(function(ob){
                    if(ob.sku[0].price >= self.selectedMinPrice() && ob.sku[0].price <= self.selectedMaxPrice())
                     temp.push(ob); 
                }); 

                if(temp.length!=0){
                    self.productArray(temp); 
                } 
                else { 
                    self.productArray(self.allProduct()); 
                } 
            });

            self.sortDiv = function(){
                $("#sh").toggleClass('hideDiv showDiv');
                $("#fl").removeClass('showDiv');
                $("#fl").addClass('hideDiv');
            }

            self.filterDiv = function(){
                if($(window).width() < 900)
                {
                    $("#fl").toggleClass('hideDiv showDiv');
                    $("#sh").removeClass('showDiv');
                    $("#sh").addClass('hideDiv');
                }
            }
            
// Sort By Asecnding and Desecnding 
            self.sortBy = function(value){
                $("#a1").css({"font-weight":"normal"});
                $("#a2").css({"font-weight":"normal"});
                $("#a3").css({"font-weight":"normal"});
                if(value === "asecnding"){
                    $("#a2").css({"font-weight":"bold"});
                    self.currentSelctedSortBy('asecnding');              
                    self.productArray.sort((a,b)=>(a.sku[0].price <b.sku[0].price)?-1:((a.sku[0].price > b.sku[0].price)? 1 : 0));
                }
                if(value === "desecnding"){
                    self.currentSelctedSortBy('desecnding');
                    $("#a3").css({"font-weight":"bold"});
                     self.productArray.sort((a,b)=>(a.sku[0].price >b.sku[0].price)?-1:((a.sku[0].price < b.sku[0].price)? 1 : 0));
                }
                if(value === "popularity"){
                    self.currentSelctedSortBy('popularity');
                    $("#a1").css({"font-weight":"bold"});
                    self.productArray.sort((a,b)=>(a.sku[0].rating >b.sku[0].rating)?-1:((a.sku[0].rating < b.sku[0].rating)? 1 : 0));
                }
            }

// Apply Filters
            self.applyFilter = function(filterArray){
                var clonedArr = $.extend(true, [], self.allProduct());
                var temp=[]; 
                
                for (var filter in filterArray){
                    filterArray[filter].map(function(SelectedValue){
                        clonedArr.map(function(product){
                            if(filter=="size"){
                                if ($.inArray(SelectedValue,product.size) != -1){
                                    if(!temp.find(p => p.prodId == product.prodId))
                                    temp.push(product);
                                }
                            }
                            if(filter=="color"){
                                if ($.inArray(SelectedValue,product.color) != -1){
                                    if(!temp.find(p => p.prodId == product.prodId))
                                    temp.push(product);
                                }
                            }
                            if(filter=="brand"){
                                if ($.inArray(SelectedValue,product.brand) != -1){
                                    if(!temp.find(p => p.prodId == product.prodId))
                                    temp.push(product);
                                }
                            }
                            if(filter=="rating"){
                                if (SelectedValue <= product.rating[0]){
                                    if(!temp.find(p => p.prodId == product.prodId))
                                    temp.push(product);
                                }
                            }
                        });
                    });                    
                    clonedArr=temp;
                    temp=[];
                } 
                if(clonedArr.length!=0){ 
                    self.productArray(clonedArr); 
                }
                else{
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
                    self.sortBy(self.currentSelctedSortBy());              
           });

        //color select 
            self.skuSelect = function(product,color){
                console.log(product,color);
                var size = [];
                var img;
                var price;
                product.sku.map(function(ob){
                    if (color === ob.color){
                        size.push(ob.size);
                        img = ob.imageurl;
                        price =ob.price;
                    }
                });
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
        var setAllProducts = function(items){
            var dataArray = [];
            vm.Products.minPrice(items[0].price);
            vm.Products.maxPrice(items[0].price);
            items.map(function(ob){ 
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
                    dataArray.push({'prodId':ob.prodId, 
                                    'sku':[ob],
                                    'color':[ob.color],
                                    'size': [ob.size], 
                                    'brand': [ob.brand], 
                                    'rating':[ob.rating]
                                });
                } 
                if($.inArray(ob.brand, vm.Products.allBrand()) === -1) 
                    vm.Products.allBrand.push(ob.brand); //find all unique Brands

                if($.inArray(ob.size, vm.Products.allSize()) === -1) 
                    vm.Products.allSize.push(ob.size); //find all unique Size

                if($.inArray(ob.color, vm.Products.allColor()) === -1) 
                    vm.Products.allColor.push(ob.color); //find all unique color
                    
                if($.inArray(ob.category, vm.Products.allCategory()) === -1) 
                    vm.Products.allCategory.push(ob.category); //find all unique category
                    
                if($.inArray(parseInt(ob.rating),vm.Products.allRating()) === -1)
                    vm.Products.allRating.push(parseInt(ob.rating)); //find rating
                    
                if(ob.price < vm.Products.minPrice())
                    vm.Products.minPrice(ob.price); //find minimum price 
                    
                if(ob.price > vm.Products.maxPrice())
                    vm.Products.maxPrice(ob.price); //find maximum price        
             }); 
             console.log(dataArray);                                            
                vm.Products.selectedMinPrice(vm.Products.minPrice());
                vm.Products.selectedMaxPrice(vm.Products.maxPrice());
                return dataArray;
        }

        Sammy(function () {
                this.get('#Home', function () {
                    vm.Main.chosenPageId(this.params.page);     
                    vm.Main.template("landing-page");
                    vm.Page.name("Home");
                });
                this.get('#productListingPage', function () {
                    $.ajax({url: "http://demo2828034.mockable.io/search/shirts", success: function(result){
                        var dataArray = setAllProducts(result.items);
                            vm.Products.allProduct(dataArray);
                            vm.Products.productArray(dataArray); 
                            vm.Products.sortBy('popularity');    
                        },
                        error(err){
                        console.log("error",err);
                        }
                    });                    
                    vm.Main.chosenPageId(this.params.page);     
                    vm.Main.template("productListingPage")
                    vm.Page.name("productListingPage");                    
                });
            }).run('#Home');
        ko.applyBindings(vm);
    });
})(jQuery);
