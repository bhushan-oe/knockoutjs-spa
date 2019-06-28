$(document).ready(function(){
    $.getJSON('http://demo2828034.mockable.io/search/shirts', function(data) {
    var row = $(".row");
    var arr_colors =[];
    var arr_size=[];
    function getFields(input, field) {
        var output = [];
        for (var i=0; i < input.length ; ++i)
            output.push(input[i][field]);
        return output;
    }
    const distinct =(value,index,self)=>{
        return self.indexOf(value)===index;
    }
    var Data=[];
    $.each(data["items"], function(i, item) 
    {
        Data.push(item.prodId);
    });
      var distinct_product =[];
      distinct_product.push(Data.filter(distinct));
      var unique_prod_arr =[];
      for(let j=0; j < distinct_product[0].length; j++)
            {
                var sample_arr =[];
                unique_prod_arr[distinct_product[0][j]]=sample_arr;
                $.each(data["items"], function(i, item)
                {
                    if(distinct_product[0][j]==item.prodId)
                        sample_arr.push(item);
                });
            }
   for(let ob in unique_prod_arr ) {
        // var main_div = $("<div>");
        // main_div.addClass("col-lg-3 col-sm-6");
        var sub_div = $("<div>");
        sub_div.addClass("product-grid");
        var product_image = $("<div>").addClass("product-image");
        var a_tag =$("<a>");
        let img_tag = $("<img>").addClass("pic-1");
        img_tag.attr("src",unique_prod_arr[ob][0].imageurl);
        a_tag.append(img_tag);
        product_image.append(a_tag);
        var product_content = $("<div>").addClass("product-content").css({"align-content":"left"});
        var h3_tag =$("<h3>").addClass("title");
        var h6_tag = $("<h5>").addClass("name");
        var price_tag =$("<div>").addClass("title");
        let size_tag =$("<div>").addClass("size");
        var color_tag =$("<div>").addClass("color");
        color_tag.css({"display":"flex"})
        h3_tag.html(unique_prod_arr[ob][0].brand);
        h6_tag.html(unique_prod_arr[ob][0].name);
        price_tag.html("$ "+unique_prod_arr[ob][0].price);
        arr_colors[ob]=getFields(unique_prod_arr[ob],"color");
        var d_arr_colors=[];
        d_arr_colors[ob]=(arr_colors[ob]).filter(distinct);
        arr_size[ob]=getFields(unique_prod_arr[ob],"size");
        let disp_size=(arr_size[unique_prod_arr[ob][0].prodId]).filter(distinct);
        for(let j=0;j<d_arr_colors[unique_prod_arr[ob][0].prodId].length;j++)
        {   
            let temp_div= $("<div>").css({ "background-color": d_arr_colors[ob][j],"height":"40px","width":"40px","margin":"3px","border-radius":"50%","border":"1px solid gray" }) 
            color_tag.append(temp_div);
            let temp= d_arr_colors[ob][j];
            temp_div.hover(function() {
                var tempskuid = unique_prod_arr[ob][0].prodId+"_"+temp;
                    let disp_size1 =[];
                $.each(data["items"], function(index, value){
                    if(value.skuId.match(tempskuid)){
                        img_tag.attr("src",value.imageurl);
                        disp_size1.push(value.size);
                        size_tag.html("<b>Size:</b>"+disp_size1);
                    }
                });
           },function(){
            img_tag.attr("src",unique_prod_arr[ob][0].imageurl);
            size_tag.html("<b>Size:</b>"+disp_size);
           });
        }
        size_tag.html("<b>Size:</b>"+disp_size);
        product_content.append(h3_tag);
        product_content.append(h6_tag); 
        product_content.append(price_tag);
        product_content.append(color_tag);
        product_content.append(size_tag);
        sub_div.append(product_image);
        sub_div.append(product_content);
        main_div.append(sub_div);
        row.append(main_div);
    };

  });
});
data-bind="click: function(){
    var tempskuid = unique_prod_arr[ob][0].prodId+"_"+temp;
        let disp_size1 =[];
    $.each(data["items"], function(index, value){
        if(value.skuId.match(tempskuid)){
            img_tag.attr("src",value.imageurl);
            disp_size1.push(value.size);
            size_tag.html("<b>Size:</b>"+disp_size1);
        }
    });
},function(){
img_tag.attr("src",unique_prod_arr[ob][0].imageurl);
size_tag.html("<b>Size:</b>"+disp_size);
});