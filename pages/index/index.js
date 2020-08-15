Page({
  data:{
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    p:1,
    filterBox:false,
    sortBox:false,
    option:false
  },

  onLoad() {
    const newArr = ['aaa', 'bbb', 'ccc'].filter((item, index) => {
      return item === 'aaa'
    })
    console.log(newArr)

    let t = setTimeout(() => {
      console.log('11111')
    }, 200)
    clearTimeout(t)
  },

  searchActiveChangeinput: function(e) {
    console.log(e)
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
      console.log(inputSearch)
      let Bar = new wx.BaaS.TableObject("bar")
      let query = new wx.BaaS.Query()
      query.matches('name', inputSearch)
      Bar.setQuery(query).orderBy(['-like']).limit(50).find().then (res => {
        let searchBar = res.data.objects
        this.setData({searchBar})
        console.log(this.data)
      })
      } else {
        this.setData({searchBar:null})
      }
     },250)
    this.setData({
      t
    })
  },
  searchActiveChangeclear:function(){
    this.setData({search: ''})
  },

  searchSubmit: function(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../show/show?id=${id}`,
  })
  },

  filterBox: function(){
    let sortBox = this.data.sortBox
    if(!sortBox){
    let filterBox = !this.data.filterBox
    this.setData({filterBox})
    }else{
      sortBox = !this.data.sortBox
      let filterBox = !this.data.filterBox
      this.setData({sortBox,filterBox})
    }
  },

  sortBox: function (e) {
    let filterBox = this.data.filterBox
    if(!filterBox){
    let sortBox = !this.data.sortBox
    this.setData({sortBox})
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
    this.setData({option:false})
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let filterBox = !this.data.filterBox
    this.setData({filterBox})
    let price = e.detail.value.price
    console.log(price)
    let district = e.detail.value.district
    console.log(district.length)

    if(price == "" && district.length==0){
      this.getDataFromBaasBar()
      this.setData({data:false})
      }else if(price == "" && district.length!=0){
      console.log("shit")
      let Price = 300
      console.log(price)
      let data = {Price,district}
      this.setData({data})
      let Bar = new wx.BaaS.TableObject("bar")
      let query = new wx.BaaS.Query()
      query.compare('Price', '<', Price)
      query.in("location", district)
      Bar.setQuery(query).orderBy(['-created_at']).limit(50).find().then (res => {
        console.log(res)
        let bar = res.data.objects
        this.setData({bar})
        console.log(this.data)

      })}else if(price != "" && district.length==0){
        let District = ["南山区","福田区","罗湖区","宝安区"]
        let data = {price,District}
        this.setData({data})
        let Bar = new wx.BaaS.TableObject("bar")
        let query = new wx.BaaS.Query()
        query.compare('Price', '<', price)
        query.in("location", District)
        Bar.setQuery(query).orderBy(['-created_at']).limit(50).find().then (res => {
        console.log(res)
        let bar = res.data.objects
        this.setData({bar})
        console.log(this.data)

      })}else{
        let data = {price,district}
        this.setData({data})
        let Bar = new wx.BaaS.TableObject("bar")
        let query = new wx.BaaS.Query()
        query.compare('Price', '<', price)
        query.in("location", district)
        Bar.setQuery(query).orderBy(['-created_at']).limit(50).find().then (res => {
          console.log(res)
          let bar = res.data.objects
          this.setData({bar})
          console.log(this.data)
        })

      }
   
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  sortSubmit:function (e) {
    this.setData({sortBox:false})
    console.log(e)
    let option = e.detail.value.radio
    this.setData({option:true})
    if(option =="price"){
    let bar = this.data.bar;
    var compare = function (obj1, obj2) {
      var val1 = obj1.Price;
      var val2 = obj2.Price;
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
  console.log(bar)
  }else if(option=="popular"){
    let bar = this.data.bar;
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
  console.log(bar)

  }

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


  onReachBottom:function(){
    let data = this.data.data
    let option = this.data.option 
    if(!data && !option){ 
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
     },600)
    }
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
