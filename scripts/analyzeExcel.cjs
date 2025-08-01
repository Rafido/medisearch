const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to analyze the Excel file
function analyzeExcelFile() {
  let output = '';
  
  function log(...args) {
    const message = args.join(' ');
    console.log(message);
    output += message + '\n';
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'Drugs.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      log('Drugs.xlsx file not found in public directory');
      return;
    }

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    log('📊 EXCEL FILE ANALYSIS');
    log('='.repeat(50));
    
    // List all sheet names
    log('📋 Sheet Names:');
    workbook.SheetNames.forEach((sheetName, index) => {
      log(`  ${index + 1}. ${sheetName}`);
    });
    log('');

    // Focus on "drugs" sheet if it exists
    const drugsSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('drug') || name.toLowerCase().includes('medicine') || name.toLowerCase() === 'drugs'
    );

    if (drugsSheetName) {
      log(`🎯 DETAILED ANALYSIS OF "${drugsSheetName}" SHEET`);
      log('='.repeat(50));
      
      const worksheet = workbook.Sheets[drugsSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      log(`📊 Total Records: ${jsonData.length}`);
      log('');
      
      if (jsonData.length > 0) {
        // Analyze the structure for mapping to Medicine interface
        const firstRecord = jsonData[0];
        log('�️  Available Fields:');
        Object.keys(firstRecord).forEach((key, index) => {
          log(`  ${index + 1}. ${key}`);
        });
        log('');

        log('📋 First Record Sample:');
        log(JSON.stringify(firstRecord, null, 2));
        log('');

        // Show a few more samples
        log('� Additional Sample Records:');
        for (let i = 1; i < Math.min(4, jsonData.length); i++) {
          log(`Record ${i + 1}:`);
          log(JSON.stringify(jsonData[i], null, 2));
          log('');
        }
      }
    } else {
      log('❌ No "drugs" sheet found. Available sheets:', workbook.SheetNames.join(', '));
      
      // Analyze the first sheet instead
      const firstSheetName = workbook.SheetNames[0];
      log(`📄 Analyzing first sheet: "${firstSheetName}"`);
      
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      log(`📊 Total Records: ${jsonData.length}`);
      
      if (jsonData.length > 0) {
        const firstRecord = jsonData[0];
        log('🗂️  Available Fields:');
        Object.keys(firstRecord).forEach((key, index) => {
          log(`  ${index + 1}. ${key}`);
        });
        log('');

        log('📋 First Record Sample:');
        log(JSON.stringify(firstRecord, null, 2));
      }
    }

    // Write output to file
    fs.writeFileSync('excel-analysis.txt', output);
    log('📄 Analysis saved to excel-analysis.txt');

  } catch (error) {
    log('❌ Error analyzing Excel file:', error.message);
  }
}

// Run the analysis
analyzeExcelFile();
