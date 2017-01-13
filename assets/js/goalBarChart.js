console.log('GoalBarChart');
(function() {
  const margin = {top: 40, bottom: 10, left: 120, right: 20};
  const width = 1000 - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;
  // Creates sources <svg> element
  const svg = d3.select('#treemap').append('svg')
              .attr('width', width+margin.left+margin.right)
              .attr('height', height+margin.top+margin.bottom);
  // Group used to enforce margin
  const g = svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);
  // Global variable for all data
  var data;
  
  // Scales setup
  const xscale = d3.scaleLinear().range([0, width]);
  const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);
  // Axis setup
  const xaxis = d3.axisTop().scale(xscale);
  const g_xaxis = g.append('g').attr('class','x axis');
  const yaxis = d3.axisLeft().scale(yscale);
  const g_yaxis = g.append('g').attr('class','y axis');
  const bar_height = 50;
  
  d3.json('http://localhost:7878/soccer/goalsByClub', function(json) {
    console.log('json', json);

    data = json.goals;
    update(data, width);
  });
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
