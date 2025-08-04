// src/components/history/GrowthChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import { CRL_PERCENTILES, FL_PERCENTILES, BPD_PERCENTILES, HC_PERCENTILES } from '../../services/calculations';
import { Measurement } from '../../types/measurement';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// The list of all valid keys for the measurements object we can chart
type ChartableParameter = 'crl_mm' | 'fl_mm' | 'bpd_mm' | 'hc_mm';

interface GrowthChartProps {
  measurements: Measurement[];
  parameter: ChartableParameter; // FIX: Use the new, expanded type
  title: string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ measurements, parameter, title }) => {
  // FIX: Create a mapping to easily select the correct percentile data
  const percentileDataMap = {
    crl_mm: CRL_PERCENTILES,
    fl_mm: FL_PERCENTILES,
    bpd_mm: BPD_PERCENTILES,
    hc_mm: HC_PERCENTILES,
  };

  const percentileData = percentileDataMap[parameter];
  if (!percentileData) return null; // Should not happen, but good practice

  const labels = Object.keys(percentileData).map(week => `${week}w`);

  const userData = measurements
    .filter(m => m.measurements[parameter] != null && m.measurements[parameter]! > 0)
    .map(m => ({
      x: m.gestationalWeek + m.gestationalDay / 7,
      y: m.measurements[parameter]!
    }));

  const chartData = {
    labels,
    datasets: [
        {
            label: '10th/90th Percentile',
            data: Object.values(percentileData).map(p => p[0]),
            borderColor: 'rgba(255, 159, 64, 0.5)',
            borderDash: [5, 5],
            fill: '+2', // Fill to the 90th percentile line
            backgroundColor: 'rgba(255, 205, 132, 0.1)',
            pointRadius: 0,
        },
        {
            label: '50th Percentile',
            data: Object.values(percentileData).map(p => p[1]),
            borderColor: 'rgba(75, 192, 192, 0.8)',
            fill: false,
            pointRadius: 0,
        },
        {
            label: '90th Percentile', // This dataset defines the upper fill boundary
            data: Object.values(percentileData).map(p => p[2]),
            borderColor: 'rgba(255, 159, 64, 0.5)',
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
        },
        {
            label: 'Your Baby',
            data: userData,
            borderColor: 'rgb(220, 53, 69)',
            backgroundColor: 'rgba(220, 53, 69, 0.8)',
            showLine: false,
            pointRadius: 6,
            pointHoverRadius: 8,
        }
    ],
  };

  // Configure chart options for a professional look and feel
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: title, font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y} mm`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: { title: { display: true, text: 'Gestational Week' } },
      y: { title: { display: true, text: 'Measurement (mm)' } }
    }
  };

  return <div style={{ height: '400px', marginTop: '20px' }}><Line options={options} data={chartData} /></div>;
};

export default GrowthChart;