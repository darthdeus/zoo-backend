(function() {

  jQuery(function() {
    var color, map, paper;
    color = '#333';
    ($('.colorpick button')).click(function() {
      return color = ($(this)).attr('data-color');
    });
    paper = Raphael('paper', 940, 400);
    map = paper.rect(0, 0, 940, 400);
    map.attr('fill', '#eee');
    map.attr('stroke', 'none');
    return map.click(function(e) {
      var circle;
      circle = paper.circle(e.offsetX, e.offsetY, 10);
      circle.attr('fill', color);
      circle.attr('stroke', 'none');
      return console.log(e.offsetX, e.offsetY);
    });
  });

}).call(this);
