/* ==========================================================================
   SuperStorys Analytics Dashboard
   nav.js — Navigation & Tab Switching
   ========================================================================== */

'use strict';

/**
 * Attach click listeners to all `.nav-item` elements.
 * On click, switches to the corresponding tab and closes the sidebar on mobile.
 */
function initNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            switchTab(item.dataset.tab);
            closeSidebar();
        });
    });
}

/**
 * Activate the target tab panel and update the active nav item.
 * Charts for each tab are lazy-initialised on first visit.
 * @param {string} tabId - The ID of the target `.tab-content` element
 */
function switchTab(tabId) {
    /* Update nav state */
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (activeNav) activeNav.classList.add('active');

    /* Show / hide tab panels */
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    /* Lazy-initialise chart sections */
    if (tabId === 'tab-cohort' && !chartRegistry['cohortLine']) initCohortCharts();
    if (tabId === 'tab-rfm' && !chartRegistry['rfmScatter']) initRFMCharts();
    if (tabId === 'tab-descriptive' && !chartRegistry['descLine']) initDescriptiveCharts();
    if (tabId === 'tab-performance' && !chartRegistry['perfLine']) initPerformanceCharts();
}
