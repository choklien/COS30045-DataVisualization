// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    setCurrentYear();
    
    // Initialize FAQ accordion
    initializeFAQ();
    
    // Initialize energy calculator
    initializeCalculator();
    
    // Handle appliance type selection
    handleApplianceSelection();
});

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// FAQ Accordion
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class on question
            this.classList.toggle('active');
            
            // Find the answer
            const answer = this.nextElementSibling;
            
            // Toggle active class on answer
            answer.classList.toggle('active');
            
            // Optional: Close other FAQs
            // Uncomment below to allow only one open at a time
            /*
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });
            */
        });
    });
}

// Energy Calculator
function initializeCalculator() {
    const calculatorForm = document.getElementById('energyCalculator');
    const resultsContent = document.getElementById('resultsContent');
    const errorMessages = document.getElementById('errorMessages');
    
    if (!calculatorForm) return;
    
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        errorMessages.innerHTML = '';
        errorMessages.classList.remove('show');
        
        // Get form values
        const applianceType = document.getElementById('applianceType').value;
        const hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value);
        const electricityPrice = parseFloat(document.getElementById('electricityPrice').value);
        
        // Get wattage (either from selection or custom)
        let wattage = getWattageFromSelection(applianceType);
        
        // If custom, get custom wattage
        if (applianceType === 'custom') {
            const customWattage = parseFloat(document.getElementById('customWattage').value);
            if (!isNaN(customWattage) && customWattage > 0) {
                wattage = customWattage;
            } else {
                showError('Please enter a valid wattage for your custom appliance.');
                return;
            }
        }
        
        // Validate inputs
        const validationErrors = validateInputs(wattage, hoursPerDay, electricityPrice);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => showError(error));
            return;
        }
        
        // Perform calculations
        const results = calculateEnergy(wattage, hoursPerDay, electricityPrice);
        
        // Display results
        displayResults(results, resultsContent);
    });
}

// Get wattage based on appliance selection
function getWattageFromSelection(selection) {
    const wattages = {
        'tv_40': 80,
        'tv_55': 120,
        'tv_65': 180,
        'custom': null
    };
    return wattages[selection] || null;
}

// Handle appliance type selection
function handleApplianceSelection() {
    const applianceType = document.getElementById('applianceType');
    const customWattageGroup = document.getElementById('customWattageGroup');
    
    if (applianceType) {
        applianceType.addEventListener('change', function() {
            if (this.value === 'custom') {
                customWattageGroup.style.display = 'block';
            } else {
                customWattageGroup.style.display = 'none';
                // Clear custom wattage when hidden
                document.getElementById('customWattage').value = '';
            }
        });
    }
}

// Validate inputs
function validateInputs(wattage, hoursPerDay, electricityPrice) {
    const errors = [];
    
    if (!wattage || wattage <= 0) {
        errors.push('Please enter a valid wattage (greater than 0).');
    }
    
    if (isNaN(hoursPerDay) || hoursPerDay < 0 || hoursPerDay > 24) {
        errors.push('Please enter a valid number of hours (0-24).');
    }
    
    if (isNaN(electricityPrice) || electricityPrice < 0) {
        errors.push('Please enter a valid electricity price (greater than 0).');
    }
    
    return errors;
}

// Show error message
function showError(message) {
    const errorMessages = document.getElementById('errorMessages');
    const errorItem = document.createElement('div');
    errorItem.className = 'error-item';
    errorItem.textContent = '⚠ ' + message;
    errorMessages.appendChild(errorItem);
    errorMessages.classList.add('show');
}

// Calculate energy consumption
function calculateEnergy(wattage, hoursPerDay, pricePerKWh) {
    // Convert watts to kilowatts
    const kW = wattage / 1000;
    
    // Daily consumption (kWh)
    const dailyKWh = kW * hoursPerDay;
    
    // Monthly consumption (kWh) - assuming 30 days
    const monthlyKWh = dailyKWh * 30;
    
    // Yearly consumption (kWh) - assuming 365 days
    const yearlyKWh = dailyKWh * 365;
    
    // Calculate costs
    const pricePerKWhDollars = pricePerKWh / 100; // Convert cents to dollars
    
    const dailyCost = dailyKWh * pricePerKWhDollars;
    const monthlyCost = monthlyKWh * pricePerKWhDollars;
    const yearlyCost = yearlyKWh * pricePerKWhDollars;
    
    // Calculate CO2 emissions (Australia average: 0.85 kg CO2 per kWh)
    const co2PerKWh = 0.85;
    const dailyCO2 = dailyKWh * co2PerKWh;
    const monthlyCO2 = monthlyKWh * co2PerKWh;
    const yearlyCO2 = yearlyKWh * co2PerKWh;
    
    return {
        dailyKWh,
        monthlyKWh,
        yearlyKWh,
        dailyCost,
        monthlyCost,
        yearlyCost,
        dailyCO2,
        monthlyCO2,
        yearlyCO2,
        wattage
    };
}

// Display results
function displayResults(results, container) {
    let html = '';
    
    // Format numbers
    const formatNumber = (num, decimals = 2) => {
        return num.toFixed(decimals);
    };
    
    const formatCurrency = (amount) => {
        return '$' + amount.toFixed(2);
    };
    
    // Energy Consumption Section
    html += `
        <div class="result-item">
            <strong>Appliance Wattage:</strong> 
            <span class="value">${results.wattage} W</span>
        </div>
        
        <h4 style="color: #1a3a5c; margin: 1rem 0 0.5rem 0;">Energy Consumption</h4>
        <div class="result-item">
            <strong>Daily Consumption:</strong> 
            <span class="value">${formatNumber(results.dailyKWh)} kWh</span>
        </div>
        <div class="result-item">
            <strong>Monthly Consumption:</strong> 
            <span class="value">${formatNumber(results.monthlyKWh)} kWh</span>
        </div>
        <div class="result-item">
            <strong>Yearly Consumption:</strong> 
            <span class="value">${formatNumber(results.yearlyKWh)} kWh</span>
        </div>
        
        <h4 style="color: #1a3a5c; margin: 1rem 0 0.5rem 0;">Estimated Costs</h4>
        <div class="result-item">
            <strong>Daily Cost:</strong> 
            <span class="value">${formatCurrency(results.dailyCost)}</span>
        </div>
        <div class="result-item">
            <strong>Monthly Cost:</strong> 
            <span class="value">${formatCurrency(results.monthlyCost)}</span>
        </div>
        <div class="result-item">
            <strong>Yearly Cost:</strong> 
            <span class="value">${formatCurrency(results.yearlyCost)}</span>
        </div>
        
        <h4 style="color: #1a3a5c; margin: 1rem 0 0.5rem 0;">Environmental Impact</h4>
        <div class="result-item">
            <strong>Daily CO₂ Emissions:</strong> 
            <span class="value">${formatNumber(results.dailyCO2)} kg</span>
        </div>
        <div class="result-item">
            <strong>Monthly CO₂ Emissions:</strong> 
            <span class="value">${formatNumber(results.monthlyCO2)} kg</span>
        </div>
        <div class="result-item">
            <strong>Yearly CO₂ Emissions:</strong> 
            <span class="value">${formatNumber(results.yearlyCO2)} kg</span>
        </div>
    `;
    
    container.innerHTML = html;
}