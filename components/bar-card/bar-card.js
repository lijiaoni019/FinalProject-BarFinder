Component({
  properties: {
    bar: {
      type: Object,
      value: {},
    },
  },
  data: {
    icons: {
      dookie: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWCZxqPWt8PqG.svg',
      flame: 'https://cloud-minapp-36814.cloud.ifanrusercontent.com/1k6rWClb08aGBJWA.svg'
    }
  },

  lifetimes: {
    attached: function () {
      this.setMeterLength();
    }
  },

  methods: {
    setMeterLength: function () {
      let bar = this.data.bar;
      let denominator = bar.like > bar.dislike ? bar.like : bar.dislike;
  
      console.log(bar, denominator);
  
      bar['likeMeter'] = bar.like / denominator * 100;
      bar['dislikeMeter'] = bar.dislike / denominator * 100;
  
      this.setData({bar});
    }
  }
});