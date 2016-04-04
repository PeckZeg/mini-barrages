function Barrage(timeline, playTime, text) {
    this.timeline = timeline;
    this.playTime = moment.duration(playTime);
    this.text = text;

    this.$el = $('<p />', { class: 'mini-barrage' })
                    .data('mini-barrage', this)
                    .text(this.text);
}

Barrage.prototype.render = function() {
    this.$el.appendTo(this.timeline.$el);

    var canvasWidth = this.timeline.$el.width(),
        canvasHeight = this.timeline.$el.height(),
        top = Math.min(_.random(0, canvasHeight), canvasHeight - this.$el.height());

    this.$el
        .width(this.$el.width())
        .css({
            top: `${top}px`,
            left: `${canvasWidth}px`
        });

    return this.$el;
};

Barrage.prototype.play = function() {
    this.$el.animate({
        left: `-${this.$el.width()}px`
    }, this.timeline.duration, 'linear');
};