function barChart(selector, request) {
  let dataOptions = {min: 1, max: 90, limit: 10};
  const margin = {top: 40, bottom: 120, left: 30, right: 20};
  const width = 950 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  let initialized = false;
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
    .text("Goals per Country");


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

    d3.json('http://localhost:7878/soccer/' + request + '?minuteMin=' + minMinute + '&minuteMax=' + maxMinute + '&limit=' + limit, function(data) {
      svg.selectAll("g text, g .axis, .bar").remove();

      console.log('goals', data);
      draw(data);

      initialized = true;
    });
  };

  function draw(data) {
    let maxValue = d3.max(data, function(d) { return d.count; });

    x.domain(data.map(function(d) { return d.count_name; }));
    if (!initialized || true) {
      y.domain([maxValue, 0]);
    }
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

    const rect = g.selectAll('.bar').data(data, (d) => d.count_name);
    const rect_enter = rect.enter().append('rect')
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.count_name); })
      .attr("y", function(d) {
         if(!initialized)
            return height;
          return y(d.count);
      })
      .attr("width", x.bandwidth())
      .attr('height', function(d) {
         if(!initialized)
            return 0;
          return height - y(d.count);
      })
      .on("mouseover", function(d) {
        d3.select(this).style("fill", "green");
      })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", function(d){
          return colorScale(d.cr);
        })
      })
      .style("fill", function(d){
          return colorScale(d.cr);
      });
      rect_enter.append('title')
        .text(function(d) { return `${d.count_name} - ${d.count}`; });

    rect.merge(rect_enter)
      .transition().duration(1000)
        .attr("x", function(d) { return x(d.count_name); })
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); });

    rect.exit().remove();
  };
};

