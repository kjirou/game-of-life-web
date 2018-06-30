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

export const findClickMode = (id) => {
  const found = CLICK_MODES.find(v => v.id === id);
  if (found) {
    return found;
  }
  throw new Error('Can not find any click mode');
};

export const toClickModeChoice = (clickModeMaster) => {
  return {
    label: clickModeMaster.label,
    value: clickModeMaster.id,
  };
};

export const generateClickModeChoices = () => {
  return CLICK_MODES.map(e => toClickModeChoice(e));
};
