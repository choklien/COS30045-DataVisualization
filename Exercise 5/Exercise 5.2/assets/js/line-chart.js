// Load data
d3.csv("assets/data/ARE_Spot_Prices.csv", d => {
  return {
    year: +d.Year,   // convert to number (continuous data)
    averagePrice: +d["Average Price (notTas-Snowy)"]
  };
})
.then(data => {
  console.log("Loaded line chart data:", data);
  drawLineChart(data);
});

const drawLineChart = data => {
  // Set up inner chart margins and dimensions
  const margin = { top: 40, right: 170, bottom: 40, left: 80 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create the SVG container
  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`)
      .style("border", "1px solid black");

  // Inner chart group with margins
  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .range([innerHeight, 0]);

  // Axes
  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));    // integer years

  const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  innerChart
    .append("g")
      .call(leftAxis);

  // Axis labels
  // X-axis label
  innerChart
    .append("text")
    .text("Year")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 35)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("font-weight", "bold");

  // Y-axis label
  innerChart
    .append("text")
    .text("Price ($ per MWh)")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("font-weight", "bold");

  // Scatter plot: circles for each data point
  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice))
      .attr("fill", "#4A90A4")
      .attr("opacity", 0.8);

  // Line generator
  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));

  // Draw the line
  innerChart
    .append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "#2c3e50")
    .attr("stroke-width", 2);
};