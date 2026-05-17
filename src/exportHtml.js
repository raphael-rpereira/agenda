const AXIS_START = 6 * 60;   // 06:00 em minutos
const AXIS_TOTAL = 24 * 60;  // 24 horas

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

function parseTime(t) {
  const next = t.includes('+1') || t === '24:00';
  const clean = t.replace('+1', '').replace('24:00', '00:00');
  const [h, m] = clean.split(':').map(Number);
  return h * 60 + (m || 0) + (next ? 1440 : 0);
}

function blockStyle(start, end, cls) {
  const s = parseTime(start) - AXIS_START;
  const e = Math.min(parseTime(end) - AXIS_START, AXIS_TOTAL);
  const l = ((s / AXIS_TOTAL) * 100).toFixed(3);
  const w = (((e - s) / AXIS_TOTAL) * 100).toFixed(3);
  const c = COLOR_MAP[cls] || { bg: '#94a3b8', text: '#fff' };
  return `left:${l}%;width:${w}%;background:${c.bg};color:${c.text}`;
}

// Eixo: posicionado apenas dentro da coluna de lanes
// Os ticks usam a mesma base percentual que os blocos
function renderAxis() {
  const ticks = [];
  for (let i = 6; i <= 30; i++) {
    const h = i >= 24 ? i - 24 : i;
    const left = (((i * 60 - AXIS_START) / AXIS_TOTAL) * 100).toFixed(2);
    ticks.push(`<div class="tk" style="left:${left}%">${String(h).padStart(2,'0')}h</div>`);
  }
  return ticks.join('');
}

function renderRows(items) {
  return items.map(({ modality, lanes }) => {
    const lanesHtml = lanes.map(lane => {
      const blocks = lane.map(b => {
        const st = b.start.replace('+1','');
        const en = b.end.replace('+1','').replace('24:00','00:00');
        return `<div class="blk" style="${blockStyle(b.start,b.end,b.color)}" title="${b.label} ${st}–${en}"><span>${b.label}</span></div>`;
      }).join('');
      return `<div class="lane">${blocks}</div>`;
    }).join('');
    return `<div class="row"><div class="mn">${modality}</div><div class="ls">${lanesHtml}</div></div>`;
  }).join('');
}

const LEGEND = [
  ['#059669','#fff','Eletivo'],
  ['#facc15','#0f172a','Internado'],
  ['#dc2626','#fff','Emergência'],
  ['#9333ea','#fff','Anestesia'],
  ['#94a3b8','#fff','Intervenção'],
  ['#1e293b','#fff','Radioterapia'],
  ['#b45309','#fff','Cardíaca'],
  ['#ca8a04','#fff','Beira-Leito'],
];

export function generateExportHtml(data) {
  const wd = renderRows(data.weekday);
  const we = renderRows(data.weekend);
  const axis = renderAxis();
  const now = new Date().toLocaleString('pt-BR');

  const legendHtml = LEGEND.map(([bg, text, label]) =>
    `<span class="li"><span class="ld" style="background:${bg}"></span>${label}</span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>Agendas HBA</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:#0f172a;font-family:system-ui,-apple-system,sans-serif}

/* ── Layout geral ── */
#app{display:flex;flex-direction:column;height:100vh;height:100dvh}

/* ── Cabeçalho compacto ── */
#hd{display:flex;align-items:center;justify-content:space-between;padding:4px 10px;background:#1e293b;flex-shrink:0;gap:8px;min-height:32px}
#hd h1{font-size:11px;font-weight:800;color:#f1f5f9;white-space:nowrap}
#hd small{font-size:8px;color:#64748b;white-space:nowrap}
#tabs{display:flex;gap:4px;flex-shrink:0}
.tb{padding:3px 10px;border-radius:6px;font-size:9px;font-weight:700;cursor:pointer;border:1px solid #334155;color:#94a3b8;background:transparent;white-space:nowrap}
.tb.on{background:#3b82f6;color:#fff;border-color:#3b82f6}

/* ── Área escalável ── */
#scaler-wrap{flex:1;overflow:hidden;position:relative}
#scaler{position:absolute;top:0;left:0;transform-origin:top left;width:100%}

/* ── Chart ── */
#chart{background:#fff;border-radius:8px;overflow:hidden;margin:4px 6px}

/* ── Linha de eixo de tempo ──
   Estrutura igual às linhas de dados: [mn spacer] + [ls com ticks]
   Garante que os ticks fiquem alinhados com os blocos  ── */
.axis-row{display:flex;background:#f8fafc;border-bottom:2px solid #e2e8f0}
.ax-sp{flex-shrink:0;border-right:1px solid #e2e8f0}  /* mesmo width que .mn via JS */
.ax-tks{flex:1;position:relative;height:26px}
.tk{position:absolute;transform:translateX(-50%);font-size:8px;font-weight:700;color:#64748b;bottom:4px;white-space:nowrap}
.tk::after{content:'';position:absolute;bottom:0;left:50%;width:1px;height:3px;background:#cbd5e1}

/* ── Linhas de modalidade ── */
.row{display:flex;border-bottom:1px solid #f1f5f9}
.row:last-child{border-bottom:none}
.mn{flex-shrink:0;font-size:8px;font-weight:800;color:#1e293b;padding:3px 5px;display:flex;align-items:center;justify-content:center;text-align:center;border-right:1px solid #e2e8f0;line-height:1.2;word-break:break-word}
.ls{flex:1;padding:2px 2px;display:flex;flex-direction:column;gap:2px}
.lane{position:relative;height:22px;width:100%}

/* ── Blocos de horário ── */
.blk{position:absolute;height:100%;border-radius:4px;display:flex;align-items:center;justify-content:center;padding:1px 3px;overflow:hidden;border:1px solid rgba(0,0,0,.12);box-shadow:0 1px 2px rgba(0,0,0,.08)}
.blk span{font-size:7.5px;font-weight:800;text-align:center;word-break:break-word;line-height:1.1;display:block;user-select:none}

/* ── Legenda compacta ── */
#leg{display:flex;flex-wrap:wrap;gap:3px 8px;padding:3px 8px;background:#1e293b;flex-shrink:0}
.li{display:flex;align-items:center;gap:3px;font-size:7.5px;font-weight:600;color:#cbd5e1;white-space:nowrap}
.ld{width:8px;height:8px;border-radius:50%;flex-shrink:0}

/* ── Tabs de período ── */
.period{display:none}.period.on{display:block}
</style>
</head>
<body>
<div id="app">

  <div id="hd">
    <div>
      <h1>Agendas de Radiologia &mdash; HBA</h1>
      <small>Exportado ${now}</small>
    </div>
    <div id="tabs">
      <button class="tb on" onclick="sw(this,'wd')">Seg–Sex</button>
      <button class="tb"    onclick="sw(this,'we')">Fim de semana</button>
    </div>
  </div>

  <div id="scaler-wrap">
    <div id="scaler">
      <div id="chart">
        <!-- Eixo de tempo: [espaçador .mn] + [coluna de ticks .ax-tks] -->
        <div class="axis-row">
          <div class="ax-sp" id="ax-sp"></div>
          <div class="ax-tks">${axis}</div>
        </div>

        <div id="wd" class="period on">${wd}</div>
        <div id="we" class="period">${we}</div>
      </div>
    </div>
  </div>

  <div id="leg">${legendHtml}</div>

</div>
<script>
// ── Alinha espaçador do eixo com a largura da coluna .mn ──────────────
function syncAxisSpacer() {
  const mn = document.querySelector('.mn');
  const sp = document.getElementById('ax-sp');
  if (mn && sp) sp.style.width = mn.offsetWidth + 'px';
}

// ── Escala o chart para caber na área disponível ──────────────────────
function scaleChart() {
  syncAxisSpacer();
  const wrap = document.getElementById('scaler-wrap');
  const scaler = document.getElementById('scaler');
  const chart = document.getElementById('chart');

  // reseta para medir tamanho natural
  scaler.style.transform = 'scale(1)';
  scaler.style.width = '100%';

  const availW = wrap.clientWidth;
  const availH = wrap.clientHeight;
  const natW   = chart.scrollWidth;
  const natH   = chart.scrollHeight;

  const scale = Math.min(availW / natW, availH / natH, 1);

  scaler.style.transform = 'scale(' + scale + ')';
  // ajusta altura do container para o tamanho escalado
  scaler.style.height = (natH * scale) + 'px';
}

// ── Troca de aba ──────────────────────────────────────────────────────
function sw(btn, id) {
  document.querySelectorAll('.period').forEach(el => el.classList.remove('on'));
  document.querySelectorAll('.tb').forEach(el => el.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  btn.classList.add('on');
  // re-escala pois a altura pode mudar entre semana e FDS
  requestAnimationFrame(scaleChart);
}

window.addEventListener('load', scaleChart);
window.addEventListener('resize', scaleChart);
window.addEventListener('orientationchange', () => setTimeout(scaleChart, 150));
</script>
</body>
</html>`;
}
