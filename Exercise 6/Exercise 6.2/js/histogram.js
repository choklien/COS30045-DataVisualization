const drawHistogram = (data) => {

  // ---------- SVG container ----------
  const svg = d3.select("#histogram")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // ---------- Inner chart group with margins ----------
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ---------- Create bins ----------
  const bins = binGenerator(data);
  console.log("Bins created:", bins);

  // ---------- Determine scale domains from bins ----------
  const minEng = bins[0].x0;                          // lower bound of first bin
  const maxEng = bins[bins.length - 1].x1;            // upper bound of last bin
  const binsMaxLength = d3.max(bins, d => d.length);  // tallest bin

  console.log("minEng:", minEng, "maxEng:", maxEng, "binsMaxLength:", binsMaxLength);

  // ---------- Configure scales ----------
  xScale
    .domain([minEng, maxEng])
    .range([0, innerWidth]);

  yScale
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])
    .nice();

  // ---------- Draw the bars ----------
  innerChart
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => xScale(d.x1) - xScale(d.x0))
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barColor)
      .attr("stroke", bodyBackgroundColor)
      .attr("stroke-width", 2);

  // ---------- Axes ----------
  const bottomAxis = d3.axisBottom(xScale);
  const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  innerChart
    .append("g")
      .call(leftAxis);

  // ---------- Axis labels ----------
  // X-axis label
  innerChart
    .append("text")
    .text("Energy Consumption (kWh/year)")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .style("fill", "#2c3e50");

  // Y-axis label (rotated)
  innerChart
    .append("text")
    .text("Number of TVs")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .style("fill", "#2c3e50");
};