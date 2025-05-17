import React, { useMemo, useState } from 'react';
import { Idea } from '@/types';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJSCore,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

ChartJSCore.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

interface DashboardProps {
  ideas: Idea[];
}

const moods = ['happy', 'dreamy', 'playful', 'wild'];
const moodLabels: Record<string, string> = {
  happy: 'Feliz',
  dreamy: 'Soñador',
  playful: 'Juguetón',
  wild: 'Salvaje',
};
const moodColors = ['#FDE68A', '#BFDBFE', '#FBCFE8', '#BBF7D0'];

function getMoodCounts(ideas: Idea[]) {
  const counts: Record<string, number> = {};
  for (const mood of moods) counts[mood] = 0;
  ideas.forEach((idea) => {
    if (idea.mood && counts.hasOwnProperty(idea.mood)) {
      counts[idea.mood]++;
    }
  });
  return counts;
}

function getIdeasByPeriod(ideas: Idea[], period: 'day' | 'week' | 'month') {
  const dateMap: Record<string, number> = {};
  ideas.forEach((idea) => {
    const d = new Date(idea.created_at);
    let key = '';
    if (period === 'day') {
      key = d.toISOString().split('T')[0];
    } else if (period === 'week') {
      // ISO week: yyyy-W##
      const year = d.getFullYear();
      const firstJan = new Date(year, 0, 1);
      // 0-indexed day of week (Mon=1, Sun=0)
      const days = Math.floor((+d - +firstJan) / 86400000);
      const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
      key = `${year}-W${week.toString().padStart(2, '0')}`;
    } else if (period === 'month') {
      key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}`;
    }
    dateMap[key] = (dateMap[key] || 0) + 1;
  });
  return dateMap;
}

function getTagCounts(ideas: Idea[]) {
  const tagMap: Record<string, number> = {};
  ideas.forEach((idea) => {
    idea.tags?.forEach((tag) => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });
  return tagMap;
}

const Dashboard: React.FC<DashboardProps> = ({ ideas }) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

  // Mood chart
  const moodCounts = useMemo(() => getMoodCounts(ideas), [ideas]);
  const moodData = {
    labels: moods.map((m) => moodLabels[m]),
    datasets: [
      {
        label: 'Ideas por estado de ánimo',
        data: moods.map((m) => moodCounts[m]),
        backgroundColor: moodColors,
        borderRadius: 20,
        barPercentage: 0.7,
        categoryPercentage: 0.6,
      },
    ],
  };

  // Ideas over time
  const ideasByPeriod = useMemo(() => getIdeasByPeriod(ideas, period), [ideas, period]);
  const sortedPeriods = Object.keys(ideasByPeriod).sort();
  // Gradiente pastel para barras
  // Usamos un plugin para crear gradientes dinámicos
  const pastelGradients = [
    ['#a7c7f9', '#fbc2eb'], // azul-lila
    ['#fbc2eb', '#fcdffb'], // rosa-lila
    ['#fbc2eb', '#f9f7d9'], // rosa-amarillo
    ['#f9f7d9', '#a7c7f9'], // amarillo-azul
  ];
  const barGradientPlugin = {
    id: 'bar-gradient',
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      if (!chartArea) return;
      chart.data.datasets.forEach((dataset: any, i: number) => {
        if (dataset.type === 'bar' || chart.config.type === 'bar') {
          dataset.backgroundColor = dataset.data.map((_: any, idx: number) => {
            const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            const colors = pastelGradients[idx % pastelGradients.length];
            grad.addColorStop(0, colors[0]);
            grad.addColorStop(1, colors[1]);
            return grad;
          });
        }
      });
    },
    beforeDatasetsDraw: (chart: any) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      if (!chartArea) return;
      chart.data.datasets.forEach((dataset: any, i: number) => {
        if (dataset.type === 'bar' || chart.config.type === 'bar') {
          dataset.backgroundColor = dataset.data.map((_: any, idx: number) => {
            const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            const colors = pastelGradients[idx % pastelGradients.length];
            grad.addColorStop(0, colors[0]);
            grad.addColorStop(1, colors[1]);
            return grad;
          });
        }
      });
    }
  };


  const timeData = {
    labels: sortedPeriods,
    datasets: [
      {
        label: 'Ideas creadas',
        data: sortedPeriods.map((key) => ideasByPeriod[key]),
        borderRadius: 18,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        backgroundColor: undefined,
      },
    ],
  };


  // Tag bar
  const tagCounts = useMemo(() => getTagCounts(ideas), [ideas]);
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const tagData = {
    labels: sortedTags.map(([tag]) => tag),
    datasets: [
      {
        label: 'Ideas por etiqueta',
        data: sortedTags.map(([, count]) => count),
        backgroundColor: '#F472B6',
        borderRadius: 16,
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary" style={{fontWeight:600, color:'#222'}}>Dashboard de Analíticas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mood chart */}
        <div className="rounded-3xl bg-white/20 backdrop-blur-2xl shadow-card p-6 flex flex-col items-center border border-white/30" style={{boxShadow:'0px 10px 30px rgba(0,0,0,0.05)'}}>
          <h2 className="text-lg font-semibold mb-3 text-center" style={{fontWeight:500, color:'#333'}}>Ideas por estado de ánimo</h2>
          <Bar data={moodData} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: {display:false}}, y: { grid: {color:'#f2f2f2'}} } }} />
        </div>
        {/* Ideas over time */}
        <div className="rounded-3xl bg-white/20 backdrop-blur-2xl shadow-card p-6 flex flex-col items-center border border-white/30" style={{boxShadow:'0px 10px 30px rgba(0,0,0,0.05)'}}>
          <div className="flex items-center justify-between w-full mb-2">
            <h2 className="text-lg font-semibold text-center" style={{fontWeight:500, color:'#333'}}>Evolución temporal de ideas</h2>
            <div className="flex gap-2">
              {(['day','week','month'] as const).map((p) => (
                <button
                  key={p}
                  className={`px-4 py-1 rounded-full border text-sm font-medium transition-all ${period===p ? 'bg-pastel-blue/60 border-pastel-blue text-primary shadow-card' : 'bg-white/70 border-white/60 text-gray-500 hover:bg-pastel-blue/20'}`}
                  style={{fontWeight:period===p?600:500, borderWidth:1}}
                  onClick={()=>setPeriod(p)}
                >
                  {p==='day'?'Día':p==='week'?'Semana':'Mes'}
                </button>
              ))}
            </div>
          </div>
          <Bar
            data={timeData}
            options={{
              plugins: { legend: { display: false } },
              scales: { x: { grid: {display:false}}, y: { grid: {color:'#f2f2f2'}} },
            }}
            plugins={[barGradientPlugin]}
          />
        </div>
        {/* Tag bar chart */}
        <div className="rounded-3xl bg-white/20 backdrop-blur-2xl shadow-card p-6 col-span-1 md:col-span-2 flex flex-col items-center border border-white/30" style={{boxShadow:'0px 10px 30px rgba(0,0,0,0.05)'}}>
          <h2 className="text-lg font-semibold mb-3 text-center" style={{fontWeight:500, color:'#333'}}>Etiquetas más usadas</h2>
          <Bar data={tagData} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: {display:false}}, y: { grid: {color:'#f2f2f2'}} } }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
