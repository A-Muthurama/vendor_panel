import fetch from "node-fetch";

const checkHealth = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/health");
        const text = await res.text();
        console.log("Health Check Response:", text.substring(0, 500)); // Log first 500 chars
    } catch (err) {
        console.error("Health Check Failed:", err.message);
    }
};

checkHealth();
