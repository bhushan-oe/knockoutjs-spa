console.log("loading ProductListingPageWidget behaviour");

function facetViewModel() {
    var self = this;
    self.filterA = ko.observable("hello");
    self.effect = ko.computed(function () {
        return self.filterA;
    }, self);
}

var viewModel = new facetViewModel();

function ProductsViewModel(){
    self = this;
    self.filter = ko.observable('Men');
    self.justBrands =  ko.computed(function() {
        var brands = ko.utils.arrayMap(api.getProducts().items, function(item) {
            return {"brand":item.brand};
        });
        brands = brands.sort().filter(function(a){return !this[a.brand] ? this[a.brand] = true : false;}, {});
        console.log('item : ', brands);
        return brands;
    }, self);
    self.brandFilter = ko.observableArray();
    self.filteredProducts = ko.computed(function() {
        var filter = self.filter();
        var brandFilters = self.brandFilter();
        if (!filter && brandFilters.length == 0) {
            return api.getProducts().items;
        } else {
            return ko.utils.arrayFilter(api.getProducts().items, function(item) {
                console.log('item : ', item);
                console.log('filter : ', filter);
                console.log('brandFilters : ', brandFilters);
                return stringStartsWith(item.name, filter) ||  isArrayContains(item.brand, brandFilters);
            });
        }
    }, self);
}
var productsViewModel = new ProductsViewModel();

loadWidget('FacetArea',$('#product-listing-page-widget-row'));
loadWidget('ProductListingArea',$('#product-listing-page-widget-row'));