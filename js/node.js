(function() {
  var node_count = 0;

  window.NodeView = Backbone.View.extend({

    initialize: function(options) {
      this.id = ++node_count;
      this.gps = options.gps;
      this.illustrative = options.illustrative;
      this.x = options.x;
      this.y = options.y;
      this.color = options.color;

      this.drawText();
      this.drawCircle();

      console.log('new node created');
    },

    // Render out the circle's ID
    drawText: function() {
      this.text = this.gps.text(this.options.x + 12,
                                this.options.y - 9,
                                this.id);
    },

    render: function() {
      // TODO - do we actually need a render callback?
      console.log('rendering!');
    },

    // Render out the circle
    drawCircle: function() {
      this.circle = this.gps.circle(this.x, this.y, 10);
      // Since drag callbacks are being invoked in the context
      // of the circle, we need to somehow pass it the text,
      // so that it moves too.
      // TODO - There's probably a better place to put it though
      this.circle.text = this.text;

      this.circle.attr('fill', this.color);
      this.circle.attr('stroke', 'none');
      this.circle.drag(this.move, this.start, this.up);
    },

    // Drag start callback, invoked in context of the circle
    start: function() {
      this.ox = this.attr('cx');
      this.oy = this.attr('cy');
      // TODO - specify easing parameter
      // http://raphaeljs.com/reference.html#Raphael.easing_formulas
      this.animate({ r: 11, opacity: 0.25 }, 100);
    },

    // Drag move callback, invoked in context of the circle
    move: function(dx, dy) {
      this.attr({
        cx: this.ox + dx,
        cy: this.oy + dy
      });
      this.text.attr({
        x: this.ox + dx + 12,
        y: this.oy + dy - 9
      });
    },

    // Drag up callback, invoked in context of the circle
    up: function() {
      // TODO - specify easing parameter
      // http://raphaeljs.com/reference.html#Raphael.easing_formulas
      this.animate({ r: 10, opacity: 1 }, 100);
    },


  });

  window.MapView = Backbone.View.extend({

    // options:
    //    id     - the canvas element id
    //    width  - width of the canvas
    //    height - height of the canvas
    initialize: function(options) {
      if (   typeof options.id === "undefined"
          || typeof options.width === "undefined"
          || typeof options.height === "undefined") {
        throw "Incomplete params given to the MapView";
      }

      this.paper = Raphael(options.id, options.width, options.height);
      this.background = this.paper.rect(0, 0, options.width, options.height);
      this.background.attr('fill', '#eee');
      this.background.attr('stroke', 'none');
      var self = this;
      this.background.click(function(e) {
        // `this` is the background here
        var node = new window.NodeView({
          // However we can still reference it's paper ...
          // which points to the same instance as self.paper
          gps: this.paper,
          x: e.offsetX,
          y: e.offsetY,
          color: '#666'
        });

      });
    },

  });

}).call(this);

$(function() {
  // var gps_paper = Raphael('gps_map', 940, 400);

  // var gps_map = gps_paper.rect(0, 0, 940, 400);
  // gps_map.attr('fill', '#eee');
  // gps_map.attr('stroke', 'none');
  // gps_map.click(function(e) {
  //   var node = new window.NodeView({
  //     gps: gps_paper,
  //     x: e.offsetX,
  //     y: e.offsetY,
  //     color: '#666'
  //   });
  // });

  gps = new window.MapView({
    id: 'gps_map',
    width: 940,
    height: 400
  });


  // target_paper = Raphael 'target_map', 940, 400

  // target_map = target_paper.rect 0, 0, 940, 400
  // target_map.attr 'fill', '#eee'
  // target_map.attr 'stroke', 'none'
  // target_map.click (e) ->
  //   node = new Node(gps_paper, target_paper, color)
  //   node.draw_both(e.offsetX, e.offsetY)
  //   nodes.push node
});
