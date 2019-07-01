function filterfun(){
    console.log("in filter");
    if($(window).width() < 900)
    {
        $(".desk_view").css({"display":"block"});
        $(".sort_view").css({"display":"none"});
    }
}

function sortfun(){
    console.log("in sort");
        $(".desk_view").css({"display":"none"});
        $(".sort_view").css({"display":"block"});
}
$('.check').click(function() {
    console.log("this.value");
    $('.check').not(this).prop('checked', false);
});

;(function($){

$(document).ready(function(){
    // ----------------------Code For Media Querry-------------------------------
    // var viewportWidth1 = $(window).width();
    //     if (viewportWidth1 < 900) {
    //         console.log("In small window;");
    //         $(".fascet").addClass("panel panel-primary");
    //         $(".filter").addClass("panel-heading clickble");
    //         $(".desk_view").addClass("panel-body");
    //     }
    //     if(viewportWidth1 > 900) {
    //             $(".fascet").removeClass("panel panel-primary");
    //             $(".filter").removeClass("panel-heading clickble");
    //             $(".desk_view").removeClass("panel-body");
    //     } 
    
    // $(window).resize(function () {
    //     var viewportWidth = $(window).width();
    //     if (viewportWidth > 900) {
    //         $(".fascet").removeClass("panel panel-primary");
    //         $(".filter").removeClass("panel-heading clickble");
    //         $(".desk_view").removeClass("panel-body");
    //      }  
    //     if (viewportWidth < 900) {
    //         // console.log("In small window;");
    //         $(".fascet").addClass("panel panel-primary");
    //         $(".filter").addClass("panel-heading clickble");
    //         $(".desk_view").addClass("panel-body");
    //     }
    // });
       
    //------------------------------------------------checkBox Single Select-------------
       
    
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
//-----------------------------------------------------------------------------------------------
function productViewModel() {
    //---------------------------------Observable and Observable Array declarations---------
    var self = this;
    self.Products=ko.observableArray();
    self.allProduct=ko.observableArray();
    self.color_observe=ko.observableArray();
    self.size_observe= ko.observableArray();
    self.brand_observe= ko.observableArray();
    self.color_flag=ko.observable(false);
    self.size_flag= ko.observable(false);
    self.brand_flag= ko.observable(false);
    self.fisrtRange =ko.observable();
    self.SecondRange=ko.observable();
    self.MinVal =ko.observable(200);
    self.MaxVal=ko.observable(700);
    self.color_select = ko.observableArray();
    self.size_select = ko.observableArray();
    self.brand_select = ko.observableArray();
    self.rating_select = ko.observableArray();
    self.Pricefilter =ko.computed(function(){
        if(self.size_select().length != 0 || self.brand_select().length != 0 || self.color_select().length != 0 || self.rating_select().length != 0 )
        var clonedArr = $.extend(true, [], self.Products());
        else
        var clonedArr = $.extend(true, [], self.allProduct());

        var temp =[];
        for(var y=0; y<clonedArr.length;y++)
        {
            if(clonedArr[y].Sku[0].price <= self.SecondRange() && clonedArr[y].Sku[0].price >= self.fisrtRange())
                temp.push(clonedArr[y]);
        }
        if(temp.length!=0){
            self.Products(temp);
        }
        else
        {
           self.Products(self.allProduct());
        }

    });

    //-------------------------------------------Sort functions--------------------------------
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
    //-----------------------------------------------Fascets Coding---------------------------------------
    self.applyFilter = function(Fascets_Array){
      
        var clonedArr = $.extend(true, [], this.allProduct());
        var temp=[];
        for (var fascet in Fascets_Array){
            for(var SelectedValue of Fascets_Array[fascet]){
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
        if(clonedArr.length!=0){
            self.Products(clonedArr);
        }
        else
        {
            $('input:checkbox').prop('checked', false);
           alert("Serched item Not found");
           self.Products(self.allProduct());
           //self.size_select().length=0;self.color_select();self.brand_select();self.rating_select();
        //$('input:checkbox').prop('checked', false);

        }
    };
   
    self.All_Compute_observe = ko.computed(function(){
      console.log(self.size_select(),self.brand_select(),self.color_select());
        var Fascets_Array =[];
                    if (self.size_select().length != 0){
                        Fascets_Array["size"]=self.size_select() ;
                    }
                    if (self.brand_select().length != 0){
                        Fascets_Array["brand"]=self.brand_select();
                    }
                    if (self.color_select().length != 0){
                        Fascets_Array["color"]=self.color_select();
                    }
                     if (self.rating_select().length != 0){
                        Fascets_Array["rating"]=self.rating_select();
                    }
                    if (!jQuery.isEmptyObject(Fascets_Array)){
                        self.applyFilter(Fascets_Array);
                    }   
                    else{
                        self.Products(self.allProduct());
                    }
           } );
//-------------------------------------------------------------------Fascet Coding End----------------
            //-----------------------------Use of flags to show fascet's less and more functionality--------
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
    //=------------------------ color click event in listing----------------------
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
//-----------------------------End of View model........................
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
//--------------------------------------PLP Page Array---------------------
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
                  //  console.log(vm.Product.allProduct());

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

ko.applyBindings(vm);

});

})(jQuery);
