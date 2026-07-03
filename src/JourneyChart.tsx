import { useMemo } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import { pointColor, type JourneyPoint } from './data/journeyData.ts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  ChartDataLabels,
)

type JourneyChartProps = {
  points: JourneyPoint[]
  stages: string[]
}

export function JourneyChart({ points, stages }: JourneyChartProps) {
  const data = useMemo(
    () => ({
      datasets: [
        {
          label: 'Customer satisfaction',
          data: points.map((point) => ({
            x: point.x,
            y: 100 - point.y,
            text: point.text,
          })),
          parsing: false as const,
          tension: 0.45,
          borderColor: '#aab0b8',
          borderWidth: 2,
          pointRadius: 9,
          pointHoverRadius: 11,
          pointBackgroundColor: points.map((point) => pointColor(point.sentiment)),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    }),
    [points],
  )

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      layout: { padding: 24 },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 100,
          grid: { display: false },
          ticks: {
            stepSize: 100 / stages.length,
            callback: (value) => {
              const index = Math.floor((Number(value) / 100) * stages.length)
              return stages[index] ?? ''
            },
            font: { weight: 'bold' },
          },
        },
        y: {
          min: 0,
          max: 100,
          afterBuildTicks: (axis) => {
            axis.ticks = [{ value: 17 }, { value: 50 }, { value: 83 }]
          },
          grid: { display: false },
          ticks: {
            autoSkip: false,
            callback: (value) => {
              const v = Number(value)
              if (v === 83) return 'Exceed expectation'
              if (v === 50) return 'Meet expectations'
              if (v === 17) return 'Hygiene factors'
              return ''
            },
            font: { weight: 'bold' },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => (ctx.raw as { text: string }).text,
          },
        },
        datalabels: {
          align: (ctx) => ((ctx.dataIndex % 2 === 0 ? 'top' : 'bottom') as 'top'),
          anchor: 'center',
          color: '#2f3237',
          font: { weight: 'bold', size: 11 },
          formatter: (value: { text: string }) => value.text,
          textAlign: 'center',
        },
      },
    }),
    [stages],
  )

  return (
    <div className="chart-wrapper">
      <Line data={data} options={options} />
    </div>
  )
}
