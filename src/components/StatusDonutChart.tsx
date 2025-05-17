import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Idea } from '@/types';

interface StatusDonutChartProps {
  ideas: Idea[];
}

const statusLabels = ['Open', 'Completed', 'Discarded'];
const statusColors = ['#a7c7f9', '#bbf7d0', '#fbc2eb']; // Azul para open, verde para completed, rosa para discarded

function getStatusCounts(ideas: Idea[]) {
  const counts = { open: 0, completed: 0, discarded: 0 };
  ideas.forEach((idea) => {
    if (idea.status === 'open') counts.open++;
    else if (idea.status === 'completed') counts.completed++;
    else if (idea.status === 'discarded') counts.discarded++;
  });
  return counts;
}

const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ ideas }) => {
  const counts = getStatusCounts(ideas);
  const total = counts.open + counts.completed + counts.discarded;
  const percentages = [counts.open, counts.completed, counts.discarded].map(
    (count) => total > 0 ? ((count / total) * 100) : 0
  );

  const data = {
    labels: statusLabels,
    datasets: [
      {
        data: [counts.open, counts.completed, counts.discarded],
        backgroundColor: statusColors,
        borderWidth: 2,
      },
    ],
  };

  // Plugin para mostrar el porcentaje en el centro
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart: any) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      ctx.save();
      ctx.font = 'bold 1.5rem sans-serif';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const main = total > 0 ? `${percentages[0].toFixed(0)}%` : '0%';
      ctx.fillText(main, (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2);
      ctx.restore();
    },
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-3 text-center" style={{fontWeight:500, color:'#333'}}>Ideas by Status</h2>
      <Doughnut
        data={data}
        options={{
          plugins: {
            legend: { display: true, position: 'right',
              labels: {
                generateLabels: (chart: any) => {
                  const d = chart.data.datasets[0].data;
                  return chart.data.labels.map((label: string, i: number) => {
                    const value = d[i];
                    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                    return {
                      text: `${label} (${pct}%)`,
                      fillStyle: statusColors[i],
                      strokeStyle: '#fff',
                      lineWidth: 2,
                      index: i,
                    };
                  });
                }
              }
            }
          },
          cutout: '70%',
        }}
        plugins={[centerTextPlugin]}
      />
      <div className="mt-4 text-sm text-center text-gray-700">
        {statusLabels.map((label, i) => (
          <div key={label}>{label}: <b>{percentages[i].toFixed(1)}%</b> ({[counts.open, counts.completed, counts.discarded][i]})</div>
        ))}
      </div>
    </div>
  );
};

export default StatusDonutChart;
