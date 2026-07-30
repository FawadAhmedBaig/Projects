let currentDate = new Date();
let savedItems = [];

// ────────────────────────────────────────────────
// Global functions for edit & delete
// ────────────────────────────────────────────────
window.deleteItem = function(id) {
  chrome.storage.local.get({ savedItems: [] }, (data) => {
    const updated = data.savedItems.filter(i => i.id !== id);
    chrome.storage.local.set({ savedItems: updated }, () => {
      location.reload();
    });
  });
};

window.editItem = function(id) {
  chrome.storage.local.get({ savedItems: [] }, (data) => {
    let items = data.savedItems;
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newText = prompt("Edit text:", item.text);
    if (newText === null || newText === undefined) return; // cancel pressed

    item.text = newText.trim();

    chrome.storage.local.set({ savedItems: items }, () => {
      location.reload();
    });
  });
};

// ────────────────────────────────────────────────
// Initialization
// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get({ savedItems: [] });

  // Ensure every item has an id
  savedItems = data.savedItems.map(item => {
    if (!item.id) {
      item.id = Date.now() + Math.random();
    }
    return item;
  });

  // Save back in case we added ids
  if (savedItems.length !== data.savedItems.length ||
      savedItems.some((item, i) => !data.savedItems[i]?.id)) {
    await chrome.storage.local.set({ savedItems });
  }

  renderTop3();
  renderCalendar();

  // Navigation buttons
  document.getElementById('prevMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
});

// ────────────────────────────────────────────────
// Render Top 3
// ────────────────────────────────────────────────
function renderTop3() {
  const container = document.getElementById('top3-list');
  if (!container) return;

  container.innerHTML = '';

  const topItems = savedItems.filter(item => item.isTop3);

  topItems.forEach(item => {
    const li = document.createElement('li');
    // Apply flex styles directly if not using a CSS file
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';
    li.style.padding = '10px 0';
    li.style.borderBottom = '1px solid #f0f0f0';

    // 1. Content (link or plain text)
    let contentEl;
    if (item.url) {
      contentEl = document.createElement('a');
      contentEl.href = item.url;
      contentEl.target = '_blank';
      contentEl.textContent = item.text;
    } else {
      contentEl = document.createElement('span');
      contentEl.textContent = item.text;
    }
    contentEl.style.flex = '1'; // Allows text to take up available space
    li.appendChild(contentEl);

    // 2. Button Group Container
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.alignItems = 'center';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.style.cursor = 'pointer';
    editBtn.style.marginLeft = '10px';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      editItem(item.id);
    };

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.marginLeft = '8px';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${item.text}"?`)) {
        deleteItem(item.id);
      }
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    li.appendChild(btnGroup);

    container.appendChild(li);
  });
}

// ────────────────────────────────────────────────
// Render Calendar
// ────────────────────────────────────────────────
/**
 * Render Calendar
 * Populates the monthly view with color-coded events and tasks.
 */
function renderCalendar() {
  const body = document.getElementById('calendarBody');
  const monthYear = document.getElementById('monthYear');
  if (!body || !monthYear) return;

  body.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  monthYear.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let row = document.createElement('tr');

  // Empty cells before 1st
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('td');

    // Date number label
    const dateLabel = document.createElement('div');
    dateLabel.textContent = day;
    dateLabel.className = 'date-label';
    cell.appendChild(dateLabel);

    // Filter items for this specific day
    savedItems.forEach(item => {
      if (!item.date) return;

      const itemDate = new Date(item.date);
      
      if (
        itemDate.getDate() === day &&
        itemDate.getMonth() === month &&
        itemDate.getFullYear() === year
      ) {
        const div = document.createElement('div');
        
        // Flex Layout: Keeps icons on the same line as text
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        div.style.fontSize = '11px';
        div.style.marginTop = '3px';
        div.style.padding = '3px';
        div.style.borderRadius = '4px';
        div.style.gap = '4px';

        // Color coding based on category
        if (item.category === 'event') {
          div.style.background = '#ffd6d6'; // light red
        } else if (item.category === 'task') {
          div.style.background = '#d0e6ff'; // light blue
        }

        // 1. Text/Link Container
        const textSpan = document.createElement('span');
        textSpan.style.flex = '1';
        textSpan.style.overflow = 'hidden';
        textSpan.style.textOverflow = 'ellipsis';
        textSpan.style.whiteSpace = 'nowrap'; // Truncate long titles with "..."

        if (item.url) {
          textSpan.textContent = item.text;
          textSpan.style.cursor = 'pointer';
          textSpan.style.textDecoration = 'underline';
          textSpan.onclick = () => chrome.tabs.create({ url: item.url });
        } else {
          textSpan.textContent = item.text;
        }
        div.appendChild(textSpan);

        // 2. Icon Group Container
        const iconGroup = document.createElement('span');
        iconGroup.style.display = 'flex';
        iconGroup.style.alignItems = 'center';
        iconGroup.style.flexShrink = '0'; // Ensures icons never drop to next line

        const editBtn = document.createElement('span');
        editBtn.textContent = '✏️';
        editBtn.style.cursor = 'pointer';
        editBtn.onclick = (e) => {
          e.stopPropagation();
          editItem(item.id);
        };

        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '❌';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.marginLeft = '4px';
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm(`Delete "${item.text}"?`)) {
            deleteItem(item.id);
          }
        };

        iconGroup.appendChild(editBtn);
        iconGroup.appendChild(deleteBtn);
        div.appendChild(iconGroup);

        cell.appendChild(div);
      }
    });

    row.appendChild(cell);

    // Row management: 7 days per week
    if ((day + firstDay) % 7 === 0 || day === daysInMonth) {
      body.appendChild(row);
      if (day !== daysInMonth) {
        row = document.createElement('tr');
      }
    }
  }
}