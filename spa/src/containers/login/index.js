import React  from 'react';
// import PServer from './driver';
import axios from 'axios';


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



export default class PLogin extends React.Component {
	state = {login: '', password: ''};

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
    
    return false;
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
    </div>;
  }
};
