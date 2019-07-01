; (function ($) {

    $(document).ready(function () {

        function viewModel() {
            var self = this;
            self.chosenPageId = ko.observable();
            self.pages = ko.observableArray(["Home", "About", "Product"]);
            self.template = ko.observable();
            self.plp = "product-listing-page";
            self.goToPage = function (page) {
                console.log(page);
                location.hash = page;
            }
            self.goToProduct = function (productid) {
                location.hash = 'Product/' + productid;
            }
        }
        function pageViewModel() {
            var self = this;
            self.name = ko.observable('Home');
            self.content = ko.observable('Home default content')
        }
        // function aboutViewModel() {
        //     var self = this;
        //     self.name = 'About';
        // }
        function productViewModel() {
            var self = this;
            self.title = 'Product';
            self.productid = 1;
            self.skuid = 1;
        }
        var vm = {
            Main: new viewModel(),
            Page: new pageViewModel(),
            Product: new productViewModel
        };

        Sammy(function () {
            this.get('#Home', function () {
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("landing-page")
                vm.Page.name("Home")
                $.get('./server/home.json', function (data) {
                    vm.Page.name(data.title);
                    vm.Page.content(data.content);
                })
            });
            this.get('#product-listing-page', function () {
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("product-listing-page")
                //vm.Page.name("About")

            });
            this.get('#Product', function () {
                vm.Main.chosenPageId(this.params.page);
                vm.Main.template("product-template")
                //vm.Page.name("About")
                //fetch product details here
            });

            this.get('#Product/:productid', function () {
                vm.Main.chosenPageId("Product");
                vm.Main.template("product-template")
                //this.params.productid
                //vm.Page.name("About")
                //fetch product details here
            });

            // this.get('#:page', function () {
            //     vm.Main.chosenPageId(this.params.page);     
            //     vm.Main.template("page-template") 
            // });
        }).run('#Home');
        ko.applyBindings(vm);

    });

})(jQuery);