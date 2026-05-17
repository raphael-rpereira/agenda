export const scheduleData = {
  weekday: [
    {
      modality: 'RM 1.5T',
      lanes: [
        [
          { label: 'ELETIVO', start: '06:00', end: '20:00', color: 'bg-emerald-600 text-white' },
          { label: 'INTERNADO', start: '20:00', end: '24:00', color: 'bg-yellow-400 text-slate-900' },
        ],
        [
          { label: 'ANESTESIA', start: '14:00', end: '16:00', color: 'bg-purple-600 text-white' },
        ],
        [
          { label: 'CARDÍACA Stress (Qua)', start: '13:00', end: '15:00', color: 'bg-amber-700 text-white' },
        ],
      ],
    },
    {
      modality: 'TC 160 CANAIS',
      lanes: [
        [
          { label: 'RADIOTERAPIA', start: '07:00', end: '09:00', color: 'bg-slate-800 text-white' },
          { label: 'ELETIVO', start: '09:00', end: '14:00', color: 'bg-emerald-600 text-white' },
          { label: 'INTERVENÇÃO', start: '14:00', end: '16:00', color: 'bg-slate-400 text-white' },
          { label: 'INTERNADO', start: '16:00', end: '22:00', color: 'bg-yellow-400 text-slate-900' },
          { label: 'EMERGÊNCIA', start: '22:00', end: '07:00+1', color: 'bg-red-600 text-white' },
        ],
      ],
    },
    {
      modality: 'TC 16 CANAIS',
      lanes: [
        [
          { label: 'EMERGÊNCIA (INTERNADO)', start: '07:00', end: '22:00', color: 'bg-red-600 text-white' },
        ],
      ],
    },
    {
      modality: 'USG ELET 1',
      lanes: [
        [
          { label: 'ELETIVO (Seg-Qui)', start: '07:30', end: '11:30', color: 'bg-emerald-600 text-white' },
          { label: 'ELETIVO (Qui e Sex)', start: '14:40', end: '17:30', color: 'bg-emerald-600 text-white' },
        ],
      ],
    },
    {
      modality: 'USG ELET 2',
      lanes: [
        [
          { label: 'ELETIVO (Seg-Qui)', start: '07:30', end: '11:30', color: 'bg-emerald-600 text-white' },
        ],
      ],
    },
    {
      modality: 'USG EMERG/INT',
      lanes: [
        [
          { label: 'EMERGÊNCIA (INTERNADO)', start: '07:00', end: '07:00+1', color: 'bg-red-600 text-white' },
        ],
      ],
    },
    {
      modality: 'USG INT (Beira-Leito)',
      lanes: [
        [
          { label: 'Beira-Leito', start: '14:00', end: '16:00', color: 'bg-yellow-600 text-white' },
          { label: 'Beira-Leito (Vasc.)', start: '17:00', end: '20:00', color: 'bg-yellow-600 text-white' },
        ],
      ],
    },
  ],
  weekend: [
    {
      modality: 'RM 1.5T',
      lanes: [
        [
          { label: 'ELETIVO (SÁBADOS)', start: '07:00', end: '19:00', color: 'bg-emerald-600 text-white' },
        ],
        [
          { label: 'INTERNADO (encaixe)', start: '07:00', end: '20:00', color: 'bg-yellow-400 text-slate-900' },
        ],
        [
          { label: 'ELETIVO / INT (DOMINGOS)', start: '07:00', end: '13:00', color: 'bg-emerald-600 text-white' },
        ],
      ],
    },
    {
      modality: 'TC 160 CANAIS',
      lanes: [
        [
          { label: 'ELETIVO', start: '07:00', end: '13:00', color: 'bg-emerald-600 text-white' },
          { label: 'EMERGÊNCIA (INTERNADO)', start: '13:00', end: '07:00+1', color: 'bg-red-600 text-white' },
        ],
      ],
    },
    {
      modality: 'TC 16 CANAIS',
      lanes: [
        [
          { label: 'EMERGÊNCIA (INTERNADO)', start: '07:00', end: '13:00', color: 'bg-red-600 text-white' },
        ],
      ],
    },
    {
      modality: 'USG ELET 1',
      lanes: [
        [
          { label: 'ELETIVO (Eventual)', start: '07:30', end: '11:30', color: 'bg-emerald-600 text-white' },
        ],
      ],
    },
    {
      modality: 'USG EMERG/INT',
      lanes: [
        [
          { label: 'EMERGÊNCIA (INTERNADO)', start: '07:00', end: '07:00+1', color: 'bg-red-600 text-white' },
        ],
      ],
    },
  ],
};
