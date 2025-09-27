// ExportMenu component
// Following the clean architecture principle of single-responsibility components

import React, { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface ExportMenuProps {
  onExportCsv: () => Promise<void>;
  onExportJson: () => Promise<void>;
  onExportZip: () => Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
}

const ExportMenu: React.FC<ExportMenuProps> = ({
  onExportCsv,
  onExportJson,
  onExportZip,
  disabled = false,
  isLoading = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<'csv' | 'json' | 'zip' | null>(null);

  const handleExport = async (format: 'csv' | 'json' | 'zip') => {
    if (disabled || isLoading) return;

    setExportingFormat(format);
    setIsModalOpen(false);

    try {
      switch (format) {
        case 'csv':
          await onExportCsv();
          break;
        case 'json':
          await onExportJson();
          break;
        case 'zip':
          await onExportZip();
          break;
      }
    } catch (error) {
      console.error(`Export ${format} failed:`, error);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l4-4m-4 4l-4-4m8 2h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
      >
        Export
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Export Options"
        size="sm"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Choose your preferred export format:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={isLoading}
              className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium">CSV Export</div>
              <div className="text-sm text-gray-500">
                Comma-separated values with article metadata
              </div>
            </button>

            <button
              onClick={() => handleExport('json')}
              disabled={isLoading}
              className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium">JSON Export</div>
              <div className="text-sm text-gray-500">
                Structured data format with full article details
              </div>
            </button>

            <button
              onClick={() => handleExport('zip')}
              disabled={isLoading}
              className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium">ZIP Archive</div>
              <div className="text-sm text-gray-500">
                Download all PDFs as a compressed archive
              </div>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ExportMenu;
