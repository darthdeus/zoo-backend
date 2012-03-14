(function() {

  jQuery(function() {
    var color, map, nodes, paper;
    color = '#333';
    nodes = [];
    ($('.colorpick button')).click(function() {
      return color = ($(this)).attr('data-color');
    });
    ($('#dump-json')).click(function() {
      var json, node, _i, _len;
      json = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        json.push("  { x : " + node.x + ", y : " + node.y + ", color : '" + node.color + "' }");
      }
      json = json.join(",\n");
      json = "[\n" + json + "\n]\n";
      ($('#json-output')).html(json);
      return console.log(nodes);
    });
    paper = Raphael('paper', 940, 400);
    map = paper.rect(0, 0, 940, 400);
    map.attr('fill', '#eee');
    map.attr('stroke', 'none');
    return map.click(function(e) {
      var circle;
      nodes.push({
        x: e.offsetX,
        y: e.offsetY,
        color: color
      });
      circle = paper.circle(e.offsetX, e.offsetY, 10);
      circle.attr('fill', color);
      circle.attr('stroke', 'none');
      return console.log(e.offsetX, e.offsetY);
    });
  });

}).call(this);
