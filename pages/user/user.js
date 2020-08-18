Page({
  data: {
    favoriteBars: [{id: '5f364a216526326e9641b358', name: 'Brass House', image: {path: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6UhfyA8TkJCnR0.jpg'}, likes: 378, dislikes: 78, saved: true}]
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

  loadFavorites: function() {
    let Favorite = new wx.BaaS.TableObject("favorite");
    let query = new wx.BaaS.Query();

    // query.compare('user_id', '=', this.data.currentUser.id);
    query.compare('user_id', '=', '208280101807461');

    Favorite.setQuery(query).limit(50).find().then (res => {
      let favoritesBarIds = res.data.objects.map(favorite => favorite.bar_id.id);

      let Bar = new wx.BaaS.TableObject("bar");
      let barQuery = new wx.BaaS.Query();
      barQuery.in('id', favoritesBarIds);

      Bar.setQuery(barQuery).find().then (res => {
        let favoriteBars = res.data.objects;
        this.setData({ favoriteBars });
      });
    })
  },

  onLoad: function (options) {
    this.checkCurrentUser();
    this.loadFavorites();
  }
})