// Parse the provided JSON file, then carry on with everything else
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').
then((data) =>
{
  // Variable declarations
  let
  w = 1100, // Width of scatter plot
  h = 620, // Height of scatter plot
  padH = 80, // Horizontal padding for plot
  padV = 50, // Vertical padding for plot
  cR = 8, // Radius for plot point dots
  dopingColor = '#F92938', // Color for dots representing dopers
  noDopeColor = '#3CD723', // Color for dots representing non-dopers
  animDur = 200, // Duration of the scaling animation at legend hover
  loadAnimDur = 200, // Duration of the opacity animation at the start
  legendX = w * 0.775, // X-position of the legend
  legendY = h * 0.185, // Y-position of the legend

  // Scale with scaleTime using years; range uses padding on top/bottom
  xScale = d3.scaleTime().
  domain([d3.min(data, d => new Date((d.Year - 1).toString())),
  d3.max(data, d => new Date((d.Year + 1).toString()))]).
  range([padH, w - padH]),

  // Scale from high to low finishing times; range uses padding on top/bottom
  yScale = d3.scaleTime().
  domain([d3.max(data, d => new Date(d.Seconds * 1000)),
  d3.min(data, d => new Date(d.Seconds * 1000))]).
  range([h - padV, padV]),

  // Create x and y axes using respective scales
  xAxis = d3.axisBottom(xScale),
  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%0M:%0S")),

  // Create svg element for creating points on plot, etc
  svg = d3.select('#plot').
  append('svg').
  attr('width', w).
  attr('height', h),

  // Create and append tooltip element (div)
  toolTip = d3.select('#plot').
  append('div').
  attr('id', 'tooltip').
  style('opacity', 0),

  // Extract, arrange, and format text from data for tooltip
  getTooltipText = d => {
    let info = d.Name + ' - ' + d.Nationality + '<br/>Time: ' +
    d.Time + ', Year: ' + d.Year;
    if (d.Doping) {info += '<br/><br/>' + d.Doping;}
    return info;
  },

  // Create and append legend element ('g')
  legend = svg.append('g').
  attr('id', 'legend').
  attr('transform', 'translate(' + legendX + ',' + legendY + ')');

  // Create circle svg objects to represent plotted points
  svg.selectAll('circle').
  data(data).
  enter().
  append('circle').
  attr('class', 'dot').
  attr('opacity', '0') // Start invisible at load
  .attr('cx', d => xScale(new Date(d.Year.toString()))).
  attr('cy', d => yScale(new Date(d.Seconds * 1000))).
  attr('data-xvalue', d => new Date(d.Year.toString())).
  attr('data-yvalue', d => new Date(d.Seconds * 1000)).
  attr('r', cR)
  // Fill color depends of alleged doper or not
  .attr('fill', d => d.Doping ? dopingColor : noDopeColor)
  // Indicate clickable link if data has an associated URL
  .attr('cursor', d => d.URL ? 'pointer' : 'initial')
  // Fade data point circles in on load
  .transition().
  attr('opacity', '0.95') // Transition to visible after load
  .duration(loadAnimDur).
  ease(d3.easeSinIn);

  // Add tooltip functionality and related mouse events
  svg.selectAll('circle').
  on('mouseover', () => {
    toolTip.transition().
    duration(100).
    style('opacity', 0.9).
    style('transform', 'scale(1)');
  }).
  on('mousemove', d => {
    toolTip.html(getTooltipText(d)) // Format text for tooltip display
    .style("left", d3.event.pageX + 25 + "px").
    style("top", d3.event.pageY - 40 + "px").
    attr('data-year', new Date(d.Year.toString()));
  }).
  on('mouseleave', () => {
    toolTip.transition().
    duration(100).
    style('opacity', 0).
    style('transform', 'scale(0)');
  }) // Open corresponding URL when user clicks a plot point
  .on('click', d => {// Or don't, if no URL available
    if (d.URL) {window.open(d.URL);}
  });

  // Add the x-axis to the svg element and offset it to sit just below plot
  svg.append('g').
  attr('id', 'x-axis').
  attr('transform', 'translate(0,' + (h - padV) + ')').
  call(xAxis);

  // Add the y-axis to the svg element and offset it to sit just left of plot
  svg.append('g').
  attr('id', 'y-axis').
  attr('transform', 'translate(' + padH + ',0)').
  call(yAxis);

  // Add 'rect' with color matching corresponding points
  legend.append('rect').
  attr('class', 'legend-rect').
  attr('fill', dopingColor)
  // Enlarge corresponding points while hovering
  .on('mouseover', d => {
    d3.selectAll('circle').
    transition().
    attr('r', d => d.Doping ? cR + 2 : cR).
    duration(animDur);
  }).
  on('mouseleave', () => {
    d3.selectAll('circle').
    transition().
    attr('r', cR).
    duration(animDur);
  });

  // Add corresponding text for the legend 'rect'
  legend.append('text').
  attr('id', 'doped-text').
  attr('y', 13).
  attr('x', 22).
  html('Alleged doping');

  // Add 'rect' with color matching corresponding points
  legend.append('rect').
  attr('class', 'legend-rect').
  attr('y', 30).
  attr('fill', noDopeColor)
  // Enlarge corresponding points while hovering
  .on('mouseenter', d => {
    d3.selectAll('circle').
    transition().
    attr('r', d => d.Doping ? cR : cR + 2).
    duration(animDur);
  }).
  on('mouseleave', () => {
    d3.selectAll('circle').
    transition().
    attr('r', cR).
    duration(animDur);
  });

  // Add corresponding text for the legend 'rect'
  legend.append('text').
  attr('id', 'undoped-text').
  attr('y', 43).
  attr('x', 22).
  html('No allegations');
});