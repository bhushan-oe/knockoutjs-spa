var api = function () {
    var products = {};

    function getProducts() {
        return products;
    }

    function loadProducts(context) {
        var products;

        this.load('http://demo2828034.mockable.io/search/shirts')
            .then(function (data) {
                //context.app.swap('');
                data = JSON.parse(data);
                this.log(data.items); //=> [{title: ...}]
                $.each(data.items, function (i, item) {
                    context.log(item.skuId, '-', item.name);
                    context.render('templates/item.template', { item: item })
                        .appendTo(context.$element());
                });
                return data.items[0];
            });
        return products;
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
        loadProducts: loadProducts,
        loadDummyProducts: loadDummyProducts
    }
}();