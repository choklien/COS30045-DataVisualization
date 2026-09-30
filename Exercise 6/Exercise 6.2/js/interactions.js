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

    // Apply both filters + update histogram
    const applyFilters = () => {
        const activeTech = getActiveFilterId(filters_screen);  // "all" | "LED" | "LCD" | "OLED"
        const activeSize = getActiveFilterId(filters_size);    // "all" | 24 | 32 | 55 | 65 | 98

        updateHistogram(activeTech, activeSize, data);
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
};