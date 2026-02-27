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
    // Map colors from RFM_SEGMENTS to a dictionary for quick lookup (case-insensitive)
    const segmentColors = {};
    RFM_SEGMENTS.forEach(seg => {
        segmentColors[seg.name.toLowerCase()] = seg.color;
    });

    const scatterDatasets = RFM_SCATTER_DATA.map(item => {
        const c = segmentColors[item.name.toLowerCase()] || '#64748B';
        // Base size 6px, max size approx 40px for count=314
        const rSize = 6 + (item.count / 314) * 34;

        return {
            label: item.name,
            data: [{
                x: item.recency,
                y: item.monetary,
                r: rSize,
                _count: item.count,
                _pct: item.pct
            }],
            backgroundColor: hexAlpha(c, 0.75),
            borderColor: c,
            borderWidth: 1,
        };
    });

    const ctxScatter = document.getElementById('rfmScatter').getContext('2d');
    registerChart('rfmScatter', new Chart(ctxScatter, {
        type: 'bubble',
        data: {
            datasets: scatterDatasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Set to false to allow custom height/layout with legend
            layout: { padding: { right: 10 } },
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
                        padding: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const d = ctx.raw;
                            return [
                                `Segmento: ${ctx.dataset.label}`,
                                `Recência Média: ${d.x.toFixed(1)} dias`,
                                `Monetário Médio: $${d.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                `Clientes: ${d._count} (${d._pct}%)`
                            ];
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: { display: true, text: 'Recência Média', color: '#64748B', font: { size: 11 } },
                    grid: { color: 'rgba(0,0,0,0.04)' }
                },
                y: {
                    title: { display: true, text: 'Monetização Média', color: '#64748B', font: { size: 11 } },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { callback: v => '$' + v.toLocaleString() }
                },
            },
        },
    }));

    /* ── Horizontal bar: Revenue per segment ── */
    const revenueDataSorted = [...RFM_REVENUE_DATA].sort((a, b) => b.revenue - a.revenue);

    // Revenue formatted strings for datalabels
    const revenueLabels = revenueDataSorted.map(item => '$' + item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    const ctxBar = document.getElementById('rfmBarChart').getContext('2d');
    registerChart('rfmBar', new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: revenueDataSorted.map(s => s.name),
            datasets: [{
                label: 'Receita (USD)',
                data: revenueDataSorted.map(s => s.revenue),
                backgroundColor: revenueDataSorted.map(s => segmentColors[s.name.toLowerCase()] || '#94A3B8'),
                borderRadius: 4,
                borderSkipped: false,
                barThickness: 16,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false, // allowing the tall chart-wrap CSS to dictate height
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` Receita : $${ctx.parsed.x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` } },
                datalabels: {
                    anchor: 'end',
                    align: 'right',
                    formatter: (value, context) => revenueLabels[context.dataIndex],
                    font: { weight: 'bold', size: 11 },
                    color: '#333'
                }
            },
            scales: {
                x: {
                    ticks: { callback: v => '$' + (v / 1000) + 'k' },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    suggestedMax: Math.max(...revenueDataSorted.map(s => s.revenue)) * 1.3 // 1.3 avoids cutting off large string labels like '$1,079,119.11'
                },
                y: {
                    grid: { display: false },
                    ticks: { padding: 10 }
                },
            },
        },
        plugins: window.ChartDataLabels ? [window.ChartDataLabels] : []
    }));

    /* ── Horizontal bar: Volume per segment ── */
    const ctxVolume = document.getElementById('rfmVolumeChart');
    if (ctxVolume) {
        // Create an array of strings formatted like "314" for datalabels
        const volumeLabels = RFM_SEGMENTS.map(seg => seg.value.toString());

        registerChart('rfmVolume', new Chart(ctxVolume.getContext('2d'), {
            type: 'bar',
            data: {
                labels: RFM_SEGMENTS.map(s => s.name),
                datasets: [{
                    label: 'Volume de Clientes',
                    data: RFM_SEGMENTS.map(s => s.value),
                    backgroundColor: RFM_SEGMENTS.map(s => s.color),
                    borderRadius: 4,
                    borderSkipped: false,
                    barThickness: 16,
                }],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: ctx => ` Qtd: ${ctx.parsed.x}` } },
                    // Enable DataLabels plugin if it's imported globally
                    datalabels: {
                        anchor: 'end',
                        align: 'right',
                        formatter: (value, context) => volumeLabels[context.dataIndex],
                        font: { weight: 'bold', size: 11 },
                        color: '#333'
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        suggestedMax: Math.max(...RFM_SEGMENTS.map(s => s.value)) * 1.15 // Give space for labels
                    },
                    y: {
                        grid: { display: false },
                        ticks: { padding: 10 }
                    },
                },
            },
            plugins: window.ChartDataLabels ? [window.ChartDataLabels] : []
        }));
    }

    /* ── Ações por Segmento Table ── */
    const tableBody = document.getElementById('rfmActionTableBody');
    if (tableBody) {
        tableBody.innerHTML = RFM_SEGMENTS.map(seg => `
            <tr>
                <td>
                    <div class="rfm-segment-name">
                        <div class="rfm-segment-dot" style="background-color: ${seg.color}"></div>
                        ${seg.name}
                    </div>
                </td>
                <td style="text-align: right; font-weight: 600; font-family: 'JetBrains Mono', monospace;">${seg.value}</td>
                <td class="rfm-strategy-text">${seg.strategy}</td>
            </tr>
        `).join('');
    }
}
