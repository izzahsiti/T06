const drawScatterplot = (data) => {
    // T06-2 Step 2.2
    /// Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`); // Responsive SVG

    /// Create an inner chart group with margins
    /// (innerChartS is declared in shared-constants.js, so no "const" here)
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // T06-2 Step 2.3
    /// Set up x and y scales using data extents
    const xExtent = d3.extent(data, d => d.star);
    const yExtent = d3.extent(data, d => d.screenSize);

    /// Map star ratings and screen sizes to positions within the chart area.
    xScaleS
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
        .range([0, innerWidth]);

    yScaleS
        .domain([yExtent[0], yExtent[1]])
        .range([innerHeight, 0])
        .nice();

    // T06-2 Step 2.4
    /// (Corrected code) Set up colours for screen technologies
    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];

    colorScale
        .domain(uniqueTechs)
        .range(["#2563eb", "#f59e0b", "#e11d48"]); // blue, amber, rose: clearly different hues
        // (or use d3.schemeCategory10 like the tutorial)

    // Light horizontal grid lines (drawn first so dots sit on top)
    innerChartS.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScaleS).ticks(6).tickSize(-innerWidth).tickFormat(""));

    // T06-2 Step 2.5 Draw the circles
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.screenSize))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5); // see-through so overlapping dots show up

    // T06-2 Step 2.6 Add bottom and left axis
    /// Add axes
    const bottomAxis = d3.axisBottom(xScaleS);
    innerChartS.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 12)
        .attr("class", "axis-label");

    const leftAxis = d3.axisLeft(yScaleS);
    innerChartS.append("g")
        .attr("class", "axis")
        .call(leftAxis);

    svg.append("text")
        .text("Screen size (inches)")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label");

    // T06-2 Step 2.7 Add legend
    /// Add a legend along the top-right (keeps it off the dots)
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - margin.right - uniqueTechs.length * 66}, 8)`);

    /// Show each screen technology with its matching point colour.
    uniqueTechs.forEach((tech, i) => {
        const g = legend.append("g").attr("transform", `translate(${i * 66}, 0)`);
        g.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("rx", 3)
            .attr("fill", colorScale(tech));
        g.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .text(tech);
    });
};