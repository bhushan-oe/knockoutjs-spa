var navigation = function(){
    let goToPage = function (page) {
        location.hash = page;
    }

    return{
        goToPage : goToPage
    }
}();