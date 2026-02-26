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

    // Clear loading/previous content if any
    container.innerHTML = '';

    // Create the outer grid wrapper
    const gridDiv = document.createElement('div');
    gridDiv.className = 'rfm-grid';

    // Calculate total to get percentage
    const totalUsers = RFM_SEGMENTS.reduce((sum, seg) => sum + seg.value, 0);

    // Build each card using the gridArea assigned in data.js
    RFM_SEGMENTS.forEach(seg => {
        const card = document.createElement('div');
        card.className = 'rfm-grid-card';
        card.style.gridArea = seg.gridArea;
        card.style.backgroundColor = seg.color;
        card.style.color = seg.textColor || '#ffffff'; // Fallback to white if no explicit text color

        const pct = ((seg.value / totalUsers) * 100).toFixed(0);

        // Dynamically shrink typography on tiny cards using gridArea mapping
        // 'cnpp', 'cpr', 'cpa' often take small squares in the grid.
        let fontSizeTitle = '13.5px';
        let fontSizeVal = '24px';

        if (['cpr', 'cnpp', 'nc'].includes(seg.gridArea)) {
            fontSizeTitle = '11.5px';
            fontSizeVal = '16px';
        }

        card.innerHTML = `
            <div class="rfm-card-title" style="font-size: ${fontSizeTitle}">${seg.name}</div>
            <div class="rfm-card-val" style="font-size: ${fontSizeVal}">${seg.value}</div>
            <div class="rfm-card-pct">${pct}%</div>
        `;

        gridDiv.appendChild(card);
    });

    container.appendChild(gridDiv);
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
