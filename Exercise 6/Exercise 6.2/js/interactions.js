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

        // Filter data + update bars + rescale BOTH axes
    const updateHistogram = (filterTech, filterSize, data) => {

        // ---- Filter the data (AND logic) ----
        let updatedData = data;

        if (filterTech !== "all") {
            updatedData = updatedData.filter(tv => tv.screenTech === filterTech);
        }

        if (filterSize !== "all") {
            updatedData = updatedData.filter(tv => tv.screenSize === filterSize);
        }

        // ---- Re-bin (always 14 bins thanks to frozen domain) ----
        const updatedBins = binGenerator(updatedData);

        // ═══════════════════════════════════════════════════════════
        // Rescale X — but keep the FULL [0, 2800] range for axis context
        // ═══════════════════════════════════════════════════════════
        // We keep the full 0–2800 range so bars stay at consistent positions
        const newMinEng = updatedBins[0].x0;                          // = 0
        const newMaxEng = updatedBins[updatedBins.length - 1].x1;     // = 2800

        xScale
            .domain([newMinEng, newMaxEng])
            .range([0, innerWidth]);

        d3.select("#histogram .x-axis")
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .call(d3.axisBottom(xScale));

        // ═══════════════════════════════════════════════════════════
        // Rescale Y — this is dynamic (fits the filtered max count)
        // ═══════════════════════════════════════════════════════════
        if (RESCALE_ON_FILTER) {
            const newMax = d3.max(updatedBins, d => d.length) || 1;
            yScale
                .domain([0, newMax])
                .range([innerHeight, 0])
                .nice();

            d3.select("#histogram .y-axis")
                .transition()
                .duration(500)
                .ease(d3.easeCubicInOut)
                .call(d3.axisLeft(yScale));
        }

        // ---- Update bars ----
        d3.selectAll("#histogram .bar")
            .data(updatedBins, d => d.x0)     // key by x0 so bars match 1:1
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("x", d => xScale(d.x0))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));

        console.log(`Filtered → tech: ${filterTech}, size: ${filterSize}, rows: ${updatedData.length}`);
    };
}