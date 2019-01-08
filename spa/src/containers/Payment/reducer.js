import {PaymentsApi} from "../../_api";
import {toggleLoading} from '../../_reducer';
import {loadStatements} from '../../containers/Payments/actions';
import {history} from '../../store';

export const PAYMENT_LOAD_DRIVER_PAYMENTS = 'payment/load-driver-payments';

const initialState = {
  driver: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_LOAD_DRIVER_PAYMENTS:

      return {
        ...state,
        driver: {...action.driver},
        payments: [...action.payments],
        report: {...action.report},
        weeklyPayment: {...action.weeklyPayment},
        statement: {...action.statement},
      };

    default:
      return state
  }
}


export const loadDriverPayments = (statementUUID, driverUUID) => (dispatch) => {
  dispatch(toggleLoading(true, 'Driver Payments'));
  return PaymentsApi.getDriverPayments(statementUUID, driverUUID).then(({data}) => {
    if (data.status === 'ok') {
      dispatch({
        type: PAYMENT_LOAD_DRIVER_PAYMENTS,
        driver: {...data.result.driver},
        payments: [...(data.result.payments ? data.result.payments : [])],
        report: {...data.result.report},
        weeklyPayment: {...data.result.weeklyPayment},
        statement: {...data.result.statement},
      });
    }

    dispatch(toggleLoading(false));
  })
};

export const addPayment = (statementUUID, driverUUID, diff, comment, gas, petrol) => (dispatch) => {
  dispatch(toggleLoading(true, 'Adding payment...'));

  return PaymentsApi.addPayment(statementUUID, driverUUID, diff, comment, gas, petrol).then(({data}) => {
    if (data.status === 'ok') {
      loadDriverPayments(statementUUID, driverUUID)(dispatch);
    }

    dispatch(toggleLoading(false));
  })
};

export const getDriver = (id) => (dispatch) => {
  dispatch(toggleLoading(true, 'Поиск водителя...'));

  return PaymentsApi.getDriverByID(id).then(({data}) => {
    if (data.status === 'ok') {
      loadStatements()(dispatch).then(response => {
        if (data.status === 'ok') {
         if(response.length) {
           const driverUUID = data.result.uuid;
           const statementUUID = response[0].uuid;

           history.push(`/credit/${statementUUID}/${driverUUID}`);
         }
        }

        dispatch(toggleLoading(false));
      }).catch(err => dispatch(toggleLoading(false)));
    }
  }).catch(err => {
    dispatch(toggleLoading(false));
    alert("Водитель не найден");
  });
};


// export const getUser = (id) => (dispatch) => {
//   dispatch(toggleLoading(true, 'Авторизация...'));

//   return PaymentsApi.GetUserByLogin(id).then(({data}) => {
//     if (data.status === 'ok') {
//       loadStatements()(dispatch).then(response => {
//         if (data.status === 'ok') {

//            history.push(`/payments`);
//         }

//         dispatch(toggleLoading(false));
//       }).catch(err => dispatch(toggleLoading(false)));
//     }
//   })
// };