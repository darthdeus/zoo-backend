jQuery ->

  color = '#333'

  nodes = []

  ($ '.colorpick button').click ->
    color = ($ this).attr('data-color')

  ($ '#dump-json').click ->
    json = []
    for node in nodes
      json.push "  { x : #{node.x}, y : #{node.y}, color : '#{node.color}' }"

    json = json.join(",\n")

    json = "[\n" + json + "\n]\n"
    ($ '#json-output').html(json)
    console.log nodes


  paper = Raphael 'paper', 940, 400

  map = paper.rect 0, 0, 940, 400
  map.attr 'fill', '#eee'
  map.attr 'stroke', 'none'
  map.click (e) ->

    nodes.push
      x: e.offsetX
      y: e.offsetY
      color: color

    circle = paper.circle e.offsetX, e.offsetY, 10
    circle.attr 'fill', color
    circle.attr 'stroke', 'none'
    console.log e.offsetX, e.offsetY


