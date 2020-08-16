Page({
  data: {
    icons: {
      dookie: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWClb08aGBJWA.svg',
      flame: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCZxqPWt8PqG.svg'
    },
    saved: [{id: '5f364a216526326e9641b358', name: 'Brass House', image: {path: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6UhfyA8TkJCnR0.jpg'}, likes: 378, dislikes: 78, saved: true}]
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
      this.setData({user: true})
    } else {
      this.setData({user: true})
    }
  },

  userLogin: function (data) {
    wx.BaaS.auth.loginWithWechat(data).then(currentUser => {
      currentUser = currentUser.toJSON();
      this.setData({currentUser});
      wx.setStorageSync('currentUser',currentUser);
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

  }
})