import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('bpForm');
    const recordsDiv = document.getElementById('records');
    const loadingSpinner = document.getElementById('loadingSpinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingSpinner.style.display = 'block';

        const systolic = document.getElementById('systolic').value;
        const diastolic = document.getElementById('diastolic').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        try {
            await backend.addBloodPressureRecord(systolic, diastolic, date, time);
            form.reset();
            await displayRecords();
            UIkit.notification('Blood pressure record added successfully!', {status: 'success', pos: 'top-center'});
        } catch (error) {
            console.error('Error adding record:', error);
            UIkit.notification('Failed to add blood pressure record. Please try again.', {status: 'danger', pos: 'top-center'});
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

    async function displayRecords() {
        try {
            const records = await backend.getBloodPressureRecords();
            recordsDiv.innerHTML = '';
            if (records.length === 0) {
                recordsDiv.innerHTML = '<div class="uk-alert uk-alert-primary" uk-alert><p>No records found.</p></div>';
            } else {
                records.forEach(record => {
                    const recordElement = document.createElement('div');
                    recordElement.className = 'uk-card uk-card-default uk-card-body uk-margin';
                    recordElement.innerHTML = `
                        <h3 class="uk-card-title">Blood Pressure Record</h3>
                        <p><strong>Systolic:</strong> ${record.systolic}</p>
                        <p><strong>Diastolic:</strong> ${record.diastolic}</p>
                        <p><strong>Date:</strong> ${record.date}</p>
                        <p><strong>Time:</strong> ${record.time}</p>
                    `;
                    recordsDiv.appendChild(recordElement);
                });
            }
        } catch (error) {
            console.error('Error fetching records:', error);
            recordsDiv.innerHTML = '<div class="uk-alert uk-alert-danger" uk-alert><p>Failed to fetch records. Please try again.</p></div>';
        }
    }

    await displayRecords();
});
