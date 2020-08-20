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
    Bar.get(id).then((res) => this.setMeterLength(res.data)); 
  },

  setMeterLength: function (bar) {
    let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;

    bar['likeMeter'] = Math.floor(bar.like / denominator * 100);
    bar['dislikeMeter'] = Math.floor(bar.dislike / denominator * 100);

    this.setData({bar})
  },

  toggleRating: function (e) {
    this.setData({disabled: true})
    
    let type = e.currentTarget.dataset.type;
    let rating = this.data.rating;
    let bar = this.data.bar;

    if (type === 'like' && rating['like']) {
      rating['like'] = false;
      rating['dislike'] = false;
      bar.like -= 1;
    } else if (type === 'like' && !rating['like']) {
      bar.dislike = rating['dislike'] ? bar.dislike - 1 : bar.dislike;
      bar.like += 1;
      rating['like'] = true;
      rating['dislike'] = false;
    } else if (type === 'dislike' && rating['dislike']) {
      rating['like'] = false;
      rating['dislike'] = false;
      bar.dislike -= 1;
    } else if (type === 'dislike' && !rating['dislike']) {
      bar.like = rating['like'] ? bar.like - 1 : bar.like;
      rating['like'] = false;
      rating['dislike'] = true;
      bar.dislike += 1;
    }

    let Rating = new wx.BaaS.TableObject('rating');
    let Bar = new wx.BaaS.TableObject('bar');
    let rating_entry = Rating.getWithoutData(rating.id);
    let bar_entry = Bar.getWithoutData(bar.id);

    rating_entry.set('like', rating.like);
    rating_entry.set('dislike', rating.dislike);
    
    rating_entry.update().then(res => {
      rating = res.data;
      this.setData({rating});
    });

    bar_entry.set('like', bar.like);
    bar_entry.set('dislike', bar.dislike);
    
    bar_entry.update().then(res => {
      bar = res.data;
      this.setMeterLength(bar);
      this.setData({bar, disabled: false});
    })
  },

  createRating: function (bar, user) {
    let Rating = new wx.BaaS.TableObject("rating");
    let rating = Rating.create();
    let data = {user_id: user, bar_id: bar};

    rating.set(data).save().then(res => {
      this.setData({rating: res.data})
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
      let rating = res.data.objects[0];
      
      if (!rating) this.createRating(bar_id, user_id);
      else this.setData({ rating });
    })
  },

  openLocation: function () {
    let latitude = this.data.bar.coordinate.lat;
    let longitude = this.data.bar.coordinate.lng;
    wx.openLocation({
      latitude,
      longitude,  
    });
  },

  onLoad: function (options) {
    let id = options.id;
    let user = wx.getStorageSync('user');
    
    this.fetchBar(id);
    this.fetchFavorite(id, user.id);
    this.fetchRating(id, user.id);
  }
})