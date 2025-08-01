const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to analyze the Excel file
function analyzeExcelFile() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'Drugs.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Drugs.xlsx file not found in public directory');
      return;
    }

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    console.log('📊 EXCEL FILE ANALYSIS');
    console.log('='.repeat(50));
    
    // List all sheet names
    console.log('📋 Sheet Names:');
    workbook.SheetNames.forEach((sheetName, index) => {
      console.log(`  ${index + 1}. ${sheetName}`);
    });
    console.log();

    // Analyze each sheet
    workbook.SheetNames.forEach((sheetName) => {
      console.log(`📄 Sheet: "${sheetName}"`);
      console.log('-'.repeat(30));
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        console.log('  ⚠️  Empty sheet');
        console.log();
        return;
      }

      // Get headers (first row)
      const headers = jsonData[0];
      console.log(`  📊 Total Rows: ${jsonData.length}`);
      console.log(`  📊 Total Columns: ${headers.length}`);
      console.log();
      
      console.log('  🏷️  Column Headers:');
      headers.forEach((header, index) => {
        console.log(`    ${index + 1}. ${header}`);
      });
      console.log();

      // Show first few data rows (excluding header)
      if (jsonData.length > 1) {
        console.log('  📝 Sample Data (first 3 rows):');
        const sampleRows = jsonData.slice(1, Math.min(4, jsonData.length));
        sampleRows.forEach((row, index) => {
          console.log(`    Row ${index + 2}:`);
          headers.forEach((header, colIndex) => {
            const value = row[colIndex] || 'N/A';
            console.log(`      ${header}: ${value}`);
          });
          console.log();
        });
      }

      // Analyze data types for each column
      if (jsonData.length > 1) {
        console.log('  🔍 Column Data Analysis:');
        headers.forEach((header, colIndex) => {
          const columnData = jsonData.slice(1).map(row => row[colIndex]).filter(val => val !== undefined && val !== null && val !== '');
          const uniqueValues = [...new Set(columnData)].length;
          const sampleValues = columnData.slice(0, 3);
          const dataType = typeof columnData[0];
          
          console.log(`    ${header}:`);
          console.log(`      - Data Type: ${dataType}`);
          console.log(`      - Non-empty values: ${columnData.length}`);
          console.log(`      - Unique values: ${uniqueValues}`);
          console.log(`      - Sample values: ${sampleValues.join(', ')}`);
          console.log();
        });
      }
      
      console.log('='.repeat(50));
    });

    // Focus on "drugs" sheet if it exists
    const drugsSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('drug') || name.toLowerCase().includes('medicine')
    );

    if (drugsSheetName) {
      console.log(`🎯 DETAILED ANALYSIS OF "${drugsSheetName}" SHEET`);
      console.log('='.repeat(50));
      
      const worksheet = workbook.Sheets[drugsSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`📊 Total Records: ${jsonData.length}`);
      console.log();
      
      if (jsonData.length > 0) {
        // Analyze the structure for mapping to Medicine interface
        const firstRecord = jsonData[0];
        console.log('🗂️  Available Fields:');
        Object.keys(firstRecord).forEach((key, index) => {
          console.log(`  ${index + 1}. ${key}`);
        });
        console.log();

        console.log('📋 First Record Sample:');
        console.log(JSON.stringify(firstRecord, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error analyzing Excel file:', error);
  }
}

// Run the analysis
analyzeExcelFile();
