// Exercise 4.2 step 2: Apply a style to html element using D3
d3.select("h1")
  .style("color", "pink");

d3.select("h2")
  .style("color", "lightblue");

// Step 3: Append an element using D3
d3.select("div")
  .append("p")
    .text("Purchasing a low energy consumption TV will help with your energy bills!");

// Step 4: Append a svg using D3
d3.select("svg")
  .append("rect");