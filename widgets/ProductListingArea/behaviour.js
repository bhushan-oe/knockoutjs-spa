console.log("loading ProductListingArea behaviour");

//performLateBinding(viewModel, 'effect-element');

ko.components.register('product-tile', {
    viewModel: { require: '../components/Product/ProductViewModel' },
    template:
        '<div class="card">\
        <img class= "card-img-top" alt="Card image" style="width:100%" data-bind="attr: { src: skus[0].imageurl }" />\
    <div class="card-body">\
        <strong>\
            <p class="card-title" data-bind="text: productName"></p>\
        </strong>\
        Color : <div data-bind="foreach: {data: skus, as: \'sku\' }">\
        <p class="card-text" data-bind="text:sku.color"></p>\
    </div> \
        Size : <a href="#" class="btn btn-primary">See Profile</a>\
    </div>\
    </div>'
});

performLateBinding(productsViewModel, 'products-list');