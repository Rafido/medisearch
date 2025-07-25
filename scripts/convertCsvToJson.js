const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const csvFilePath = path.join(__dirname, '../public/skus.csv');
const jsonFilePath = path.join(__dirname, '../public/medicines.json');

const medicines = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    medicines.push({
      dohDrugCode: row['DOH Drug Code'],
      brandName: row['Brand Name'],
      genericName: row['Generic Name'],
      strength: row['Strength'],
      dosageForm: row['Dosage Form'],
      packageSize: row['Package Size'],
      uppScope: row['UPP Scope'] === 'Yes',
      inThiqa: row['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
      inBasicFormulary: row['Included In Basic Drug Formulary'] === 'Yes',
      packageMarkup: parseFloat((row['Package Markup'] || '0').replace(/,/g, ''))
    });
  })
  .on('end', () => {
    // Sort as per requirements
    medicines.sort((a, b) => {
      if (a.uppScope !== b.uppScope) return b.uppScope - a.uppScope;
      if (a.inThiqa !== b.inThiqa) return b.inThiqa - a.inThiqa;
      return b.inBasicFormulary - a.inBasicFormulary;
    });

    fs.writeFileSync(jsonFilePath, JSON.stringify(medicines, null, 2));
    console.log(`Successfully converted CSV to JSON. Total records: ${medicines.length}`);
  });
