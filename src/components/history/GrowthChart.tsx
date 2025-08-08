// src/components/history/GrowthChart.tsx (FINAL, Fully Dynamic Axis)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { differenceInDays } from 'date-fns';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { CRL_PERCENTILES, FL_PERCENTILES, BPD_PERCENTILES, HC_PERCENTILES } from '../../services/calculations';
import { Measurement } from '../../types/measurement';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// This function gets or creates the tooltip element in the DOM
const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'chart-tooltip-container'; // ✨ Use our CSS class

    const tooltipBody = document.createElement('div');
    tooltipBody.className = 'chart-tooltip'; // ✨ Use our CSS class
    
    tooltipEl.appendChild(tooltipBody);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};
type ChartableParameter = 'crl_mm' | 'fl_mm' | 'bpd_mm' | 'hc_mm';

interface GrowthChartProps {
  measurements: Measurement[];
  parameter: ChartableParameter;
  officialMeasurement?: Measurement;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ measurements, parameter, officialMeasurement }) => {
  const { t } = useTranslation();
  const percentileDataMap = {
    crl_mm: CRL_PERCENTILES, fl_mm: FL_PERCENTILES,
    bpd_mm: BPD_PERCENTILES, hc_mm: HC_PERCENTILES,
  };
  const percentileData = percentileDataMap[parameter];
  if (!percentileData) return null;

  // --- ✨ START: THE FINAL, CORRECT DYNAMIC DATA CALCULATION ---

  const reDatedUserData = measurements.map(currentMeasurement => {
    let reDatedGestationalAgeInDays;
    if (officialMeasurement) {
      const officialAgeInDays = (officialMeasurement.gestationalWeek * 7) + officialMeasurement.gestationalDay;
      const dateOfOfficialScan = new Date(officialMeasurement.date);
      const dateOfCurrentScan = new Date(currentMeasurement.date);
      const dayDifference = differenceInDays(dateOfCurrentScan, dateOfOfficialScan);
      reDatedGestationalAgeInDays = officialAgeInDays + dayDifference;
    } else {
      reDatedGestationalAgeInDays = (currentMeasurement.gestationalWeek * 7) + currentMeasurement.gestationalDay;
    }

    const value = currentMeasurement.measurements[parameter];
    if (value == null || value <= 0) return null;

    return {
      // ✨ FIX: X value is now a precise floating-point number representing the week and day.
      x: reDatedGestationalAgeInDays / 7.0, 
      y: value,
      isOfficial: currentMeasurement.id === officialMeasurement?.id,
      measurement: currentMeasurement,
    };
  }).filter((p): p is NonNullable<typeof p> => p !== null);

  // --- DYNAMIC AXIS GENERATION ---
  // Find the minimum and maximum gestational age from our re-dated data to define the chart's range.
  const allAgesInWeeks = reDatedUserData.map(d => d.x);
  const minWeek = Math.floor(Math.min(...allAgesInWeeks, ...Object.keys(percentileData).map(Number)));
  const maxWeek = Math.ceil(Math.max(...allAgesInWeeks, ...Object.keys(percentileData).map(Number)));

  // Generate the percentile curves dynamically across our new, correct date range.
  const percentileCurve = (percentileIndex: 0 | 1 | 2) => {
    const data = [];
    for (let week = minWeek; week <= maxWeek; week++) {
      if (percentileData[week]) {
        data.push({ x: week, y: percentileData[week][percentileIndex] });
      }
    }
    return data;
  };
  
  // --- END: THE FINAL, CORRECT DYNAMIC DATA CALCULATION ---
   // ✨ NEW: Custom plugin to draw the "River of Normal" label directly on the chart
  const riverLabelPlugin = {
      id: 'riverLabel',
      afterDraw: (chart: any) => {
          const ctx = chart.ctx;
          const yAxis = chart.scales.y;
          // Position the label roughly in the middle of the y-axis
          const yPos = yAxis.getPixelForValue(yAxis.min + (yAxis.max - yAxis.min) * 0.6); 
          
          ctx.save();
          ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
          ctx.fillStyle = 'rgba(100, 116, 139, 0.5)'; // Soft, semi-transparent gray
          ctx.textAlign = 'center';
          ctx.fillText(t('charts.typicalRange'), chart.width / 2, yPos);
          ctx.restore();
      }
  };
  
  const chartData = {
    // We no longer use 'labels' for a linear scale, the 'x' values in the data are used instead.
    datasets: [
      {
        label: t('charts.typicalRange'),
        data: percentileCurve(0), // 10th percentile curve
        backgroundColor: '#e0f2f1',
        borderColor: 'transparent',
        pointRadius: 0,
        fill: '+1', // Fill to the 90th percentile
        order: 4,
      },
      {
        label: 'Boundary',
        data: percentileCurve(2), // 90th percentile curve
        borderColor: 'transparent',
        pointRadius: 0,
        fill: false,
        order: 3,
      },
      {
        label: t('charts.medianJourney'),
        data: percentileCurve(1), // 50th percentile curve
        borderColor: '#6366f1',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        order: 2,
      },
      {
        label: t('charts.yourBaby'),
        data: reDatedUserData,
        pointRadius: reDatedUserData.map(p => p.isOfficial ? 8 : 6),
        pointHoverRadius: reDatedUserData.map(p => p.isOfficial ? 10 : 8),
        backgroundColor: reDatedUserData.map(p => p.isOfficial ? '#facc15' : '#fb923c'),
        borderColor: reDatedUserData.map(p => p.isOfficial ? '#ca8a04' : '#f97316'),
        showLine: false,
        order: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },

      title: {
        display: true,
        text: t('charts.title', { parameter: parameter.replace('_mm', '').toUpperCase() }),
        font: { size: 18, weight: 600 }, // Bolder title
        padding: { top: 10, bottom: 20 },
      },
      // ✨ NEW: Custom, empathetic tooltips
 tooltip: {
        enabled: false, // We are creating our own.
        external: (context: any) => {
          const { chart, tooltip } = context;
          const tooltipEl = getOrCreateTooltip(chart);

          // Hide if no tooltip
          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Only proceed if we are hovering over one of "Your Baby's" data points
          if (!tooltip.dataPoints?.[0]?.raw?.measurement) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Set Text
          if (tooltip.body) {
            const dataPoint = tooltip.dataPoints[0];
            const measurement = dataPoint.raw.measurement;
            const value = dataPoint.raw.y;
            const week = measurement.gestationalWeek;
            const day = measurement.gestationalDay;

            const tooltipBody = tooltipEl.querySelector('.chart-tooltip');
            if (!tooltipBody) return;

            // Use our CSS classes for styling
            const innerHtml = `
              <div class="tooltip-title">${t('charts.tooltipIntro')}</div>
              <div class="tooltip-body">
                <span class="value">${week}${t('results.weeks')} ${day}${t('results.days')}: ${value}mm</span>
                <span class="context">${t('charts.tooltipGrowth')}</span>
              </div>
            `;
            
            tooltipBody.innerHTML = innerHtml;
          }

          const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

          // Display and position
          tooltipEl.style.opacity = 1;
          tooltipEl.style.left = positionX + tooltip.caretX + 'px';
          tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        },
      },
    },
    
    scales: {
      x: {
        // ✨ THE FIX IS HERE: Add 'as const' to satisfy TypeScript's strict literal type requirement.
        type: 'linear' as const, 
        title: { display: true, text: t('charts.xAxisLabel') },
        grid: { color: '#f8fafc' },
        min: minWeek,
        max: maxWeek,
      },
      y: {
        title: { display: true, text: t('charts.yAxisLabel') },
        grid: { color: '#f1f5f9' },
        beginAtZero: true,
      }
    },
  };

  return (
      <div style={{ position: 'relative', height: '400px', marginTop: '20px' }}>
        <Line options={options} data={chartData} plugins={[riverLabelPlugin]} />
      </div>
  )
  
};

export default GrowthChart;