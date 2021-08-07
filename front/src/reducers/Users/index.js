import { SET_USER_PROFILE } from "../../actions/Users";

const INIT_STATE = {
  userProfile: {},
};

export const userReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.userObj,
      };
    default:
      return state;
  }
};
