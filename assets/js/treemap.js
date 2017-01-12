console.log('Treemap');
/*
(function() {
  var data;
  let id = 0;
  
  var width = 960,
      height = 1060;

  var format = d3.format(",d");

  var color = d3.scaleOrdinal()
      .range(d3.schemeCategory10
      .map(function(c) { c = d3.rgb(c); c.opacity = 0.6; return c; }));

  var stratify = d3.stratify()
      .parentId(function(d) { return id++; });

  var treemap = d3.treemap()
      .size([width, height])
      .padding(1)
      .round(true);
  
  d3.json('http://localhost:7878/soccer/cardsByClub', function(json) {
    console.log('json', json);

    data = json.cards;
     var root = stratify(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    console.log('root', root);
    treemap(root);

    let x = 0;
    let y = 0;

    d3.select("#treemap")
      .selectAll(".node")
      .data(root.leaves())
      .enter().append("div")
        .attr("class", "node")
        .attr("title", function(d) { return d.value; })
        .style("left", function(d) { return (x++) + "px"; })
        .style("top", function(d) { return (y++) + "px"; })
        .style("width", function(d) { return x + "px"; })
        .style("height", function(d) { return y + "px"; })
        //.style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); })
      //.append("div")
       // .attr("class", "node-label")
       // .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n"); })
      //.append("div")
     // .attr("class", "node-value")
     // .text(function(d) { return format(d.value); });
    //update(data, width);
  });

  function type(json) {
    let d = json.cards;
    d.value = +d.count;
    return d;
  };
  function update(new_data, width) {
    //update the scales
    xscale.domain([0, d3.max(new_data, (d) => d.count)]);
    yscale.domain(new_data.map((d) => d.club_name));
    //render the axis
    g_xaxis.call(xaxis);
    g_yaxis.call(yaxis);
    
    const rect = g.selectAll('rect').data(new_data);
    // ENTER
    // new elements
    const rect_enter = rect.enter().append('rect')
      .attr('x', 0)
    rect_enter.append('title');
    // ENTER + UPDATE
    // both old and new elements

    rect.merge(rect_enter)
      .attr('height', yscale.bandwidth())
      .attr('width', (d) => xscale(d.count))
      .attr('y', (d, i) => yscale(d.club_name));
      rect.merge(rect_enter).select('title').text((d) => d.club_name);
      // EXIT
      // elements that aren't associated with data
      rect.exit().remove();
  }
})();
*/
