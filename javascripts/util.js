define();
/*
The following function load the widget from the widget directory.
@param widgetName - Name of widget, there should be a directory in the widgets directory by this name with the 
                    respective beaviour.js, view.html and style.css
@param parentElement - The element to which the widget would be added to.
*/
function loadWidget(widgetName, parentElement) {
    // console.log("loading widget ", widgetName);
    let widgetDirectory = "./widgets/" + widgetName;
    $.get(widgetDirectory + "/view.html", function(data) {
        parentElement.append(data);
        // console.log("-->Successfuly loading view.html for " + widgetName);
    });
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: widgetDirectory + "/style.css"
     }).appendTo(parentElement);

    require([widgetDirectory + "/behaviour.js"], function (foo) {
        // console.log("-->Successfuly loaded behaviour.js for " + widgetName);
    });
}

/* 
The function binds the element with the passed id to the viewModel.
*/
function performLateBinding(viewModel, id) {
    var element = document.getElementById(id);
    // console.log('element for binding : ', element);
    ko.applyBindings(viewModel, element);
}

function performLateBindingByClass(viewModel, className) {
    var elements = document.getElementsByClassName(className);
    // console.log('element for binding : ', elements);
    $.each(elements,function(i, element){
        ko.applyBindings(viewModel, element);
    });
    
}

var stringStartsWith = function (string, startsWith) {          
    string = string || "";
    if (startsWith.length > string.length || startsWith.length == 0)
        return true;
    return string.substring(0, startsWith.length) === startsWith;
};

var isArrayContains = function(element, arr){
    var index = $.inArray(element, arr);
    if(index < 0){
        return false;
    }else{
        return true;
    }
};

var isArrayContainsItemForFilter = function(element, arr){
    var index = $.inArray(element, arr);
    if(arr.length == 0 || element == undefined) return true;
    if(index < 0){
        return false;
    }else{
        return true;
    }
};

var isInPriceRange = function(minPrice, maxPrice, priceFilter){
    if(maxPrice <= priceFilter){
        return true;
    }else{
        return false;
    }
}