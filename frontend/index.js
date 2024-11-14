import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('bpForm');
    const recordsDiv = document.getElementById('records');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const filterButton = document.getElementById('filterButton');
    const paginationDiv = document.getElementById('pagination');
    const chartContainer = document.getElementById('chartContainer');
    const chartCanvas = document.getElementById('bloodPressureChart');

    let records = [];
    let currentPage = 1;
    const recordsPerPage = 10;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingSpinner.style.display = 'block';

        const systolic = parseInt(document.getElementById('systolic').value, 10);
        const diastolic = parseInt(document.getElementById('diastolic').value, 10);
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        if (isNaN(systolic) || isNaN(diastolic) || systolic < 60 || systolic > 200 || diastolic < 40 || diastolic > 120) {
            UIkit.notification('Please enter valid blood pressure values.', {status: 'warning', pos: 'top-center'});
            loadingSpinner.style.display = 'none';
            return;
        }

        try {
            await backend.addBloodPressureRecord(systolic, diastolic, date, time);
            form.reset();
            await fetchRecords();
            UIkit.notification('Blood pressure record added successfully!', {status: 'success', pos: 'top-center'});
        } catch (error) {
            console.error('Error adding record:', error);
            UIkit.notification('Failed to add blood pressure record. Please try again.', {status: 'danger', pos: 'top-center'});
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

    filterButton.addEventListener('click', async () => {
        const filterDate = document.getElementById('filterDate').value;
        const filterTime = document.getElementById('filterTime').value;
        const filterSystolic = document.getElementById('filterSystolic').value;
        const filterDiastolic = document.getElementById('filterDiastolic').value;

        await fetchRecords(filterDate, filterTime, filterSystolic, filterDiastolic);
    });

    async function fetchRecords(date = '', time = '', systolic = '', diastolic = '') {
        try {
            records = await backend.getBloodPressureRecords();
            if (date || time || systolic || diastolic) {
                records = records.filter(record => {
                    const [recordSystolic, recordDiastolic, recordDate, recordTime] = record;
                    return (!date || recordDate === date) &&
                           (!time || recordTime === time) &&
                           (!systolic || recordSystolic === parseInt(systolic, 10)) &&
                           (!diastolic || recordDiastolic === parseInt(diastolic, 10));
                });
            }
            displayRecords();
            updateChart();
        } catch (error) {
            console.error('Error fetching records:', error);
            recordsDiv.innerHTML = '<div class="uk-alert uk-alert-danger" uk-alert><p>Failed to fetch records. Please try again.</p></div>';
        }
    }

    function displayRecords() {
        recordsDiv.innerHTML = '';
        if (records.length === 0) {
            recordsDiv.innerHTML = '<div class="uk-alert uk-alert-primary" uk-alert><p>No records found.</p></div>';
        } else {
            const startIndex = (currentPage - 1) * recordsPerPage;
            const endIndex = startIndex + recordsPerPage;
            const pageRecords = records.slice(startIndex, endIndex);

            pageRecords.forEach(record => {
                const [systolic, diastolic, date, time] = record;
                const recordElement = document.createElement('div');
                recordElement.className = 'uk-card uk-card-default uk-card-body uk-margin';
                recordElement.innerHTML = `
                    <h3 class="uk-card-title">Blood Pressure Record</h3>
                    <p><strong>Systolic:</strong> ${systolic}</p>
                    <p><strong>Diastolic:</strong> ${diastolic}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                `;
                recordsDiv.appendChild(recordElement);
            });

            updatePagination();
        }
    }

    function updatePagination() {
        paginationDiv.innerHTML = '';
        const totalPages = Math.ceil(records.length / recordsPerPage);
        if (totalPages > 1) {
            const pagination = document.createElement('ul');
            pagination.className = 'uk-pagination uk-flex-center';
            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#" class="${i === currentPage ? 'uk-active' : ''}">${i}</a>`;
                li.addEventListener('click', () => {
                    currentPage = i;
                    displayRecords();
                });
                pagination.appendChild(li);
            }
            paginationDiv.appendChild(pagination);
        }
    }

    function updateChart() {
        const ctx = chartCanvas.getContext('2d');
        const chartData = records.map(record => {
            const [systolic, diastolic, date, time] = record;
            return { x: new Date(`${date}T${time}`), y: systolic };
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Systolic Pressure',
                    data: chartData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    await fetchRecords();
});
