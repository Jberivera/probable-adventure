export const ADD_TO_CAR = 'ADD_TO_CAR';
export const addToCar = (item) => (
  {
    type: ADD_TO_CAR,
    item
  }
);

export const REMOVE_FROM_CAR = 'REMOVE_FROM_CAR';
export const removeFromCar = (item) => (
  {
    type: REMOVE_FROM_CAR,
    item
  }
);

// action creator is on inventory-action-creators
export const ADD_NEW_ORDER = 'ADD_NEW_ORDER';

export const FILTER_CHANGE = 'FILTER_CHANGE';
export const filterChange = (filter) => (
  {
    type: FILTER_CHANGE,
    filter
  }
);

export const CHANGE_DATE = 'CHANGE_DATE';
export const changeDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return {
    type: CHANGE_DATE,
    date: date
  };
};
