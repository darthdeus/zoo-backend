(function() {

  describe("Node", function() {
    return it("exists", function() {
      var node;
      node = new Node();
      return (expect(node)).toBeTruthy();
    });
  });

}).call(this);
