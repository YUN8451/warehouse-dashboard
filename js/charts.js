/* ============================================
   charts.js - 图表渲染（Chart.js）白色主题
   ============================================ */

const CITY_COLORS = {
    '杭州': { main: '#ff6b00', bg: 'rgba(255,107,0,0.12)' },
    '上虞': { main: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    '佛山': { main: '#00b578', bg: 'rgba(0,181,120,0.12)' },
    '济南': { main: '#f53f3f', bg: 'rgba(245,63,63,0.12)' }
};

let mainChartInstance = null;
let currentChartType = 'inout';

const chartFontColor = '#6b7280';
const chartGridColor = '#e5e7eb';
const chartBg = '#ffffff';

function baseOptions(titleText) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: {
            legend: {
                labels: { color: '#374151', font: { size: 11 }, usePointStyle: true, padding: 14 }
            },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.96)',
                titleColor: '#ff6b00',
                bodyColor: '#1a1a2e',
                borderColor: 'rgba(255,107,0,0.3)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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

/* ============ 出入库趋势图 ============ */
function renderInOutChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    if (mainChartInstance) mainChartInstance.destroy();

    const hist = warehouseData.history;
    const datasets = [];

    CITIES.forEach(city => {
        datasets.push({
            label: city + ' 入库',
            data: hist.inbound[city],
            borderColor: CITY_COLORS[city].main,
            backgroundColor: CITY_COLORS[city].bg,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 5,
            tension: 0.35,
            fill: false
        });
        datasets.push({
            label: city + ' 出库',
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

    mainChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: hist.dates, datasets },
        options: baseOptions('出入库趋势（台）')
    });
}

/* ============ 饱和度趋势图（5月真实数据）============ */
function renderSaturationChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    if (mainChartInstance) mainChartInstance.destroy();

    const data = warehouseData.trendBaohedu;
    const datasets = CITIES.map(city => ({
        label: city + ' 饱和度',
        data: data[city],
        borderColor: CITY_COLORS[city].main,
        backgroundColor: CITY_COLORS[city].bg,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        tension: 0.35,
        fill: true
    }));

    mainChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: data.dates, datasets },
        options: {
            ...baseOptions('饱和度趋势（5月）'),
            scales: {
                x: { ticks: { color: chartFontColor, font: { size: 10 }, maxRotation: 45 }, grid: { color: chartGridColor } },
                y: { ticks: { color: chartFontColor, font: { size: 10 }, callback: v => (v * 100).toFixed(0) + '%' }, grid: { color: chartGridColor }, min: 0, max: 1, title: { display: true, text: '饱和度', color: chartFontColor } }
            }
        }
    });
}

/* ============ 及时率趋势图（5月真实数据）============ */
function renderRateChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    if (mainChartInstance) mainChartInstance.destroy();

    const data = warehouseData.trendJishilv;
    const datasets = CITIES.map(city => ({
        label: city + ' 及时率',
        data: data[city],
        borderColor: CITY_COLORS[city].main,
        backgroundColor: CITY_COLORS[city].bg,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        tension: 0.35,
        fill: false
    }));

    mainChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: data.dates, datasets },
        options: {
            ...baseOptions('及时率趋势（5月）'),
            scales: {
                x: { ticks: { color: chartFontColor, font: { size: 10 }, maxRotation: 45 }, grid: { color: chartGridColor } },
                y: { ticks: { color: chartFontColor, font: { size: 10 }, callback: v => (v * 100).toFixed(0) + '%' }, grid: { color: chartGridColor }, min: 0, max: 1, title: { display: true, text: '及时率', color: chartFontColor } }
            }
        }
    });
}

/* ============ 切换图表 ============ */
function switchChart(type) {
    currentChartType = type;
    document.querySelectorAll('.chart-tab').forEach(function (tab) { tab.classList.remove('active'); });
    var tabs = document.querySelectorAll('.chart-tab');
    if (type === 'inout') { tabs[0].classList.add('active'); renderInOutChart(); }
    if (type === 'saturation') { tabs[1].classList.add('active'); renderSaturationChart(); }
    if (type === 'rate') { tabs[2].classList.add('active'); renderRateChart(); }
}

/* ============ 刷新所有图表 ============ */
function refreshCharts() {
    if (currentChartType === 'inout') renderInOutChart();
    else if (currentChartType === 'saturation') renderSaturationChart();
    else renderRateChart();
}
