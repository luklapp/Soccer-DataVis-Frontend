/*console.log('Treemap');
function goalTreemap(selector) {
  let dataOptions = {min: 1, max: 90, limit: 20};
  var width = 960,
    height = 1060;

  var format = d3.format(",d");

  var color = d3.scaleOrdinal()
      .range(d3.schemeCategory10
          .map(function(c) { c = d3.rgb(c); c.opacity = 0.6; return c; }));

  var stratify = d3.stratify()
      .parentId(function(d) { //return d.id.substring(0, d.id.lastIndexOf("."));
      });

  var treemap = d3.treemap()
      .size([width, height])
      .padding(1)
      .round(true);

  requestData(dataOptions);
  function requestData(options) {
    var minMinute = options.min || 1;
    var maxMinute = options.max || 90;
    var limit = options.limit || 'null';

    d3.json('http://localhost:7878/soccer/goalsByCountry?minuteMin=' + minMinute + '&minuteMax=' + maxMinute + '&limit=' + limit, function(json) {
      var data = json.goals;
      var root = stratify(data)
      .sum(function(d) { return d.value ? 1 : 0; })
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

      treemap(root);

      d3.select("body")
        .selectAll(".node")
        .data(root.leaves())
        .enter().append("div")
          .attr("class", "node")
          .attr("title", function(d) { return d.id; })
          .style("left", function(d) { return d.x0 + "px"; })
          .style("top", function(d) { return d.y0 + "px"; })
          .style("width", function(d) { return d.x1 - d.x0 + "px"; })
          .style("height", function(d) { return d.y1 - d.y0 + "px"; })
          .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); })
        .append("div")
          .attr("class", "node-label")
          .text(function(d) { //return d.count_name.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n"); 
          return 'Test';
          });
        });
  };

};
*/
