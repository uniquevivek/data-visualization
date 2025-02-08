// Area Chart
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/insights/')  // Replace with your actual API URL
    .then(response => response.json())
    .then(data => {
        const filteredData = data.filter(item => item.country && item.intensity !== null && item.intensity !== undefined);
        // Step 1: Aggregate Intensity by Country (Avoiding Null Values)
        const countryIntensityMap = {};

        filteredData.forEach(item => {
            const country = item.country || "Unknown"; // Default to 'Unknown'
            const intensity = item.intensity ?? 0; // Default to 0

            if (countryIntensityMap[country]) {
                countryIntensityMap[country] += intensity;
            } else {
                countryIntensityMap[country] = intensity;
            }
        });

        // Step 2: Prepare Data for the Area Chart
        const countries = Object.keys(countryIntensityMap);
        const intensities = Object.values(countryIntensityMap);

        // Step 3: Create Area Chart
        var ctx = document.getElementById('areaChart').getContext('2d');
        new Chart(ctx, {
            type: 'line', // Line chart with area fill
            data: {
                labels: countries,
                datasets: [{
                    label: 'Total Intensity by Country',
                    data: intensities,
                    fill: true, // Enables area under the line
                    backgroundColor: 'rgba(54, 162, 235, 0.3)', // Light fill color
                    borderColor: 'rgba(54, 162, 235, 1)', // Line color
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Points on line
                    tension: 0.4 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
});


// Donut chart
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/insights/')  // Replace with your actual API URL
    .then(response => response.json())
    .then(data => {
        // Step 1: Aggregate Data by Sector (Summing Intensity, Relevance & Likelihood)
        const sectorData = {};

        data.forEach(item => {
            const sector = item.sector || "Unknown"; // Default to 'Unknown'
            const intensity = item.intensity ?? 0; 
            const relevance = item.relevance ?? 0; 
            const likelihood = item.likelihood ?? 0;

            if (!sectorData[sector]) {
                sectorData[sector] = { total: 0 };
            }
            sectorData[sector].total += intensity + relevance + likelihood;
        });

        // Step 2: Prepare Data for the Donut Chart
        const sectors = Object.keys(sectorData);
        const values = sectors.map(sector => sectorData[sector].total);

        // Step 3: Create Donut Chart
        var ctx = document.getElementById('donutChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sectors,
                datasets: [{
                    label: 'Sector Analysis',
                    data: values,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 205, 86, 0.6)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
});


// polarChart

document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/insights/')  // Replace with your actual endpoint URL
    .then(response => response.json())
    .then(data => {
        const filteredData = data.filter(item => item.country && item.intensity !== null && item.intensity !== undefined);
        // Step 1: Aggregate Intensity by Country
        const countryIntensityMap = {};

        // Loop through each entry and aggregate intensity by country
        filteredData.forEach(item => {
            const country = item.country;
            const intensity = item.intensity || 0;

            // If country already exists, sum the intensities
            if (countryIntensityMap[country]) {
                countryIntensityMap[country] += intensity;
            } else {
                countryIntensityMap[country] = intensity;
            }
        });

        // Step 2: Prepare Data for the Polar Chart
        const countries = Object.keys(countryIntensityMap);
        const intensities = Object.values(countryIntensityMap);

        // Step 3: Create Polar Chart
        var ctx = document.getElementById('polarChart').getContext('2d');
        new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: countries,
                datasets: [{
                    label: 'Total Intensity by Country',
                    data: intensities,
                    backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                    borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
});


// Bar-Pie Chart
                            fetch("/api/insights/")
                            .then(response => response.json())
                            .then(data => {
                                // Extract data for charts
                                let sectors = {};
                                let countries = {};
                
                                data.forEach(entry => {
                                    // Count intensity per sector
                                    if (entry.sector) {
                                        sectors[entry.sector] = (sectors[entry.sector] || 0) + entry.intensity;
                                    }
                                    
                                    // Count relevance per country
                                    if (entry.country) {
                                        countries[entry.country] = (countries[entry.country] || 0) + entry.relevance;
                                    }
                                });
                
                                // Convert data to chart format
                                let sectorLabels = Object.keys(sectors);
                                let sectorValues = Object.values(sectors);
                
                                let countryLabels = Object.keys(countries);
                                let countryValues = Object.values(countries);
                
                                // Chart 1: Intensity by Sector
                                new Chart(document.getElementById("intensityChart"), {
                                    type: "bar",
                                    data: {
                                        labels: sectorLabels,
                                        datasets: [{
                                            label: "Intensity by Sector",
                                            data: sectorValues,
                                            backgroundColor: "rgba(75, 192, 192, 0.6)"
                                        }]
                                    }
                                });
                
                                // Chart 2: Relevance by Country
                                new Chart(document.getElementById("relevanceChart"), {
                                    type: "pie",
                                    data: {
                                        labels: countryLabels,
                                        datasets: [{
                                            label: "Relevance by Country",
                                            data: countryValues,
                                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
                                        }]
                                    }
                                });
                            });


   // 