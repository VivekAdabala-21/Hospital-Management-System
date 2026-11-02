
const API = "/api";

async function apiRequest(url, options = {}) {
    const response = await fetch(`${API}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const message = await response.text();

    if (!response.ok) {
        throw new Error(message || "Something went wrong");
    }

    if (!message) return null;

    try {
        return JSON.parse(message);
    } catch {
        return message;
    }
}

function showMessage(message) {
    alert(message);
}

// Dashboard statistics
async function loadDashboard() {
    try {
        const stats = await apiRequest("/dashboard/stats");

        document.getElementById("totalPatients").textContent =
            stats.totalPatients;

        document.getElementById("totalDoctors").textContent =
            stats.totalDoctors;

        document.getElementById("totalAppointments").textContent =
            stats.totalAppointments;
    } catch (error) {
        showMessage(error.message);
    }
}

// Load patients
async function loadPatients() {
    try {
        const patients = await apiRequest("/patients");
        const table = document.getElementById("patientTable");
        const dropdown = document.getElementById("appointmentPatient");

        table.innerHTML = "";
        dropdown.innerHTML = '<option value="">Select Patient</option>';

        patients.forEach(patient => {
            const row = document.createElement("tr");

            [
                patient.id,
                patient.name,
                patient.age,
                patient.gender
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.onclick = () => deletePatient(patient.id);

            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
            table.appendChild(row);

            const option = document.createElement("option");
            option.value = patient.id;
            option.textContent = `${patient.name} (ID: ${patient.id})`;
            dropdown.appendChild(option);
        });

    } catch (error) {
        showMessage(error.message);
    }
}

// Add patient
document.getElementById("patientForm").addEventListener("submit",
    async function(event) {
        event.preventDefault();

        const patient = {
            name: document.getElementById("patientName").value.trim(),
            age: Number(document.getElementById("patientAge").value),
            gender: document.getElementById("patientGender").value
        };

        try {
            await apiRequest("/patients", {
                method: "POST",
                body: JSON.stringify(patient)
            });

            showMessage("Patient added successfully!");
            this.reset();

            await refreshDashboard();
        } catch (error) {
            showMessage(error.message);
        }
    }
);

// Delete patient
async function deletePatient(id) {
    if (!confirm("Are you sure you want to delete this patient?")) {
        return;
    }

    try {
        await apiRequest(`/patients/${id}`, {
            method: "DELETE"
        });

        showMessage("Patient deleted successfully!");
        await refreshDashboard();

    } catch (error) {
        showMessage(error.message);
    }
}

// Load doctors
async function loadDoctors() {
    try {
        const doctors = await apiRequest("/doctors");
        const table = document.getElementById("doctorTable");
        const dropdown = document.getElementById("appointmentDoctor");

        table.innerHTML = "";
        dropdown.innerHTML = '<option value="">Select Doctor</option>';

        doctors.forEach(doctor => {
            const row = document.createElement("tr");

            [doctor.id, doctor.name, doctor.specialization]
                .forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

            table.appendChild(row);

            const option = document.createElement("option");
            option.value = doctor.id;
            option.textContent =
                `${doctor.name} - ${doctor.specialization}`;

            dropdown.appendChild(option);
        });

    } catch (error) {
        showMessage(error.message);
    }
}

// Load appointments
async function loadAppointments() {
    try {
        const appointments = await apiRequest("/appointments");
        const table = document.getElementById("appointmentTable");

        table.innerHTML = "";

        appointments.forEach(appointment => {
            const row = document.createElement("tr");

            [
                appointment.id,
                appointment.patientId,
                appointment.doctorId,
                appointment.appointmentDate
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

    } catch (error) {
        showMessage(error.message);
    }
}

// Book appointment
document.getElementById("appointmentForm").addEventListener("submit",
    async function(event) {
        event.preventDefault();

        const appointment = {
            patientId: Number(
                document.getElementById("appointmentPatient").value
            ),
            doctorId: Number(
                document.getElementById("appointmentDoctor").value
            ),
            appointmentDate:
                document.getElementById("appointmentDate").value
        };

        try {
            await apiRequest("/appointments", {
                method: "POST",
                body: JSON.stringify(appointment)
            });

            showMessage("Appointment booked successfully!");
            this.reset();

            await refreshDashboard();

        } catch (error) {
            showMessage(error.message);
        }
    }
);

// Refresh all dashboard data
async function refreshDashboard() {
    await Promise.all([
        loadDashboard(),
        loadPatients(),
        loadDoctors(),
        loadAppointments()
    ]);
}

// Start dashboard
document.addEventListener("DOMContentLoaded", refreshDashboard);
