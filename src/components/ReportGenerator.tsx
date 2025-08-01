import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  TrendingUp, 
  Shield, 
  Award, 
  Star,
  Pill,
  DollarSign,
  Building,
  ChevronDown,
  Calendar,
  BarChart3
} from 'lucide-react';
import { PDFReportService } from '../services/pdfReportService';
import type { Medicine } from '../utils/csvParser';
import styles from './ReportGenerator.module.css';

interface ReportGeneratorProps {
  medicines: Medicine[];
  onClose?: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ medicines, onClose }) => {
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [selectedDosageForm, setSelectedDosageForm] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [includeStats, setIncludeStats] = useState(true);
  const [includePricing, setIncludePricing] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Get unique values for filters
  const uniqueDosageForms = [...new Set(medicines.map(m => m.dosageForm).filter(Boolean))].sort();
  const uniqueBrands = [...new Set(medicines.map(m => m.name).filter(Boolean))].sort().slice(0, 50); // Limit for performance

  const reportTypes = [
    {
      id: 'all',
      title: 'Complete Database Report',
      description: 'Full medicine database with all details',
      icon: FileText,
      color: '#2563eb'
    },
    {
      id: 'upp',
      title: 'UPP Scope Medicines',
      description: 'Medicines covered under UPP scope',
      icon: Shield,
      color: '#10b981'
    },
    {
      id: 'thiqa',
      title: 'Thiqa Formulary Report',
      description: 'Medicines in Thiqa/ABM formulary',
      icon: Award,
      color: '#7c3aed'
    },
    {
      id: 'basic',
      title: 'Basic Drug Formulary',
      description: 'Basic formulary medicines',
      icon: Star,
      color: '#f59e0b'
    },
    {
      id: 'dosageForm',
      title: 'Dosage Form Analysis',
      description: 'Report by specific dosage form',
      icon: Pill,
      color: '#06b6d4'
    },
    {
      id: 'pricing',
      title: 'Pricing Analysis',
      description: 'Comprehensive pricing breakdown',
      icon: DollarSign,
      color: '#dc2626'
    },
    {
      id: 'brand',
      title: 'Brand Analysis',
      description: 'Report for specific brand',
      icon: Building,
      color: '#9333ea'
    }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      return;
    }

    setIsGenerating(true);
    
    try {
      const options = {
        type: selectedReportType as any,
        title: reportTypes.find(t => t.id === selectedReportType)?.title || 'Medicine Report',
        includeStats,
        includePricing,
        filterValue: selectedReportType === 'dosageForm' ? selectedDosageForm : selectedBrand
      };

      switch (selectedReportType) {
        case 'all':
          PDFReportService.generateAllMedicinesReport(medicines, options);
          break;
        case 'upp':
          PDFReportService.generateUPPReport(medicines);
          break;
        case 'thiqa':
          PDFReportService.generateThiqaReport(medicines);
          break;
        case 'basic':
          PDFReportService.generateBasicFormularyReport(medicines);
          break;
        case 'dosageForm':
          if (selectedDosageForm) {
            PDFReportService.generateDosageFormReport(medicines, selectedDosageForm);
          }
          break;
        case 'pricing':
          PDFReportService.generatePricingAnalysisReport(medicines);
          break;
        case 'brand':
          if (selectedBrand) {
            const brandMedicines = medicines.filter(m => m.name === selectedBrand);
            PDFReportService.generateAllMedicinesReport(brandMedicines, {
              ...options,
              title: `${selectedBrand} - Brand Report`
            });
          }
          break;
      }
      
      // Success - close modal after a brief delay
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);
    } catch (error) {
      console.error('Error generating report:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        selectedReportType,
        medicinesCount: medicines.length
      });
      alert(`Error generating report: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatsForType = (type: string) => {
    switch (type) {
      case 'all':
        return medicines.length;
      case 'upp':
        return medicines.filter(m => m.uppScope).length;
      case 'thiqa':
        return medicines.filter(m => m.thiqa).length;
      case 'basic':
        return medicines.filter(m => m.basic).length;
      case 'dosageForm':
        return selectedDosageForm ? medicines.filter(m => m.dosageForm === selectedDosageForm).length : 0;
      case 'brand':
        return selectedBrand ? medicines.filter(m => m.name === selectedBrand).length : 0;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.reportGenerator}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className={styles.title}>PDF Report Generator</h2>
            <p className={styles.subtitle}>Generate comprehensive medicine database reports</p>
          </div>
        </div>
        <div className={styles.statsChip}>
          <Calendar size={16} />
          <span>{medicines.length} Total Medicines</span>
        </div>
      </div>

      <div className={styles.reportGrid}>
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          const isSelected = selectedReportType === report.id;
          const medicineCount = getStatsForType(report.id);
          
          return (
            <div
              key={report.id}
              className={`${styles.reportCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedReportType(report.id)}
              style={{ '--accent-color': report.color } as React.CSSProperties}
            >
              <div className={styles.reportCardHeader}>
                <div className={styles.reportIcon}>
                  <IconComponent size={20} />
                </div>
                <div className={styles.reportCount}>
                  {medicineCount > 0 && <span>{medicineCount}</span>}
                </div>
              </div>
              <h3 className={styles.reportTitle}>{report.title}</h3>
              <p className={styles.reportDescription}>{report.description}</p>
              {isSelected && (
                <div className={styles.selectedIndicator}>
                  <div className={styles.selectedDot}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conditional Filters */}
      {selectedReportType === 'dosageForm' && (
        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>
            <Filter size={16} />
            Select Dosage Form
          </label>
          <select
            value={selectedDosageForm}
            onChange={(e) => setSelectedDosageForm(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Choose dosage form...</option>
            {uniqueDosageForms.map(form => (
              <option key={form} value={form}>
                {form} ({medicines.filter(m => m.dosageForm === form).length} medicines)
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedReportType === 'brand' && (
        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>
            <Building size={16} />
            Select Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Choose brand...</option>
            {uniqueBrands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Advanced Options */}
      <div className={styles.advancedSection}>
        <button
          className={styles.advancedToggle}
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          <span>Advanced Options</span>
          <ChevronDown 
            size={16} 
            className={`${styles.chevron} ${showAdvancedOptions ? styles.rotated : ''}`}
          />
        </button>

        {showAdvancedOptions && (
          <div className={styles.advancedOptions}>
            <div className={styles.optionGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={includeStats}
                  onChange={(e) => setIncludeStats(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Include Summary Statistics</span>
              </label>
              <p className={styles.optionDescription}>
                Add overview statistics and key metrics to the report
              </p>
            </div>

            <div className={styles.optionGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={includePricing}
                  onChange={(e) => setIncludePricing(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Include Pricing Information</span>
              </label>
              <p className={styles.optionDescription}>
                Include medicine prices and cost analysis in the report
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className={styles.actionSection}>
        <button
          className={styles.generateButton}
          onClick={handleGenerateReport}
          disabled={!selectedReportType || isGenerating || 
            (selectedReportType === 'dosageForm' && !selectedDosageForm) ||
            (selectedReportType === 'brand' && !selectedBrand)
          }
        >
          {isGenerating ? (
            <>
              <div className={styles.spinner}></div>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Generate PDF Report</span>
            </>
          )}
        </button>

        {selectedReportType && getStatsForType(selectedReportType) > 0 && (
          <div className={styles.reportPreview}>
            <TrendingUp size={16} />
            <span>
              This report will include {getStatsForType(selectedReportType)} medicines
              {includeStats && ' with summary statistics'}
              {includePricing && ' and pricing details'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
