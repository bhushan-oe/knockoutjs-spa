console.log("loading ProductListingPageWidget behaviour");

function ListingViewModel(){
    self = this;
    self.filter = ko.observable('');
    self.priceFilter = ko.observable(700);
    console.log('priceFilter found ===> ', self.priceFilter());
    self.brandFilters = ko.observableArray();
    self.categoryFilters = ko.observableArray();
    self.sortBy = ko.observable();
    self.justColors = ko.observableArray(api.getProducts().colors);
    self.justSizes = ko.observableArray(api.getProducts().sizes);
    self.colorFilter = ko.observable();
    self.ratingFilter = ko.observable();
    self.sizeFilter = ko.observable();

    self.filteredProducts = ko.computed(function() {
        var filter = this.filter;
        var pFilter = this.priceFilter();
        var bfilters = this.brandFilters();
        var catFilters = this.categoryFilters();
        var sortByFilter = this.sortBy();
        var colorFilter = this.colorFilter();
        var ratingFilter = this.ratingFilter();
        var sFilter = this.sizeFilter();

        console.log('sortBy', sortByFilter);
        
        var filteredList;

        if (!filter() &
            (catFilters.length == 0) &
            (bfilters.length == 0) &
            (pFilter == 0) &
            (colorFilter == undefined) &
            (ratingFilter == undefined) &
            (sFilter == undefined)) {
            retfilteredList = api.getProducts().items;
        } else {
            filteredList =  ko.utils.arrayFilter(api.getProducts().items, function(item) {
                console.log('item : ', item);
                console.log('filter : ', filter());
                console.log('brandFilters : ', bfilters);
                console.log('categoryFilters : ', catFilters);
                console.log('priceFilter : ', pFilter);
                console.log('colorFilters : ', colorFilter);
                console.log('ratingFilter : ', ratingFilter);
                console.log('sizeFilter : ', sFilter);
                
                return isInPriceRange(item.maxPrice, item.minPrice, pFilter)
                    && isArrayContainsItemForFilter(item.brand, bfilters)
                    && isArrayContainsItemForFilter(item.category, catFilters)
                    && isArrayContainsItemForFilter(colorFilter, item.colors)
                    && (ratingFilter != undefined ? ratingFilter <= item.minRating : true)
                    && isArrayContainsItemForFilter(sFilter, item.sizes)
                    && stringStartsWith(item.name, filter());
            });
        }

        return filteredList.sort(function (left, right) {
            switch(sortByFilter){
                case 'price-low-to-high':
                    return left.maxPrice === right.maxPrice ? 0
                        : left.maxPrice < right.maxPrice ? -1
                        : 1;
                    break;
                case 'price-high-to-low':
                        return left.maxPrice === right.maxPrice ? 0
                        : left.maxPrice > right.maxPrice ? -1
                        : 1;
                    break;
                case 'popularity':
                        return left.maxRating === right.maxRating ? 0
                        : left.maxRating > right.maxRating ? -1
                        : 1;
                    break;
                default:
                    return 0;
            }
        });
    }, self);

    self.justBrands =  ko.computed(function() {
        var brands = ko.utils.arrayMap(api.getProducts().items, function(item) {
            return {"brand":item.brand};
        });
        brands = brands.sort().filter(function(a){return !this[a.brand] ? this[a.brand] = true : false;}, {});
        console.log('item : ', brands);
        return brands;
    }, self);

    self.maxPriceRange = ko.computed(function(){
        var maxPrices =  ko.utils.arrayMap(api.getProducts().items, function(item) {
            return item.maxPrice;
        });
        console.log('maxPrimaxPricesceRange found ===> ', maxPrices);
        return Math.max.apply(null,maxPrices);
    });
    console.log('maxPriceRange found ===> ', self.maxPriceRange());
    self.justRatings = ko.computed(function(){
        var ratingList = ko.utils.arrayMap(api.getProducts().items,function(item){
            return Math.floor(item.minRating);
        });

        ratingList = ratingList.sort().filter(function(a){return !this[a] ? this[a] = true : false;}, {});
        return ratingList;
    });
    console.log('justRatings =====>', self.justRatings());

    self.justCategories =  ko.computed(function() {
        var categories = ko.utils.arrayMap(api.getProducts().items, function(item) {
            return {"category":item.category};
        });
        categories = categories.sort().filter(function(a){return !this[a.category] ? this[a.category] = true : false;}, {});
        console.log('item : ', categories);
        return categories;
    }, self);
    console.log('categories =====>', self.justCategories());

    
    self.sortByRelevence = function(){ this.sortBy('relevence')};
    self.sortByPriceLowToHigh = function(){ this.sortBy('price-low-to-high')};
    self.sortByPriceHighToLow = function(){ this.sortBy('price-high-to-low')};
    self.sortByPopularity = function(){ this.sortBy('popularity')};


}
var listingViewModel = new ListingViewModel();

loadWidget('FacetArea',$('#product-listing-page-widget-row'));
loadWidget('ProductListingArea',$('#product-listing-page-widget-row'));