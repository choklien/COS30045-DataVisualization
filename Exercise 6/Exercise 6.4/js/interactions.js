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

        handleHistogramMouseEvents();
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
        handleScatterplotMouseEvents();
    };
};

// Tooltip + Mouse Events
// ---------- Create tooltip for scatterplot ----------
const createScatterplotTooltip = () => {

    // Tooltip group appended to the scatterplot inner chart
    // (uses .scatterplot-tooltip class so it doesn't clash with histogram tooltip)
    const scatterplotInner = innerChartS;

    const tooltip = scatterplotInner
        .append("g")
        .attr("class", "scatterplot-tooltip")
        .style("opacity", 0);

    tooltip
        .append("rect")
        .attr("width", 200)
        .attr("height", 58)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "#FFFDD0")
        .attr("fill-opacity", 0.95)
        .attr("stroke", "#2c3e50")
        .attr("stroke-width", 1);

    tooltip
        .append("text")
        .attr("class", "scatterplot-tooltip-line-1")
        .attr("x", 10)
        .attr("y", 18)
        .attr("fill", "#2c3e50")
        .style("font-size", "12px")
        .style("font-weight", 700)
        .text("");

    tooltip
        .append("text")
        .attr("class", "scatterplot-tooltip-line-2")
        .attr("x", 10)
        .attr("y", 34)
        .attr("fill", "#2c3e50")
        .style("font-size", "11px")
        .text("");

    tooltip
        .append("text")
        .attr("class", "scatterplot-tooltip-line-3")
        .attr("x", 10)
        .attr("y", 50)
        .attr("fill", "#4A90A4")
        .style("font-size", "11px")
        .style("font-weight", 600)
        .text("");
};

const handleScatterplotMouseEvents = () => {

    innerChartS.selectAll("circle")
        .on("mouseenter", (event, d) => {

            d3.select(".scatterplot-tooltip-line-1")
                .text(d.brand);

            d3.select(".scatterplot-tooltip-line-2")
                .text(d.model && d.model.length > 28 ? d.model.slice(0, 28) + "…" : d.model);

            d3.select(".scatterplot-tooltip-line-3")
                .text(`${d.screenSize}" ${d.screenTech} · ${d.star}★ · ${d.energyConsumption} kWh`);

            const cx = +event.target.getAttribute("cx");
            const cy = +event.target.getAttribute("cy");

            // ---- Tooltip size (must match createScatterplotTooltip) ----
            const ttW = 200;
            const ttH = 58;
            const gap = 10;   // px gap between tooltip and circle

            // ---- Center horizontally over the circle ----
            const tooltipX = cx - ttW / 2;

            // ---- Decide above or below ----
            // 'cy' is the circle's y-position (small value = near top).
            // If there's not enough room above (i.e. cy < ttH + gap),
            // place the tooltip below the circle instead.
            const tooltipY = (cy < ttH + gap)
                ? cy + gap + 6                // below the circle
                : cy - ttH - gap;             // above the circle (default)

            d3.select(".scatterplot-tooltip")
                .attr("transform", `translate(${tooltipX}, ${tooltipY})`)
                .transition()
                .duration(150)
                .style("opacity", 1);

            // Highlight circle
            d3.select(event.target)
                .attr("opacity", 1)
                .attr("stroke", "#2c3e50")
                .attr("stroke-width", 2);
        })
        .on("mouseleave", (event) => {
            d3.select(".scatterplot-tooltip")
                .style("opacity", 0)
                .attr("transform", "translate(0, -500)");

            d3.select(event.target)
                .attr("opacity", 0.65)
                .attr("stroke", "none");
        });
};

// Extension - Histogram tooltip
const createHistogramTooltip = () => {

    // Tooltip group appended to the histogram inner chart
    // (uses .histogram-tooltip class so it doesn't clash with scatter tooltip)
    const histogramInner = d3.select("#histogram g");

    const tooltip = histogramInner
        .append("g")
        .attr("class", "histogram-tooltip")
        .style("opacity", 0);

    tooltip
        .append("rect")
        .attr("width", 120)
        .attr("height", 40)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "#FFFDD0")
        .attr("fill-opacity", 0.95)
        .attr("stroke", "#2c3e50")
        .attr("stroke-width", 1);

    tooltip
        .append("text")
        .attr("class", "histogram-tooltip-line-1")
        .attr("x", 10)
        .attr("y", 18)
        .attr("fill", "#FFFDD0")
        .style("font-size", "11px")
        .style("font-weight", 700)
        .text("");

    tooltip
        .append("text")
        .attr("class", "histogram-tooltip-line-2")
        .attr("x", 10)
        .attr("y", 34)
        .attr("fill", "#FFFDD0")
        .style("font-size", "11px")
        .text("");
};

const handleHistogramMouseEvents = () => {

    d3.selectAll("#histogram rect")
        .on("mouseenter", (event, d) => {
            // d is a bin object: { x0, x1, length, ... }
            if (!d || d.x0 === undefined) return;   // skip axis rects

            d3.select(".histogram-tooltip-line-1")
                .text(`${d.x0} – ${d.x1} kWh`);

            d3.select(".histogram-tooltip-line-2")
                .text(`${d.length} TVs`);

            const bx = +event.target.getAttribute("x");
            const by = +event.target.getAttribute("y");
            const bw = +event.target.getAttribute("width");
            const bh = +event.target.getAttribute("height");

            // ---- Tooltip size (must match createHistogramTooltip) ----
            const ttW = 140;
            const ttH = 44;
            const gap = 8;   // px gap between tooltip and bar

            // ---- Center horizontally over the bar ----
            const tooltipX = bx + bw / 2 - ttW / 2;

            // ---- Decide above or below ----
            // 'by' is the top of the bar (small value = tall bar).
            // If there's not enough room above (i.e. by < ttH + gap),
            // place the tooltip below the bar instead.
            const tooltipY = (by < ttH + gap)
                ? by + bh + gap               // below the bar
                : by - ttH - gap;             // above the bar (default)

            d3.select(".histogram-tooltip")
                .attr("transform", `translate(${tooltipX}, ${tooltipY})`)
                .transition()
                .duration(150)
                .style("opacity", 1);

            // Highlight bar
            d3.select(event.target).attr("fill", "#2c3e50");
        })
        .on("mouseleave", (event) => {
            d3.select(".histogram-tooltip")
                .style("opacity", 0)
                .attr("transform", "translate(0, -500)");

            d3.select(event.target).attr("fill", barColor);
        });
};