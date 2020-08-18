Page({
  data: {
    rating: null,
    icons: {
      food: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k7FEcDhaUgk1hcS.svg',
      flame: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCqBGbbpcRdO.svg',
      dookie: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCxi9HcQg8tY.svg',
      address: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCRPo2RcE1MU.svg',
    }
  },

  fetchBar: function (id) {
    let Bar = new wx.BaaS.TableObject("bar");
    Bar.get(id).then(res => {
      let bar = res.data;
      this.setData({bar});
      this.setMeterLength();
    }); 
  },

  setMeterLength: function () {
    let bar = this.data.bar;
    let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;

    bar['likeMeter'] = bar.like / denominator * 100;
    bar['dislikeMeter'] = bar.dislike / denominator * 100;

    this.setData({bar})
  },


  toggleLike: function () {
    let Bar = new wx.BaaS.TableObject("bar");
    let bar = Bar.getWithoutData(this.data.bar.id);
    
    let newLike = this.data.bar.like + 1;
  },

  addLike: function () {
    let Bar = new wx.BaaS.TableObject("bar");
    let bar = Bar.getWithoutData(this.data.bar.id);
    
    let newLike = this.data.bar.like + 1;
    if (this.data.rating) {
      if (this.data.rating.like) {
        newLike = this.data.bar.like - 1;
      } else {
        newLike = this.data.bar.dislike + 1;
      }
    }

    bar.set('like', newLike);
    bar.update().then(res => {
      console.log(res);
      if (res.statusCode == 200 ) {
        wx.showToast({
          title: 'Liked',
          duration: 1000,
        });
        this.fetchBar(this.data.bar.id);
      }
    }); 
    if (this.data.rating != null && !this.data.rating.like != this.data.rating.dislike || this.data.rating.like) {
      this.updateRating(!this.data.rating.like, this.data.rating.dislike);
    } else {
      this.createRating(true, false);
    }
  },

  addDislike: function () {
    let Bar = new wx.BaaS.TableObject("bar");
    let bar = Bar.getWithoutData(this.data.bar.id);

    let newDislike = this.data.bar.dislike + 1;
    if (this.data.rating) {
      if (this.data.rating.dislike) {
        newDislike = this.data.bar.dislike - 1;
      } else {
        newDislike = this.data.bar.dislike + 1;
      }
    }

    bar.set('dislike', newDislike);
    bar.update().then(res => {
      if (res.statusCode == 200 ) {
        wx.showToast({
          title: 'Disliked',
          duration: 1000,
        });
        this.fetchBar(this.data.bar.id);
      }
    });
    if (this.data.rating != null && this.data.rating.like != !this.data.rating.dislike || this.data.rating.dislike) {
      this.updateRating(this.data.rating.like, !this.data.rating.dislike);
    } else {
      this.createRating(false, true);
    }
  },

  createRating: function (like, dislike) {
    let Rating = new wx.BaaS.TableObject("rating");
    let rating = Rating.create();
    rating.set('like', like);
    rating.set('dislike', dislike);
    rating.set('bar_id', this.data.bar.id);
    rating.set('user_id', this.data.user.id);
    rating.save().then(res => {
      console.log(res);
      this.setData({rating: res.data})
    })
  },

  updateRating: function (like, dislike) {
    let Rating = new wx.BaaS.TableObject("rating")
    let rating = Rating.getWithoutData(this.data.rating.id)
     console.log(this.data.rating.id);
    rating.set('like', like);
    rating.set('dislike', dislike);
    rating.update().then(res => {
      this.setData({ rating: res.data });
    })
  },

  getCurrentUser: function (bar_id) {
    wx.BaaS.auth.getCurrentUser().then(user => {
      this.setData({user});
      this.fetchFavorite(bar_id, user.id);
      this.fetchRating(bar_id, user.id)
    })
  },

  onShareAppMessage: function () {
    let bar = this.data.bar;
    return {
      title: bar.name,
      path: `/pages/show/show?id=${bar.id}`
    }
  },

  toggleFavorite: function () {
    let Favorite = new wx.BaaS.TableObject("favorite")
    if (this.data.favorite) {
      Favorite.delete(this.data.favorite.id).then(res => {
        console.log(res);
        if (res.statusCode == 204 ) {
          this.setData({favorite: null});
          wx.showToast({
            title: 'Unsaved',
            duration: 1000,
          });
        }
      })
    } else {
      let favorite = Favorite.create();
      let bar_id = this.data.bar.id;
      let user_id = this.data.user.id;
      favorite.set('bar_id', bar_id);
      favorite.set('user_id', user_id);
      favorite.save().then(res => {
        if (res.statusCode == 201 ) {
          this.setData({favorite: res.data});
          wx.showToast({
            title: 'Saved',
            duration: 1000,
          });
        }
      })
    }

    
  },

  fetchFavorite: function (bar_id, user_id) {
    let Favorite = new wx.BaaS.TableObject("favorite");
    let query = new wx.BaaS.Query();
    query.compare('bar_id', '=', bar_id);
    query.compare('user_id', '=', user_id);
    Favorite.setQuery(query).find().then(res => {
      this.setData({favorite: res.data.objects[0]});
    })
  },

  fetchRating: function (bar_id, user_id) {
    let Rating = new wx.BaaS.TableObject("rating");
    let query = new wx.BaaS.Query();
    query.compare('bar_id', '=', bar_id);
    query.compare('user_id', '=', user_id);
    Rating.setQuery(query).find().then(res => {
      this.setData({rating: res.data.objects[0]});
    })
  },

  onLoad: function (options) {
    let id = options.id;
    this.fetchBar(id);
    this.getCurrentUser(id);
  }

})