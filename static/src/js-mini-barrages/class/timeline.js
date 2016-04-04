function Timeline(el, duration, barrages, opts) {
    var timeline = this;

    this.$el = $(el);

    //  弹幕持续时间（时间线市场）
    duration = moment.duration(duration);
    this.duration = +duration ? +duration : +moment.duration('00:01:00');

    //  自动播放
    this.autoplay = _.get(opts, 'autoplay', true);

    //  循环次数
    this.loop = _.get(opts, 'loop', 0);

    //  弹幕列表
    this.barrages = _.chain(barrages).groupBy((barrage) => {
        return +moment.duration(barrage.playTime);
    }).mapValues((barrages) => {
        return _.map(barrages, (barrage) => {
            return new Barrage(timeline, barrage.playTime, barrage.text);
        });
    }).value();

    //  渲染时间间隔
    this.timeInterval = 200;

    if (this.autoplay) this.play();

    console.log(this)
}

//  播放弹幕
Timeline.prototype.play = function(startTime) {
    this._current = +moment.duration(startTime);

    this._timer = _.delay(() => {
        if (this._current <= this.duration) {
            var next = this._current + this.timeInterval;

            this.render(this._current, next < this.duration ? next : this.duration);
            this._current = next;
            this.play(this._current);
        }

        else {
            this._timer = null;
            this._current = 0;
        }


        if (this.loop == 0 && !this._timer) {
            this.play();
        }
    }, this.timeInterval);
};

//  过滤出 begin ~ end 的弹幕
Timeline.prototype.filter = function(begin, end) {
  return _.chain(this.barrages).filter(function(barrage, playTime) {
    playTime = parseInt(playTime);
    return playTime >= begin && playTime < end;
  }).flatten().value();
};

//  渲染时间线
Timeline.prototype.render = function(begin, end) {
    var barrages = this.filter(begin, end);

    _.each(barrages, (barrage) => {
        barrage.render();
        barrage.play();
    });

    // console.log(barrages)
};