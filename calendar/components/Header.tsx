import React from 'react';
import { PlusIcon } from './Icons';

interface HeaderProps {
    onAddNew: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddNew }) => {
    return (
        <header className="bg-white/80 dark:bg-rich-black/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        공모전 대시보드
                    </h1>
                    <button
                        onClick={onAddNew}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-rich-black focus:ring-brand-500 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">새 공모전 추가</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;