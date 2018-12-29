import {SET_USER_EMAIL} from "../constants/action-types"


export function setUserEmail(payload)
{
  return {
    type: SET_USER_EMAIL,
    payload
  }
}