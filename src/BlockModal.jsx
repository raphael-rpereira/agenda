import { useState, useEffect } from 'react';
import { COLOR_TYPES, splitTimeStr, buildTimeStr } from './utils';

export default function BlockModal({ modal, onSave, onDelete, onClose }) {
  const isNew = modal.type === 'newBlock';
  const isNewModality = modal.type === 'newModality';

  const [label, setLabel] = useState('');
  const [startHhmm, setStartHhmm] = useState('07:00');
  const [endHhmm, setEndHhmm] = useState('08:00');
  const [endNextDay, setEndNextDay] = useState(false);
  const [color, setColor] = useState(COLOR_TYPES[0].color);

  // Modality-specific
  const [modalityName, setModalityName] = useState('');
  const [modalityPeriod, setModalityPeriod] = useState('both');

  useEffect(() => {
    if (isNewModality) return;
    if (!isNew && modal.block) {
      const b = modal.block;
      setLabel(b.label);
      const { hhmm: sH } = splitTimeStr(b.start);
      const { hhmm: eH, nextDay } = splitTimeStr(b.end);
      setStartHhmm(sH);
      setEndHhmm(eH);
      setEndNextDay(nextDay);
      setColor(b.color);
    }
  }, [modal]);

  function handleSave() {
    if (isNewModality) {
      if (!modalityName.trim()) return;
      onSave({ type: 'newModality', name: modalityName.trim(), period: modalityPeriod });
      return;
    }
    if (!label.trim()) return;
    const block = {
      label: label.trim(),
      start: startHhmm,
      end: buildTimeStr(endHhmm, endNextDay),
      color,
    };
    onSave({ ...modal, block });
  }

  function handleDelete() {
    if (window.confirm(`Excluir o bloco "${modal.block?.label}"?`)) {
      onDelete(modal);
    }
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {isNewModality
              ? 'Nova Modalidade'
              : isNew
              ? 'Adicionar Bloco'
              : 'Editar Bloco'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold leading-none">×</button>
        </div>

        {isNewModality ? (
          <>
            <div>
              <label className={labelCls}>Nome da Modalidade</label>
              <input
                className={inputCls}
                value={modalityName}
                onChange={e => setModalityName(e.target.value)}
                placeholder="Ex: RM 3T"
                autoFocus
              />
            </div>
            <div>
              <label className={labelCls}>Adicionar em qual período?</label>
              <div className="flex gap-2">
                {[
                  { value: 'weekday', label: 'Seg–Sex' },
                  { value: 'weekend', label: 'Fim de semana' },
                  { value: 'both', label: 'Ambos' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setModalityPeriod(opt.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      modalityPeriod === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={labelCls}>Label</label>
              <input
                className={inputCls}
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="Ex: ELETIVO"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelCls}>Início</label>
                <input
                  type="time"
                  className={inputCls}
                  value={startHhmm}
                  onChange={e => setStartHhmm(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className={labelCls}>Fim</label>
                <input
                  type="time"
                  className={inputCls}
                  value={endHhmm}
                  onChange={e => setEndHhmm(e.target.value)}
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={endNextDay}
                    onChange={e => setEndNextDay(e.target.checked)}
                    className="accent-blue-600"
                  />
                  <span className="text-xs text-slate-500">Termina no dia seguinte (+1)</span>
                </label>
              </div>
            </div>

            <div>
              <label className={labelCls}>Tipo / Cor</label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_TYPES.map(ct => (
                  <button
                    key={ct.color}
                    onClick={() => setColor(ct.color)}
                    className={`${ct.color} rounded-lg py-2 px-1 text-[11px] font-bold text-center border-2 transition-all ${
                      color === ct.color ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent'
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          {!isNew && !isNewModality && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors border border-red-200"
            >
              Excluir
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
