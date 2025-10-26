import React from 'react';
import { GridIcon, CalendarIcon } from './Icons';

interface ViewSwitcherProps {
  currentView: 'card' | 'calendar';
  onViewChange: (view: 'card' | 'calendar') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";
  const activeClasses = "bg-brand-600 text-white shadow";
  const inactiveClasses = "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700";

  return (
    <div className="mb-6 flex justify-center p-1 bg-slate-200/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm w-fit mx-auto">
      <button
        onClick={() => onViewChange('card')}
        className={`${baseClasses} ${currentView === 'card' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'card'}
      >
        <GridIcon className="w-5 h-5" />
        <span>카드 뷰</span>
      </button>
      <button
        onClick={() => onViewChange('calendar')}
        className={`${baseClasses} ${currentView === 'calendar' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'calendar'}
      >
        <CalendarIcon className="w-5 h-5" />
        <span>캘린더 뷰</span>
      </button>
    </div>
  );
};

export default ViewSwitcher;