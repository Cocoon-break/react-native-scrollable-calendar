'use strict';

import React    from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions
}               from 'react-native';
import Day      from './Day'
const screenWidth = Dimensions.get('window').width

export default class Month extends React.Component {
    constructor(props) {
        super(props);

        this.weekDaysLocale = props.weekDaysLocale.slice();

        if (props.startFromMonday) {
            this.weekDaysLocale.push(this.weekDaysLocale.shift());
        }
    }

    render() {
        let {days, changeSelection, style, monthsLocale,
            bodyBackColor, bodyTextColor, headerSepColor, width, monthTextColor
            } = this.props;

        var monthHeader = days[15].date.getFullYear() + '年' + monthsLocale[days[15].date.getMonth()] + '月';

        return (
            <View style={{width:screenWidth,alignItems:'center'}}>
            <View style={[style, {width: width, backgroundColor: bodyBackColor}]}>
                <Text style={[styles.monthHeader, {color: monthTextColor || bodyTextColor}]}>
                    {monthHeader}
                </Text>
                <View style={styles.monthDays}>
                    {this.weekDaysLocale.map((dayName, i) => {
                        return (
                            <View key={i}
                                  style={[styles.weekDay, {
									borderColor: headerSepColor,
									width: width / 7,
									height: width / 7
								}]}>
                                <Text style={{color: bodyTextColor}}>{dayName}</Text>
                            </View>
                        );
                    })}
                    {days.map((day, i) => {
                        return (
                            <Day
                                key={i}
                                {...this.props}
                                disabled={day.disabled}
                                status={day.status}
                                date={day.date}
                                onDayPress={changeSelection}
                            />
                        );
                    })}
                </View>
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    monthHeader: {
        marginTop: 15,
        marginBottom: 5,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    monthDays: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    weekDay: {
        //borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
