/* ============================================
   app.js - 主应用逻辑、UI 刷新、背景动画
   （formatNum / animateValue 已移至 data.js，
    本文件只保留 app 专属逻辑）
   ============================================ */

// ============ 时钟更新 ============
function updateClock() {
    var now = new Date();
    var weekDay = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
    var dateStr = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 星期' + weekDay;
    var timeStr = now.toTimeString().slice(0, 8);
    var dateEl = document.getElementById('headerDate');
    var timeEl = document.getElementById('headerTime');
    if (dateEl) dateEl.textContent = dateStr;
    if (timeEl) timeEl.textContent = timeStr;
}

// ============ 统一刷新入口 ============
function refreshAll() {
    if (typeof refreshSummary === 'function') refreshSummary();
    if (typeof refreshCityCards === 'function') refreshCityCards();
    if (typeof refreshSaturationCards === 'function') refreshSaturationCards();
    if (typeof refreshRateCards === 'function') refreshRateCards();
    if (typeof refreshPeakCards === 'function') refreshPeakCards();
    if (typeof refreshReverseTable === 'function') refreshReverseTable();
    if (typeof refreshCharts === 'function') refreshCharts();
}

// ============ 背景粒子动画 ============
function initBgCanvas() {
    var canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h;
    var particles = [];
    var PARTICLE_COUNT = 50;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function Particle() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
        }
    };
    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 140, 51, ' + this.opacity + ')';
        ctx.fill();
    };

    for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(255, 107, 0, ' + (0.08 * (1 - dist / 160)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        particles.forEach(function (p) { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

// ============ 初始化 ============
document.addEventListener('DOMContentLoaded', function () {
    updateClock();
    setInterval(updateClock, 1000);
    initBgCanvas();
    // 等待所有脚本加载完毕后再刷新
    setTimeout(function () { refreshAll(); }, 100);
});
