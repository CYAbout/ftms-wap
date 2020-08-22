// 接口地址整理
const address = {
  /**
   * 对接平安
   * 对接平安用户code为“userCode”
   */
  checkProtectGuestReqInfo: 'order/api/checkProtectGuestReqInfo', // 验证优惠码接口
  saveProtectGuestReqInfo: 'order/api/saveProtectGuestReqInfo', // {adGroupCode}
  /**
   * 查询广告位信息
   * 首页广告位组编号adGroupCode值为“home_page_ads”
   */
  getAdvertisementList: 'product/api/getAdvertisementList/', // {adGroupCode}
  getImageCode: 'member/api/getImageCode', // 获取图片验证码
  checkImageCode: 'member/api/checkImageCode', // 验证图片验证码 signcode=czfg
  sendMobileCode: 'member/api/sendMobileCode', // 获取手机验证码
  registerCheck: 'member/api/registerCheck', // APP端注册校验（手机验证码校验）
  findPasswordCheck: 'member/api/mobileCodeCheck', // 找回密码验证码校验
  register: 'member/api/register', // 注册
  login: 'member/api/login', // 登录 快捷登录 loginway为0; 账号登录 loginway为1
  logout: 'member/api/logout', // 退出登录
  findPassword: 'member/api/findPassword', // 找回密码
  getPublicKey: 'member/api/getPublicKey', // 获取公钥（mod和exp）
  updatePassword: 'member/api/updatePassword', // 修改密码
  getMemberInfo: 'member/api/getMemberInfo', // 获取个人资料
  updateMemberInfo: 'member/api/updateMemberInfo', // 修改个人资料
  uploadMemberLogo: 'member/api/uploadMemberLogo', // 上传头像
  // --------------------------- 消息列表接口文档 ---------------------------
  messageDetail: 'member/api/getMsgInfo/', // 获取消息详情
  messageList: 'member/api/getMsgList', // 获取消息列表
  dealMsgList: 'member/api/dealMessages', // 获取消息列表
  messageNumber: 'member/api/getMessageCount', // 查询消息条数
  // --------------------------- 商品中心接口文档 ---------------------------
  /**
   * 获取前台分类筛选条件
   * parentId为前台分类父id，查询一级分类时为-1（获取车型时，先传-1，然后再调用，传1整车）
   */
  getProCatalogByParentId: 'product/api/getProCatalogByParentId/', // {parentId}
  /**
   * 获取系统码信息
   * 获取价格筛选区间 codeTypeNo为“price_range”
   * 获取商品标签（新品和热销等）codeTypeNo为“product_tag”
   * 获取预约试驾的计划购车时间 codeTypeNo为“plan_shopping_time”
   * 获取订单新类型 codeTypeNo为"order_type"
   */
  getProductByProCatalogId: '/product/api/getProductByProCatalogId?proCatalogId=', // 根据车系获取车型
  getSysCodeValues: 'product/api/getSysCodeValues/', // {codeTypeNo}
  queryProductListForPage: 'product/api/queryProductListForPage', // 查询商品列表
  queryGoodsAttributeList: 'product/api/queryGoodsAttributeList', // 查询商品规格信息（包含规格值）
  queryGoodsAttributeValueList: 'product/api/queryGoodsAttributeValueList', // 查询商品规格值信息
  queryGoodsInfoList: 'product/api/queryGoodsInfoList', // 查询单品列表
  queryGoodsInfo: 'product/api/queryGoodsInfo/', // 查询单品信息 {goodsId}
  insertCollect: 'member/api/insertCollect', // 单品加入心愿单
  queryCollectGoodsList: 'product/api/queryCollectGoodsList', // 心愿单列表
  queryProductPresellInfo: 'product/api/queryProductPresellInfo/', // 获取预售商品信息 {productId}
  /**
   * 查询商品详细信息
   * 配置表信息字段为：configurationParameter和goodsInfo
   */
  queryProductDetail: 'product/api/queryProductDetailByWap/', // {productId}
  /**
   * 查询商品意向金
   * 参数productId为必填
   */
  queryProductEarnest: 'product/api/getPreferentialPolicy/', // {productId}
  insertDrive: 'member/api/insertDrive', // 新增预约试驾
  queryDriveList: '/product/api/queryDriveList', // 查询预约信息
  updateSubscribeStatus: '/member/api/updateSubscribeStatus/', // 查询预约信息 /api/updateSubscribeStatus/{id}
  /**
   * 获取区域信息
   * 根据父id查询区域信息，查询省份信息时regionParentId为0
   */
  getRegionInfo: 'product/api/getRegionInfo/', // {regionParentId}
  queryDealerList: 'product/api/queryDealerList', // 获取经销商列表信息
  getRegionInfoByLocate: 'product/api/getRegionInfoByLocate', // 按位置获取区域
  // --------------------------- 订单接口 ---------------------------
  place: 'order/api/presell/place', // 预售订单下单
  orderList: 'order/api/list', // 订单列表
  orderDetail: 'order/api/detail/', // 订单列表 {orderNo}
  pay: '/order/api/pay/', // 订单支付 {orderNo}/{payType}
  cancel: '/order/api/cancel/', // 取消订单（未支付调用）{orderNo}
  apply: '/order/api/refund/apply', // 申请退款
  info: '/order/api/coupon/info/', // 发送核销码 {orderNo}
  insertQuestionnaire: 'order/api/insertQuestionnaire', // 保存调查问卷
  query: 'order/api/paystatus/query/', // 支付状态查询 {orderNo}/{payType}
  refundOrderList: '/order/api/refund/list', // 退款单列表
  refundDetail: '/order/api/refund/detail/', // 退款单详情
  saveMemberBankCard: '/member/api/saveMemberBankCard', // 银行卡信息留资
  bankCard: '/order//api/insert/bankCard', // 提交银行卡信息
  refundCancel: '/order/api/refund/cancel/', // 确定取消退款 {orderNo}
  // --------------------------- 评价接口 ---------------------------
  queryAssessmentList: 'order/api/queryAssessmentList', // 我的评价列表
  listAssessment: 'order/api/listAssessment', // 商品评价列表
  insertAssessment: 'order/api/insertAssessment', // 新增评价
  getAssessmentInfo: 'order/api/getAssessmentInfo/', // 评价详情
  // --------------------------- 卡劵接口 ---------------------------
  queryCardActivity: '/product/api/queryCardActivity', // 卡券活动信息
  cardList: '/product/api/queryCardVoucherList/', // 卡券列表
  cardDetail: '/product/api/queryCardVoucherInfo/', // 卡券详情
  createCardVoucherOrder: '/order/api/createCardVoucherOrder', // 卡券详情
  // --------------------------- 个人卡券接口 ------------------------
  cardVouchersList: 'order/api/cardList/', // 个人卡券列表
  // --------------------------- 判断是否在活动期间内接口 ------------------------
  phevActivityTime: 'product/api/getIsActiviting/phev_activity_time/', // 判断是否在phev活动期间内
  // -----------------------判断是否在亚洲龙活动期间内接口--------------------
  yzlActivityTime: 'product/api/getIsActiviting/yzl_activity_time', // 判断亚洲龙活动是否开始
  // -----------------------判断4.11活动状态接口--------------------
  getActivityState: 'product/api/getActivityState/18', // 判断亚洲龙活动是否开始
  // --------------------------- 判断是否在活动期间内接口 ------------------------
  activityMay: '/product/api/getActivityState/1' //
}

export default address
