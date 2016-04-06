'use strict';

;(function (moduleFunc) {
    if (typeof define === 'function' && define.amd) {
        define('jquery.fn.miniBarrages', ['jquery', 'lodash', 'moment'], moduleFunc);
    } else {
        moduleFunc(jQuery, _, moment);
    }
})(function ($, _, moment) {
    function Barrage(timeline, playTime, text) {
        this.timeline = timeline;
        this.playTime = moment.duration(playTime);
        this.text = text;

        this.$el = $('<p />', { class: 'mini-barrage' }).data('mini-barrage', this).text(this.text);
    }

    Barrage.prototype.render = function () {
        this.$el.appendTo(this.timeline.$el);

        var canvasWidth = this.timeline.$el.width(),
            canvasHeight = this.timeline.$el.height(),
            top = Math.min(_.random(0, canvasHeight), canvasHeight - this.$el.height());

        this.$el.width(this.$el.width()).css({
            top: top + 'px',
            left: canvasWidth + 'px'
        });

        return this.$el;
    };

    Barrage.prototype.play = function () {
        this.$el.animate({
            left: '-' + this.$el.width() + 'px'
        }, this.timeline.duration, 'linear');
    };
    function Timeline(el, duration, barrages, opts) {
        var timeline = this;

        this.$el = $(el);

        //  弹幕持续时间（时间线市场）
        duration = moment.duration(duration);
        this.duration = +duration ? +duration : +moment.duration('00:01:00');

        //  自动播放
        this.autoplay = _.get(opts, 'autoplay', false);

        //  循环次数
        this.loop = _.get(opts, 'loop', 0);

        //  弹幕列表
        this.barrages = _.chain(barrages).groupBy(function (barrage) {
            return +moment.duration(barrage.playTime);
        }).mapValues(function (barrages) {
            return _.map(barrages, function (barrage) {
                return new Barrage(timeline, barrage.playTime, barrage.text);
            });
        }).value();

        //  渲染时间间隔
        this.timeInterval = parseInt(_.get(opts, 'timeInterval'));
        this.timeInterval = isNaN(this.timeInterval) ? 200 : this.timeInterval;

        if (this.autoplay) this.play();

        // console.log(this)
    }

    //  播放弹幕
    Timeline.prototype.play = function (startTime) {
        var _this = this;

        this._current = +moment.duration(startTime);

        this._timer = _.delay(function () {
            if (_this._current <= _this.duration) {
                var next = _this._current + _this.timeInterval;

                _this.render(_this._current, next < _this.duration ? next : _this.duration);
                _this._current = next;
                _this.play(_this._current);
            } else {
                _this._timer = null;
                _this._current = 0;
            }

            if (_this.loop == 0 && !_this._timer) {
                _this.play();
            }
        }, this.timeInterval);
    };

    //  过滤出 begin ~ end 的弹幕
    Timeline.prototype.filter = function (begin, end) {
        return _.chain(this.barrages).filter(function (barrage, playTime) {
            playTime = parseInt(playTime);
            return playTime >= begin && playTime < end;
        }).flatten().value();
    };

    //  渲染时间线
    Timeline.prototype.render = function (begin, end) {
        var barrages = this.filter(begin, end);

        _.each(barrages, function (barrage) {
            barrage.render();
            barrage.play();
        });

        // console.log(barrages)
    };
    // function getPositions(el) {
    //     var $el = $(this),
    //         pos = $el.position()
    // }
    $.fn.miniBarrages = function (opts) {
        var duration = _.get(opts, 'duration'),
            barrages = _.get(opts, 'barrages');

        this.each(function () {
            var $el = $(this).addClass('mini-barrages-canvas');

            $el.data('mini-barrages', new Timeline(this, duration, barrages, opts));
        });

        // var timeline = new Timeline();
    };
});
//# sourceMappingURL=mini-barrages.js.map
