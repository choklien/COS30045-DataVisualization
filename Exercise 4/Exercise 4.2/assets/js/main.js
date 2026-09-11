// Step 2: Apply a style to html element using D3
d3.select("h1")
  .style("color", "lightblue");

d3.select("h2")
  .style("color", "pink");

// Step 3: Append an element using D3
d3.select("div")
  .append("p")
    .text("Purchasing a low energy consumption TV will help with your energy bills!");

d3.selectAll("div")
  .append("p")
    .text("Testing selectAll()");

// Step 4: Append an SVG element using D3
d3.select("svg")
  .append("rect");

d3.select("svg")
  .append("rect")
   .attr("x", 50)
   .attr("y", 50)
   .attr("width", 100)
   .attr("height", 30)
   .style("fill", "lightgreen");