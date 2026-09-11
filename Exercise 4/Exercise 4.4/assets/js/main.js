// Exercise 4.3 Step 2: Create svg object within the new div 
const svg = d3.select(".responsive-svg-container")
    .append("svg")
      .attr("viewBox", "0 0 440 40")
      .style("border", "1px solid black");

// Exercise 4.3 Step 3: Add a test svg rectangle
svg
  .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "blue");

// Exercise 4.4 Step 1: Use row conversion function, d3.csv(), to give D3 access to data
d3.csv("data/tvBrandCount.csv", d => {
  console.log(d); 
}
);
