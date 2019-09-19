import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, H3, Picker, Grid, Form, View, Header, Left, Title } from 'native-base'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { TemplatesActions } from '../../actions/TemplatesActions'
import { SummMask, ClearSpace, onlyNumbers } from '../../utils/utils'
import { INCOME, EXPENSE, headerText } from '../../constants/Payment'

class AddMonthPay extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      Id: -1, 
      Name: '',
      CategoryId: (this.props.navigation.getParam('type', INCOME) === INCOME) ? 1 : 2,
      Amount: '',
      Day: '',
      IsSpending: (this.props.navigation.getParam('type', INCOME) === INCOME) ? false : true,
      Loading: false,
      errAmount: false
    } 

    this._checkParams = this._checkParams.bind(this)
    this._addTemplate = this._addTemplate.bind(this)
    this._getCategoryList = this._getCategoryList.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ Loading: false })

    if(nextProps.templates.Error.length === 0) {
      ToastTr.Success('Платеж создан')
    }
    this.props.navigation.goBack()
  }

  _getCategoryList() {
    const type = this.props.navigation.getParam('type', INCOME) /* income - в случае если тип будет не определен */
    const income = this.props.categories.Income
    const expense = this.props.categories.Expense

    if (type === INCOME) {
        return income
    } else if (type === EXPENSE) {
        return expense
    }
  }

  _changeCat = value => {
    this.setState({ CategoryId: value })
  }

  _changeName = value => {
    this.setState({ Name: value })
  }

  _changeAmount = value => {
    var val = ClearSpace(value)

    if (val.length === 0) {
      this.setState({ Amount: '' })
    } else {
      if (onlyNumbers(val)) {
        this.setState({ Amount: String(Number(val)) })
      }
    }
  }

  _changeDay = value => {
    if (value.length === 0) {
      this.setState({ Day: '' })
    } else {
      if (onlyNumbers(value)) {
        this.setState({ Day: String(Number(value)) })
      }
    }
  }
  
  _checkParams() {
    st = this.state

    if ((st.Amount.length === 0) || (Number(st.Amount) < 0)) {
      this.setState({ errAmount: true })
      return false
    }

    if ((st.Day.length === 0) || (Number(st.Day) < 0) || (Number(st.Day) < 1) || (Number(st.Day) > 31)) {
      this.setState({ errDay: true })
      return false
    }

    return true
  }

  _addTemplate() {
    st = this.state

    if (this._checkParams()) {
      this.setState({ Loading: true })
      this.props.addMonthPay(st.Name, Number(st.Amount), Number(st.Day), st.CategoryId, st.IsSpending, this.props.user.UserId)
    }
  }

  render() {
    const { user, navigation } = this.props
    const { Name, Amount, errAmount, CategoryId, Day, errDay, Loading } = this.state
    var type = this.props.navigation.getParam('type', INCOME) /* income - в случае если тип будет не определен */

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={_=> navigation.goBack()}>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title>{headerText(type)}</Title>
          </Body>
        </Header>

        <Content padder>
          <Form style={{alignSelf: 'stretch'}}>

            <Item floatingLabel style={main.mt_0}>
              <Label>Наименование</Label>
              <Input onChangeText={this._changeName} value={Name} style={main.mt_5}/>
            </Item>

            <Grid style={main.width_90prc}>
              <Item floatingLabel style={[{width:'80%'}, main.mt_0]} error={errAmount}>
                <Label>Сумма</Label>
                <Input onChangeText={this._changeAmount} value={SummMask(Amount)} keyboardType="number-pad" style={main.mt_5} maxLength={10} />
              </Item>
              <H3 style={styles.currencyIcon}>{user.DefCurrency}</H3>
            </Grid>

            <Grid style={[main.fD_R, main.aI_C, main.mt_20, {paddingLeft:15}]}>
              <Item picker>
                <Picker mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={CategoryId}
                  onValueChange={this._changeCat}
                >
                {
                  this._getCategoryList().map(value => <Picker.Item label={value.Name} value={value.Id} key={value.Id} /> )
                }
                </Picker>
              </Item>
            </Grid>

            <Item floatingLabel style={main.mb_20} error={errDay}>
              <Label>День платежа</Label>
              <Input onChangeText={this._changeDay} value={Day} keyboardType="number-pad" style={main.mt_5} />
            </Item>
          </Form>

          <Card transparent>
            <CardItem>
              <Body>
                <Button style={main.bgGreen} block onPress={this._addTemplate}>
                  {(Loading)
                  ? <Text>Загрузка...</Text>
                  : <Text>Создать</Text>
                  }
                </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>

        <ModalLoading isActive={Loading} color={ivanColor} />
      </Container>
    )
  }
}

    
const styles = StyleSheet.create({
  currencyIcon: {
    position:'absolute',
    right:0,
    bottom:5
  }
})

const mapStateToProps = state => {
  return {
    user: state.User,
    categories: state.Categories,
    templates: state.Templates
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addMonthPay: (Name, Amount, Day, CategoryId, IsSpending, UserId) => {
      dispatch(TemplatesActions.Add(Name, Amount, Day, CategoryId, IsSpending, UserId))
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddMonthPay)
