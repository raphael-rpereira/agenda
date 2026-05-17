export const AXIS_START_MINUTES = 6 * 60;
export const AXIS_TOTAL_MINUTES = 24 * 60;

export const COLOR_TYPES = [
  { label: 'Eletivo',      color: 'bg-emerald-600 text-white' },
  { label: 'Internado',    color: 'bg-yellow-400 text-slate-900' },
  { label: 'Emergência',   color: 'bg-red-600 text-white' },
  { label: 'Anestesia',    color: 'bg-purple-600 text-white' },
  { label: 'Intervenção',  color: 'bg-slate-400 text-white' },
  { label: 'Radioterapia', color: 'bg-slate-800 text-white' },
  { label: 'Cardíaca',     color: 'bg-amber-700 text-white' },
  { label: 'Beira-Leito',  color: 'bg-yellow-600 text-white' },
];

export function parseTimeToMinutes(timeStr) {
  let addDay = false;
  let time = timeStr;
  if (timeStr.includes('+1') || timeStr === '24:00') {
    addDay = true;
    time = timeStr.replace('+1', '').replace('24:00', '00:00');
  }
  const [h, m] = time.split(':').map(Number);
  let total = h * 60 + (m || 0);
  if (addDay) total += 24 * 60;
  return total;
}

export function getPositionStyles(start, end) {
  const startMin = parseTimeToMinutes(start) - AXIS_START_MINUTES;
  let endMin = parseTimeToMinutes(end) - AXIS_START_MINUTES;
  if (endMin > AXIS_TOTAL_MINUTES) endMin = AXIS_TOTAL_MINUTES;
  const leftPercent = (startMin / AXIS_TOTAL_MINUTES) * 100;
  const widthPercent = ((endMin - startMin) / AXIS_TOTAL_MINUTES) * 100;
  return { left: `${leftPercent}%`, width: `${widthPercent}%` };
}

// Parse "HH:MM" + nextDay flag → storage string ("HH:MM" or "HH:MM+1")
export function buildTimeStr(hhmm, nextDay) {
  if (!hhmm) return '00:00';
  return nextDay ? `${hhmm}+1` : hhmm;
}

// Storage string → { hhmm, nextDay }
export function splitTimeStr(timeStr) {
  const nextDay = timeStr.includes('+1') || timeStr === '24:00';
  const hhmm = timeStr.replace('+1', '').replace('24:00', '00:00');
  return { hhmm, nextDay };
}
