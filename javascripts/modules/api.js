var api = function () {
    var products = {};
    var productModel = {};

    function getProducts() {
        return products;
    }

    function getProductModel(){
        return productModel;
    }

    function loadProducts(context, cb) {
       return this.load('http://demo2828034.mockable.io/search/shirts')
            .then(function (data) {
                //context.app.swap('');
                data = JSON.parse(data);
                this.log(data.items);
                var newItems = [];
                var colors = [];

                $.each(data.items,(function(i,v){
                    var foundProd = getProductFromModel(newItems,v.prodId);
                    if(foundProd == null){
                        var product = 
                        {
                            'prodId' : v.prodId,
                            'category': v.category,
                            'brand': v.brand,
                            'name': v.name,
                            'minPrice': v.price,
                            'maxPrice': v.price,
                            'minRating': v.rating,
                            'maxRating': v.rating,
                            'colors' : [v.color],
                            'skus': [{'skuId':v.skuId,
                                "color": v.color,
                                "imageurl": v.imageurl,
                                "size": v.size,
                                "rating": v.rating,
                                "price": v.price
                                }]
                        }
                        newItems.push(product);
                    }else{
                        if(v.price > foundProd.maxPrice){ 
                            foundProd.maxPrice = v.price;
                        }else if(v.price < foundProd.minPrice){
                            foundProd.minPrice = v.price;
                        }
                        
                        if(v.rating > foundProd.maxRating){ 
                            foundProd.maxRating = v.rating;
                        }else if(v.rating < foundProd.minRating){
                            foundProd.minRating = v.rating;
                        }
                        
                        foundProd.colors.push(v.color);
                        foundProd.skus.push({'skuId':v.skuId,
                        "color": v.color,
                        "imageurl": v.imageurl,
                        "size": v.size,
                        "rating": v.rating,
                        "price": v.price
                        });
                    }
                    if(!isArrayContains(v.color,colors)) colors.push(v.color);
                }));

                products.colors = colors;
                products.items = newItems;
                console.log('prodcts API ==> ', products);
                
                // return data.items[0];
                cb(products)
            });
    }

    function getProductFromModel(array,id){
        var foundItem;
        $.each(array, function(index, item){
            if(item.prodId == id){
                foundItem =  item;
            }
        })
        return foundItem;
    }

    function loadDummyProducts(context) {
        $.getJSON("./data/dummy_products.json", function (data) {
            var items = [];
            $.each(data.items, function (key, val) {
                items.push("<li id='" + key + "'>" + val + "</li>");
                console.log("key : " + key + " val : " + val.skus[0].skuId);
            });

            products = data;
        });
        return products;
    }
    
    return {
        getProducts: getProducts,
        getProductModel : getProductModel,
        loadProducts: loadProducts,
        loadDummyProducts: loadDummyProducts
    }
}();