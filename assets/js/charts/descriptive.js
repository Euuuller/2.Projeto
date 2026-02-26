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
                { label: '2020', data: DESC_REVENUE[2020], borderColor: hexAlpha(COLORS.indigo, 0.5), backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, tension: 0.4 },
                { label: '2021', data: DESC_REVENUE[2021], borderColor: hexAlpha(COLORS.teal, 0.6), backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, tension: 0.4 },
                { label: '2022', data: DESC_REVENUE[2022], borderColor: COLORS.amber, backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, tension: 0.4 },
                { label: '2023', data: DESC_REVENUE[2023], borderColor: COLORS.indigo, backgroundColor: makeGrad(ctxLine, COLORS.indigo), fill: true, borderWidth: 2.5, pointRadius: 4, tension: 0.4 },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.y.toLocaleString()} USD` } },
            },
            scales: {
                y: { ticks: { callback: v => '$' + (v / 1000) + 'k' }, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false } },
            },
        },
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

/* ── US State choropleth map (D3 + TopoJSON) ─────────────────────────────── */

/**
 * Fetch US TopoJSON from CDN, render a choropleth coloured by STATE_SALES,
 * and append a colour-scale legend below the map.
 * Idempotent: will not re-build if already rendered.
 */
async function initUSMap() {
    const container = document.getElementById('usMap');
    if (!container || container.dataset.built) return;
    container.dataset.built = '1';

    const W = container.clientWidth || 500;
    const H = 260;

    let usJson;
    try {
        const res = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
        usJson = await res.json();
    } catch (e) {
        container.innerHTML = `<div style="padding:1.5rem;color:#64748B;font-size:13px">Mapa indisponível (sem conexão)</div>`;
        return;
    }

    const states = topojson.feature(usJson, usJson.objects.states);
    const projection = d3.geoAlbersUsa().fitSize([W, H], states);
    const path = d3.geoPath().projection(projection);
    const maxVal = Math.max(...Object.values(STATE_SALES));
    const colorScale = d3.scaleSequential([0, maxVal], d3.interpolate('#EEF2FF', '#3730A3'));

    const svg = d3.select(container).append('svg').attr('width', '100%').attr('height', H).attr('viewBox', `0 0 ${W} ${H}`);
    const tooltip = d3.select('body').append('div').attr('class', 'map-tooltip');

    svg.selectAll('path')
        .data(states.features)
        .join('path')
        .attr('d', path)
        .attr('fill', d => {
            const abbr = FIPS_TO_ABBREV[String(d.id).padStart(2, '0')];
            return colorScale(STATE_SALES[abbr] || 0);
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', function (event, d) {
            d3.select(this).attr('stroke', '#6366F1').attr('stroke-width', 1.5);
            const abbr = FIPS_TO_ABBREV[String(d.id).padStart(2, '0')] || '??';
            tooltip.html(`<strong>${abbr}</strong> — $${(STATE_SALES[abbr] || 0).toLocaleString()}`).classed('visible', true);
        })
        .on('mousemove', event => {
            tooltip.style('left', (event.clientX + 12) + 'px').style('top', (event.clientY - 36) + 'px');
        })
        .on('mouseleave', function () {
            d3.select(this).attr('stroke', '#fff').attr('stroke-width', 0.8);
            tooltip.classed('visible', false);
        });

    /* Colour legend */
    const lgSvg = d3.select(container).append('svg').attr('width', '100%').attr('height', 30).attr('viewBox', `0 0 ${W} 30`);
    const defs = lgSvg.append('defs');
    const lg = defs.append('linearGradient').attr('id', 'mapGrad');
    lg.append('stop').attr('offset', '0%').attr('stop-color', '#EEF2FF');
    lg.append('stop').attr('offset', '100%').attr('stop-color', '#3730A3');

    lgSvg.append('rect').attr('x', W / 2 - 80).attr('y', 8).attr('width', 160).attr('height', 10).attr('rx', 5).attr('fill', 'url(#mapGrad)');
    lgSvg.append('text').attr('x', W / 2 - 85).attr('y', 22).attr('text-anchor', 'end').attr('font-size', 9).attr('fill', '#94A3B8').text('$0');
    lgSvg.append('text').attr('x', W / 2 + 85).attr('y', 22).attr('text-anchor', 'start').attr('font-size', 9).attr('fill', '#94A3B8').text('$320k');
}
