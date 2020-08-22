Page({
  data:{
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    show: 'sort',
    sort: 'undefined',
    filter: {
      location: {
        index: undefined,
        choices: ['Nanshan', 'Futian', 'Luohu', 'BaoAn']
      },
      price: {
        index: undefined,
        choices: ['0 ~ 99', '100 ~ 199', '200 ~ 299', '299 +']
      }
    },
  },

  fetchBars: function () {
    let location = this.data.filter.location.choices[this.data.filter.location.index];
    console.log(this.data.filter.location.index)
    let price = this.data.filter.price.choices[this.data.filter.price.index];
    let sortType = this.data.sort;
    let min, max;

    // --- Clean up data --- //
    // if (location === 'Nanshan') {location = '南山区'};
    // if (location === 'BaoAn') {location = '宝安区'};
    // if (location === 'Futian') {location = '福田区'};
    // if (location === 'Luohu') {location = '罗湖区'};
    // console.log(location)

    if (price) { min = Number.parseInt(price.split(' ')[0]) };
    if (price) { max = Number.parseInt(price.split(' ')[2]) };

    // --- Set up BaaS --- //
    let Bar = new wx.BaaS.TableObject("bar");
    let query = new wx.BaaS.Query();

    // --- Queries --- //
    if (location) query.compare('location', '=', location);
    if (price) query.compare('price', '>=', min);
    if (price && max) query.compare('price', '<=', max);

    // --- Sort and Fetch--- //
    if (sortType) {
      console.log(sortType)
      if(sortType==='like') {Bar.setQuery(query).orderBy([`-${sortType}`]).limit(50).find().then (res => {
        let bars = res.data.objects;
        console.log(bars)

        bars.forEach(bar => {
          console.log("executed")
          let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;
          
          bar['likeMeter'] = bar.like / denominator * 100;
          bar['dislikeMeter'] = bar.dislike / denominator * 100;
        })

        this.setData({bar: bars});
      })} else if(sortType==='price'){
        Bar.setQuery(query).orderBy([`${sortType}`]).limit(50).find().then (res => {
        let bars = res.data.objects;
        console.log(bars)

        bars.forEach(bar => {
          console.log("executed")
          let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;
          
          bar['likeMeter'] = bar.like / denominator * 100;
          bar['dislikeMeter'] = bar.dislike / denominator * 100;
        })

        this.setData({bar: bars});
      })
        
      }
    } else {
      Bar.setQuery(query).limit(50).find().then (res => {
        let bars = res.data.objects;

        bars.forEach(bar => {
          let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;
          
          bar['likeMeter'] = bar.like / denominator * 100;
          bar['dislikeMeter'] = bar.dislike / denominator * 100;
        })

        this.setData({ bar: bars });
      })
    }
  },

  fetchFavorites: function(bars) {
    const barsIds = bars.map(bar => bar.id);

    let Favorite = new wx.BaaS.TableObject("favorite");
    let query = new wx.BaaS.Query();

    if (!this.data.user) {
      return null;
    }

    query.compare('user_id', '=', this.data.user.id);
    query.in('bar_id', barsIds);

    Favorite.setQuery(query).limit(50).find().then (res => {
      let favorites = res.data.objects;

      const newBars = bars.map((bar) => {
        const favorite = favorites.filter((fav) => fav.bar_id.id === bar.id)[0];

        const newBar = { ...bar, favorite: favorite, hasFavorite: !!favorite };

        return newBar;
      });

      this.setData({ bar: newBars });
    });
  },

  getCurrentUser: function () {
    wx.BaaS.auth.getCurrentUser().then(user => {
      this.setData({ user });
    })
  },

  bindFilterChange: function (e) {
    let index = e.detail.value;
    let type = e.currentTarget.dataset.type;
    const filterIndex = `filter.${type}.index`

    this.setData({ [filterIndex]: index });
    this.fetchBars();
  },

  toggleFilter: function (e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    this.setData({show: type})
  },

  toggleSort: function (e) {
    let type = e.currentTarget.dataset.type;

    this.setData({sort: type})
    this.fetchBars();
  },

  searchActiveChangeinput: function(e) {
    let input = e.detail.value;

    if (input) {
      input = new RegExp(input, 'i');
      
      let Bar = new wx.BaaS.TableObject("bar");
      let query = new wx.BaaS.Query();

      query.matches('name', input);

      Bar.setQuery(query).limit(50).find().then (res => {
        let bar = res.data.objects
        this.setData({bar});

        this.fetchFavorites(bar);
      })
    } else {
      this.fetchBars();
    }
  },

  checkCurrentUser: function () {
    wx.BaaS.auth.loginWithWechat().then(currentUser => {
      this.setData({currentUser})
    })
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

  getFont: function () {
    wx.loadFontFace({
      family: 'Poppins',
      source: 'url(https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k8lx4zTbUixFeD7.ttf)',
    })
  },

  onLoad: function () {
    this.getCurrentUser();
    this.getFont();
  },

  onShow: function () {
    this.fetchBars();
  }
})
