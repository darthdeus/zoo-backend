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
    start = ->
      console.log 'drag started'
      @ox = @attr "cx"
      @oy = @attr "cy"
      @animate { r: 15, opacity: .25 }, 200, ">"

    move = (dx, dy) ->
      @attr {cx: @ox + dx, cy: @oy + dy }
      console.log 'moving by', dx, dy

    up = -> @animate { r: 10, opacity: 1 }, 200, ">"

    nodes.push
      x: e.offsetX
      y: e.offsetY
      color: color

    circle = paper.circle e.offsetX, e.offsetY, 10
    circle.attr 'fill', color
    circle.attr 'stroke', 'none'
    circle.drag(move, start, up)
    console.log e.offsetX, e.offsetY


