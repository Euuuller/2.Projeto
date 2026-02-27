/* ==========================================================================
   SuperStorys Analytics Dashboard
   charts/descriptive.js — Descriptive Analysis Charts
   (Line · US Map · Donut · Top Products · Return Rate)
   ========================================================================== */

'use strict';

/* ── Main initialiser ────────────────────────────────────────────────────── */

/**
 * Initialise all descriptive analysis section charts:
 *  1. Monthly revenue line (4 years)
 *  2. US choropleth map (D3 + TopoJSON)
 *  3. Category donut chart
 *  4. Top 5 products bar
 *  5. Return rate line
 */
function initDescriptiveCharts() {

    /* ── 1. Monthly revenue line ── */
    const ctxLine = document.getElementById('descLineChart').getContext('2d');
    const makeGrad = (ctx, color) => {
        const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height || 300);
        g.addColorStop(0, hexAlpha(color, 0.25));
        g.addColorStop(1, hexAlpha(color, 0.0));
        return g;
    };

    registerChart('descLine', new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: DESC_MONTHS,
            datasets: [
                {
                    label: 'Total',
                    data: DESC_ORDERS_DATA,
                    borderColor: '#60A5FA', // Light blue matching the image
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#60A5FA',
                    tension: 0 // Straight lines
                },
                {
                    label: 'Linear (Total)',
                    data: DESC_ORDERS_TREND,
                    borderColor: '#BFDBFE', // Lighter dashed blue for the trendline
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: false, boxWidth: 12, boxHeight: 2 }
                },
                tooltip: {
                    callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} pedidos` }
                },
                datalabels: {
                    display: function (context) {
                        return context.datasetIndex === 0; // Only show data labels on the "Total" solid line
                    },
                    align: 'top',
                    anchor: 'end',
                    offset: 4,
                    font: { weight: '600', size: 11, family: "'Plus Jakarta Sans', sans-serif" },
                    color: '#334155'
                }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Números de Pedidos', color: '#64748B', font: { size: 12 } },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    suggestedMin: 0,
                    suggestedMax: 1600
                },
                x: {
                    title: { display: true, text: 'Data (Mês)', color: '#64748B', font: { size: 12 } },
                    grid: { display: false }
                },
            },
        },
        plugins: window.ChartDataLabels ? [window.ChartDataLabels] : []
    }));

    /* ── 2. US Map ── */
    initUSMap();

    /* ── 3. Category donut ── */
    const ctxDonut = document.getElementById('descDonutChart').getContext('2d');
    registerChart('descDonut', new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Eletrônicos', 'Vestuário', 'Casa', 'Beleza'],
            datasets: [{
                data: [38, 28, 20, 14],
                backgroundColor: [COLORS.indigo, COLORS.sky, COLORS.emerald, COLORS.amber],
                borderWidth: 0,
                hoverOffset: 8,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '68%',
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } },
            },
        },
    }));

    /* ── 4. Top 5 products bar ── */
    const ctxProd = document.getElementById('descTopProducts').getContext('2d');
    registerChart('descProd', new Chart(ctxProd, {
        type: 'bar',
        data: {
            labels: ['Smartphone X', 'Laptop Pro', 'Smartwatch', 'Fones BT', 'Tablet Z'],
            datasets: [{
                label: 'Vendas',
                data: [120000, 97000, 68000, 54000, 41000],
                backgroundColor: [COLORS.indigo, COLORS.sky, COLORS.teal, COLORS.purple, COLORS.emerald],
                borderRadius: 6,
                borderSkipped: false,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` Vendas : $${ctx.parsed.x.toLocaleString()}` } },
            },
            scales: {
                x: { ticks: { callback: v => '$' + (v / 1000) + 'k' }, grid: { color: 'rgba(0,0,0,0.04)' } },
                y: { grid: { display: false } },
            },
        },
    }));

    /* ── 5. Return rate line ── */
    const ctxReturn = document.getElementById('descReturnChart').getContext('2d');
    registerChart('descReturn', new Chart(ctxReturn, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
                { label: 'Devoluções', data: [2200, 1800, 9800, 4200, 5100, 4900], borderColor: COLORS.rose, backgroundColor: hexAlpha(COLORS.rose, 0.08), fill: true, borderWidth: 2, tension: 0, pointRadius: 4 },
                { label: 'Vendas', data: [8200, 6800, 8400, 7600, 8800, 8100], borderColor: COLORS.emerald, backgroundColor: 'transparent', borderWidth: 2, tension: 0, pointRadius: 4, borderDash: [5, 3] },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}` } },
            },
            scales: {
                y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v.toLocaleString() } },
                x: { grid: { display: false } },
            },
        },
    }));
}
