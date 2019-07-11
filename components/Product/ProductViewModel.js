define(['knockout'], function (ko) {

    function ProductViewModel(params) {
        self = this;
            self.product = params.value;
            self.productName = ko.observable(self.product.name)();
            self.skus = ko.observableArray(self.product.skus)();
            self.imageurl = ko.observable(self.skus[0].imageurl);
            self.onlyColors = ko.computed(function () {
                var colors = ko.utils.arrayMap(self.skus, function (item) {
                    return item.color;
                })
                console.log('Colors Before filter ', colors);
                return colors.sort().filter(function (a) { return !this[a] ? this[a] = true : false; }, {});
            });
            
            self.selectedColor = ko.observable(self.skus[0].color);
            console.log('self.imageurl = ', self.imageurl());
    
            self.selectColor = ko.computed({
                read: function () {
                    return self.selectedColor();
                },
                write: function (parentContext,param) {
                    parentContext.selectedColor= param;
                    var _skus = parentContext.skus;
                    var skuFound = ko.utils.arrayFirst(_skus, function (item) {
                        return item.color == param;
                    });
                    console.log('param = ', param);
                    console.log('skuFound = ', skuFound);
                    console.log('default sku before setting = ', parentContext.imageurl());
                    parentContext.imageurl(skuFound.imageurl);
                    console.log('default sku after setting = ', parentContext.imageurl());
                }
            });
            
            this.sizes = ko.computed(function () {
                var _this = this;
                var allSizes = ko.utils.arrayMap(_this.skus, function (item) {
                    if(_this.selectedColor() == item.color){
                        return item.size;
                    }else{
                        return 'some';
                    }
                });
                allSizes = ko.utils.arrayFilter(allSizes, function(item) {
                    return item != 'some' ? true : false;
                });
                console.log('Sizes found ', allSizes);
                return allSizes;
            });
    }

    ProductViewModel.prototype.selectColor = function (param) {
        self.selectedColor(param);
        var _skus = self.skus;
        var skuFound = ko.utils.arrayFirst(_skus, function (item) {
            return item.color == param;
        });
        console.log('param = ', param);
        console.log('skuFound = ', skuFound);
        console.log('default sku before setting = ', self.imageurl());
        this.imageurl(skuFound.imageurl);
        console.log('default sku after setting = ', self.imageurl());
    };
    

    console.log('ProductViewModel.resetDefaultSku = ', ProductViewModel.prototype.resetDefaultSku);
    return ProductViewModel;
});