export const add = pts => {
  return {
    type: 'ADD',
    payload: pts
  };
};

export const reduce = pts => {
  return {
    type: 'REDUCE',
    payload: pts
  };
};

export const newlog = evt => {
  return {
    type: 'NEWLOG',
    payload: evt
  };
};
