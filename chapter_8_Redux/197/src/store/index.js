import {configureStore} from '@reduxjs/toolkit';
import {heroesReducer} from '../components/heroesList/heroesSlice';
import {filtersReducer} from '../components/heroesFilters/filtersSlice';

const stringMiddleware = () => (next) => (action) => {
  if (typeof action === 'string') {
    return next({type: action});
  }
  return next(action);
};


const store = configureStore({
    reducer: {
      heroes: heroesReducer,
      filters: filtersReducer
    },
    middleware:
      (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  },
);

export default store;