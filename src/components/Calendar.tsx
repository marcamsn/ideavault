import React, { useMemo, useState } from "react";
import { Idea } from '@/types';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import IdeaCard from './IdeaCard';
import IdeaModal from './IdeaModal';

interface CalendarProps {
  ideas: Idea[];
}

// Utilidad para obtener los días del mes
function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Agrupa ideas por fecha (yyyy-mm-dd)
function groupIdeasByDay(ideas: Idea[]) {
  return ideas.reduce((acc, idea) => {
    const day = new Date(idea.created_at).toISOString().split('T')[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(idea);
    return acc;
  }, {} as Record<string, Idea[]>);
}

const moodColors: Record<string, string> = {
  happy: 'bg-yellow-200 text-yellow-900',
  playful: 'bg-pink-200 text-pink-900',
  dreamy: 'bg-blue-200 text-blue-900',
  wild: 'bg-green-200 text-green-900',
};

const Calendar: React.FC<CalendarProps> = ({ ideas }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentMonth, currentYear]);
  const ideasByDay = useMemo(() => groupIdeasByDay(ideas), [ideas]);

  const startDay = days[0].getDay(); // 0 (domingo) ... 6 (sábado)

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [hoveredIdeaId, setHoveredIdeaId] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{x: number; y: number; placement: 'right' | 'left' | 'top' | 'bottom'} | null>(null);
  const hidePopoverTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Función para mantener el popover visible si el mouse está en chip o popover
  const handlePopoverMouseEnter = () => {
    if (hidePopoverTimeout.current) {
      clearTimeout(hidePopoverTimeout.current);
      hidePopoverTimeout.current = null;
    }
  };
  const handlePopoverMouseLeave = () => {
    hidePopoverTimeout.current = setTimeout(() => {
      setHoveredIdeaId(null);
      setPopoverPosition(null);
    }, 100);
  };

  const handleChipMouseEnter = (e: React.MouseEvent, ideaId: string) => {
    if (hidePopoverTimeout.current) {
      clearTimeout(hidePopoverTimeout.current);
      hidePopoverTimeout.current = null;
    }
    setHoveredIdeaId(ideaId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const popoverWidth = 300; // px aprox
    const popoverHeight = 320; // px aprox
    const margin = 12; // px
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Decide dirección
    let placement: 'right' | 'left' | 'top' | 'bottom' = 'right';
    if (rect.right + popoverWidth + margin < windowWidth) {
      placement = 'right';
    } else if (rect.left - popoverWidth - margin > 0) {
      placement = 'left';
    } else if (rect.bottom + popoverHeight + margin < windowHeight) {
      placement = 'bottom';
    } else {
      placement = 'top';
    }

    let x = rect.left + rect.width/2;
    let y = rect.top;
    if (placement === 'right') {
      x = rect.right + margin;
      y = rect.top + rect.height/2 - popoverHeight/2;
    } else if (placement === 'left') {
      x = rect.left - popoverWidth - margin;
      y = rect.top + rect.height/2 - popoverHeight/2;
    } else if (placement === 'bottom') {
      x = rect.left + rect.width/2 - popoverWidth/2;
      y = rect.bottom + margin;
    } else if (placement === 'top') {
      x = rect.left + rect.width/2 - popoverWidth/2;
      y = rect.top - popoverHeight - margin;
    }
    // Evita que se salga por arriba o abajo
    y = Math.max(margin, Math.min(y, windowHeight - popoverHeight - margin));
    // Evita que se salga por los lados
    x = Math.max(margin, Math.min(x, windowWidth - popoverWidth - margin));

    setPopoverPosition({x, y, placement});
  };

  const handleChipMouseLeave = () => {
    hidePopoverTimeout.current = setTimeout(() => {
      setHoveredIdeaId(null);
      setPopoverPosition(null);
    }, 100);
  };


  return (
    <div className="w-full max-w-5xl mx-auto p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-100">
          <FiChevronLeft size={22} />
        </button>
        <h2 className="text-xl font-bold text-primary">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-100">
          <FiChevronRight size={22} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 bg-white/60 rounded-xl p-4 shadow-card">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-xs font-semibold text-gray-500 text-center mb-2">{d}</div>
        ))}
        {/* Espacios vacíos hasta el primer día */}
        {Array.from({ length: startDay }).map((_, idx) => (
          <div key={"empty-"+idx} />
        ))}
        {days.map((day) => {
          const dayStr = day.toISOString().split('T')[0];
          const ideasForDay = ideasByDay[dayStr] || [];
          return (
            <div key={dayStr} className="min-h-[80px] border border-white/30 rounded-lg p-1 flex flex-col gap-1 bg-white/80 relative">
              <div className={`text-xs font-bold text-gray-600 mb-1 text-center ${day.toDateString() === today.toDateString() ? 'text-primary' : ''}`}>{day.getDate()}</div>
              {/* Chips de ideas */}
              <div className="flex flex-col gap-1">
                {ideasForDay.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-center gap-1 px-1 py-0.5 rounded-lg bg-gradient-to-r bg-white/70 shadow-sm border border-white/30 cursor-pointer relative"
                    onMouseEnter={e => handleChipMouseEnter(e, idea.id)}
                    onMouseLeave={handleChipMouseLeave}
                    onClick={() => { setEditingIdea(idea); setShowModal(true); }}
                  >
                    {idea.image_url && (
                      <img src={idea.image_url} alt="" className="w-6 h-6 rounded object-cover" />
                    )}
                    <span className="truncate text-xs font-medium max-w-[80px]">{idea.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Popover IdeaCard */}
      {hoveredIdeaId && popoverPosition && (
        <div
          className="fixed z-50"
          style={{
            left: popoverPosition.x,
            top: popoverPosition.y,
            width: 300,
            maxWidth: 320,
            transition: 'left 0.08s, top 0.08s',
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        >
          <div className="shadow-xl rounded-xl bg-white/95 min-w-[250px] max-w-xs" onClick={() => {
            const idea = ideas.find(i => i.id === hoveredIdeaId);
            if (idea) { setEditingIdea(idea); setShowModal(true); }
          }}>
            <IdeaCard
              idea={ideas.find(i => i.id === hoveredIdeaId)!}
              onSwipe={() => {}}
              onEdit={idea => { setEditingIdea(idea); setShowModal(true); }}
            />
          </div>
        </div>
      )}
      {/* Modal de edición */}
      {showModal && editingIdea && (
        <div className="fixed inset-0 z-50 bg-pastel-purple/30 backdrop-blur-md flex items-center justify-center p-screen-padding">
          <IdeaModal
            idea={editingIdea}
            onClose={() => { setShowModal(false); setEditingIdea(null); }}
            onSuccess={() => { setShowModal(false); setEditingIdea(null); }}
            onDelete={() => { setShowModal(false); setEditingIdea(null); }}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
