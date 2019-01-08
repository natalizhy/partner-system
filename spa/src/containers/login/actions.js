import {PaymentsApi} from "../../_api";
import {toggleLoading} from '../../_reducer';
// import {history} from '../../store';
// import {loadStatements} from '../../containers/Payments/actions';


export const getLoginForm = (login) => (dispatch) => {
dispatch(toggleLoading(true, 'Авторизация...'));

// export const getLoginForm = (login, password) => (dispatch) => {
//     dispatch(toggleLoading(true, 'Авторизация...'));
  
    return PaymentsApi.GetUserByLogin(login).then(({data}) => {
//       if (data.status === 'ok') {
//         loadStatements()(dispatch).then(response => {
//           if (data.status === 'ok') {
  
//              history.push(`/payments`);
//           }
  
//           dispatch(toggleLoading(false));
//         }).catch(err => dispatch(toggleLoading(false)));
//       }
    })
  };