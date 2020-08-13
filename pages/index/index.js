Page({
  data:{
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    p:1,
  },

  checkCurrentUser: function () {
    wx.BaaS.auth.loginWithWechat().then(currentUser => {
    this.setData({currentUser})
    this.getDataFromBaasFavorite()
  })
},


  getDataFromBaasBar: function () {
    let Bar = new wx.BaaS.TableObject("bar")
    let query = new wx.BaaS.Query()
    Bar.setQuery(query).orderBy(['-created_at']).limit(6).find().then (res => {
      console.log(res)
      let bar = res.data.objects
      this.setData({bar})
      console.log(this.data)
    })

  },

  // getDataFromBaasFavorite: function () {
  //   let id = this.data.currentUser.id
  //   console.log(id)
  //   let Favorite = new wx.BaaS.TableObject("favorite")
  //   let query = new wx.BaaS.Query()
  //   query.compare('user_id', '=', id)
  //   Favorite.setQuery(query).orderBy(['-created_at']).find().then (res => {
  //     console.log(res)
  //     let favorite = res.data.objects
  //     this.setData({favorite})
  //     console.log(this.data)
  //   })

  // },

  onReachBottom:function(){
    wx.showLoading({
      title: 'Loading',
     })

     setTimeout(()=>{
      let p = this.data.p
      p = p + 1;
      console.log(p)
      this.setData({p})
      console.log(this.data.p)

      if(p<=8){
      let Bar = new wx.BaaS.TableObject("bar")
      let query = new wx.BaaS.Query()
      Bar.setQuery(query).orderBy(['-created_at']).limit(6*p).offset(0).find().then (res => {
        wx.hideLoading()
        console.log(res)
        let bar = res.data.objects
        this.setData({bar})
        console.log(this.data)
      })}else{
        wx.showToast({
          title: 'No more content',
          duration: 2000,
          icon:"none"
        })
      }
     },1000)
   
    },

     //发起请求

  navigateToShowPage:function(e){
    console.log(e)
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
    this.getDataFromBaasBar()
    this.checkCurrentUser()
    // let list = wx.getStorageSync('list')
    // if (list){this.setData({list})}else{
    //   let list = [];
    //   this.setData({list})
    // }
  },
  
})
