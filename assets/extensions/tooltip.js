d3.tooltip = function() {

    var content = '',
        $container = $('<div class="tooltip hidden"></div>');

    $('body').append($container);

    function tooltip() {}

    tooltip.show = function(event) {

        $container.toggleClass('hidden', false);
        $container.html(event.target.textContent);

        $container.css({
            top: event.pageY - $container.outerHeight() - 20,
            left: event.pageX - $container.outerWidth()/2
        });

    }

    tooltip.hide = function() {
        $container.toggleClass('hidden', true);
    }

    return tooltip;

}