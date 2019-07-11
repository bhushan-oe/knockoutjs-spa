require(['./javascripts/config.js'
        ,'./javascripts/util.js'
        ,'./javascripts/modules/navigation.js'
        ,'./javascripts/modules/api.js'
        ,'./javascripts/modules/routing.js'], function (foo) {
    console.log("loading util.js using requirejs");
    main();
});

function main() {
    routing.applyRouting();
}