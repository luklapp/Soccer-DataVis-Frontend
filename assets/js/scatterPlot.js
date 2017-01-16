function scatterPlot(elementId) {

  const margin = {top: 40, bottom: 10, left: 120, right: 20};
  const padding = {top: 0, bottom: 0, left: 50, right: 50};
  const width = 800 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  
  // Creates sources <svg> element
  const svg = d3.select(elementId).append('svg')
              .attr('width', '100%')
              .attr('height', height+margin.top+margin.bottom)
              .attr('viewbox', '0 0 100 100')
              .attr('preserveAspectRatio', 'none')
              .style('padding-left', padding.left)
              .style('padding-right', padding.right);

  // Group used to enforce margin
  const g = svg.append('g')
              .attr('transform', 'scale(1, 1)')
              .attr('class', 'points');

  // Global variable for all data
  var data = [],
      minuteMin = 0,
      minuteMax = 90,
      initialized = false;

  const radius = 3;

  d3.select(window).on("resize", function() {
    update(data);
  });

  function getWidth() {
    return $(elementId).width() - padding.left - padding.right;
  }

  // Scales setup
  const xscale = d3.scaleLinear().domain([0, 0]).range([0, getWidth()]);
  const yscale = d3.scaleLinear().domain([0, 0]).range([height, 0]);

  // Axis setup
  const xaxis = d3.axisBottom().scale(xscale);
  const yaxis = d3.axisLeft().scale(yscale);

  const g_xaxis = g.append('g').attr('class','x axis').attr('transform', `translate(0, ${height})`);
  const g_yaxis = g.append('g').attr('class','y axis');

  g_xaxis.call(xaxis);
  g_yaxis.call(yaxis);

  function update(new_data) {

    // Remove all points and paths from the chart (update on resize)
    svg.selectAll("text.axis").remove();

    let minCards = d3.min(new_data, (o) => o.avgCards);
    let minGoals = d3.min(new_data, (o) => o.avgGoals);
    let maxCards = d3.max(new_data, (o) => o.avgCards);
    let maxGoals = d3.max(new_data, (o) => o.avgGoals);

    // Update width (responsive)
    xscale.range([0, getWidth()]);

    if(!initialized) {
      xscale.domain([0, maxCards]);
      yscale.domain([0, maxGoals]);
      initialized = true;
    }

    // Render the axis
    g_xaxis.call(xaxis);
    g_yaxis.call(yaxis);

    // text label for the x axis
    svg.append("text")             
        .attr("transform",
              "translate(" + (getWidth()/2) + " ," + 
                             (height+margin.top+margin.bottom) + ")")
        .attr("class", "axis")
        .style("text-anchor", "middle")
        .text("Cards per Match");
    

    const points = g.selectAll('circle').data(new_data, (d) => d.clubId);

    // ENTER
    // new elements
    const rect_enter = points.enter().append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
    rect_enter.append('title');

    // ENTER + UPDATE
    // both old and new elements

    points.merge(rect_enter).transition()
      .attr('cx', (d, i) => xscale(d.avgCards || 0))
      .attr('cy', (d, i) => yscale(d.avgGoals || 0))
      .attr("r", `${radius}px`)
      .attr("fill", "green");

      points.merge(rect_enter).select('title').text((d) => `${d.club_name}`);

      // EXIT
      // elements that aren't associated with data
      points.exit().remove();
  }

  function getData() {

    let url = `http://localhost:7878/soccer/avgGoalsCards?minuteMin=${minuteMin}&minuteMax=${minuteMax}`;

    d3.json(url, function(json) {
      data = json;
      update(data);
    });
  }

  ObserverManager.register(function(ev, obj) {
    minuteMin = obj.min;
    minuteMax = obj.max;
    getData();
  });

  // Init
  getData();

}