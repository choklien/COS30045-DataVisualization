const populateFilters = (data) => {

    // Build SCREEN TECH filter buttons
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (event, d) => {
            if (!d.isActive) {
                filters_screen.forEach(f => {
                    f.isActive = (f.id === d.id);
                });
                d3.selectAll("#filters_screen .filter")
                    .classed("active", f => f.id === d.id);

                applyFilters();
            }
        });

    // Build SCREEN SIZE filter buttons
    d3.select("#filters_size")
        .selectAll(".filter")
        .data(filters_size)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (event, d) => {
            if (!d.isActive) {
                filters_size.forEach(f => {
                    f.isActive = (f.id === d.id);
                });
                d3.selectAll("#filters_size .filter")
                    .classed("active", f => f.id === d.id);

                applyFilters();
            }
        });

    // Helper: get active filter ids
    const getActiveFilterId = (filterArray) => {
        const active = filterArray.find(f => f.isActive);
        return active ? active.id : "all";
    };

    // Apply both filters + update histogram and scatterplot
    const applyFilters = () => {
        const activeTech = getActiveFilterId(filters_screen);  // "all" | "LED" | "LCD" | "OLED"
        const activeSize = getActiveFilterId(filters_size);    // "all" | 24 | 32 | 55 | 65 | 98

        updateHistogram(activeTech, activeSize, data);
        updateScatterplot(activeTech, activeSize, data);
    };

    // Filter data + update bars + rescale y-axis
    const updateHistogram = (filterTech, filterSize, data) => {

        // ---- Filter the data (AND logic) ----
        let updatedData = data;

        if (filterTech !== "all") {
            updatedData = updatedData.filter(tv => tv.screenTech === filterTech);
        }

        if (filterSize !== "all") {
            updatedData = updatedData.filter(tv => tv.screenSize === filterSize);
        }

        // ---- Re-bin ----
        const updatedBins = binGenerator(updatedData);

        // ---- Optionally rescale the y-axis ----
        if (RESCALE_ON_FILTER) {
            const newMax = d3.max(updatedBins, d => d.length) || 1;   // fallback to 1 if empty
            yScale
                .domain([0, newMax])
                .range([innerHeight, 0])
                .nice();

            // Re-render the y-axis with the new scale
            d3.select("#histogram .y-axis")
                .transition()
                .duration(500)
                .ease(d3.easeCubicInOut)
                .call(d3.axisLeft(yScale));
        }

        // ---- Update bars ----
        d3.selectAll("#histogram rect")
            .data(updatedBins)
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));

        // ---- Log current filter state ----
        console.log(`Filtered → tech: ${filterTech}, size: ${filterSize}, rows: ${updatedData.length}`);
    };

    // Update the scatterplot when filters change
    const updateScatterplot = (filterTech, filterSize, data) => {

        // ---- Filter the data (same AND logic as the histogram) ----
        let updatedData = data;

        if (filterTech !== "all") {
            updatedData = updatedData.filter(tv => tv.screenTech === filterTech);
        }
        if (filterSize !== "all") {
            updatedData = updatedData.filter(tv => tv.screenSize === filterSize);
        }

        // ---- Bind new data and animate ----
        innerChartS
            .selectAll("circle")
            .data(updatedData, d => d.model + "|" + d.screenSize)   // key function
            .join(
                // ENTER: new circles start invisible
                enter => enter.append("circle")
                    .attr("r", 4)
                    .attr("cx", d => xScaleS(d.star))
                    .attr("cy", d => yScaleS(d.energyConsumption))
                    .attr("fill", d => colorScale(d.screenTech))
                    .attr("opacity", 0),

                // UPDATE: existing circles stay put
                update => update,

                // EXIT: circles no longer in the data fade out then get removed
                exit => exit
                    .transition()
                    .duration(400)
                    .attr("opacity", 0)
                    .remove()
            )
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("opacity", 0.65);      // fade in

        // Re-attach mouse events to the (re-drawn) circles
        handleMouseEvents();
    };
};

// Exercise 6.3 - Tooltip + Mouse Events
// ---------- Create tooltip ----------
const createTooltip = () => {

    // Tooltip container (positioned absolutely relative to the page)
    d3.select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .attr("id", "scatter-tooltip")
        .style("opacity", 0);
};

// ---------- Attach mouse events to circles ----------
const handleMouseEvents = () => {

    d3.selectAll("#scatterplot circle")
        .on("mouseover", function (event, d) {
            // Highlight the hovered circle
            d3.select(this)
                .attr("opacity", 1)
                .attr("stroke", "#2c3e50")
                .attr("stroke-width", 2);

            // Show tooltip with details
            d3.select("#scatter-tooltip")
                .style("opacity", 1)
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 28) + "px")
                .html(`
          <strong>${d.brand}</strong><br>
          ${d.screenSize}" ${d.screenTech}<br>
          ${d.star}★ &nbsp; ${d.energyConsumption} kWh
        `);
        })
        .on("mousemove", function (event) {
            // Keep tooltip following the cursor
            d3.select("#scatter-tooltip")
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            // Reset the circle
            d3.select(this)
                .attr("opacity", 0.5)
                .attr("stroke", "none");

            // Hide tooltip
            d3.select("#scatter-tooltip")
                .style("opacity", 0);
        });
};