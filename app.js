App({
  globalData: {},
  onLaunch: function() {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
     wx.getUserInfo,
     wx.requestPayment)

    wx.BaaS.init('919ec66516189a58d8e1')
    wx.BaaS.auth.loginWithWechat();
  },
})