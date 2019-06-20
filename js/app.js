;(function($) {
function AppViewModel() {
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");

    var self = this;
    //self.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
    self.pages = ['Home', 'About', 'Products'];
    self.chosenPageId = ko.observable();
    self.chosenFolderData = ko.observable();
    self.chosenMailData = ko.observable();
    self.pageData = ko.observable();
    self.template = ko.observable();

    // Behaviours    
    self.goToPage = function(page) { location.hash = page };
    self.goToProduct = function(productid) { location.hash = 'Products/' + productid };

   
        // Client-side routes    
    Sammy(function() {
        this.get('#Home', function() {
            self.template("page-template");
            //get content for home page 
            self.chosenPageId("Home");
            $.get("/server/home.json",function(data){
                self.pageData(data);
            });
        });
        this.get('#About', function() {
            self.template("page-template");
            //get content for home page 
            self.chosenPageId("About");
            $.get("/server/about.json",function(data){
                self.pageData(data);
            });
        });

        this.get('#Products', function() {
            self.template("product-template");
            //get content for home page 
            self.chosenPageId("Products");
            // $.get("/server/about.json",function(data){
            //     self.pageData(data);
            // });
        });

        this.get('#Products/:pageid', function() {
            console.log(this.params.pageid)
            self.chosenPageId(this.params.pageid);
            self.chosenMailData(null);
            //$.get("/mail", { folder: this.params.folder }, self.chosenFolderData);
        });

        // this.get('#:folder/:mailId', function() {
        //     self.chosenPageId(this.params.folder);
        //     self.chosenFolderData(null);
        //     //$.get("/mail", { mailId: this.params.mailId }, self.chosenMailData);
        // });
    
        this.get('', function() { this.app.runRoute('get', '#Home') });
    }).run(); 
    
    

}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
})(jQuery);