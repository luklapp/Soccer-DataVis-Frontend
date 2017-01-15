console.log('CardBarChart');
function cardBarChart(selector) {
  let dataOptions = {min: 1, max: 90, limit: 20};
  const margin = {top: 40, bottom: 120, left: 50, right: 20};
  const width = 950 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
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

  //Title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Cards per Country");

  requestData(dataOptions);

  ObserverManager.register(function(ev, obj) {
      if (ev === 'minuteChanged') {
        for (let o in dataOptions) {
          console.log(o);
          if(obj[o]) {
            if(dataOptions[o] !== obj[o]) {
              dataOptions[o] = obj[o];
            }
          }
        }
        requestData(dataOptions);
      }
  });

  function requestData(options) {
    var minMinute = options.min || 1;
    var maxMinute = options.max || 90;
    var limit = options.limit || 'null';

    d3.json('http://localhost:7878/soccer/cardsByCountry?minuteMin=' + minMinute + '&minuteMax=' + maxMinute + '&limit=' + limit, function(json) {
      svg.selectAll("g text, g .axis, .bar").remove();

      let data = json.cards;
      console.log('cards',data);
      let maxValue = d3.max(data, function(d) { return d.count; });

      x.domain(data.map(function(d) { return d.count_name; }));
      y.domain([maxValue, 0]);

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );;

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10, "s"))
        .append("text")
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
