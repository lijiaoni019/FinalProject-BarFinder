// pages/landing/landing.js
Page({

  /**
   * Page initial data
   */
  data: {

  }, 

 
  onLoad: function (options) {

    setTimeout(function(){
      wx.navigateTo({
        url: '../index/index',
      })
    },3000)

  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})