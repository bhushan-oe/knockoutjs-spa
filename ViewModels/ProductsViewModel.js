function ProductsViewModel(){
    self = this;
    self.filter = ko.observable('Men');
    self.filteredProducts = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return api.getProducts();
        } else {
            return ko.utils.arrayFilter(api.getProducts(), function(item) {
                return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
            });
        }
    }, self);
}