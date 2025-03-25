Page({

  /**
   * 页面的初始数据
   */
  data: {
    healthArticles: [
      { id: 1, cover: 'http://localhost:3000/download/55d29d95-84a4-4fe9-9d86-15743bbd8e82.jpg', title: '如何预防感冒' },
      { id: 2, cover: 'http://localhost:3000/download/df52ba18-7efc-4423-976b-94e97eb64057.jpg', title: '健康饮食指南' },
      { id: 3, cover: 'http://localhost:3000/download/87705c68-ff3a-4e52-8900-948e6d89d133.jpg', title: '睡眠与健康的密切关系' },
      // 更多文章数据...
    ],
  },

  /**
   * 查看文章详情
   */
  viewArticle: function (e) {
    const articleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/articleDetail/articleDetail?id=${articleId}`
    });
  },

  /**
   * 页面跳转方法
   */
  navigateToPage: function (e) {
    const page = e.currentTarget.dataset.page; // 获取按钮绑定的页面标识
    let url = ''; // 跳转路径

    // 根据页面标识设置跳转路径
    switch (page) {
      case 'healthEducation':
        url = '/pages/news/news'; // 健康宣教页面
        break;
      case 'onlineCare':
        url = '/pages/message/message'; // 线上护理页面
        break;
      case 'onlineSurvey':
        url = '/pages/manage/manage'; // 在线问卷页面
        break;
      case 'faq':
        url = '/pages/faq/faq'; // 常见问题页面
        break;
      default:
        wx.showToast({
          title: '页面未找到',
          icon: 'none'
        });
        return;
    }

    // 跳转到指定页面
    wx.navigateTo({
      url: url
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
 
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0  //这个数字是当前页面在tabBar中list数组的索引
      })
    }
},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
});