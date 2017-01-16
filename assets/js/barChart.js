function barChart(config) {
  let dataOptions = {min: 1, max: 90, limit: 10};
  const margin = {top: 40, bottom: 120, left: 50, right: 20};
  const padding = {top: 0, bottom: 0, left: -120, right: 0};
  const width = config.wid - margin.left - margin.right;
  const height = config.heig - margin.top - margin.bottom;
  const tooltip = d3.tooltip();

  $(document).on('soccer-country-changed soccer-club-changed', function() {
    draw();
  });

  let initialized = false;
  // Creates sources <svg> element
  const svg = d3.select(config.selector).append('svg')
              .attr('width', config.wid)
              .attr('height', height+margin.top+margin.bottom)
              .attr('viewbox', '0 0 100 100')
              .attr('preserveAspectRatio', 'none')
              .style('padding-left', padding.left)
              .style('padding-right', padding.right);
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
    .text(config.title);


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

    d3.json('http://localhost:7878/soccer/' + config.request + '?minuteMin=' + minMinute + '&minuteMax=' + maxMinute + '&limit=' + limit, function(data) {

      console.log(config.request, data);
      draw(data);

      initialized = true;
    });
  };

  function draw(new_data) {

    // Just redraw if no new data is given
    if(!new_data) {
      new_data = data;
    }

    data = new_data;

    svg.selectAll("g.axis text, g.tick text, g .axis").remove();

    let maxValue = d3.max(new_data, function(d) { return d.count; });

    x.domain(new_data.map(function(d) { return d.name; }));
    if (!initialized) {
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

    const rect = g.selectAll('.bar').data(new_data, (d) => d.name);
    const rect_enter = rect.enter().append('rect')
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
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
        d3.select(this).style("fill", "grey");
        tooltip.show(d3.event);
      })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", function(d){
          //return colorScale(d.cr);"#FF8A01"
          return "#FF8A01";
        })
        tooltip.hide();
      })
      .on("mousedown", function(d) {
        if(config.mousedown) {
          config.mousedown(d);
        }
      })
      .style("fill", function(d){
          //return colorScale(d.cr);
          return "#FF8A01";
      })

      rect_enter.append('text')
        

    rect.merge(rect_enter)
      .transition().duration(1000)
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); })
        .style("opacity", (p) => {
          
          if(!config.preventHighlighting) {
            if(window.country) {
              return window.country == p.countryId ? '' : 0.1;
            } else if(window.club) {
              return window.club == p.id ? '' : 0.1;
            }
          }
        })

    rect.merge(rect_enter).select('text').text(function(d) { return `${d.name} - ${d.count}`; })

    rect.exit().remove();
  };
};

