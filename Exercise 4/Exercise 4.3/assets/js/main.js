// Step 2: Create svg object within the new div 
const svg = d3.select(".responsive-svg-container")
    .append("svg")
      .attr("viewBox", "0 0 440 40")
      .style("border", "1px solid black");

// Step 3: Add a test svg rectangle
svg
  .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "blue");