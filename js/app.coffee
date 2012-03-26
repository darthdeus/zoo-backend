jQuery ->

  color = '#333'

  nodes = []

  ($ '.colorpick button').click ->
    color = ($ this).attr('data-color')

  ($ '.btn-danger').click()

  ($ '#dump-json').click ->
    json = []
    for node in nodes
      json.push "  { x : #{node.x}, y : #{node.y}, color : '#{node.color}' }"

    json = json.join(",\n")

    json = "[\n" + json + "\n]\n"
    ($ '#json-output').html(json)
    console.log nodes

  window.nodes = nodes


  class Node

    count = 0

    constructor: (gps_paper, target_paper, color) ->
      @id = count++
      @gps_paper = gps_paper
      @target_paper = target_paper
      @color = color

    coords: ->
      @circle

    draw_both: (x, y) ->
      @draw_gps(x, y)
      @draw_target(x, y)

    draw_gps: (x, y) ->
      @draw(x, y, @gps_paper)

    draw_target: (x, y) ->
      @draw(x, y, @target_paper)

    drawCircle: (paper, x, y, color) ->
      circle = paper.circle x, y, 10
      circle.attr 'fill', color
      circle.attr 'stroke', 'none'
      circle

    drawText: (paper, x, y, text) ->
      text = paper.text x + 12, y - 9, text
      text.attr 'fill', '#666'
      text

    draw: (x, y, paper) ->
      @circle = @drawCircle(paper, x, y, @color)
      @text = @drawText(paper, x, y, @id)

      @circle.drag @move, @start, @up

    start: ->
      @ox = @attr "cx"
      @oy = @attr "cy"
      @animate { r: 11, opacity: .25 }, 200, ">"
    up: -> @animate { r: 10, opacity: 1 }, 200, ">"

    # closure for the move function
    # text = @text

    move: (dx, dy) ->
      @attr {cx: @ox + dx, cy: @oy + dy }
      # text.attr {x: @ox + dx + 12, y: @oy + dy - 9 }

  gps_paper = Raphael 'gps_map', 940, 400

  gps_map = gps_paper.rect 0, 0, 940, 400
  gps_map.attr 'fill', '#eee'
  gps_map.attr 'stroke', 'none'
  gps_map.click (e) ->
    node = new Node(gps_paper, target_paper, color)
    node.draw_both(e.offsetX, e.offsetY)
    nodes.push node


  target_paper = Raphael 'target_map', 940, 400

  target_map = target_paper.rect 0, 0, 940, 400
  target_map.attr 'fill', '#eee'
  target_map.attr 'stroke', 'none'
  target_map.click (e) ->
    node = new Node(gps_paper, target_paper, color)
    node.draw_both(e.offsetX, e.offsetY)
    nodes.push node
    # nodes.push
    #   x: e.offsetX
    #   y: e.offsetY
    #   color: color

    # circle = paper.circle e.offsetX, e.offsetY, 10
    # circle.attr 'fill', color
    # circle.attr 'stroke', 'none'
    # circle.drag(move, start, up)
    # console.log e.offsetX, e.offsetY


