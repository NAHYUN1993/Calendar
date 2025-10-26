import React, { useState, useMemo } from 'react';
import { Contest } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, MegaphoneIcon } from './Icons';

interface CalendarViewProps {
  contests: Contest[];
  onEditContest: (contest: Contest) => void;
}

type CalendarEvent = {
  id: string;
  contest: Contest;
  startDate: Date;
  endDate: Date;
  type: 'contest' | 'announcement';
};

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


const CalendarView: React.FC<CalendarViewProps> = ({ contests, onEditContest }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const calendarStartDate = new Date(startOfMonth);
    calendarStartDate.setDate(calendarStartDate.getDate() - startOfMonth.getDay());
    const calendarEndDate = new Date(endOfMonth);
    calendarEndDate.setDate(calendarEndDate.getDate() + (6 - endOfMonth.getDay()));

    const allEvents: CalendarEvent[] = [];
    contests.forEach(contest => {
        allEvents.push({
            id: contest.id,
            contest,
            startDate: new Date(contest.startDate),
            endDate: new Date(contest.deadline),
            type: 'contest',
        });
        if (contest.announcementDate) {
            allEvents.push({
                id: `${contest.id}-announcement`,
                contest,
                startDate: new Date(contest.announcementDate),
                endDate: new Date(contest.announcementDate),
                type: 'announcement',
            });
        }
    });

    const visibleEvents = allEvents.filter(e => {
        const eventStart = new Date(e.startDate);
        eventStart.setHours(0,0,0,0);
        const eventEnd = new Date(e.endDate);
        eventEnd.setHours(0,0,0,0);
        return eventStart <= calendarEndDate && eventEnd >= calendarStartDate;
    }).sort((a,b) => a.startDate.getTime() - b.startDate.getTime());
    
    const weeks: { date: Date, events: { event: CalendarEvent, level: number, startsThisDay: boolean, endsThisDay: boolean }[] }[][] = [];
    const eventLevels = new Map<string, number>();
    
    let currentDatePointer = new Date(calendarStartDate);
    while (currentDatePointer <= calendarEndDate) {
      const week: { date: Date, events: any[] }[] = [];
      const weeklyLevels = new Array(7).fill(0).map(() => new Set<string>());

      for (let i = 0; i < 7; i++) {
        week.push({ date: new Date(currentDatePointer), events: [] });
        currentDatePointer.setDate(currentDatePointer.getDate() + 1);
      }

      visibleEvents.forEach(event => {
        const eventStart = new Date(event.startDate);
        eventStart.setHours(0,0,0,0);
        const eventEnd = new Date(event.endDate);
        eventEnd.setHours(0,0,0,0);

        let level = 0;
        let placed = false;
        while (!placed) {
            let canPlace = true;
            for (let i = 0; i < 7; i++) {
                const dayDate = week[i].date;
                if (dayDate >= eventStart && dayDate <= eventEnd) {
                    if (Array.from(weeklyLevels[i]).some(id => eventLevels.get(id) === level)) {
                        canPlace = false;
                        break;
                    }
                }
            }
            if (canPlace) {
                eventLevels.set(event.id, level);
                for (let i = 0; i < 7; i++) {
                    const dayDate = week[i].date;
                    if (dayDate >= eventStart && dayDate <= eventEnd) {
                        week[i].events.push({
                            event,
                            level,
                            startsThisDay: dayDate.getTime() === eventStart.getTime(),
                            endsThisDay: dayDate.getTime() === eventEnd.getTime()
                        });
                        weeklyLevels[i].add(event.id);
                    }
                }
                placed = true;
            } else {
                level++;
            }
        }
      });

      weeks.push(week);
    }
    return { weeks };

  }, [contests, currentDate]);


  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Previous month">
          <ChevronLeftIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {currentDate.toLocaleString('ko-KR', { year: 'numeric', month: 'long' })}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Next month">
          <ChevronRightIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
      <div className="grid grid-cols-7">
        {dayLabels.map(label => (
          <div key={label} className="text-center font-semibold text-sm text-slate-500 dark:text-slate-400 pb-2 border-b-2 border-slate-200 dark:border-slate-700">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 border-l border-t border-slate-200 dark:border-slate-700">
        {calendarData.weeks.flat().map(({ date, events: dayEvents }, index) => {
            const isToday = date.getTime() === today.getTime();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            return (
                <div key={index} className={`relative border-r border-b border-slate-200 dark:border-slate-700 min-h-[120px] ${isCurrentMonth ? '' : 'bg-slate-50 dark:bg-gray-800/50'}`}>
                    <span className={`absolute top-2 left-2 font-semibold text-sm ${
                        isToday ? 'bg-brand-500 text-white rounded-full w-7 h-7 flex items-center justify-center' 
                                : isCurrentMonth ? 'text-slate-800 dark:text-slate-200' 
                                : 'text-slate-400 dark:text-slate-500'
                    }`}>{date.getDate()}</span>
                    <div className="absolute top-10 left-0 right-0 p-1 space-y-1">
                        {dayEvents.map(({ event, level, startsThisDay, endsThisDay }) => {
                            if (event.type === 'announcement') {
                                return (
                                    <div key={event.id} style={{ top: `${level * 1.5}rem`}} className="absolute w-full">
                                        <button
                                          onClick={() => onEditContest(event.contest)}
                                          className="h-5 w-full text-yellow-900 text-xs px-2 flex items-center gap-1 bg-yellow-400 rounded-md truncate"
                                        >
                                            <MegaphoneIcon className="w-3 h-3 flex-shrink-0" />
                                            <span className="font-semibold truncate">{event.contest.name} 발표</span>
                                        </button>
                                    </div>
                                )
                            }
                            return (
                                <div key={event.id} style={{ top: `${level * 1.5}rem`}} className="absolute w-full">
                                    <button
                                      onClick={() => onEditContest(event.contest)}
                                      className={`h-5 w-full text-white text-xs px-2 flex items-center ${getContestColor(event.contest.id)} 
                                          ${startsThisDay ? 'rounded-l-md' : ''} ${endsThisDay ? 'rounded-r-md' : ''}`}
                                    >
                                        {startsThisDay && <span className="font-semibold truncate">{event.contest.name}</span>}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default CalendarView;