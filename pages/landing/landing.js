// pages/landing/landing.js
Page({

  /**
   * Page initial data
   */
  data: {
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',

  }, 

 onLoad:function(){
   setTimeout(()=>{ wx.switchTab({
    url: '../index/index',
 })},3000)
 },

  navigateToIndexPage: function(){
    wx.switchTab({
         url: '../index/index',
      })
  },

})