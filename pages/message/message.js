Page({
  data: {
    categories: [{
        id: 1,
        name: '内科'
      },
      {
        id: 2,
        name: '外科'
      },
      {
        id: 3,
        name: '儿科'
      },
      {
        id: 4,
        name: '妇科'
      },
      {
        id: 5,
        name: '眼科'
      }
    ],
    currentCategory: 1,
    doctors: [{
        id: 1,
        avatar: 'http://localhost:3000/download/1fc74afa-19fc-4576-9bc2-3007d3a26a01.png',
        name: '张医生',
        title: '主任医师',
        specialty: '擅长肿瘤放射治疗',
        category: 1
      },
      {
        id: 2,
        avatar: 'http://localhost:3000/download/1b683a2a-fe8c-41ef-bab1-70478c41daaa.png',
        name: '李医生',
        title: '副主任医师',
        specialty: '擅长靶向治疗',
        category: 2
      },
      {
        id: 3,
        avatar: 'http://localhost:3000/download/ac3d570f-4c2e-4eae-97d4-a4ade2ad3814.png',
        name: '王医生',
        title: '主任医师',
        specialty: '擅长遗传筛查',
        category: 3
      },
      {
        id: 3,
        avatar: 'https://pic.ibaotu.com/23/04/28/translate/1101363846532313188.png!ww7002',
        name: '宋医生',
        title: '主任医师',
        specialty: '擅长消化系统肿瘤治疗',
        category: 3
      },
      {
        id: 3,
        avatar: 'https://img95.699pic.com/photo/50714/5461.jpg_wh860.jpg',
        name: '冯医生',
        title: '主任医师',
        specialty: '擅长乳腺癌，妇科肿瘤治疗',
        category: 3
      },
      {
        id: 3,
        avatar: 'https://img95.699pic.com/photo/50190/0871.jpg_wh860.jpg',
        name: '安医生',
        title: '主任医师',
        specialty: '擅长肿瘤临床治疗',
        category: 3
      }
    ],
    filteredDoctors: [],
    searchKeyword: '',
    chatOption: {
      id: 0, // 使用一个唯一的ID，避免与医生ID冲突
      avatar: 'http://localhost:3000/download/6d3b6701-94d1-4e01-b8b2-2b4ea80e3b44.jpg', // 聊天选项的图标
      name: 'DeepSeek', // 聊天选项的名称
      title: '智能助手', // 聊天选项的标题
      specialty: 'DeepSeek随时为您解答问题', // 聊天选项的描述
      category: 0 // 使用一个唯一的分类ID，避免与医生分类冲突
    }
  },

  onLoad() {
    this.setData({
      filteredDoctors: [this.data.chatOption, ...this.data.doctors]
    });
  },

  // 选择分类
  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      currentCategory: categoryId
    });

    const filteredDoctors = this.data.doctors.filter(doctor => doctor.category === categoryId);
    this.setData({
      filteredDoctors
    });
  },

  // 输入搜索关键词
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 执行搜索
  onSearch() {
    const keyword = this.data.searchKeyword.toLowerCase();
    const filteredDoctors = this.data.doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(keyword) ||
      doctor.specialty.toLowerCase().includes(keyword)
    );
    this.setData({
      filteredDoctors
    });
  },

  // 跳转到聊天页面
  goToChat(e) {
    const doctor = e.currentTarget.dataset.doctor;
    if (doctor.id === 0) {
      // 处理聊天选项的点击事件
      wx.navigateTo({
        url: `/pages/chat/chat?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}&doctorAvatar=${encodeURIComponent(doctor.avatar)}`
      });
    } else {
      // 处理医生选项的点击事件
      wx.navigateTo({
        url: `/pages/chat/chat?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}&doctorAvatar=${encodeURIComponent(doctor.avatar)}`
      });
    }
  },
});