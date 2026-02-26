/* ==========================================================================
   SuperStorys Analytics Dashboard
   config.js — Chart.js Global Defaults & Chart Registry
   ========================================================================== */

'use strict';

/* ── Color palette ───────────────────────────────────────────────────────── */
const COLORS = {
  indigo:  '#6366F1',
  teal:    '#14B8A6',
  rose:    '#F43F5E',
  amber:   '#F59E0B',
  purple:  '#A855F7',
  emerald: '#10B981',
  orange:  '#F97316',
  sky:     '#0EA5E9',
  navy:    '#1E3A5F',
};

/* ── Chart.js global defaults ────────────────────────────────────────────── */
Chart.defaults.font.family                             = "'DM Sans', sans-serif";
Chart.defaults.font.size                               = 12;
Chart.defaults.color                                   = '#64748B';
Chart.defaults.plugins.legend.labels.usePointStyle     = true;
Chart.defaults.plugins.legend.labels.padding           = 18;
Chart.defaults.plugins.tooltip.backgroundColor         = '#0F172A';
Chart.defaults.plugins.tooltip.borderColor             = 'rgba(255,255,255,0.1)';
Chart.defaults.plugins.tooltip.borderWidth             = 1;
Chart.defaults.plugins.tooltip.titleFont               = { family: "'DM Sans', sans-serif", weight: '600', size: 13 };
Chart.defaults.plugins.tooltip.bodyFont                = { family: "'DM Sans', sans-serif", size: 12 };
Chart.defaults.plugins.tooltip.padding                 = 12;
Chart.defaults.plugins.tooltip.cornerRadius            = 10;

/* ── Chart registry (prevents orphan canvas instances) ───────────────────── */
const chartRegistry = {};

/**
 * Register a Chart.js instance by key.
 * Destroys any existing instance with the same key before registering.
 * @param {string} id - Unique key for this chart
 * @param {Chart}  instance - Chart.js instance
 */
function registerChart(id, instance) {
  if (chartRegistry[id]) {
    chartRegistry[id].destroy();
  }
  chartRegistry[id] = instance;
}
