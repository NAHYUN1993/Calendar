import React, { useState, useMemo } from 'react';
import { Contest } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import ContestCard from './components/ContestCard';
import Header from './components/Header';
import Modal from './components/Modal';
import ContestForm from './components/ContestForm';
import { DocumentIcon, ChevronRightIcon } from './components/Icons';
import ViewSwitcher from './components/ViewSwitcher';
import CalendarView from './components/CalendarView';

// Some initial data for demonstration purposes
const initialContests: Contest[] = [
    {
        id: '1',
        name: 'AI 아이디어 경진대회',
        poster: 'https://picsum.photos/seed/ai/400/300',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        announcementDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        prize: '대상 1,000만원',
        submissionType: '기획서, PPT',
        link: 'https://example.com/ai',
        notes: '팀 회의록:\n- 아이디어 브레인스토밍 완료\n- 역할 분담: 기획(JJay.B), 디자인(Dan_Asa), 개발(나머지)\n- 다음 주까지 프로토타입 완료 목표',
        participants: [
            { id: 'p1', name: 'JJay.B', submitted: true },
            { id: 'p2', name: 'Dan_Asa', submitted: true },
            { id: 'p3', name: 'Defi_den', submitted: false },
            { id: 'p4', name: 'Lanedia', submitted: true },
            { id: 'p5', name: 'Rockyeong', submitted: false },
            { id: 'p6', name: 'Yen', submitted: false },
        ]
    },
    {
        id: '2',
        name: '친환경 디자인 공모전',
        poster: 'https://picsum.photos/seed/eco/400/300',
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        announcementDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        prize: '총 상금 500만원',
        submissionType: '제품 디자인, 시각 디자인',
        link: 'https://example.com/design',
        participants: [
            { id: 'p7', name: '박지훈', submitted: false },
            { id: 'p8', name: '최수아', submitted: false },
            { id: 'p9', name: '정현우', submitted: false },
        ]
    },
    {
        id: '3',
        name: '단편 영화제 출품',
        poster: 'https://picsum.photos/seed/movie/400/300',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        announcementDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        prize: '최우수 작품상',
        submissionType: '15분 이내 단편 영화',
        link: 'https://example.com/movie',
        notes: '시나리오 최종 수정 완료. 촬영 장소 헌팅 필요.',
        participants: [
            { id: 'p10', name: '윤채원', submitted: true },
        ]
    }
];

const App: React.FC = () => {
  const [contests, setContests] = useLocalStorage<Contest[]>('contests', initialContests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [view, setView] = useState<'card' | 'calendar'>('card');
  const [isFinishedOpen, setIsFinishedOpen] = useState(false);

  const { ongoingContests, finishedContests } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ongoing = contests
      .filter(c => new Date(c.deadline) >= today)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    const finished = contests
      .filter(c => new Date(c.deadline) < today)
      .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    
    return { ongoingContests: ongoing, finishedContests: finished };
  }, [contests]);

  const handleOpenModal = () => {
    setEditingContest(null);
    setIsModalOpen(true);
  };

  const handleEditContest = (contest: Contest) => {
    setEditingContest(contest);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContest(null);
  };

  const handleSaveContest = (contestData: Omit<Contest, 'id'>) => {
    if (editingContest) {
      setContests(contests.map(c => c.id === editingContest.id ? { ...contestData, id: c.id } : c));
    } else {
      setContests([...contests, { ...contestData, id: Date.now().toString() }]);
    }
    handleCloseModal();
  };

  const handleDeleteContest = (id: string) => {
    if (window.confirm('정말로 이 공모전 정보를 삭제하시겠습니까?')) {
        setContests(prevContests => prevContests.filter(c => c.id !== id));
    }
  };

  const renderEmptyState = () => (
    <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <DocumentIcon className="mx-auto w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">등록된 공모전이 없습니다.</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">오른쪽 상단의 '새 공모전 추가' 버튼을 눌러 관리할 공모전을 추가해보세요.</p>
    </div>
  );

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <Header onAddNew={handleOpenModal} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <ViewSwitcher currentView={view} onViewChange={setView} />
        
        {contests.length === 0 && view === 'card' && renderEmptyState()}

        {view === 'card' && contests.length > 0 && (
            <div className="space-y-12">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                        <span>진행 중인 공모전</span>
                        <span className="text-base font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200 rounded-full px-3 py-0.5">{ongoingContests.length}</span>
                    </h2>
                    {ongoingContests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {ongoingContests.map(contest => (
                                <ContestCard
                                    key={contest.id}
                                    contest={contest}
                                    onEdit={() => handleEditContest(contest)}
                                    onDelete={() => handleDeleteContest(contest.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg">
                           <p className="text-slate-500 dark:text-slate-400">진행 중인 공모전이 없습니다.</p>
                        </div>
                    )}
                </div>

                {finishedContests.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                                <span>마감된 공모전</span>
                                <span className="text-base font-medium bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-full px-3 py-0.5">{finishedContests.length}</span>
                            </h2>
                            <button
                                onClick={() => setIsFinishedOpen(!isFinishedOpen)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                aria-expanded={isFinishedOpen}
                                aria-controls="finished-contests-grid"
                            >
                                <ChevronRightIcon className={`w-6 h-6 text-slate-500 dark:text-slate-400 transform transition-transform duration-300 ${isFinishedOpen ? 'rotate-90' : ''}`} />
                            </button>
                        </div>

                        {isFinishedOpen && (
                            <div id="finished-contests-grid" className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-75">
                                {finishedContests.map(contest => (
                                    <ContestCard
                                        key={contest.id}
                                        contest={contest}
                                        onEdit={() => handleEditContest(contest)}
                                        onDelete={() => handleDeleteContest(contest.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}

        {view === 'calendar' && (
            <CalendarView contests={contests} onEditContest={handleEditContest} />
        )}
      </main>
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingContest ? '공모전 정보 수정' : '새 공모전 추가'}
      >
        <ContestForm 
            onSave={handleSaveContest}
            onCancel={handleCloseModal}
            initialData={editingContest}
        />
      </Modal>
    </div>
  );
};

export default App;