Page({
  data:{ 
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    show: 'sort', 
    sort: undefined,
    filter: {
      location: {
        index: undefined,
        choices: ['All District','Nanshan', 'Futian', 'Luohu', 'BaoAn']
      },
      price: {
        index: undefined,
        choices: ['All Price Range','0 ~ 99', '100 ~ 199', '200 ~ 299', '299 +']
      }
    },
  },

  getFont: function () {
    wx.loadFontFace({
      family: 'Poppins',
      source: 'url(https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k8lx4zTbUixFeD7.ttf)',
    })
  },

  fetchBars: function () {
    let location = this.data.filter.location.choices[this.data.filter.location.index];
    let price = this.data.filter.price.choices[this.data.filter.price.index];
    let priceIndex = this.data.filter.price.index;
    let sortType = this.data.sort;
    let min, max;

    // --- Clean up data --- //
    if (location === 'Nanshan') {location = '南山区'};
    if (location === 'BaoAn') {location = '宝安区'};
    if (location === 'Futian') {location = '福田区'};
    if (location === 'Luohu') {location = '罗湖区'};
    console.log(location)

    if (priceIndex!= undefined && priceIndex!=0) { min = Number.parseInt(price.split(' ')[0]) };
    if (priceIndex!=undefined && priceIndex!=0) { max = Number.parseInt(price.split(' ')[2]) };

    // --- Set up BaaS --- //
    let Bar = new wx.BaaS.TableObject("bar");
    let query = new wx.BaaS.Query();

    // --- Queries --- //
    if (location== '南山区'||location== '宝安区'||location== '福田区'||location== '罗湖区') query.compare('location', '=', location);
    if (priceIndex!= undefined && priceIndex!=0) query.compare('price', '>=', min);
    if (priceIndex!= undefined && priceIndex!=0 && max) query.compare('price', '<=', max);

    // --- Sort and Fetch--- //
    if (sortType) {
      let orderBy = (sortType === 'like') ? '-like' : 'price'
      Bar.setQuery(query).orderBy([orderBy]).limit(50).find().then (res => {
        let bars = res.data.objects;
        console.log(bars)

        bars.forEach(bar => {
          console.log("executed")
          let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;
          
          bar['likeMeter'] = bar.like / denominator * 100;
          bar['dislikeMeter'] = bar.dislike / denominator * 100;
        })

        this.setData({bar: bars});
        this.fetchFavorites(bars)
      })
    } else {
      Bar.setQuery(query).limit(50).find().then (res => {
        let bars = res.data.objects;

        bars.forEach(bar => {
          let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;
          
          bar['likeMeter'] = bar.like / denominator * 100;
          bar['dislikeMeter'] = bar.dislike / denominator * 100;
        })

        this.setData({ bar: bars });
        this.fetchFavorites(bars)
      })
    }
  },

  fetchFavorites: function(bars) {
    console.log("favorites")

    const barsIds = bars.map(bar => bar.id);

    let Favorite = new wx.BaaS.TableObject("favorite");
    let query = new wx.BaaS.Query();

    if (!this.data.user) {
      return null;
    }

    query.compare('user_id', '=', this.data.user.id);
    query.in('bar_id', barsIds);

    Favorite.setQuery(query).limit(50).find().then (res => {
      wx.hideLoading()
      let favorites = res.data.objects;
      console.log(favorites)

      const newBars = bars.map((bar) => {
        const favorite = favorites.filter((fav) => fav.bar_id.id === bar.id)[0];
        const newBar = { ...bar, favorite: favorite, hasFavorite: !!favorite };

        return newBar;
      });

      this.setData({ bar: newBars });
      
    });
  },


  // getCurrentUser: function () {
  //   wx.BaaS.auth.getCurrentUser().then(user => {
  //     this.setData({ user });
  //   })
  // },

  bindFilterChange: function (e) {
    console.log(e)
    let index = e.detail.value; 
    let type = e.currentTarget.dataset.type;
    const filterIndex = `filter.${type}.index`

    this.setData({ [filterIndex]: index });  //  why using [] here
    this.setData({show: "sort"})
    this.fetchBars();
  },

  toggleFilter: function (e) {
    let type = e.currentTarget.dataset.type;
    if(type=="sort") this.fetchBars()
    console.log(type)
    this.setData({show: type})
  }, 

  toggleSort: function (e) {
    let type = e.currentTarget.dataset.type;
    this.setData({sort: type})
    this.fetchBars();
  },

  searchActiveChangeinput: function(e) {
    console.log(this.data.search)
    let input = e.detail.value;

    if (input) {
      input = new RegExp(input, 'i');
      
      let Bar = new wx.BaaS.TableObject("bar");
      let query = new wx.BaaS.Query();

      query.matches('name', input);

      Bar.setQuery(query).limit(50).find().then (res => {
        let bars = res.data.objects
        bars.forEach(bar => {
          let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;
          
          bar['likeMeter'] = bar.like / denominator * 100;
          bar['dislikeMeter'] = bar.dislike / denominator * 100;
        })
        this.setData({bar:bars});
        this.fetchFavorites(bars);
      })
    } else {
      this.fetchBars();
    }
  },

  navigateToShowPage:function(e){
    let id = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `../show/show?id=${id}`,
    })
  },

  navigateToUser: function () {
    wx.navigateTo({
      url: "../user/user"
    })
  },

  onLoad: function () {
    let user = wx.getStorageSync('user')
    this.setData({user})
    this.getFont();
    wx.showLoading();
    this.fetchBars();
  },

  onShow: function () {
    let bars = this.data.bar
    console.log(bars)
   if(bars) this.fetchFavorites(bars);
  }
})
