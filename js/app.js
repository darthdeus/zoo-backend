(function() {

  jQuery(function() {
    var Node, color, gps_map, gps_paper, nodes, target_map, target_paper;
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
    window.nodes = nodes;
    Node = (function() {
      var count;

      count = 0;

      function Node(gps_paper, target_paper, color) {
        this.id = count++;
        this.gps_paper = gps_paper;
        this.target_paper = target_paper;
        this.color = color;
      }

      Node.prototype.coords = function() {
        return this.circle;
      };

      Node.prototype.draw_both = function(x, y) {
        this.draw_gps(x, y);
        return this.draw_target(x, y);
      };

      Node.prototype.draw_gps = function(x, y) {
        return this.draw(x, y, this.gps_paper);
      };

      Node.prototype.draw_target = function(x, y) {
        return this.draw(x, y, this.target_paper);
      };

      Node.prototype.draw = function(x, y, paper) {
        var move, start, text, up;
        this.x = x;
        this.y = y;
        this.circle = paper.circle(this.x, this.y, 10);
        this.circle.attr('fill', this.color);
        this.circle.attr('stroke', 'none');
        this.text = paper.text(this.x, this.y, this.id);
        this.text.attr('fill', 'white');
        window.text = this.text;
        start = function() {
          this.ox = this.attr("cx");
          this.oy = this.attr("cy");
          return this.animate({
            r: 15,
            opacity: .25
          }, 200, ">");
        };
        up = function() {
          return this.animate({
            r: 10,
            opacity: 1
          }, 200, ">");
        };
        text = this.text;
        move = function(dx, dy) {
          this.attr({
            cx: this.ox + dx,
            cy: this.oy + dy
          });
          return text.attr({
            x: this.ox + dx,
            y: this.oy + dy
          });
        };
        return this.circle.drag(move, start, up);
      };

      return Node;

    })();
    gps_paper = Raphael('gps_map', 940, 400);
    gps_map = gps_paper.rect(0, 0, 940, 400);
    gps_map.attr('fill', '#eee');
    gps_map.attr('stroke', 'none');
    gps_map.click(function(e) {
      var node;
      node = new Node(gps_paper, target_paper, color);
      node.draw_both(e.offsetX, e.offsetY);
      return nodes.push(node);
    });
    target_paper = Raphael('target_map', 940, 400);
    target_map = target_paper.rect(0, 0, 940, 400);
    target_map.attr('fill', '#eee');
    target_map.attr('stroke', 'none');
    return target_map.click(function(e) {
      var node;
      node = new Node(gps_paper, target_paper, color);
      node.draw_both(e.offsetX, e.offsetY);
      return nodes.push(node);
    });
  });

}).call(this);
