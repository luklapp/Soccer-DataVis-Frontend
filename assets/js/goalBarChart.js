console.log('GoalBarChart');
(function() {
  const margin = {top: 40, bottom: 10, left: 120, right: 20};
  const width = 1500 - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;
  // Creates sources <svg> element
  const svg = d3.select('#goal-bar-chart').append('svg')
              .attr('width', width+margin.left+margin.right)
              .attr('height', height+margin.top+margin.bottom);
  // Group used to enforce margin
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var colors = ["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c","#ffff8c"];


  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json('http://localhost:7878/soccer/goalsByClub', function(json) {
    let data = json.goals;
    let maxValue = d3.max(data, function(d) { return d.count; });

    x.domain(data.map(function(d) { return d.club_name; }));
    y.domain([0, maxValue]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "s"))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Count");

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .style("fill", function(d){ console.log(Math.floor((d.count/maxValue)*10)); return colors[Math.floor((d.count/maxValue)*10) - 1]})
        .attr("x", function(d) { return x(d.club_name); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); });
  });
})();
