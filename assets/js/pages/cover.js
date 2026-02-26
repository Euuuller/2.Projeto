/* ==========================================================================
   SuperStorys Analytics Dashboard
   cover.js — Landing Page Logic & Business Date
   ========================================================================== */

'use strict';

/**
 * Bind the "Entrar no Dashboard" button.
 * Fades out the cover overlay, reveals the dashboard app, then initialises
 * the default tab's charts.
 */
function initCover() {
    const btn = document.getElementById('btnEnter');
    const cover = document.getElementById('cover');
    const app = document.getElementById('app');

    btn.addEventListener('click', () => {
        cover.classList.add('fade-out');
        setTimeout(() => {
            cover.style.display = 'none';
            app.classList.remove('hidden');
            /* Initialise the default (first) tab */
            initBusinessDate();
            initCohortCharts();
        }, 600);
    });
}

/**
 * Populate the `#currentDate` element in the Business tab header
 * with the current date formatted in Brazilian Portuguese.
 */
function initBusinessDate() {
    const el = document.getElementById('currentDate');
    if (el) {
        el.textContent = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }
}
