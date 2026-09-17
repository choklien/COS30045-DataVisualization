// Load data
d3.csv("assets/data/Data-exercise-5.1.csv", d => {
  return {
    screenTech: d.Screen_Tech,
    energyConsumption: +d.Avg_Energy_Consumption
  };
})
.then(data => {
  // Sort descending by energy consumption
  data.sort((a, b) => b.energyConsumption - a.energyConsumption);

  console.log(data);
  drawBarChart(data);
});

const drawBarChart = data => {
  // Set up inner chart margins and dimensions
  const margin = { top: 40, right: 170, bottom: 25, left: 40 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create the svg container
  const svg = d3.select("#bar-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`)
      .style("border", "1px solid black");

  // Create inner chart group and apply margins
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.screenTech))  // Convert to uppercase
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.energyConsumption)])
    .range([innerHeight, 0]);

  // Axes
  const bottomAxis = d3.axisBottom(xScale);
  const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  innerChart
    .append("g")
      .call(leftAxis);

  // axis label
  innerChart
    .append("text")
    .text("Energy Consumption (kWh)")
    .attr("x", 0)
    .attr("y", -margin.top + 20)
    .attr("text-anchor", "start")
    .style("font-weight", "bold");

  // Draw bars
  innerChart
    .selectAll(".bar")
    .data(data)
    .join("rect")
      .attr("class", "bar")
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.energyConsumption))
      .attr("x", d => xScale(d.screenTech))
      .attr("y", d => yScale(d.energyConsumption))
      .attr("fill", "pink")
      .attr("rx", 10);  // rounded top corners

    // Value labels on top of each bar
  innerChart
    .selectAll(".bar-label")
    .data(data)
    .join("text")
      .attr("class", "bar-label")
      .text(d => d.energyConsumption.toFixed(1))   // 1 decimal place
      .attr("x", d => xScale(d.screenTech) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.energyConsumption) - 2)   // 8px above bar
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", "grey");
};