jQuery ->

  paper = Raphael 'paper', 940, 400

  map = paper.rect 0, 0, 940, 400
  map.attr 'fill', '#eee'
  map.attr 'stroke', 'none'
  map.click (e) ->
    circle = paper.circle e.offsetX, e.offsetY, 10
    circle.attr 'fill', '#333'
    console.log e.offsetX, e.offsetY


