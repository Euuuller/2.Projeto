/* ==========================================================================
   SuperStorys Analytics Dashboard
   charts/performance.js — Performance Analysis Charts
   (Line · Radar · Bar YoY · Polar · Bar CAC/LTV)
   ========================================================================== */

'use strict';

/**
 * Initialise all performance section charts:
 *  1. Revenue vs Target vs Profit line
 *  2. Margin by category radar
 *  3. Year-over-year growth bar
 *  4. Conversion by channel polar area
 *  5. CAC vs LTV grouped bar
 */
function initPerformanceCharts() {

    /* ── 1. Revenue / Target / Profit line ── */
    const ctxLine = document.getElementById('perfLineChart').getContext('2d');
    const profGrad = ctxLine.createLinearGradient(0, 0, 0, 300);
    profGrad.addColorStop(0, hexAlpha(COLORS.emerald, 0.25));
    profGrad.addColorStop(1, hexAlpha(COLORS.emerald, 0.0));

    registerChart('perfLine', new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: PERF_DATA.labels,
            datasets: [
                {
                    label: 'Receita Real',
                    data: PERF_DATA.revenue,
                    borderColor: COLORS.indigo,
                    borderWidth: 2.5,
                    pointBackgroundColor: COLORS.indigo,
                    pointRadius: 4,
                    tension: 0.4,
                    fill: false,
                },
                {
                    label: 'Meta',
                    data: PERF_DATA.target,
                    borderColor: COLORS.amber,
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    tension: 0.4,
                    fill: false,
                },
                {
                    label: 'Lucro',
                    data: PERF_DATA.profit,
                    borderColor: COLORS.emerald,
                    backgroundColor: profGrad,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.y.toLocaleString()}` } },
            },
            scales: {
                y: { ticks: { callback: v => '$' + (v / 1000) + 'k' }, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false } },
            },
        },
    }));

    /* ── 2. Margin by category radar ── */
    const ctxMargin = document.getElementById('perfMarginChart').getContext('2d');
    registerChart('perfMargin', new Chart(ctxMargin, {
        type: 'radar',
        data: {
            labels: ['Eletrônicos', 'Vestuário', 'Casa', 'Beleza', 'Acessórios'],
            datasets: [
                { label: '2022', data: [28, 34, 31, 42, 38], borderColor: hexAlpha(COLORS.indigo, 0.6), backgroundColor: hexAlpha(COLORS.indigo, 0.08), borderWidth: 2, pointRadius: 3 },
                { label: '2023', data: [32, 38, 35, 47, 42], borderColor: COLORS.teal, backgroundColor: hexAlpha(COLORS.teal, 0.08), borderWidth: 2, pointRadius: 3 },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } },
            },
            scales: {
                r: { min: 0, max: 60, ticks: { callback: v => v + '%', stepSize: 20, backdropColor: 'transparent' }, grid: { color: 'rgba(0,0,0,0.06)' } },
            },
        },
    }));

    /* ── 3. Year-over-year growth bar ── */
    const yoyData = [15.2, 18.6, 12.4, 22.1, 17.8, 24.3, 19.5, 21.2];
    const yoyColors = yoyData.map(v => v >= 20 ? COLORS.emerald : v >= 15 ? COLORS.teal : COLORS.indigo);

    const ctxYoY = document.getElementById('perfYoYChart').getContext('2d');
    registerChart('perfYoY', new Chart(ctxYoY, {
        type: 'bar',
        data: {
            labels: ['Q1 2020', 'Q2 2020', 'Q1 2021', 'Q2 2021', 'Q1 2022', 'Q2 2022', 'Q1 2023', 'Q2 2023'],
            datasets: [{
                label: 'Crescimento YoY (%)',
                data: yoyData,
                backgroundColor: yoyColors,
                borderRadius: 6,
                borderSkipped: false,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` +${ctx.parsed.y}%` } },
            },
            scales: {
                y: { ticks: { callback: v => v + '%' }, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false }, ticks: { maxRotation: 45, font: { size: 10 } } },
            },
        },
    }));

    /* ── 4. Conversion by channel polar area ── */
    const ctxChannel = document.getElementById('perfChannelChart').getContext('2d');
    registerChart('perfChannel', new Chart(ctxChannel, {
        type: 'polarArea',
        data: {
            labels: ['Orgânico', 'E-mail', 'Social', 'Pago', 'Direto'],
            datasets: [{
                data: [4.8, 6.2, 3.1, 5.5, 7.4],
                backgroundColor: [
                    hexAlpha(COLORS.indigo, 0.75),
                    hexAlpha(COLORS.teal, 0.75),
                    hexAlpha(COLORS.amber, 0.75),
                    hexAlpha(COLORS.rose, 0.75),
                    hexAlpha(COLORS.purple, 0.75),
                ],
                borderWidth: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 12 } },
                tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } },
            },
            scales: { r: { ticks: { backdropColor: 'transparent', font: { size: 9 } } } },
        },
    }));

    /* ── 5. CAC vs LTV grouped bar ── */
    const ctxCac = document.getElementById('perfCacLtvChart').getContext('2d');
    registerChart('perfCacLtv', new Chart(ctxCac, {
        type: 'bar',
        data: {
            labels: ['Orgânico', 'E-mail', 'Social', 'Pago', 'Direto'],
            datasets: [
                { label: 'LTV ($)', data: [520, 480, 310, 440, 590], backgroundColor: COLORS.indigo, borderRadius: 4, borderSkipped: false },
                { label: 'CAC ($)', data: [42, 35, 68, 95, 28], backgroundColor: COLORS.rose, borderRadius: 4, borderSkipped: false },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y}` } },
            },
            scales: {
                y: { ticks: { callback: v => '$' + v }, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false } },
            },
        },
    }));
}
