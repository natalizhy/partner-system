import React  from 'react';
// import PServer from './driver';
import { Redirect } from 'react-router';
import { isAuth } from '../../_reducer'
import { connect } from 'react-redux';
import {auth} from '../Payment/reducer'

const LoginForm = props => <div className="wrapper serach-driver">
  
  <form onSubmit={props.sendForm}>
  <fieldset className="wrapper-login">  
    <div className="wrapper-login">
      <label>Логин:</label>
      <input  type="text" size="70px" value={props.login} onChange={props.setProp.bind(this, 'login')} />
    </div>
    
    <div className="wrapper-login">
      <label>Пароль:</label>
      <input type="password" size="70px" value={props.password} onChange={props.setProp.bind(this, 'password')}/>
    </div>     

    <div>
      <input type="checkbox" name="remember"/>Запомнить меня
    </div>
    </fieldset>
    <div>
      <input type="submit" size="70px" value="Войти" />
    </div>
    
  </form>
   
</div>



class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {login: '123', password: '123', isLoading: false, loadingMessage: '', router: null};
  }

  setlogin = e => this.setState({login: e.target.value});

	onSendForm = e => {
	  e.preventDefault();

    if(!this.state.login || !this.state.password) {
      alert('Заполните все поля формы');      
    	return;
    }

    // в этом месте отправляем на сервер    
    this.props.auth(this.state);
    //this.props.getUser(this.state.login);

    return false;
  };

  // console.log(error);
  // return alert("Cannot found user");

  onSetProp = (prop, e) => {
  	const value = e.target.value;
    this.setState({[prop]: value});
  };
  
  render() {
    return <div className="wrapper serach-driver">
      <h1 className="wrapper">Войти в UberTrip</h1>
      <LoginForm 
        login={this.state.login} 
        password={this.state.password} 
        sendForm={this.onSendForm}
        setProp={this.onSetProp}
      />
      {this.state.router}
    </div>;
  }
};


export default connect(
  null,
  {
    isAuth,
    auth
  }
  )(Login)

