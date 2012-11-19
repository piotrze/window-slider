(($) -> $.widget "ui.windowSlider", $.ui.slider,
  options:
    totalMin: 0
    totalMax: 400

  _create: ->
    @_super('_create')
    @options.min += -1
    @options.totalMin += -1
    @windowSize = @options.max - @options.min

  _slide: (event, index, newValue) ->
    console.log("val: #{@value()}, newVal: #{newValue}")
    oldValue = @value()
    @_super(event, index, newValue)
    unless @movingWindowIntervalId
      if (newValue == @options.max) || (newValue == @options.min && oldValue != 0)
        @change = if newValue == @options.max
          1
        else if newValue == @options.min
          -1

        console.log("extremum: #{@change}")
        @movingWindowIntervalId = setInterval(
          => @moveWindow(@change)
        , 500)
        @element.find('a').addClass('growing')

    else
      if @options.min < newValue < @options.max
        @stopMovingWindow()
        @moveMarkerFromGrowingPosition()
    
    return @options.min < newValue < @options.max

  _stop: (event, index) ->
    @_super('_stop', event, index)

    if @movingWindowIntervalId
      @stopMovingWindow()
      @moveMarkerFromGrowingPosition()

      this._trigger( "slide", event, value: @value())
    console.log("stop: #{@value()}")


  _setOption: (key, value) ->
    switch(key)
      when "reset" then @reset()
      when "value" then @setValue(value)
      else
        @_super("_setOption", key, value)




  stopMovingWindow: ->
    console.log('clearinginterval')
    clearInterval(@movingWindowIntervalId)
    @movingWindowIntervalId = null

  moveWindow: (interval) ->
    if @isWindowInRange(interval)
      console.log("move window #{interval}")
      @options.max += interval
      @options.min += interval
      value = if interval > 0 then @options.max else @options.min
      @setValueInSlider(value)
      this._trigger( "slide", event, value: value)
      console.log("new min: #{@options.min},  max: #{@options.max}")

  setValueInSlider: (value) ->
    @options.value = value
    @options.min =  if value != 0 then @options.min else 0
    @_refreshValue()

  moveMarkerFromGrowingPosition: ->
    @options.min += @change
    @options.max += @change
    console.log("premin: #{@options.min}, max: #{@options.max}, change: #{@change}")
    @makeSureWheaterWindowMetsGlobalMinMax()
    if @options.value == @options.totalMin
      @options.value = @options.totalMin + 1
    else if @options.value == @options.totalMax
      @options.value = @options.totalMax - 1
    console.log("min: #{@options.min}, max: #{@options.max}, change: #{@change}")
    @element.find('a').removeClass('growing')
    @_refreshValue()


  isWindowInRange: (change) ->
    if change > 0
      @options.max < @options.totalMax
    else
      @options.min > @options.totalMin





  reset: ->
    @setValue(0)

  setValue: (value) ->
    unless @options.min < value < @options.max
      @options.max = value + Math.round(@windowSize/2)
      @options.min = @options.max - @windowSize
      @makeSureWheaterWindowMetsGlobalMinMax()
    @setValueInSlider(value)

  makeSureWheaterWindowMetsGlobalMinMax: () ->
    if @options.max > @options.totalMax
      @options.max = @options.totalMax
      @options.min = @options.max - @windowSize
    else if @options.min < @options.totalMin
      @options.min = @options.totalMin
      @options.max = @options.min + @windowSize
)(jQuery)
