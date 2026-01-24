import axios from 'axios';

const BASE_URL = 'https://vendor-panel-zdeu.onrender.com/api';

async function checkHealth() {
    try {
        console.log(`Checking health of ${BASE_URL}/health ...`);
        const res = await axios.get(`${BASE_URL}/health`);
        console.log("Status:", res.status);
        console.log("Data:", res.data);
    } catch (err) {
        console.error("Health Check Failed:");
        if (err.response) {
            console.error(`Status: ${err.response.status}`);
            console.error("Data:", err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

async function checkLoginEndpoint() {
    try {
        console.log(`\nChecking login endpoint (expecting 400/404/401)...`);
        // We expect a failure, but we want to see the JSON structure
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            email: "nonexistent@test.com",
            password: "dummy"
        });
        console.log("Login Surprise Success:", res.data);
    } catch (err) {
        console.error("Login Expected Failure:");
        if (err.response) {
            console.error(`Status: ${err.response.status}`);
            console.log("Data:", err.response.data); // This is what I want to see
        } else {
            console.error(err.message);
        }
    }
}

async function run() {
    await checkHealth();
    await checkLoginEndpoint();
}

run();
