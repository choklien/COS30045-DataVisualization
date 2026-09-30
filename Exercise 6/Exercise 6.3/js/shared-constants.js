// ---------- Chart dimensions & margins ----------
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;    // total SVG width
const height = 400;   // total SVG height
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// ---------- Scatterplot inner chart (in scatterplot.js) ----------
let innerChartS;

// ---------- Tooltip dimensions ----------
const tooltipWidth = 65;
const tooltipHeight = 32;

// ---------- Colours ----------
const barColor = "#4A90A4";
const bodyBackgroundColor = "#fffaf0";

// ---------- Histogram Scales ----------
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// ---------- Scatterplot scales ----------
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();

// ---------- Bin generator ----------
const binGenerator = d3.bin()
  .value(d => d.energyConsumption);

// ---------- Filter options for screen types ----------
const filters_screen = [
  { id: "all", label: "All", isActive: true },
  { id: "LED", label: "LED", isActive: false },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// ---------- Filter options for screen sizes ----------
const filters_size = [
  { id: "all", label: "All sizes", isActive: true },
  { id: 24,    label: "24\"",      isActive: false },
  { id: 32,    label: "32\"",      isActive: false },
  { id: 55,    label: "55\"",      isActive: false },
  { id: 65,    label: "65\"",      isActive: false },
  { id: 98,    label: "98\"",      isActive: false }
];

// ---------- Rescaling toggle ----------
// Set to true to rescale the y-axis when filtering, false to keep it fixed
const RESCALE_ON_FILTER = true;