// ---------- Chart dimensions & margins ----------
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;    // total SVG width
const height = 400;   // total SVG height
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// ---------- Colours ----------
const barColor = "#4A90A4";
const bodyBackgroundColor = "#fffaf0";

// ---------- Scales ----------
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// ---------- Bin generator ----------
const binGenerator = d3.bin()
  .value(d => d.energyConsumption);