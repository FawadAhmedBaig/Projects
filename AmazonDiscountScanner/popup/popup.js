/**
 * popup.js — UI state management and message passing for Amazon Discount Scanner.
 * Communicates with the background service worker via chrome.runtime.sendMessage.
 */

(function () {
  'use strict';

  // ── DOM References ────────────────────────────────────────────────────────
  const els = {
    scanMode:        document.getElementById('scanMode'),
    toggleCoupon:    document.getElementById('toggle-coupon'),
    toggleCheckout:  document.getElementById('toggle-checkout'),
    toggleSubscribe: document.getElementById('toggle-subscribe'),
    toggleBusiness:  document.getElementById('toggle-business'),
    togglePromo:     document.getElementById('toggle-promo'),
    minDiscount:     document.getElementById('min-discount'),
    maxPages:        document.getElementById('max-pages'),
    delayBase:       document.getElementById('delay-base'),
    btnStart:        document.getElementById('btn-start'),
    btnStop:         document.getElementById('btn-stop'),
    statusDot:       document.getElementById('status-dot'),
    statusText:      document.getElementById('status-text'),
    resultCount:     document.getElementById('result-count'),
    progressBar:     document.getElementById('progress-bar'),
    logBox:          document.getElementById('log-box'),
    btnCsv:          document.getElementById('btn-csv'),
    btnTxt:          document.getElementById('btn-txt'),
    btnXlsx:         document.getElementById('btn-xlsx'),
    btnClear:        document.getElementById('btn-clear'),
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  function log(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    entry.innerHTML = `<span class="time">[${time}]</span> ${escapeHtml(message)}`;
    els.logBox.appendChild(entry);
    els.logBox.scrollTop = els.logBox.scrollHeight;
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function getFilterConfig() {
    return {
      scanMode: els.scanMode.value,
      discountTypes: {
        coupon:    els.toggleCoupon.checked,
        checkout:  els.toggleCheckout.checked,
        subscribe: els.toggleSubscribe.checked,
        business:  els.toggleBusiness.checked,
        promo:     els.togglePromo.checked,
      },
      minDiscountPercent: parseFloat(els.minDiscount.value) || 0,
      maxPages:           parseInt(els.maxPages.value, 10) || 20,
      delayBase:          parseFloat(els.delayBase.value) || 3,
    };
  }

  // ── Persist / Restore config across popup sessions ────────────────────────

  function saveConfig() {
    const config = getFilterConfig();
    chrome.storage.local.set({ popupConfig: config });
  }

  function restoreConfig() {
    chrome.storage.local.get({ popupConfig: null }, (data) => {
      if (chrome.runtime.lastError || !data.popupConfig) return;
      const cfg = data.popupConfig;
      if (cfg.discountTypes) {
        els.toggleCoupon.checked    = cfg.discountTypes.coupon    ?? true;
        els.toggleCheckout.checked  = cfg.discountTypes.checkout  ?? true;
        els.toggleSubscribe.checked = cfg.discountTypes.subscribe ?? true;
        els.toggleBusiness.checked  = cfg.discountTypes.business  ?? true;
        els.togglePromo.checked     = cfg.discountTypes.promo     ?? true;
      }
      if (cfg.minDiscountPercent != null) els.minDiscount.value = cfg.minDiscountPercent;
      if (cfg.maxPages != null)           els.maxPages.value    = cfg.maxPages;
      if (cfg.delayBase != null)          els.delayBase.value   = cfg.delayBase;
      if (cfg.scanMode)                   els.scanMode.value    = cfg.scanMode;
    });
  }

  // Auto-save on any field change
  [
    els.toggleCoupon, els.toggleCheckout, els.toggleSubscribe,
    els.toggleBusiness, els.togglePromo,
  ].forEach((toggle) => {
    if (toggle) toggle.addEventListener('change', saveConfig);
  });
  [els.scanMode, els.minDiscount, els.maxPages, els.delayBase].forEach((input) => {
    if (input) input.addEventListener('input', saveConfig);
  });

  // Restore saved config immediately on popup open
  restoreConfig();

  function setScanning(active) {
    els.btnStart.disabled = active;
    els.btnStop.disabled  = !active;
    els.statusDot.classList.toggle('active', active);
    els.statusText.textContent = active ? 'Scanning…' : 'Idle';
    els.statusText.style.color = ''; // Reset rate-limit color
    if (!active) {
      els.progressBar.style.width = '0%';
    }
  }

  // ── POPUP RE-HYDRATION ON MOUNT ───────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get({ scanResults: [], scanLogs: [], foundCount: 0 }, (data) => {
      // 1. Restore Found counter directly from foundCount
      els.resultCount.textContent = data.foundCount;

      // 2. Re-populate console log box from scanLogs
      if (data.scanLogs && data.scanLogs.length) {
        data.scanLogs.forEach(l => log(l.message, l.type));
      }

      // 3. Re-populate results table dynamically from scanResults
      if (data.scanResults && data.scanResults.length > 0) {
        let tableContainer = document.getElementById('results-table-container');
        if (!tableContainer) {
          tableContainer = document.createElement('div');
          tableContainer.id = 'results-table-container';
          tableContainer.style.marginTop = '10px';
          tableContainer.style.maxHeight = '150px';
          tableContainer.style.overflowY = 'auto';
          tableContainer.style.border = '1px solid var(--border)';
          tableContainer.style.borderRadius = '6px';
          tableContainer.style.background = 'var(--surface2)';
          
          const table = document.createElement('table');
          table.style.width = '100%';
          table.style.borderCollapse = 'collapse';
          table.style.fontSize = '11px';
          table.innerHTML = `
          <thead style="position: sticky; top: 0; background: var(--surface2); z-index: 1;">
            <tr style="border-bottom: 1px solid var(--border); text-align: left; color: var(--text-dim);">
              <th style="padding: 6px;">ASIN</th>
              <th style="padding: 6px;">Title</th>
              <th style="padding: 6px;">Type</th>
              <th style="padding: 6px;">Discount %</th>
              <th style="padding: 6px;">Discount Value</th>
            </tr>
          </thead>
          <tbody id="results-tbody"></tbody>
        `;
        tableContainer.appendChild(table);
        els.logBox.parentNode.insertBefore(tableContainer, els.logBox.nextSibling);
      }

      const tbody = document.getElementById('results-tbody');
      tbody.innerHTML = '';
      data.scanResults.forEach(product => {
        // Prevent duplicates on re-hydration
        if (document.querySelector(`tr[data-asin="${product.asin}"]`)) return;

        const tr = document.createElement('tr');
        tr.setAttribute('data-asin', product.asin);
        tr.style.borderBottom = '1px solid var(--border)';
        
        const tType = product.usDiscountType || product.discountType || 'N/A';
        const tPct = product.usDiscountPercent || product.discountPercent || 'N/A';
        const tVal = product.usDiscountValue || product.discountValue || 'N/A';
        const tTitle = product.mxTitle || product.title || 'N/A';
        
        tr.innerHTML = `
          <td style="padding: 6px;">${escapeHtml(product.asin || '')}</td>
          <td style="padding: 6px;" title="${escapeHtml(tTitle)}">${escapeHtml(tTitle.length > 35 ? tTitle.substring(0, 35) + '...' : tTitle)}</td>
          <td style="padding: 6px; color: var(--green);">${escapeHtml(tType)}</td>
          <td style="padding: 6px;">${escapeHtml(tPct)}</td>
          <td style="padding: 6px; font-weight: bold;">${escapeHtml(tVal)}</td>
        `;
          tbody.appendChild(tr);
        });
        tableContainer.scrollTop = tableContainer.scrollHeight;
      }
    });

    // Also get state (scanning status, etc.) from background
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (state) => {
      if (chrome.runtime.lastError || !state) return;
      setScanning(state.scanning);
      if (state.scanning) {
        els.statusText.textContent = `Scanning page ${state.currentPage}…`;
        const pct = state.maxPages > 0 ? Math.round((state.currentPage / state.maxPages) * 100) : 0;
        els.progressBar.style.width = `${pct}%`;
      }
    });
  });

  // ── Listen for runtime messages (status updates from background) ──────────
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SCAN_LOG') {
      log(msg.message, msg.logType || 'info');
    }
    if (msg.type === 'SCAN_PROGRESS') {
      // We do not directly update resultCount here for item matches since the storage handler does it better
      els.statusText.textContent = `Scanning page ${msg.currentPage}…`;
      const pct = msg.maxPages > 0 ? Math.round((msg.currentPage / msg.maxPages) * 100) : 0;
      els.progressBar.style.width = `${pct}%`;
    }
    if (msg.type === 'SCAN_COMPLETE') {
      setScanning(false);
      els.statusText.textContent = 'Scan complete';
      els.progressBar.style.width = '100%';
      log(`Scan finished. ${msg.resultCount} unique products collected.`, 'success');
    }
    if (msg.type === 'SCAN_STOPPED') {
      setScanning(false);
      if (msg.rateLimited) {
        els.statusText.textContent = 'Rate Limited';
        els.statusText.style.color = 'var(--orange)';
        log('⚠️ Amazon rate-limit or block detected. Scan paused to avoid further issues.', 'error');
        log('Wait a few minutes, increase the delay setting, and try again.', 'warn');
      } else {
        els.statusText.textContent = 'Stopped';
        els.statusText.style.color = '';
        log('Scan stopped by user.', 'warn');
      }
    }
    if (msg.type === 'SCAN_ERROR') {
      setScanning(false);
      log(`Error: ${msg.message}`, 'error');
    }
    if (msg.type === 'UPDATE_FOUND_COUNT' || msg.action === 'UPDATE_FOUND_COUNT') {
      // Instantly update 'Found: X' text element in the DOM
      els.resultCount.textContent = msg.count;
      
      if (!msg.newProduct) return;
      const product = msg.newProduct;

      // PREVENT REAL-TIME DOM DUPLICATION
      if (document.querySelector(`tr[data-asin="${product.asin}"]`)) {
        return; // Skip duplicate DOM insertion
      }
      
      // Dynamically create a results table if it doesn't exist
      let tableContainer = document.getElementById('results-table-container');
      if (!tableContainer) {
        tableContainer = document.createElement('div');
        tableContainer.id = 'results-table-container';
        tableContainer.style.marginTop = '10px';
        tableContainer.style.maxHeight = '150px';
        tableContainer.style.overflowY = 'auto';
        tableContainer.style.border = '1px solid var(--border)';
        tableContainer.style.borderRadius = '6px';
        tableContainer.style.background = 'var(--surface2)';
        
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '11px';
        table.innerHTML = `
          <thead style="position: sticky; top: 0; background: var(--surface2); z-index: 1;">
            <tr style="border-bottom: 1px solid var(--border); text-align: left; color: var(--text-dim);">
              <th style="padding: 6px;">ASIN</th>
              <th style="padding: 6px;">Title</th>
              <th style="padding: 6px;">Type</th>
              <th style="padding: 6px;">Discount %</th>
              <th style="padding: 6px;">Discount Value</th>
            </tr>
          </thead>
          <tbody id="results-tbody"></tbody>
        `;
        tableContainer.appendChild(table);
        // Insert after log-box
        els.logBox.parentNode.insertBefore(tableContainer, els.logBox.nextSibling);
      }
      
      const tbody = document.getElementById('results-tbody');
      const tr = document.createElement('tr');
      tr.setAttribute('data-asin', product.asin);
      tr.style.borderBottom = '1px solid var(--border)';
      
      const tType = product.usDiscountType || product.discountType || 'N/A';
      const tPct = product.usDiscountPercent || product.discountPercent || 'N/A';
      const tVal = product.usDiscountValue || product.discountValue || 'N/A';
      const tTitle = product.mxTitle || product.title || 'N/A';
      
      tr.innerHTML = `
        <td style="padding: 6px;">${escapeHtml(product.asin || '')}</td>
        <td style="padding: 6px;" title="${escapeHtml(tTitle)}">${escapeHtml(tTitle.length > 35 ? tTitle.substring(0, 35) + '...' : tTitle)}</td>
        <td style="padding: 6px; color: var(--green);">${escapeHtml(tType)}</td>
        <td style="padding: 6px;">${escapeHtml(tPct)}</td>
        <td style="padding: 6px; font-weight: bold;">${escapeHtml(tVal)}</td>
      `;
      tbody.appendChild(tr);
      tableContainer.scrollTop = tableContainer.scrollHeight;
    }
  });

  // ── Start Scan ────────────────────────────────────────────────────────────
  els.btnStart.addEventListener('click', () => {
    const config = getFilterConfig();
    // Quick validation
    if (config.minDiscountPercent < 0 || config.minDiscountPercent > 100) {
      log('Minimum discount must be 0-100%.', 'error');
      return;
    }
    setScanning(true);
    els.logBox.innerHTML = '';
    
    // Check if table exists, if so clear the tbody
    const tbody = document.getElementById('results-tbody');
    if (tbody) tbody.innerHTML = '';
    
    els.resultCount.textContent = '0';
    saveConfig(); // persist current fields before scan starts
    log('Starting scan with filters…', 'info');
    chrome.runtime.sendMessage({ type: 'START_SCAN', config });
  });

  // ── Stop Scan ─────────────────────────────────────────────────────────────
  els.btnStop.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'STOP_SCAN' });
    log('Stop requested…', 'warn');
  });

  // ── Export Helpers ──────────────────────────────────────────────────────

  /**
   * Sanitize a value for CSV: strip newlines/carriage-returns, collapse
   * extra whitespace, escape internal double-quotes by doubling them,
   * and wrap the entire value in double quotes.
   */
  function csvEscape(value) {
    if (value == null) return '""';
    const str = String(value)
      .replace(/\r\n|\r|\n/g, ' ')   // strip line breaks
      .replace(/\s+/g, ' ')           // collapse whitespace
      .trim()
      .replace(/"/g, '""');           // escape double-quotes
    return `"${str}"`;
  }

  function fetchResults(callback) {
    chrome.storage.local.get({ scanResults: [] }, (data) => {
      if (!data.scanResults || !data.scanResults.length) {
        log('No results to export.', 'warn');
        return;
      }
      callback(data.scanResults);
    });
  }

  // CSV — bulletproof: every field is quoted, commas in prices/titles can't break columns
  els.btnCsv.addEventListener('click', () => {
    fetchResults((results) => {
      const config = getFilterConfig();
      const isMxMode = config.scanMode === 'mx_direct';
      
      const headerStandard = '"ASIN","Title","Base Price","Discount Type","Discount %","Discount Value","Final Price After Discount","Product URL"';
      const headerMX = '"ASIN","MX Title","MX Price (MXN)","US Base Price (USD)","US Discount Type","US Discount %","US Discount Value","US Final Price","US Product URL","MX Product URL"';
      
      const header = isMxMode ? headerMX : headerStandard;

      const rows = results.map((r) => {
        if (isMxMode) {
          const usFinalStr = r.usFinalPrice > 0 ? `$${r.usFinalPrice.toFixed(2)}` : 'N/A';
          return [
            csvEscape(r.asin),
            csvEscape(r.mxTitle || r.title),
            csvEscape(r.mxPrice || r.price),
            csvEscape(r.usBasePrice > 0 ? `$${r.usBasePrice.toFixed(2)}` : 'N/A'),
            csvEscape(r.usDiscountType),
            csvEscape(r.usDiscountPercent || 'N/A'),
            csvEscape(r.usDiscountValue),
            csvEscape(usFinalStr),
            csvEscape(r.usProductUrl),
            csvEscape(r.mxProductUrl || r.productUrl)
          ].join(',');
        } else {
          const finalStr = r.finalPrice > 0 ? `${r.currency || '$'}${r.finalPrice.toFixed(2)}` : 'N/A';
          return [
            csvEscape(r.asin),
            csvEscape(r.title),
            csvEscape(r.basePrice || r.price),
            csvEscape(r.discountType),
            csvEscape(r.discountPercent),
            csvEscape(r.discountValue),
            csvEscape(finalStr),
            csvEscape(r.productUrl),
          ].join(',');
        }
      });
      const csv = header + '\n' + rows.join('\n');
      downloadFile(csv, 'amazon_discounts.csv', 'text/csv');
      log(`Exported ${results.length} items to CSV.`, 'success');
    });
  });

  // TXT (ASINs only)
  els.btnTxt.addEventListener('click', () => {
    fetchResults((results) => {
      const txt = results.map((r) => r.asin).join('\n');
      downloadFile(txt, 'amazon_asins.txt', 'text/plain');
      log(`Exported ${results.length} ASINs to TXT.`, 'success');
    });
  });

  // Excel via SheetJS
  els.btnXlsx.addEventListener('click', () => {
    fetchResults((results) => {
      if (typeof XLSX === 'undefined') {
        log('SheetJS library not loaded. Place xlsx.full.min.js in lib/ folder.', 'error');
        return;
      }
      
      const config = getFilterConfig();
      const isMxMode = config.scanMode === 'mx_direct';

      const headerStandard = ['ASIN', 'Title', 'Base Price', 'Discount Type', 'Discount %', 'Discount Value', 'Final Price After Discount', 'Product URL'];
      const headerMX = ['ASIN', 'MX Title', 'MX Price (MXN)', 'US Base Price (USD)', 'US Discount Type', 'US Discount %', 'US Discount Value', 'US Final Price', 'US Product URL', 'MX Product URL'];

      const wsData = [
        isMxMode ? headerMX : headerStandard,
        ...results.map((r) => {
          if (isMxMode) {
            const usFinalStr = r.usFinalPrice > 0 ? `$${r.usFinalPrice.toFixed(2)}` : 'N/A';
            return [
              r.asin,
              r.mxTitle || r.title,
              r.mxPrice || r.price,
              r.usBasePrice > 0 ? `$${r.usBasePrice.toFixed(2)}` : 'N/A',
              r.usDiscountType,
              r.usDiscountPercent || 'N/A',
              r.usDiscountValue,
              usFinalStr,
              r.usProductUrl,
              r.mxProductUrl || r.productUrl,
            ];
          } else {
            const finalStr = r.finalPrice > 0 ? `${r.currency || '$'}${r.finalPrice.toFixed(2)}` : 'N/A';
            return [
              r.asin,
              r.title,
              r.basePrice || r.price,
              r.discountType,
              r.discountPercent,
              r.discountValue,
              finalStr,
              r.productUrl,
            ];
          }
        }),
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      // Auto-width columns
      ws['!cols'] = wsData[0].map((_, i) => ({
        wch: Math.max(...wsData.map((row) => String(row[i] || '').length), 12),
      }));
      XLSX.utils.book_append_sheet(wb, ws, 'Discounts');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({ url, filename: 'amazon_discounts.xlsx', saveAs: true });
      log(`Exported ${results.length} items to Excel.`, 'success');
    });
  });

  // Clear
  els.btnClear.addEventListener('click', () => {
    if (!confirm('Clear all collected results?')) return;
    chrome.storage.local.set({ scanResults: [], scanLogs: [], foundCount: 0 }, () => {
      els.resultCount.textContent = '0';
      els.logBox.innerHTML = '';
      const tbody = document.getElementById('results-tbody');
      if (tbody) tbody.innerHTML = '';
      log('All results cleared.', 'warn');
    });
    chrome.runtime.sendMessage({ type: 'CLEAR_RESULTS' });
  });

  // ── Download utility ──────────────────────────────────────────────────────
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({ url, filename, saveAs: true });
  }
})();
