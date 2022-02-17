const Reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_START":
        return {
          authToken: null,
          user: null,
          isFetching: true,
          error: false,
        };
      case "LOGIN_SUCCESS":
        const { authToken, ...others } = action.payload;
        return {
          authToken,
          user: others,
          isFetching: false,
          error: false,
        };
      case "LOGIN_FAILURE":
        return {
          authToken: null,
          user: null,
          isFetching: false,
          error: true,
        };
      case "LOGOUT":
        return {
          authToken: null,
          user: null,
          isFetching: false,
          error: false,
        };
      case "UPDATE_START":
        return {
          ...state,
          isFetching: true,
        };
      case "UPDATE_SUCCESS":
        return {
          authToken: state.authToken,
          user: action.payload,
          isFetching: false,
          error: false,
        };
      case "UPDATE_FAILURE":
        return {
          authToken: state.authToken,
          user: state.user,
          isFetching: false,
          error: true,
        };
      default:
        return state;
    }
  };
  
  export default Reducer;