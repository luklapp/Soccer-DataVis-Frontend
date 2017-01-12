  const margin = {top: 40, bottom: 10, left: 120, right: 20};
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  // Creates sources <svg> element
  const svg = d3.select('body').append('svg')
              .attr('width', width+margin.left+margin.right)
              .attr('height', height+margin.top+margin.bottom);
  // Group used to enforce margin
  const g = svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);
  // Global variable for all data
  var data;
  const bar_height = 50;
  /////////////////////////
  // TODO create an x and y scale and axis
  // x a lienar scale with range: [0, width] and domain from 0 max temperature
  // y a band ordinal scale range: [0, height] and domain the different cities
  d3.json('http://localhost:7878/soccer/cardsAndGoals', function(json) {

    console.log(json);

    data = json.goals;
    update(data);
  });
  function update(new_data) {
    // Render the chart with new data
    // DATA JOIN
    const rect = g.selectAll('rect').data(new_data);
    // ENTER
    // new elements
    const rect_enter = rect.enter().append('rect')
      .attr('x', 0)
    rect_enter.append('title');
    // ENTER + UPDATE
    // both old and new elements
    rect.merge(rect_enter)
      .attr('height', bar_height)
      .attr('width', (d) => d * 7)
      .attr('y', (d, i) => i*(bar_height+5));
      rect.merge(rect_enter).select('title').text((d) => d.location.city);
      // EXIT
      // elements that aren't associated with data
      rect.exit().remove();
  }