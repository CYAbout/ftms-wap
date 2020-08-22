/**
 * goods 商品首页
 * @returns {{goods: {detailsLoad: number, presellLoad: number}}}
 */
export const state = () => {
  return {
    detailsLoad: 0,
    presellLoad: 0
  }
}

// self.$store.getters.user
export const getters = {
  goods: state => state.goods
}

export const mutations = {
  DETAILS_LOAD_NUM (state, action) {
    state.detailsLoad = action
  },
  PRESELL_LOAD_NUM (state, action) {
    state.presellLoad = action
  }
}
