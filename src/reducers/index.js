import {SET_USER_EMAIL} from "../constants/action-types"

const initialState = {
  userEmail: ""
};

function rootReducer(state = initialState, action)
{
  if (action.type === SET_USER_EMAIL)
  {
    return Object.assign({}, state, {
      userEmail: action.payload
    })
  }
  return state;
};

export default rootReducer;