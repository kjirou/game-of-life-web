export const CLICK_MODES = [
  {
    id: 'blinker',
    label: 'Blinker',
  },
  {
    id: 'clock',
    label: 'Clock',
  },
  {
    id: 'dot',
    label: 'Dot',
  },
];

const INTERVALS = [
  {
    id: 'slow',
    interval: 1000,
    label: 'Slow',
  },
  {
    id: 'fast',
    interval: 500,
    label: 'Fast',
  },
  {
    id: 'veryFast',
    interval: 100,
    label: 'Very fast',
  },
];

const INTERVALS_ORDER = INTERVALS.map(v => v.id);


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
