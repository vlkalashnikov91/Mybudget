import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Button, Card, CardItem, Body, DatePicker } from 'native-base'
import moment from 'moment'

import { styles as main } from '../Style'

export default class PeriodPicker extends Component {
    constructor(props) {
        super(props);

        let { dateFrom, dateTo, visible } = props
        dateFrom = dateFrom || new Date()
        dateTo = dateTo || new Date()

        this.state = {
            dateFrom,
            dateTo,
            visible: visible || false
        }
    }

    show = async ({dateTo, dateFrom}) => {
        dateFrom = dateFrom || new Date()
        dateTo = dateTo || new Date()

        let promise = new Promise((resolve) => {
            this.confirm = (dateTo, dateFrom) => {
                resolve({ dateTo, dateFrom });
            }

            this.setState({
                visible: true,
                dateFrom,
                dateTo,
            })
        })
        return promise;
    }

    dismiss = () => {
        this.setState({ visible: false })
    }


    onConfirmPress = () => {
        const confirm = this.confirm;
        const { dateTo, dateFrom } = this.state;
        confirm && confirm(dateTo, dateFrom);
        this.dismiss();
    }

    render() {
        const { dateTo, dateFrom, visible } = this.state

        if (!visible) return null;
        return (
            <TouchableOpacity style={styles.modal} onPress={this.dismiss}>
              <View style={styles.modalWindow}>
                <Card transparent>
                  <CardItem>
                    <Body style={[main.fD_R, main.jC_C, {justifyContent:'space-evenly'}]}>
                      <DatePicker
                        formatChosenDate={date => { return moment(date).format('DD.MM.YYYY') }}
                        defaultDate={dateFrom}
                        minimumDate={new Date(2016, 1, 1)}
                        maximumDate={new Date(2040, 12, 31)}
                        locale="ru"
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode="calendar"
                        placeHolderText={(dateFrom) ? moment(dateFrom).format('DD.MM.YYYY') : "От"}
                        placeHolderTextStyle={styles.textStyle}
                        textStyle={styles.textStyle}
                        onDateChange={(value) => this.setState({ dateFrom: value })}
                        disabled={false}
                      >
                        <Text>moment(dateFrom).format('DD.MM.YYYY')</Text>
                      </DatePicker>

                      <Text style={[styles.textStyle, main.mt_10]}> - </Text>

                      <DatePicker
                        formatChosenDate={date => { return moment(date).format('DD.MM.YYYY') }}
                        defaultDate={dateTo}
                        minimumDate={new Date(2016, 1, 1)}
                        maximumDate={new Date(2040, 12, 31)}
                        locale="ru"
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode="calendar"
                        placeHolderText={(dateTo) ? moment(dateTo).format('DD.MM.YYYY') : "До"}
                        placeHolderTextStyle={styles.textStyle}
                        textStyle={styles.textStyle}
                        onDateChange={(value) => this.setState({ dateTo: value })}
                        disabled={false}
                      >
                        <Text>moment(dateTo).format('DD.MM.YYYY')</Text>
                      </DatePicker>

                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Button block style={main.bgIvan} onPress={this.onConfirmPress}>
                        <Text>Выбрать</Text>
                      </Button>
                    </Body>
                </CardItem>
              </Card>
            </View>
          </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height:'100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalWindow: {
        ...main.bgWhite,
        marginHorizontal: 5,
        marginBottom: 5,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    textStyle: {
      ...main.clGrey,
      ...main.txtAl_c,
      fontSize:20,
    },
  })
  
  