const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js') || file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let issues = [];

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    
    // Check for hardcoded localhost EXCEPT in utils/api.js if it uses env fallback
    if (f !== 'src/utils/api.js') {
        if (content.includes('http://localhost') || content.includes('http://127.0.0.1') || content.includes('localhost:5000')) {
            issues.push(`Hardcoded localhost found in ${f}`);
        }
    }
});

console.log("Frontend Audit Complete. Issues found:", issues.length);
if (issues.length > 0) console.log(issues.join('\n'));
