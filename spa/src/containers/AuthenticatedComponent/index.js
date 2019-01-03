import React  from 'react';
import { connect } from 'react-redux';


export default function requireAuthentication(Component) {

  class AuthenticatedComponent extends Component {
    render() {
      console.log ("props", this.props.isAuth)
      return (
        <div>
          {this.props.isAuth
            ? <Component {...this.props} />
            : <h1>error1</h1>
          }
        </div>
      )
    }
  }

  function mapStateToProps(state) {
    return {
      isAuth: state.global.isAuth,
    }
  }

  return connect(mapStateToProps)(AuthenticatedComponent)
}