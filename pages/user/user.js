Page({

  data:{

  },

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
  
      Favorite.setQuery(query).limit(50).expand(['bar_id']).orderBy(['-created_at']).find().then (res => {
        let favorites = res.data.objects.map(item => {
          let bar = item.bar_id
          let favorite = item
          let newItem = {...bar, favorite: favorite, hasFavorite: !!favorite}
          return newItem
        });
        
        favorites.forEach(bar => {
          let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;
          
          bar['likeMeter'] = bar.like / denominator * 100;
          bar['dislikeMeter'] = bar.dislike / denominator * 100;
        })
        this.setData({ bar: favorites });

      })
    }
  },



  getFont: function () {
    wx.loadFontFace({
      family: 'Poppins',
      source: 'url(https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k8lx4zTbUixFeD7.ttf)',
    })
  },

  onShow: function (options) {
    let user = wx.getStorageSync('user');
    console.log(user)
    this.loadFavorites(user);
    this.setData({user});
    console.log(this.data)
    this.getFont();
  },


  
  
})