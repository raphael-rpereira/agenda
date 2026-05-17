import { useState, useEffect } from 'react';
import { scheduleData as defaultData } from './scheduleData';
import ScheduleView from './ScheduleView';
import BlockModal from './BlockModal';
import Login from './Login';

const STORAGE_KEY = 'agendaData';
const AUTH_KEY = 'agendaAuth';

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function App() {
  const [auth, setAuth] = useState(() => localStorage.getItem(AUTH_KEY) === 'true');
  const [data, setData] = useState(loadData);
  const [period, setPeriod] = useState('weekday');
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function handleLogin() {
    localStorage.setItem(AUTH_KEY, 'true');
    setAuth(true);
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    setAuth(false);
    setEditMode(false);
  }

  if (!auth) return <Login onLogin={handleLogin} />;

  // ── Mutators ──────────────────────────────────────────────────────────────

  function withPeriod(cb) {
    setData(prev => {
      const next = deepClone(prev);
      cb(next[period]);
      return next;
    });
  }

  function withBothPeriods(cb) {
    setData(prev => {
      const next = deepClone(prev);
      cb(next);
      return next;
    });
  }

  function handleEditBlock(mIdx, lIdx, bIdx, block) {
    setModal({ type: 'editBlock', period, mIdx, lIdx, bIdx, block });
  }

  function handleDeleteBlock(mIdx, lIdx, bIdx) {
    if (!window.confirm('Excluir este bloco?')) return;
    withPeriod(items => {
      items[mIdx].lanes[lIdx].splice(bIdx, 1);
    });
  }

  function handleAddBlock(mIdx, lIdx) {
    setModal({ type: 'newBlock', period, mIdx, lIdx });
  }

  function handleAddLane(mIdx) {
    withPeriod(items => {
      items[mIdx].lanes.push([]);
    });
  }

  function handleDeleteLane(mIdx, lIdx) {
    const lane = data[period][mIdx].lanes[lIdx];
    if (lane.length > 0 && !window.confirm('Excluir lane com blocos?')) return;
    withPeriod(items => {
      items[mIdx].lanes.splice(lIdx, 1);
      if (items[mIdx].lanes.length === 0) items[mIdx].lanes.push([]);
    });
  }

  function handleNameChange(mIdx, name) {
    withPeriod(items => {
      items[mIdx].modality = name;
    });
  }

  function handleMoveModality(mIdx, dir) {
    const newIdx = mIdx + dir;
    withPeriod(items => {
      if (newIdx < 0 || newIdx >= items.length) return;
      [items[mIdx], items[newIdx]] = [items[newIdx], items[mIdx]];
    });
  }

  function handleDeleteModality(mIdx) {
    if (!window.confirm(`Excluir a modalidade "${data[period][mIdx].modality}"?`)) return;
    withPeriod(items => {
      items.splice(mIdx, 1);
    });
  }

  function handleAddModality() {
    setModal({ type: 'newModality' });
  }

  // ── Modal Save / Delete ───────────────────────────────────────────────────

  function handleModalSave(payload) {
    if (payload.type === 'newModality') {
      const newMod = { modality: payload.name, lanes: [[]] };
      withBothPeriods(d => {
        if (payload.period === 'weekday' || payload.period === 'both') d.weekday.push(deepClone(newMod));
        if (payload.period === 'weekend' || payload.period === 'both') d.weekend.push(deepClone(newMod));
      });
      setModal(null);
      return;
    }

    const { mIdx, lIdx, bIdx, block, type: modalType } = payload;
    setData(prev => {
      const next = deepClone(prev);
      const lane = next[payload.period][mIdx].lanes[lIdx];
      if (modalType === 'editBlock') {
        lane[bIdx] = block;
      } else {
        lane.push(block);
      }
      return next;
    });
    setModal(null);
  }

  function handleModalDelete(payload) {
    setData(prev => {
      const next = deepClone(prev);
      next[payload.period][payload.mIdx].lanes[payload.lIdx].splice(payload.bIdx, 1);
      return next;
    });
    setModal(null);
  }

  function handleReset() {
    if (!window.confirm('Resetar para os dados originais? Todas as edições serão perdidas.')) return;
    localStorage.removeItem(STORAGE_KEY);
    setData(deepClone(defaultData));
    setEditMode(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans flex flex-col">
      {/* Header */}
      <header className="mb-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agendas de Radiologia</h1>
          <p className="text-slate-500 text-sm mt-1">Distribuição de modalidades e exames de imagem</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setPeriod('weekday')}
              className={`px-5 py-2 text-sm font-semibold rounded-md transition-all ${
                period === 'weekday' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Segunda à Sexta
            </button>
            <button
              onClick={() => setPeriod('weekend')}
              className={`px-5 py-2 text-sm font-semibold rounded-md transition-all ${
                period === 'weekend' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Finais de Semana
            </button>
          </div>

          {/* Edit toggle */}
          <button
            onClick={() => setEditMode(v => !v)}
            className={`px-5 py-2 rounded-lg font-semibold text-sm shadow-sm border transition-all ${
              editMode
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-gray-300'
            }`}
          >
            {editMode ? '✓ Concluir Edição' : '✏️ Editar Agenda'}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg font-semibold text-sm text-slate-500 hover:text-red-600 border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all"
            title="Restaurar dados originais"
          >
            ↺ Resetar
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-semibold text-sm text-slate-500 hover:text-slate-800 border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition-all"
            title="Sair"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Edit mode banner */}
      {editMode && (
        <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl px-5 py-3 text-amber-800 text-sm font-medium shadow-sm">
          <span className="text-base">✏️</span>
          <span>
            Modo de edição ativo — passe o mouse sobre um bloco para editar ou excluir. Use os botões nas linhas para adicionar blocos e lanes.
          </span>
        </div>
      )}

      {/* Schedule visualization */}
      <ScheduleView
        data={data}
        period={period}
        editMode={editMode}
        onEditBlock={handleEditBlock}
        onDeleteBlock={handleDeleteBlock}
        onAddBlock={handleAddBlock}
        onAddLane={handleAddLane}
        onDeleteLane={handleDeleteLane}
        onNameChange={handleNameChange}
        onMoveModality={handleMoveModality}
        onDeleteModality={handleDeleteModality}
        onAddModality={handleAddModality}
      />

      {/* Modal */}
      {modal && (
        <BlockModal
          modal={modal}
          onSave={handleModalSave}
          onDelete={handleModalDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
