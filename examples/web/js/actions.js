// 加一
var incrementAction = SFlux.createAction(function(params, obj) {
  obj.dispatch({
    type: appMutationTypes.INCREMENT,
    data: 1
  });
});

// 减一
var decrementAction = SFlux.createAction(function(params, obj) {
  obj.dispatch({
    type: appMutationTypes.DECREMENT,
    data: 1
  });
});
