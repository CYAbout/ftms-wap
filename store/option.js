/*
* 全局设置数据状态
*/

export const state = () => {
  return {
    // ua
    userAgent: '',

    // 是否为移动端
    mobileLayout: false,

    // serverData
    serverData: {}
  }
}

export const getters = {
  mobileLayout: state => state.mobileLayout,
  serverData: state => state.serverData
}

export const mutations = {
  // 设置UA
  SET_USER_AGENT (state, action) {
    state.userAgent = action
  },

  // 设置是否移动端状态
  SET_MOBILE_LAYOUT (state, action) {
    state.mobileLayout = action
  },

  SET_SERVER_DATA (state, action) {
    state.serverData = action
  }
}
