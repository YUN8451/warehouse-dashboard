/* ============================================
   charts.js - 图表渲染（Chart.js）
   ============================================ */

// 城市颜色映射
const CITY_COLORS = {
    '杭州': { main: '#ff6b00', bg: 'rgba(255,107,0,0.15)' },
    '上虞': { main: '#448aff', bg: 'rgba(68,138,255,0.15)' },
    '佛山': { main: '#00e676', bg: 'rgba(0,230,118,0.15)' },
    '济南': { main: '#ff5252', bg: 'rgba(255,82,82,0.15)' }
};

let trendChartInstance = null;
let saturationChartInstance = null;
let rateChartInstance = null;

// ============ 通用 Chart.js 配置 ============
const chartFontColor = '#8892a8';
const chartGridColor = 'rgba(255,255,255,0.06)';

function baseOptions(titleText) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: {
            legend: {
                labels: { color: '#b0b8cc', font: { size: 11 }, usePointStyle: true, padding: 14 }
            },
            tooltip: {
                backgroundColor: 'rgba(10,14,26,0.92)',
                titleColor: '#ff8c33',
                bodyColor: '#e8eaf0',
                borderColor: 'rgba(255,107,0,0.3)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10
            }
        },
        scales: {
            x: {
                ticks: { color: chartFontColor, font: { size: 10 }, maxRotation: 45 },
                grid: { color: chartGridColor }
            },
            y: {
                ticks: { color: chartFontColor, font: { size: 10 } },
                grid: { color: chartGridColor },
                beginAtZero: false
            }
        }
    };
}

// ============ 出入库趋势图 ============
function renderTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    if (trendChartInstance) trendChartInstance.destroy();

    const hist = warehouseData.history;
    const datasets = [];

    CITIES.forEach(city => {
        // 入库线（实线）
        datasets.push({
            label: `${city} 入库`,
            data: hist.inbound[city],
            borderColor: CITY_COLORS[city].main,
            backgroundColor: CITY_COLORS[city].bg,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 5,
            tension: 0.35,
            fill: false
        });
        // 出库线（虚线）
        datasets.push({
            label: `${city} 出库`,
            data: hist.outbound[city],
            borderColor: CITY_COLORS[city].main,
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 2,
            pointHoverRadius: 5,
            tension: 0.35,
            fill: false
        });
    });

    trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: hist.dates.map(d => d.slice(5)), datasets },
        options: baseOptions('出入库趋势')
    });
}

// ============ 饱和度趋势图 ============
function renderSaturationChart() {
    const ctx = document.getElementById('saturationChart');
    if (!ctx) return;
    if (saturationChartInstance) saturationChartInstance.destroy();

    const hist = warehouseData.history;
    const datasets = CITIES.map(city => ({
        label: `${city} 饱和度(%)`,
        data: hist.saturation[city],
        borderColor: CITY_COLORS[city].main,
        backgroundColor: CITY_COLORS[city].bg,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        tension: 0.35,
        fill: true,
        yAxisID: 'y'
    }));

    saturationChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: hist.dates.map(d => d.slice(5)), datasets },
        options: {
            ...baseOptions('饱和度趋势'),
            scales: {
                x: {
                    ticks: { color: chartFontColor, font: { size: 10 }, maxRotation: 45 },
                    grid: { color: chartGridColor }
                },
                y: {
                    ticks: { color: chartFontColor, font: { size: 10 } },
                    grid: { color: chartGridColor },
                    min: 0,
                    max: 100,
                    title: { display: true, text: '%', color: chartFontColor }
                }
            }
        }
    });
}

// ============ 及时率趋势图 ============
function renderRateChart() {
    const ctx = document.getElementById('rateChart');
    if (!ctx) return;
    if (rateChartInstance) rateChartInstance.destroy();

    const hist = warehouseData.history;
    const datasets = CITIES.map(city => ({
        label: `${city} 及时率(%)`,
        data: hist.unloadRate[city],
        borderColor: CITY_COLORS[city].main,
        backgroundColor: CITY_COLORS[city].bg,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        tension: 0.35,
        fill: false
    }));

    rateChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: hist.dates.map(d => d.slice(5)), datasets },
        options: {
            ...baseOptions('及时率趋势'),
            scales: {
                x: {
                    ticks: { color: chartFontColor, font: { size: 10 }, maxRotation: 45 },
                    grid: { color: chartGridColor }
                },
                y: {
                    ticks: { color: chartFontColor, font: { size: 10 } },
                    grid: { color: chartGridColor },
                    min: 80,
                    max: 100,
                    title: { display: true, text: '%', color: chartFontColor }
                }
            }
        }
    });
}

// ============ 刷新所有图表 ============
function refreshCharts() {
    renderTrendChart();
    renderSaturationChart();
    renderRateChart();
}
