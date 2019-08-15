export default {
  state: {
    IconColor:'#31c27c',
    TxtColor: '#000000',
  },
  mutations:{
    ChangeColor(state, parameter){
      state.IconColor = parameter.iconColor||state.IconColor;
      state.TxtColor = parameter.txtColor||state.TxtColor;
    },
  }

}
