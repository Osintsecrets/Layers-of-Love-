const ELEMENT_CATEGORIES = {
  "Core text & typography": [
    "paragraph","h1","h2","h3","h4","h5","h6","small","span","em","strong","code","kbd","samp","pre","blockquote","q","abbr","time","mark","sup","sub","hr"
  ],
  "Links & basic interactivity": [
    "hyperlink","anchor target","download link","telephone link","mailto link"
  ],
  "Media": [
    "image","responsive picture","audio","video","embedded content","inline svg","canvas","figure","figcaption"
  ],
  "Semantics & document structure": [
    "div","section","article","header","footer","nav","main","aside","address","details","summary","dialog","template","slot","custom element"
  ],
  "Forms — inputs & controls": [
    "form","label","fieldset","legend","input text","input password","input email","input search","input tel","input url","input number","input color","input date","input time","input datetime-local","input month","input week","input range","input checkbox","input radio","input file","input hidden","input image","textarea","select","option","optgroup","datalist","output","progress","meter","button","validation message","helper text","counter"
  ],
  "Buttons & clickable components": [
    "primary button","secondary button","tertiary button","icon button","segmented buttons","toggle button","split button","floating action button","button group","toolbar"
  ],
  "Pickers & selection": [
    "dropdown","listbox","combobox","multiselect","date picker","time picker","datetime picker","color picker","file picker","rating stars","chip selector"
  ],
  "Toggles & disclosure": [
    "switch","checkbox list","radio group","accordion","details expander"
  ],
  "Navigation": [
    "site header","navbar","sidebar","breadcrumb","tabs","pagination","stepper","anchor link list","skip link"
  ],
  "Menus": [
    "menu","menubar","context menu","kebab menu","dropdown menu","command palette"
  ],
  "Overlays": [
    "modal dialog","side sheet","popover","tooltip","hovercard","lightbox"
  ],
  "Feedback & status": [
    "toast","banner","callout","inline validation error","loading spinner","skeleton loader","progress bar","empty state","status badge"
  ],
  "Badges, tags, metadata": [
    "badge","chip","label","status dot","avatar","presence indicator"
  ],
  "Search": [
    "search field","search autocomplete","search filters","filter chips","saved searches"
  ],
  "Data display": [
    "table","data grid","definition list","list","caption","key-value list","statistic tile","KPI card","timeline","tree view","tree grid","collapsible list","carousel","card","media object","gallery","badge list","map pin list"
  ],
  "Layout & containers": [
    "container","grid","flex row","flex column","responsive columns","stack","cluster","wrap","divider","spacer","sheet","panel","sticky header","sticky footer","scroll area","splitter"
  ],
  "Charts & visualization": [
    "line chart","area chart","bar chart","pie chart","scatter plot","histogram","heatmap","radar chart","gauge","sparkline","map","tree map","network graph","timeline chart"
  ],
  "Commerce & transactional": [
    "price display","quantity stepper","add-to-cart","cart drawer","checkout form","payment selector","order summary","receipt"
  ],
  "Social & communication": [
    "share buttons","reactions","comments thread","mention autocomplete","message bubble","typing indicator","notification bell"
  ],
  "File & upload": [
    "file input","drag-and-drop zone","upload queue","file preview","image cropper"
  ],
  "Maps & geospatial": [
    "map canvas","marker","geocoder search","layer toggle","scale/legend","minimap"
  ],
  "Editors & content creation": [
    "rich text editor","markdown editor","code editor","diff viewer","annotation","emoji picker"
  ],
  "Authentication & identity": [
    "sign in form","sign up form","federated login buttons","2FA input","password strength meter","user menu","profile card"
  ],
  "Internationalization & locale": [
    "language switcher","currency selector","timezone picker"
  ],
  "Accessibility landmarks & aids": [
    "banner landmark","navigation landmark","main landmark","complementary landmark","contentinfo landmark","aria-live region","focus outline","skip links","high-contrast toggle","font-size control"
  ],
  "HTML/ARIA widget roles": [
    "role alert","role alertdialog","role button","role checkbox","role combobox","role dialog","role grid","role gridcell","role link","role listbox","role option","role menu","role menubar","role menuitem","role progressbar","role radio","role radiogroup","role scrollbar","role slider","role spinbutton","role switch","role tab","role tablist","role tabpanel","role textbox","role timer","role tooltip","role tree","role treeitem","role treegrid"
  ],
  "Misc utility patterns": [
    "breadcrumbs skeleton","back-to-top button","cookie consent banner","print view","offline indicator","command shortcut hints"
  ]
};

const palette = document.getElementById('palette');
const canvas = document.getElementById('canvas');

for (const [category, items] of Object.entries(ELEMENT_CATEGORIES)) {
  const group = document.createElement('div');
  group.className = 'category';
  const heading = document.createElement('h3');
  heading.textContent = category;
  group.appendChild(heading);
  items.forEach(name => {
    const item = document.createElement('div');
    item.className = 'palette-item';
    item.draggable = true;
    item.textContent = name;
    item.dataset.name = name;
    group.appendChild(item);
  });
  palette.appendChild(group);
}

palette.addEventListener('dragstart', e => {
  if (e.target.classList.contains('palette-item')) {
    e.dataTransfer.setData('text/plain', e.target.dataset.name);
  }
});

canvas.addEventListener('dragover', e => e.preventDefault());

canvas.addEventListener('drop', e => {
  e.preventDefault();
  const name = e.dataTransfer.getData('text/plain');
  if (!name) return;
  const el = document.createElement('div');
  el.className = 'element';
  el.textContent = name;
  el.style.left = e.offsetX + 'px';
  el.style.top = e.offsetY + 'px';
  canvas.appendChild(el);
  interact(el).draggable({listeners:{move: dragMove}});
});

function dragMove (event) {
  const target = event.target;
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  target.style.transform = `translate(${x}px, ${y}px)`;
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

document.getElementById('export-html').addEventListener('click', () => {
  document.getElementById('output').value = canvas.innerHTML;
});

document.getElementById('export-img').addEventListener('click', () => {
  html2canvas(canvas).then(c => {
    const a = document.createElement('a');
    a.download = 'design.png';
    a.href = c.toDataURL();
    a.click();
  });
});
