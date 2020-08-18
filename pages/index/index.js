Page({
  data:{
    filterInfo:[],
    favoriteBarId:[],
    barId:[],
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    p:1,
    filterBox:false,
    sortBox:false,
    option:false,
    clear:false,
    focus:false,
    showFilter:false,
    addFavorite:false,
    loading1: false,
    loading2:false,
    opacity:1,
    
    // background: ['https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6UhkrbEQzd9vXT.jpg', 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6UhceximdF3L5Q.jpg', 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6UhceximdF3L5Q.jpg'],
    // indicatorDots: true,
    // vertical: false,
    // autoplay: true,
    // circular: true,
    // interval: 2000,
    // duration: 500,
    // previousMargin: 0,
    // nextMargin: 0
  },


  searchActiveChangeinput: function(e) {
    this.setData({clear:true})
    if (this.data.t) {
      clearTimeout(this.data.t)
      this.setData({
        t: 0
      })
    }

    let input = e.detail.value;
    let t = setTimeout(()=>{
    if(input!="") {
      let inputSearch = new RegExp(input, 'i')
      let Bar = new wx.BaaS.TableObject("bar")
      let query = new wx.BaaS.Query()
      query.matches('name', inputSearch)
      Bar.setQuery(query).orderBy(['-like']).limit(50).find().then (res => {
        let searchBar = res.data.objects
        this.setData({searchBar})
      })
      } else {
        this.setData({searchBar:null})
        this.setData({clear:false})
      }
     },250)
    this.setData({
      t
    })
  },

  searchActiveChangeclear:function(){
    this.setData({search: ''})
    this.setData({searchBar:false})
    this.setData({clear:false})
  },

  searchSubmit: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../show/show?id=${id}`,
  })
  },

  hideFilterSort: function () {
    this.setData({filterBox:false})
    this.setData({sortBox:false})

  },

  filterBox: function(){
    let sortBox = this.data.sortBox
    let showFilter= !this.data.showFilter
    let opacity = this.data.opacity
    this.setData({showFilter})
    if(!sortBox){
      if(opacity==1){
        console.log("1")
        this.setData({opacity:0.2})
      }else if(opacity==0.2){
        console.log("0.2")
        this.setData({opacity:1})
      }
    let filterBox = !this.data.filterBox
    this.setData({filterBox})
    }else{
      sortBox = !this.data.sortBox
      let filterBox = !this.data.filterBox
      this.setData({sortBox,filterBox})
    }
  },

  filterReset: function(){
    this.setData({filterInfo:[]})
    this.setData({sortInfo:null})
    this.setData({showFilter:false})
    this.getDataFromBaasBar()
  },

  sortBox: function (e) {
    let filterBox = this.data.filterBox
    let showFilter= !this.data.showFilter
    let opacity = this.data.opacity
    this.setData({showFilter})
    if(!filterBox){
    let sortBox = !this.data.sortBox
    this.setData({sortBox})
    if(opacity==1){
      console.log("1")
      this.setData({opacity:0.2})
    }else if(opacity==0.2){
      console.log("0.2")
      this.setData({opacity:1})
    }
    }else{
      filterBox = !this.data.filterBox
      let sortBox = !this.data.sortBox
      this.setData({sortBox,filterBox})

    }
  },

  checkCurrentUser: function () {
    wx.BaaS.auth.loginWithWechat().then(currentUser => {
    this.setData({currentUser})
  })
},

  formSubmit: function (e) {
    this.setData({opacity:1})
    this.setData({sortInfo:null})
    this.setData({option:false})
    let filterBox = !this.data.filterBox
    this.setData({filterBox})
    let price = e.detail.value.price
    let district = e.detail.value.district
    console.log(district)
    let filterInfo = this.data.filterInfo

    if(price == "" && district.length==0){
      this.getDataFromBaasBar()
      this.setData({data:false})
      this.setData({filterInfo:[]})
      this.setData({sortInfo:null})
      this.setData({showFilter:false})

      }else if(price == "" && district.length!=0){
      this.setData({showFilter:true})
      let Price = 300
      let data = {Price,district}

      if(filterInfo!=[]){
      filterInfo=[]
      filterInfo.push({price:""})
      filterInfo.push({district})
      this.setData({data})
      this.setData({filterInfo})
      }else{
        filterInfo.push({price:""})
        filterInfo.push({district})
        this.setData({data})
        this.setData({filterInfo})
      }

      console.log(filterInfo)
      let Bar = new wx.BaaS.TableObject("bar")
      let query = new wx.BaaS.Query()
      query.compare('price', '<', Price)
      query.in("location", district)
      Bar.setQuery(query).orderBy(['-created_at']).limit(50).find().then (res => {
        let bar = res.data.objects
        this.setData({bar})

      })}else if(price!= "" && district.length==0){
        this.setData({showFilter:true})
        let District = ["南山区","福田区","罗湖区","宝安区"]
        let data = {price,District}

        if(filterInfo!=[]){
        filterInfo=[]
        filterInfo.push({price})
        filterInfo.push({district:""})
        this.setData({data})
        this.setData({filterInfo})
        }else{
          filterInfo.push({price})
          filterInfo.push({district:""})
          this.setData({data})
          this.setData({filterInfo})
        }
        this.setData({data})
        console.log(filterInfo)
        let Bar = new wx.BaaS.TableObject("bar")
        let query = new wx.BaaS.Query()
        query.compare('price', '<', price)
        query.in("location", District)
        Bar.setQuery(query).orderBy(['-created_at']).limit(50).find().then (res => {
        let bar = res.data.objects
        this.setData({bar})
      })}else{
        let data = {price,district}
        this.setData({data})
        this.setData({showFilter:true}) 
       console.log(price.toString())
       if(filterInfo!=[]){
        filterInfo=[]
        filterInfo.push({price})
        filterInfo.push({district})
        this.setData({filterInfo})
       }else{
        filterInfo.push({price})
        filterInfo.push({district})
        this.setData({filterInfo})
       }
       
        console.log(filterInfo)
        let Bar = new wx.BaaS.TableObject("bar")
        let query = new wx.BaaS.Query()
        query.compare('price', '<', price)
        query.in("location", district)
        Bar.setQuery(query).orderBy(['-created_at']).limit(50).find().then (res => {
          let bar = res.data.objects
          this.setData({bar})
       
        })

      }
   
  },

  formReset: function () {
  },

  sortSubmit:function (e) {
    this.setData({opacity:1})
    this.setData({showFilter:true})
    this.setData({sortBox:false})
    let option = e.detail.value.radio
    console.log(option)
    this.setData({option:true})
    if(option =="price"){
    let bar = this.data.bar;
    this.setData({sortInfo:"Price"})
    var compare = function (obj1, obj2) {
      var val1 = obj1.price;
      var val2 = obj2.price;
      if (val1 < val2) {
          return -1;
      } else if (val1 > val2) {
          return 1;
      } else {
          return 0;
      }            
  } 
  bar.sort(compare)
  this.setData({bar})
  }else if(option=="popular"){
    let bar = this.data.bar;
    this.setData({sortInfo: "Popularity"})
    var compare = function (obj1, obj2) {
      var val1 = obj1.like;
      var val2 = obj2.like;
      if (val1 > val2) {
          return -1;
      } else if (val1 < val2) {
          return 1;
      } else {
          return 0;
      }            
  } 
  bar.sort(compare)
  this.setData({bar})
  }else{
    console.log("flase")
  let sortInfo = this.data.sortInfo
  console.log(sortInfo)
  let filterInfo = this.data.filterInfo
  console.log(filterInfo)
  if(!sortInfo){ 
    console.log("false");
    if(filterInfo.length==0){
    console.log("flase")
    this.setData({showFilter:false})
  }}
  }

  },


  getDataFromBaasBar: function () {
    let Bar = new wx.BaaS.TableObject("bar")
    let query = new wx.BaaS.Query()
    Bar.setQuery(query).orderBy(['-created_at']).limit(20).find().then (res => {
      let bar = res.data.objects
      wx.hideLoading()
      this.setData({bar})
      
    })
    
   

  },

  // updateBarTable: function(){
  //   let barId = this.data.barId
  //   let bar = this.data.bar
  //   for(let x in bar){
  //     barId.push(bar[x].id)
  //   }
  //   this.setData({barId})
  //   console.log(barId)
  //   for(let i in barId ){
  //     let CurrentUserFavorite = new wx.BaaS.TableObject("bar")
  //     let currentUserFavorite = CurrentUserFavorite.getWithoutData(barId[i])
  //     currentUserFavorite.set('currentUserFavorite', false)
  //     currentUserFavorite.update().then(res => {
  //     console.log(res)
  //     })
  //   }
    

  // },

  // onReachBottom:function(){
  //   let data = this.data.data
  //   let option = this.data.option 
  //   if(!data && !option){ 
  //   wx.showLoading({
  //     title: 'Loading',
  //    })

  //    setTimeout(()=>{
  //     let p = this.data.p
  //     p = p + 1;
  //     this.setData({p})

  //     if(p<=8){
  //     let Bar = new wx.BaaS.TableObject("bar")
  //     let query = new wx.BaaS.Query()
  //     Bar.setQuery(query).orderBy(['-created_at']).limit(6*p).offset(0).find().then (res => {
  //       wx.hideLoading()
  //       let bar = res.data.objects
  //       this.setData({bar})
  //     })}else{
  //       wx.showToast({
  //         title: 'No more content',
  //         duration: 2000,
  //         icon:"none"
  //       })
  //     }
  //    },600)
  //   }
  //   },

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
  
  getBarData:function (){
    wx.BaaS.auth.getCurrentUser().then(currentUser => {
      this.setData({currentUser})
      let id = currentUser.id
      let Favorite = new wx.BaaS.TableObject("favorite");
      let query = new wx.BaaS.Query()
      query.compare('user_id', '=',  id)
      Favorite.setQuery(query).orderBy(['-created_at']).find().then(res => {
        console.log(res)
        let favorite = res.data.objects
        let favoriteBarId = this.data.favoriteBarId
        this.setData({favorite})

        for(let x in favorite){
          favoriteBarId.push(favorite[x].bar_id.id)
        }
        this.setData({favoriteBarId})
        console.log(favoriteBarId)
        if(favoriteBarId.length==0){
          console.log("1")
          this.getDataFromBaasBar()
        }else{
          console.log("2")
          for(let i in favoriteBarId ){
            let CurrentUserFavorite = new wx.BaaS.TableObject("bar")
            let currentUserFavorite = CurrentUserFavorite.getWithoutData(favoriteBarId[i])
            currentUserFavorite.set('currentUserFavorite', true)
            currentUserFavorite.update().then(res => {
            this.getDataFromBaasBar()
            })
          }

        }
      })
    })
  },

  addFavorite: function(e){
    let loading1= !this.data.loading1
    this.setData({loading1})
    let bar_id = e. currentTarget.dataset.id
    let favoriteBarId = this.data.favoriteBarId
    if(favoriteBarId.includes(bar_id)){
      console.log("false")
      }else{
        console.log("true")
        this.setData({favoriteBarId:[]})
        let user_id = this.data.currentUser.id
        let data ={bar_id,user_id}
        let AddFavorite = new wx.BaaS.TableObject("favorite")
        let addFavorite = AddFavorite.create()
        addFavorite.set(data)
        addFavorite.save().then(res => {
          this.getBarData()
          console.log(res)
         
        })
        setTimeout(()=>{
          console.log("loading1")
          this.setData({loading1:false})
        },800)

      }

  },

  deleteFavorite:function(e){
    let loading2= !this.data.loading2
    this.setData({loading2})
    let bar_id = e. currentTarget.dataset.id
    let user_id = this.data.currentUser.id
    let favoriteBarId=this.data.favoriteBarId
    let index = favoriteBarId.indexOf(bar_id)
    favoriteBarId.splice(index,1)
    let DeleteFavorite = new wx.BaaS.TableObject("favorite")
    let query = new wx.BaaS.Query()
    query.compare('bar_id', '=',  bar_id)
    query.compare('user_id', '=',  user_id)
    console.log(query)
    DeleteFavorite.delete(query).then(res => {

      let DeleteFavorite = new wx.BaaS.TableObject("bar")
          let deleteFavorite = DeleteFavorite.getWithoutData(bar_id)
          deleteFavorite.set('currentUserFavorite', false)
          deleteFavorite.update().then(res => {
          this.getDataFromBaasBar()
          })
      
    })
    setTimeout(()=>{
      console.log("loading2")
      this.setData({loading2:false})
    },800)
    

  },
 
  
  onLoad: function () {
    wx.showLoading()
    this.getBarData()
  
    
  },
  
})
