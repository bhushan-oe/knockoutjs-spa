console.log("loading ProductListingArea behaviour");

//performLateBinding(viewModel, 'effect-element');

ko.components.register('product-tile', {
    template: {require : 'text!../components/Product/product-template.html'},
    viewModel: function ProductViewModel(params) {
            self = this;
            self.product = params.value;
            self.productName = ko.observable(self.product.name)();
            self.skus = ko.observableArray(self.product.skus)();
            self.imageurl = ko.observable(self.skus[0].imageurl);
            self.price = ko.observable(self.skus[0].price);
            self.onlyColors = ko.computed(function () {
                var colors = ko.utils.arrayMap(self.skus, function (item) {
                    return item.color;
                })
                console.log('Colors Before filter ', colors);
                return colors.sort().filter(function (a) { return !this[a] ? this[a] = true : false; }, {});
            });
            
            self.selectedColor = ko.observable(self.skus[0].color);
            console.log('self.imageurl = ', self.imageurl());

            self.loadSizes = function(skus) {
                console.log('load size ==>', skus);
                var allSizes = ko.utils.arrayMap(skus, function (item) {
                    if(self.selectedColor() == item.color){
                        return item.size;
                    }else{
                        return 'some';
                    }
                });

                allSizes = ko.utils.arrayFilter(allSizes, function(item) {
                    return item != 'some' ? true : false;
                });

                return allSizes;
            }

            self.sizes = ko.observableArray();
            self.skuSizes = ko.computed(
                {
                read: function(){
                    return this.sizes();
                },
                write:function(allSizes){
                    this.sizes(allSizes);
                },
                owner: this
            });
    
            self.selectColor = ko.computed({
                read: function () {
                    console.log('read ==> ', self);
                    
                    var _skus = self.skus;

                    var allSizes = self.loadSizes(_skus);

                    self.skuSizes(allSizes);
                    return self.selectedColor();
                },
                write: function (parentContext,param) {                    
                    self.selectedColor(param);
                    var _skus = parentContext.skus;
                    var skuFound = ko.utils.arrayFirst(_skus, function (item) {
                        return item.color == param;
                    });

                    parentContext.imageurl(skuFound.imageurl);
                    parentContext.price(skuFound.price);

                    var allSizes = self.loadSizes(_skus);

                    parentContext.skuSizes(allSizes);
                }
            });
        }
            }
);

performLateBinding(listingViewModel, 'products-list');
performLateBindingByClass(listingViewModel, 'sortByFilter');

$(".sortByFilter").click(function(){
    $(".sortByFilter").removeClass('active');
    $(this).addClass('active');
});