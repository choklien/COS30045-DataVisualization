// Load data
d3.csv("assets/data/Data_exercise_5.3.csv", d => {
  return {
    screensizeCategory: d.Screensize_Category,
    count: +d.Count
  };
})
.then(data => {
  console.log("Loaded donut chart data:", data);
  drawDonutChart(data);
});

const drawDonutChart = data => {
  // Set up chart dimensions
  const width = 1000;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 20;   // leave padding

  // SVG container
  const svg = d3.select("#donut-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`)
      .style("border", "1px solid black");

  // Inner chart group (centered)
  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Colour scale
  /* const color = d3.scaleOrdinal()
    .domain(data.map(d => d.screensizeCategory))
    .range(d3.schemeSet2); */

    const color = d3.scaleOrdinal()
    .domain(data.map(d => d.screensizeCategory))
    .range(["#f9f6bd", "#9bccff", "lightblue"]);

  // Pie function: calculate angles
  const pie = d3.pie()
    .value(d => d.count)
    .sort(null);   // keep original order

  // Arc generator
  // donut chart
  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)   // donut hole = 60%
    .outerRadius(radius * 1)
    .padAngle(0.02)              // small gap between slices
    .cornerRadius(12);            // rounded corners

  // pie chart
  /* const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius * 1) */

  // Draw the slices
  innerChart
    .selectAll("path")
    .data(pie(data))
    .join("path")
      .attr("d", arcGenerator)
      .attr("fill", d => color(d.data.screensizeCategory))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

  // Add labels inside each slice
  innerChart
    .selectAll(".slice-label")
    .data(pie(data))
    .join("text")
      .attr("class", "slice-label")
      .text(d => d.data.screensizeCategory.toUpperCase())
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#2c3e50")
      .style("pointer-events", "none");
};