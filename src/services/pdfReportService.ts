import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Medicine } from '../utils/csvParser';

export interface ReportOptions {
  type: 'all' | 'upp' | 'thiqa' | 'basic' | 'brand' | 'manufacturer' | 'dosageForm';
  title: string;
  filterValue?: string;
  includeStats?: boolean;
  includePricing?: boolean;
  groupBy?: 'category' | 'manufacturer' | 'dosageForm' | 'none';
  sortBy?: 'name' | 'price' | 'priority';
}

export class PDFReportService {
  private static addHeader(doc: jsPDF, title: string, subtitle?: string) {
    // Company Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Primary blue
    doc.text('Smart Medicine Finder', 20, 25);
    
    // UAE Pharmacy branding
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('UAE Pharmacy - Medicine Database Report', 20, 35);
    
    // Report title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 20, 50);
    
    if (subtitle) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(subtitle, 20, 60);
    }
    
    // Date
    const date = new Date().toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${date}`, 20, subtitle ? 70 : 60);
    
    // Line separator
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(2);
    doc.line(20, subtitle ? 75 : 65, 190, subtitle ? 75 : 65);
    
    return subtitle ? 85 : 75;
  }
  
  private static addFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 20, 190, pageHeight - 20);
    
    // Page number
    doc.text(`Page ${pageNumber} of ${totalPages}`, 20, pageHeight - 10);
    
    // Company info
    doc.text('UAE Pharmacy | Smart Medicine Finder | Confidential Report', 190, pageHeight - 10, { align: 'right' });
  }
  
  private static addSummaryStats(doc: jsPDF, medicines: Medicine[], startY: number): number {
    const stats = {
      total: medicines.length,
      upp: medicines.filter(m => m.uppScope).length,
      thiqa: medicines.filter(m => m.thiqa).length,
      basic: medicines.filter(m => m.basic).length,
      avgPrice: medicines.reduce((sum, m) => sum + m.price, 0) / medicines.length,
      totalValue: medicines.reduce((sum, m) => sum + m.price, 0)
    };
    
    const dosageForms = [...new Set(medicines.map(m => m.dosageForm))].length;
    const manufacturers = [...new Set(medicines.map(m => m.manufacturer))].length;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary Statistics', 20, startY);
    
    const summaryData = [
      ['Total Medicines', stats.total.toString()],
      ['UPP Scope Medicines', stats.upp.toString()],
      ['Thiqa Medicines', stats.thiqa.toString()],
      ['Basic Formulary Medicines', stats.basic.toString()],
      ['Different Dosage Forms', dosageForms.toString()],
      ['Different Manufacturers', manufacturers.toString()],
      ['Average Price (AED)', stats.avgPrice.toFixed(2)],
      ['Total Portfolio Value (AED)', stats.totalValue.toFixed(2)]
    ];
    
    autoTable(doc, {
      startY: startY + 10,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40, halign: 'right' }
      }
    });
    
    return (doc as any).lastAutoTable.finalY + 20;
  }
  
  public static generateAllMedicinesReport(medicines: Medicine[], options: ReportOptions): void {
    const doc = new jsPDF();
    let currentY = this.addHeader(doc, options.title, `Complete medicine database report`);
    
    if (options.includeStats) {
      currentY = this.addSummaryStats(doc, medicines, currentY);
    }
    
    // Prepare table data
    const tableData = medicines.map(medicine => [
      medicine.id || '',
      medicine.name || '',
      medicine.genericName || '',
      medicine.strength || '',
      medicine.dosageForm || '',
      medicine.manufacturer || medicine.manufacturerName || '',
      medicine.agentName || '',
      medicine.uppScope ? 'Yes' : 'No',
      medicine.thiqa ? 'Yes' : 'No',
      medicine.basic ? 'Yes' : 'No',
      options.includePricing ? `AED ${(medicine.price || 0).toFixed(2)}` : 'N/A'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['DOH Code', 'Brand Name', 'Generic Name', 'Strength', 'Form', 'Manufacturer', 'Distributor', 'UPP', 'Thiqa', 'Basic', 'Price']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 12 },
        4: { cellWidth: 12 },
        5: { cellWidth: 22 },
        6: { cellWidth: 20 },
        7: { cellWidth: 8, halign: 'center' },
        8: { cellWidth: 8, halign: 'center' },
        9: { cellWidth: 8, halign: 'center' },
        10: { cellWidth: 12, halign: 'right' },
        11: { cellWidth: 15 },
        12: { cellWidth: 12 }
      }
    });
    
    this.addFooter(doc, 1, 1);
    doc.save(`Smart_Medicine_Database_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  public static generateUPPReport(medicines: Medicine[]): void {
    const uppMedicines = medicines.filter(m => m.uppScope);
    
    const doc = new jsPDF();
    let currentY = this.addHeader(doc, 'UPP Scope Medicines Report', `${uppMedicines.length} medicines covered under UPP scope`);
    
    currentY = this.addSummaryStats(doc, uppMedicines, currentY);
    
    const tableData = uppMedicines.map(medicine => [
      medicine.id,
      medicine.name,
      medicine.genericName,
      medicine.strength,
      medicine.dosageForm,
      medicine.manufacturer || medicine.manufacturerName || '',
      medicine.agentName || '',
      medicine.uppScope ? 'Yes' : 'No',
      medicine.thiqa ? 'Yes' : 'No',
      medicine.basic ? 'Yes' : 'No',
      `AED ${medicine.price.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['DOH Code', 'Brand Name', 'Generic Name', 'Strength', 'Form', 'Manufacturer', 'Distributor', 'UPP', 'Thiqa', 'Basic', 'Price']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129], textColor: 255 }, // Green for UPP
      styles: { fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 18 },
        2: { cellWidth: 18 },
        3: { cellWidth: 12 },
        4: { cellWidth: 12 },
        5: { cellWidth: 20 },
        6: { cellWidth: 18 },
        7: { cellWidth: 8, halign: 'center' },
        8: { cellWidth: 8, halign: 'center' },
        9: { cellWidth: 8, halign: 'center' },
        10: { cellWidth: 12, halign: 'right' }
      }
    });
    
    this.addFooter(doc, 1, 1);
    doc.save(`UPP_Medicines_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  public static generateThiqaReport(medicines: Medicine[]): void {
    const thiqaMedicines = medicines.filter(m => m.thiqa);
    
    const doc = new jsPDF();
    let currentY = this.addHeader(doc, 'Thiqa Medicines Report', `${thiqaMedicines.length} medicines covered under Thiqa formulary`);
    
    currentY = this.addSummaryStats(doc, thiqaMedicines, currentY);
    
    const tableData = thiqaMedicines.map(medicine => [
      medicine.id,
      medicine.name,
      medicine.genericName,
      medicine.strength,
      medicine.dosageForm,
      medicine.manufacturer || medicine.manufacturerName || '',
      medicine.agentName || '',
      medicine.uppScope ? 'Yes' : 'No',
      medicine.thiqa ? 'Yes' : 'No',
      medicine.basic ? 'Yes' : 'No',
      `AED ${medicine.price.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['DOH Code', 'Brand Name', 'Generic Name', 'Strength', 'Form', 'Manufacturer', 'Distributor', 'UPP', 'Thiqa', 'Basic', 'Price']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [124, 58, 237], textColor: 255 }, // Purple for Thiqa
      styles: { fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 18 },
        2: { cellWidth: 18 },
        3: { cellWidth: 12 },
        4: { cellWidth: 12 },
        5: { cellWidth: 20 },
        6: { cellWidth: 18 },
        7: { cellWidth: 8, halign: 'center' },
        8: { cellWidth: 8, halign: 'center' },
        9: { cellWidth: 8, halign: 'center' },
        10: { cellWidth: 12, halign: 'right' }
      }
    });
    
    this.addFooter(doc, 1, 1);
    doc.save(`Thiqa_Medicines_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  public static generateBasicFormularyReport(medicines: Medicine[]): void {
    const basicMedicines = medicines.filter(m => m.basic);
    
    const doc = new jsPDF();
    let currentY = this.addHeader(doc, 'Basic Drug Formulary Report', `${basicMedicines.length} medicines in basic formulary`);
    
    currentY = this.addSummaryStats(doc, basicMedicines, currentY);
    
    const tableData = basicMedicines.map(medicine => [
      medicine.id,
      medicine.name,
      medicine.genericName,
      medicine.strength,
      medicine.dosageForm,
      medicine.manufacturer || medicine.manufacturerName || '',
      medicine.agentName || '',
      medicine.uppScope ? 'Yes' : 'No',
      medicine.thiqa ? 'Yes' : 'No',
      medicine.basic ? 'Yes' : 'No',
      `AED ${medicine.price.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['DOH Code', 'Brand Name', 'Generic Name', 'Strength', 'Form', 'Manufacturer', 'Distributor', 'UPP', 'Thiqa', 'Basic', 'Price']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11], textColor: 255 }, // Orange for Basic
      styles: { fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 18 },
        2: { cellWidth: 18 },
        3: { cellWidth: 12 },
        4: { cellWidth: 12 },
        5: { cellWidth: 20 },
        6: { cellWidth: 18 },
        7: { cellWidth: 8, halign: 'center' },
        8: { cellWidth: 8, halign: 'center' },
        9: { cellWidth: 8, halign: 'center' },
        10: { cellWidth: 12, halign: 'right' }
      }
    });
    
    this.addFooter(doc, 1, 1);
    doc.save(`Basic_Formulary_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  public static generateDosageFormReport(medicines: Medicine[], dosageForm: string): void {
    const formMedicines = medicines.filter(m => m.dosageForm?.toLowerCase() === dosageForm.toLowerCase());
    
    const doc = new jsPDF();
    let currentY = this.addHeader(doc, `${dosageForm} Medicines Report`, `${formMedicines.length} medicines in ${dosageForm} form`);
    
    currentY = this.addSummaryStats(doc, formMedicines, currentY);
    
    const tableData = formMedicines.map(medicine => [
      medicine.id,
      medicine.name,
      medicine.genericName,
      medicine.strength,
      medicine.packageSize,
      medicine.manufacturer || medicine.manufacturerName || '',
      medicine.agentName || '',
      medicine.uppScope ? 'Yes' : 'No',
      medicine.thiqa ? 'Yes' : 'No',
      medicine.basic ? 'Yes' : 'No',
      `AED ${medicine.price.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['DOH Code', 'Brand Name', 'Generic Name', 'Strength', 'Package', 'Manufacturer', 'Distributor', 'UPP', 'Thiqa', 'Basic', 'Price']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 18 },
        2: { cellWidth: 18 },
        3: { cellWidth: 12 },
        4: { cellWidth: 12 },
        5: { cellWidth: 20 },
        6: { cellWidth: 18 },
        7: { cellWidth: 8, halign: 'center' },
        8: { cellWidth: 8, halign: 'center' },
        9: { cellWidth: 8, halign: 'center' },
        10: { cellWidth: 12, halign: 'right' }
      }
    });
    
    this.addFooter(doc, 1, 1);
    doc.save(`${dosageForm}_Medicines_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  public static generatePricingAnalysisReport(medicines: Medicine[]): void {
    const sortedByPrice = [...medicines].sort((a, b) => b.price - a.price);
    const expensiveMedicines = sortedByPrice.slice(0, 50); // Top 50 most expensive
    
    const doc = new jsPDF();
    let currentY = this.addHeader(doc, 'Pricing Analysis Report', 'Top 50 most expensive medicines');
    
    currentY = this.addSummaryStats(doc, medicines, currentY);
    
    const expensiveData = expensiveMedicines.map((medicine, index) => [
      (index + 1).toString(),
      medicine.name,
      medicine.genericName,
      medicine.dosageForm,
      `AED ${medicine.price.toFixed(2)}`,
      medicine.uppScope ? 'Yes' : 'No',
      medicine.thiqa ? 'Yes' : 'No',
      medicine.basic ? 'Yes' : 'No'
    ]);
    
    autoTable(doc, {
      startY: currentY + 10,
      head: [['Rank', 'Brand Name', 'Generic Name', 'Form', 'Price', 'UPP', 'Thiqa', 'Basic']],
      body: expensiveData,
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 127], textColor: 255 },
      styles: { fontSize: 8 }
    });
    
    this.addFooter(doc, 1, 1);
    doc.save(`Pricing_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
