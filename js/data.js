var CITIES = ['杭州', '上虞', '佛山', '济南'];

var warehouseData = {
    // 第一行 KPI
    kpi: {
        safety: 0,
        inboundVolume: 287.1,
        inboundMoM: -20.7,
        inboundCompare: 362,
        outboundVolume: 368.8,
        outboundMoM: 0.98,
        outboundCompare: 365.2,
        throughput: 655.9,
        throughputMoM: -9.8,
        throughputCompare: 727.1
    },
    // 四地快照
    snapshot: {
        杭州: { stock: 1674795, inbound: 1487641, outbound: 1840240, efficiency: 0.71, saturation: 86, peakLimit: 1385, peakCurrent: 8940, unloadRate24h: 97, turnoverDays: 25 },
        上虞: { stock: 17324, inbound: 17237, outbound: 225229, efficiency: 0.03, saturation: 3, peakLimit: 542, peakCurrent: 6230, unloadRate24h: 100, turnoverDays: 17 },
        佛山: { stock: 1034287, inbound: 802877, outbound: 984935, efficiency: 0.82, saturation: 94, peakLimit: 1453, peakCurrent: 7510, unloadRate24h: 98, turnoverDays: 30 },
        济南: { stock: 499064, inbound: 563265, outbound: 637476, efficiency: 0.87, saturation: 81, peakLimit: 1168, peakCurrent: 6820, unloadRate24h: 100, turnoverDays: 24 }
    },
    // 运营指标（含同期对比）
    metrics: {
        turnoverDays:       { current: 24, compare: 28 },  // 实物周转天数
        inventoryAccuracy:  { current: 100, compare: 99.5 },  // 库存准确率（%）
        volumeUtilization:   { current: 88, compare: 95 },  // 容积利用率（%）
        orderExceptionRate:  { current: 0.038, compare: 0.04 }    // 订单异常率（%）
    },
    // 逆向物流看板
    reverse: {
        杭州: { '上月结存': 20634, 'receiveTotal': 1094, '转正量': 379, '待转正量': 715, '京东呆滞退': 92, '京东在途退': 489, '菜鸟呆滞退': 0, '菜鸟在途退': 20, '2C呆滞退': 204, '2C在途退': 199, '经销商退': 60, 'KA退': 30, '换包量': 3105, '本月结存': 18244, 'areaUsage': 1792 },
        上虞: { '上月结存': 8353, 'receiveTotal': 144, '转正量': 0, '待转正量': 144, '京东呆滞退': 0, '京东在途退': 0, '菜鸟呆滞退': 0, '菜鸟在途退': 0, '2C呆滞退': 0, '2C在途退': 144, '经销商退': 0, 'KA退': 0, '换包量': 72, '本月结存': 8333, 'areaUsage': 0 },
        佛山: { '上月结存': 1677, 'receiveTotal': 1396, '转正量': 1099, '待转正量': 297, '京东呆滞退': 0, '京东在途退': 0, '菜鸟呆滞退': 0, '菜鸟在途退': 0, '2C呆滞退': 1396, '2C在途退': 0, '经销商退': 0, 'KA退': 0, '换包量': 210, '本月结存': 1764, 'areaUsage': 100 },
        济南: { '上月结存': 17466, 'receiveTotal': 648, '转正量': 366, '待转正量': 282, '京东呆滞退': 226, '京东在途退': 204, '菜鸟呆滞退': 0, '菜鸟在途退': 12, '2C呆滞退': 0, '2C在途退': 100, '经销商退': 106, 'KA退': 0, '换包量': 1182, '本月结存': 16566, 'areaUsage': 1000 }
    },
    history: {
        dates: ["05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31"],
        inbound: {
            '杭州': [42120, 35491, 0, 5466, 11151, 37754, 35195, 47296, 109854, 52572, 54048, 64337, 58215, 73985, 49309, 77874, 12954, 50990, 68714, 55920, 38426, 61881, 44536, 31088, 52247, 45878, 30723, 59556, 72783, 47564, 59714],
            '上虞': [4292, 0, 0, 0, 12945, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            '佛山': [48474, 0, 0, 17344, 32242, 6802, 3593, 41001, 54808, 22721, 11206, 47390, 36917, 36917, 36989, 17561, 14766, 0, 14421, 32143, 19744, 23288, 18707, 53727, 39444, 15247, 47662, 31955, 48768, 13994, 15046],
            '济南': [13908, 16777, 0, 9066, 13862, 1966, 2620, 21731, 11787, 19593, 36691, 14082, 24035, 43455, 56351, 13518, 28254, 0, 13215, 18130, 20100, 8620, 24378, 19162, 19246, 5500, 21431, 13156, 16884, 34565, 21182]
        },
        outbound: {
            '杭州': [79248, 65522, 0, 7645, 11511, 13724, 52343, 67506, 52744, 69020, 8829, 88812, 102075, 104217, 71552, 69922, 6691, 6691, 67381, 77411, 110869, 58604, 92330, 92057, 22616, 87192, 59467, 67116, 99941, 84023, 42970],
            '上虞': [22854, 15715, 108, 6186, 796, 16644, 16567, 17004, 24785, 8134, 0, 7492, 9746, 3610, 12325, 5060, 5650, 7715, 14101, 3392, 7864, 6133, 811, 3857, 52, 3030, 2976, 1042, 1475, 90, 15],
            '佛山': [68200, 38186, 0, 14675, 13026, 17050, 43233, 39059, 38023, 1380, 6689, 47840, 45723, 45723, 33597, 34720, 18791, 7657, 26165, 22017, 43416, 33536, 40431, 38645, 22108, 46581, 30860, 41785, 50807, 42948, 32064],
            '济南': [46023, 31775, 0, 9952, 4289, 2860, 17762, 23570, 18283, 35611, 3903, 30837, 21728, 20735, 24772, 12428, 9621, 7657, 19332, 18539, 25106, 17213, 35054, 17404, 5427, 25559, 28438, 24237, 35706, 46543, 17112]
        }
    },
    trendJishilv: {
        dates: ["05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31"],
        '杭州': [1, 1, 1, 1, 1, 1, 1, 1, 0.93, 1, 1, 1, 1, 1, 1, 1, 0.7878, 0.8762, 0.7931, 0.8015, 0.9101, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        '上虞': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        '佛山': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.81, 1, 1, 0.9, 0.6843, 1, 1, 1],
        '济南': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    trendBaohedu: {
        dates: ["05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31"],
        '杭州': [0.88, 0.87, 0.85, 0.85, 0.85, 0.83, 0.84, 0.84, 0.83, 0.84, 0.85, 0.86, 0.85, 0.84, 0.85, 0.93, 0.92, 0.92, 0.93, 0.93, 0.94, 0.92, 0.92, 0.91, 0.88, 0.9, 0.89, 0.89, 0.89, 0.87, 0.82],
        '上虞': [0.77, 0.72, 0.7, 0.69, 0.68, 0.69, 0.68, 0.64, 0.61, 0.56, 0.55, 0.54, 0.53, 0.51, 0.5, 0.48, 0.46, 0.45, 0.43, 0.36, 0.35, 0.3, 0.26, 0.25, 0.16, 0.15, 0.1, 0.06, 0.04, 0.04, 0.03],
        '佛山': [0.93, 0.92, 0.89, 0.89, 0.9, 0.91, 0.92, 0.9, 0.91, 0.91, 0.9, 0.9, 0.92, 0.93, 0.93, 0.95, 0.95, 0.95, 0.94, 0.93, 0.95, 0.94, 0.92, 0.92, 0.93, 0.91, 0.93, 0.93, 0.93, 0.94, 0.92],
        '济南': [0.85, 0.81, 0.78, 0.78, 0.78, 0.8, 0.8, 0.79, 0.78, 0.78, 0.77, 0.81, 0.8, 0.82, 0.86, 0.93, 0.91, 0.93, 0.92, 0.92, 0.91, 0.9, 0.86, 0.86, 0.88, 0.87, 0.87, 0.87, 0.85, 0.81, 0.81]
    }
};

// 已使用真实5月出入库数据（见上文 history 初始化）

function momHtml(value) {
    if (value === undefined || value === null) return '<span class="mom-value">—</span>';
    var cls = value >= 0 ? 'up' : 'down';
    var arrow = value >= 0 ? '&#9650;' : '&#9660;';
    return '<span class="mom-value ' + cls + '">' + arrow + ' ' + Math.abs(value).toFixed(1) + '%</span>';
}

function updateMomEl(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    if (value === undefined || value === null) {
        el.className = 'mom-value';
        el.textContent = '—';
        return;
    }
    el.className = 'mom-value ' + (value >= 0 ? 'up' : 'down');
    el.textContent = (value >= 0 ? '▲ ' : '▼ ') + Math.abs(value).toFixed(1) + '%';
}

function compareHtml(current, compare, lowerIsBetter) {
    if (compare === 0) return '<span class="metric-card-badge badge-flat">— 同期对比 N/A</span>';
    var diff = current - compare;
    var absPct = compare !== 0 ? Math.abs((diff / compare) * 100).toFixed(1) : '0.0';
    if (lowerIsBetter) {
        if (diff < 0) return '<span class="metric-card-badge badge-up">▲ +' + absPct + '%</span>';
        if (diff > 0) return '<span class="metric-card-badge badge-down">▼ -' + absPct + '%</span>';
    } else {
        if (diff > 0) return '<span class="metric-card-badge badge-up">▲ +' + absPct + '%</span>';
        if (diff < 0) return '<span class="metric-card-badge badge-down">▼ -' + absPct + '%</span>';
    }
    return '<span class="metric-card-badge badge-flat">— 持平</span>';
}

function refreshKPI() {
    var k = warehouseData.kpi;
    var el;
    el = document.getElementById('safetyCount');
    if (el) el.textContent = k.safety;
    el = document.getElementById('inboundVolume');
    if (el) el.textContent = k.inboundVolume;
    updateMomEl('inboundMoM', k.inboundMoM);
    el = document.getElementById('inboundCompare');
    if (el) el.textContent = k.inboundCompare;
    el = document.getElementById('outboundVolume');
    if (el) el.textContent = k.outboundVolume;
    updateMomEl('outboundMoM', k.outboundMoM);
    el = document.getElementById('outboundCompare');
    if (el) el.textContent = k.outboundCompare;
    el = document.getElementById('throughputVolume');
    if (el) el.textContent = k.throughput;
    updateMomEl('throughputMoM', k.throughputMoM);
    el = document.getElementById('throughputCompare');
    if (el) el.textContent = k.throughputCompare;
}

function refreshMetrics() {
    var container = document.getElementById('metricGrid');
    if (!container) return;
    var m = warehouseData.metrics;
    var metricsDef = [
        { key: 'turnoverDays', title: '实物周转天数', unit: '天', lowerIsBetter: true },
        { key: 'inventoryAccuracy', title: '库存准确率', unit: '%', lowerIsBetter: false },
        { key: 'volumeUtilization', title: '容积利用率', unit: '%', lowerIsBetter: false },
        { key: 'orderExceptionRate', title: '订单异常率', unit: '%', lowerIsBetter: true }
    ];
    container.innerHTML = metricsDef.map(function (def) {
        var d = m[def.key];
        var valStr = def.key === 'orderExceptionRate' ? (d.current * 100).toFixed(2) : d.current;
        return '<div class="metric-card">' +
            '<div class="metric-card-header">' +
            '<span class="metric-card-title">' + def.title + '</span>' +
            compareHtml(d.current, d.compare, def.lowerIsBetter) +
            '</div>' +
            '<div class="metric-card-value">' + valStr + '<span style="font-size:12px;font-weight:400;margin-left:2px;">' + def.unit + '</span></div>' +
            '<div class="metric-card-sub">同期: ' + (def.key === 'orderExceptionRate' ? (d.compare * 100).toFixed(2) : d.compare) + ' ' + def.unit + '</div>' +
            '</div>';
    }).join('');
}

function refreshCityCards() {
    var container = document.getElementById('cityCards');
    if (!container) return;
    container.innerHTML = CITIES.map(function (city) {
        var d = warehouseData.snapshot[city];
        var tag = d.saturation > 80 ? { text: '饱和', cls: 'tag-warn' } : d.saturation > 60 ? { text: '正常', cls: 'tag-normal' } : { text: '空闲', cls: 'tag-full' };
        return '<div class="city-card">' +
            '<div class="city-card-header"><span class="city-name">&#x1F4CD; ' + city + '</span><span class="city-tag ' + tag.cls + '">' + tag.text + '</span></div>' +
            '<div class="city-metrics">' +
            '<div class="metric-item"><div class="metric-label">库存</div><div class="metric-value stock">' + formatNum(d.stock) + '</div></div>' +
            '<div class="metric-item"><div class="metric-label">入库</div><div class="metric-value in">' + formatNum(d.inbound) + '</div></div>' +
            '<div class="metric-item"><div class="metric-label">出库</div><div class="metric-value out">' + formatNum(d.outbound) + '</div></div>' +
            '</div></div>';
    }).join('');
}

// ============ 刷新峰值卡片 ============
function refreshPeakCards() {
    var container = document.getElementById('peakCards');
    if (!container) return;
    var maxDays = Math.max.apply(null, CITIES.map(function(c) { return warehouseData.snapshot[c].turnoverDays; }));
    container.innerHTML = CITIES.map(function (city) {
        var d = warehouseData.snapshot[city];
        var pct = Math.round(d.turnoverDays / maxDays * 100);
        var color = pct > 80 ? 'var(--red)' : pct > 50 ? 'var(--orange-main)' : 'var(--green)';
        return '<div class="peak-card"><div class="peak-city">&#x1F4CD; ' + city + '</div><div class="peak-value">' + d.turnoverDays + '</div><div class="peak-unit">天</div>' +
            '<div class="peak-bar-bg"><div class="peak-bar-fill" style="width:' + Math.min(pct, 100) + '%;background:' + color + '"></div></div></div>';
    }).join('');
}

// ============ 刷新逆向物流看板表格 ============
function refreshReverseTable() {
    var tbody = document.getElementById('reverseBody');
    if (!tbody) return;
    tbody.innerHTML = Object.entries(warehouseData.reverse).map(function (entry) {
        var city = entry[0], d = entry[1];
        return '<tr><td style="font-weight:700;color:var(--orange-light)">' + city + '</td>' +
            '<td>' + d['上月结存'] + '</td>' +
            '<td>' + d.receiveTotal + '</td>' +
            '<td>' + d['转正量'] + '</td>' +
            '<td>' + d['待转正量'] + '</td>' +
            '<td>' + d['京东呆滞退'] + '</td>' +
            '<td>' + d['京东在途退'] + '</td>' +
            '<td>' + d['菜鸟呆滞退'] + '</td>' +
            '<td>' + d['菜鸟在途退'] + '</td>' +
            '<td>' + d['2C呆滞退'] + '</td>' +
            '<td>' + d['2C在途退'] + '</td>' +
            '<td>' + d['经销商退'] + '</td>' +
            '<td>' + d['KA退'] + '</td>' +
            '<td>' + d['换包量'] + '</td>' +
            '<td>' + d['本月结存'] + '</td>' +
            '<td>' + d.areaUsage + '</td></tr>';
    }).join('');
}

// ============ 刷新所有数据 ============
function refreshAll() {
    refreshKPI();
    refreshMetrics();
    refreshCityCards();
    refreshPeakCards();
    refreshReverseTable();
    if (typeof refreshCharts === 'function') refreshCharts();
}

// ============ 下载导入模板 ============
function downloadTemplate() {
    try {
        var wb = XLSX.utils.book_new();

        // Sheet1：KPI 指标
        var kpiRows = [{
            '安全运营(起)': warehouseData.kpi.safety,
            '入库量(万台)': warehouseData.kpi.inboundVolume,
            '入库量环比(%)': warehouseData.kpi.inboundMoM,
            '入库量同期(万台)': warehouseData.kpi.inboundCompare,
            '出库量(万台)': warehouseData.kpi.outboundVolume,
            '出库量环比(%)': warehouseData.kpi.outboundMoM,
            '出库量同期(万台)': warehouseData.kpi.outboundCompare,
            '吞吐量(万台)': warehouseData.kpi.throughput,
            '吞吐量环比(%)': warehouseData.kpi.throughputMoM,
            '吞吐量同期(万台)': warehouseData.kpi.throughputCompare
        }];
        var ws1 = XLSX.utils.json_to_sheet(kpiRows);
        ws1['!cols'] = [{ wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
        XLSX.utils.book_append_sheet(wb, ws1, 'KPI指标');

        // Sheet2：运营指标
        var m = warehouseData.metrics;
        var metricRows = [
            { '指标名称': '实物周转天数', '当前值': m.turnoverDays.current, '同期对比值': m.turnoverDays.compare, '单位': '天' },
            { '指标名称': '库存准确率', '当前值': m.inventoryAccuracy.current, '同期对比值': m.inventoryAccuracy.compare, '单位': '%' },
            { '指标名称': '容积利用率', '当前值': m.volumeUtilization.current, '同期对比值': m.volumeUtilization.compare, '单位': '%' },
            { '指标名称': '订单异常率', '当前值': m.orderExceptionRate.current, '同期对比值': m.orderExceptionRate.compare, '单位': '%' }
        ];
        var ws2 = XLSX.utils.json_to_sheet(metricRows);
        ws2['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 8 }];
        XLSX.utils.book_append_sheet(wb, ws2, '运营指标');

        // Sheet3：四地快照
        var snapRows = CITIES.map(function (c) {
            var d = warehouseData.snapshot[c];
            return {
                '地区': c, '库存量': d.stock, '入库量': d.inbound, '出库量': d.outbound,
                '存效(%)': d.efficiency, '库容饱和度(%)': d.saturation,
                '入库峰值上限(方)': d.peakLimit, '当前入库量(方)': d.peakCurrent,
                '实物周转天数': d.turnoverDays,
                '24H卸车及时率(%)': d.unloadRate24h
            };
        });
        var ws3 = XLSX.utils.json_to_sheet(snapRows);
        ws3['!cols'] = [{ wch: 6 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 18 }];
        XLSX.utils.book_append_sheet(wb, ws3, '四地快照');

        // Sheet4：逆向物流看板
        var revRows = Object.entries(warehouseData.reverse).map(function (entry) {
            var city = entry[0], d = entry[1];
            return {
                '地区': city, '上月结存': d['上月结存'], '接收总量/台': d.receiveTotal, '转正量': d['转正量'], '待转正量': d['待转正量'],
                '京东呆滞退': d['京东呆滞退'], '京东在途退': d['京东在途退'],
                '菜鸟呆滞退': d['菜鸟呆滞退'], '菜鸟在途退': d['菜鸟在途退'],
                '2C呆滞退': d['2C呆滞退'], '2C在途退': d['2C在途退'],
                '经销商退': d['经销商退'], 'KA退': d['KA退'],
                '换包量': d['换包量'], '本月结存': d['本月结存'], '占用面积': d.areaUsage
            };
        });
        var ws4 = XLSX.utils.json_to_sheet(revRows);
        ws4['!cols'] = [{ wch: 6 }, { wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
        XLSX.utils.book_append_sheet(wb, ws4, '逆向物流看板');

        XLSX.writeFile(wb, '仓储数据导入模板.xlsx');
        showToast('模板已下载，请按模板格式填写后导入');
    } catch (err) {
        showToast('下载模板失败：' + err.message, true);
        console.error('downloadTemplate error:', err);
    }
}

// ============ 导入数据 ============
function importData(event) {
    try {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array' });

                // 导入 KPI 指标
                if (workbook.SheetNames.indexOf('KPI指标') !== -1) {
                    var kpiRows = XLSX.utils.sheet_to_json(workbook.Sheets['KPI指标']);
                    if (kpiRows.length > 0) {
                        var k = kpiRows[0];
                        if (k['安全运营(起)'] !== undefined) warehouseData.kpi.safety = Number(k['安全运营(起)']);
                        if (k['入库量(万台)'] !== undefined) warehouseData.kpi.inboundVolume = Number(k['入库量(万台)']);
                        if (k['入库量环比(%)'] !== undefined) warehouseData.kpi.inboundMoM = Number(k['入库量环比(%)']);
                        if (k['入库量同期(万台)'] !== undefined) warehouseData.kpi.inboundCompare = Number(k['入库量同期(万台)']);
                        if (k['出库量(万台)'] !== undefined) warehouseData.kpi.outboundVolume = Number(k['出库量(万台)']);
                        if (k['出库量环比(%)'] !== undefined) warehouseData.kpi.outboundMoM = Number(k['出库量环比(%)']);
                        if (k['出库量同期(万台)'] !== undefined) warehouseData.kpi.outboundCompare = Number(k['出库量同期(万台)']);
                        if (k['吞吐量(万台)'] !== undefined) warehouseData.kpi.throughput = Number(k['吞吐量(万台)']);
                        if (k['吞吐量环比(%)'] !== undefined) warehouseData.kpi.throughputMoM = Number(k['吞吐量环比(%)']);
                        if (k['吞吐量同期(万台)'] !== undefined) warehouseData.kpi.throughputCompare = Number(k['吞吐量同期(万台)']);
                    }
                }

                // 导入运营指标
                if (workbook.SheetNames.indexOf('运营指标') !== -1) {
                    var metRows = XLSX.utils.sheet_to_json(workbook.Sheets['运营指标']);
                    metRows.forEach(function (row) {
                        var name = String(row['指标名称'] || '');
                        var cur = row['当前值'];
                        var cmp = row['同期对比值'];
                        if (name.indexOf('周转天数') !== -1) {
                            if (cur !== undefined) warehouseData.metrics.turnoverDays.current = Number(cur);
                            if (cmp !== undefined) warehouseData.metrics.turnoverDays.compare = Number(cmp);
                        }
                        if (name.indexOf('准确率') !== -1) {
                            if (cur !== undefined) warehouseData.metrics.inventoryAccuracy.current = Number(cur);
                            if (cmp !== undefined) warehouseData.metrics.inventoryAccuracy.compare = Number(cmp);
                        }
                        if (name.indexOf('容积利用') !== -1) {
                            if (cur !== undefined) warehouseData.metrics.volumeUtilization.current = Number(cur);
                            if (cmp !== undefined) warehouseData.metrics.volumeUtilization.compare = Number(cmp);
                        }
                        if (name.indexOf('异常率') !== -1) {
                            if (cur !== undefined) warehouseData.metrics.orderExceptionRate.current = Number(cur);
                            if (cmp !== undefined) warehouseData.metrics.orderExceptionRate.compare = Number(cmp);
                        }
                    });
                }

                // 导入四地快照
                if (workbook.SheetNames.indexOf('四地快照') !== -1) {
                    var snapRows = XLSX.utils.sheet_to_json(workbook.Sheets['四地快照']);
                    snapRows.forEach(function (row) {
                        var city = String(row['地区'] || '').trim();
                        if (CITIES.indexOf(city) === -1) return;
                        var d = warehouseData.snapshot[city];
                        if (row['库存量'] !== undefined) d.stock = Number(row['库存量']);
                        if (row['入库量'] !== undefined) d.inbound = Number(row['入库量']);
                        if (row['出库量'] !== undefined) d.outbound = Number(row['出库量']);
                        if (row['存效(%)'] !== undefined) d.efficiency = Number(row['存效(%)']);
                        if (row['库容饱和度(%)'] !== undefined) d.saturation = Number(row['库容饱和度(%)']);
                        if (row['入库峰值上限(方)'] !== undefined) d.peakLimit = Number(row['入库峰值上限(方)']);
                        if (row['当前入库量(方)'] !== undefined) d.peakCurrent = Number(row['当前入库量(方)']);
                        if (row['实物周转天数'] !== undefined) d.turnoverDays = Number(row['实物周转天数']);
                        if (row['24H卸车及时率(%)'] !== undefined) d.unloadRate24h = Number(row['24H卸车及时率(%)']);
                    });
                }

                // 导入逆向物流看板
                var revSheet = workbook.SheetNames.indexOf('逆向物流看板') !== -1 ? '逆向物流看板' : (workbook.SheetNames.indexOf('逆向日报') !== -1 ? '逆向日报' : null);
                if (revSheet) {
                    var revRows = XLSX.utils.sheet_to_json(workbook.Sheets[revSheet]);
                    revRows.forEach(function (row) {
                        var city = String(row['地区'] || '').trim();
                        if (!warehouseData.reverse[city]) return;
                        var rev = warehouseData.reverse[city];
                        if (row['接收总量/台'] !== undefined) rev.receiveTotal = Number(row['接收总量/台']);
                        if (row['转正量'] !== undefined) rev['转正量'] = Number(row['转正量']);
                        if (row['待转正量'] !== undefined) rev['待转正量'] = Number(row['待转正量']);
                        if (row['京东呆滞退'] !== undefined) rev['京东呆滞退'] = Number(row['京东呆滞退']);
                        if (row['京东在途退'] !== undefined) rev['京东在途退'] = Number(row['京东在途退']);
                        if (row['菜鸟呆滞退'] !== undefined) rev['菜鸟呆滞退'] = Number(row['菜鸟呆滞退']);
                        if (row['菜鸟在途退'] !== undefined) rev['菜鸟在途退'] = Number(row['菜鸟在途退']);
                        if (row['2C呆滞退'] !== undefined) rev['2C呆滞退'] = Number(row['2C呆滞退']);
                        if (row['2C在途退'] !== undefined) rev['2C在途退'] = Number(row['2C在途退']);
                        if (row['经销商退'] !== undefined) rev['经销商退'] = Number(row['经销商退']);
                        if (row['KA退'] !== undefined) rev['KA退'] = Number(row['KA退']);
                        if (row['换包量'] !== undefined) rev['换包量'] = Number(row['换包量']);
                        if (row['上月结存'] !== undefined) rev['上月结存'] = Number(row['上月结存']);
                        if (row['本月结存'] !== undefined) rev['本月结存'] = Number(row['本月结存']);
                        if (row['占用面积'] !== undefined) rev.areaUsage = Number(row['占用面积']);
                    });
                }

                refreshAll();
                saveToLocal();
                showToast('数据导入成功！');
            } catch (err) {
                showToast('导入失败：' + err.message, true);
                console.error('import parse error:', err);
            }
        };
        reader.readAsArrayBuffer(file);
    } catch (err) {
        showToast('导入失败：' + err.message, true);
        console.error('importData error:', err);
    }
    event.target.value = '';
}

// ============ 导出数据 ============
function exportData() {
    try {
        var wb = XLSX.utils.book_new();

        var kpiRows = [{ '安全运营(起)': warehouseData.kpi.safety, '入库量(万台)': warehouseData.kpi.inboundVolume, '入库量环比(%)': warehouseData.kpi.inboundMoM, '入库量同期(万台)': warehouseData.kpi.inboundCompare, '出库量(万台)': warehouseData.kpi.outboundVolume, '出库量环比(%)': warehouseData.kpi.outboundMoM, '出库量同期(万台)': warehouseData.kpi.outboundCompare, '吞吐量(万台)': warehouseData.kpi.throughput, '吞吐量环比(%)': warehouseData.kpi.throughputMoM, '吞吐量同期(万台)': warehouseData.kpi.throughputCompare }];
        var ws1 = XLSX.utils.json_to_sheet(kpiRows);
        XLSX.utils.book_append_sheet(wb, ws1, 'KPI指标');

        var m = warehouseData.metrics;
        var metricRows = [
            { '指标名称': '实物周转天数', '当前值': m.turnoverDays.current, '同期对比值': m.turnoverDays.compare, '单位': '天' },
            { '指标名称': '库存准确率', '当前值': m.inventoryAccuracy.current, '同期对比值': m.inventoryAccuracy.compare, '单位': '%' },
            { '指标名称': '容积利用率', '当前值': m.volumeUtilization.current, '同期对比值': m.volumeUtilization.compare, '单位': '%' },
            { '指标名称': '订单异常率', '当前值': m.orderExceptionRate.current, '同期对比值': m.orderExceptionRate.compare, '单位': '%' }
        ];
        var ws2 = XLSX.utils.json_to_sheet(metricRows);
        XLSX.utils.book_append_sheet(wb, ws2, '运营指标');

        var snapRows = CITIES.map(function (c) {
            var d = warehouseData.snapshot[c];
            return { '地区': c, '库存量': d.stock, '入库量': d.inbound, '出库量': d.outbound, '存效(%)': d.efficiency, '库容饱和度(%)': d.saturation, '入库峰值上限(方)': d.peakLimit, '当前入库量(方)': d.peakCurrent, '实物周转天数': d.turnoverDays, '24H卸车及时率(%)': d.unloadRate24h };
        });
        var ws3 = XLSX.utils.json_to_sheet(snapRows);
        XLSX.utils.book_append_sheet(wb, ws3, '四地快照');

        var revRows = Object.entries(warehouseData.reverse).map(function (entry) {
            var city = entry[0], d = entry[1];
            return { '地区': city, '接收总量/台': d.receiveTotal, '转正量': d['转正量'], '待转正量': d['待转正量'], '京东呆滞退': d['京东呆滞退'], '京东在途退': d['京东在途退'], '菜鸟呆滞退': d['菜鸟呆滞退'], '菜鸟在途退': d['菜鸟在途退'], '2C呆滞退': d['2C呆滞退'], '2C在途退': d['2C在途退'], '经销商退': d['经销商退'], 'KA退': d['KA退'], '换包量': d['换包量'], '占用面积': d.areaUsage };
        });
        var ws4 = XLSX.utils.json_to_sheet(revRows);
        XLSX.utils.book_append_sheet(wb, ws4, '逆向物流看板');

        XLSX.writeFile(wb, '仓储数据_' + new Date().toISOString().slice(0, 10) + '.xlsx');
        showToast('数据已导出！');
    } catch (err) {
        showToast('导出失败：' + err.message, true);
        console.error('exportData error:', err);
    }
}

// ============ 手动编辑弹窗 ============
function openManualEdit() {
    try {
        var modal = document.getElementById('editModal');
        var form = document.getElementById('editForm');
        if (!modal || !form) { showToast('页面元素缺失，请刷新页面', true); return; }

        var html = '';

        // KPI 指标编辑
        html += '<div class="edit-section"><div class="edit-section-title">KPI 指标</div>';
        html += '<div class="edit-grid">';
        html += editInputKPI('safety', '安全运营(起)', warehouseData.kpi.safety);
        html += editInputKPI('inboundVolume', '入库量(万台)', warehouseData.kpi.inboundVolume);
        html += editInputKPI('inboundMoM', '入库量环比(%)', warehouseData.kpi.inboundMoM);
        html += editInputKPI('inboundCompare', '入库量同期(万台)', warehouseData.kpi.inboundCompare);
        html += editInputKPI('outboundVolume', '出库量(万台)', warehouseData.kpi.outboundVolume);
        html += editInputKPI('outboundMoM', '出库量环比(%)', warehouseData.kpi.outboundMoM);
        html += editInputKPI('outboundCompare', '出库量同期(万台)', warehouseData.kpi.outboundCompare);
        html += editInputKPI('throughput', '吞吐量(万台)', warehouseData.kpi.throughput);
        html += editInputKPI('throughputMoM', '吞吐量环比(%)', warehouseData.kpi.throughputMoM);
        html += editInputKPI('throughputCompare', '吞吐量同期(万台)', warehouseData.kpi.throughputCompare);
        html += '</div></div>';

        // 运营指标编辑
        html += '<div class="edit-section"><div class="edit-section-title">运营指标（含同期对比）</div>';
        html += '<div class="edit-grid">';
        html += editInputMetric('turnoverDays_current', '实物周转天数-当前', warehouseData.metrics.turnoverDays.current);
        html += editInputMetric('turnoverDays_compare', '实物周转天数-同期', warehouseData.metrics.turnoverDays.compare);
        html += editInputMetric('inventoryAccuracy_current', '库存准确率-当前(%)', warehouseData.metrics.inventoryAccuracy.current);
        html += editInputMetric('inventoryAccuracy_compare', '库存准确率-同期(%)', warehouseData.metrics.inventoryAccuracy.compare);
        html += editInputMetric('volumeUtilization_current', '容积利用率-当前(%)', warehouseData.metrics.volumeUtilization.current);
        html += editInputMetric('volumeUtilization_compare', '容积利用率-同期(%)', warehouseData.metrics.volumeUtilization.compare);
        html += editInputMetric('orderExceptionRate_current', '订单异常率-当前(%)', warehouseData.metrics.orderExceptionRate.current);
        html += editInputMetric('orderExceptionRate_compare', '订单异常率-同期(%)', warehouseData.metrics.orderExceptionRate.compare);
        html += '</div></div>';

        // 四地快照编辑
        html += '<div class="edit-section"><div class="edit-section-title">四地快照数据</div>';
        CITIES.forEach(function (city) {
            var d = warehouseData.snapshot[city];
            html += '<div style="border:1px solid var(--border-color);border-radius:8px;padding:10px;margin-bottom:8px;">';
            html += '<div style="color:var(--orange-main);font-weight:700;margin-bottom:6px;">&#x1F4CD; ' + city + '</div>';
            html += editInputSnap(city, 'stock', '库存量', d.stock);
            html += editInputSnap(city, 'inbound', '入库量', d.inbound);
            html += editInputSnap(city, 'outbound', '出库量', d.outbound);
            html += editInputSnap(city, 'efficiency', '存效(%)', d.efficiency);
            html += editInputSnap(city, 'saturation', '饱和度(%)', d.saturation);
            html += editInputSnap(city, 'turnoverDays', '实物周转天数', d.turnoverDays);
            html += editInputSnap(city, 'unloadRate24h', '及时率(%)', d.unloadRate24h);
            html += '</div>';
        });
        html += '</div>';

        // 逆向物流看板编辑
        html += '<div class="edit-section"><div class="edit-section-title">逆向物流看板数据</div>';
        Object.entries(warehouseData.reverse).forEach(function (entry) {
            var city = entry[0], d = entry[1];
            html += '<div style="border:1px solid var(--border-color);border-radius:8px;padding:10px;margin-bottom:8px;">';
            html += '<div style="color:var(--orange-main);font-weight:700;margin-bottom:6px;">&#x1F504; ' + city + '</div>';
            html += editInputRev(city, '上月结存', '上月结存', d['上月结存']);
            html += editInputRev(city, 'receiveTotal', '接收总量/台', d.receiveTotal);
            html += editInputRev(city, '转正量', '转正量', d['转正量']);
            html += editInputRev(city, '待转正量', '待转正量', d['待转正量']);
            html += editInputRev(city, '京东呆滞退', '京东呆滞退', d['京东呆滞退']);
            html += editInputRev(city, '京东在途退', '京东在途退', d['京东在途退']);
            html += editInputRev(city, '菜鸟呆滞退', '菜鸟呆滞退', d['菜鸟呆滞退']);
            html += editInputRev(city, '菜鸟在途退', '菜鸟在途退', d['菜鸟在途退']);
            html += editInputRev(city, '2C呆滞退', '2C呆滞退', d['2C呆滞退']);
            html += editInputRev(city, '2C在途退', '2C在途退', d['2C在途退']);
            html += editInputRev(city, '经销商退', '经销商退', d['经销商退']);
            html += editInputRev(city, 'KA退', 'KA退', d['KA退']);
            html += editInputRev(city, '换包量', '换包量', d['换包量']);
            html += editInputRev(city, '本月结存', '本月结存', d['本月结存']);
            html += editInputRev(city, 'areaUsage', '占用面积', d.areaUsage);
            html += '</div>';
        });
        html += '</div>';

        form.innerHTML = html;
        modal.classList.add('active');
    } catch (err) {
        showToast('打开编辑失败：' + err.message, true);
        console.error('openManualEdit error:', err);
    }
}

function editInputKPI(key, label, value) {
    return '<div class="edit-field"><label>' + label + '</label><input type="number" step="any" id="edit_kpi_' + key + '" value="' + value + '"></div>';
}

function editInputMetric(key, label, value) {
    return '<div class="edit-field"><label>' + label + '</label><input type="number" step="any" id="edit_metric_' + key + '" value="' + value + '"></div>';
}

function editInputSnap(city, key, label, value) {
    return '<div class="edit-field"><label>' + label + '</label><input type="number" step="any" id="edit_snap_' + city + '_' + key + '" value="' + value + '"></div>';
}

function editInputRev(city, key, label, value) {
    return '<div class="edit-field"><label>' + label + '</label><input type="number" step="any" id="edit_rev_' + city + '_' + key + '" value="' + value + '"></div>';
}

function closeManualEdit() {
    var modal = document.getElementById('editModal');
    if (modal) modal.classList.remove('active');
}

function saveManualEdit() {
    try {
        // 保存 KPI
        var el;
        el = document.getElementById('edit_kpi_safety'); if (el) warehouseData.kpi.safety = Number(el.value);
        el = document.getElementById('edit_kpi_inboundVolume'); if (el) warehouseData.kpi.inboundVolume = Number(el.value);
        el = document.getElementById('edit_kpi_inboundMoM'); if (el) warehouseData.kpi.inboundMoM = Number(el.value);
        el = document.getElementById('edit_kpi_inboundCompare'); if (el) warehouseData.kpi.inboundCompare = Number(el.value);
        el = document.getElementById('edit_kpi_outboundVolume'); if (el) warehouseData.kpi.outboundVolume = Number(el.value);
        el = document.getElementById('edit_kpi_outboundMoM'); if (el) warehouseData.kpi.outboundMoM = Number(el.value);
        el = document.getElementById('edit_kpi_outboundCompare'); if (el) warehouseData.kpi.outboundCompare = Number(el.value);
        el = document.getElementById('edit_kpi_throughput'); if (el) warehouseData.kpi.throughput = Number(el.value);
        el = document.getElementById('edit_kpi_throughputMoM'); if (el) warehouseData.kpi.throughputMoM = Number(el.value);
        el = document.getElementById('edit_kpi_throughputCompare'); if (el) warehouseData.kpi.throughputCompare = Number(el.value);

        // 保存运营指标
        el = document.getElementById('edit_metric_turnoverDays_current'); if (el) warehouseData.metrics.turnoverDays.current = Number(el.value);
        el = document.getElementById('edit_metric_turnoverDays_compare'); if (el) warehouseData.metrics.turnoverDays.compare = Number(el.value);
        el = document.getElementById('edit_metric_inventoryAccuracy_current'); if (el) warehouseData.metrics.inventoryAccuracy.current = Number(el.value);
        el = document.getElementById('edit_metric_inventoryAccuracy_compare'); if (el) warehouseData.metrics.inventoryAccuracy.compare = Number(el.value);
        el = document.getElementById('edit_metric_volumeUtilization_current'); if (el) warehouseData.metrics.volumeUtilization.current = Number(el.value);
        el = document.getElementById('edit_metric_volumeUtilization_compare'); if (el) warehouseData.metrics.volumeUtilization.compare = Number(el.value);
        el = document.getElementById('edit_metric_orderExceptionRate_current'); if (el) warehouseData.metrics.orderExceptionRate.current = Number(el.value);
        el = document.getElementById('edit_metric_orderExceptionRate_compare'); if (el) warehouseData.metrics.orderExceptionRate.compare = Number(el.value);

        // 保存四地快照
        CITIES.forEach(function (city) {
            var d = warehouseData.snapshot[city];
            el = document.getElementById('edit_snap_' + city + '_stock'); if (el) d.stock = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_inbound'); if (el) d.inbound = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_outbound'); if (el) d.outbound = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_efficiency'); if (el) d.efficiency = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_saturation'); if (el) d.saturation = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_turnoverDays'); if (el) d.turnoverDays = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_unloadRate24h'); if (el) d.unloadRate24h = Number(el.value);
        });

        // 保存逆向物流看板
        Object.entries(warehouseData.reverse).forEach(function (entry) {
            var city = entry[0], d = entry[1];
            el = document.getElementById('edit_rev_' + city + '_上月结存'); if (el) d['上月结存'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_receiveTotal'); if (el) d.receiveTotal = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_转正量'); if (el) d['转正量'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_待转正量'); if (el) d['待转正量'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_京东呆滞退'); if (el) d['京东呆滞退'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_京东在途退'); if (el) d['京东在途退'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_菜鸟呆滞退'); if (el) d['菜鸟呆滞退'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_菜鸟在途退'); if (el) d['菜鸟在途退'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_2C呆滞退'); if (el) d['2C呆滞退'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_2C在途退'); if (el) d['2C在途退'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_经销商退'); if (el) d['经销商退'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_KA退'); if (el) d['KA退'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_换包量'); if (el) d['换包量'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_本月结存'); if (el) d['本月结存'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_areaUsage'); if (el) d.areaUsage = Number(el.value);
        });

        closeManualEdit();
        refreshAll();
        saveToLocal();
        showToast('数据已更新！');
    } catch (err) {
        showToast('保存失败：' + err.message, true);
        console.error('saveManualEdit error:', err);
    }
}

// ============ Toast 提示 ============
function showToast(msg, isError) {
    try {
        var toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 28px;border-radius:8px;font-size:14px;z-index:9999;transition:all 0.3s;pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.style.background = isError ? 'rgba(245,63,63,0.9)' : 'rgba(255,107,0,0.9)';
        toast.style.color = '#fff';
        toast.textContent = msg;
        toast.style.opacity = '1';
        setTimeout(function () { toast.style.opacity = '0'; }, 2500);
    } catch (e) { console.error('showToast error:', e); }
}

// ============ localStorage 持久化 ============
var STORAGE_KEY = 'warehouse_dashboard_data';

function deepMerge(target, source) {
    Object.keys(source).forEach(function (key) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
            target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    });
}

function saveToLocal() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(warehouseData));
    } catch (e) { console.error('saveToLocal error:', e); }
}

function loadFromLocal() {
    try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        var saved = JSON.parse(raw);
        // 数据完整性检查：关键字段必须存在且合理
        if (!saved.kpi || !saved.kpi.inboundVolume || saved.kpi.inboundVolume === 0) {
            console.warn('localStorage 数据不完整，已清除');
            localStorage.removeItem(STORAGE_KEY);
            return false;
        }
        deepMerge(warehouseData, saved);
        return true;
    } catch (e) {
        console.error('loadFromLocal error:', e);
        localStorage.removeItem(STORAGE_KEY);
        return false;
    }
}

// 启动时加载本地持久化数据（会自动检测并清除损坏数据）
loadFromLocal();
