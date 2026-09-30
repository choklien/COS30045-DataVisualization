// Star rating (x) vs energy consumption (y)
const drawScatterplot = (data) => {

  // ---------- SVG container ----------
  const svg = d3.select("#scatterplot")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // ---------- Inner chart group ----------
  innerChartS = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ---------- Scales ----------
  const maxStar = d3.max(data, d => d.star);
  const maxEnergy = d3.max(data, d => d.energyConsumption);

  xScaleS
    .domain([0, maxStar])
    .range([0, innerWidth]);

  yScaleS
    .domain([0, maxEnergy])
    .range([innerHeight, 0]);

  // ---------- Colour scale for screen tech ----------
  colorScale
    .domain(data.map(d => d.screenTech))
    //.range(d3.schemeCategory10);
    .range(["#AEB8A0", "#FF5C34", "#E9F056"]);

  // ---------- Draw circles ----------
  innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.5);

  // ---------- Axes ----------
  const bottomAxis = d3.axisBottom(xScaleS);
  const leftAxis = d3.axisLeft(yScaleS);

  innerChartS
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  innerChartS
    .append("g")
    .attr("class", "y-axis")
    .call(leftAxis);

  // ---------- Axis labels ----------
  // X-axis label (star rating)
  innerChartS
    .append("text")
    .text("Star Rating")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .style("fill", "#2c3e50");

  // Y-axis label (rotated vertically)
  innerChartS
    .append("text")
    .text("Energy Consumption (kWh/year)")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .style("fill", "#2c3e50");

  // ---------- Legend ----------
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 100}, ${margin.top})`);

  colorScale.domain().forEach((screenTech, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", colorScale(screenTech));

    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .style("font-size", "12px")
      .style("fill", "#2c3e50")
      .text(screenTech);
  });
};