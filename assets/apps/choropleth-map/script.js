/*
  References: 
    - https://bl.ocks.org/almccon/410b4eb5cad61402c354afba67a878b8
    - https://bl.ocks.org/wboykinm/dbbe50d1023f90d4e241712395c27fb3
    - https://observablehq.com/@d3/zoom
*/

// Load external county topographical data
d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json').
then(countyInfo => {

  // Load external county-based educational info dataset
  d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json').
  then(eduInfo => {

    let w = 1000, // Width of svg map area
    h = 650, // Height of svg map area
    legendX = w * 0.9225, // X positioning of the legend on map
    legendY = h * 0.35, // Y positioning of the legend on map
    legendH = h / 2, // Height of the legend
    legendBarW = 20, // Width of the legend rect elements
    legendBarH = legendH / 8, // Height of the legend rect elements
    // Lowest and highest values for bachelorsOrHigher in eduInfo dataset
    minEduVal = d3.min(eduInfo, d => d.bachelorsOrHigher),
    maxEduVal = d3.max(eduInfo, d => d.bachelorsOrHigher),
    path = d3.geoPath(), // Path generator for mapping

    // Allow user to zoom with scroll wheel and pan with mouse click & drag
    zoom = d3.zoom().
    extent([[0, 0], [w, h]]).
    scaleExtent([0.99, 8]) // Zoom factor limits
    .on("zoom", function () {
      // If zoomed out to factor of 0.99, reset everything with transition
      if (d3.event.transform.k === 0.99) {
        svg.transition().
        duration(500).
        call(zoom.transform, d3.zoomIdentity.scale(1));
      } else {// Else, zoom in/out regularly
        container.attr("transform", d3.event.transform);
      }
    }),

    // Create svg to hold container that all elements are attached to
    svg = d3.select('#map').
    append('svg').
    attr('width', w).
    attr('height', h).
    call(zoom),

    // Append 'g' element to svg to add map elements to (for zooming)
    container = svg.append('g'),

    // Extract data from json files for mapping counties and states
    counties = topojson.feature(countyInfo, countyInfo.objects.counties),
    states = topojson.mesh(countyInfo, countyInfo.objects.states),

    // Create color scale
    colors = d3.scaleQuantile().
    domain([minEduVal, maxEduVal]).
    range(['#ECCFFF', '#D18AFF', '#B657FF', '#A843FF',
    '#9A32FF', '#7125D8', '#4D1AB1', '#2E118A']),

    // Create legend using the axisLeft functionality
    legendAxis = d3.axisLeft(
    d3.scaleLinear().
    domain([minEduVal, maxEduVal]).
    range([0, legendH])).
    tickFormat(x => x + '%').
    tickValues(
    [minEduVal].concat(colors.quantiles()).
    concat(maxEduVal).
    map(item => Math.round(item))),

    // Create tooltip div
    tooltip = d3.select('#map').
    append('div').
    attr('id', 'tooltip').
    style('opacity', 0),

    // Create the content of the tooltip for current county
    getTooltipText = d => {
      let county = eduInfo.filter(e => e.fips === d.id);

      if (county) {
        county = county[0];
        return county.area_name + ', ' +
        county.state + ': ' +
        county.bachelorsOrHigher + '%';
      }
      return 'No county info available';
    };

    // Create county mapping, add properties, coloring, etc.
    container.
    selectAll("path").
    data(counties.features).
    enter().
    append("path").
    attr('class', 'county').
    attr('fill', d => {
      // Find the edu data corresponding to county
      let filtered = eduInfo.filter(e => e.fips === d.id);
      // Return the percentage w/bachelors or higher for county
      if (filtered) {return colors(filtered[0].bachelorsOrHigher);}
      colors(0); // Return -1 if there was no edu data for county
    }).
    attr('data-fips', d => d.id) // Set id (fips) for county
    .attr('data-education', d => {
      // Find the edu data corresponding to county
      let filtered = eduInfo.filter(e => e.fips === d.id);
      // Return the percentage w/bachelors or higher for county
      if (filtered) {return filtered[0].bachelorsOrHigher;}
      return -1; // Return -1 if there was no edu data for county
    }).
    attr('d', path) // Set the pathing for this county
    .on('mouseover', function () {
      tooltip.transition().
      duration(100).
      style('opacity', 0.9) // Show tooltip
      .style('background', d3.select(this).attr('fill'));
    }).
    on('mousemove', function (d) {
      tooltip.html(getTooltipText(d)) // Set tooltip properties for county
      .attr('data-education', d3.select(this).attr('data-education')).
      style("left", d3.event.offsetX + 34 + "px").
      style("top", d3.event.offsetY + 24 + "px");
    }).
    on('mouseleave', () => {
      tooltip.transition().
      duration(100).
      style('opacity', 0); // Hide tooltip
    });

    // Create state mapping/outlines
    container.append('path').
    datum(states).
    attr('class', 'state').
    attr('d', path);

    // Add legend axis
    let legend = container.
    append('g').
    attr('id', 'legend').
    attr('transform', 'translate(' +
    legendX + ',' + legendY + ')').
    call(legendAxis);

    // Create legend rects that show colors for different edu values
    for (let i = 0; i < colors.range().length; i++) {
      legend.append('rect').
      attr('y', i * legendBarH).
      attr('width', legendBarW).
      attr('height', legendBarH).
      attr('fill', colors.range()[i]);
    }

    // Add link to source material at bottom of screen
    d3.select('#map').
    append('g').
    attr('id', 'source-link').
    html('Source: <a href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx" target="_blank">USDA Economic Research Service</a>');
  });
});