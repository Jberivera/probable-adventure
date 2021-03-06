import React, { Component } from 'react';
import style from './DatePick.scss';
import classNames from 'classnames/bind';

const css = classNames.bind(style);

import { getNumberOfDays, getMonthStringES, getFirstDayOfWeek } from '../../js/view/datepicker';
import MonthTable from './MonthTable';

class DatePick extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { date } = this.props,
      year = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate() - 1;

    return (
      <div className={ css('date') }>
        <MonthTable
          month={ month }
          year={ year }
          day={ day }
          monthString={ getMonthStringES(date) }
          monthDays={ getNumberOfDays(year, month) }
          firstDayOfWeek={ getFirstDayOfWeek(year, month) } />
      </div>
    );
  }
}

export default DatePick;
