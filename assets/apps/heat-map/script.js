// Parse the json data and do everything else only after this has succeeded
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json').
then((data) =>
{
  // Variable declarations
  let
  dataset = data.monthlyVariance, // Array containing the set of data objects
  baseTemp = data.baseTemperature, // Base temp from which all variances are based
  numMonths = 12, // The number of months in a year (avoiding magic numbers)
  startYr = d3.min(dataset, d => d.year), // First year in dataset
  endYr = d3.max(dataset, d => d.year), // Last year in dataset
  w = 1400, // Width of map container
  h = 600, // Height of map container
  pad = 85, // Padding between plot container and actual map
  padTop = 40, // Container to plot padding for top only
  padBtm = 85, // Container to plot padding for bottom only
  cellW = (w - 2 * pad) / (endYr - startYr), // Width of a cell, set dynamically
  cellH = (h - padTop - padBtm) / numMonths, // Height of a cell, set dynamically

  // Build the description dynamically for reusability
  description = startYr + ' - ' +
  endYr + ': Base temperature ' +
  baseTemp + '℃',

  /* Build the yScale from -0.5 to 11.5 so that the cells line up
                     with the month ticks of the axis at their mid-point */
  yScale = d3.scaleLinear().
  domain([-0.5, 11.5]).
  range([padTop, h - padBtm]),

  /* Build the xScale from the min and max years of the dataset
                                  using timeScale to display the years correctly, goes one beyond
                                  the max year to make the axis extend to cover the last column */
  xScale = d3.scaleTime().
  domain([d3.min(dataset, d => new Date(d.year.toString())),
  d3.max(dataset, d => new Date((d.year + 1).toString()))]).
  range([pad, w - pad]),

  // Array of n colors used for variable cell coloring
  colorScale =
  [
  '#CCC2A5', '#E0BF71', '#ffa04a',
  '#FF9130', '#FF6633', '#FF3E28',
  '#E01111', '#B30000', '#850000'],


  // Step for cell coloring based on temperature
  tempRangeUnit =
  Math.abs(baseTemp + d3.max(dataset, d => d.variance) - (
  baseTemp + d3.min(dataset, d => d.variance))) /
  colorScale.length,

  // Assign cell colors from low to high total temperature
  getTempColor = d => {
    let temp = baseTemp + d.variance,
    arrLen = colorScale.length;

    for (let i = 2; i <= arrLen; i++) {
      if (temp <= tempRangeUnit * i) {return colorScale[i - 2];}
    }
    return colorScale[arrLen - 1];
  },

  // Turns a month digit into its respective full month name
  parseMonth = (monthDigit) =>
  [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'October',
  'September', 'November', 'December'][
  monthDigit],

  // Parse object data and return formatted text for tooltip display
  getTooltipText = d => {
    let variance = d.variance;

    return parseMonth(d.month - 1) + ',' +
    d.year + '<br/>' +
    (baseTemp + variance).toFixed(2) +
    '℃<br/>' + (variance < 0 ? '' : '+') +
    variance.toFixed(2) + '℃';
  },

  // Tooltip div; one tooltip reused for all cells
  toolTip = d3.select('#map').
  append('div').
  attr('id', 'tooltip').
  attr('opacity', 0),

  // svg element that all cells are contained in
  svg = d3.select('#map').
  append('svg').
  attr('width', w).
  attr('height', h),

  legendW = 300, // Width of the legend container
  legendH = 50, // Height of the legend container
  legendX = (w - pad) * 0.5 - legendW * 0.4, // x-position of legend
  legendY = h - legendH, // y-position of legend
  legendRectW = legendW / colorScale.length, // Width of colored squares in legend
  legendRectH = legendH / 2, // Height of colored squares in legend

  // Create legend and append/position it
  legend = svg.append('g').
  attr('id', 'legend').
  attr('transform', 'translate(' +
  legendX + ',' + legendY + ')'),

  // Make tooltip visible and give it the cells color on hover
  mouseOver = function (d) {
    toolTip.transition().
    duration(100).
    style('background', d3.select(this).attr('fill')).
    style('opacity', 0.9).
    style('box-shadow', '2px 2px 8px 1px #000000');
  },

  // Fill in the tooltip with formatted data and position it
  mouseMove = function (d) {
    toolTip.html(getTooltipText(d)) // Format text for tooltip display
    .style("left", d3.event.pageX + 18 + "px").
    style("top", d3.event.pageY - 95 + "px").
    attr('data-year', d.year);
  },

  // Make tooltip invisible once mouse leaves the cell
  mouseLeave = function (d) {
    toolTip.transition().
    duration(100).
    style('opacity', 0).
    style('box-shadow', 'none');
  };

  // Set the dynamic h3 description element
  d3.select('#description').
  html(description);

  // Create, position, and fill in other attributes of data cells
  svg.selectAll('rect').
  data(dataset).
  enter().
  append('rect').
  attr('class', 'cell').
  attr('x', d => xScale(new Date(d.year.toString()))).
  attr('y', d => yScale(d.month - 1.5)).
  attr('data-month', d => d.month - 1).
  attr('data-year', d => d.year).
  attr('data-temp', d => d.variance).
  attr('width', cellW).
  attr('height', cellH).
  attr('fill', d => getTempColor(d)).
  on('mouseover', mouseOver).
  on('mousemove', mouseMove).
  on('mouseleave', mouseLeave);

  // Create x and y axes from their respective scales
  let xAxis = d3.axisBottom(xScale),
  yAxis = d3.axisLeft(yScale).tickFormat(d => parseMonth(d));

  // Add the x-axis to the svg element and offset it to sit just below plot
  svg.append('g').
  attr('id', 'x-axis').
  attr('transform', 'translate(0,' + (h - padBtm) + ')').
  call(xAxis);

  // Add the y-axis to the svg element and offset it to sit just left of plot
  svg.append('g').
  attr('id', 'y-axis').
  attr('transform', 'translate(' + pad + ',0)').
  call(yAxis);

  /* Create rect objects for legend, fill them in with
                  the array of temp colors from lowest to highest.
                  Then create the corresponding text elements that
                  line up with the break point values between colors */
  for (let i = 0; i < colorScale.length; i++) {
    legend.append('rect').
    attr('class', 'legend-rect').
    attr('x', i * legendRectW).
    attr('width', legendRectW).
    attr('height', legendRectH).
    attr('fill', colorScale[i]);
    if (i > 0) {
      legend.append('text').
      html((tempRangeUnit * (i + 1)).toFixed(1)).
      attr('class', 'legend-text').
      attr('x', i * legendRectW - legendRectW / 4).
      attr('y', legendRectH + 12);
    }
  }
});