const fs = require('fs').promises;

async function debug() {
  const content = await fs.readFile('prompts/batch-1-heroes.txt', 'utf8');
  console.log('Content preview:');
  console.log(content.slice(0, 200));
  
  const lines = content.split('\n');
  console.log(`\nTotal lines: ${lines.length}`);
  
  // Show first 15 lines with line numbers
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
  }
  
  // Test parsing
  function parsePromptFile(content) {
    const lines = content.split('\n');
    const prompts = [];
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Skip comments and empty lines
      if (line.startsWith('#') || line === '') {
        i++;
        continue;
      }
      
      // Look for section headers like "## HERO 1/20 - PELUQUERIA (Hair Salon)"
      if (line.startsWith('## ')) {
        // Skip the header line
        i++;
        
        // Skip any empty lines after header
        while (i < lines.length && lines[i].trim() === '') {
          i++;
        }
        
        // The next non-empty line should be the prompt
        if (i < lines.length) {
          const promptLine = lines[i].trim();
          // Skip if it's a metadata line
          if (!promptLine.startsWith('Save as:') && !promptLine.startsWith('Location:') && !promptLine.startsWith('---')) {
            prompts.push(promptLine);
          }
        }
      }
      
      i++;
    }
    
    return prompts;
  }
  
  const prompts = parsePromptFile(content);
  console.log(`\nParsed prompts: ${prompts.length}`);
  prompts.forEach((p, idx) => {
    console.log(`${idx+1}: ${p.substring(0, 100)}...`);
  });
}

debug();