$(document).ready(function(){               
    $(document).on("click", "#toggleButton", function(){                                      
        $("#navbarCollapase").toggleClass("mobileHide");
    });

    $(document).on("click", "#sortToggleButton", function(){                                      
        $("#sortOptions").toggleClass("sortOptionHide");
    });
});