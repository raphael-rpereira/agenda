import { getPositionStyles, AXIS_START_MINUTES, AXIS_TOTAL_MINUTES } from './utils';

// ── Time Axis ──────────────────────────────────────────────────────────────
function TimeAxis() {
  const hours = [];
  for (let i = 6; i <= 30; i++) {
    const display = i >= 24 ? i - 24 : i;
    hours.push({ i, label: `${String(display).padStart(2, '0')}h` });
  }
  return (
    <div className="relative h-10 border-b border-gray-300 bg-gray-50 flex items-end">
      {hours.map(({ i, label }) => {
        const left = ((i * 60 - AXIS_START_MINUTES) / AXIS_TOTAL_MINUTES) * 100;
        return (
          <div key={i} className="absolute flex flex-col items-center -translate-x-1/2" style={{ left: `${left}%` }}>
            <span className="text-xs font-semibold text-gray-500 mb-1">{label}</span>
            <div className="w-px h-2 bg-gray-400" />
          </div>
        );
      })}
    </div>
  );
}

// ── Grid Lines ─────────────────────────────────────────────────────────────
function GridLines() {
  const hours = [];
  for (let i = 6; i <= 30; i++) hours.push(i);
  return (
    <div className="absolute inset-0 pointer-events-none opacity-30">
      {hours.map(i => {
        const left = ((i * 60 - AXIS_START_MINUTES) / AXIS_TOTAL_MINUTES) * 100;
        return <div key={i} className="absolute h-full w-px bg-gray-300" style={{ left: `${left}%` }} />;
      })}
    </div>
  );
}

// ── Single Time Block ──────────────────────────────────────────────────────
function TimeBlock({ event, editMode, onEdit, onDelete }) {
  const { left, width } = getPositionStyles(event.start, event.end);
  const rawStart = event.start.replace('+1', '');
  const rawEnd = event.end.replace('+1', '').replace('24:00', '00:00');

  return (
    <div
      className={`absolute h-full rounded-md shadow-sm border border-black/10 flex items-center justify-center p-1 overflow-hidden transition-opacity group/block ${event.color} ${editMode ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ left, width }}
      title={editMode ? undefined : `${event.label}: ${rawStart} às ${rawEnd}`}
    >
      <span className="text-[10px] md:text-[11px] font-bold leading-tight text-center whitespace-normal break-words select-none">
        {event.label}
      </span>

      {/* Read-mode hover: show time */}
      {!editMode && (
        <div className="hidden group-hover/block:flex absolute inset-0 bg-black/40 items-center justify-center text-[10px] font-bold text-white backdrop-blur-[1px]">
          {rawStart} – {rawEnd}
        </div>
      )}

      {/* Edit-mode hover: show action buttons */}
      {editMode && (
        <div className="hidden group-hover/block:flex absolute inset-0 bg-black/50 items-center justify-center gap-1 backdrop-blur-[1px]">
          <button
            onClick={e => { e.stopPropagation(); onEdit(); }}
            className="bg-white/90 hover:bg-white text-slate-800 rounded-md px-2 py-1 text-[10px] font-bold shadow transition-all"
            title="Editar bloco"
          >
            ✏️
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="bg-red-500 hover:bg-red-600 text-white rounded-md px-2 py-1 text-[10px] font-bold shadow transition-all"
            title="Excluir bloco"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}

// ── Add Block Button (appears in empty lane space in edit mode) ────────────
function AddBlockBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md px-2 py-0.5 text-xs font-bold border border-blue-300 transition-all z-10 shadow-sm"
      title="Adicionar bloco"
    >
      + bloco
    </button>
  );
}

// ── Modality Row ───────────────────────────────────────────────────────────
function ModalityRow({
  item, mIdx, period, editMode,
  onEditBlock, onDeleteBlock, onAddBlock,
  onAddLane, onDeleteLane,
  onNameChange, onMoveUp, onMoveDown, onDeleteModality,
  isFirst, isLast,
}) {
  return (
    <div className="flex border-b border-gray-100 group hover:bg-slate-50 transition-colors">
      {/* Modality label column */}
      <div className="w-48 flex-shrink-0 border-r border-gray-200 p-3 flex flex-col items-center justify-center gap-1">
        {editMode ? (
          <>
            <input
              className="w-full text-center text-sm font-bold text-slate-800 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={item.modality}
              onChange={e => onNameChange(e.target.value)}
            />
            <div className="flex gap-1 mt-1">
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="text-xs px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Mover para cima"
              >▲</button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="text-xs px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Mover para baixo"
              >▼</button>
              <button
                onClick={onDeleteModality}
                className="text-xs px-1.5 py-0.5 rounded bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                title="Excluir modalidade"
              >🗑</button>
            </div>
          </>
        ) : (
          <span className="font-bold text-slate-800 text-sm text-center">{item.modality}</span>
        )}
      </div>

      {/* Lanes column */}
      <div className="flex-1 relative py-2 px-1">
        <GridLines />
        <div className="flex flex-col gap-1.5 relative z-10">
          {item.lanes.map((lane, lIdx) => (
            <div key={lIdx} className="relative h-11 w-full flex items-center">
              {lane.map((event, bIdx) => (
                <TimeBlock
                  key={bIdx}
                  event={event}
                  editMode={editMode}
                  onEdit={() => onEditBlock(mIdx, lIdx, bIdx, event)}
                  onDelete={() => onDeleteBlock(mIdx, lIdx, bIdx)}
                />
              ))}

              {editMode && (
                <div className="flex items-center gap-1 ml-auto pl-2 shrink-0">
                  <button
                    onClick={() => onAddBlock(mIdx, lIdx)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md px-2 py-0.5 text-xs font-bold border border-blue-300 transition-all shadow-sm whitespace-nowrap"
                    title="Adicionar bloco nessa lane"
                  >
                    + bloco
                  </button>
                  <button
                    onClick={() => onDeleteLane(mIdx, lIdx)}
                    className="bg-red-50 hover:bg-red-100 text-red-500 rounded-md px-1.5 py-0.5 text-xs font-bold border border-red-200 transition-all shadow-sm"
                    title="Excluir lane"
                  >✕</button>
                </div>
              )}
            </div>
          ))}

          {editMode && (
            <button
              onClick={() => onAddLane(mIdx)}
              className="mt-0.5 self-start text-xs font-semibold text-slate-500 hover:text-blue-600 border border-dashed border-gray-300 hover:border-blue-400 rounded-md px-2 py-0.5 transition-all"
            >
              + lane
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Legend Item ────────────────────────────────────────────────────────────
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 text-sm font-medium text-slate-600">
      <div className={`w-4 h-4 rounded-full shadow-inner ${color}`} />
      {label}
    </div>
  );
}

// ── Main ScheduleView ──────────────────────────────────────────────────────
export default function ScheduleView({
  data, period, editMode,
  onEditBlock, onDeleteBlock, onAddBlock,
  onAddLane, onDeleteLane,
  onNameChange, onMoveModality, onDeleteModality, onAddModality,
}) {
  const items = data[period];

  return (
    <>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { color: 'bg-emerald-600', label: 'Eletivo' },
          { color: 'bg-yellow-400', label: 'Internado' },
          { color: 'bg-red-600', label: 'Emergência' },
          { color: 'bg-purple-600', label: 'Anestesia' },
          { color: 'bg-slate-400', label: 'Intervenção' },
          { color: 'bg-slate-800', label: 'Radioterapia' },
          { color: 'bg-amber-700', label: 'Cardíaca' },
          { color: 'bg-yellow-600', label: 'Beira-Leito' },
        ].map(l => <LegendItem key={l.label} {...l} />)}
      </div>

      {/* Gantt Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Table header */}
            <div className="flex bg-gray-50 border-b border-gray-300">
              <div className="w-48 flex-shrink-0 border-r border-gray-300 p-4 flex items-center justify-center font-bold text-slate-600 text-sm uppercase tracking-wider">
                Modalidade
              </div>
              <div className="flex-1 relative">
                <TimeAxis />
              </div>
            </div>

            {/* Rows */}
            <div className="flex flex-col relative pb-4">
              {items.map((item, mIdx) => (
                <ModalityRow
                  key={mIdx}
                  item={item}
                  mIdx={mIdx}
                  period={period}
                  editMode={editMode}
                  onEditBlock={onEditBlock}
                  onDeleteBlock={onDeleteBlock}
                  onAddBlock={onAddBlock}
                  onAddLane={onAddLane}
                  onDeleteLane={onDeleteLane}
                  onNameChange={name => onNameChange(mIdx, name)}
                  onMoveUp={() => onMoveModality(mIdx, -1)}
                  onMoveDown={() => onMoveModality(mIdx, 1)}
                  onDeleteModality={() => onDeleteModality(mIdx)}
                  isFirst={mIdx === 0}
                  isLast={mIdx === items.length - 1}
                />
              ))}

              {/* Add modality */}
              {editMode && (
                <div className="flex justify-center py-4 border-t border-dashed border-gray-300 mt-2">
                  <button
                    onClick={onAddModality}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
                  >
                    <span className="text-lg leading-none">+</span> Adicionar Modalidade
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
