import React from 'react';
import { Contest } from '../types';
import { CalendarIcon, TrophyIcon, DocumentIcon, LinkIcon, PencilIcon, TrashIcon, UserGroupIcon, CheckCircleIcon, MegaphoneIcon, ClipboardDocumentListIcon } from './Icons';

interface ContestCardProps {
  contest: Contest;
  onEdit: () => void;
  onDelete: () => void;
}

const CONTEST_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

const getContestColor = (contestId: string): string => {
  if (!contestId) {
    return CONTEST_COLORS[0];
  }
  let hash = 0;
  for (let i = 0; i < contestId.length; i++) {
    const char = contestId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % CONTEST_COLORS.length;
  return CONTEST_COLORS[index];
};


const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric'});

const DDayBadge: React.FC<{ deadline: string }> = ({ deadline }) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set today to the end of the day

  const diffTime = new Date(deadline).setHours(0,0,0,0) - new Date().setHours(0,0,0,0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let text = `D-${diffDays}`;
  let bgColor = 'bg-brand-100 dark:bg-brand-900/50';
  let textColor = 'text-brand-800 dark:text-brand-200';

  if (diffDays < 0) {
    text = '마감';
    bgColor = 'bg-slate-200 dark:bg-slate-700';
    textColor = 'text-slate-800 dark:text-slate-200';
  } else if (diffDays === 0) {
    text = 'D-Day';
    bgColor = 'bg-red-100 dark:bg-red-900';
    textColor = 'text-red-800 dark:text-red-200';
  } else if (diffDays <= 7) {
    bgColor = 'bg-orange-100 dark:bg-orange-900';
    textColor = 'text-orange-800 dark:text-orange-200';
  }

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${bgColor} ${textColor} flex-shrink-0`}>
      {text}
    </span>
  );
};

const ContestCard: React.FC<ContestCardProps> = ({ contest, onEdit, onDelete }) => {
  const submittedCount = contest.participants?.filter(p => p.submitted).length || 0;
  const totalParticipants = contest.participants?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className={`h-2 ${getContestColor(contest.id)}`} />
      <div className="h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
        {contest.poster ? (
          <img src={contest.poster} alt={`${contest.name} Poster`} className="w-full h-full object-cover" />
        ) : (
          <DocumentIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 pr-2 leading-tight">{contest.name}</h3>
            <DDayBadge deadline={contest.deadline} />
        </div>
        
        <div className="space-y-3 text-slate-600 dark:text-slate-300 mt-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-500" />
            <span>{formatDate(contest.startDate)} ~ {formatDate(contest.deadline)}</span>
          </div>
          {contest.announcementDate && (
            <div className="flex items-center gap-2">
              <MegaphoneIcon className="w-5 h-5 text-brand-500" />
              <span>발표: {formatDate(contest.announcementDate)}</span>
            </div>
          )}
          {contest.prize && (
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-brand-500" />
              <span>{contest.prize}</span>
            </div>
          )}
          {contest.submissionType && (
            <div className="flex items-center gap-2">
              <DocumentIcon className="w-5 h-5 text-brand-500" />
              <span>{contest.submissionType}</span>
            </div>
          )}
        </div>

        {(contest.notes || totalParticipants > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                {contest.notes && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ClipboardDocumentListIcon className="w-5 h-5 text-slate-500" />
                            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">메모</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-gray-700/50 p-3 rounded-md">{contest.notes}</p>
                    </div>
                )}
                {totalParticipants > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <UserGroupIcon className="w-5 h-5 text-slate-500" />
                                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">참여자</h4>
                            </div>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{submittedCount}/{totalParticipants} 제출</span>
                        </div>
                        <ul className="space-y-1.5">
                            {contest.participants.map(p => (
                                <li key={p.id} className="flex items-center gap-2 text-sm">
                                    {p.submitted ? (
                                        <CheckCircleIcon className="w-4 h-4 text-brand-500" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-500" />
                                    )}
                                    <span className={`${p.submitted ? 'line-through text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>{p.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )}
        
        <div className="flex-grow"></div>

        <div className="mt-6 flex gap-2 items-center justify-between">
          {contest.link ? (
            <a href={contest.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors">
              <LinkIcon className="w-4 h-4" />
              <span>사이트</span>
            </a>
          ) : <div />}
          <div className="flex gap-2 ml-auto">
             <button onClick={onEdit} className="p-2 text-brand-500 hover:text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/50 rounded-full transition-colors" aria-label="Edit contest">
                <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={onDelete} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors" aria-label="Delete contest">
                <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;