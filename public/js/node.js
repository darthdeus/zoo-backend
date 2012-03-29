(function() {

  // Simple autoincrement ID for the nodes.
  var node_count = 0;

  // View for a single node. It can render itself to an arbitrary number
  // of MapViews, provided that they're passed in the options hash to the constructor.
  window.NodeView = Backbone.View.extend({

    // NodeView is expecting to recieve an array of `maps`,
    // which it later uses to render out it's nodes.
    initialize: function(options) {
      // Every time a node is created, it gets a new ID.
      this.id = ++node_count;

      this.x = options.x;
      this.y = options.y;
      this.color = options.color;
      // Each NodeView needs to render it's node and id label to multiple maps,
      // that's why it gets all of them passed in the options hash.
      this.maps = options.maps;

      this.drawText();
      this.drawCircle();

      console.log('new node created');
    },

    toJSON: function() {
      var grouped =  window.g = _.groupBy(this.maps, function(map) {
        return (map.options.primary ? 'primary' : 'secondary');
      });

      primary = window.p = _.first(grouped.primary);
      secondary = window.s = _.first(grouped.secondary);

      return {
        primary: {
          x: primary.circle.attr('cx'),
          y: primary.circle.attr('cy')
        },
        secondary: {
          x: secondary.circle.attr('cx'),
          y: secondary.circle.attr('cy')
        }
      };
    },

    // Render out the circle's ID
    drawText: function() {
      // Since there are multiple maps, we render out the text to each one of them.
      this.maps.forEach(function(map) {
        map.text = map.paper.text(this.options.x + 12,
                                  this.options.y - 9,
                                  this.id);
        // Since forEach changes context, we need to pass this to perserve it.
      }, this);
    },

    render: function() {
      // TODO - do we actually need a render callback?
      console.log('rendering!');
    },

    // Render out the circle
    drawCircle: function() {
      // Since there are multiple maps, we render out the circle to each one of them.
      this.maps.forEach(function(map) {
        map.circle = map.paper.circle(this.x, this.y, 10);

        // Since drag callbacks are being invoked in the context
        // of the circle, we need to somehow pass it the text,
        // so that it moves too.
        // TODO - There's probably a better place to put it though
        map.circle.text = map.text;

        map.circle.attr('fill', this.color);
        map.circle.attr('stroke', 'none');
        map.circle.drag(this.move, this.start, this.up);
        // Since forEach changes context, we need to pass this to perserve it.
      }, this);
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

  // View for a single Map. The app should be able to handle
  // arbitrary number of MapViews and render nodes to all of them.
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
      this.mapping = options.mapping;
      this.options = options;

      // We push ourselves into the mapping, so that it can
      // handle events.
      this.mapping.maps.push(this);

      this.drawPaper(options);
    },

    // Create a Raphael paper for given options.
    // It also renders out a background color rectangle
    // and delegates it's click events to the mapping aggregator.
    drawPaper: function(options) {
      // Each MapView has it's own paper to draw on.
      // Be sure to reference the paper when drawing,
      // instead of the view itself. (can cause errors like "no method text()" etc..)
      this.paper = Raphael(options.id, options.width, options.height);

      // Draw a basic rectangle for the background.
      // TODO - Add rendering of the map image
      this.background = this.paper.rect(0, 0, options.width, options.height);
      this.background.attr('fill', '#eee');
      this.background.attr('stroke', 'none');

      var self = this;
      this.background.click(function(e) {
        // `this` is the background here,
        // that's why we're perserving context via self
        self.mapping.trigger('clicked', e, this);
      });
    }

  });

  // Implementation of the aggregator pattern to manage multiple MapViews and their events
  // (http://lostechies.com/derickbailey/2011/07/19/references-routing-and-the-event-aggregator-coordinating-views-in-backbone-js/)
  window.Mapping = Backbone.View.extend({

    initialize: function() {
      this.on('clicked', this.addNode, this);
      // A list of map views. Each MapView is passed a reference
      // to the mapping object and injects itself into the maps array.
      this.maps = [];
      // A list of nodes that are created
      this.nodes = [];
    },

    // Render a new node of given color for the triggered mouse event.
    addNode: function(e, color) {
      var node = new window.NodeView({
        // We're passing all of the map views here.
        // Maybe use a function with a closure instead,
        // to ensure lazy evalutaion?
        maps: this.maps,
        x: e.offsetX,
        y: e.offsetY,
        color: '#666'
      });
      this.nodes.push(node);
    },

    toJSON: function() {
      return _.map(this.nodes, function(node) { return node.toJSON(); });
    }

  });

}).call(this);

$(function() {

  // Global mapping to manage all MapViews
  var mapping = new window.Mapping();

  // For in-browser console debugging
  window.mapping = mapping;

  // Original GPS map imported from OSM
  var gps = new window.MapView({
    id: 'gps_map',
    width: 940,
    height: 400,
    mapping: mapping,
    primary: true
  });

  // Target map
  var illustrative = new window.MapView({
    id: 'target_map',
    width: 940,
    height: 400,
    mapping: mapping
  });

});
