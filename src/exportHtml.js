const AXIS_START = 6 * 60;
const AXIS_TOTAL = 24 * 60;

const COLOR_MAP = {
  'bg-emerald-600 text-white':    { bg: '#059669', text: '#fff' },
  'bg-yellow-400 text-slate-900': { bg: '#facc15', text: '#0f172a' },
  'bg-red-600 text-white':        { bg: '#dc2626', text: '#fff' },
  'bg-purple-600 text-white':     { bg: '#9333ea', text: '#fff' },
  'bg-slate-400 text-white':      { bg: '#94a3b8', text: '#fff' },
  'bg-slate-800 text-white':      { bg: '#1e293b', text: '#fff' },
  'bg-amber-700 text-white':      { bg: '#b45309', text: '#fff' },
  'bg-yellow-600 text-white':     { bg: '#ca8a04', text: '#fff' },
};

function parseTime(timeStr) {
  const nextDay = timeStr.includes('+1') || timeStr === '24:00';
  const clean = timeStr.replace('+1', '').replace('24:00', '00:00');
  const [h, m] = clean.split(':').map(Number);
  let total = h * 60 + (m || 0);
  if (nextDay) total += 24 * 60;
  return total;
}

function blockPositionStyle(start, end, colorClass) {
  const startMin = parseTime(start) - AXIS_START;
  let endMin = parseTime(end) - AXIS_START;
  if (endMin > AXIS_TOTAL) endMin = AXIS_TOTAL;
  const left = ((startMin / AXIS_TOTAL) * 100).toFixed(3);
  const width = (((endMin - startMin) / AXIS_TOTAL) * 100).toFixed(3);
  const c = COLOR_MAP[colorClass] || { bg: '#94a3b8', text: '#fff' };
  return `left:${left}%;width:${width}%;background:${c.bg};color:${c.text}`;
}

function renderLegendDot(colorClass) {
  const c = COLOR_MAP[colorClass] || { bg: '#94a3b8', text: '#fff' };
  return `background:${c.bg}`;
}

function renderRows(items) {
  return items.map(item => {
    const lanes = item.lanes.map(lane => {
      const blocks = lane.map(block => {
        const posStyle = blockPositionStyle(block.start, block.end, block.color);
        const rawStart = block.start.replace('+1', '');
        const rawEnd = block.end.replace('+1', '').replace('24:00', '00:00');
        return `<div class="block" style="${posStyle}" title="${block.label}: ${rawStart}–${rawEnd}">
          <span>${block.label}</span>
        </div>`;
      }).join('');
      return `<div class="lane">${blocks}</div>`;
    }).join('');
    return `<div class="row">
      <div class="mod-name">${item.modality}</div>
      <div class="lanes">${lanes}</div>
    </div>`;
  }).join('');
}

function renderAxisTicks() {
  const ticks = [];
  for (let i = 6; i <= 30; i++) {
    const display = i >= 24 ? i - 24 : i;
    const left = (((i * 60 - AXIS_START) / AXIS_TOTAL) * 100).toFixed(2);
    ticks.push(
      `<div class="tick" style="left:${left}%"><span>${String(display).padStart(2,'0')}h</span></div>`
    );
  }
  return ticks.join('');
}

export function generateExportHtml(data) {
  const weekdayHtml = renderRows(data.weekday);
  const weekendHtml = renderRows(data.weekend);
  const axisTicks = renderAxisTicks();

  const now = new Date().toLocaleString('pt-BR');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Agendas de Radiologia — HBA</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;background:#f1f5f9;color:#1e293b;min-height:100vh}

.header{background:#fff;padding:16px 20px;border-bottom:1px solid #e2e8f0;display:flex;flex-direction:column;gap:4px}
.header h1{font-size:1.2rem;font-weight:800;color:#1e293b}
.header p{font-size:.75rem;color:#64748b}
.header .exported{font-size:.7rem;color:#94a3b8;margin-top:2px}

.tabs{display:flex;gap:8px;padding:16px 20px 0}
.tab{flex:1;padding:10px 8px;border:1.5px solid #e2e8f0;border-radius:10px;background:#fff;font-size:.82rem;font-weight:700;cursor:pointer;transition:all .15s;color:#64748b;text-align:center}
.tab.active{background:#1e293b;color:#fff;border-color:#1e293b}

.legend{display:flex;flex-wrap:wrap;gap:6px;padding:14px 20px}
.legend-item{display:flex;align-items:center;gap:5px;background:#fff;padding:4px 10px;border-radius:20px;font-size:.72rem;font-weight:600;border:1px solid #e2e8f0;color:#475569}
.legend-dot{width:11px;height:11px;border-radius:50%;flex-shrink:0}

.card{margin:0 12px 20px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.chart{min-width:680px}

.axis{position:relative;height:34px;background:#f8fafc;border-bottom:1px solid #e2e8f0}
.tick{position:absolute;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;bottom:0}
.tick span{font-size:10px;font-weight:700;color:#64748b;margin-bottom:3px;white-space:nowrap}
.tick::after{content:'';display:block;width:1px;height:5px;background:#cbd5e1}

.row{display:flex;border-bottom:1px solid #f1f5f9}
.row:last-child{border-bottom:none}
.mod-name{width:130px;min-width:130px;font-size:.7rem;font-weight:800;color:#1e293b;padding:8px 10px;display:flex;align-items:center;justify-content:center;text-align:center;border-right:1px solid #e2e8f0;line-height:1.3}
.lanes{flex:1;padding:5px 3px;display:flex;flex-direction:column;gap:4px}
.lane{position:relative;height:34px;width:100%}

.block{position:absolute;height:100%;border-radius:6px;display:flex;align-items:center;justify-content:center;padding:2px 4px;overflow:hidden;border:1px solid rgba(0,0,0,.1);box-shadow:0 1px 2px rgba(0,0,0,.06)}
.block span{font-size:9.5px;font-weight:800;text-align:center;word-break:break-word;line-height:1.2;display:block}

.period{display:none}
.period.active{display:block}

.footer{text-align:center;padding:12px;font-size:.7rem;color:#94a3b8}
</style>
</head>
<body>

<div class="header">
  <h1>Agendas de Radiologia</h1>
  <p>HBA — Distribuição de modalidades e exames de imagem</p>
  <span class="exported">Exportado em ${now}</span>
</div>

<div class="tabs">
  <div class="tab active" onclick="switchTab('weekday')">Segunda à Sexta</div>
  <div class="tab" onclick="switchTab('weekend')">Finais de Semana</div>
</div>

<div class="legend">
  <div class="legend-item"><div class="legend-dot" style="${renderLegendDot('bg-emerald-600 text-white')}"></div>Eletivo</div>
  <div class="legend-item"><div class="legend-dot" style="${renderLegendDot('bg-yellow-400 text-slate-900')}"></div>Internado</div>
  <div class="legend-item"><div class="legend-dot" style="${renderLegendDot('bg-red-600 text-white')}"></div>Emergência</div>
  <div class="legend-item"><div class="legend-dot" style="${renderLegendDot('bg-purple-600 text-white')}"></div>Anestesia</div>
  <div class="legend-item"><div class="legend-dot" style="${renderLegendDot('bg-slate-400 text-white')}"></div>Intervenção</div>
  <div class="legend-item"><div class="legend-dot" style="${renderLegendDot('bg-slate-800 text-white')}"></div>Radioterapia</div>
  <div class="legend-item"><div class="legend-dot" style="${renderLegendDot('bg-amber-700 text-white')}"></div>Cardíaca</div>
  <div class="legend-item"><div class="legend-dot" style="${renderLegendDot('bg-yellow-600 text-white')}"></div>Beira-Leito</div>
</div>

<div class="card">
  <div class="scroll">
    <div class="chart">

      <div class="axis">${axisTicks}</div>

      <div id="tab-weekday" class="period active">
        ${weekdayHtml}
      </div>
      <div id="tab-weekend" class="period">
        ${weekendHtml}
      </div>

    </div>
  </div>
</div>

<div class="footer">Agenda HBA &mdash; visualização offline</div>

<script>
function switchTab(id) {
  document.querySelectorAll('.period').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  event.target.classList.add('active');
}
</script>
</body>
</html>`;
}
