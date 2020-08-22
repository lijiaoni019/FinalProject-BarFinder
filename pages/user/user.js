Page({

  navigateToHome: function () {
    wx.navigateTo({
      url: "../index/index"
    })
  },

  checkCurrentUser: function () {
    let user = wx.getStorageSync('user');
    this.setData({user});
  },

  userLogin: function (data) {
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      user = user.toJSON();
      
      this.loadFavorites(user);
      this.setData({user});
      wx.setStorageSync('user', user);
    })
  },

  userLogout: function () {
    wx.BaaS.auth.logout().then(res => {
      wx.setStorageSync('user', null);
      this.setData({user: null});
    });
  },

  loadFavorites: function(user) {
    if (user) {
      let Favorite = new wx.BaaS.TableObject("favorite");
      let query = new wx.BaaS.Query();
  
      query.compare('user_id', '=', user.id);
  
      Favorite.setQuery(query).limit(50).expand(['bar_id']).find().then (res => {
        let favorites = res.data.objects.map(item => item.bar_id);
        this.setData({ favorites });
      })
    }
  },

  getFont: function () {
    wx.loadFontFace({
      family: 'Poppins',
      source: 'url(https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k8lx4zTbUixFeD7.ttf)',
    })
  },

  onLoad: function (options) {
    let user = wx.getStorageSync('user');
    this.loadFavorites(user);
    this.setData({user});
    this.getFont();
  }
})