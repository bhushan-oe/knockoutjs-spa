console.log("loading LandingPageWidget behaviour");

var landingPageViewModel = {
    goToPage : function(hash) {
        navigation.goToPage(hash);
    }
};

performLateBinding(landingPageViewModel, 'searchBtn');