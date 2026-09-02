// Data Story Visualizations
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // ================================================================
    // 1. POPULAR BRANDS BAR CHART
    // Based on: KNIME GroupBy count of models per brand
    // ================================================================
    const brandCtx = document.getElementById('brandPopularityChart');
    if (brandCtx) {
        new Chart(brandCtx, {
            type: 'bar',
            data: {
                labels: ['Samsung', 'Kogan', 'LG', 'Hisense', 'EKO', 'Sylvox', 'JVC', 'Philips', 'Blaupunkt'],
                datasets: [{
                    label: 'Models Available',
                    data: [1080, 780, 680, 120, 60, 40, 20, 10, 5],
                    backgroundColor: [
                        '#1428A0',  // Samsung
                        '#E51A1A',  // Kogan
                        '#A50034',  // LG
                        '#004B93',  // Hisense
                        '#FF6B00',  // EKO
                        '#7F8C8D',  // Sylvox
                        '#2C3E50',  // JVC
                        '#005A8C',  // Philips
                        '#CC0000'   // Blaupunkt
                    ],
                    borderRadius: 6,
                    borderColor: '#2c3e50',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Models',
                            font: { weight: 'bold' }
                        },
                        beginAtZero: true
                    },
                    x: {
                        ticks: {
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    // ================================================================
    // 2. SIZE CATEGORY BAR CHART
    // Based on: KNIME Rule Engine → GroupBy → Bar Chart
    // Categories: Small (<43"), Medium (44-65"), Large (>65")
    // ================================================================
    const sizeCatCtx = document.getElementById('sizeCategoryChart');
    if (sizeCatCtx) {
        new Chart(sizeCatCtx, {
            type: 'bar',
            data: {
                labels: ['Small (<43")', 'Medium (44-65")', 'Large (>65")'],
                datasets: [{
                    label: 'Average Energy (kWh/year)',
                    data: [380, 520, 650],
                    backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
                    borderRadius: 8,
                    borderColor: '#2c3e50',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Energy Consumption (kWh/year)',
                            font: { weight: 'bold' }
                        },
                        beginAtZero: true,
                        max: 800
                    }
                }
            }
        });
    }

    // ================================================================
    // 4. TECHNOLOGY GROUPED BAR CHART
    // Based on: KNIME Pivot → Grouped Bar Chart
    // Screen_Tech: LCD, LCD (LED), OLED
    // ================================================================
    const techCtx = document.getElementById('techGroupedChart');
    if (techCtx) {
        new Chart(techCtx, {
            type: 'bar',
            data: {
                labels: ['Small (<43")', 'Medium (44-65")', 'Large (>65")'],
                datasets: [
                    {
                        label: 'LCD',
                        data: [350, 480, 610],
                        backgroundColor: 'rgba(46, 204, 113, 0.8)',
                        borderColor: '#27ae60',
                        borderWidth: 2,
                        borderRadius: 4
                    },
                    {
                        label: 'LCD (LED)',
                        data: [370, 490, 620],
                        backgroundColor: 'rgba(52, 152, 219, 0.8)',
                        borderColor: '#2980b9',
                        borderWidth: 2,
                        borderRadius: 4
                    },
                    {
                        label: 'OLED',
                        data: [450, 570, 700],
                        backgroundColor: 'rgba(231, 76, 60, 0.8)',
                        borderColor: '#c0392b',
                        borderWidth: 2,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { size: 11 } }
                    },
                    tooltip: { enabled: false }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Energy Consumption (kWh/year)',
                            font: { weight: 'bold' }
                        },
                        beginAtZero: true,
                        max: 800
                    }
                }
            }
        });
    }
});