/**
 * 首页信息
 * @returns {{advertisementList: Array}}
 */
export const state = () => {
  return {
    swipeList: [],
    newCarList: [],
    activityList: []
  }
}

export const getters = {
  swipeList: state => state.swipeList,
  newCarList: state => state.newCarList,
  activityList: state => state.newCarList
}

export const mutations = {
  ADVERTISEMENT_GET_DATA (state, action) {
    state.swipeList = action.swipeList
    state.newCarList = action.newCarList
    state.activityList = action.activityList
  }
}
