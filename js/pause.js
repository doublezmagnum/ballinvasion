$(".toggle").click(function(event) {
    event.preventDefault();
    $("div.overlay").fadeToggle("fast");
});