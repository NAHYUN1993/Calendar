import React, { useState, useEffect } from 'react';
import { Contest, Participant } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface ContestFormProps {
  onSave: (contest: Omit<Contest, 'id'>) => void;
  onCancel: () => void;
  initialData: Contest | null;
}

const ContestForm: React.FC<ContestFormProps> = ({ onSave, onCancel, initialData }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [prize, setPrize] = useState('');
  const [submissionType, setSubmissionType] = useState('');
  const [poster, setPoster] = useState('');
  const [notes, setNotes] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLink(initialData.link);
      setStartDate(initialData.startDate || '');
      setDeadline(initialData.deadline);
      setAnnouncementDate(initialData.announcementDate || '');
      setPrize(initialData.prize);
      setSubmissionType(initialData.submissionType);
      setPoster(initialData.poster);
      setNotes(initialData.notes || '');
      setParticipants(initialData.participants || []);
    } else {
      setName('');
      setLink('');
      setStartDate('');
      setDeadline('');
      setAnnouncementDate('');
      setPrize('');
      setSubmissionType('');
      setPoster('');
      setNotes('');
      setParticipants([]);
    }
  }, [initialData]);

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPoster(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddParticipant = () => {
    if (newParticipantName.trim() === '') return;
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: newParticipantName.trim(),
      submitted: false,
    };
    setParticipants([...participants, newParticipant]);
    setNewParticipantName('');
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };
  
  const handleToggleSubmission = (id: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, submitted: !p.submitted } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !deadline || !startDate) {
      alert('공모전 이름, 시작일, 마감일은 필수입니다.');
      return;
    }
    if (new Date(startDate) > new Date(deadline)) {
      alert('마감일은 시작일보다 빠를 수 없습니다.');
      return;
    }
    if (announcementDate && new Date(deadline) >= new Date(announcementDate)) {
      alert('발표일은 마감일 이후여야 합니다.');
      return;
    }
    onSave({ name, link, startDate, deadline, prize, submissionType, poster, participants, announcementDate, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">공모전 이름 *</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="poster" className="block text-sm font-medium text-slate-700 dark:text-slate-300">포스터 이미지</label>
        <input type="file" id="poster" onChange={handlePosterChange} accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-slate-600 dark:file:text-slate-200 dark:hover:file:bg-slate-500"/>
        {poster && <img src={poster} alt="Poster Preview" className="mt-2 rounded-lg max-h-40" />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">접수 시작일 *</label>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
        </div>
        <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 dark:text-slate-300">마감일 *</label>
            <input type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="announcementDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">수상자 발표일</label>
        <input type="date" id="announcementDate" value={announcementDate} onChange={(e) => setAnnouncementDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="prize" className="block text-sm font-medium text-slate-700 dark:text-slate-300">상금</label>
        <input type="text" id="prize" value={prize} onChange={(e) => setPrize(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="submissionType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">작업물 형태</label>
        <input type="text" id="submissionType" value={submissionType} onChange={(e) => setSubmissionType(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-slate-700 dark:text-slate-300">공모전 링크</label>
        <input type="url" id="link" value={link} onChange={(e) => setLink(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">메모</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="공모전 관련 메모를 자유롭게 작성하세요..."></textarea>
      </div>
      
      <div className="pt-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">참여자 관리</label>
        <div className="flex gap-2 mt-1">
          <input 
            type="text" 
            value={newParticipantName} 
            onChange={(e) => setNewParticipantName(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddParticipant(); }}}
            placeholder="참여자 이름 입력" 
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" 
          />
          <button type="button" onClick={handleAddParticipant} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md shadow-sm hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500">
            <PlusIcon className="w-5 h-5"/>
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {participants.map(p => (
            <li key={p.id} className="flex items-center justify-between bg-slate-50 dark:bg-gray-700/50 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={p.submitted} 
                  onChange={() => handleToggleSubmission(p.id)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className={`text-sm ${p.submitted ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{p.name}</span>
              </div>
              <button type="button" onClick={() => handleRemoveParticipant(p.id)} className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" aria-label="Remove participant">
                <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 border border-transparent rounded-md hover:bg-slate-200 dark:hover:bg-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500">취소</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md shadow-sm hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500">저장</button>
      </div>
    </form>
  );
};

export default ContestForm;