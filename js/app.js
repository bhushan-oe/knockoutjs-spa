;(function($) {       
  
    $(function() {   // document.ready        
       
        function viewModel()
        {           
            this.template = ko.observable();
            this.goToProductList = function (page){                
                location.hash = "#/"+page;
            }       
        }

        function homeViewModel(){
            this.searchName = ko.observable();
        }
        
        function getUniqueRecords(arr){
            return ko.utils.arrayGetDistinctValues(arr);
        }

        var sortMethod = "popularity";

        function brandSort(brandA, brandB){
            var val = 0;
            var sortedBrandA = brandA.selectedProductList().sort(productSort);
            var sortedBrandB = brandB.selectedProductList().sort(productSort);
            var brandAVal = sortedBrandA[0];
            var brandBVal = sortedBrandB[0];

            brandA.selectedProductList(sortedBrandA);
            brandA.setDefaultProductList();
            brandB.selectedProductList(sortedBrandB);
            brandB.setDefaultProductList();
            console.log("*************** sorting method *********** "+sortMethod);
            switch(sortMethod) {
                case "HighToLow":  
                    val =  HighToLowSort(brandAVal.price(), brandBVal.price());              
                  break;
                case "LowToHigh":
                    val =  LowToHighSort(brandAVal.price(), brandBVal.price());
                  break;
                default:
                 val = HighToLowSort(brandAVal.rating(), brandBVal.rating());
              }
              return val;
        }

        function productSort(productA, productB){
            var val = 0;
            switch(sortMethod) {
                case "HighToLow":  
                    val =  HighToLowSort(productA.price(), productB.price());              
                  break;
                case "LowToHigh":
                    val =  LowToHighSort(productA.price(), productB.price());
                  break;
                default:
                 val = HighToLowSort(productA.rating(), productB.rating());
              }
          return val;
        }

        function LowToHighSort(valA, valB){
            return valA < valB ? -1: valA > valB ? 1 : 0;
        }
        function HighToLowSort(valA, valB)
        {
            return valA > valB ? -1: valA < valB ? 1 : 0;
        }

        function productListViewModel() {
            var self = this;    
            
            self.golbalBrandList = ko.observableArray([]);

            self.productBrandList = ko.observableArray();             
            
            /*self.totalProducts = ko.computed(function(){
                var totalProducts = 0;
                ko.utils.arrayForEach(self.productBrandList(), function(productBrand){ 
                    totalProducts += productBrand.selectedProductList().length;
                }); 
                return totalProducts;
            });*/

            self.brandList = ko.computed(function(){
                var productBrandNames = ko.utils.arrayMap(self.golbalBrandList(), function(productBrand){
                    return productBrand.brand();
                });               
                return getUniqueRecords(productBrandNames);
            });

            self.categoryList = ko.computed(function(){
                var categoryNames = ko.utils.arrayMap(self.golbalBrandList(), function(productBrand){
                    return productBrand.category();
                });
               
                return getUniqueRecords(categoryNames);
            });

            self.colorList = ko.computed(function(){
                var colorNames = [];
                ko.utils.arrayForEach(self.golbalBrandList(), function(productBrand){                    
                    ko.utils.arrayForEach(productBrand.brandProductList(), function(currentProduct){                       
                        colorNames.push(currentProduct.color());
                    });                    
                });   
                  
               return getUniqueRecords(colorNames);              
            });

            self.sizeList =ko.computed(function(){
                var sizes = [];
                ko.utils.arrayForEach(self.golbalBrandList(), function(productBrand){                    
                    ko.utils.arrayForEach(productBrand.brandProductList(), function(currentProduct){                                          
                        sizes.push(currentProduct.size());
                    });                    
                });            
                return getUniqueRecords(sizes);
            });
            
            self.sortingMethod = ko.observable("popularity");

            self.sortBy = function(method){ 
                if(sortMethod == method){
                    return;
                }                             
                sortMethod = method;
                self.sortingMethod(method);
                console.log("in function call");
                self.productBrandList(self.productBrandList().sort(brandSort));
                //self.productBrandList(brandSort);              
            };

            self.selectedBrandList = ko.observableArray([]);
            self.selectedCategory = ko.observable();
            self.minPrice = ko.observable();
            self.maxPrice = ko.observable();
            self.selectedColor = ko.observable();
            self.selectedSizeList = ko.observableArray([]);

            self.filterdCategory = function(category){               
                self.selectedCategory(category);
                self.filterdAction();
            }

            self.filterdAction = function(){
                console.log("sizelist: "+self.selectedSizeList().length);
                console.log("sizelist: "+self.selectedSizeList());
                console.log("selectedCategory: "+self.selectedCategory());  
                console.log("selectedColor: "+self.selectedColor());              

               // console.log("list: "+self.selectedBrandList().length);
                if(self.selectedBrandList().length == 0 && self.selectedCategory() == undefined && self.selectedColor() == undefined && self.selectedSizeList().length == 0)
                {          
                    ko.utils.arrayForEach(self.golbalBrandList(), function(productBrand) {
                        productBrand.setDefaultSelectedProductList();
                    });
                    self.productBrandList(self.golbalBrandList().sort(brandSort));
                  //  self.productBrandList(self.golbalBrandList());    
                }
                else{                    
                   console.log("brand list: "+self.selectedBrandList());
                   console.log("selected Brand length: "+self.selectedBrandList().length);
                   var filteredProductbrandList = [];
                    if(!(self.selectedBrandList().length == 0 && self.selectedCategory() == undefined))
                    {
                        filteredProductbrandList =  ko.utils.arrayFilter(self.golbalBrandList(), function(productBrand) {
                          //  console.log("brand: "+productBrand.brand());
                            //console.log("test: "+(self.selectedBrandList().length == 0 ? true : self.selectedBrandList.indexOf(productBrand.brand()) != -1) && (self.selectedCategory() == undefined ? true : self.selectedCategory() == productBrand.category())); 
                           // console.log("test1: "+(self.selectedBrandList().length == 0 ? true : self.selectedBrandList.indexOf(productBrand.brand()) != -1));
                           // console.log("test2: "+(self.selectedCategory() == undefined ? true : self.selectedCategory() == productBrand.category()));                
                                 return (self.selectedBrandList().length == 0 ? true : self.selectedBrandList.indexOf(productBrand.brand()) != -1) && (self.selectedCategory() == undefined ? true : self.selectedCategory() == productBrand.category());                           
                             }); // check for empty filteredProductbrandList not necessory
                           //  self.productBrandList(filteredProductbrandList);
                    }
                    else{
                        ko.utils.arrayForEach(self.golbalBrandList(), function(globalBrand) {
                            filteredProductbrandList.push(globalBrand);
                        });
                       // filteredProductbrandList = self.golbalBrandList();

                        //self.productBrandList(self.golbalBrandList());
                    }  
                    
                    console.log("filteredProductbrandList: "+filteredProductbrandList.length);
                    
                   if(!(self.selectedSizeList().length == 0 && self.selectedColor() == undefined))
                    {
                       for(var i= 0; i < filteredProductbrandList.length; ++i)
                        {
                            var productBrand = filteredProductbrandList[i];
                            var filteredProducts = self.filteredProduct(productBrand.brandProductList());                          
                            if(filteredProducts == undefined || filteredProducts.length == 0)
                            {
                                productBrand.selectedProductList([]); // eed to comment out these 2 lines
                                productBrand.setDefaultProductList();
                                filteredProductbrandList.splice(i, 1);
                                --i;
                            }
                            else{
                                productBrand.selectedProductList(filteredProducts);
                                productBrand.setDefaultProductList();
                            }

                        }
                       /* ko.utils.arrayForEach(filteredProductbrandList, function(productBrand) {
                            var filteredProducts = self.filteredProduct(productBrand.brandProductList());
                            if(filteredProducts == undefined)
                            {
                                productBrand.selectedProductList([]);
                                productBrand.setDefaultProductList();
                            }
                            else{
                                productBrand.selectedProductList(filteredProducts);
                                productBrand.setDefaultProductList();
                            }                            
                        });*/
                    }
                   else{
                        ko.utils.arrayForEach(filteredProductbrandList, function(productBrand) {
                            productBrand.setDefaultSelectedProductList(); // it will set seletced as well as default product list also
                        });
                    }

                    //self.productBrandList(filteredProductbrandList.sort(brandSort));
                    self.productBrandList(filteredProductbrandList.sort(brandSort));
                  //  self.productBrandList(filteredProductbrandList);
                }
                return true;
            }

            self.filteredProduct = function productFilter(products)
            {             
                var filteredProducts = ko.utils.arrayFilter(products, function(product) {                   
                    //return (self.selectedSizeList().length == 0 ? true: self.selectedSizeList().indexOf(product.size()) != -1) && (self.selectedColor() == undefined ? true : self.selectedColor() == product.color());
                    return (self.selectedSizeList().length == 0 ? true: self.selectedSizeList().indexOf(product.size()) != -1) 
                            && (self.selectedColor() == undefined ? true : self.selectedColor() == product.color());
                           // && (self.minPrice()  == undefined || self.maxPrice() == undefined) ? true : (product.price() >= parseInt(self.minPrice()) && product.price() <= parseInt(self.maxPrice()));
                });
                console.log("filteredProducts length: "+filteredProducts.length);
                //var sortingMethod = ratingSort;
               // filteredProducts.sort(sortingMethod);
                return filteredProducts;        
               /* return filteredProducts.sorted(function (left, right) {
                    console.log("in sorting");
                    var leftRating = parseInt(left.rating());
                    var rigthRating = parseInt(right.rating());
                    return leftRating == rigthRating ? 0 : leftRating > rigthRating ? -1 : 1;
                });*/
            }          

            self.setDefaultBrandList = function(){
                console.log("************** in brand sort ***************");
                self.productBrandList(self.golbalBrandList().sort(brandSort));
               // self.productBrandList(self.golbalBrandList());
            }
            //self.template = ko.observable('productListPage-template');
            self.addProductBrand = function(productBrand){
                self.golbalBrandList.push(productBrand);
            };
        }

        function productBrand()
        {
            var self = this;
            self.prodId = ko.observable();
            self.brand = ko.observable();
            self.name = ko.observable();
            self.category = ko.observable();

            self.brandProductList = ko.observableArray([]);  
            self.selectedProductList = ko.observableArray([]);
            self.productList = ko.observableArray([]); 
            
           /* self.sortedSelectedProductList = ko.computed(function(){
                return  self.selectedProductList().sort(productSort);
            });*/

            self.addProduct = function(product){                
                self.brandProductList.push(product);
               // self.productList.push(product); // need to  ..change productList should be set to computed
            }; 

            /*self.productList = ko.observableArray([]);
            self.addProduct = function(product){                
                self.productList.push(product);
            };*/   

            self.setDefaultSelectedProductList = function(){
                self.selectedProductList(self.brandProductList());
                self.setDefaultProductList();
            };

            self.colorList = ko.computed(function(){
                 console.log("colorList: "+ self.selectedProductList().length);
                  var colors = ko.utils.arrayMap(self.selectedProductList(), function(product){
                      return product.color();
                  });
                  
                  var distinctColors = ko.utils.arrayGetDistinctValues(colors);
                  return distinctColors;
              });

            self.setDefaultProductList = function(){   
                console.log("in setDefaultProductList: ");             
                var defaultProductList = ko.utils.arrayFilter(self.selectedProductList(), function(product) {              
                    return product.color() == self.colorList()[0];
                });
                self.productList(defaultProductList);
            };

           
            self.selectedColor = ko.observable(); // need to be checked

            self.sizeList = ko.computed(function() {         
                
                var sizes = ko.utils.arrayMap(self.productList(), function(product){
                    return product.size();
                });              
               // console.log("sizes: "+sizes.length);   
                return sizes;
            }); 

            self.selectedProduct = ko.computed(function(){
                console.log("in selectedProduct: "+self.productList()[0]);
                return self.productList()[0];
            });
            
            self.setProduct = function(color){
              //  console.log("color: "+color);
                var filteredProductList = ko.utils.arrayFilter(self.selectedProductList(), function(product) {
                    return color == product.color();
                });
                self.productList(filteredProductList);
            };
        }

        function Product(){
            var self = this;           
            self.skuId = ko.observable();
            self.color = ko.observable();
            self.imageurl = ko.observable();
            self.size = ko.observable();
            self.rating = ko.observable();
            self.price = ko.observable();
            self.liked = ko.observable(false);
            self.addFavourite = function(){
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

      /*  ko.bindingHandlers.RangeSlider = {
            init: function(element, valueAccessor, allBindingsAccessor)
            {
                var options = valueAccessor() || {};
                var others =  allBindingsAccessor() || {};
                options.change = function(e, ui)
                {
                   // others.MinDate(ui.values[0]);
                   // others.MaxDate(ui.values[1]);
                }
                
                $(element).slider(options);
            }
        };    */

        var app = $.sammy('#main', function() {
  
            this.get('#/', function(context) {             
              vm.Home.searchName("serachProduct");
              vm.Main.template("landingPage-template");
            });
            var brandObj = {};       
            var productBrandList = {};
            function BrandObject(prodId, brand, name, category )
            {
                this.prodId = prodId;
                this.brand = brand;
                this.name = name;
                this.category = category;
            } 
            function productObject(skuId, color, imageurl, size, rating, price){
                this.skuId = skuId;
                this.color = color;
                this.imageurl = imageurl;
                this.size = size;
                this.rating = rating;
                this.price = price;
            }
            this.get('#/serachProduct', function(context) {
                this.load('http://demo2828034.mockable.io/search/shirts')
                    .then(function(data) {     
                              
                     $.each(data["items"], function(index, product){
                            context.log("Product Desc --> "+product.prodId + " : "+product.skuId+" brand: "+product.brand, " color: "+product.color);                           
                            var productObj = new productObject(product.skuId, product.color.trim(), product.imageurl, product.size, product.rating, product.price);                           
                            if(productBrandList[product.brand] == undefined)
                            {                               
                                productBrandList[product.brand] = [];
                            }
                            if(brandObj[product.brand] == undefined)
                            {
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
                            ko.utils.arrayForEach(productBrandList[key], function(brandProduct) {
                                var productObj = new Product();
                                productObj.skuId(brandProduct.skuId);
                                productObj.color(brandProduct.color);
                                productObj.size(brandProduct.size);
                                productObj.rating(brandProduct.rating);
                                productObj.price(brandProduct.price);
                                productObj.imageurl(brandProduct.imageurl);
                               // console.log("image: "+brandProduct.imageurl);
                                productBrandObj.addProduct(productObj);
                            });
                            productBrandObj.setDefaultSelectedProductList();
                            vm.ProductList.addProductBrand(productBrandObj);
                        }
                        vm.ProductList.setDefaultBrandList();
                        vm.Main.template("productListPage-template");                       
                       
                       //$( "#slider-range" ).slider();
                        //vm.ProductList.addProduct(productObj);
                     
                       /* var productBrandObj = new productBrand();
                        productBrandObj.prodId("1111");
                        productBrandObj.category("mens clothing");
                        productBrandObj.name("Men's Checkered Casual Spread Shirt");
                        productBrandObj.brand("Rope");

                        var productObj = new Product();
                        productObj.skuId("1111_Blue_L");
                        productObj.color("Blue");
                        productObj.size("L");
                        productObj.rating("3.5");
                        productObj.price("498");
                        productObj.imageurl("http://monitoring-1878379754.us-west-2.elb.amazonaws.com/Photos/rope_bluejpeg.jpeg");

                        var productObj2 = new Product();
                        productObj2.skuId("1111_Blue_M");
                        productObj2.color("Blue");
                        productObj2.size("M");
                        productObj2.rating("3.5");
                        productObj2.price("498");
                        productObj2.imageurl("http://monitoring-1878379754.us-west-2.elb.amazonaws.com/Photos/rope_bluejpeg.jpeg");

                        var productObj3= new Product();
                        productObj3.skuId("1111_Red_XL");
                        productObj3.color("Red");
                        productObj3.size("XL");
                        productObj3.rating("3.5");
                        productObj3.price("408");
                        productObj3.imageurl("http://monitoring-1878379754.us-west-2.elb.amazonaws.com/Photos/rope_red.jpeg");

                        productBrandObj.addProduct(productObj);
                        productBrandObj.addProduct(productObj2);
                        productBrandObj.addProduct(productObj3);                      

                        // start 2nd product brand

                        var productBrandObj2 = new productBrand();

                        productBrandObj2.prodId("1113");
                        productBrandObj2.category("mens clothing");
                        productBrandObj2.name("Men's Checkered Casual Spread Shirt");
                        productBrandObj2.brand("Zombom");

                        var productObj3 = new Product();
                        productObj3.skuId("1113_Black_40");
                        productObj3.color("Black");
                        productObj3.size("40");
                        productObj3.rating("3.7");
                        productObj3.price("696");
                        productObj3.imageurl("http://monitoring-1878379754.us-west-2.elb.amazonaws.com/Photos/zombom_black.jpeg");

                        var productObj4 = new Product();
                        productObj4.skuId("1113_Red_38");
                        productObj4.color("Red");
                        productObj4.size("38");
                        productObj4.rating("3.7");
                        productObj4.price("676");
                        productObj4.imageurl("http://monitoring-1878379754.us-west-2.elb.amazonaws.com/Photos/zombom_red.jpeg");

                        productBrandObj2.addProduct(productObj3);
                        productBrandObj2.addProduct(productObj4); 
                        

                        productBrandObj.setDefaultSelectedProductList();
                       // productBrandObj.setDefaultProductList();                       
                        productBrandObj2.setDefaultSelectedProductList();
                      //  productBrandObj2.setDefaultProductList();
                       
                        
                        vm.ProductList.addProductBrand(productBrandObj);
                        vm.ProductList.addProductBrand(productBrandObj2);                        
                        vm.ProductList.setDefaultBrandList();*/
                                                 
                    });  
                                 
              });              
        
          });
      
          app.run('#/');
         ko.applyBindings(vm);
    });
  
  })(jQuery);