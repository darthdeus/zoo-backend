jQuery ->

  color = '#333'

  ($ '.colorpick button').click ->
    color = ($ this).attr('data-color')


  paper = Raphael 'paper', 940, 400

  map = paper.rect 0, 0, 940, 400
  map.attr 'fill', '#eee'
  map.attr 'stroke', 'none'
  map.click (e) ->
    circle = paper.circle e.offsetX, e.offsetY, 10
    circle.attr 'fill', color
    circle.attr 'stroke', 'none'
    console.log e.offsetX, e.offsetY


