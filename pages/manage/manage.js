Page({
  data: {
    records: []
  },

  // 页面显示时读取本地存储的记录
  onShow() {
    const records = wx.getStorageSync('records') || [];
    this.setData({
      records
    });
    console.log('Loaded Records:', records); // 调试日志
  },

  // 跳转到添加新记录页面
  navigateToAddRecord() {
    wx.navigateTo({
      url: '/pages/addRecord/addRecord'
    });
  }
});