/*
  References:
    - https://stackoverflow.com/questions/49534470/d3-js-v5-promise-all-replaced-d3-queue
    - https://wsvincent.com/javascript-remove-duplicates-array/
*/

// JSON files with treemap datasets
let files = [
'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'],


datasetNum = 2; // Use only the videogame dataset until future update

// Load the chosen dataset, will work with any of the 3 datasets
d3.json(files[datasetNum]).then(function (tree) {
  let root = d3.hierarchy(tree).
  sum(d => d.value).
  sort((x, y) => y.value - x.value),

  // Set the dimensions of the map
  w = 1000,
  h = 600,

  // The unique categories of the tree dataset
  categories = [...new Set(root.leaves().map(d => d.data.category))],

  // Color scale made up of two predefined d3 schemes
  colors = d3.scaleOrdinal().
  domain(categories).
  range(d3.schemeRdYlGn[9].concat(d3.schemeBrBG[9])),

  // Create tooltip element, append to map div
  tooltip = d3.select('#map').
  append('div').
  attr('id', 'tooltip').
  style('opacity', 0),

  // Parse node and return formatted name/category/value string
  getTooltipText = (d) =>
  'Name: ' + d.name + '<br/>Category: ' +
  d.category + '<br/>Value: ' +
  d.value,

  // Append the svg element to the map div element
  svg = d3.select('#map').
  append('svg').
  attr('width', w).
  attr('height', h),

  // Build treemap function, set properties
  treemap = d3.treemap().
  size([w, h]).
  tile(d3.treemapBinary)(
  root), // Call treemap function w/preceding properties

  // Use treemap to add windows (tile containers) to svg
  windows = svg.selectAll('g').
  data(root.leaves()).
  enter().
  append('g').
  attr('class', 'window').
  attr("transform", (d) =>
  "translate(" + d.x0 + "," + d.y0 + ")");

  // Add a tile (rect element) with properties to each window
  windows.append('rect').
  attr('class', 'tile').
  attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.data.value).
  attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  attr('fill', d => colors(d.data.category))
  // Show tooltip when hovering over tile
  .on('mouseover', () => {
    tooltip.transition().
    duration(100).
    style('opacity', 0.9875);
  })
  // Update tooltip data/position on mouse move while hovering
  .on('mousemove', function (d) {
    tooltip.html(getTooltipText(d.data)).
    style('left', d3.event.offsetX + 10 + 'px').
    style('top', d3.event.offsetY - 10 + 'px').
    attr('data-value', d.value);
  })
  // Hide tooltip on hover end
  .on('mouseleave', () => {
    tooltip.transition().
    duration(100).
    style('opacity', 0);
  });

  // Add a text label to each window corresponding to tile
  windows.append('text').
  attr('class', 'tile-text').
  attr('x', d => d.x0 + 5).
  attr('y', d => d.y0 + 20)
  // Split name up at spaces and simulate newlines
  .selectAll('tspan').
  data(d => d.data.name.split(' ')).
  enter().
  append('tspan').
  attr('x', 5).
  attr('y', (d, i) => 11 * (i + 1)).
  text(d => d);

  // Height and width of legend svg element
  let legendH = 210,
  legendW = 420,
  legendPad = 20, // Padding around legend svg container
  legendColCutoff = categories.length / 2, // Place to split columns at
  // Height and width of legend rect elements
  legRectH = (legendH - 2 * legendPad) / (categories.length / 2),
  legRectW = (legendW - 2 * legendPad) / categories.length,
  textOffset = 8, // Place text at nice distance from rect

  // Creat new svg element to append rects and text to
  legend = d3.select('#map').
  append('svg').
  attr('id', 'legend').
  attr('height', legendH).
  attr('width', legendW).
  style('padding', legendPad + 'px'),

  // Create g elements to hold rect/text elements of each category
  legendGrps = legend.selectAll('g').
  data(categories).
  enter().
  append('g');

  // Add rects to legendGrps, align diagonally, with two columns
  legendGrps.append('rect').
  attr('class', 'legend-item').
  attr('x', (d, i) => {
    if (i < legendColCutoff) {
      return i * legRectW;
    } else {
      return i * legRectW - legRectW * 2;
    }
  }).
  attr('y', (d, i) => {
    if (i < legendColCutoff) {
      return i * legRectH;
    } else {
      return (i - legendColCutoff) * legRectH;
    }
  }).
  attr('height', legRectH).
  attr('width', legRectW).
  attr('stroke', '#555').
  attr('fill', c => colors(c));

  // Add text to legendGrps, align to the right of corresponding rect
  legendGrps.append('text').
  attr('class', 'legend-text').
  attr('x', (d, i) => {
    if (i < legendColCutoff) {
      return i * legRectW + legRectW * 1 + textOffset;
    } else {
      return (i + 1) * legRectW - legRectW * 2 + textOffset;
    }
  }).
  attr('y', (d, i) => {
    if (i < legendColCutoff) {
      return (i + 1) * legRectH - legRectH / 3;
    } else {
      return (i - legendColCutoff + 1) * legRectH - legRectH / 3;
    }
  }).
  text(d => d);
});