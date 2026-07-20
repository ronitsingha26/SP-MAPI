const initSchema = require('./initSchema');
const patchDatabase = require('./patchDatabase');
const seedRbac = require('./seedRbac');
const seedTools = require('./seedTools');

async function runAll() {
  console.log('\n--- Starting Initialization Sequence ---');
  try {
    await initSchema();
    await patchDatabase();
    await seedRbac();
    await seedTools();
    console.log('--- Initialization Complete ---\n');
  } catch (err) {
    console.error('CRITICAL: Startup sequence failed!', err);
    throw err; // Let server.js handle the crash if necessary
  }
}

module.exports = { runAll };
