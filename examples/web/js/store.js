var appStore = new SFlux.Store({
  initialState: {
    num: 1
  },
  mutation: function(state, mutation) {
    switch(mutation.type) {
      case appMutationTypes.INCREMENT:
        state.num = state.num + mutation.data;
        return state;
        break;
      case appMutationTypes.DECREMENT:
        state.num = state.num - mutation.data;
        return state;
        break;
    }
  }
});
