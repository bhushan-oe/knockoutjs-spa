;(function($){

$(document).ready(function(){
   
    
             $(window).resize(function () {
                var viewportWidth = $(window).width();
                if (viewportWidth > 600) {
                    //             $(".view").removeClass("view view-portfolio").addClass("gallery-mobile");
                    console.log("hello");
                         }  
    
                if (viewportWidth < 600) {
                    //             $(".view").removeClass("view view-portfolio").addClass("gallery-mobile");
                    console.log("hello111");
                         }
                 });
            
$(document).on('click', '.panel-heading.clickable', function(e){
    
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
})
       
function viewModel() {
    var self = this;
    self.chosenPageId = ko.observable();
    self.pages = ko.observableArray(["Home", "About", "Product"]);
    self.template = ko.observable();
    self.demo = "About";
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
// function aboutViewModel() {
//     var self = this;
//     self.name = 'About';
// }
function productViewModel() {
    var self = this;
    self.Products=ko.observableArray();
    self.allProduct=ko.observableArray();
    self.color_observe=ko.observableArray();
    self.size_observe= ko.observableArray();
    self.brand_observe= ko.observableArray();
    self.color_flag=ko.observable(false);
    self.size_flag= ko.observable(false);
    self.brand_flag= ko.observable(false);
    self.fisrtRange =ko.observable(200);
    self.SecondRange=ko.observable(700);
    self.MinVal =ko.observable(200);
    self.MaxVal=ko.observable(700);
    self.color_select = ko.observableArray();
    self.size_select = ko.observableArray();
    self.brand_select = ko.observableArray();
    self.rating_select = ko.observableArray();
    self.filterArray =ko.observableArray();
    self.SortByAsecnding = function(){
        $("#a1").css({"font-weight":"normal"});$("#a2").css({"font-weight":"bold"});$("#a3").css({"font-weight":"normal"});
        var clonedArr = $.extend(true, [], this.Products());
        clonedArr.sort((a,b)=>(a.Sku[0].price <b.Sku[0].price)?-1:((a.Sku[0].price > b.Sku[0].price)? 1 : 0));
        this.Products(clonedArr);
    };
    self.SortByDesecnding = function(){
        $("#a1").css({"font-weight":"normal"});$("#a2").css({"font-weight":"normal"});$("#a3").css({"font-weight":"bold"});
        var clonedArr = $.extend(true, [], this.Products());
        clonedArr.sort((a,b)=>(a.Sku[0].price >b.Sku[0].price)?-1:((a.Sku[0].price < b.Sku[0].price)? 1 : 0));
        this.Products(clonedArr);
    };
    self.SortByPopularity = function(){
        $("#a1").css({"font-weight":"bold"});$("#a2").css({"font-weight":"normal"});$("#a3").css({"font-weight":"normal"});
        var clonedArr = $.extend(true, [], this.Products());
        clonedArr.sort((a,b)=>(a.Sku[0].rating >b.Sku[0].rating)?-1:((a.Sku[0].rating < b.Sku[0].rating)? 1 : 0));
        this.Products(clonedArr);

    };
    self.applyRating = function(selectrating, filterArr){
        var temp =[];
        if (filterArr.length == 0 ){
            for (var rating in selectrating){
                for (var ratingPro in self.allProduct()){
                    if (selectrating[rating],self<= allProduct()[ratingPro].rating){
                        temp.push(self.allProduct()[ratingPro]);
                    }
                }
            }
        return temp;
        }
        else{
            for (var rating in selectrating){
                for (var ratingPro in filterArr){
                    if (selectrating[rating],self<= allProduct()[ratingPro].rating){
                        temp.push(filterArr[ratingPro]);
                    }
                }
            }
        return temp;
        }
    }

    self.applyBrand = function(selectbrand, filterArr){
        var temp =[];
        if (filterArr.length == 0 ){
            for (var brand in selectbrand){
                for (var brandPro in self.allProduct()){
                    if ($.inArray(selectbrand[brand],self.allProduct()[brandPro].brand) != -1){
                       temp.push(self.allProduct()[brandPro]);
                    }
                }
            }
            return temp;
        }
        else{
            for (var brand in selectbrand){
                for (var brandPro in filterArr){
                    if ($.inArray(selectbrand[brand], filterArr[brandPro].brand) != -1){
                        temp.push(filterArr[brandPro]);
                       
                    }
                }
            }
            return temp;
        }
    }
    self.applyColor = function(selectcolor, filterArr){
        var temp =[];
        if (filterArr.length == 0){
            for (var color in selectcolor){
                for (var colorPro in self.allProduct()){
                    if ($.inArray(selectcolor[color],self.allProduct()[colorPro].color) != -1){
                        temp.push(self.allProduct()[colorPro]);
                        console.log("in brand");
                    }
                }
            }
            return temp;
        }
        else{
            for (var color in selectcolor){
                for (var colorPro in filterArr){
                    if ($.inArray(selectcolor[color], filterArr[colorPro].color) != -1){
                        temp.push(filterArr[colorPro]);
                    }
                }
            }
            return temp;
        }
    }
    self.applySize = function(selectsize, filterArr){
        var temp = [];
        if (filterArr.length == 0){
            for (var size in selectsize){
                for (var sizePro in self.allProduct()){
                    if ($.inArray(selectsize[size],self.allProduct()[sizePro].size) != -1){
                        temp.push(self.allProduct()[sizePro]);
                    }
                }
            }
            return temp;
        }
        else{
            for (var size in selectsize){
                for (var sizePro in filterArr){
                    if ($.inArray(selectsize[size], filterArr[sizePro].size) != -1){
                       temp.push(filterArr[sizePro]);
                    }
                }
            }
            return temp;
        }
    } 

    self.All_Compute_observe = ko.computed(function(){
       // console.log(self.size_select(),self.brand_select(),self.color_select());
                var tempArr = [];
               
                    if (self.size_select().length != 0){
                        tempArr = self.applySize(self.size_select(),tempArr);
                    }
                    if (self.brand_select().length != 0){
                        tempArr = self.applyBrand(self.brand_select(),tempArr);
                    }
                    if (self.color_select().length != 0){
                        tempArr = self.applyColor(self.color_select(),tempArr);
                    }
                    if (self.rating_select().length != 0){
                    tempArr = self.applyRating(self.rating_select(),tempArr);
                    }
                    self.filterArray(tempArr);
                
                    if (self.filterArray().length != 0){
                        self.Products(self.filterArray());
                    }
                    else{
                        self.Products(self.allProduct());
                    }
           } );

    self.brand_flag_fun = function (){
        if(this.brand_flag()==false)
            this.brand_flag(true);
        else
            this.brand_flag(false);
    
    }
    self.size_flag_fun = function (){
        if(this.size_flag()==false)
        this.size_flag(true);
        else
        this.size_flag(false);
    }
    self.color_flag_fun = function (){
        if(this.color_flag()==false)
            this.color_flag(true);
        else
            this.color_flag(false);
    }
    self.ColorClick = function (product,clr){
        var arr=[];
        var img;
        
        $.each(product.Sku, function(index, value){ 
           
            if(value.color == clr){
                arr.push(value.size);
                img=value.imageurl;
            }
        });
        var size=product.Sku[0].prodId+"_size";
        $("#"+size).html("Size:"+arr+" ");
        $("#"+product.Sku[0].prodId).attr("src",img);
        console.log(arr);
    }
    self.changeColor = function(product){
        var color_span =product.Sku[0].prodId+"heart";
        $("#"+color_span).toggleClass('fas fa-heart heart fas fa-heart redHeart');
    }

    self.title = 'Product';
    self.productid = 1;
    self.skuid = 1;
}
var vm = {
    Main: new viewModel(),
    Page: new pageViewModel(),
    Product: new productViewModel
};

Sammy(function () {
        this.get('#Home', function () {
            $(".navbar1").css({"display":"none"});
            vm.Main.chosenPageId(this.params.page);  
            vm.Main.template("page-template")
            vm.Page.name("Home")
            // $.get('./server/home.json',function(data){
            //     vm.Page.name(data.title);
            //     vm.Page.content(data.content);
            // })
        });
        this.get('#About', function () {
            vm.Main.chosenPageId(this.params.page);     
            vm.Main.template("about-template");
            $.getJSON('http://demo2828034.mockable.io/search/shirts', function(data) {
                 var unique_prod_arr =[];
                var Data=[];
                var clonedArr = data["items"];
               clonedArr.sort((a,b)=>(a.price <b.price)?-1:((a.price > b.price)? 1 : 0));
                vm.Product.fisrtRange(clonedArr[0].price);
                vm.Product.SecondRange(clonedArr[clonedArr.length-1].price);
                vm.Product.MinVal(clonedArr[0].price);
                vm.Product.MaxVal(clonedArr[clonedArr.length-1].price);

                $.each(data["items"], function(i, item) 
                {
                    Data.push(item.prodId);
                });

                var distinct_product =[];
                $.each(Data, function(i, el){
                       if($.inArray(el, distinct_product) === -1) distinct_product.push(el);
                 });
                    var total_size =[];
                    var D_total_size=[];
                    var total_color =[];
                    var D_total_color=[];
                    var total_brand =[];
                    var D_total_brand=[];
            
                for(var j=0; j < distinct_product.length; j++)
                    {
                        var sample_arr =[];
                        var C_sample_arr =[];var D_color_arr=[];
                        var S_sample_arr =[];var D_size_arr=[];
                        var B_sample_arr =[];var D_brand_arr=[];
                        var R_sample_arr =[];var D_rating_arr=[];
                        var prod_id_val= distinct_product[j];
                        $.each(data["items"], function(i, item)
                        {
                            if(prod_id_val==item.prodId)
                            {
                                sample_arr.push(item);
                                C_sample_arr.push(item.color);
                                $.each(C_sample_arr, function(i, el)
                                {
                                    if($.inArray(el, D_color_arr) === -1) D_color_arr.push(el);
                                });
                                S_sample_arr.push(item.size);
                                $.each(S_sample_arr, function(i, el)
                                {
                                    if($.inArray(el, D_size_arr) === -1) D_size_arr.push(el);
                                });
                                B_sample_arr.push(item.brand);
                                $.each(B_sample_arr, function(i, el)
                                {
                                    if($.inArray(el, D_brand_arr) === -1) D_brand_arr.push(el);
                                });
                                R_sample_arr.push(item.rating);
                                $.each(R_sample_arr, function(i, el)
                                {
                                    if($.inArray(el, D_rating_arr) === -1) D_rating_arr.push(el);
                                });
                            }
                                total_color.push(item.color);
                                $.each(total_color, function(i, el)
                                {
                                    if($.inArray(el, D_total_color) === -1) D_total_color.push(el);
                                });
                                total_size.push(item.size);
                                $.each(total_size, function(i, el)
                                {
                                    if($.inArray(el, D_total_size) === -1) D_total_size.push(el);
                                });
                                total_brand.push(item.brand);
                                $.each(total_brand, function(i, el)
                                {
                                    if($.inArray(el, D_total_brand) === -1) D_total_brand.push(el);
                                });
                        });
                        unique_prod_arr.push({"id ":prod_id_val,"Sku":sample_arr,"color":D_color_arr,"size":D_size_arr,"brand":D_brand_arr,"rating":D_rating_arr}) ;                   
                    }
                    vm.Product.Products(unique_prod_arr); 
                    vm.Product.allProduct(unique_prod_arr); 
                    vm.Product.SortByPopularity(); 
                    vm.Product.size_observe(D_total_size);
                    vm.Product.color_observe(D_total_color);
                    vm.Product.brand_observe(D_total_brand);  
                    console.log(vm.Product.allProduct());

            });
            //vm.Page.name("About")
            // $.get('./server/about.json',function(data){
            //     vm.Page.name(data.title);
            //     vm.Page.content(data.content);
            // })
        });

        this.get('#Product', function () {
            vm.Main.chosenPageId(this.params.page);     
            vm.Main.template("product-template")
            //vm.Page.name("About")
            //fetch product details here
        });

        this.get('#Product/:productid', function () {
            vm.Main.chosenPageId("Product");     
            vm.Main.template("product-template")
            //this.params.productid
            //vm.Page.name("About")
            //fetch product details here
        });

        // this.get('#:page', function () {
        //     vm.Main.chosenPageId(this.params.page);     
        //     vm.Main.template("page-template") 
        // });
    }).run('#Home');
//     $(window).load(function() {
    
//     var viewportWidth = $(window).width();
//     if (viewportWidth < 600) {
//             $(".view").removeClass("view view-portfolio").addClass("gallery-mobile");
//     }
    
//     $(window).resize(function () {
    
//         if (viewportWidth < 600) {
//             $(".view").removeClass("view view-portfolio").addClass("gallery-mobile");
//         }
//     });
// });
ko.applyBindings(vm);

});

})(jQuery);
