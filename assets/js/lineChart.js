function lineChart(elementId) {

  const margin = {top: 40, bottom: 10, left: 120, right: 20};
  const padding = {top: 0, bottom: 0, left: 50, right: 50};
  const width = 800 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const tooltip = d3.tooltip();

  // Creates sources <svg> element
  const svg = d3.select(elementId).append('svg')
              .attr('width', '100%')//width+margin.left+margin.right)
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
  var data,
      minuteMin = 0,
      minuteMax = 90;

  const bar_height = 50;
  /////////////////////////
  // TODO create an x and y scale and axis
  // x a lienar scale with range: [0, width] and domain from 0 max temperature
  // y a band ordinal scale range: [0, height] and domain the different cities
  d3.json('http://localhost:7878/soccer/cardsAndGoals', function(json) {
    data = json;
    update(data);
  });

  d3.select(window).on("resize", function() {
    update(data);
  });

  function getWidth() {
    return $(elementId).width() - padding.left - padding.right;
  }

  // Scales setup
  const xscale = d3.scaleLinear().domain([0, 90]).range([0, getWidth()]);
  const yscale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

  // Axis setup
  const xaxis = d3.axisBottom().scale(xscale);
  const yaxis = d3.axisLeft().scale(yscale);

  const g_xaxis = g.append('g').attr('class','x axis').attr('transform', `translate(0, ${height})`);
  const g_yaxis = g.append('g').attr('class','y axis');

  g_yaxis.call(yaxis);

  function drawMinuteSelectors() {
    svg.selectAll('line.minute-slider').remove();

    let lineMinuteMin = svg.append("line")
    .attr("x1", xscale(minuteMin || 0))
    .attr("y1", 0)
    .attr("x2", xscale(minuteMin || 0))
    .attr("y2", height)
    .attr("class", "minute-slider min")
    .style("stroke-width", 5)
    .style("stroke", "blue")
    .style("fill", "none");

    let lineMinuteMax = svg.append("line")
    .attr("x1", xscale(minuteMax || 90))
    .attr("y1", 0)
    .attr("x2", xscale(minuteMax || 90))
    .attr("y2", height)
    .attr("class", "minute-slider max")
    .style("stroke-width", 5)
    .style("stroke", "red")
    .style("fill", "none");

function started() {
  var circle = d3.select(this).classed("dragging", true);
  svg.classed("dragging", true);

  d3.event.on("drag", dragged).on("end", ended);

  function dragged(d) {
    if(xscale.invert(d3.event.x) >= 0 && xscale.invert(d3.event.x) <= 90) {
      circle.raise().attr("x1", d3.event.x).attr("x2", d3.event.x);
    }
  }

  function ended() {
    let minuteNew = Math.round(xscale.invert(d3.event.x));

    if(minuteNew < 0) {
      minuteNew = 0;
    } else if(minuteNew > 90) {
      minuteNew = 90;  
    }

    if(circle.classed("min")) {
      if(minuteNew >= minuteMax) minuteNew = minuteMax - 1;
      minuteMin = minuteNew;
    } else {
      if(minuteNew <= minuteMin) minuteNew = minuteMin + 1;
      minuteMax = minuteNew;
    }

    drawMinuteSelectors();

    ObserverManager.notify('minuteChanged', {min: minuteMin, max: minuteMax});

    circle.classed("dragging", false);
    svg.classed("dragging", false);
  }

}

d3.selectAll("line.minute-slider").call(d3.drag().on("start", started));


  }

  function update(new_data) {
    // Remove all points and paths from the chart (update on resize)
    svg.selectAll("g circle, path, text.axis").remove();

    let goals = new_data.goals;
    let cards = new_data.cards;

    drawMinuteSelectors();

    const maxY = d3.max([ d3.max(goals, (d) => d.count), d3.max(cards, (d) => d.count) ]);

    xscale.range([0, getWidth()]);
    yscale.domain([0, maxY]);
    
    // Render the axis
    g_xaxis.call(xaxis);
    g_yaxis.call(yaxis);

    // text label for the x axis
    svg.append("text")             
        .attr("transform",
              "translate(" + (getWidth()/2) + " ," + 
                             (height+margin.top - 10) + ")")
        .attr("class", "axis")
        .style("text-anchor", "middle")
        .text("Minute");


    const rect = g.selectAll('circle').data(goals, (d) => d.count);
    const rect2 = g.selectAll('circle').data(cards, (d) => d.count);

    var lineFunction = d3.line()
                          .x(function(d) { return xscale(d.goal_min || d.card_min || 0); })
                          .y(function(d) { return yscale(d.count); })

    // ENTER
    // new elements
    const rect_enter = rect.enter().append('circle')
      .attr('x', 0)
    rect_enter.append('text');

    const rect_enter2 = rect2.enter().append('circle')
      .attr('x', 0)
    rect_enter2.append('text');

    // ENTER + UPDATE
    // both old and new elements

    svg.append("path")
      .attr("d", lineFunction(goals))
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    svg.append("path")
      .attr("d", lineFunction(cards))
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    rect.merge(rect_enter)
      .attr('cx', (d, i) => xscale(d.goal_min))
      .attr('cy', (d, i) => yscale(d.count))
      .attr("r", "10px")
      .attr("fill", "transparent")
      .on('mouseover', () => {
        tooltip.show(d3.event);
      })
      .on('mouseout', () => {
        tooltip.hide();
      });

    rect2.merge(rect_enter2)
      .attr('cx', (d, i) => xscale(d.card_min))
      .attr('cy', (d, i) => yscale(d.count))
      .attr("r", "10px")
      .attr("fill", "transparent")
      .on('mouseover', () => {
        tooltip.show(d3.event);
      })
      .on('mouseout', () => {
        tooltip.hide();
      });

      rect.merge(rect_enter).select('text').text((d) => `${d.goal_min}. Minute (${d.count} Tore)`);
      rect2.merge(rect_enter2).select('text').text((d) => `${d.card_min}. Minute (${d.count} Karten)`);
      // EXIT
      // elements that aren't associated with data
      rect.exit().remove();
      rect2.exit().remove();
  }

}
