const fs = require('fs');

const schema = fs.readFileSync('db/schema.sql', 'utf8');

// Extract all table names and their columns
let tables = {};
let currentTable = null;

schema.split('\n').forEach(line => {
    line = line.trim();
    if (line.startsWith('CREATE TABLE')) {
        let match = line.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?([^\s\(]+)/i);
        if (match) {
            currentTable = match[1].replace(/`/g, '');
            tables[currentTable] = [];
        }
    } else if (currentTable && line.startsWith(')')) {
        currentTable = null;
    } else if (currentTable && line.length > 0 && !line.startsWith('--')) {
        // basic column extraction
        let colMatch = line.match(/^`?([a-zA-Z0-9_]+)`?\s+/);
        if (colMatch) {
            tables[currentTable].push(colMatch[1]);
        }
    }
});

// Now read all repositories
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.js')) { 
            results.push(file);
        }
    });
    return results;
}
const path = require('path');
const repos = walk('./src/repositories');

let errors = [];

repos.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    
    // Quick regex to find INTO table_name or FROM table_name or UPDATE table_name
    let matches = [...content.matchAll(/(?:FROM|JOIN|INTO|UPDATE)\s+([a-zA-Z0-9_]+)/gi)];
    matches.forEach(m => {
        let tableName = m[1];
        if (tableName.toLowerCase() !== 'set' && tableName.toLowerCase() !== 'values' && !tables[tableName]) {
            // some might be SQL keywords or aliases, but let's log them to verify
            if (!['DUPLICATE', 'KEY', '1'].includes(tableName.toUpperCase())) {
                errors.push(`Table ${tableName} used in ${f} not found in schema.sql`);
            }
        }
    });
});

console.log("Found Tables in Schema:");
console.log(Object.keys(tables));
console.log("\nPotential Missing Tables:");
const uniqueErrors = [...new Set(errors)];
console.log(uniqueErrors.join('\n'));

