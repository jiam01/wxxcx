Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#007aff",
    list: [
      {
        "pagePath": "pages/home/home",
        "text": "首页",
        "iconPath": "/images/icon/首页.png",
        "selectedIconPath": "/images/icon/首页.png"
      },

      {
        "pagePath": "pages/chat/chat",
        "text": "Ai问诊",
        "iconPath": "/images/icon/AI.png",
        "selectedIconPath": "/images/icon/AI.png"
      },
      {
        "pagePath": "pages/mine/mine",
        "text": "我的",
        "iconPath": "/images/icon/我的 (1).png",
        "selectedIconPath": "/images/icon/我的 (1).png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      this.setData({
        selected: data.index
      });
      console.log('switchTab event:', e);
      console.log('Selected index:', data.index);
      console.log('Target URL:', url);

      wx.switchTab({
        url: `/${url}` // 注意路径需要以 / 开头
      });
    }
  }
})