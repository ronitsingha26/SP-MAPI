const axios = require('axios');
const API = 'http://localhost:5001/api';

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

    // 1. Test Public Endpoints
    await test('GET /public/stats', async () => {
        const res = await axios.get(`${API}/public/stats`);
        if (!res.data.success) throw new Error('Stats failed');
    });

    await test('GET /public/testimonials', async () => {
        const res = await axios.get(`${API}/public/testimonials`);
        if (!res.data.success) throw new Error('Testimonials failed');
    });

    // We can't easily test auth without creating an account or knowing creds, 
    // but let's test if we can hit the login endpoint with bad data
    await test('POST /auth/login with bad data returns 401/400 (not 500)', async () => {
        try {
            await axios.post(`${API}/auth/login`, { mobile: '0000000000', password: 'wrong' });
            throw new Error('Should have thrown an error');
        } catch (e) {
            if (e.response && e.response.status >= 500) {
                throw new Error('Internal Server Error 500');
            }
        }
    });

    await test('POST /admin/auth/login with bad data returns 401/400', async () => {
        try {
            await axios.post(`${API}/admin/auth/login`, { email: 'wrong@admin.com', password: 'wrong' });
            throw new Error('Should have thrown an error');
        } catch (e) {
            if (e.response && e.response.status >= 500) {
                throw new Error('Internal Server Error 500');
            }
        }
    });
    
    // Check Amin tracking API
    await test('GET /applications/track/INVALID should 404', async () => {
        try {
            await axios.get(`${API}/applications/track/INVALID`);
            throw new Error('Should have thrown 404');
        } catch (e) {
            if (e.response && e.response.status === 500) throw new Error('500 Error');
            if (e.response && e.response.status !== 404) throw new Error(`Unexpected status: ${e.response.status}`);
        }
    });

    console.log(`\nQA TESTS COMPLETE. PASSED: ${passed}, FAILED: ${failed}`);
    if (failed > 0) {
        console.log(JSON.stringify(errors, null, 2));
    }
}

runTests();
