Page({
  data: {
    userInfo: {},
    genderOptions: ['男', '女'],
    account: '',
    token: '',
    loading: false,
    avatarFilePath: '',
    tempAvatarFilePath: ''
  },

  onLoad() {
    console.log("页面加载，开始初始化用户信息...");
    this.loadUserInfo();
  },

  loadUserInfo() {
    const account = wx.getStorageSync('account');
    const token = wx.getStorageSync('token');

    console.log("从本地存储中读取账号和 token:", { account, token });

    if (!account || !token) {
      console.error("未找到本地存储中的账号或 token");
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 2000);
      return;
    }

    this.setData({ account, token });

    wx.request({
      url: `http://localhost:3000/user?account=${account}&token=${token}`,
      method: 'GET',
      header: { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
      success: (res) => {
        console.log("用户信息请求成功，返回数据:", res.data);
        if (res.statusCode === 200) {
          const userInfo = res.data;
          wx.setStorageSync('userInfo', userInfo);
          wx.setStorageSync('token', userInfo.token);
          this.setData({ userInfo, loading: false });
        } else {
          console.error("获取用户信息失败，状态码:", res.statusCode, "消息:", res.data.message);
          wx.showToast({ title: res.data.message || '获取信息失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error("用户信息请求失败:", err);
        this.handleNetworkError(err);
      }
    });
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        console.log("选择头像成功，临时文件路径:", tempFilePath);
        this.setData({ 
          avatarFilePath: tempFilePath,
          tempAvatarFilePath: tempFilePath
        });
      },
      fail: (err) => {
        console.error("选择头像失败:", err);
      }
    });
  },

  onGenderChange(e) {
    const selectedSex = this.data.genderOptions[e.detail.value];
    console.log("性别选择改变，新值:", selectedSex);
    this.setData({ 'userInfo.user_sex': selectedSex });
  },

  submitForm(e) {
    const { username, true_name, user_sex } = e.detail.value;

    console.log("表单提交，接收到的数据:", { username, true_name, user_sex });

    if (!username) {
      wx.showToast({ title: '用户名不能为空', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    const updatedInfo = { username, true_name: true_name || '', user_sex: user_sex || '' };
    const token = wx.getStorageSync('token');

    if (this.data.avatarFilePath) {
      console.log("检测到有新的头像文件，准备上传...");
      this.uploadAvatar(updatedInfo, token);
    } else {
      console.log("无头像更新，直接更新用户信息...");
      this.updateUserInfo(updatedInfo, token);
    }
  },

  uploadAvatar(updatedInfo, token) {
    const { account, avatarFilePath } = this.data;

    console.log("开始上传头像，文件路径:", avatarFilePath);

    // 输出即将上传的头像内容
    console.log("即将上传的头像相关信息:", {
      account,
      token,
      filePath: avatarFilePath,
      formData: { account, token }
    });

    wx.uploadFile({
      url: `http://localhost:3000/upload?account=${account}&token=${token}`,
      filePath: avatarFilePath,
      name: 'image',
      formData: { account, token },
      success: (res) => {
        const data = JSON.parse(res.data);
        console.log("头像上传成功，返回数据:", data);
        if (res.statusCode === 200) {
          // 修正头像路径为完整URL
          updatedInfo.avatar = `http://localhost:3000${data.url}`;
          this.updateUserInfo(updatedInfo, token);
        } else {
          console.error("头像上传失败，状态码:", res.statusCode, "消息:", data.message);
          wx.showToast({ title: data.message || '头像上传失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error("头像上传失败:", err);
      },
      complete: () => this.setData({ loading: false })
    });
  },

  updateUserInfo(updatedInfo, token) {
    const { account } = this.data;
  
    console.log("即将更新的用户信息内容:", {
      account,
      token,
      updatedInfo
    });
  
    // 构造请求数据（替换FormData）
    const requestData = {
      ...updatedInfo,
      account: account,  // 明确添加必要参数
      token: token       // 根据接口需求决定是否保留
    };
  
    wx.request({
      url: `http://localhost:3000/user?account=${account}&token=${token}`,
      method: 'PATCH',
      data: JSON.stringify(requestData), // 确保数据序列化
      header: {
        'content-type': 'application/json', // 明确指定 JSON 类型
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
      success: (res) => {
        console.log("用户信息更新成功，返回数据:", res.data);
        if (res.statusCode === 200) {
          const newUserInfo = { ...this.data.userInfo, ...res.data.updatedFields };
  
          // 同步更新本地存储
          wx.setStorageSync('userInfo', newUserInfo);
          wx.setStorageSync('token', token);
  
          this.setData({
            userInfo: newUserInfo,
            avatarFilePath: '' // 清空临时头像路径
          });
  
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
  
          setTimeout(() => wx.navigateBack(), 2000);
        } else {
          console.error("更新失败，状态码:", res.statusCode, "消息:", res.data.message);
          wx.showToast({
            title: res.data.message || '更新失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error("请求失败:", err);
        this.handleNetworkError(err);
      },
      complete: () => {
        this.setData({ loading: false });
        console.log("请求流程结束");
      }
    });
  },

  handleNetworkError(err) {
    let errorMsg = '网络请求失败';
    if (err.errMsg.includes("timeout")) errorMsg = '请求超时';
    else if (err.errMsg.includes("fail")) errorMsg = '服务器连接失败';

    console.error("网络错误处理，错误信息:", errorMsg, "详细错误:", err);

    wx.showToast({ title: errorMsg, icon: 'none' });
  }
});