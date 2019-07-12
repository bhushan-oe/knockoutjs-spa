var routing = function(){
    var app = $.sammy(function () {
        var self = this;
        this.use('Template');
        this.element_selector = '#main';
        this.get('#/', function (context, next) {
            context.app.swap('');
            $('#main').empty();        

            loadWidget("LandingPageWidget", $('#main'));
        });

        this.get('#plp', function (context, next) {
            context.app.swap('');
            $('#main').empty();
            self.element_selector = '#products-listing-area';
            var products;
            api.loadProducts.call(this, context, function(p) {
                console.log('products from callback ==> ', p, api);
                api.products = p;
                loadWidget("ProductListingPageWidget", $('#main'));
            });
            next();
        });
        
        this.get('#baba', function (context, next) {
            this.element_selector = '#main';
            context.app.swap('');
            $('#main').empty();
            loadWidget("BabaWidget", $('#main'));
        });
    });

    function applyRouting() {
        app.run('#/');
    }

    return {
        applyRouting : applyRouting
    }
}();