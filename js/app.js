;(function($){

$(document).ready(function(){    
  //-------------------------------------Code For Fascets Collapsing -------------------------------         
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
//----------------------------------------------------------------------------------------      
function viewModel() {
    var self = this;
    self.chosenPageId = ko.observable();
    self.pages = ko.observableArray(["Home", "About", "Product"]);
    self.template = ko.observable();
    self.Search_value= ko.observable();
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
//-----------------------------------------------------------------------------------------------
function productViewModel() {
            //---------------------------------Observable and Observable Array declarations---------
            var self = this;
            self.Products=ko.observableArray();
            self.allProduct=ko.observableArray();
            self.colorObserve=ko.observableArray();
            self.sizeObserve= ko.observableArray();
            self.brandObserve= ko.observableArray();
            self.colorFlag=ko.observable(false);
            self.sizeFlag= ko.observable(false);
            self.brandFlag= ko.observable(false);
            self.fisrtRange =ko.observable();
            self.SecondRange=ko.observable();
            self.MinVal =ko.observable(200);
            self.MaxVal=ko.observable(700);
            self.FascetLimit =ko.observable(5);
            self.totalCategory =ko.observableArray();
            self.RatingArray=ko.observableArray();
            self.color_select = ko.observableArray();
            self.size_select = ko.observableArray();
            self.brand_select = ko.observableArray();
            self.rating_select = ko.observableArray();
            //-------------------------------------------Sort functions--------------------------------
            self.SortByAsecnding = function(){
                $(".a1").css({"font-weight":"normal"});$(".a2").css({"font-weight":"bold"});$(".a3").css({"font-weight":"normal"});
                var clonedArr = $.extend(true, [], this.Products());
                clonedArr.sort((a,b)=>(a.Sku[0].price <b.Sku[0].price)?-1:((a.Sku[0].price > b.Sku[0].price)? 1 : 0));
                self.allProduct().sort((a,b)=>(a.Sku[0].price <b.Sku[0].price)?-1:((a.Sku[0].price > b.Sku[0].price)? 1 : 0));
                this.Products(clonedArr);
            };
            self.SortByDesecnding = function(){
                $(".a1").css({"font-weight":"normal"});$(".a2").css({"font-weight":"normal"});$(".a3").css({"font-weight":"bold"});
                var clonedArr = $.extend(true, [], this.Products());
                clonedArr.sort((a,b)=>(a.Sku[0].price >b.Sku[0].price)?-1:((a.Sku[0].price < b.Sku[0].price)? 1 : 0));
                self.allProduct().sort((a,b)=>(a.Sku[0].price >b.Sku[0].price)?-1:((a.Sku[0].price < b.Sku[0].price)? 1 : 0));
                this.Products(clonedArr);
            };
            self.SortByPopularity = function(){
                $(".a1").css({"font-weight":"bold"});$(".a2").css({"font-weight":"normal"});$(".a3").css({"font-weight":"normal"});
                var clonedArr = $.extend(true, [], this.Products());
                clonedArr.sort((a,b)=>(a.Sku[0].rating >b.Sku[0].rating)?-1:((a.Sku[0].rating < b.Sku[0].rating)? 1 : 0));
                self.allProduct().sort((a,b)=>(a.Sku[0].rating >b.Sku[0].rating)?-1:((a.Sku[0].rating < b.Sku[0].rating)? 1 : 0));
                this.Products(clonedArr);
            };
            //-----------------------------------------------Fascets Coding---------------------------------------          
            self.All_Compute_observe = ko.computed(function(){
                            if(self.size_select().length > 1)
                            {
                                self.size_select().shift();
                            }
                            if(self.rating_select().length > 1)
                            {
                                self.rating_select().shift();
                            }
                        var clonedArr = $.extend(true, [], self.allProduct());
                        var temp=[];
                        clonedArr.map(function(val){
                            if(val.Sku[0].price <= self.SecondRange() && val.Sku[0].price >= self.fisrtRange())
                                temp.push(val);
                        });
                            clonedArr=temp;
                            temp=[];
                        if (self.size_select().length != 0){
                            clonedArr.map(function(CurrentValue){
                            var prop=CurrentValue.size;
                            var result = self.size_select().filter(function(item) {
                                return prop.includes(item); 
                            })
                            if(result.length!=0)
                                temp.push(CurrentValue);
                        });
                            clonedArr=temp;
                            temp=[];
                            }
                        if (self.brand_select().length != 0){
                            clonedArr.map(function(CurrentValue){
                            var prop=CurrentValue.brand;
                            var result = self.brand_select().filter(function(item) {
                                return prop.includes(item); 
                            })
                            if(result.length!=0)
                            temp.push(CurrentValue);
                        });
                            clonedArr=temp;
                            temp=[];
                            }
                        if (self.color_select().length != 0){
                            clonedArr.map(function(CurrentValue){
                            var prop=CurrentValue.color;
                            var result = self.color_select().filter(function(item) {
                                return prop.includes(item); 
                            })
                            if(result.length!=0)
                            temp.push(CurrentValue);
                        });
                            clonedArr=temp;
                            temp=[];
                            }
                        if (self.rating_select().length != 0){
                            clonedArr.map(function(CurrentValue){
                                self.rating_select().filter(function(item) {
                                if (item <= CurrentValue.rating[0]){
                                    temp.push(CurrentValue);
                                }
                            });
                        });
                            clonedArr=temp;
                            temp=[];
                        }   
                        if(self.size_select().length == 0 && 
                            self.brand_select().length == 0 && 
                            self.color_select().length == 0 && 
                            self.rating_select().length == 0 && 
                            self.fisrtRange()== self.MinVal() && 
                            self.SecondRange()== self.MaxVal())
                            self.Products(self.allProduct());
                        else
                            self.Products(clonedArr); 
                     });
        //-------------------------------------------------------------------Fascet Coding End----------------
                    //-----------------------------Use of flags to show fascet's less and more functionality--------
            self.brandFlagFun = function (){
                if(this.brandFlag()==false)
                    this.brandFlag(true);
                else
                    this.brandFlag(false);    
            }
            self.sizeFlagFun = function (){
                if(this.sizeFlag()==false)
                    this.sizeFlag(true);
                else
                    this.sizeFlag(false);
            }
            self.colorFlagFun = function (){
                if(this.colorFlag()==false)
                    this.colorFlag(true);
                else
                    this.colorFlag(false);
            }
            //=------------------------ color click event in listing----------------------
            self.ColorClick = function (product,clr){
                var arr=[];
                var img;
                var pri;
                
                $.each(product.Sku, function(index, value){           
                    if(value.color == clr){
                        arr.push(value.size);
                        img=value.imageurl;
                        pri= value.price;
                    }
                });
                var size=product.Sku[0].prodId+"_size";
                var pri_id =product.Sku[0].prodId+"_price"
                $("#"+size).html("Size:"+arr+" ");
                $("#"+pri_id).html(" "+pri);
                $("#"+product.Sku[0].prodId).attr("src",img);
            }
            self.changeColor = function(product){
                var color_span =product.Sku[0].prodId+"heart";
                $("#"+color_span).toggleClass('fas fa-heart heart fas fa-heart redHeart');
            }
            
            self.title = 'Product';
            self.productid = 1;
            self.skuid = 1;
}
//-----------------------------End of View model........................
var vm = {
    Main: new viewModel(),
    Page: new pageViewModel(),
    Product: new productViewModel
};
Sammy(function () {
        this.get('#Home', function () {
            vm.Main.chosenPageId(this.params.page);  
            vm.Main.template("page-template")
            vm.Page.name("Home")
            
        });
//--------------------------------------PLP Page Array---------------------
        this.get('#About', function () {
            vm.Main.chosenPageId(this.params.page);     
            vm.Main.template("about-template");
            $.getJSON('http://demo2828034.mockable.io/search/shirts', function(data) {
                var unique_prod_arr =[];
                var totalSize =[];
                var totalColor =[];
                var totalBrand =[];
                var TotalCategory=[];
                var TotalRating=[];
               
                var clonedArr = data["items"];
                clonedArr.sort((a,b)=>(a.price <b.price)?-1:((a.price > b.price)? 1 : 0));
                vm.Product.fisrtRange(clonedArr[0].price);
                vm.Product.SecondRange(clonedArr[clonedArr.length-1].price);
                vm.Product.MinVal(clonedArr[0].price);
                vm.Product.MaxVal(clonedArr[clonedArr.length-1].price);

                data["items"].map(function(v){
                        if(val = unique_prod_arr.find( existingVal=>existingVal.id === v.prodId))
                            {
                                val.Sku.push(v);
                                if($.inArray(v.color, val.color) === -1) 
                                {
                                    val.color.push(v.color);
                                }
                                if($.inArray(v.size, val.size) === -1) 
                                {
                                    val.size.push(v.size);
                                }
                                if($.inArray(v.brand, val.brand) === -1) 
                                {
                                    val.brand.push(v.brand);
                                }
                                if($.inArray(v.rating, val.rating) === -1) 
                                {
                                    val.rating.push(v.rating);
                                }     
                            }
                            else{
                                var SkuArray=[];
                                SkuArray.push(v);
                                var colorArray=[];
                                colorArray.push(v.color);
                                var sizeArray =[];
                                sizeArray.push(v.size);
                                var brandArray =[];
                                brandArray.push(v.brand);
                                var ratingArray =[];
                                ratingArray.push(v.rating);
                                unique_prod_arr.push({"id":v.prodId,"Sku":SkuArray,"color":colorArray,"size":sizeArray,"brand":brandArray,"rating":ratingArray}) ;
                            }
                            if($.inArray(v.size, totalSize) === -1) 
                            {
                                totalSize.push(v.size);
                            }
                            if($.inArray(v.color, totalColor) === -1) 
                            {
                                totalColor.push(v.color);
                            }
                            if($.inArray(v.brand, totalBrand) === -1) 
                            {
                                totalBrand.push(v.brand);
                            }
                            if($.inArray(v.category, TotalCategory) === -1) 
                            {
                                TotalCategory.push(v.category);
                            }
                            var x =Math.floor(v.rating);
                            if($.inArray(x, TotalRating) === -1) 
                            {
                                TotalRating.push(x);
                            }
                        });
                    vm.Product.Products(unique_prod_arr); 
                    vm.Product.allProduct(unique_prod_arr); 
                    vm.Product.SortByPopularity(); 
                    if($(window).width() < 900)
                    vm.Product.SortByAsecnding();
                    vm.Product.sizeObserve(totalSize);
                    vm.Product.colorObserve(totalColor);
                    vm.Product.brandObserve(totalBrand);  
                    vm.Product.totalCategory(TotalCategory);
                    vm.Product.RatingArray(TotalRating);
                });
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

})(jQuery);
var filterfun = function(){
    if($(window).width() < 900)
    {
        $("#viewFilter").toggleClass('hidefilter showfilter');
        $("#viewSort").removeClass('showsortBy').addClass('hidesortBy');
    }
}
var sortfun = function(){
        $("#viewSort").toggleClass('hidesortBy showsortBy');
        $("#viewFilter").removeClass('showfilter').addClass('hidefilter');
}
