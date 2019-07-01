define(['knockout'], function(ko) {

    function ProductViewModel(params) {
        this.product = params.value;
        this.productName = ko.observable(this.product.name)();
        this.skus = ko.observableArray(this.product.skus)();
    }

    return ProductViewModel;

});