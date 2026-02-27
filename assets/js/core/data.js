/* ==========================================================================
   SuperStorys Analytics Dashboard
   data.js — All Dashboard Data Constants
   ========================================================================== */

'use strict';

/* ── Cohort Analysis — 2014 (12 cohorts × 12 months) ────────────────────── */
const COHORT_DATA = {
    months: [
        '2014-01', '2014-02', '2014-03', '2014-04', '2014-05', '2014-06',
        '2014-07', '2014-08', '2014-09', '2014-10', '2014-11', '2014-12',
    ],
    users: [2791, 3815, 3500, 2075, 4024, 2864, 3560, 3454, 2683, 5717, 3128, 4210],
    retention: [
        [100, 9.38, 0.00, 6.25, 6.25, 0.00, 6.25, 12.50, 15.63, 9.38, 21.88, 15.63],
        [100, 16.67, 8.33, 4.17, 0.00, 8.33, 8.33, 12.50, 12.50, 16.67, 16.67, 0.00],
        [100, 6.15, 3.08, 12.31, 10.77, 0.00, 10.77, 7.69, 12.31, 9.23, 0.00, 0.00],
        [100, 10.71, 3.57, 7.14, 5.36, 14.29, 10.71, 16.07, 14.29, 0.00, 0.00, 0.00],
        [100, 8.93, 8.93, 7.14, 17.86, 3.57, 21.43, 17.86, 0.00, 0.00, 0.00, 0.00],
        [100, 2.08, 4.17, 8.33, 4.17, 18.75, 16.67, 0.00, 0.00, 0.00, 0.00, 0.00],
        [100, 13.64, 11.36, 0.00, 11.36, 18.18, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [100, 16.33, 6.12, 22.45, 10.20, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [100, 13.24, 13.24, 16.18, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [100, 7.14, 11.90, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [100, 24.19, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
        [100, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
    ],
};

/* ── RFM Segmentation ────────────────────────────────────────────────────── */
const RFM_SEGMENTS = [
    { name: 'Fiéis em potencial', value: 314, color: '#27befa', gridArea: 'fp', textColor: '#ffffff', strategy: 'Aumentar frequência, ofertas' },
    { name: 'Clientes fiéis', value: 217, color: '#1664d4', gridArea: 'cf', textColor: '#ffffff', strategy: 'Upselling, programas VIP' },
    { name: 'Clientes perdidos', value: 83, color: '#e02424', gridArea: 'cp', textColor: '#ffffff', strategy: 'Campanha massiva' },
    { name: 'Clientes em risco', value: 61, color: '#f59e0b', gridArea: 'cr', textColor: '#ffffff', strategy: 'Recuperação urgente' },
    { name: 'Campeões', value: 30, color: '#fcd34d', gridArea: 'ca', textColor: '#111827', strategy: 'Recompensar, buscar embaixadores' },
    { name: 'Clientes quase dormentes', value: 28, color: '#9ca3af', gridArea: 'cqd', textColor: '#ffffff', strategy: 'Última tentativa de resgate' },
    { name: 'Novos clientes', value: 18, color: '#68d391', gridArea: 'nc', textColor: '#ffffff', strategy: 'Onboarding, experiências' },
    { name: 'Clientes que precisam de atenção', value: 17, color: '#f59e0b', gridArea: 'cpa', textColor: '#ffffff', strategy: 'Reengajamento imediato' },
    { name: 'Clientes hibernando', value: 14, color: '#8b8bb5', gridArea: 'ch', textColor: '#ffffff', strategy: 'Reativação com desconto' },
    { name: 'Clientes promissores', value: 7, color: '#4ade80', gridArea: 'cpr', textColor: '#ffffff', strategy: 'Criar hábito de compra' },
    { name: 'Clientes que não posso perder', value: 4, color: '#a855f7', gridArea: 'cnpp', textColor: '#ffffff', strategy: 'Win-back premium' },
];

/* ── RFM Scatter Data (Recency vs Monetary) ──────────────────────────────── */
const RFM_SCATTER_DATA = [
    { name: "Fiéis em Potencial", recency: 56.06, monetary: 1825.01, count: 314, pct: 39.60 },
    { name: "Clientes Fiéis", recency: 69.37, monetary: 4972.90, count: 217, pct: 27.36 },
    { name: "Clientes Perdidos", recency: 520.66, monetary: 825.32, count: 83, pct: 10.47 },
    { name: "Clientes em Risco", recency: 415.85, monetary: 3849.04, count: 61, pct: 7.69 },
    { name: "Campeões", recency: 29.30, monetary: 7210.17, count: 30, pct: 3.78 },
    { name: "Clientes Quase Dormentes", recency: 179.82, monetary: 967.49, count: 28, pct: 3.53 },
    { name: "Novos Clientes", recency: 33.72, monetary: 467.21, count: 18, pct: 2.27 },
    { name: "Clientes Que Precisam De Atenção", recency: 186.06, monetary: 2300.33, count: 17, pct: 2.14 },
    { name: "Clientes Hibernando", recency: 248.36, monetary: 1001.69, count: 14, pct: 1.77 },
    { name: "Clientes Promissores", recency: 93.29, monetary: 425.45, count: 7, pct: 0.88 },
    { name: "Clientes Que Não Posso Perder", recency: 340.25, monetary: 8455.84, count: 4, pct: 0.50 }
];

/* ── RFM Revenue Data (Receita por Segmento) ─────────────────────────────── */
const RFM_REVENUE_DATA = [
    { name: "Campeões", revenue: 216305.27 },
    { name: "Clientes em risco", revenue: 234791.23 },
    { name: "Clientes fiéis", revenue: 1079119.11 },
    { name: "Clientes hibernando", revenue: 14023.62 },
    { name: "Clientes perdidos", revenue: 68501.41 },
    { name: "Clientes promissores", revenue: 2978.13 },
    { name: "Clientes quase dormentes", revenue: 27089.71 },
    { name: "Clientes que não posso perder", revenue: 33823.39 },
    { name: "Clientes que precisam de atenção", revenue: 39105.70 },
    { name: "Fiéis em potencial", revenue: 573053.59 },
    { name: "Novos clientes", revenue: 8409.71 }
];

/* ── Descriptive Analysis — Monthly Orders & Trend ──────────────────────── */
const DESC_MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const DESC_ORDERS_DATA = [381, 300, 696, 668, 735, 717, 710, 706, 1383, 819, 1471, 1408];
// Trend calculated via linear regression over the array: starts around 329, ends around 1336
const DESC_ORDERS_TREND = [329, 421, 512, 604, 696, 787, 879, 970, 1062, 1153, 1245, 1336];

/* ── US State Sales (USD) ────────────────────────────────────────────────── */
const STATE_SALES = {
    CA: 320000, TX: 280000, NY: 195000, FL: 168000, WA: 142000,
    IL: 135000, PA: 121000, OH: 108000, GA: 98000, NC: 89000,
    MI: 82000, NJ: 78000, VA: 71000, AZ: 65000, CO: 62000,
    MA: 58000, TN: 54000, IN: 49000, MO: 44000, WI: 41000,
    MD: 38000, MN: 35000, SC: 32000, AL: 29000, LA: 27000,
    KY: 24000, OR: 22000, OK: 20000, CT: 18000, IA: 16000,
    UT: 15000, NV: 14000, AR: 13000, MS: 12000, KS: 11000,
    NE: 9000, NM: 8500, WV: 7800, ID: 7200, HI: 6800,
    NH: 6400, ME: 6000, MT: 5200, RI: 4800, DE: 4400,
    SD: 3800, ND: 3400, AK: 3200, VT: 2900, WY: 2500,
};

/** FIPS code → US state abbreviation */
const FIPS_TO_ABBREV = {
    '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
    '08': 'CO', '09': 'CT', '10': 'DE', '12': 'FL', '13': 'GA',
    '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA',
    '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD',
    '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO',
    '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ',
    '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
    '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC',
    '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT',
    '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI', '56': 'WY',
};

/* ── Performance — Monthly KPIs 2023 (USD) ───────────────────────────────── */
const PERF_DATA = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    revenue: [220000, 205000, 235000, 252000, 267000, 284000, 299000, 315000, 308000, 331000, 356000, 402000],
    target: [210000, 210000, 225000, 245000, 260000, 275000, 290000, 305000, 300000, 325000, 350000, 395000],
    profit: [52000, 46000, 58000, 63000, 70000, 79000, 85000, 91000, 87000, 97000, 108000, 128000],
};
