/**
 * user 数据状态
 * @returns {{user: {logined: boolean, data: {}}}}
 */
export const state = () => {
  return {
    user: {
      logined: false,
      data: {
        loginName: '',
        memberId: '',
        mobile: '',
        token: ''
      }
    },
    // 定位地址
    position: {
      provinceName: '',
      provinceId: '',
      cityName: '',
      cityId: ''
    },
    // 经销商
    dealer: {
      provinceObj: {},
      cityObj: {},
      dealerName: ''
    },
    // 用户优惠码
    userCode: {
      uniqueUserId: '',
      utmSource: ''
    },
    // 公钥
    publicKey: {
      exp: '',
      mod: ''
    },
    orderType: '' // 订单显示昨天
  }
}

// self.$store.getters.user
export const getters = {
  user: state => state.user
}

const deepClone = (source) => {
  console.log(source)
  if (!source) {
    return source
  }
  let sourceCopy = source instanceof Array ? [] : {}
  for (let item in source) {
    sourceCopy[item] = typeof (source[item]) === 'object' ? deepClone(source[item]) : source[item]
  }
  return sourceCopy
}
export const mutations = {
  USER_GET_DATA(state, action) {
    console.log('aaaaaa', action)
    state.user = deepClone(action)
  },
  POSITION_GET_CITY(state, action) {
    state.position = action
  },
  GET_DEALER(state, action) {
    state.dealer = action
  },
  PA_GET_USERCODE(state, action) {
    state.userCode = action
  },
  PWD_PUBLIC_KEY(state, action) {
    state.publicKey = action
  },
  ORDER_SHOW_TYPE(state, action) {
    state.orderType = action
  }
}
