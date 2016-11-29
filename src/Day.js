'use strict';

import React    from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text
}               from 'react-native';

export default class Day extends React.Component {
    render() {
        let {date, status, disabled, onDayPress, width} = this.props;
        let onPress, textColor, backColor;

        if (disabled) {
            status = {status: 'disabled', isFrom: false};
            onPress = null;
        } else {
            onPress = () => {
                onDayPress(date);
            }
        }

        let style = {}

        switch (status.status) {
            case 'disabled':
                backColor = this.props.dayDisabledBackColor;
                textColor = this.props.dayDisabledTextColor;
                break;
            case 'common':
                backColor = this.props.dayCommonBackColor;
                textColor = this.props.dayCommonTextColor;
                break;

            case 'selected':
                style = status.isFrom ? this.props.startStyle : this.props.endStyle
                backColor = this.props.daySelectedBackColor;
                textColor = this.props.daySelectedTextColor;
                break;

            case 'inRange':
                backColor = this.props.dayInRangeBackColor;
                textColor = this.props.dayInRangeTextColor;
                break;
        }

        return (
            <TouchableOpacity
                activeOpacity={disabled ? 1 : 0.5}
                style={[styles.common,style, {backgroundColor: backColor, width: width / 7, height: width / 7}]}
                onPress={onPress}>
                <Text style={{color: textColor}}>{date.getDate()}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    common: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
});