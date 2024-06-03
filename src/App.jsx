import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BarChart = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [yAxisKey, setYAxisKey] = useState('financials.sale'); // Default to 'sale'
  const [activeTab, setActiveTab] = useState('sale'); // Active tab state

  const values = [
    { year: 'FY 19-20', financials: { sale: 122953, profit: 25940, patax: 19684, eps: 204.2, dpshare: 342.6, capex: 1522 } },
    { year: 'FY 20-21', financials: { sale: 132902, profit: 28775, patax: 20824, eps: 216.0, dpshare: 200.0, capex: 4741 } },
    { year: 'FY 21-22', financials: { sale: 146649, profit: 32288, patax: 21184, eps: 219.7, dpshare: 200.0, capex: 7308 } },
    { year: 'FY 22-23', financials: { sale: 167895, profit: 33659, patax: 23905, eps: 247.9, dpshare: 220.0, capex: 5407 } },
    { year: 'FY 23-24', financials: { sale: 191141, profit: 37789, patax: 25708, eps: 263.5, dpshare: 240.0, capex: 6104 } }
  ];

  useEffect(() => {
    const data = {
      datasets: [{
        label: 'Constant financial growth over the years',
        data: values,
        backgroundColor: values.map((_, index) => 
          index === values.length - 1 ? 'rgba(92, 196, 188, 1)' : 'rgba(202, 232, 229, 1)'
        ),
        borderColor: values.map((_, index) => 
          index === values.length - 1 ? 'rgba(92, 196, 188, 1)' : 'rgba(202, 232, 229, 1)'
        ),
        borderWidth: 1,
        borderRadius: {
          topLeft: 25,
        },
        parsing: {
          xAxisKey: 'year',
          yAxisKey: yAxisKey,
        },
      }],
    };

    const config = {
      type: 'bar',
      data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: (value, context) => {
              return value.financials[yAxisKey.split('.')[1]];
            },
          },
        },
        barThickness: 72,
        maxBarThickness: 72,
      },
      plugins: [ChartDataLabels],
    };

    if (chart) {
      chart.destroy();
    }

    const newChart = new Chart(chartRef.current, config);
    setChart(newChart);

    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [yAxisKey]);

  const updateChart = (value) => {
    setYAxisKey(`financials.${value}`);
    setActiveTab(value); // Set the active tab
  };

  const downloadImage = (format) => {
    const link = document.createElement('a');
    link.download = `chart.${format}`;
    link.href = chartRef.current.toDataURL(`image/${format}`, 1.0);
    link.click();
  };

  return (
    <div>
      <div className="chartMenu">
        <div className="buttons">
          <button className={activeTab === 'sale' ? 'active' : ''} onClick={() => updateChart('sale')}>Sales</button>
          <button className={activeTab === 'profit' ? 'active' : ''} onClick={() => updateChart('profit')}>Profit from operations</button>
          <button className={activeTab === 'patax' ? 'active' : ''} onClick={() => updateChart('patax')}>Profit after tax</button>
          <button className={activeTab === 'eps' ? 'active' : ''} onClick={() => updateChart('eps')}>Eps</button>
          <button className={activeTab === 'dpshare' ? 'active' : ''} onClick={() => updateChart('dpshare')}>Dividend per Share</button>
          <button className={activeTab === 'capex' ? 'active' : ''} onClick={() => updateChart('capex')}>Capex</button>
        </div>
        <div className="downloadMenu">
          <button className="downloadButton">Download</button>
          <div className="dropdownContent">
            <button onClick={() => downloadImage('jpeg')}>JPEG</button>
            <button onClick={() => downloadImage('png')}>PNG</button>
          </div>
        </div>
      </div>
      <div className="chartCard">
        <div className="chartBox">
          <canvas ref={chartRef} id="myChart"></canvas>
        </div>
      </div>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          font-family: 'Roboto', sans-serif;
        }
        .chartMenu {
          width: 100%;
          padding: 10px;
          text-align: center;
          color: rgba(92, 196, 188, 1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chartMenu .buttons {
          display: flex;
        }
        .chartMenu button {
          margin: 0 10px;
          padding: 2px 20px;
          border: none;
          background: rgba(54, 162, 235, 0.2);
          cursor: pointer;
          font-size: 16px;
          color: rgba(54, 162, 235, 1);
          border-radius: 0px;
        }
        .chartMenu button.active {
          background: rgb(40 54 173);
          color: white;
        }
        .downloadMenu {
          position: relative;
          display: inline-block;
        }
        .downloadButton {
          background: rgba(54, 162, 235, 0.2);
          color: rgba(54, 162, 235, 1);
          border: none;
          cursor: pointer;
          padding: 2px 20px;
          font-size: 16px;
        }
        .dropdownContent {
          display: none;
          position: absolute;
          right: 0;
          background-color: white;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }
        .dropdownContent button {
          color: black;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          border: none;
          background: white;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }
        .dropdownContent button:hover {
          background-color: rgba(54, 162, 235, 0.2);
        }
        .downloadMenu:hover .dropdownContent {
          display: block;
        }
        .chartCard {
          width: 100%;
          height: calc(100vh - 50%);
          background: rgba(54, 162, 235, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chartBox {
          width: 70%;
          padding: 12px;
          border: solid 2px rgba(54, 162, 235, 1);
          background: white;
        }
      `}</style>
    </div>
  );
};

export default BarChart;
