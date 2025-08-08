// src/components/settings/DataManagement.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MeasurementService } from '../../../services/database';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const DataManagement: React.FC = () => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const exportData = await MeasurementService.exportData();
      
      // Create download
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pregnancy-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('idle');

    try {
      const text = await file.text();
      const success = await MeasurementService.importData(text);
      
      if (success) {
        setImportStatus('success');
        // Refresh the page to load new data
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setImportStatus('error');
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportPDF = async () => {
    // Future enhancement - generate PDF report
    console.log('PDF export - to be implemented');
  };

  return (
    <div className="data-management">
      <div className="form-section">
        <h3 className="form-section-title">{t('settings.dataManagement')}</h3>
        
        {/* Export Section */}
        <div className="management-group">
          <h4>{t('settings.exportData')}</h4>
          <p className="management-description">
            {t('settings.exportDescription')}
          </p>
          
          <div className="btn-group">
            <button 
              onClick={handleExportData} 
              disabled={isExporting}
              className="btn btn-secondary"
            >
              {isExporting ? (
                <>
                  <LoadingSpinner size="small" />
                  {t('settings.exporting')}
                </>
              ) : (
                <>
                  📊 {t('settings.exportJSON')}
                </>
              )}
            </button>
            
            <button 
              onClick={handleExportPDF}
              className="btn btn-tertiary"
              disabled
            >
              📋 {t('settings.exportPDF')} {t('common.comingSoon')}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="management-group">
          <h4>{t('settings.importData')}</h4>
          <p className="management-description">
            {t('settings.importDescription')}
          </p>
          
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              disabled={isImporting}
              className="file-input"
              id="import-file"
            />
            <label htmlFor="import-file" className="btn btn-secondary">
              {isImporting ? (
                <>
                  <LoadingSpinner size="small" />
                  {t('settings.importing')}
                </>
              ) : (
                <>
                  📁 {t('settings.selectFile')}
                </>
              )}
            </label>
          </div>

          {importStatus === 'success' && (
            <div className="status-message success">
              ✅ {t('settings.importSuccess')}
            </div>
          )}
          
          {importStatus === 'error' && (
            <div className="status-message error">
              ❌ {t('settings.importError')}
            </div>
          )}
        </div>

        {/* Backup Information */}
        <div className="management-group">
          <h4>{t('settings.backupInfo')}</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">{t('settings.storageLocation')}</span>
              <span className="info-value">{t('settings.localBrowser')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t('settings.recommendation')}</span>
              <span className="info-value">{t('settings.regularBackups')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;