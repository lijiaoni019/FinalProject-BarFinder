// pages/user/user.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  navigateToHome: function () {
    wx.navigateTo({
      url: "../index/index"
    })
  },

  checkCurrentUser: function () {
    let currentUser = wx.getStorageSync('currentUser')
    if (currentUser){
      this.setData({currentUser})
      this.setData({user:true})
      this.fetchFavorites()
    }else {
      this.setData({user:true})
    }


  },

  userLogin: function (data) {
    wx.BaaS.auth.loginWithWechat(data).then(currentUser => {
    currentUser = currentUser.toJSON()
    this.setData({currentUser})
    wx.setStorageSync('currentUser',currentUser)
    }, err => {
     wx.showModal({
       cancelColor: 'cancelColor',
       title: 'Authorization Needed for Access',
       
     })
 })

},

userLogout: function () {
  wx.BaaS.auth.logout().then(res => {
    wx.setStorageSync('currentUser', null);
    this.setData({currentUser: null});
  });
}, 


  onLoad: function (options) {
    this.checkCurrentUser()

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})