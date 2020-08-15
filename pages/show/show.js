Page({
  data: {
    rating: null,
    icons: {
      food: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCUZVrtV7udr.svg',
      flame: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCqBGbbpcRdO.svg',
      dookie: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCxi9HcQg8tY.svg',
      address: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCRPo2RcE1MU.svg'
    }
  },

  fetchBar: function (id) {
    let Bar = new wx.BaaS.TableObject("bar");
    Bar.get(id).then(res => {
      console.log(res);
      let bar = res.data;
      this.setData({bar});
    }); 
  },

  fetchRating: function (bar_id) {
    // let bar = this.data.bar;
    let Rating = new wx.BaaS.TableObject("rating");
    let query = new wx.BaaS.Query();
    
    query.compare('user_id', '=', this.data.user.id);
    query.compare('bar_id', '=', bar_id)
    
    Rating.setQuery(query).find().then(res => {
      this.setData({rating: res.data.objects[0]})
    })
  },

  addLike: function () {
    let Bar = new wx.BaaS.TableObject("bar");
    let bar = Bar.getWithoutData(this.data.bar.id);
    let newLike = this.data.bar.like + 1;
    bar.set('like', newLike);
    bar.update().then(res => {
      console.log(res);
      if (res.statusCode == 200 ) {
        wx.showToast({
          title: 'Liked',
          duration: 1000,
        });
      }
    }); 
    if (this.data.rating != null) {
      // update 
      this.updateRating(true, false);
    } else {
      this.createRating(true, false);
    }
  },

  addDislike: function () {
    let Bar = new wx.BaaS.TableObject("bar");
    let bar = Bar.getWithoutData(this.data.bar.id);
    let newDislike = this.data.bar.dislike + 1;
    bar.set('dislike', newDislike);
    bar.update().then(res => {
      if (res.statusCode == 200 ) {
        wx.showToast({
          title: 'Disliked',
          duration: 1000,
        });
      }
    });
    if (this.data.rating != null) {
      this.updateRating(false, true);
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
      this.setData({rating: [res.data]})
    })
  },

  updateRating: function (like, dislike) {
    let Rating = new wx.BaaS.TableObject("rating")
    let rating = Rating.getWithoutData(this.data.rating[0].id)
     console.log(this.data.rating[0].id);
    rating.set('like', like);
    rating.set('dislike', dislike);
    rating.update().then(res => {
      console.log(res);
    })
  },

  getCurrentUser: function (bar_id) {
    wx.BaaS.auth.getCurrentUser().then(user => {
      this.setData({user});
      this.fetchRating(bar_id);
    })
  },

  onLoad: function (options) {
    let id = options.id;
    this.fetchBar(id);
    this.getCurrentUser(id);
  }

})