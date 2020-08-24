Component({
  properties: {
    bar: {
      type: Object,
      value: {},
    },
    user: {
      type: Object,
      value: {},
    },
  },
  data: {
    icons: {
      dookie: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCZxqPWt8PqG.svg',
      flame: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWClb08aGBJWA.svg'
    },
  },

  lifetimes: {
    attached: function () {
     
    } 
  },

  methods: {
  
    navigateToShowPage: function(){
      wx.navigateTo({
        url: `../show/show?id=${this.data.bar.id}`,
      });
    },

    createFavorite: function () {
      const Favorite = new wx.BaaS.TableObject("favorite");
      const favorite = Favorite.create();
      const bar = this.data.bar;

      favorite.set('user_id', this.data.user.id);
      favorite.set('bar_id', bar.id);

      favorite.save().then(res => {
        const newFavorite = res.data;
        console.log(res.data)

        bar.favorite = newFavorite;
        bar.hasFavorite = true;

        this.setData({ bar });
        console.log(this.data.bar)
        
      });
    },

    deleteFavorite: function () {

    
      const Favorite = new wx.BaaS.TableObject("favorite");
      const favorite = this.data.bar.favorite;
      console.log(favorite)

      Favorite.delete(favorite.id).then(res => {

        if (res.statusCode == 204 ) {
          console.log(res.statusCode)
          const bar = this.data.bar;

          bar.favorite = null;
          bar.hasFavorite = false;

          this.setData({ bar });
         
        }
        
      });
    },


    toggleFavorite: function() {
      const favorite = this.data.bar.favorite;
      console.log(favorite)

      if (favorite) {
        console.log("delete")
        this.deleteFavorite();
      } else {
        console.log("add")
        this.createFavorite();
      }
    },
  }
});
