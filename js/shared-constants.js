// Set up dimensions and margins
const margin = { top: 40, right: 30, bottom: 60, left: 70 };
const width = 800; // Total width of the chart
const height = 420; // Total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

/* Make the colours accessible globally */
/****************************************/
const barColor = "#0f9d94";
const bodyBackgroundColor = "#ffffff"; // matches the white card behind the chart

// Set up the scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// T06-1 Step 6.2 Create a bin generator using d3.bin
const binGenerator = d3.bin()
    .value(d => d.energyConsumption); // Accessor for energyConsumption

// T06-1 Step 7.2 Make the filter options accessible globally
const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// Bonus: screen size filters (the most frequent sizes)
const filters_size = [
    { id: "all", label: "All sizes", isActive: true },
    { id: 32, label: '32"', isActive: false },
    { id: 43, label: '43"', isActive: false },
    { id: 55, label: '55"', isActive: false },
    { id: 65, label: '65"', isActive: false },
    { id: 75, label: '75"', isActive: false }
];

// Remember which filters are currently selected (so both can work together)
let currentTech = "all";
let currentSize = "all";

// T06-2 Step 1.4 Set up shared constant
// The scatterplot gets its own inner chart and scales so it
// doesn't get tangled up with the histogram's innerChart/xScale/yScale.
let innerChartS;
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal(); // screen type -> colour

// T06-2 Step 3.3 Add tooltipWidth and tooltipHeight
const tooltipWidth = 65;
const tooltipHeight = 32;