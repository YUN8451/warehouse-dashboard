/* ============================================
   data.js - 数据模型、导入导出、模板下载
   ============================================ */

// ============ 工具函数（无依赖，优先定义）============
function formatNum(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return n.toLocaleString('zh-CN');
}

function animateValue(id, target) {
    var el = document.getElementById(id);
    if (!el) return;
    var current = parseInt(el.textContent.replace(/,/g, '')) || 0;
    if (current === target) { el.textContent = formatNum(target); return; }
    var diff = target - current;
    var step = diff / 20;
    var val = current;
    var count = 0;
    var timer = setInterval(function () {
        count++;
        val += step;
        if (count >= 20) { val = target; clearInterval(timer); }
        el.textContent = formatNum(Math.round(val));
    }, 25);
    el.classList.add('value-change');
    setTimeout(function () { el.classList.remove('value-change'); }, 600);
}

// ============ 地区列表 ============
var CITIES = ['杭州', '上虞', '佛山', '济南'];

// ============ 数据仓库（分步初始化，避免循环引用）============
var warehouseData = {
    snapshot: {
        杭州: { stock: 128456, inbound: 8940, outbound: 7620, efficiency: 92.5, saturation: 68.3, peakLimit: 15000, peakCurrent: 8940, unloadRate24h: 96.2 },
        上虞: { stock: 87620, inbound: 6230, outbound: 5810, efficiency: 88.1, saturation: 72.6, peakLimit: 12000, peakCurrent: 6230, unloadRate24h: 93.8 },
        佛山: { stock: 105320, inbound: 7510, outbound: 6940, efficiency: 90.3, saturation: 65.8, peakLimit: 13000, peakCurrent: 7510, unloadRate24h: 95.1 },
        济南: { stock: 96780, inbound: 6820, outbound: 6380, efficiency: 87.6, saturation: 70.1, peakLimit: 11000, peakCurrent: 6820, unloadRate24h: 91.5 }
    },
    reverse: {
        杭州: { prevDamage: 12, receiveTotal: 8940, 转正量: 8750, 待转正量: 190, 品质异常: 8, 三码全无: 3, 单实不符: 5, 换包量: 22, todayDamage: 10, areaUsage: 3200 },
        佛山: { prevDamage: 8, receiveTotal: 7510, 转正量: 7380, 待转正量: 130, 品质异常: 5, 三码全无: 2, 单实不符: 3, 换包量: 15, todayDamage: 7, areaUsage: 2800 },
        济南: { prevDamage: 10, receiveTotal: 6820, 转正量: 6700, 待转正量: 120, 品质异常: 6, 三码全无: 4, 单实不符: 4, 换包量: 18, todayDamage: 9, areaUsage: 2500 }
    },
    history: {}
};

// ============ 生成模拟历史数据（在 warehouseData 初始化完成后调用）============
function generateHistoryData() {
    var dates = [];
    var now = new Date();
    for (var i = 13; i >= 0; i--) {
        var d = new Date(now);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().slice(0, 10));
    }
    var history = { dates: dates, inbound: {}, outbound: {}, saturation: {}, unloadRate: {} };
    CITIES.forEach(function (city) {
        var baseIn = warehouseData.snapshot[city].inbound;
        var baseOut = warehouseData.snapshot[city].outbound;
        var baseSat = warehouseData.snapshot[city].saturation;
        var baseRate = warehouseData.snapshot[city].unloadRate24h;
        history.inbound[city] = dates.map(function (_, idx) {
            return Math.round(baseIn * (0.7 + 0.6 * Math.sin(idx * 0.5) + Math.random() * 0.2));
        });
        history.outbound[city] = dates.map(function (_, idx) {
            return Math.round(baseOut * (0.75 + 0.5 * Math.sin(idx * 0.4) + Math.random() * 0.15));
        });
        history.saturation[city] = dates.map(function (_, idx) {
            return Math.round((baseSat + Math.sin(idx * 0.3) * 8 + Math.random() * 3) * 10) / 10;
        });
        history.unloadRate[city] = dates.map(function (_, idx) {
            return Math.round((baseRate + Math.sin(idx * 0.5) * 2 + Math.random() * 1.5) * 10) / 10;
        });
    });
    return history;
}

warehouseData.history = generateHistoryData();

// ============ 重新计算汇总 ============
function recomputeSummary() {
    var totalStock = 0, totalIn = 0, totalOut = 0, totalRate = 0;
    CITIES.forEach(function (c) {
        totalStock += warehouseData.snapshot[c].stock;
        totalIn += warehouseData.snapshot[c].inbound;
        totalOut += warehouseData.snapshot[c].outbound;
        totalRate += warehouseData.snapshot[c].unloadRate24h;
    });
    return {
        totalStock: totalStock,
        totalIn: totalIn,
        totalOut: totalOut,
        avgRate: Math.round(totalRate / CITIES.length * 10) / 10
    };
}

// ============ 刷新汇总栏 ============
function refreshSummary() {
    var s = recomputeSummary();
    animateValue('totalStock', s.totalStock);
    animateValue('totalIn', s.totalIn);
    animateValue('totalOut', s.totalOut);
    var rateEl = document.getElementById('avgRate');
    if (rateEl) rateEl.textContent = s.avgRate + '%';
}

// ============ 下载导入模板 ============
function downloadTemplate() {
    try {
        if (typeof XLSX === 'undefined') {
            showToast('正在加载 XLSX 库，请稍后再试...', true);
            loadLocalXLSX(function () { downloadTemplate(); });
            return;
        }
        var wb = XLSX.utils.book_new();

        var snapRows = CITIES.map(function (c) {
            return {
                '地区': c,
                '库存量': warehouseData.snapshot[c].stock,
                '入库量': warehouseData.snapshot[c].inbound,
                '出库量': warehouseData.snapshot[c].outbound,
                '存效(%)': warehouseData.snapshot[c].efficiency,
                '库容饱和度(%)': warehouseData.snapshot[c].saturation,
                '入库峰值上限(方)': warehouseData.snapshot[c].peakLimit,
                '当前入库量(方)': warehouseData.snapshot[c].peakCurrent,
                '24H卸车及时率(%)': warehouseData.snapshot[c].unloadRate24h
            };
        });
        var ws1 = XLSX.utils.json_to_sheet(snapRows);
        ws1['!cols'] = [{ wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws1, '仓储快照');

        var revRows = Object.entries(warehouseData.reverse).map(function (entry) {
            var city = entry[0], d = entry[1];
            return {
                '地区': city,
                '前一日破损量': d.prevDamage,
                '接收总量/台': d.receiveTotal,
                '转正量': d['转正量'],
                '待转正量': d['待转正量'],
                '品质异常': d['品质异常'],
                '三码全无': d['三码全无'],
                '单实不符': d['单实不符'],
                '换包量': d['换包量'],
                '当日破损量': d.todayDamage,
                '占用面积': d.areaUsage
            };
        });
        var ws2 = XLSX.utils.json_to_sheet(revRows);
        ws2['!cols'] = [{ wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 10 }];
        XLSX.utils.book_append_sheet(wb, ws2, '逆向日报');

        XLSX.writeFile(wb, '仓储数据导入模板.xlsx');
        showToast('模板已下载，请按模板格式填写后导入');
    } catch (err) {
        showToast('下载模板失败：' + err.message, true);
        console.error('downloadTemplate error:', err);
    }
}

// ============ 动态加载本地 XLSX ============
function loadLocalXLSX(callback) {
    if (typeof XLSX !== 'undefined') { callback(); return; }
    var s = document.createElement('script');
    s.src = 'js/xlsx.full.min.js';
    s.onload = callback;
    s.onerror = function () { showToast('XLSX 库加载失败，无法导入/导出', true); };
    document.head.appendChild(s);
}

// ============ 导入数据 ============
function importData(event) {
    try {
        var file = event.target.files[0];
        if (!file) return;

        if (typeof XLSX === 'undefined') {
            showToast('正在加载 XLSX 库...', false);
            loadLocalXLSX(function () { importData(event); });
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array' });

                if (workbook.SheetNames.indexOf('仓储快照') !== -1) {
                    var ws = workbook.Sheets['仓储快照'];
                    var rows = XLSX.utils.sheet_to_json(ws);
                    rows.forEach(function (row) {
                        var city = String(row['地区'] || '').trim();
                        if (CITIES.indexOf(city) === -1) return;
                        if (row['库存量'] !== undefined) warehouseData.snapshot[city].stock = Number(row['库存量']);
                        if (row['入库量'] !== undefined) warehouseData.snapshot[city].inbound = Number(row['入库量']);
                        if (row['出库量'] !== undefined) warehouseData.snapshot[city].outbound = Number(row['出库量']);
                        if (row['存效(%)'] !== undefined) warehouseData.snapshot[city].efficiency = Number(row['存效(%)']);
                        if (row['库容饱和度(%)'] !== undefined) warehouseData.snapshot[city].saturation = Number(row['库容饱和度(%)']);
                        if (row['入库峰值上限(方)'] !== undefined) warehouseData.snapshot[city].peakLimit = Number(row['入库峰值上限(方)']);
                        if (row['当前入库量(方)'] !== undefined) warehouseData.snapshot[city].peakCurrent = Number(row['当前入库量(方)']);
                        if (row['24H卸车及时率(%)'] !== undefined) warehouseData.snapshot[city].unloadRate24h = Number(row['24H卸车及时率(%)']);
                    });
                }

                if (workbook.SheetNames.indexOf('逆向日报') !== -1) {
                    var ws2 = workbook.Sheets['逆向日报'];
                    var rows2 = XLSX.utils.sheet_to_json(ws2);
                    rows2.forEach(function (row) {
                        var city = String(row['地区'] || '').trim();
                        if (!warehouseData.reverse[city]) return;
                        var rev = warehouseData.reverse[city];
                        if (row['前一日破损量'] !== undefined) rev.prevDamage = Number(row['前一日破损量']);
                        if (row['接收总量/台'] !== undefined) rev.receiveTotal = Number(row['接收总量/台']);
                        if (row['转正量'] !== undefined) rev['转正量'] = Number(row['转正量']);
                        if (row['待转正量'] !== undefined) rev['待转正量'] = Number(row['待转正量']);
                        if (row['品质异常'] !== undefined) rev['品质异常'] = Number(row['品质异常']);
                        if (row['三码全无'] !== undefined) rev['三码全无'] = Number(row['三码全无']);
                        if (row['单实不符'] !== undefined) rev['单实不符'] = Number(row['单实不符']);
                        if (row['换包量'] !== undefined) rev['换包量'] = Number(row['换包量']);
                        if (row['当日破损量'] !== undefined) rev.todayDamage = Number(row['当日破损量']);
                        if (row['占用面积'] !== undefined) rev.areaUsage = Number(row['占用面积']);
                    });
                }

                refreshAll();
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
        if (typeof XLSX === 'undefined') {
            showToast('正在加载 XLSX 库...', false);
            loadLocalXLSX(exportData);
            return;
        }
        var wb = XLSX.utils.book_new();

        var snapRows = CITIES.map(function (c) {
            return {
                '地区': c,
                '库存量': warehouseData.snapshot[c].stock,
                '入库量': warehouseData.snapshot[c].inbound,
                '出库量': warehouseData.snapshot[c].outbound,
                '存效(%)': warehouseData.snapshot[c].efficiency,
                '库容饱和度(%)': warehouseData.snapshot[c].saturation,
                '入库峰值上限(方)': warehouseData.snapshot[c].peakLimit,
                '当前入库量(方)': warehouseData.snapshot[c].peakCurrent,
                '24H卸车及时率(%)': warehouseData.snapshot[c].unloadRate24h
            };
        });
        var ws1 = XLSX.utils.json_to_sheet(snapRows);
        XLSX.utils.book_append_sheet(wb, ws1, '仓储快照');

        var revRows = Object.entries(warehouseData.reverse).map(function (entry) {
            var city = entry[0], d = entry[1];
            return {
                '地区': city,
                '前一日破损量': d.prevDamage,
                '接收总量/台': d.receiveTotal,
                '转正量': d['转正量'],
                '待转正量': d['待转正量'],
                '品质异常': d['品质异常'],
                '三码全无': d['三码全无'],
                '单实不符': d['单实不符'],
                '换包量': d['换包量'],
                '当日破损量': d.todayDamage,
                '占用面积': d.areaUsage
            };
        });
        var ws2 = XLSX.utils.json_to_sheet(revRows);
        XLSX.utils.book_append_sheet(wb, ws2, '逆向日报');

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

        html += '<div class="edit-section"><div class="edit-section-title">仓储快照数据</div>';
        html += '<div class="edit-grid">';
        CITIES.forEach(function (city) {
            var d = warehouseData.snapshot[city];
            html += '<div style="border:1px solid rgba(255,107,0,0.2);border-radius:8px;padding:10px;margin-bottom:8px;">';
            html += '<div style="color:var(--orange-light);font-weight:700;margin-bottom:6px;">&#x1F4CD; ' + city + '</div>';
            html += editInput(city, 'stock', '库存量', d.stock);
            html += editInput(city, 'inbound', '入库量', d.inbound);
            html += editInput(city, 'outbound', '出库量', d.outbound);
            html += editInput(city, 'efficiency', '存效(%)', d.efficiency);
            html += editInput(city, 'saturation', '饱和度(%)', d.saturation);
            html += editInput(city, 'peakLimit', '峰值上限(方)', d.peakLimit);
            html += editInput(city, 'peakCurrent', '当前入库(方)', d.peakCurrent);
            html += editInput(city, 'unloadRate24h', '及时率(%)', d.unloadRate24h);
            html += '</div>';
        });
        html += '</div></div>';

        html += '<div class="edit-section"><div class="edit-section-title">逆向日报数据（杭州/佛山/济南）</div>';
        html += '<div class="edit-grid">';
        Object.entries(warehouseData.reverse).forEach(function (entry) {
            var city = entry[0], d = entry[1];
            html += '<div style="border:1px solid rgba(255,107,0,0.2);border-radius:8px;padding:10px;margin-bottom:8px;">';
            html += '<div style="color:var(--orange-light);font-weight:700;margin-bottom:6px;">&#x1F504; ' + city + '</div>';
            html += editInputRev(city, 'prevDamage', '前一日破损量', d.prevDamage);
            html += editInputRev(city, 'receiveTotal', '接收总量/台', d.receiveTotal);
            html += editInputRev(city, '转正量', '转正量', d['转正量']);
            html += editInputRev(city, '待转正量', '待转正量', d['待转正量']);
            html += editInputRev(city, '品质异常', '品质异常', d['品质异常']);
            html += editInputRev(city, '三码全无', '三码全无', d['三码全无']);
            html += editInputRev(city, '单实不符', '单实不符', d['单实不符']);
            html += editInputRev(city, '换包量', '换包量', d['换包量']);
            html += editInputRev(city, 'todayDamage', '当日破损量', d.todayDamage);
            html += editInputRev(city, 'areaUsage', '占用面积', d.areaUsage);
            html += '</div>';
        });
        html += '</div></div>';

        form.innerHTML = html;
        modal.classList.add('active');
    } catch (err) {
        showToast('打开编辑失败：' + err.message, true);
        console.error('openManualEdit error:', err);
    }
}

function editInput(city, key, label, value) {
    return '<div class="edit-field"><label>' + label + '</label><input type="number" id="edit_snap_' + city + '_' + key + '" value="' + value + '"></div>';
}

function editInputRev(city, key, label, value) {
    return '<div class="edit-field"><label>' + label + '</label><input type="number" id="edit_rev_' + city + '_' + key + '" value="' + value + '"></div>';
}

function closeManualEdit() {
    var modal = document.getElementById('editModal');
    if (modal) modal.classList.remove('active');
}

function saveManualEdit() {
    try {
        CITIES.forEach(function (city) {
            var d = warehouseData.snapshot[city];
            var el;
            el = document.getElementById('edit_snap_' + city + '_stock'); if (el) d.stock = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_inbound'); if (el) d.inbound = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_outbound'); if (el) d.outbound = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_efficiency'); if (el) d.efficiency = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_saturation'); if (el) d.saturation = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_peakLimit'); if (el) d.peakLimit = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_peakCurrent'); if (el) d.peakCurrent = Number(el.value);
            el = document.getElementById('edit_snap_' + city + '_unloadRate24h'); if (el) d.unloadRate24h = Number(el.value);
        });

        Object.entries(warehouseData.reverse).forEach(function (entry) {
            var city = entry[0], d = entry[1];
            var el;
            el = document.getElementById('edit_rev_' + city + '_prevDamage'); if (el) d.prevDamage = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_receiveTotal'); if (el) d.receiveTotal = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_转正量'); if (el) d['转正量'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_待转正量'); if (el) d['待转正量'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_品质异常'); if (el) d['品质异常'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_三码全无'); if (el) d['三码全无'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_单实不符'); if (el) d['单实不符'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_换包量'); if (el) d['换包量'] = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_todayDamage'); if (el) d.todayDamage = Number(el.value);
            el = document.getElementById('edit_rev_' + city + '_areaUsage'); if (el) d.areaUsage = Number(el.value);
        });

        closeManualEdit();
        refreshAll();
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
        toast.style.background = isError ? 'rgba(255,82,82,0.9)' : 'rgba(255,107,0,0.9)';
        toast.style.color = '#fff';
        toast.textContent = msg;
        toast.style.opacity = '1';
        setTimeout(function () { toast.style.opacity = '0'; }, 2500);
    } catch (e) { console.error('showToast error:', e); }
}

// ============ 刷新入口（供 app.js 调用）============
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

function refreshSaturationCards() {
    var container = document.getElementById('saturationCards');
    if (!container) return;
    container.innerHTML = CITIES.map(function (city) {
        var d = warehouseData.snapshot[city];
        var pct = d.saturation;
        var color = pct > 80 ? 'var(--red)' : pct > 60 ? 'var(--orange-main)' : 'var(--green)';
        return '<div class="sat-card">' +
            '<div class="sat-header"><span class="sat-city">&#x1F4CD; ' + city + '</span><span class="sat-value" style="color:' + color + '">' + pct + '%</span></div>' +
            '<div class="sat-bar-bg"><div class="sat-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
            '<div class="sat-info"><span>存效: ' + d.efficiency + '%</span><span>峰值: ' + formatNum(d.peakCurrent) + '/' + formatNum(d.peakLimit) + ' 方</span></div>' +
            '</div>';
    }).join('');
}

function refreshRateCards() {
    var container = document.getElementById('rateCards');
    if (!container) return;
    container.innerHTML = CITIES.map(function (city) {
        var rate = warehouseData.snapshot[city].unloadRate24h;
        var cls = rate >= 95 ? 'good' : rate >= 90 ? 'mid' : 'bad';
        return '<div class="rate-card"><div class="rate-city">&#x1F4CD; ' + city + '</div><div class="rate-value ' + cls + '">' + rate + '%</div><div class="rate-label">24H卸车及时率</div></div>';
    }).join('');
}

function refreshPeakCards() {
    var container = document.getElementById('peakCards');
    if (!container) return;
    container.innerHTML = CITIES.map(function (city) {
        var d = warehouseData.snapshot[city];
        var pct = Math.round(d.peakCurrent / d.peakLimit * 100);
        var color = pct > 85 ? 'var(--red)' : pct > 60 ? 'var(--orange-main)' : 'var(--green)';
        return '<div class="peak-card"><div class="peak-city">&#x1F4CD; ' + city + '</div><div class="peak-value">' + formatNum(d.peakCurrent) + '</div><div class="peak-unit">/ ' + formatNum(d.peakLimit) + ' 方</div>' +
            '<div class="peak-bar-bg"><div class="peak-bar-fill" style="width:' + Math.min(pct, 100) + '%;background:' + color + '"></div></div></div>';
    }).join('');
}

function refreshReverseTable() {
    var tbody = document.getElementById('reverseBody');
    if (!tbody) return;
    tbody.innerHTML = Object.entries(warehouseData.reverse).map(function (entry) {
        var city = entry[0], d = entry[1];
        return '<tr><td style="font-weight:700;color:var(--orange-light)">' + city + '</td>' +
            '<td>' + d.prevDamage + '</td><td>' + d.receiveTotal + '</td><td>' + d['转正量'] + '</td>' +
            '<td>' + d['待转正量'] + '</td><td>' + d['品质异常'] + '</td><td>' + d['三码全无'] + '</td>' +
            '<td>' + d['单实不符'] + '</td><td>' + d['换包量'] + '</td><td>' + d.todayDamage + '</td><td>' + d.areaUsage + '</td></tr>';
    }).join('');
}
