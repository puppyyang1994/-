const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 返回用户名
  avatar: state => state.user.userInfo.staffPhoto, //
  companyId: state => state.user.userInfo.companyId // 返回公司ID

}
export default getters
