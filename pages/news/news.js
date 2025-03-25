Page({
  data: {
    currentTab: 'article', // 当前选中的选项卡
    list: [] // 新闻流数据
  },

  onLoad() {
    this.loadData('article'); // 默认加载文章数据
  },

  // 切换选项卡
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadData(tab);
  },

  // 加载数据
  loadData(type) {
    const mockData = {
      article: [
        { id: 1, title: '疼痛：如何评？何时评？怎么记？', subtitle: '', author: '肿瘤科护理', image: 'http://localhost:3000/download/640.jpg' },
        { id: 2, title: '文章标题2', subtitle: '副标题2', author: '作者B', image: 'https://via.placeholder.com/80' }
      ],
      video: [
        { id: 3, title: '五步描述法 让您正确描述疼痛', subtitle: '第一集', author: '肿瘤中心-淋巴肿瘤科', image: '/video/videos/a.png' },
        { id: 4, title: '癌痛的非药物止痛疗法', subtitle: '', author: '陈星宇', image: '/video/videos/b.png' },
        { id: 5, title: '走出误区，正确认识癌症', subtitle: '', author: '董庭庭', image: '/video/videos/c.png' },
        { id: 6, title: '走出癌痛治疗误区', subtitle: '', author: '雷铃铃', image: '/video/videos/d.png' },
        { id: 7, title: '疼痛评估知多少？', subtitle: '', author: '李宁宁', image: '/video/videos/e.png' }

      ]
    };
    this.setData({ list: mockData[type] });
  },

  // 跳转到详情页
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&type=${this.data.currentTab}`
    });
  }
});