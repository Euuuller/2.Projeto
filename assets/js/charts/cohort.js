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
          ${monthHeaders.map(m => `<th>${m}</th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

    COHORT_DATA.months.forEach((month, i) => {
        const row = COHORT_DATA.retention[i];

        html += `<tr>
      <td>${month}</td>`;

        monthHeaders.forEach((_, j) => {
            if (j < row.length) {
                const pct = row[j];
                html += `<td class="hm-cell"
                     style="background:${heatmapColor(pct)};color:${textColorForBg(pct)}"
                     title="${month} · M${j}: ${pct.toFixed(2)}%">${pct.toFixed(2)}%</td>`;
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

    // 12 specific colors mapped to cohorts as per reference
    const cohortColors = [
        '#2b82c9', // 2014-01 (Blue)
        '#66a827', // 2014-02 (Green)
        '#f59d16', // 2014-03 (Orange)
        '#27befa', // 2014-04 (Light Blue)
        '#ffa726', // 2014-05 (Orange/Amber)
        '#ef5350', // 2014-06 (Red)
        '#2ea9f5', // 2014-07 (Blue)
        '#66bb6a', // 2014-08 (Green)
        '#42a5f5', // 2014-09 (Blue)
        '#ffb300', // 2014-10 (Amber)
        '#4caf50', // 2014-11 (Green)
        '#9e9e9e'  // 2014-12 (Grey/Neutral)
    ];

    /* ── Retention Curve per Cohort (Line Chart) ── */
    const lineDatasets = COHORT_DATA.months.map((month, i) => {
        // Pad data with nulls at the beginning (offset by month index if shifting was needed, 
        // but here all cohorts start at M0 on the x-axis, just different lengths)
        const data = COHORT_DATA.retention[i].slice();

        return {
            label: month,
            data: data,
            borderColor: cohortColors[i],
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: cohortColors[i],
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            tension: 0.4,
            spanGaps: true,
        };
    });

    const ctxLine = document.getElementById('cohortLineChart').getContext('2d');

    registerChart('cohortLine', new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Mês 0', 'Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6', 'Mês 7', 'Mês 8', 'Mês 9', 'Mês 10', 'Mês 11'],
            datasets: lineDatasets,
        },
        options: {
            interaction: {
                mode: 'index',
                intersect: false,
            },
            responsive: true,
            maintainAspectRatio: false, // Allows chart to fill its taller container
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', // Darker, sleeker background
                    titleColor: '#ffffff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 4,
                    usePointStyle: true,
                    callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` }
                },
            },
            layout: {
                padding: { bottom: 10 }
            },
            scales: {
                y: { min: 0, max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { color: 'rgba(0,0,0,0.04)' } },
            },
        },
    }));

    /* ── Month 1 Retention per Cohort (Horizontal Bar Chart) ── */
    const m1Retention = COHORT_DATA.retention.map(row => row[1] !== undefined ? row[1] : null);

    // Create an array of strings formatted like "9.4%" for datalabels, or empty for null
    const m1Labels = m1Retention.map(val => val !== null ? `${val.toFixed(1)}%` : '');

    const ctxBar = document.getElementById('cohortBarChart').getContext('2d');

    registerChart('cohortBar', new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: COHORT_DATA.months,
            datasets: [{
                label: 'Retenção Mês 1',
                data: m1Retention,
                backgroundColor: cohortColors,
                borderRadius: 2,
                borderSkipped: false,
                barThickness: 12, // Make bars thinner like reference
            }],
        },
        options: {
            indexAxis: 'y', // Make it horizontal
            responsive: true,
            maintainAspectRatio: false, // Fill container
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x}%` } },
                // Enable DataLabels plugin if it's imported globally via Chart.js
                datalabels: {
                    anchor: 'end',
                    align: 'right',
                    formatter: (value, context) => m1Labels[context.dataIndex],
                    font: { weight: 'bold', size: 11 },
                    color: '#333'
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 30, // Fit the highest value (~24%)
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { callback: v => v + '%' }
                },
                y: {
                    grid: { display: false },
                    ticks: { padding: 10 }
                },
            },
        },
        // Only load plugin if it exists in window
        plugins: window.ChartDataLabels ? [window.ChartDataLabels] : []
    }));
}
