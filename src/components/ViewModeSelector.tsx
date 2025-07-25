import React from 'react';
import { Grid, List } from 'lucide-react';
import styles from './ViewModeSelector.module.css';

export type ViewMode = 'grid' | 'list';

interface ViewModeSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className={styles.viewModeSelector}>
      <button
        className={`${styles.viewModeButton} ${
          currentView === 'grid' ? styles.active : ''
        }`}
        onClick={() => onViewChange('grid')}
        title="Grid View"
        aria-label="Switch to grid view"
      >
        <Grid size={18} />
        <span>Grid</span>
      </button>
      <button
        className={`${styles.viewModeButton} ${
          currentView === 'list' ? styles.active : ''
        }`}
        onClick={() => onViewChange('list')}
        title="List View"
        aria-label="Switch to list view"
      >
        <List size={18} />
        <span>List</span>
      </button>
    </div>
  );
};
