var routing = function(){
    var app = $.sammy(function () {
        var self = this;
        this.use('Template');
        this.element_selector = '#main';

        this.get('#/', function (context, next) {
            context.app.swap('');
            $('#main').empty();        
            loadWidget("LandingPageWidget", $('#main'));
            landingPageViewModel.checkIfPlpPage();
        });

        this.get('#plp', function (context, next) {
            context.app.swap('');
            $('#main').empty();
            landingPageViewModel.checkIfPlpPage();
            self.element_selector = '#products-listing-area';
            api.loadProducts.call(this, context, function(prod) {
                console.log('products from callback ==> ', prod, api);
                api.products = prod;
                loadWidget("ProductListingPageWidget", $('#main'));
            });
            next();
        });
    });

    function applyRouting() {
        app.run('#/');
    }

    return {
        applyRouting : applyRouting
    }
}();