// --- STATE MACHINE REGISTRY VARIABLES ---
let currentFlow = ""; 
let currentStep = 0;

// Temporal Data Payload Dictionaries
let tempType = "";
let tempDetail = "";

// Data Persistence Collection Arrays
let emergencyRegistry = [];
let appointmentRegistry = [];

/**
 * Dial Session Root Processing Gateway Initialization
 */
function initiateUSSD() {
    currentFlow = "root";
    currentStep = 1;
    document.getElementById('idleScreen').style.display = 'none';
    document.getElementById('ussdBox').style.display = 'block';
    document.getElementById('ussdField').style.display = 'block';
    
    document.getElementById('ussdPrompt').innerText = `CON MEDILINK CENTRAL PORTAL\nSelect Intended Channel:\n1. 🚨 REPORT CRITICAL EMERGENCY\n2. 📅 BOOK OUTPATIENT APPOINTMENT`;
    document.getElementById('ussdField').value = "";
    document.getElementById('ussdField').focus();
}

/**
 * Sequential State Evaluation Matrix
 */
function handleUSSDStep() {
    const input = document.getElementById('ussdField').value.trim();
    if (!input) return;

    // --- ROOT BRANCH SYSTEM ROUTING ---
    if (currentFlow === "root" && currentStep === 1) {
        if (input === "1") {
            currentFlow = "emergency";
            currentStep = 1;
            document.getElementById('ussdPrompt').innerText = `CON EMERGENCY HANDSHAKE\nSelect Crisis Classification:\n1. Maternal / Delivery\n2. Severe Trauma / Road Crash\n3. Cardiac / Breathing Distress`;
        } else if (input === "2") {
            currentFlow = "appointment";
            currentStep = 1;
            document.getElementById('ussdPrompt').innerText = `CON OUTPATIENT SCHEDULER\nSelect Clinic Specialty:\n1. General Medical Care\n2. Pediatrics & Immunization\n3. Chronic Care / Diabetes Management`;
        } else {
            initiateUSSD();
        }
        document.getElementById('ussdField').value = "";
        return;
    }

    // --- CRITICAL CRISIS PIPELINE ENGINE ---
    if (currentFlow === "emergency") {
        if (currentStep === 1) {
            if (input === "1") tempType = "Maternal / Delivery";
            else if (input === "2") tempType = "Severe Trauma / Road Crash";
            else tempType = "Cardiac / Breathing Distress";
            
            currentStep = 2;
            document.getElementById('ussdPrompt').innerText = `CON LAC TRIANGULATION\nVerify Incident Sector Node:\n1. Harare Central\n2. Avondale Grid\n3. Highfield Sector`;
        } 
        else if (currentStep === 2) {
            let sector = "Harare Central";
            if (input === "2") sector = "Avondale Grid";
            if (input === "3") sector = "Highfield Sector";

            const caseId = "EM-" + Math.floor(100 + Math.random() * 900);
            const fleet = "Ambulance Asset " + Math.floor(1 + Math.random() * 5);

            emergencyRegistry.unshift({ id: caseId, type: tempType, location: sector, asset: fleet });
            
            // Activate vector spatial elements onto the admin grid layout
            document.getElementById('ambMarker').style.display = 'block';
            document.getElementById('incMarker').style.display = 'block';

            document.getElementById('ussdPrompt').innerText = `END CRISIS CAPTURED.\nCase: ${caseId}.\n${fleet} dispatched to cell tower perimeter near ${sector}. Keep line open.`;
            document.getElementById('ussdField').style.display = 'none';
            
            syncUIRegistries();
            switchView('emergencies');
        }
        document.getElementById('ussdField').value = "";
    }

    // --- OUTPATIENT BOOKING SCHEDULER ENGINE ---
    if (currentFlow === "appointment") {
        if (currentStep === 1) {
            if (input === "1") tempType = "General Medical Care";
            else if (input === "2") tempType = "Pediatrics & Immunization";
            else tempType = "Chronic Care / Diabetes";

            currentStep = 2;
            document.getElementById('ussdPrompt').innerText = `CON CALENDAR CONFIGURATION\nSelect Day Window Range:\n1. Earliest Available (Within 48h)\n2. Coming Weekend Window\n3. Mid-Next Week Allocation`;
        }
        else if (currentStep === 2) {
            let windowStr = "Within 48 Hours";
            if (input === "2") windowStr = "Coming Weekend Window";
            if (input === "3") windowStr = "Mid-Next Week Allocation";

            const patientId = "PT-" + Math.floor(1000 + Math.random() * 9000);
            appointmentRegistry.unshift({ id: patientId, clinic: tempType, slot: windowStr });

            document.getElementById('ussdPrompt').innerText = `END BOOKING CONFIRMED\nID: ${patientId}\nYour appointment voucher at ${tempType} is logged for [${windowStr}]. A confirmation SMS text will follow.`;
            document.getElementById('ussdField').style.display = 'none';

            syncUIRegistries();
            switchView('appointments');
        }
        document.getElementById('ussdField').value = "";
    }
}

/**
 * Drop Active Telecommunication Processing Handshake
 */
function abortSession() {
    document.getElementById('idleScreen').style.display = 'flex';
    document.getElementById('ussdBox').style.display = 'none';
}

/**
 * Viewport Toggle Management Engine
 * @param {string} target - Designated panel identifier view
 */
function switchView(target) {
    if (target === 'emergencies') {
        document.getElementById('viewEmergencies').style.display = 'block';
        document.getElementById('viewAppointments').style.display = 'none';
        document.getElementById('tabEmergencies').classList.add('active');
        document.getElementById('tabAppointments').classList.remove('active');
    } else {
        document.getElementById('viewEmergencies').style.display = 'none';
        document.getElementById('viewAppointments').style.display = 'block';
        document.getElementById('tabEmergencies').classList.remove('active');
        document.getElementById('tabAppointments').classList.add('active');
    }
}

/**
 * Sync Arrays to Structural HTML Elements Data Boards
 */
function syncUIRegistries() {
    // Sync Emergency Triage Elements
    document.getElementById('countEmerg').innerText = emergencyRegistry.length;
    document.getElementById('countFleets').innerText = emergencyRegistry.length;
    const eBody = document.getElementById('emergencyTableBody');
    
    if (emergencyRegistry.length === 0) {
        eBody.innerHTML = `<tr><td colspan="4" class="empty-row-msg">No operational active crisis signals tracked.</td></tr>`;
    } else {
        eBody.innerHTML = emergencyRegistry.map(item => `
            <tr>
                <td><span class="pill pill-emergency">${item.id}</span></td>
                <td><strong>${item.type}</strong></td>
                <td><code>${item.location}</code></td>
                <td><span class="pill pill-success">${item.asset}</span></td>
            </tr>
        `).join('');
    }

    // Sync Scheduled Medical Appointment Records
    document.getElementById('countAppts').innerText = appointmentRegistry.length;
    const aBody = document.getElementById('appointmentTableBody');
    
    if (appointmentRegistry.length === 0) {
        aBody.innerHTML = `<tr><td colspan="3" class="empty-row-msg">No upcoming outpatient scheduled bookings found.</td></tr>`;
    } else {
        aBody.innerHTML = appointmentRegistry.map(item => `
            <tr>
                <td><span class="pill pill-appointment">${item.id}</span></td>
                <td><strong>${item.clinic}</strong></td>
                <td><code>${item.slot}</code></td>
            </tr>
        `).join('');
    }
}