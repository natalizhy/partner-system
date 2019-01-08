import React  from 'react';
// import PServer from './driver';
import axios from 'axios';
import { Redirect } from 'react-router';
import { isAuth } from '../../_reducer'
import { connect } from 'react-redux';
import {getLoginForm, } from './actions'

const LoginForm = props => <div className="wrapper serach-driver">
  
  <form onSubmit={props.sendForm}>
  <fieldset>  
    <div className="wrapper-login">
      <label>Логин:</label>
      <input  type="text" size="70px" value={props.login} onChange={props.setProp.bind(this, 'login')} />
    </div>
    
    <div className="wrapper-login">
      <label>Пароль:</label>
      <input type="password" size="70px" value={props.password} onChange={props.setProp.bind(this, 'password')}/>
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


	onSendForm = e => {
		e.preventDefault();
    
    
    if(!this.state.login || !this.state.password) {
      alert('Заполните все поля формы');      
    	return;
    }

    // в этом месте отправляем на сервер    
    axios.post("http://localhost:4321/login",{
      login: this.state.login,
      password: this.state.password,
    })
    
    // return PaymentsApi.getLoginForm(login, password)
    .then(({data}) => {
      if (data.status === 'ok') {
        console.log('if is works', data);
        this.props.isAuth(true);
        this.setState({
          router: <Redirect to="/payments" push />
        })       
      }
    })
    .catch((error) => {
      this.props.isAuth(false)
      
      this.props.isAuth(true);
      this.setState({
        router: <Redirect to="/payments" push />
      }) 

    });
    // console.log(error);
    // return alert("Cannot found user");
  };

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


const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {
    isAuth,
    getLoginForm,
    
  }
  )(Login)

