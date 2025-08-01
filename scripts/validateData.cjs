const fs = require('fs');
const path = require('path');

function validateMedicinesData() {
  try {
    console.log('🔍 Validating medicines.json data...');
    console.log('====================================');
    
    const jsonPath = path.join(process.cwd(), 'public', 'medicines.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ medicines.json file not found');
      return false;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    if (!Array.isArray(data)) {
      console.error('❌ Data is not an array');
      return false;
    }

    console.log(`📊 Total records: ${data.length}`);
    
    if (data.length === 0) {
      console.error('❌ No records found');
      return false;
    }

    // Validate structure
    const sample = data[0];
    const requiredFields = ['id', 'name', 'genericName', 'price'];
    const missingFields = requiredFields.filter(field => !(field in sample));
    
    if (missingFields.length > 0) {
      console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

    console.log('✅ Required fields present');

    // Validate data quality
    const validRecords = data.filter(record => 
      record.id && record.name && record.genericName
    );
    
    console.log(`✅ Valid records: ${validRecords.length}/${data.length}`);
    
    if (validRecords.length < data.length * 0.9) {
      console.warn('⚠️  Less than 90% of records are valid');
    }

    // Show sample data
    console.log('\n📋 Sample record:');
    console.log(`   ID: ${sample.id}`);
    console.log(`   Name: ${sample.name}`);
    console.log(`   Generic: ${sample.genericName}`);
    console.log(`   Price: ${sample.price} AED`);
    console.log(`   Category: ${sample.category}`);
    console.log(`   In Stock: ${sample.inStock}`);

    // Show statistics
    const categories = {};
    const inStock = data.filter(m => m.inStock).length;
    const uppScope = data.filter(m => m.uppScope).length;
    const thiqa = data.filter(m => m.thiqa).length;
    const basic = data.filter(m => m.basic).length;
    
    data.forEach(m => {
      categories[m.category] = (categories[m.category] || 0) + 1;
    });

    console.log('\n📈 Statistics:');
    console.log(`   - Active/In Stock: ${inStock}`);
    console.log(`   - UPP Scope: ${uppScope}`);
    console.log(`   - Thiqa: ${thiqa}`);
    console.log(`   - Basic: ${basic}`);
    
    console.log('\n📊 Categories:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count}`);
    });

    // File size
    const stats = fs.statSync(jsonPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n💾 File size: ${fileSizeMB} MB`);

    console.log('\n🎉 Validation completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

// Run validation
const isValid = validateMedicinesData();
process.exit(isValid ? 0 : 1);
