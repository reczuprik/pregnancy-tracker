
// src/components/history/GrowthChart.tsx - OPTIMIZED VERSION
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { differenceInDays } from 'date-fns';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { CRL_PERCENTILES, FL_PERCENTILES, BPD_PERCENTILES, HC_PERCENTILES } from '../../services/calculations';
import { Measurement } from '../../types/measurement';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
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
const getCssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const GrowthChart: React.FC<GrowthChartProps> = ({ measurements, parameter, officialMeasurement }) => {
  const { t } = useTranslation();
  
  // ✅ PERFORMANCE: Memoize expensive calculations
  const chartData = useMemo(() => {
    const percentileDataMap = {
      crl_mm: CRL_PERCENTILES, fl_mm: FL_PERCENTILES,
      bpd_mm: BPD_PERCENTILES, hc_mm: HC_PERCENTILES,
    };
    const percentileData = percentileDataMap[parameter];
    if (!percentileData) return null;

    // Calculate re-dated user data
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
        x: reDatedGestationalAgeInDays / 7.0,
        y: value,
        isOfficial: currentMeasurement.id === officialMeasurement?.id,
        measurement: currentMeasurement,
      };
    }).filter((p): p is NonNullable<typeof p> => p !== null);

    // Generate axis range
    const allAgesInWeeks = reDatedUserData.map(d => d.x);
    const minWeek = Math.floor(Math.min(...allAgesInWeeks, ...Object.keys(percentileData).map(Number)));
    const maxWeek = Math.ceil(Math.max(...allAgesInWeeks, ...Object.keys(percentileData).map(Number)));

    // Generate percentile curves
    const percentileCurve = (percentileIndex: 0 | 1 | 2) => {
      const data = [];
      for (let week = minWeek; week <= maxWeek; week++) {
        if (percentileData[week]) {
          data.push({ x: week, y: percentileData[week][percentileIndex] });
        }
      }
      return data;
    };
    const accentColor = getCssVar('--color-accent-primary');
    const secondaryAccentColor = getCssVar('--color-accent-secondary');
    return {
      datasets: [
        {
          label: t('charts.typicalRange'),
          data: percentileCurve(0),
          backgroundColor: 'rgba(178, 216, 216, 0.2)', // Healing Teal at 20% opacity
          borderColor: 'transparent',
          pointRadius: 0,
          fill: '+1',
          order: 4,
        },
        {
          label: 'Boundary',
          data: percentileCurve(2),
          borderColor: 'transparent',
          pointRadius: 0,
          fill: false,
          order: 3,
        },
        {
          label: t('charts.medianJourney'),
          data: percentileCurve(1),
          borderColor: secondaryAccentColor, 
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
          backgroundColor: reDatedUserData.map(p => 
            p.isOfficial ? secondaryAccentColor : accentColor
          ),
          borderColor: reDatedUserData.map(p => 
            p.isOfficial ? secondaryAccentColor : accentColor
          ),      showLine: false,
          order: 1,
        }
      ],
      minWeek,
      maxWeek
    };
  }, [measurements, parameter, officialMeasurement, t]);

  // ✅ PERFORMANCE: Memoize chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: t('charts.title', { parameter: parameter.replace('_mm', '').toUpperCase() }),
        font: { size: 18, weight: 600 },
        padding: { top: 10, bottom: 20 },
      },
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
        type: 'linear' as const,
        title: { display: true, text: t('charts.xAxisLabel') },
        grid: { color: '#f8fafc' },
        min: chartData?.minWeek,
        max: chartData?.maxWeek,
      },
      y: {
        title: { display: true, text: t('charts.yAxisLabel') },
        grid: { color: '#f1f5f9' },
        beginAtZero: true,
      }
    },
  }), [t, parameter, chartData]);

  if (!chartData) return null;

  return (
    <div style={{ position: 'relative', height: '400px', marginTop: '20px' }}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

// ✅ PERFORMANCE: Memoize the component
export default React.memo(GrowthChart);