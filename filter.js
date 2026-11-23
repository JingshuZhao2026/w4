let allData = [];
let chart = null;

// Load CSV data
Papa.parse('w4.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {

        allData = results.data;

        populateFilter();

        drawPage(allData);

        document
            .getElementById('typeFilter')
            .addEventListener('change', filterData);
    },

    error: function(error) {
        console.error('Failed to load CSV:', error);
    }
});

// Create the platform filter
function populateFilter() {

    const filter =
        document.getElementById('typeFilter');

    filter.innerHTML = '';

    filter.add(new Option('All Platforms', 'All'));

    const values =
        [...new Set(allData.map(row => row.Most_Used_Platform))]
        .filter(value => value)
        .sort();

    values.forEach(value => {
        filter.add(new Option(value, value));
    });
}

// Filter students by most used platform
function filterData() {

    const selected =
        document.getElementById('typeFilter').value;

    let filteredData;

    if (selected === 'All') {
        filteredData = allData;
    } else {
        filteredData = allData.filter(
            row => row.Most_Used_Platform === selected
        );
    }

    drawPage(filteredData);
}

// Update the table and scatter chart
function drawPage(data) {

    const tbody =
        document.querySelector('#dataTable tbody');

    tbody.innerHTML = '';

    const points = [];

    data.forEach(row => {

        const usage =
            Number(row.Avg_Daily_Usage_Hours);

        const score =
            Number(row.Addicted_Score);

        // Build table row
        const tr = document.createElement('tr');

        [
            row.Avg_Daily_Usage_Hours,
            row.Addicted_Score,
            row.Most_Used_Platform
        ].forEach(value => {

            const td = document.createElement('td');
            td.textContent = value ?? '';
            tr.appendChild(td);
        });

        tbody.appendChild(tr);

        // Build scatter chart data
        if (
            row.Avg_Daily_Usage_Hours !== '' &&
            row.Addicted_Score !== '' &&
            Number.isFinite(usage) &&
            Number.isFinite(score)
        ) {
            points.push({
                x: usage,
                y: score
            });
        }
    });

    // Destroy old chart before updating
    if (chart) {
        chart.destroy();
    }

    // Create scatter chart
    chart = new Chart(
        document.getElementById('revenueChart'),
        {
            type: 'scatter',

            data: {
                datasets: [{
                    label: 'Undergraduate Students',
                    data: points,
                    backgroundColor: '#4e79a7'
                }]
            },

            options: {
                responsive: true,

                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Average Daily Usage (Hours)'
                        }
                    },

                    y: {
                        title: {
                            display: true,
                            text: 'Addiction Score'
                        }
                    }
                }
            }
        }
    );
}

