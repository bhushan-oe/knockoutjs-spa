var navigation = function(){
    goToPage = function (page) {
        location.hash = page;
    }

    return{
        goToPage : goToPage
    }
}();