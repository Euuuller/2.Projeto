/* ==========================================================================
   SuperStorys Analytics Dashboard
   charts/regional.js — Regional Analysis Charts
   (US State choropleth map D3 + TopoJSON)
   ========================================================================== */

'use strict';

/**
 * Initialise Regional Analysis.
 * Flags the chart registry to prevent reloading.
 */
function initRegionalCharts() {
    chartRegistry['regionalMap'] = true;
    initUSMap();
}

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
