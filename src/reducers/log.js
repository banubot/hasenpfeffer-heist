const logReducer = (state = "", action) => {
  switch (action.type) {
    case 'NEWLOG':
      return state + " " + action.payload;
    default:
      return state;
  }
}
export default logReducer;