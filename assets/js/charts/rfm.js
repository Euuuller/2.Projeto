/* ==========================================================================
   SuperStorys Analytics Dashboard
   charts/rfm.js — RFM Segmentation Charts (Treemap + Bubble + Bar)
   ========================================================================== */

'use strict';

/* ── RFM segment treemap (D3) ───────────────────────────────────────────── */

/**
 * Build the RFM treemap visualisation using D3 inside #rfmTreemap.
 * Idempotent: will not re-build if already rendered.
 */
function initRFMTreemap() {
    const container = document.getElementById('rfmTreemap');
    if (!container || container.dataset.built) return;
    container.dataset.built = '1';

    const W = container.clientWidth || 700;
    const H = 380;

    const svg = d3.select(container).append('svg')
        .attr('width', '100%')
        .attr('height', H)
        .attr('viewBox', `0 0 ${W} ${H}`);

    const root = d3.hierarchy({ children: RFM_SEGMENTS })
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap().size([W, H]).padding(3).round(true)(root);

    const tooltip = d3.select('body').append('div')
        .attr('class', 'map-tooltip')
        .style('pointer-events', 'none');

    const cell = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    /* Cells */
    cell.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('rx', 8)
        .attr('fill', d => d.data.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function (event, d) {
            d3.select(this).attr('opacity', 0.85);
            tooltip.html(`<strong>${d.data.name}</strong><br/>Clientes: ${d.data.value.toLocaleString('pt-BR')}`)
                .classed('visible', true);
        })
        .on('mousemove', event => {
            tooltip.style('left', (event.clientX + 12) + 'px').style('top', (event.clientY - 36) + 'px');
        })
        .on('mouseleave', function () {
            d3.select(this).attr('opacity', 1);
            tooltip.classed('visible', false);
        });

    /* Label: segment name */
    cell.append('text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2 - 6)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-family', "'DM Sans', sans-serif")
        .attr('font-size', d => (d.x1 - d.x0) > 120 ? 13 : 10)
        .attr('font-weight', '600')
        .text(d => (d.x1 - d.x0) > 70 ? d.data.name : '');

    /* Label: client count */
    cell.append('text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2 + 12)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.75)')
        .attr('font-family', "'DM Mono', monospace")
        .attr('font-size', 11)
        .text(d => (d.x1 - d.x0) > 90 ? d.data.value.toLocaleString() : '');
}

/* ── RFM chart initialiser ───────────────────────────────────────────────── */

/**
 * Initialise all RFM section charts:
 *  1. Treemap (D3)
 *  2. Recency vs Monetary bubble scatter
 *  3. Revenue per segment horizontal bar
 */
function initRFMCharts() {
    initRFMTreemap();

    /* ── Bubble scatter: Recency vs Monetary ── */
    const scatterData = [];
    for (let i = 0; i < 60; i++) {
        const seg = RFM_SEGMENTS[Math.floor(Math.random() * RFM_SEGMENTS.length)];
        scatterData.push({
            x: Math.round(Math.random() * 95 + 5),
            y: Math.round(Math.random() * 5500 + 200),
            r: Math.round(Math.random() * 18 + 5),
            color: seg.color,
        });
    }

    const ctxScatter = document.getElementById('rfmScatter').getContext('2d');
    registerChart('rfmScatter', new Chart(ctxScatter, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Clientes',
                data: scatterData,
                backgroundColor: scatterData.map(d => hexAlpha(d.color, 0.55)),
                borderColor: scatterData.map(d => d.color),
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const d = ctx.raw;
                            return [`Recência: ${d.x} dias`, `Monetário: $${d.y.toLocaleString()}`, `Frequência: ${d.r}`];
                        },
                    },
                },
            },
            scales: {
                x: { title: { display: true, text: 'Recência (dias)', color: '#64748B', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.04)' } },
                y: { title: { display: true, text: 'Monetário ($)', color: '#64748B', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => '$' + v.toLocaleString() } },
            },
        },
    }));

    /* ── Horizontal bar: Revenue per segment ── */
    const ctxBar = document.getElementById('rfmBarChart').getContext('2d');
    registerChart('rfmBar', new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Champions', 'Loyal', 'Potential', 'At Risk', 'Lost'],
            datasets: [{
                label: 'Receita (USD)',
                data: [61200, 38400, 28000, 12500, 5100],
                backgroundColor: [COLORS.indigo, '#818CF8', '#94A3B8', '#CBD5E1', '#E2E8F0'],
                borderRadius: 6,
                borderSkipped: false,
                borderWidth: 0,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` Receita : $${ctx.parsed.x.toLocaleString()}` } },
            },
            scales: {
                x: { ticks: { callback: v => '$' + (v / 1000) + 'k' }, grid: { color: 'rgba(0,0,0,0.04)' } },
                y: { grid: { display: false } },
            },
        },
    }));
}
