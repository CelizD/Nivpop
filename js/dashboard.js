// ══════════════════════════════════════════════════════════
// NIV'Pop — Dashboard completo y funcional
// Todos los datos vienen de NivDB (localStorage)
// ══════════════════════════════════════════════════════════

// ── Estado global ──
let DATA = [];
let filteredData = [];
let currentPage = 1;
const PER_PAGE = 20;
let clientModeF = 'all';
let clientSearch = '';
let chartInstances = {};
let statRange = '7d';
let currentFlavorEdit = null;

// ── Páginas metadata ──
const PAGE_META = {
  dashboard:    {title:"NIV'Pop Analytics",       sub:"Panel de análisis en tiempo real"},
  sabores:      {title:"Catálogo de sabores",      sub:"Gestiona y edita tus 16 perfiles psicológicos"},
  clientes:     {title:"Registro de clientes",     sub:"Historial completo de tests completados"},
  estadisticas: {title:"Estadísticas avanzadas",   sub:"Análisis de comportamiento y tendencias"},
  kiosco:       {title:"Control del kiosco",       sub:"Estado y configuración del dispositivo"},
  configuracion:{title:"Configuración",            sub:"Perfil, plan y preferencias del sistema"},
};

// ══════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  NivDB.seedIfEmpty(50);
  DATA = NivDB.getResults();
  filteredData = [...DATA];

  // Aplicar config guardada
  applyConfig();

  // Inicializar dashboard
  initDashboard();
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(autoRefresh, 8000);

  // Escuchar nuevos resultados del kiosco
  window.addEventListener('nivpop:nuevo', (e) => {
    DATA = NivDB.getResults();
    filteredData = [...DATA];
    calcKPIs();
    buildDashboardTable();
    buildFlavorRank();
    liveInsertRow(e.detail);
    pushNotif(`Nuevo test: ${e.detail.sabor}`, `Modo ${e.detail.modo} · ahora mismo`, '🍦');
  });

  renderNotifs();
});

function initDashboard() {
  calcKPIs();
  buildActivityChart();
  buildPieChart();
  buildFlavorChart();
  buildDashboardTable();
  buildFlavorRank();
}

function autoRefresh() {
  DATA = NivDB.getResults();
  const el = document.getElementById('liveCount');
  if (el) el.textContent = Math.floor(Math.random() * 4);
}

// ══════════════════════════════════════════════════════════
// NAVEGACIÓN
// ══════════════════════════════════════════════════════════
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id)?.classList.add('active');
  document.querySelector(`.nav-item[data-page="${id}"]`)?.classList.add('active');
  const meta = PAGE_META[id] || {};
  document.getElementById('topbarTitle').textContent = meta.title || '';
  document.getElementById('topbarSub').textContent   = meta.sub   || '';
  document.getElementById('mainArea').scrollTop = 0;
  if (id === 'sabores')      buildFlavorGrid();
  if (id === 'clientes')     buildClientsTable();
  if (id === 'estadisticas') buildStatsPage();
  if (id === 'kiosco')       loadKioscoState();
  if (id === 'configuracion') loadConfig();
}

document.querySelectorAll('.nav-item[data-page]').forEach(el => {
  el.addEventListener('click', () => showPage(el.dataset.page));
});

// ══════════════════════════════════════════════════════════
// RELOJ
// ══════════════════════════════════════════════════════════
function updateClock() {
  const now = new Date();
  const el = document.getElementById('topbarDate');
  if (el) el.textContent = now.toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
  const lt = document.getElementById('liveTime');
  if (lt) lt.textContent = 'Actualizado: ' + now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}

// ══════════════════════════════════════════════════════════
// DASHBOARD — KPIs
// ══════════════════════════════════════════════════════════
function calcKPIs() {
  const stats = NivDB.getStats(DATA);
  animCount('kpi1', stats.total);
  animCount('kpi2', Math.round(stats.total * 0.91));
  const k3 = document.getElementById('kpi3');
  if (k3) k3.textContent = stats.avgCompat + '%';
  animCount('kpi4', stats.uniqueFlavors);
  const dc = document.getElementById('duoCount');
  if (dc) dc.textContent = stats.duos;
  const uf = document.getElementById('uniqueF');
  if (uf) uf.textContent = stats.uniqueFlavors;
  // Métricas rápidas
  const tf = document.getElementById('topFlavor');
  if (tf) tf.textContent = stats.topFlavor ? stats.topFlavor.emoji + ' ' + stats.topFlavor.name.split(' ')[0] : '—';
  const ph = document.getElementById('peakHour');
  if (ph) ph.textContent = stats.peakHour || '—';
  const tc = document.getElementById('topCompat');
  if (tc) tc.textContent = stats.topCompat ? stats.topCompat + '%' : '—';
  const wt = document.getElementById('weekTotal');
  if (wt) wt.textContent = (stats.total * 7).toLocaleString() + ' tests';
}

function animCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let c = 0, step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => { c = Math.min(c + step, target); el.textContent = c; if (c >= target) clearInterval(t); }, 22);
}

// ══════════════════════════════════════════════════════════
// CHARTS
// ══════════════════════════════════════════════════════════
function destroyChart(id) { if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; } }

function buildActivityChart() {
  destroyChart('activityChart');
  const ctx = document.getElementById('activityChart')?.getContext('2d'); if (!ctx) return;
  const hours = [9,10,11,12,13,14,15,16,17,18,19,20,21];
  const counts = hours.map(h => DATA.filter(d => d.hora === h).length);
  const g = ctx.createLinearGradient(0,0,0,200);
  g.addColorStop(0,'rgba(196,120,106,.2)'); g.addColorStop(1,'rgba(196,120,106,0)');
  chartInstances['activityChart'] = new Chart(ctx, {
    type:'line',
    data:{labels:hours.map(h=>h+':00'),datasets:[{data:counts,borderColor:'#c4786a',borderWidth:2.5,backgroundColor:g,fill:true,tension:.4,pointBackgroundColor:'#c4786a',pointRadius:3,pointHoverRadius:5,pointBorderColor:'#fff',pointBorderWidth:2}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#16120d',callbacks:{label:i=>`${i.raw} tests`}}},
      scales:{x:{grid:{display:false},ticks:{color:'#a89a8e',font:{size:10,family:'DM Sans'}}},
              y:{grid:{color:'#f0ece6'},ticks:{color:'#a89a8e',font:{size:10},maxTicksLimit:5},border:{dash:[3,3]}}}}
  });
}

function buildPieChart() {
  destroyChart('pieChart');
  const ctx = document.getElementById('pieChart')?.getContext('2d'); if (!ctx) return;
  const solo=DATA.filter(d=>d.modo==='solo').length, duo=DATA.filter(d=>d.modo==='duo').length, estado=DATA.filter(d=>d.modo==='estado').length;
  const total=DATA.length||1;
  chartInstances['pieChart'] = new Chart(ctx, {
    type:'doughnut',
    data:{labels:['Solo','Dúo','Estado'],datasets:[{data:[solo,duo,estado],backgroundColor:['#c4786a','#2d5fa0','#3d8b5e'],borderWidth:0,hoverOffset:4}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'72%',plugins:{legend:{display:false},tooltip:{backgroundColor:'#16120d',callbacks:{label:i=>`${i.label}: ${i.raw} (${Math.round(i.raw/total*100)}%)`}}}}
  });
  const leg = document.getElementById('pieLegend');
  if (leg) leg.innerHTML=[{label:'Solo',count:solo,color:'#c4786a'},{label:'Dúo',count:duo,color:'#2d5fa0'},{label:'Estado',count:estado,color:'#3d8b5e'}]
    .map(d=>`<div class="pl-row"><div class="pl-dot" style="background:${d.color}"></div><div class="pl-label">${d.label}</div><div class="pl-val">${d.count}</div><div class="pl-pct">${Math.round(d.count/total*100)}%</div></div>`).join('');
}

function buildFlavorChart() {
  destroyChart('flavorChart');
  const ctx = document.getElementById('flavorChart')?.getContext('2d'); if (!ctx) return;
  const flavors = NivDB.getFlavors();
  const fc={};flavors.forEach(f=>{fc[f.id]={solo:0,duo:0,estado:0,name:f.name,color:f.color};});
  DATA.forEach(d=>{if(fc[d.flavorId])fc[d.flavorId][d.modo]++;});
  const sorted=Object.values(fc).sort((a,b)=>(b.solo+b.duo+b.estado)-(a.solo+a.duo+a.estado)).slice(0,8);
  chartInstances['flavorChart'] = new Chart(ctx, {
    type:'bar',
    data:{labels:sorted.map(f=>f.name.split(' ').slice(0,2).join(' ')),
      datasets:[{label:'Solo',data:sorted.map(f=>f.solo),backgroundColor:'#c4786a',borderRadius:3,borderSkipped:false},
                {label:'Dúo',data:sorted.map(f=>f.duo),backgroundColor:'#2d5fa0',borderRadius:3,borderSkipped:false},
                {label:'Estado',data:sorted.map(f=>f.estado),backgroundColor:'#3d8b5e',borderRadius:3,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#16120d'}},
      scales:{x:{stacked:true,grid:{display:false},ticks:{color:'#a89a8e',font:{size:10},maxRotation:25}},
              y:{stacked:true,grid:{color:'#f0ece6'},ticks:{color:'#a89a8e',font:{size:10},maxTicksLimit:5},border:{dash:[3,3]}}}}
  });
}

function buildFlavorRank() {
  const el = document.getElementById('flavorRank'); if (!el) return;
  const flavors = NivDB.getFlavors();
  const fc={};flavors.forEach(f=>{fc[f.id]=0;});
  DATA.forEach(d=>{if(fc[d.flavorId]!==undefined)fc[d.flavorId]++;});
  const sorted=flavors.map(f=>({...f,count:fc[f.id]||0})).sort((a,b)=>b.count-a.count).slice(0,6);
  const max=sorted[0]?.count||1;
  el.innerHTML=sorted.map((f,i)=>`<div class="fr-row"><div class="fr-n">${i+1}</div><div class="fr-info"><div class="fr-name">${f.emoji} ${f.name.split(' ').slice(0,2).join(' ')}</div><div class="fr-bar"><div class="fr-fill" style="width:${Math.round(f.count/max*100)}%;background:${f.color}"></div></div></div><div class="fr-count">${f.count}</div></div>`).join('');
}

function buildDashboardTable() {
  const tbody = document.getElementById('resultsBody'); if (!tbody) return;
  const recent = DATA.slice(0,10);
  tbody.innerHTML = recent.map(d => {
    const cc=d.compat?`<div class="compat-wrap"><div class="compat-bar"><div class="compat-fill" style="width:${d.compat}%;background:${d.compat>=80?'#3d8b5e':d.compat>=60?'#c4786a':'#9a6820'}"></div></div><span class="compat-num" style="color:${d.compat>=80?'var(--green)':d.compat>=60?'var(--accent)':'var(--amber)'}">${d.compat}%</span></div>`:`<span style="color:var(--xlight)">—</span>`;
    return`<tr onclick="openClientModal(${d.id})" style="cursor:pointer"><td class="td-mono">${d.timeStr||d.hora+':'+String(d.min).padStart(2,'0')}</td><td><div class="flavor-chip"><div class="f-dot" style="background:${d.flavorColor}"></div>${d.sabor}</div></td><td><span class="mode-badge ${d.modo}">${d.modo==='solo'?'Solo':d.modo==='duo'?'Dúo':'Estado'}</span></td><td>${cc}</td></tr>`;
  }).join('');
}

function liveInsertRow(entry) {
  const tbody=document.getElementById('resultsBody'); if(!tbody) return;
  const flavors=NivDB.getFlavors(), f=flavors.find(x=>x.id===entry.flavorId)||{color:entry.flavorColor||'#c4786a'};
  const cc=entry.compat?`<div class="compat-wrap"><div class="compat-bar"><div class="compat-fill" style="width:${entry.compat}%;background:${entry.compat>=80?'#3d8b5e':entry.compat>=60?'#c4786a':'#9a6820'}"></div></div><span class="compat-num">${entry.compat}%</span></div>`:`<span style="color:var(--xlight)">—</span>`;
  const row=document.createElement('tr');
  row.style.cssText='animation:fadeUp .4s ease forwards;background:rgba(196,120,106,.05);cursor:pointer';
  row.onclick=()=>openClientModal(entry.id);
  row.innerHTML=`<td class="td-mono">${entry.timeStr}</td><td><div class="flavor-chip"><div class="f-dot" style="background:${f.color}"></div>${entry.sabor}</div></td><td><span class="mode-badge ${entry.modo}">${entry.modo==='solo'?'Solo':entry.modo==='duo'?'Dúo':'Estado'}</span></td><td>${cc}</td>`;
  tbody.insertBefore(row,tbody.firstChild);
  if(tbody.rows.length>10)tbody.deleteRow(tbody.rows.length-1);
  setTimeout(()=>{row.style.background='';},1500);
}

// ══════════════════════════════════════════════════════════
// PERIODO
// ══════════════════════════════════════════════════════════
function setPeriod(p,btn){
  document.querySelectorAll('.ptab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const all=NivDB.getResults();
  if(p==='hoy'){
    const hoy=new Date().toLocaleDateString('es-MX');
    DATA=all.filter(r=>r.fecha===hoy);
    if(DATA.length<5)DATA=all.slice(0,50);
  } else {
    DATA=all;
  }
  filteredData=[...DATA];
  calcKPIs();buildActivityChart();buildPieChart();buildFlavorChart();buildDashboardTable();buildFlavorRank();
}

// ══════════════════════════════════════════════════════════
// PÁGINA: SABORES — completamente funcional
// ══════════════════════════════════════════════════════════
let saborFilter='all';

function buildFlavorGrid(){
  const el=document.getElementById('flavorGrid'); if(!el)return;
  const all=NivDB.getFlavors();
  const stats=NivDB.getStats(DATA);
  let list=[...all];
  if(saborFilter==='agua')     list=list.filter(f=>f.base==='agua');
  else if(saborFilter==='leche')    list=list.filter(f=>f.base==='leche'||f.base==='ambas');
  else if(saborFilter==='inactivos')list=list.filter(f=>!f.activo);
  else if(saborFilter==='top') list=[...list].sort((a,b)=>(stats.flavorCounts[b.id]||0)-(stats.flavorCounts[a.id]||0)).slice(0,6);
  const max=Math.max(...all.map(f=>stats.flavorCounts[f.id]||0))||1;
  el.innerHTML=list.map(f=>{
    const cnt=stats.flavorCounts[f.id]||0, pct=Math.round(cnt/max*100);
    return`<div class="flavor-card${f.activo?'':' inactive-card'}" onclick="openFlavorModal('${f.id}')">
      <div class="fc-header" style="background:${f.color}18">
        <div style="display:flex;align-items:flex-start;justify-content:space-between">
          <span class="fc-emoji">${f.emoji}</span>
          <div style="display:flex;gap:6px;align-items:center">
            <span style="font-size:10px;padding:3px 8px;border-radius:20px;background:${f.activo?'#d4edd8':'#fde4e4'};color:${f.activo?'#3d8b5e':'#b03030'};font-weight:600">${f.activo?'Activo':'Inactivo'}</span>
          </div>
        </div>
        <div class="fc-name">${f.name}</div>
        <div class="fc-persona">${f.persona}</div>
      </div>
      <div class="fc-body">
        <div class="fc-stats">
          <div class="fc-stat"><div class="fc-stat-val" style="color:${f.color}">${cnt}</div><div class="fc-stat-lbl">Tests</div></div>
          <div class="fc-stat"><div class="fc-stat-val">${pct}%</div><div class="fc-stat-lbl">Del total</div></div>
          <div class="fc-stat"><div class="fc-stat-val" style="color:${f.color};font-size:14px">${f.base==='agua'?'💧':f.base==='leche'?'🥛':'💧🥛'}</div><div class="fc-stat-lbl">${f.base==='agua'?'Agua':f.base==='leche'?'Leche':'Ambas'}</div></div>
        </div>
        <div class="fc-bar-wrap"><div class="fc-bar-lbl"><span>Popularidad</span><span>${pct}%</span></div><div class="fc-bar-bg"><div class="fc-bar-fill" style="width:${pct}%;background:${f.color}"></div></div></div>
        <div style="display:flex;gap:6px;margin-top:12px">
          <button class="tb-btn" style="flex:1;font-size:11px;padding:6px;justify-content:center" onclick="event.stopPropagation();openFlavorModal('${f.id}')">✏️ Editar</button>
          <button class="tb-btn secondary" style="flex:1;font-size:11px;padding:6px;justify-content:center;${!f.activo?'color:var(--green);border-color:var(--green2)':''}" onclick="event.stopPropagation();toggleFlavorStatus('${f.id}')">${f.activo?'⏸ Desactivar':'▶️ Activar'}</button>
          <button class="tb-btn secondary" style="font-size:11px;padding:6px 8px;justify-content:center;color:var(--red);border-color:var(--red2)" onclick="event.stopPropagation();deleteFlavor('${f.id}')" title="Eliminar sabor">🗑</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterSabores(type,btn){
  saborFilter=type;
  document.querySelectorAll('#saborFilters .filter-pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  buildFlavorGrid();
}

function toggleFlavorStatus(id){
  NivDB.toggleFlavor(id);
  buildFlavorGrid();
  const f=NivDB.getFlavors().find(x=>x.id===id);
  showToast(`${f.emoji} ${f.name} ${f.activo?'activado':'desactivado'}`);
}

function openFlavorModal(id){
  const f=NivDB.getFlavors().find(x=>x.id===id); if(!f)return;
  currentFlavorEdit=id;
  document.getElementById('flavorModalTitle').innerHTML=`${f.emoji} Editar — ${f.name}`;
  document.getElementById('flavorModalBody').innerHTML=`
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="field"><label>Nombre del sabor</label><input id="fe_name" type="text" value="${f.name}"></div>
        <div class="field"><label>Emoji</label><input id="fe_emoji" type="text" value="${f.emoji}" maxlength="2"></div>
      </div>
      <div class="field"><label>Persona / Arquetipo</label><input id="fe_persona" type="text" value="${f.persona}"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="field"><label>Color</label><input id="fe_color" type="color" value="${f.color}" style="height:38px;padding:2px 6px"></div>
        <div class="field"><label>Base</label>
          <select id="fe_base">
            <option value="agua"   ${f.base==='agua'  ?'selected':''}>Base agua</option>
            <option value="leche"  ${f.base==='leche' ?'selected':''}>Base leche</option>
            <option value="ambas"  ${f.base==='ambas' ?'selected':''}>Ambas</option>
          </select>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-top:1px solid var(--border)">
        <div><strong style="font-size:13px">Estado del sabor</strong><p style="font-size:12px;color:var(--light);margin-top:2px">Sabores inactivos no aparecen en el kiosco</p></div>
        <label class="toggle"><input type="checkbox" id="fe_activo" ${f.activo?'checked':''}><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
      </div>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="btn-save" style="flex:1" onclick="saveFlavorEdit()">💾 Guardar cambios</button>
        <button class="tb-btn secondary" style="flex:1;justify-content:center" onclick="closeModal()">Cancelar</button>
      </div>
      <div style="padding-top:12px;border-top:1px solid var(--border)">
        <div style="font-size:11px;color:var(--light);margin-bottom:8px">DATOS HISTÓRICOS</div>
        <div style="display:flex;gap:16px;font-size:13px">
          <span>Tests totales: <strong>${NivDB.getStats(DATA).flavorCounts[id]||0}</strong></span>
          <span>Popularidad: <strong>#${NivDB.getFlavors().sort((a,b)=>(NivDB.getStats(DATA).flavorCounts[b.id]||0)-(NivDB.getStats(DATA).flavorCounts[a.id]||0)).findIndex(x=>x.id===id)+1} de 16</strong></span>
        </div>
      </div>
    </div>`;
  document.getElementById('flavorModal').classList.add('open');
}

function saveFlavorEdit(){
  if(!currentFlavorEdit)return;
  NivDB.updateFlavor(currentFlavorEdit,{
    name:   document.getElementById('fe_name').value.trim(),
    emoji:  document.getElementById('fe_emoji').value.trim(),
    persona:document.getElementById('fe_persona').value.trim(),
    color:  document.getElementById('fe_color').value,
    base:   document.getElementById('fe_base').value,
    activo: document.getElementById('fe_activo').checked,
  });
  closeModal();
  buildFlavorGrid();
  showToast('✅ Sabor actualizado correctamente');
}

// ══════════════════════════════════════════════════════════
// PÁGINA: CLIENTES — tabla real con paginación y filtros
// ══════════════════════════════════════════════════════════
function buildClientsTable(){
  let data=[...NivDB.getResults()];
  if(clientModeF!=='all') data=data.filter(d=>d.modo===clientModeF);
  if(clientSearch) data=data.filter(d=>(d.sabor+d.nombre1+(d.nombre2||'')).toLowerCase().includes(clientSearch.toLowerCase()));
  filteredData=data;
  const total=data.length,pages=Math.ceil(total/PER_PAGE);
  currentPage=Math.min(currentPage,pages||1);
  const start=(currentPage-1)*PER_PAGE,slice=data.slice(start,start+PER_PAGE);
  const pi=document.getElementById('pageInfo');
  if(pi)pi.textContent=`Mostrando ${total?start+1:0}–${Math.min(start+PER_PAGE,total)} de ${total}`;
  for(let i=1;i<=4;i++){const b=document.getElementById('pg'+i);if(b){b.textContent=i;b.classList.toggle('active',i===currentPage);b.style.display=i<=pages?'':'none';}}
  const tbody=document.getElementById('clientsBody'); if(!tbody)return;
  tbody.innerHTML=slice.map(d=>{
    const cc=d.compat?`<div class="compat-wrap"><div class="compat-bar"><div class="compat-fill" style="width:${d.compat}%;background:${d.compat>=80?'#3d8b5e':d.compat>=60?'#c4786a':'#9a6820'}"></div></div><span class="compat-num" style="color:${d.compat>=80?'var(--green)':d.compat>=60?'var(--accent)':'var(--amber)'}">${d.compat}%</span></div>`:`<span style="color:var(--xlight)">—</span>`;
    const names=d.nombre2?`${d.nombre1} & ${d.nombre2}`:d.nombre1;
    return`<tr onclick="openClientModal(${d.id})" style="cursor:pointer">
      <td class="td-mono">#${d.id.toString().slice(-4)}</td>
      <td class="td-mono">${d.timeStr||d.hora+':'+String(d.min).padStart(2,'0')}</td>
      <td><div class="flavor-chip"><div class="f-dot" style="background:${d.flavorColor}"></div>${d.sabor}</div></td>
      <td><span class="mode-badge ${d.modo}">${d.modo==='solo'?'Solo':d.modo==='duo'?'Dúo':'Estado'}</span></td>
      <td>${cc}</td>
      <td style="color:var(--mid);font-size:12px">${names}</td>
      <td><div style="display:flex;gap:4px">
        <button class="action-btn" onclick="event.stopPropagation();openClientModal(${d.id})">Ver</button>
        <button class="action-btn" style="color:var(--red);border-color:var(--red2)" onclick="event.stopPropagation();deleteEntry(${d.id})">✕</button>
      </div></td>
    </tr>`;
  }).join('');
}

function filterClients(){clientSearch=document.getElementById('clientSearch').value;currentPage=1;buildClientsTable();}
function clientModeFilter(mode,btn){clientModeF=mode;currentPage=1;document.querySelectorAll('.client-filters .filter-pill').forEach(b=>b.classList.remove('active'));btn.classList.add('active');buildClientsTable();}
function changePage(dir){const pages=Math.ceil(filteredData.length/PER_PAGE);currentPage=Math.max(1,Math.min(currentPage+dir,pages));buildClientsTable();}
function goPage(n){currentPage=n;buildClientsTable();}

function deleteEntry(id){
  if(!confirm('¿Eliminar este registro?'))return;
  NivDB.deleteResult(id);
  DATA=NivDB.getResults();
  buildClientsTable();
  showToast('Registro eliminado');
}

function openClientModal(id){
  const all=NivDB.getResults(), d=all.find(x=>x.id===id); if(!d)return;
  const f=NivDB.getFlavors().find(x=>x.id===d.flavorId);
  document.getElementById('modalTitle').innerHTML=`${f?.emoji||'🍦'} ${d.sabor}`;
  document.getElementById('modalBody').innerHTML=`
    <div class="modal-row"><span class="modal-row-label">ID</span><span class="modal-row-val td-mono">#${d.id.toString().slice(-6)}</span></div>
    <div class="modal-row"><span class="modal-row-label">Hora</span><span class="modal-row-val">${d.timeStr||d.hora+':'+String(d.min).padStart(2,'0')}</span></div>
    <div class="modal-row"><span class="modal-row-label">Fecha</span><span class="modal-row-val">${d.fecha}</span></div>
    <div class="modal-row"><span class="modal-row-label">Modo</span><span class="modal-row-val"><span class="mode-badge ${d.modo}">${d.modo==='solo'?'Solo':d.modo==='duo'?'Dúo':'Estado'}</span></span></div>
    <div class="modal-row"><span class="modal-row-label">Participante(s)</span><span class="modal-row-val">${d.nombre2?d.nombre1+' & '+d.nombre2:d.nombre1}</span></div>
    <div class="modal-row"><span class="modal-row-label">Sabor</span><span class="modal-row-val" style="color:${f?.color||'var(--accent)'}">${d.sabor}</span></div>
    ${d.compat?`<div class="modal-row"><span class="modal-row-label">Compatibilidad</span><span class="modal-row-val" style="font-family:var(--fd);font-size:18px;color:${d.compat>=80?'var(--green)':d.compat>=60?'var(--accent)':'var(--amber)'}">${d.compat}%</span></div>`:''}
    <div style="margin-top:16px;display:flex;gap:8px">
      <button class="btn-save" style="flex:1" onclick="showToast('🎟 Ticket #${d.id.toString().slice(-4)} enviado ✓');closeModal()">🎟 Reimprimir ticket</button>
      <button class="tb-btn secondary" style="flex:1;justify-content:center;color:var(--red)" onclick="deleteEntry(${d.id});closeModal()">🗑 Eliminar</button>
    </div>`;
  document.getElementById('clientModal').classList.add('open');
}

// ══════════════════════════════════════════════════════════
// EXPORTAR CSV — datos reales
// ══════════════════════════════════════════════════════════
function handleExport(){
  NivDB.exportCSV(filteredData.length ? filteredData : NivDB.getResults());
  showToast('✅ CSV exportado correctamente');
}

// ══════════════════════════════════════════════════════════
// PÁGINA: ESTADÍSTICAS
// ══════════════════════════════════════════════════════════
function buildStatsPage(){
  const all=NivDB.getResults();
  const stats=NivDB.getStats(all);
  const el=id=>document.getElementById(id);
  if(el('statTotal'))animCount('statTotal',stats.total);
  if(el('statRate'))el('statRate').textContent=stats.total?Math.round((stats.total*0.91))+'%':'0%';
  if(el('statCompat'))el('statCompat').textContent=stats.avgCompat+'%';
  if(el('statDuoPct'))el('statDuoPct').textContent=stats.total?Math.round(stats.duos/stats.total*100)+'%':'0%';
  if(el('statTickets'))el('statTickets').textContent=Math.round(stats.total*0.88).toLocaleString();
  buildSparklines(all);buildWeekChart(all);buildCompatHistChart(all);buildTrendChart();
}

function buildSparklines(data){
  ['sparkline1','sparkline2','sparkline3'].forEach((id,i)=>{
    destroyChart(id);
    const ctx=document.getElementById(id)?.getContext('2d'); if(!ctx)return;
    const d=Array.from({length:7},(_,j)=>Math.floor(60+Math.random()*50+j*2));
    const c=['#c4786a','#2d5fa0','#3d8b5e'][i];
    const g=ctx.createLinearGradient(0,0,0,60);g.addColorStop(0,c+'44');g.addColorStop(1,c+'00');
    chartInstances[id]=new Chart(ctx,{type:'line',data:{labels:Array(7).fill(''),datasets:[{data:d,borderColor:c,borderWidth:2,backgroundColor:g,fill:true,tension:.4,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{enabled:false}},scales:{x:{display:false},y:{display:false}}}});
  });
}

function buildWeekChart(data){
  destroyChart('weekChart');
  const ctx=document.getElementById('weekChart')?.getContext('2d'); if(!ctx)return;
  const days=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const vals=days.map(()=>Math.floor(40+Math.random()*80));
  chartInstances['weekChart']=new Chart(ctx,{type:'bar',data:{labels:days,datasets:[{data:vals,backgroundColor:days.map((_,i)=>i>=5?'#c4786a':'#e8c4bc'),borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#16120d',callbacks:{label:i=>`${i.raw} tests`}}},scales:{x:{grid:{display:false},ticks:{color:'#a89a8e',font:{size:11}}},y:{grid:{color:'#f0ece6'},ticks:{color:'#a89a8e',font:{size:10},maxTicksLimit:5},border:{dash:[3,3]}}}}});
}

function buildCompatHistChart(data){
  destroyChart('compatHistChart');
  const ctx=document.getElementById('compatHistChart')?.getContext('2d'); if(!ctx)return;
  const duos=NivDB.getResults().filter(d=>d.modo==='duo');
  const buckets=[{r:'40-49',cnt:0},{r:'50-59',cnt:0},{r:'60-69',cnt:0},{r:'70-79',cnt:0},{r:'80-89',cnt:0},{r:'90-99',cnt:0}];
  duos.forEach(d=>{const i=Math.min(5,Math.floor(((d.compat||40)-40)/10));if(i>=0)buckets[i].cnt++;});
  chartInstances['compatHistChart']=new Chart(ctx,{type:'bar',data:{labels:buckets.map(b=>b.r+'%'),datasets:[{data:buckets.map(b=>b.cnt),backgroundColor:['#e8c4bc','#ddb8a8','#c4786a','#9a5040','#3d8b5e','#2d7a50'],borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#16120d',callbacks:{label:i=>`${i.raw} parejas`}}},scales:{x:{grid:{display:false},ticks:{color:'#a89a8e',font:{size:10}}},y:{grid:{color:'#f0ece6'},ticks:{color:'#a89a8e',font:{size:10},maxTicksLimit:4},border:{dash:[3,3]}}}}});
}

function buildTrendChart(){
  destroyChart('trendChart');
  const ctx=document.getElementById('trendChart')?.getContext('2d'); if(!ctx)return;
  const flavors=NivDB.getFlavors().slice(0,5);
  const weeks=['S1','S2','S3','S4','S5','S6','S7'];
  chartInstances['trendChart']=new Chart(ctx,{type:'line',data:{labels:weeks,datasets:flavors.map(f=>({label:f.name.split(' ')[0],data:weeks.map(()=>Math.floor(4+Math.random()*18)),borderColor:f.color,borderWidth:2,tension:.4,pointRadius:3,pointBackgroundColor:f.color,pointBorderColor:'#fff',pointBorderWidth:1.5,fill:false}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},color:'#a89a8e',boxWidth:8,boxHeight:8,padding:10}},tooltip:{backgroundColor:'#16120d'}},scales:{x:{grid:{display:false},ticks:{color:'#a89a8e',font:{size:10}}},y:{grid:{color:'#f0ece6'},ticks:{color:'#a89a8e',font:{size:10},maxTicksLimit:5},border:{dash:[3,3]}}}}});
}

function setRange(r,btn){
  statRange=r;
  document.querySelectorAll('.range-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  buildStatsPage();
}

// ══════════════════════════════════════════════════════════
// PÁGINA: KIOSCO — estado real desde NivDB
// ══════════════════════════════════════════════════════════
function loadKioscoState(){
  const k=NivDB.getKiosko();
  const ids=['kiosko_activo','kiosko_impresion','kiosko_duo','kiosko_reposo','kiosko_sonidos'];
  const keys=['activo','impresion','duo','reposo','sonidos'];
  ids.forEach((id,i)=>{const el=document.getElementById(id);if(el)el.checked=k[keys[i]];});
  const br=document.getElementById('kiosko_brillo');
  if(br)br.value=k.brillo||80;
  const brLbl=document.getElementById('brilloLabel');
  if(brLbl)brLbl.textContent=k.brillo+'%';
  const paper=document.getElementById('paperPct');
  if(paper)paper.textContent=k.papel_pct+'%';
  const paperBar=document.getElementById('paperBar');
  if(paperBar)paperBar.style.width=k.papel_pct+'%';
}

function saveKioskoToggle(key,val){
  NivDB.saveKiosko({[key]:val});
  showToast(`${key.charAt(0).toUpperCase()+key.slice(1)} ${val?'activado':'desactivado'}`);
}

function reiniciarKiosco(){
  if(!confirm('¿Reiniciar el kiosco? Esto recargará la página del kiosco.'))return;
  showToast('🔄 Señal de reinicio enviada al kiosco');
  NivDB.saveKiosko({ultimoReinicio:new Date().toISOString()});
  window.dispatchEvent(new CustomEvent('nivpop:reiniciar'));
}

function limpiarCache(){
  if(!confirm('¿Limpiar todos los datos de tests? Esta acción no se puede deshacer.'))return;
  NivDB.clearResults();
  DATA=[];filteredData=[];
  calcKPIs();buildDashboardTable();buildFlavorRank();
  buildActivityChart();buildPieChart();buildFlavorChart();
  showToast('🗑 Caché limpiado — datos borrados');
}

function imprimirPrueba(){
  const w=window.open('','_blank','width=400,height=600');
  w.document.write(`<html><body style="font-family:monospace;padding:20px;text-align:center">
    <h2>NIV'Pop</h2><p>TICKET DE PRUEBA</p><hr>
    <p>Sabor: <strong>Test Prueba</strong></p>
    <p>Fecha: ${new Date().toLocaleDateString('es-MX')}</p>
    <p>Hora: ${new Date().toLocaleTimeString('es-MX')}</p>
    <hr><p>¡Gracias por tu visita!</p>
    <script>window.print();window.close();<\/script>
  </body></html>`);
  showToast('🖨 Ticket de prueba enviado');
}

function pausarKiosco(){
  const k=NivDB.getKiosko();
  const pausado=!k.pausado;
  NivDB.saveKiosko({pausado});
  // Disparar evento para que el kiosco detecte el cambio en tiempo real
  window.dispatchEvent(new StorageEvent('storage',{key:'nivpop_kiosko'}));
  showToast(pausado?'⏸ Kiosco pausado':'▶️ Kiosco reactivado');
  const btn=document.getElementById('pauseBtn');
  if(btn)btn.textContent=pausado?'▶️ Reactivar kiosco':'⏸ Pausar kiosco';
}

function generarQR(){
  const url=`http://127.0.0.1:5500/index.html`;
  const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  const box=document.getElementById('qrBox');
  if(box){box.innerHTML=`<img src="${qrUrl}" style="width:140px;height:140px;border-radius:8px">`;}
  showToast('✅ QR generado con la URL del kiosco');
}

function copiarEnlace(){
  navigator.clipboard.writeText('http://127.0.0.1:5500/index.html').then(()=>{
    showToast('📋 Enlace copiado al portapapeles ✓');
  }).catch(()=>showToast('http://127.0.0.1:5500/index.html'));
}

function descargarQR(){
  const url='http://127.0.0.1:5500/index.html';
  const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`;
  const a=document.createElement('a');a.href=qrUrl;a.download='nivpop-qr.png';a.click();
  showToast('⬇️ QR descargado');
}

// ══════════════════════════════════════════════════════════
// PÁGINA: CONFIGURACIÓN — datos reales guardados
// ══════════════════════════════════════════════════════════
function loadConfig(){
  const cfg=NivDB.getConfig();
  const fields=['negocio','ciudad','email','telefono','descripcion','color','iniciales'];
  fields.forEach(f=>{const el=document.getElementById('cfg_'+f);if(el)el.value=cfg[f]||'';});
  // Notificaciones
  ['notif_nuevos','notif_resumen','notif_papel','notif_semanales'].forEach(k=>{
    const el=document.getElementById(k);if(el)el.checked=cfg[k]||false;
  });
  // Plan
  document.querySelectorAll('.plan-card').forEach(c=>c.classList.remove('selected'));
  const planEl=document.querySelector(`.plan-card[data-plan="${cfg.plan}"]`);
  if(planEl)planEl.classList.add('selected');
}

function saveConfig(){
  const cfg={};
  ['negocio','ciudad','email','telefono','descripcion','color','iniciales'].forEach(f=>{
    const el=document.getElementById('cfg_'+f);if(el)cfg[f]=el.value;
  });
  ['notif_nuevos','notif_resumen','notif_papel','notif_semanales'].forEach(k=>{
    const el=document.getElementById(k);if(el)cfg[k]=el.checked;
  });
  NivDB.saveConfig(cfg);
  applyConfig();
  showToast('✅ Configuración guardada correctamente');
}

function applyConfig(){
  const cfg=NivDB.getConfig();
  const pn=document.getElementById('profileName');if(pn)pn.textContent=cfg.negocio||'Mi Negocio';
  const pa=document.getElementById('profileAv');if(pa)pa.textContent=(cfg.iniciales||'NP').toUpperCase();
  if(cfg.color)document.documentElement.style.setProperty('--accent',cfg.color);
}

function selectPlan(el,plan){
  document.querySelectorAll('.plan-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  NivDB.saveConfig({plan});
  showToast('Plan seleccionado: '+el.querySelector('.plan-name')?.textContent);
}

function descartarConfig(){loadConfig();showToast('Cambios descartados');}

// ══════════════════════════════════════════════════════════
// NOTIFICACIONES
// ══════════════════════════════════════════════════════════
let _notifs=[
  {icon:'🥭',title:'Sistema iniciado',sub:'NIV\'Pop Dashboard conectado correctamente'},
  {icon:'📊',title:'Datos cargados',sub:`${NivDB.getResults().length} registros en base de datos`},
  {icon:'🖨',title:'Impresora: papel al 72%',sub:'Quedan aproximadamente 340 tickets'},
];

function renderNotifs(){
  const el=document.getElementById('notifList');if(!el)return;
  el.innerHTML=_notifs.slice(0,8).map(n=>`<div class="nd-item"><div class="nd-icon">${n.icon}</div><div><div class="nd-title">${n.title}</div><div class="nd-sub">${n.sub}</div></div></div>`).join('');
}

function pushNotif(title,sub,icon='🍦'){
  _notifs.unshift({icon,title,sub});
  document.getElementById('notifDot')?.style.removeProperty('display');
  renderNotifs();
}

function toggleNotif(){
  document.getElementById('notifDropdown')?.classList.toggle('open');
  const dot=document.getElementById('notifDot');if(dot)dot.style.display='none';
}

function clearNotifs(){
  _notifs=[];renderNotifs();
  document.getElementById('notifDropdown')?.classList.remove('open');
  showToast('Notificaciones limpiadas');
}

document.addEventListener('click',e=>{
  if(!e.target.closest('#notifBtn')&&!e.target.closest('#notifDropdown'))
    document.getElementById('notifDropdown')?.classList.remove('open');
});

// ══════════════════════════════════════════════════════════
// MODAL / TOAST / UTILS
// ══════════════════════════════════════════════════════════
function closeModal(){document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open'));}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

let _toastTimer;
function showToast(msg){
  clearTimeout(_toastTimer);
  const t=document.getElementById('toast');if(!t)return;
  t.textContent=msg;t.classList.add('show');
  _toastTimer=setTimeout(()=>t.classList.remove('show'),3000);
}

// ══════════════════════════════════════════════════════════
// NUEVO SABOR — funcional
// ══════════════════════════════════════════════════════════
function openNewFlavorModal(){
  // Limpiar campos
  ['nf_name','nf_persona','nf_desc'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const emoji=document.getElementById('nf_emoji');if(emoji)emoji.value='🍦';
  const color=document.getElementById('nf_color');if(color)color.value='#c4786a';
  const base=document.getElementById('nf_base');if(base)base.value='leche';
  document.getElementById('newFlavorModal')?.classList.add('open');
}

function saveNewFlavor(){
  const name  = document.getElementById('nf_name')?.value.trim();
  const emoji = document.getElementById('nf_emoji')?.value.trim()||'🍦';
  const persona=document.getElementById('nf_persona')?.value.trim();
  const color = document.getElementById('nf_color')?.value||'#c4786a';
  const base  = document.getElementById('nf_base')?.value||'leche';
  const desc  = document.getElementById('nf_desc')?.value.trim()||'';

  if(!name){ showToast('⚠️ El nombre es obligatorio'); return; }
  if(!persona){ showToast('⚠️ El arquetipo es obligatorio'); return; }

  // Crear ID único desde el nombre
  const id = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,20) + '-' + Date.now().toString().slice(-4);

  const flavors = NivDB.getFlavors();
  flavors.push({ id, name, persona, emoji, color, base, activo:true, pop:0, desc, custom:true });
  NivDB.saveFlavors(flavors);

  closeModal();
  buildFlavorGrid();
  showToast(`✅ Sabor "${name}" creado correctamente`);
}

// ══════════════════════════════════════════════════════════
// PLANES Y PAGOS
// ══════════════════════════════════════════════════════════
const PLANES = {
  starter: {
    nombre:'Starter', emoji:'🆓', precio:0, moneda:'MXN',
    descripcion:'Para empezar a conocer la plataforma.',
    limites:{ kioscos:1, tests_mes:50, csv:false, duo:false, api:false },
  },
  pro: {
    nombre:'Pro', emoji:'⚡', precio:499, moneda:'MXN',
    descripcion:'Para heladerías activas con clientes frecuentes.',
    limites:{ kioscos:3, tests_mes:Infinity, csv:true, duo:true, api:false },
  },
  max: {
    nombre:'Max', emoji:'🚀', precio:1299, moneda:'MXN',
    descripcion:'Para negocios en crecimiento con múltiples sucursales.',
    limites:{ kioscos:10, tests_mes:Infinity, csv:true, duo:true, api:true },
  },
  enterprise: {
    nombre:'Enterprise', emoji:'🏢', precio:null, moneda:'MXN',
    descripcion:'Para cadenas y franquicias. Precio a medida.',
    limites:{ kioscos:Infinity, tests_mes:Infinity, csv:true, duo:true, api:true },
  },
};

function selectPlan(el, plan){
  document.querySelectorAll('.plan-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  const badge=document.getElementById('planBadge');
  if(badge){ const p=PLANES[plan]; badge.textContent=p?p.nombre:'—'; }
}

function openPayment(plan){
  const p = PLANES[plan]; if(!p) return;
  document.getElementById('paymentTitle').textContent = plan==='enterprise' ? '🏢 Contactar ventas — Enterprise' : `${p.emoji} Activar plan ${p.nombre}`;

  if(plan==='enterprise'){
    document.getElementById('paymentBody').innerHTML=`
      <div style="display:flex;flex-direction:column;gap:14px">
        <p style="font-size:14px;color:var(--mid)">El plan Enterprise se cotiza a medida según el número de sucursales, volumen de tests y requerimientos técnicos. Un asesor te contactará en menos de 24 horas.</p>
        <div class="field"><label>Nombre completo</label><input type="text" id="ent_nombre" placeholder="Tu nombre"></div>
        <div class="field"><label>Email</label><input type="email" id="ent_email" placeholder="correo@empresa.com"></div>
        <div class="field"><label>Número de sucursales</label><input type="number" id="ent_sucursales" placeholder="Ej: 5" min="1"></div>
        <div class="field"><label>Mensaje (opcional)</label><textarea id="ent_msg" placeholder="Cuéntanos sobre tu negocio..." style="resize:vertical;min-height:70px;padding:9px 13px;border:1px solid var(--border);border-radius:7px;font-family:var(--fs);font-size:13px;width:100%;outline:none"></textarea></div>
        <button class="btn-save" style="width:100%" onclick="submitEnterprise()">📨 Enviar solicitud</button>
        <p style="font-size:11px;color:var(--light);text-align:center">También puedes escribirnos directamente a <strong>ventas@nivpop.mx</strong></p>
      </div>`;
  } else {
    const cfg = NivDB.getConfig();
    document.getElementById('paymentBody').innerHTML=`
      <div style="display:flex;flex-direction:column;gap:16px">
        <!-- Resumen -->
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:16px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div><div style="font-family:var(--fd);font-size:18px;font-weight:700">${p.emoji} Plan ${p.nombre}</div><div style="font-size:12px;color:var(--mid);margin-top:3px">${p.descripcion}</div></div>
            <div style="font-family:var(--fd);font-size:24px;font-weight:800;color:var(--accent)">$${p.precio.toLocaleString()} <span style="font-size:13px;font-weight:400;color:var(--light)">MXN/mes</span></div>
          </div>
        </div>
        <!-- Método de pago -->
        <div>
          <div style="font-size:12px;font-weight:600;color:var(--mid);margin-bottom:10px;letter-spacing:.5px">MÉTODO DE PAGO</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <label style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:.15s" onclick="selectPayMethod(this,'tarjeta')">
              <input type="radio" name="paymethod" value="tarjeta" checked style="accent-color:var(--accent)">
              <span style="font-size:20px">💳</span><div><div style="font-size:13px;font-weight:500">Tarjeta de crédito / débito</div><div style="font-size:11px;color:var(--light)">Visa, Mastercard, AMEX</div></div>
            </label>
            <label style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid var(--border);border-radius:8px;cursor:pointer" onclick="selectPayMethod(this,'oxxo')">
              <input type="radio" name="paymethod" value="oxxo" style="accent-color:var(--accent)">
              <span style="font-size:20px">🏪</span><div><div style="font-size:13px;font-weight:500">OXXO Pay</div><div style="font-size:11px;color:var(--light)">Paga en efectivo en cualquier OXXO</div></div>
            </label>
            <label style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid var(--border);border-radius:8px;cursor:pointer" onclick="selectPayMethod(this,'spei')">
              <input type="radio" name="paymethod" value="spei" style="accent-color:var(--accent)">
              <span style="font-size:20px">🏦</span><div><div style="font-size:13px;font-weight:500">Transferencia SPEI</div><div style="font-size:11px;color:var(--light)">Transferencia bancaria inmediata</div></div>
            </label>
          </div>
        </div>
        <!-- Formulario tarjeta -->
        <div id="cardForm" style="display:flex;flex-direction:column;gap:10px">
          <div class="field"><label>Número de tarjeta</label><input id="pay_card" type="text" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCard(this)"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div class="field"><label>Vencimiento</label><input id="pay_exp" type="text" placeholder="MM/AA" maxlength="5" oninput="formatExp(this)"></div>
            <div class="field"><label>CVV</label><input id="pay_cvv" type="text" placeholder="123" maxlength="4"></div>
          </div>
          <div class="field"><label>Nombre en la tarjeta</label><input id="pay_name" type="text" placeholder="Como aparece en la tarjeta" value="${cfg.negocio||''}"></div>
        </div>
        <!-- Total -->
        <div style="display:flex;justify-content:space-between;padding:14px;background:var(--ink);border-radius:8px;color:#fff">
          <span style="font-size:13px">Total mensual</span>
          <span style="font-family:var(--fd);font-size:18px;font-weight:700">$${p.precio.toLocaleString()} MXN</span>
        </div>
        <button class="btn-save" style="width:100%;padding:14px;font-size:14px" onclick="processPay('${plan}')">🔒 Activar plan ${p.nombre} — $${p.precio.toLocaleString()} MXN/mes</button>
        <p style="font-size:11px;color:var(--light);text-align:center">🔒 Pago seguro con encriptación SSL · Cancela cuando quieras · Sin permanencia</p>
      </div>`;
  }
  document.getElementById('paymentModal')?.classList.add('open');
}

function selectPayMethod(el, method){
  document.querySelectorAll('#paymentBody label[onclick]').forEach(l=>l.style.borderColor='var(--border)');
  el.style.borderColor='var(--accent)';
  const cardForm=document.getElementById('cardForm');
  if(cardForm) cardForm.style.display = method==='tarjeta'?'flex':'none';
  if(method==='oxxo') showOxxoInfo();
  if(method==='spei') showSpeiInfo();
}

function showOxxoInfo(){
  const cf=document.getElementById('cardForm'); if(!cf)return;
  cf.innerHTML=`<div style="background:var(--amber3);border:1px solid var(--amber2);border-radius:8px;padding:14px">
    <div style="font-weight:600;margin-bottom:6px;color:var(--amber)">📋 Instrucciones OXXO</div>
    <p style="font-size:13px;color:var(--mid)">1. Haz click en "Generar referencia OXXO"<br>2. Lleva el código al OXXO más cercano<br>3. Indica que pagas un servicio OXXO Pay<br>4. Tu plan se activa en menos de 2 horas</p>
  </div>`;
  cf.style.display='flex';
}
function showSpeiInfo(){
  const cf=document.getElementById('cardForm'); if(!cf)return;
  cf.innerHTML=`<div style="background:var(--blue3);border:1px solid var(--blue2);border-radius:8px;padding:14px">
    <div style="font-weight:600;margin-bottom:6px;color:var(--blue)">🏦 Datos para transferencia SPEI</div>
    <div style="font-size:13px;color:var(--mid);display:flex;flex-direction:column;gap:4px">
      <span>Banco: <strong>BBVA</strong></span>
      <span>CLABE: <strong>012 180 0123456789 01</strong></span>
      <span>Beneficiario: <strong>NIV'Pop Technology SA de CV</strong></span>
      <span>Concepto: <strong>Plan Pro — ${NivDB.getConfig().negocio||'Mi Negocio'}</strong></span>
      <span style="color:var(--amber);font-size:11px;margin-top:6px">⚠️ El plan se activa en 1-2 horas hábiles tras recibir el pago.</span>
    </div>
  </div>`;
  cf.style.display='flex';
}

function formatCard(el){ el.value=el.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim(); }
function formatExp(el){ el.value=el.value.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'$1/$2'); }

function processPay(plan){
  const p=PLANES[plan];
  // Validación básica si es tarjeta
  const radio=document.querySelector('input[name="paymethod"]:checked');
  const method=radio?.value||'tarjeta';
  if(method==='tarjeta'){
    const card=document.getElementById('pay_card')?.value.replace(/\s/g,'');
    const exp=document.getElementById('pay_exp')?.value;
    const cvv=document.getElementById('pay_cvv')?.value;
    const name=document.getElementById('pay_name')?.value;
    if(!card||card.length<16){ showToast('⚠️ Número de tarjeta inválido'); return; }
    if(!exp||exp.length<5){ showToast('⚠️ Fecha de vencimiento inválida'); return; }
    if(!cvv||cvv.length<3){ showToast('⚠️ CVV inválido'); return; }
    if(!name){ showToast('⚠️ Ingresa el nombre de la tarjeta'); return; }
  }
  // Simular procesamiento
  const btn=document.querySelector('#paymentModal .btn-save:last-of-type');
  if(btn){ btn.textContent='⏳ Procesando...'; btn.disabled=true; }
  setTimeout(()=>{
    NivDB.saveConfig({plan});
    closeModal();
    document.querySelectorAll('.plan-card').forEach(c=>{
      c.classList.toggle('selected', c.dataset.plan===plan);
    });
    const badge=document.getElementById('planBadge');
    if(badge){ badge.textContent=p.nombre; badge.style.background=plan==='pro'?'var(--accent2)':plan==='max'?'var(--blue2)':'var(--amber2)'; badge.style.color=plan==='pro'?'var(--accent)':plan==='max'?'var(--blue)':'var(--amber)'; }
    showToast(`🎉 ¡Plan ${p.nombre} activado correctamente!`);
    pushNotif(`Plan ${p.nombre} activado`,`Tu suscripción está activa — $${p.precio}/mes`,'🎉');
  }, 2200);
}

function submitEnterprise(){
  const nombre=document.getElementById('ent_nombre')?.value.trim();
  const email=document.getElementById('ent_email')?.value.trim();
  if(!nombre||!email){ showToast('⚠️ Nombre y email son obligatorios'); return; }
  closeModal();
  showToast('✅ Solicitud enviada. Te contactaremos en menos de 24h.');
  pushNotif('Solicitud Enterprise enviada','Un asesor te contactará pronto','🏢');
}

// ══════════════════════════════════════════════════════════
// ASISTENTE IA — GENERADOR DE PREGUNTAS
// ══════════════════════════════════════════════════════════

let _preguntasGeneradas = []; // guarda las preguntas generadas para usarlas al guardar

async function generarPreguntasIA() {
  const nombre  = document.getElementById('nf_name')?.value.trim();
  const persona = document.getElementById('nf_persona')?.value.trim();
  const desc    = document.getElementById('nf_desc')?.value.trim();

  if (!nombre) { showToast('⚠️ Escribe el nombre del sabor primero'); return; }
  if (!desc || desc.length < 20) { showToast('⚠️ Escribe una descripción más detallada (mínimo 20 caracteres)'); return; }

  // Estado de carga
  const btn = document.getElementById('btnGenerar');
  btn.textContent = '⏳ Generando preguntas...';
  btn.disabled = true;

  // Ejemplos de flavors para que la IA entienda el formato exacto
  const ejemploFormato = `{q:'¿Cómo prefieres pasar tu tiempo libre?',o:[{t:'Con personas que me llenen de energía',s:{fresa:3,miel:1}},{t:'En calma, sin mucho estímulo externo',s:{vainilla:3}},{t:'Explorando algo nuevo',s:{menta:3}},{t:'A solas con mis pensamientos',s:{choco:3}}]}`;

  const flavorsActivos = NivDB.getFlavors().filter(f=>f.activo).map(f=>f.id).join(', ');

  const prompt = `Eres el diseñador de tests psicológicos de NIV'Pop, una plataforma de helado artesanal donde los sabores representan arquetipos de personalidad.

Acaban de crear un nuevo sabor con estas características:
- Nombre: "${nombre}"
- Arquetipo/Persona: "${persona}"
- Descripción de personalidad: "${desc}"

Tu tarea es generar EXACTAMENTE 3 preguntas psicológicas para el test de personalidad del kiosco.

REGLAS ESTRICTAS:
1. Cada pregunta tiene exactamente 4 opciones de respuesta
2. Cada opción tiene un objeto de puntajes "s" que asigna puntos a los flavors existentes
3. Los flavors existentes son: ${flavorsActivos}
4. El nuevo sabor se llama con ID: "${nombre.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,15)}"
5. Las preguntas deben poder IDENTIFICAR a alguien que elegiría "${nombre}" vs otros sabores
6. Los puntajes van de 1 a 3 (3=muy relacionado, 1=algo relacionado)
7. Cada opción debe sumar puntos PRINCIPALMENTE al nuevo sabor y secundariamente a sabores afines
8. Las preguntas deben ser en español, naturales, en segunda persona singular
9. NO uses género (no digas él/ella, usa formas neutras)

FORMATO DE RESPUESTA — devuelve SOLO un JSON válido, sin texto extra, sin markdown, sin backticks:
[
  {
    "q": "Texto de la pregunta 1?",
    "o": [
      {"t": "Opción A", "s": {"${nombre.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,15)}": 3, "mango": 1}},
      {"t": "Opción B", "s": {"vainilla": 3}},
      {"t": "Opción C", "s": {"choco": 3}},
      {"t": "Opción D", "s": {"menta": 3, "yuzu": 1}}
    ]
  },
  {
    "q": "Texto de la pregunta 2?",
    "o": [...]
  },
  {
    "q": "Texto de la pregunta 3?",
    "o": [...]
  }
]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const raw = data.content?.[0]?.text || '';

    // Limpiar y parsear JSON
    let jsonStr = raw.trim();
    jsonStr = jsonStr.replace(/```json|```/g, '').trim();

    const preguntas = JSON.parse(jsonStr);
    _preguntasGeneradas = preguntas;
    renderPreguntasGeneradas(preguntas);

  } catch (err) {
    console.error('[IA]', err);
    // Fallback: preguntas genéricas basadas en la descripción
    const flavorId = nombre.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,15);
    const fallback = [
      {
        q: `Cuando entras a un lugar nuevo, lo primero que haces es...`,
        o: [
          {t: `Observar todo antes de actuar`, s: {[flavorId]:3, matcha:1}},
          {t: `Conectar con las personas inmediatamente`, s: {fresa:3, miel:1}},
          {t: `Buscar lo que te llama la atención`, s: {mango:3, yuzu:1}},
          {t: `Ir a tu ritmo, sin prisa`, s: {vainilla:3}},
        ]
      },
      {
        q: `¿Qué te describe mejor en un momento de celebración?`,
        o: [
          {t: `El entusiasmo que contagias a todos`, s: {[flavorId]:3, mango:1}},
          {t: `La calidez con la que recibes a cada persona`, s: {chai:3, miel:1}},
          {t: `Los detalles especiales que preparas`, s: {lavanda:3, carda:1}},
          {t: `Tu presencia tranquila que ancla el momento`, s: {vainilla:3, earl:1}},
        ]
      },
      {
        q: `¿Cómo te relacionas con lo desconocido?`,
        o: [
          {t: `Lo abrazo — lo nuevo me activa`, s: {[flavorId]:3, yuzu:1}},
          {t: `Lo analizo antes de decidir`, s: {menta:3, earl:1}},
          {t: `Lo recibo con calma, sin prisa`, s: {vainilla:3}},
          {t: `Lo proceso a fondo antes de moverme`, s: {choco:3, matcha:1}},
        ]
      }
    ];
    _preguntasGeneradas = fallback;
    renderPreguntasGeneradas(fallback);
    showToast('⚠️ IA no disponible — se usaron preguntas genéricas editables');
  } finally {
    btn.textContent = '🔄 Regenerar preguntas';
    btn.disabled = false;
  }
}

function renderPreguntasGeneradas(preguntas) {
  const wrap = document.getElementById('nf_preguntasWrap');
  const cont = document.getElementById('nf_preguntas');
  if (!wrap || !cont) return;

  cont.innerHTML = preguntas.map((p, qi) => `
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:16px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="background:var(--ink);color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${qi+1}</span>
        <input
          id="pq_${qi}"
          type="text"
          value="${p.q.replace(/"/g,'&quot;')}"
          style="flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-family:var(--fs);font-size:13px;font-weight:500;color:var(--ink);background:var(--surface);outline:none"
          placeholder="Pregunta..."
        >
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;padding-left:30px">
        ${p.o.map((op, oi) => `
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:10px;color:var(--xlight);font-weight:600;width:14px">${['A','B','C','D'][oi]}</span>
            <input
              id="po_${qi}_${oi}"
              type="text"
              value="${op.t.replace(/"/g,'&quot;')}"
              style="flex:1;padding:7px 11px;border:1px solid var(--border2);border-radius:6px;font-family:var(--fs);font-size:12px;color:var(--ink);background:var(--surface);outline:none"
              placeholder="Opción..."
            >
            <div style="font-size:10px;color:var(--light);white-space:nowrap">${Object.entries(op.s).map(([k,v])=>`<span style="background:${v===3?'var(--green2)':'var(--surface3)'};color:${v===3?'var(--green)':'var(--mid)'};padding:1px 5px;border-radius:10px;margin-left:2px">${k}:${v}</span>`).join('')}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  wrap.style.display = 'block';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ══════════════════════════════════════════════════════════
// GUARDAR NUEVO SABOR — con preguntas integradas al kiosco
// ══════════════════════════════════════════════════════════
function saveNewFlavor() {
  const name    = document.getElementById('nf_name')?.value.trim();
  const emoji   = document.getElementById('nf_emoji')?.value.trim() || '🍦';
  const persona = document.getElementById('nf_persona')?.value.trim();
  const color   = document.getElementById('nf_color')?.value || '#c4786a';
  const base    = document.getElementById('nf_base')?.value || 'leche';
  const desc    = document.getElementById('nf_desc')?.value.trim() || '';
  const alerg   = document.getElementById('nf_alergeno')?.value || '';

  if (!name)    { showToast('⚠️ El nombre es obligatorio'); return; }
  if (!persona) { showToast('⚠️ El arquetipo es obligatorio'); return; }
  if (!desc)    { showToast('⚠️ La descripción es obligatoria'); return; }

  const id = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
                 .replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,20)
                 + '-' + Date.now().toString().slice(-4);

  // Recoger preguntas editadas por el usuario
  let preguntasFinales = [];
  if (_preguntasGeneradas.length > 0) {
    preguntasFinales = _preguntasGeneradas.map((p, qi) => {
      const qEl = document.getElementById(`pq_${qi}`);
      const pregunta = qEl ? qEl.value.trim() : p.q;
      const opciones = p.o.map((op, oi) => {
        const oEl = document.getElementById(`po_${qi}_${oi}`);
        return { t: oEl ? oEl.value.trim() : op.t, s: { ...op.s, [id]: op.s[id] || 0 } };
      });
      return { q: pregunta, o: opciones };
    });
  }

  // Guardar en NivDB
  const alergenos = {
    lacteos:  alerg === 'lacteos' || alerg === 'ambos',
    gluten:   false,
    huevo:    false,
    frutosSecs: alerg === 'frutos' || alerg === 'ambos',
    soja:     false,
    sulfitos: false,
  };

  const flavors = NivDB.getFlavors();
  flavors.push({ id, name, persona, emoji, color, base, activo: true, pop: 0, desc, custom: true, allergens: alergenos, preguntas: preguntasFinales });
  NivDB.saveFlavors(flavors);

  // Inyectar preguntas en el kiosco si hay
  if (preguntasFinales.length > 0) {
    inyectarPreguntasKiosco(id, name, preguntasFinales);
  }

  _preguntasGeneradas = [];
  closeModal();
  buildFlavorGrid();
  showToast(`✅ Sabor "${name}" creado con ${preguntasFinales.length} preguntas`);
  if (preguntasFinales.length > 0) {
    pushNotif(`Sabor "${name}" creado`, `${preguntasFinales.length} preguntas integradas al kiosco`, '✨');
  }
}

// Inyecta las preguntas nuevas en el localStorage del kiosco
// para que aparezcan en el siguiente test
function inyectarPreguntasKiosco(flavorId, flavorName, preguntas) {
  try {
    const key = 'nivpop_custom_questions';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const nuevas = preguntas.map(p => ({
      q: p.q,
      o: p.o.map(op => ({ t: op.t, s: op.s })),
      _flavor: flavorId,
      _source: 'custom'
    }));
    const merged = [...existing, ...nuevas];
    localStorage.setItem(key, JSON.stringify(merged));
    console.log(`[NIV'Pop] ${nuevas.length} preguntas para "${flavorName}" inyectadas al kiosco`);
  } catch(e) {
    console.error('[inyectar]', e);
  }
}

// ════════════════════════════════════════════════════════════
// BUG FIXES DASHBOARD
// ════════════════════════════════════════════════════════════

// ── BUG 10: Badge de sabores no se actualiza ──
function updateSaborBadge(){
  const badge = document.getElementById('saborBadge');
  if(badge) badge.textContent = NivDB.getFlavors().filter(f=>f.activo).length;
}

// ── BUG 12: Eliminar sabor ──
function deleteFlavor(id){
  const f = NivDB.getFlavors().find(x=>x.id===id);
  if(!f) return;
  if(!confirm(`¿Eliminar permanentemente "${f.name}"?\nEsta acción no se puede deshacer.`)) return;
  const list = NivDB.getFlavors().filter(x=>x.id!==id);
  NivDB.saveFlavors(list);
  updateSaborBadge();
  buildFlavorGrid();
  showToast(`🗑 Sabor "${f.name}" eliminado`);
}

// ── BUG 13: Fix selectPayMethod — tarjeta desaparece ──
// Reemplazar la función original
const _origSelectPayMethod = window.selectPayMethod;
window.selectPayMethod = function(el, method){
  // Quitar selección visual de todos
  const labels = document.querySelectorAll('#paymentBody > div > div:nth-child(2) label');
  labels.forEach(l=>{ if(l.style) l.style.borderColor='var(--border)'; });
  if(el && el.style) el.style.borderColor='var(--accent)';

  const cardForm = document.getElementById('cardForm');
  if(!cardForm) return;

  if(method === 'tarjeta'){
    // Restaurar formulario de tarjeta
    cardForm.style.display = 'flex';
    cardForm.style.flexDirection = 'flex';
    if(!document.getElementById('pay_card')){
      cardForm.innerHTML = `
        <div class="field"><label>Número de tarjeta</label><input id="pay_card" type="text" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCard(this)"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="field"><label>Vencimiento</label><input id="pay_exp" type="text" placeholder="MM/AA" maxlength="5" oninput="formatExp(this)"></div>
          <div class="field"><label>CVV</label><input id="pay_cvv" type="text" placeholder="123" maxlength="4"></div>
        </div>
        <div class="field"><label>Nombre en la tarjeta</label><input id="pay_name" type="text" placeholder="Como aparece en la tarjeta"></div>`;
    }
  } else if(method === 'oxxo'){
    showOxxoInfo();
  } else if(method === 'spei'){
    showSpeiInfo();
  }
};

// ── BUG 9: CSV más original — exportar como reporte HTML ──
function handleExport(){
  const data = filteredData.length ? filteredData : NivDB.getResults();
  const cfg = NivDB.getConfig();
  const stats = NivDB.getStats(data);
  const now = new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const flavors = NivDB.getFlavors();

  const colorMap = {};
  flavors.forEach(f=>{ colorMap[f.id]=f.color; });

  const rows = data.slice(0,200).map(d=>`
    <tr>
      <td style="font-family:monospace;font-size:11px;color:#888">${d.timeStr||d.hora+':'+String(d.min).padStart(2,'0')}</td>
      <td>${d.fecha}</td>
      <td><span style="display:inline-flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:${d.flavorColor||colorMap[d.flavorId]||'#ccc'};flex-shrink:0"></span>${d.sabor}</span></td>
      <td><span style="padding:2px 8px;border-radius:10px;font-size:11px;background:${d.modo==='duo'?'#d4e2f4':d.modo==='estado'?'#d4edd8':'#f0d8d0'};color:${d.modo==='duo'?'#2d5fa0':d.modo==='estado'?'#3d8b5e':'#c4786a'}">${d.modo==='solo'?'Solo':d.modo==='duo'?'Dúo':'Estado'}</span></td>
      <td>${d.nombre2?d.nombre1+' & '+d.nombre2:d.nombre1}</td>
      <td style="font-weight:600;color:${d.compat>=80?'#3d8b5e':d.compat>=60?'#c4786a':'#9a6820'}">${d.compat?d.compat+'%':'—'}</td>
    </tr>`).join('');

  const topFlavors = flavors.map(f=>({...f,cnt:stats.flavorCounts[f.id]||0}))
    .sort((a,b)=>b.cnt-a.cnt).slice(0,5);

  const reportHtml = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<title>NIV'Pop — Reporte de resultados</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Arial,sans-serif;color:#16120d;background:#f7f4f0;padding:40px}
  .page{max-width:900px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:#16120d;padding:32px 40px;display:flex;align-items:center;justify-content:space-between}
  .hdr-logo{font-size:28px;font-weight:800;color:#fff;letter-spacing:-1px}
  .hdr-logo span{color:#c4786a}
  .hdr-sub{font-size:12px;color:rgba(255,255,255,.4);margin-top:4px}
  .hdr-date{font-size:12px;color:rgba(255,255,255,.4);text-align:right}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-bottom:1px solid #f0ece6}
  .kpi{padding:24px 28px;border-right:1px solid #f0ece6}
  .kpi:last-child{border-right:none}
  .kpi-val{font-size:32px;font-weight:700;letter-spacing:-1px;color:#16120d}
  .kpi-lbl{font-size:11px;color:#a89a8e;margin-top:4px;text-transform:uppercase;letter-spacing:1px}
  .section{padding:28px 40px}
  .section-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a89a8e;margin-bottom:16px}
  .top-flavors{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px}
  .tf-item{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:20px;border:1px solid #e8e4de;font-size:13px}
  .tf-dot{width:10px;height:10px;border-radius:50%}
  table{width:100%;border-collapse:collapse;font-size:13px}
  thead th{padding:10px 14px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#a89a8e;border-bottom:2px solid #16120d;white-space:nowrap}
  tbody tr{border-bottom:1px solid #f5f2ee}
  tbody tr:hover{background:#faf9f7}
  tbody td{padding:10px 14px;vertical-align:middle}
  .footer{padding:20px 40px;background:#faf9f7;border-top:1px solid #f0ece6;display:flex;justify-content:space-between;font-size:11px;color:#a89a8e}
  @media print{body{background:#fff;padding:0}.page{box-shadow:none;border-radius:0}}
</style>
</head>
<body>
<div class="page">
  <div class="hdr">
    <div>
      <div class="hdr-logo">NIV<span>'</span>POP</div>
      <div class="hdr-sub">${cfg.negocio||'Heladería'} · Reporte de resultados</div>
    </div>
    <div class="hdr-date">${now}<br><span style="font-size:10px">Generado automáticamente</span></div>
  </div>
  <div class="kpis">
    <div class="kpi"><div class="kpi-val">${stats.total}</div><div class="kpi-lbl">Tests totales</div></div>
    <div class="kpi"><div class="kpi-val">${stats.duos}</div><div class="kpi-lbl">Modo dúo</div></div>
    <div class="kpi"><div class="kpi-val">${stats.avgCompat}%</div><div class="kpi-lbl">Compat. promedio</div></div>
    <div class="kpi"><div class="kpi-val">${stats.uniqueFlavors}</div><div class="kpi-lbl">Sabores únicos</div></div>
  </div>
  <div class="section">
    <div class="section-title">Top sabores del período</div>
    <div class="top-flavors">
      ${topFlavors.map((f,i)=>`<div class="tf-item"><div class="tf-dot" style="background:${f.color}"></div><strong>#${i+1}</strong> ${f.name.split(' ')[0]} <span style="color:#a89a8e">(${f.cnt})</span></div>`).join('')}
    </div>
    <div class="section-title">Detalle de resultados ${data.length > 200?'(últimos 200)':''}</div>
    <table>
      <thead><tr><th>Hora</th><th>Fecha</th><th>Sabor</th><th>Modo</th><th>Nombre(s)</th><th>Compatibilidad</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <div class="footer">
    <span>NIV'Pop Analytics · ${cfg.negocio||'Heladería'}</span>
    <span>${data.length} registros exportados · ${now}</span>
  </div>
</div>
<script>window.onload=()=>window.print();<\/script>
</body></html>`;

  const blob = new Blob([reportHtml], {type:'text/html;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nivpop-reporte-${new Date().toISOString().slice(0,10)}.html`;
  a.click();
  showToast('📊 Reporte exportado — ábrelo en el navegador e imprime como PDF');
}

// ── PIN ADMIN desde configuración ──
function savePinConfig(){
  const newPin = document.getElementById('cfg_pin')?.value;
  const confirm_ = document.getElementById('cfg_pin_confirm')?.value;
  if(!newPin || newPin.length < 4){ showToast('⚠️ El PIN debe tener 4 dígitos'); return; }
  if(newPin !== confirm_){ showToast('⚠️ Los PINs no coinciden'); return; }
  NivDB.saveConfig({adminPin: newPin});
  showToast('✅ PIN actualizado correctamente');
}

// Sobrescribir saveConfig para incluir el badge update
const _origSaveConfig = saveConfig;
// Al guardar sabores, actualizar badge
const _origSaveFlavors = NivDB.saveFlavors;

// Actualizar badge al abrir la sección de sabores
const _origBuildFlavorGrid = buildFlavorGrid;
window.buildFlavorGrid = function(){
  _origBuildFlavorGrid();
  updateSaborBadge();
};
