App({
  globalData: {},
  onLaunch: function() {
    wx.BaaS = requirePlugin('sdkPlugin');

    wx.BaaS.wxExtend(wx.login, wx.getUserInfo);

    wx.BaaS.init('919ec66516189a58d8e1');
    wx.BaaS.auth.loginWithWechat().then(user => {
      wx.setStorageSync('user', user);
    });
  },
})