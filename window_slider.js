(function() {

  (function($) {
    return $.widget("ui.windowSlider", $.ui.slider, {
      options: {
        totalMin: 0,
        totalMax: 400
      },
      _create: function() {
        this._super('_create');
        return this.options.windowSize = this.options.max - this.options.min;
      },
      _slide: function(event, index, newValue) {
        var oldValue,
          _this = this;
        console.log("val: " + (this.value()) + ", newVal: " + newValue);
        oldValue = this.value();
        this._super(event, index, newValue);
        if (!this.movingWindowIntervalId) {
          if ((newValue === this.options.max) || (newValue === this.options.min && oldValue !== 0)) {
            this.change = newValue === this.options.max ? 1 : newValue === this.options.min ? -1 : void 0;
            console.log("extremum: " + this.change);
            this.movingWindowIntervalId = setInterval(function() {
              return _this.moveWindow(_this.change);
            }, 500);
            this.element.find('a').addClass('growing');
          }
        } else {
          if ((this.options.min < newValue && newValue < this.options.max)) {
            this.stopMovingWindow();
            this.moveMarkerFromGrowingPosition();
          }
        }
        return (this.options.min < newValue && newValue < this.options.max);
      },
      _stop: function(event, index) {
        console.log('stop');
        this._super('_stop', event, index);
        if (this.movingWindowIntervalId) {
          this.stopMovingWindow();
          this.moveMarkerFromGrowingPosition();
          this._trigger("slide", event, {
            value: this.value()
          });
        }
        return console.log(this.value());
      },
      _setValue: function(key, value) {
        switch (key) {
          case "reset":
            return this.reset();
          default:
            return this._super("_setOption", key, value);
        }
      },
      stopMovingWindow: function() {
        console.log('clearinginterval');
        clearInterval(this.movingWindowIntervalId);
        return this.movingWindowIntervalId = null;
      },
      moveWindow: function(interval) {
        var value;
        if (this.isWindowInRange(interval)) {
          this.options.max += interval;
          this.options.min += interval;
          value = interval > 0 ? this.options.max : this.options.min;
          this.setValueInSlider(value);
          this._trigger("slide", event, {
            value: value
          });
          return console.log("new min: " + this.options.min + ",  max: " + this.options.max);
        }
      },
      setValueInSlider: function(value) {
        this.options.value = value;
        this.options.min = value !== 0 ? this.options.min : 0;
        return this._refreshValue();
      },
      moveMarkerFromGrowingPosition: function() {
        this.options.min += this.change;
        this.options.max += this.change;
        this.options.value = 1;
        this.makeSureWheaterWindowMetsGlobalMinMax();
        this.element.find('a').removeClass('growing');
        return this._refreshValue();
      },
      isWindowInRange: function(change) {
        if (change > 0) {
          return this.options.max < this.options.totalMax;
        } else {
          return this.options.min > this.options.totalMin;
        }
      },
      reset: function() {},
      setValue: function(value) {
        if (!((this.options.min < value && value < this.options.max))) {
          this.options.max = value + Math.round(this.windowSize / 2);
          this.options.min = this.options.max - this.windowSize;
          this.makeSureWheaterWindowMetsGlobalMinMax();
        }
        return this.setValueInSlider(value);
      },
      makeSureWheaterWindowMetsGlobalMinMax: function() {
        if (this.options.max > this.options.totalMax) {
          this.options.max = this.options.totalMax + 1;
          return this.options.min = this.options.max - this.windowSize;
        } else if (this.options.min < this.options.totalMin) {
          this.options.min = this.options.totalMin - 1;
          return this.options.max = this.options.min + this.windowSize;
        }
      }
    });
  })(jQuery);

}).call(this);