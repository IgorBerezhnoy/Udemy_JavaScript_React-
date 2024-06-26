// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import {useDispatch, useSelector} from 'react-redux';
import classNames from 'classnames';
import {setActiveFilter} from './filtersSlice';

const HeroesFilters = () => {


  const activeFilter = useSelector(state => state.filters.activeFilter);
  const dispatch = useDispatch();
  const onFilterSelect = (filter) => {
    dispatch(setActiveFilter(filter));
  };
  const btns = {
    all: {ru: 'Все', className: 'btn-outline-dark'},
    fire: {ru: 'Огонь', className: 'btn-danger'},
    water: {ru: 'Вода', className: 'btn-primary'},
    wind: {ru: 'Ветер', className: 'btn-success'},
    earth: {ru: 'Земля', className: 'btn-secondary'},
  };
  const elements = Object.keys(btns).map(key => {
    const {ru, className} = btns[key];
    const btnClass = classNames('btn', className, {'active': activeFilter === key});
    return (
      <button key={key} onClick={() => onFilterSelect(key)} className={btnClass}>{ru}</button>
    );
  });
  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">
          {elements}
        </div>
      </div>
    </div>
  )
    ;
};

export default HeroesFilters;