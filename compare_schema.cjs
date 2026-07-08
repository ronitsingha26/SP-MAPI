const fs = require('fs');

function extractTables(sql) {
    const tables = {};
    const matches = sql.match(/CREATE TABLE IF NOT EXISTS [a-zA-Z0-9_]+ \([\s\S]*?\);/g) || [];
    for (const match of matches) {
        const tableNameMatch = match.match(/CREATE TABLE IF NOT EXISTS ([a-zA-Z0-9_]+)/);
        if (!tableNameMatch) continue;
        const tableName = tableNameMatch[1];
        const lines = match.split('\n').slice(1, -1);
        const columns = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('PRIMARY KEY') || trimmed.startsWith('FOREIGN KEY') || trimmed.startsWith('INDEX') || trimmed.startsWith('UNIQUE') || trimmed.startsWith('CONSTRAINT') || trimmed.startsWith(')')) {
                continue;
            }
            const colNameMatch = trimmed.match(/^([a-zA-Z0-9_]+)/);
            if (colNameMatch) {
                columns.push(colNameMatch[1].toLowerCase());
            }
        }
        tables[tableName] = columns;
    }
    return tables;
}

const localSql = fs.readFileSync('./backend/db/schema.sql', 'utf-8');
const prodSql = fs.readFileSync('./production/hostinger.sql', 'utf-8');

const localTables = extractTables(localSql);
const prodTables = extractTables(prodSql);

for (const [table, cols] of Object.entries(localTables)) {
    if (!prodTables[table]) {
        console.log(`Table missing in production: ${table}`);
        continue;
    }
    const prodCols = new Set(prodTables[table]);
    for (const col of cols) {
        if (!prodCols.has(col)) {
            console.log(`Column missing in production: ${table}.${col}`);
        }
    }
}
