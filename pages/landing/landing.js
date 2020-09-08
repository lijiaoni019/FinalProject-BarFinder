// pages/landing/landing.js
Page({

  /**
   * Page initial data
   */
  data: {

  }, 

 onLoad:function(){
   setTimeout("navigateToIndexPage()",2000)
 },

  navigateToIndexPage: function(){
    wx.switchTab({
         url: '../index/index',
      })
  },

})