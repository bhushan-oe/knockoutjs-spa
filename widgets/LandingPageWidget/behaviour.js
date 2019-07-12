console.log("loading LandingPageWidget behaviour");
var searchedKeyword;

var landingPageViewModel = {
    goToPage : function(hash, keyword) {
        searchedKeyword = keyword;
        navigation.goToPage(hash);
    }
};

performLateBinding(landingPageViewModel, 'searchBtn');