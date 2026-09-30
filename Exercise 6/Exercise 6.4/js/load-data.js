d3.csv("data/Ex6_TVdata_withStar.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,           // convert to number
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,  // convert to number
    star: +d.star                        // convert to number
}))
    .then(data => {
        // Log processed data to the console for verification
        console.log("Loaded data:", data);
        console.log("Number of rows:", data.length);

        // Call chart functions after data is loaded
        drawHistogram(data); // Exercise 6.1
        populateFilters(data); // Exercise 6.2 - populate filter buttons
        drawScatterplot(data); // Exercise 6.3

        // tooltip + mouse events (in interactions.js)
        createTooltip();
        handleMouseEvents();
    })
    .catch(error => {
        console.error("Error loading the CSV file:", error);
    });