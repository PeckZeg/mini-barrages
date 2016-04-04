function extendJQueryFn($) {
    $.fn.miniBarrages = function(opts) {
        var duration = _.get(opts, 'duration'),
            barrages = _.get(opts, 'barrages');

        this.each(function() {
            var $el = $(this).addClass('mini-barrages-canvas');

            $el.data('mini-barrages', new Timeline(this, duration, barrages, opts));
        });

        // var timeline = new Timeline();
    };
};


if (typeof define === 'function' && define.amd) {
    define('jquery.fn.miniBarrages', ['jquery'], extendJQueryFn);
}

else {
    extendJQueryFn($);
}