const fs = require('fs').promises;

async function test() {
  try {
    const content = await fs.readFile('prompts/batch-1-heroes.txt', 'utf8');
    console.log('File read successfully');
    
    // Simple approach: just get lines that aren't comments or empty
    const lines = content.split('\n');
    const prompts = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('##') && 
          !trimmed.startsWith('Save as:') && !trimmed.startsWith('Location:') && 
          !trimmed.startsWith('---')) {
        prompts.push(trimmed);
      }
    }
    
    console.log(`Found ${prompts.length} prompts:`);
    prompts.forEach((p, i) => {
      console.log(`${i+1}: ${p.substring(0, 80)}...`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

test();