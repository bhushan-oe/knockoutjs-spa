console.log("loading FacetArea behaviour");
//performLateBinding(viewModel, 'filter-area');
performLateBinding(listingViewModel, 'filter');
performLateBinding(listingViewModel, 'brand-facets');
performLateBinding(listingViewModel, 'category-facets');
performLateBinding(listingViewModel, 'price-facet');
performLateBinding(listingViewModel, 'color-facets');
//performLateBindingByClass(productsViewModel, 'brand-checkbox');


var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}