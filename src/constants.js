export const CLICK_MODES = [
  {
    id: 'dot',
    label: 'Dot',
  },
  {
    id: 'blinker',
    label: 'Blinker',
  },
  {
    id: 'clock',
    label: 'Clock',
  },
  {
    id: 'glider',
    label: 'Glider',
  },
  {
    id: 'pulsar',
    label: 'Pulsar',
  },
  {
    id: 'spaceship',
    label: 'Spaceship',
  },
  {
    id: 'octagon2',
    label: 'Octagon 2',
  },
];

const INTERVALS = [
  {
    id: 'verySlow',
    interval: 1000,
    label: 'Very slow',
  },
  {
    id: 'slow',
    interval: 500,
    label: 'Slow',
  },
  {
    id: 'fast',
    interval: 200,
    label: 'Fast',
  },
  {
    id: 'veryFast',
    interval: 50,
    label: 'Very fast',
  },
];

const INTERVALS_ORDER = INTERVALS.map(v => v.id);

// Source) http://conwaylife.com/wiki/Oscillator
// It does not name "OSCILLATORS" because "glider" and "spaceship" are not included in it.
const SAMPLE_LIFE_PATTERNS = [
  {
    id: 'blinker',
    dots: [
      [1, 1, 1],
    ],
  },
  {
    id: 'clock',
    dots: [
      [0, 1, 0, 0],
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [0, 0, 1, 0],
    ],
  },
  {
    id: 'glider',
    dots: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    id: 'octagon2',
    dots: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
  },
  {
    id: 'pulsar',
    dots: [
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    ],
  },
  {
    id: 'spaceship',
    dots: [
      [0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
  },
];


export const generateFinder = (list, searchedKey) => {
  return (searchValue) => {
    const found = list.find(v => v[searchedKey] === searchValue);
    if (found) {
      return found;
    }
    throw new Error('Can not find any element');
  };
};

export const findClickMode = generateFinder(CLICK_MODES, 'id');

export const toClickModeChoice = (clickModeMaster) => {
  return {
    label: clickModeMaster.label,
    value: clickModeMaster.id,
  };
};

export const generateClickModeChoices = () => {
  return CLICK_MODES.map(e => toClickModeChoice(e));
};

export const findInterval = generateFinder(INTERVALS, 'id');

export const getNextIntervalId = (baseId) => {
  const currentIndex = INTERVALS_ORDER.indexOf(baseId);
  const nextIndex = (currentIndex + 1) % INTERVALS_ORDER.length;
  return INTERVALS_ORDER[nextIndex];
};

export const findSampleLifePattern = generateFinder(SAMPLE_LIFE_PATTERNS, 'id');
