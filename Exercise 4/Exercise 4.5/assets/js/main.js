// Exercise 4.3 Step 2: Create svg object within the new div 
const svg = d3.select(".responsive-svg-container")
    .append("svg")
      .attr("viewBox", "0 0 1200 1600")
      .style("border", "1px solid black");

// Exercise 4.4 Step 1: Use row conversion function, d3.csv(), to give D3 access to data
/*
d3.csv("data/tvBrandCount.csv", d => {
  console.log(d); 
}
);
*/

// Exercise 4.4 Step 2: Check browser console tab for java objects created from your data set
/*
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,
    count: +d.count
  };
})
.then(data => {
  console.log(data);
});
*/

// Exercise 4.4 Step 3: Finding information about the data set
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,
    count: +d.count
  };
})
.then(data => {
  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, d => d.count));
  console.log(d3.min(data, d => d.count));
  console.log(d3.extent(data, d => d.count)); //=> array with min and max

  // Sort descending by count (largest first)
  data.sort((a, b) => b.count - a.count);

  // Call drawBarChart with the loaded data
  drawBarChart(data);
});

// Exercise 4.5 Step 1:  Bind the data to DOM elements
/*
const drawBarChart = data => {
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", d => {
      console.log(d);
      return `bar bar-${d.count}`;
    })
 };
 */

// Exercise 4.5 Step 2: Make your data visible: Add attributes (.attr) to your bar chart for width, height and fill
const drawBarChart = data => {
  const barHeight = 20;

  const barSpacing = 5;

  svg
  .selectAll("rect")
  .data(data)
  .join("rect")
  .attr("class", d => {
          console.log(d);
          return `bar bar-${d.count}`;
        })
  .attr("width", d => d.count)
  .attr("height", barHeight)
  .attr("fill", "blue")
  .attr("x", 0)
  .attr("y", (d, i) => i * (barHeight + barSpacing));
};