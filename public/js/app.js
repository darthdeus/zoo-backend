(function() {

  jQuery(function() {
    var map, paper;
    paper = Raphael('paper', 940, 400);
    map = paper.rect(0, 0, 940, 400);
    map.attr('fill', '#eee');
    map.attr('stroke', 'none');
    return map.click(function(e) {
      var circle;
      circle = paper.circle(e.offsetX, e.offsetY, 10);
      circle.attr('fill', '#333');
      return console.log(e.offsetX, e.offsetY);
    });
  });

}).call(this);
