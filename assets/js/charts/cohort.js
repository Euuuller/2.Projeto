/* ==========================================================================
   SuperStorys Analytics Dashboard
   charts/cohort.js — Cohort Analysis Charts (Heatmap + Line + Bar)
   ========================================================================== */

'use strict';

/* ── Cohort retention heatmap (built from COHORT_DATA) ───────────────────── */

/**
 * Build and inject the cohort retention heatmap table into #heatmapContainer.
 * Idempotent: will not re-build if already rendered.
 */
function initCohortHeatmap() {
    const container = document.getElementById('heatmapContainer');
    if (!container || container.dataset.built) return;
    container.dataset.built = '1';

    const monthHeaders = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11'];

    let html = `
    <table class="heatmap-table">
      <thead>
        <tr>
          <th>Cohort</th>
          <th style="text-align:right">Usuários</th>
          ${monthHeaders.map(m => `<th>${m}</th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

    COHORT_DATA.months.forEach((month, i) => {
        const users = COHORT_DATA.users[i].toLocaleString('pt-BR');
        const row = COHORT_DATA.retention[i];

        html += `<tr>
      <td>${month}</td>
      <td style="text-align:right;font-family:'DM Mono',monospace;font-size:12px;color:#64748B">${users}</td>`;

        monthHeaders.forEach((_, j) => {
            if (j < row.length) {
                const pct = row[j];
                html += `<td class="hm-cell"
                     style="background:${heatmapColor(pct)};color:${textColorForBg(pct)}"
                     title="${month} · M${j}: ${pct}%">${pct}%</td>`;
            } else {
                html += `<td></td>`;
            }
        });

        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

/* ── Cohort chart initialiser ────────────────────────────────────────────── */

/**
 * Initialise all cohort section charts:
 *  1. Retention heatmap table
 *  2. Average retention line chart
 *  3. Users-per-cohort bar chart
 */
function initCohortCharts() {
    initCohortHeatmap();

    /* ── Average retention line ── */
    const avgRetention = [];
    for (let m = 0; m < 12; m++) {
        let sum = 0, cnt = 0;
        COHORT_DATA.retention.forEach(row => {
            if (row[m] !== undefined) { sum += row[m]; cnt++; }
        });
        avgRetention.push(cnt ? Math.round(sum / cnt) : null);
    }

    const ctxLine = document.getElementById('cohortLineChart').getContext('2d');
    const gradLine = gradientV(ctxLine, hexAlpha(COLORS.indigo, 0.3), hexAlpha(COLORS.indigo, 0.0));

    registerChart('cohortLine', new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11'],
            datasets: [{
                label: 'Retenção Média (%)',
                data: avgRetention,
                borderColor: COLORS.indigo,
                backgroundColor: gradLine,
                borderWidth: 2.5,
                pointBackgroundColor: COLORS.indigo,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4,
                spanGaps: true,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y}%` } },
            },
            scales: {
                y: { min: 0, max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false } },
            },
        },
    }));

    /* ── Users per cohort bar ── */
    const ctxBar = document.getElementById('cohortBarChart').getContext('2d');
    const barGrad = ctxBar.createLinearGradient(0, 0, 0, 300);
    barGrad.addColorStop(0, COLORS.teal);
    barGrad.addColorStop(1, hexAlpha(COLORS.teal, 0.4));

    registerChart('cohortBar', new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: COHORT_DATA.months,
            datasets: [{
                label: 'Novos Usuários',
                data: COHORT_DATA.users,
                backgroundColor: barGrad,
                borderRadius: 6,
                borderSkipped: false,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y.toLocaleString('pt-BR')} usuários` } },
            },
            scales: {
                y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } },
                x: { grid: { display: false }, ticks: { maxRotation: 45 } },
            },
        },
    }));
}
