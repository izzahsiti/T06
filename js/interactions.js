// Build one group of buttons. `onPick` runs when a button is clicked.
const buildButtons = (containerId, filters, onPick) => {
    d3.select(containerId)
        .selectAll(".filter")
        .data(filters)
        .join("button")
        .attr("type", "button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`) // 1. add class from isActive
        .text(d => d.label)
        .on("click", (e, d) => { // 2. add a click listener
            console.log("Clicked filter:", e);
            console.log("Clicked filter data:", d);

            if (!d.isActive) {
                // 3. make sure the button clicked is not already active
                filters.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false;
                });

                // 4. update the filter buttons based on which one was clicked
                d3.selectAll(`${containerId} .filter`)
                    .classed("active", filter => filter.id === d.id ? true : false);

                // 5. pass the id of the active button to the update function
                onPick(d.id);
            }
        });
};

// Build the screen-technology buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners
    buildButtons("#filters_screen", filters_screen, id => {
        currentTech = id;
        updateHistogram(currentTech, data);
    });

    // Bonus: screen size buttons
    buildButtons("#filters_size", filters_size, id => {
        currentSize = id;
        updateHistogram(currentTech, data);
    });
};

const updateHistogram = (filterId, data) => {
    // Step 7.4 Update the histogram
    // 1. Filter the data (screen type from filterId, plus the bonus size filter)
    const updatedData = data.filter(tv =>
        (filterId === "all" || tv.screenTech === filterId) &&
        (currentSize === "all" || tv.screenSize === currentSize)
    );

    // 2. Re-bin the filtered data (same bin edges as before)
    const updatedBins = binGenerator(updatedData);

    // The y-axis and grid rescale to fit the new tallest bar
    yScale.domain([0, d3.max(updatedBins, d => d.length) || 1]).nice();

    const t = d3.transition().duration(500).ease(d3.easeCubicInOut);

    // 3. Draw the bars with a transition
    d3.selectAll("#histogram rect")
        .data(updatedBins)
        .transition(t)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));

    d3.select("#histogram .y-axis").transition(t).call(d3.axisLeft(yScale));
    d3.select("#histogram .grid").transition(t)
        .call(d3.axisLeft(yScale).ticks(6).tickSize(-innerWidth).tickFormat(""));
};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart

    // Step 3.3 Append tooltip background rectangle

    // Step 3.4 Apped tooltip text

};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    // Step 3.6 Select all circles in scatter plot
    // Step 3.7 Attach event listeners to mouseenter and mouseleave events
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            tooltip.select("text")
                .text(`${d.screenSize} inches`);

            // Get the hovered circle's position
            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            // Centre the tooltip above the circle
            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${cx - 0.5 * tooltipWidth},
                               ${cy - 1.5 * tooltipHeight})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)");
        });
};
