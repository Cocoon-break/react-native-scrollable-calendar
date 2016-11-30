'use strict';

import React, {
    PropTypes
}               from 'react';
import {
    ListView,
    StyleSheet,
    Dimensions,
    View,TouchableOpacity,
    Text,
    ScrollView
}from 'react-native';

import Month    from './Month';
const screenWidth = Dimensions.get('window').width

export default class Calendar extends React.Component {
    static defaultProps = {
        startDate: new Date(),
        monthsCount: 12,
        onSelectionChange: () => {
        },
        monthsLocale: ['1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12'],
        weekDaysLocale: ['日', '一', '二', '三', '四', '五', '六'],
        width: 300,

        bodyBackColor: 'white',
        bodyTextColor: 'black',
        headerSepColor: 'grey',

        monthTextColor: 'black',

        dayCommonBackColor: 'white',
        dayCommonTextColor: 'black',

        dayDisabledBackColor: 'white',
        dayDisabledTextColor: 'grey',

        daySelectedBackColor: '#4169e1',
        daySelectedTextColor: 'white',

        dayInRangeBackColor: '#87cefa',
        dayInRangeTextColor: 'black',

        isFutureDate: false,
        rangeSelect: true
    };

    static propTypes = {
        selectFrom: PropTypes.instanceOf(Date),
        selectTo: PropTypes.instanceOf(Date),

        monthsCount: PropTypes.number,
        startDate: PropTypes.instanceOf(Date),

        monthsLocale: PropTypes.arrayOf(PropTypes.string),
        weekDaysLocale: PropTypes.arrayOf(PropTypes.string),
        startFromMonday: PropTypes.bool,

        onSelectionChange: PropTypes.func,

        width: PropTypes.number,

        bodyBackColor: PropTypes.string,
        bodyTextColor: PropTypes.string,
        headerSepColor: PropTypes.string,

        monthTextColor: PropTypes.string,

        dayCommonBackColor: PropTypes.string,
        dayCommonTextColor: PropTypes.string,

        dayDisabledBackColor: PropTypes.string,
        dayDisabledTextColor: PropTypes.string,

        daySelectedBackColor: PropTypes.string,
        daySelectedTextColor: PropTypes.string,

        dayInRangeBackColor: PropTypes.string,
        dayInRangeTextColor: PropTypes.string,

        isFutureDate: PropTypes.bool,
        rangeSelect: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.changeSelection = this.changeSelection.bind(this);
        this.generateMonths = this.generateMonths.bind(this);
        this.preOrNext = this.preOrNext.bind(this);
        let {selectFrom, selectTo, monthsCount, startDate} = this.props;
        this.selectFrom = selectFrom;
        this.selectTo = selectTo;
        const months = this.generateMonths(monthsCount, startDate);
        this.state = {months: months.reverse(), currentPage: 0}
    }

    generateMonths(count, startDate) {
        var months = [];
        var dateUTC;
        var monthIterator = startDate;
        var {isFutureDate, startFromMonday} = this.props;

        var startUTC = Date.UTC(startDate.getYear(), startDate.getMonth(), startDate.getDate());

        for (var i = 0; i < count; i++) {
            var month = this.getDates(monthIterator, startFromMonday);

            months.push(month.map((day) => {
                dateUTC = Date.UTC(day.getYear(), day.getMonth(), day.getDate());
                return {
                    date: day,
                    status: this.getStatus(day, this.selectFrom, this.selectTo),
                    disabled: day.getMonth() !== monthIterator.getMonth()
                    || ((isFutureDate) ? startUTC > dateUTC : startUTC < dateUTC)
                }
            }));

            if (isFutureDate) {
                monthIterator.setMonth(monthIterator.getMonth() + 1);
            } else {
                monthIterator.setMonth(monthIterator.getMonth() - 1);
            }
        }

        return months;
    }

    getDates(month, startFromMonday) {
        month = new Date(month);
        month.setDate(1);

        var delta = month.getDay();
        if (startFromMonday) {
            delta--;
            if (delta === -1) delta = 6;
        }

        var startDate = new Date(month);
        startDate.setDate(startDate.getDate() - delta);

        month.setMonth(month.getMonth() + 1);
        month.setDate(0);

        delta = 6 - month.getDay();
        if (startFromMonday) {
            delta++;
            if (delta === 7) delta = 0;
        }

        var lastDate = new Date(month);
        lastDate.setDate(lastDate.getDate() + delta);

        var allDates = [];
        while (startDate <= lastDate) {
            allDates.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
        return allDates;
    }

    changeSelection(value) {

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(value, this.prevValue);
            return
        }

        var {selectFrom, selectTo} = this;
        let months = this.state.months
        if (!selectFrom) {
            selectFrom = value;
        } else if (!selectTo) {
            if (value > selectFrom) {
                selectTo = value;
            } else {
                selectFrom = value;
            }
        } else if (selectFrom && selectTo) {
            selectFrom = value;
            selectTo = null;
        }

        months = months.map((month) => {
            return month.map((day) => {
                return {
                    date: day.date,
                    status: this.getStatus(day.date, selectFrom, selectTo),
                    disabled: day.disabled
                }
            })
        });

        if (this.props.rangeSelect) {
            this.selectFrom = selectFrom;
            this.selectTo = selectTo;
        } else {
            this.selectFrom = this.selectTo = selectFrom;
        }
        this.props.onSelectionChange(value, this.prevValue);
        this.prevValue = value;
        this.setState({months: months.reverse()})
    }

    getStatus(date, selectFrom, selectTo) {
        if (selectFrom) {
            if (selectFrom.toDateString() === date.toDateString()) {

                return {status: 'selected', isFrom: true};
            }
        }
        if (selectTo) {
            if (selectTo.toDateString() === date.toDateString()) {
                return {status: 'selected', isFrom: false};
            }
        }
        if (selectFrom && selectTo) {
            if (selectFrom < date && date < selectTo) {
                return {status: 'inRange', isFrom: false};
            }
        }
        return {status: 'common', isFrom: false}
    }

    _changPage(page) {
        const currentPage = page
        this.scrollView.scrollTo({y: 0, x: page * screenWidth, true})
        this.setState({currentPage})
    }

    preOrNext(isPre = false) {
        const currentPage = this.state.currentPage
        let page = isPre ? currentPage - 1 : currentPage + 1
        if (page >= 0 && page <= this.props.monthsCount-1) {
            this._changPage(page)
        }
    }

    render() {
        const {months}=this.state
        return <ScrollView
            onLayout={(e)=>console.log(e.nativeEvent)}
            style={styles.listViewContainer}
            ref={(c)=>this.scrollView=c}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
            horizontal={true}>
            {months.map((month, idx)=> {
                return <Month
                    key={idx}
                    {...this.props}
                    changeSelection={this.changeSelection}
                    days={month}/>
            })}
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    listViewContainer: {
        //backgroundColor: 'white',
        alignSelf: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    month: {}
});