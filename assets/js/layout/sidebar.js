/* ==========================================================================
   SuperStorys Analytics Dashboard
   sidebar.js — Mobile Sidebar Drawer (Hamburger Menu)
   ========================================================================== */

'use strict';

/**
 * Attach hamburger, overlay, and close-button listeners for the mobile sidebar.
 */
function initSidebarMobile() {
    const ham = document.getElementById('hamburger');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarClose');

    ham.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);
    closeBtn.addEventListener('click', closeSidebar);
}

/** Slide the sidebar into view and show the backdrop overlay. */
function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.remove('hidden');
}

/** Slide the sidebar out and hide the backdrop overlay. */
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.add('hidden');
}
