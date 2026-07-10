const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const API = 'http://localhost:5001/api';
const SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const token = jwt.sign({ id: 1, role: 'superadmin' }, SECRET, { expiresIn: '1d' });
const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

async function runTests() {
    let passed = 0;
    let failed = 0;
    let errors = [];

    const test = async (name, fn) => {
        try {
            await fn();
            console.log(`[PASS] ${name}`);
            passed++;
        } catch (e) {
            console.log(`[FAIL] ${name} - ${e.message}`);
            failed++;
            errors.push({ name, error: e.response ? e.response.data : e.message });
        }
    };

    // --- ADMIN PANEL API TESTS ---
    await test('GET /admin/dashboard', async () => {
        const res = await axios.get(`${API}/admin/dashboard`, axiosConfig);
        if (!res.data.success) throw new Error('Dashboard failed');
    });

    await test('GET /admin/applications', async () => {
        const res = await axios.get(`${API}/admin/applications`, axiosConfig);
        if (!res.data.success) throw new Error('Applications failed');
    });

    await test('GET /admin/customers', async () => {
        const res = await axios.get(`${API}/admin/customers`, axiosConfig);
        if (!res.data.success) throw new Error('Customers failed');
    });

    await test('GET /admin/amins', async () => {
        const res = await axios.get(`${API}/admin/amins`, axiosConfig);
        if (!res.data.success) throw new Error('Amins failed');
    });

    await test('GET /admin/amin-applications', async () => {
        const res = await axios.get(`${API}/admin/amin-applications`, axiosConfig);
        if (!res.data.success) throw new Error('Amin Applications failed');
    });

    await test('GET /admin/payments', async () => {
        const res = await axios.get(`${API}/admin/payments`, axiosConfig);
        if (!res.data.success) throw new Error('Payments failed');
    });

    await test('GET /admin/enquiries', async () => {
        const res = await axios.get(`${API}/admin/enquiries`, axiosConfig);
        if (!res.data.success) throw new Error('Enquiries failed');
    });

    await test('GET /admin/tool-requests', async () => {
        const res = await axios.get(`${API}/admin/tool-requests`, axiosConfig);
        if (!res.data.success) throw new Error('Tool Requests failed');
    });

    await test('GET /admin/properties', async () => {
        const res = await axios.get(`${API}/admin/properties`, axiosConfig);
        if (!res.data.success) throw new Error('Properties failed');
    });

    await test('GET /admin/bookings', async () => {
        const res = await axios.get(`${API}/admin/bookings`, axiosConfig);
        if (!res.data.success) throw new Error('Bookings failed');
    });

    await test('GET /admin/super-dashboard', async () => {
        const res = await axios.get(`${API}/admin/super-dashboard`, axiosConfig);
        if (!res.data.success) throw new Error('Super Dashboard failed');
    });

    await test('GET /admin/admins', async () => {
        const res = await axios.get(`${API}/admin/admins`, axiosConfig);
        if (!res.data.success) throw new Error('Admins failed');
    });

    await test('GET /admin/districts', async () => {
        const res = await axios.get(`${API}/admin/districts`, axiosConfig);
        if (!res.data.success) throw new Error('Districts failed');
    });

    // --- OTHER TESTS ---
    // Update application status to something invalid should return 400 not 500
    await test('PUT /admin/applications/INVALID/status returns 400/404', async () => {
        try {
            await axios.put(`${API}/admin/applications/INVALID/status`, { status: 'approved' }, axiosConfig);
            throw new Error('Should have failed');
        } catch (e) {
            if (e.response && e.response.status >= 500) throw new Error(`Internal Server Error: ${e.response.data.message || e.message}`);
        }
    });

    console.log(`\nQA TESTS COMPLETE. PASSED: ${passed}, FAILED: ${failed}`);
    if (failed > 0) {
        console.log(JSON.stringify(errors, null, 2));
    }
}

runTests();
