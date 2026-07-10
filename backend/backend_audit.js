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
            if (file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let issues = [];

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    
    // Check for hardcoded localhost
    if (content.includes('http://localhost') || content.includes('http://127.0.0.1')) {
        issues.push(`Hardcoded localhost found in ${f}`);
    }
    
    // Check for missing await in async functions (basic heuristic)
    // Looking for unhandled promises - difficult with simple regex, but can look for specific patterns
    if (content.match(/catch\s*\(\s*\)\s*\{/)) {
        issues.push(`Empty catch block found in ${f}`);
    }

    // Check for console.log in controllers/services (maybe not a bug, but worth noting)
    // if (content.includes('console.log')) {
    //    issues.push(`console.log found in ${f}`);
    // }
});

console.log("Backend Audit Complete. Issues found:", issues.length);
if (issues.length > 0) console.log(issues.join('\n'));
