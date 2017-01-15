console.log('GoalBarChart');
function goalBarChart(selector) {
  const margin = {top: 40, bottom: 10, left: 120, right: 20};
  const width = 1500 - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;
  // Creates sources <svg> element
  const svg = d3.select(selector).append('svg')
              .attr('width', width+margin.left+margin.right)
              .attr('height', height+margin.top+margin.bottom);
  // Group used to enforce margin
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
    y = d3.scaleLinear().rangeRound([0, height]);

  var max=20, data = [];
  var colorScale = d3.scaleLinear().domain([0,max]).range(["#FF8A01", "#019DE2"]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  requestData({min: 1, max: 90});

  ObserverManager.register(function(ev, obj) {
      if (ev === 'minuteChanged') {
        requestData(obj);
      }
  });

  function requestData(options) {
    var minMinute = options.min || 1;
    var maxMinute = options.max || 90;

    d3.json('http://localhost:7878/soccer/goalsByCountry?minuteMin=' + minMinute + '&minuteMax=' + maxMinute, function(json) {
      svg.selectAll("g text, g .axis, .bar").remove();

      let data = json.goals;
      console.log(data);
      let maxValue = d3.max(data, function(d) { return d.count; });

      x.domain(data.map(function(d) { return d.count_name; }));
      y.domain([maxValue, 0]);

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
          //.style("fill", function(d){ console.log(d); return colors[Math.floor((d.count/maxValue)*10) - 1]})
          .attr("x", function(d) { return x(d.count_name); })
          .attr("y", function(d) { /*console.log("count", d.count); console.log("y()", height - y(d.count));*/ return y(d.count); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.count); })
          .style("fill", function(d){
              return colorScale(d.cr);
          })
          .on("mouseover", function(d) {
            d3.select(this).style("fill", "green");
          })
          .on("mouseout", function(d) {
            d3.select(this).style("fill", function(d){
              return colorScale(d.cr);
            })
          })
          .append("title")
            .text(function(d) { return `${d.count_name} - ${d.count}`; });
    });
  };
};
