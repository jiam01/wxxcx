Page({
  data: {
    userInfo: null, // 用户信息
    loading: true // 加载状态
  },

  onLoad() {
    console.log("页面加载，开始获取用户信息...");
    this.getUserInfo();
  },

  onShow() {
    // 页面显示时自动更新数据
    console.log("页面显示，尝试更新用户信息...");
    this.getUserInfo();
  },

  async getUserInfo() {
    // 获取本地存储中的 account 和 token
    const account = wx.getStorageSync('account');
    const token = wx.getStorageSync('token');

    if (!account || !token) {
      console.warn("本地存储中未找到账号或 token，无法获取用户信息。");
      this.setData({ 
        userInfo: null, 
        loading: false 
      });

      // 提示用户未登录，并跳转到登录页面
      wx.showToast({
        title: '未登录，请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    console.log("从本地存储中获取到账号和 token，准备请求服务器获取用户信息...", account, token);

    // 发起网络请求
    wx.request({
      url: 'http://localhost:3000/user',
      method: 'GET',
      data: { account, token },
      success: (res) => {
        console.log("服务器响应数据:", res.data);

        if (res.statusCode === 200) {
          const newUserInfo = res.data;

          // 检查返回的数据是否符合预期
          if (!newUserInfo.username) {
            console.error("服务器返回的用户信息不完整，缺少 username 字段。");
            wx.showToast({
              title: '用户信息不完整，请重试',
              icon: 'none'
            });
            this.setData({ loading: false });
            return;
          }

          console.log("成功获取用户信息:", newUserInfo);

          // 比较新旧用户信息是否有变化
          const currentUserInfo = this.data.userInfo;
          console.log("原值:", currentUserInfo);
          const hasChanged =
            !currentUserInfo ||
            currentUserInfo.username !== newUserInfo.username ||
            currentUserInfo.avatar !== newUserInfo.avatar ||
            currentUserInfo.true_name !== newUserInfo.true_name ||
            currentUserInfo.user_sex !== newUserInfo.user_sex;

          if (hasChanged) {
            // 更新本地存储
            wx.setStorageSync('username', newUserInfo.username);
            wx.setStorageSync('avatar', newUserInfo.avatar || '');
            wx.setStorageSync('token', newUserInfo.token);

            // 更新页面数据
            this.setData({
              userInfo: newUserInfo,
              loading: false
            });

            // 显示加载成功的提示
            wx.showToast({
              title: '加载完成',
              icon: 'success'
            });
          } else {
            // 如果没有变化，直接隐藏加载状态
            this.setData({ loading: false });
            console.log("用户信息未发生变化，无需显示加载完成提示。");
          }
        } else {
          console.error("服务器返回错误状态码:", res.statusCode);
          wx.showToast({
            title: '加载失败，请重试',
            icon: 'none'
          });
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err);

        // 网络请求失败提示
        wx.showToast({
          title: '网络请求失败，请检查网络',
          icon: 'none'
        });

        this.setData({ loading: false });
      },
      complete: () => {
        console.log("隐藏加载提示...");
        wx.hideLoading();
      }
    });
  },

  // 通用跳转方法
  navigateToPage(url) {
    wx.navigateTo({
      url
    });
  },

  handleLogin() {
    this.navigateToPage('/pages/login/login');
  },

  navigateToEdit() {
    // 将用户信息存入本地存储，供编辑页面使用
    wx.setStorageSync('userInfo', this.data.userInfo);
    this.navigateToPage('/pages/editUserInfo/editUserInfo');
  },

  // 登出方法
  logout() {
    wx.showModal({
      title: '确认登出',
      content: '您确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击了确定，执行登出操作...');

          // 清除本地存储中的用户信息
          wx.removeStorageSync('account');
          wx.removeStorageSync('token');
          wx.removeStorageSync('username');
          wx.removeStorageSync('avatar');

          // 重置页面数据
          this.setData({
            userInfo: null,
            loading: false
          });

          // 提示用户已登出
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000
          });

          // 跳转到登录页面
          setTimeout(() => {
            this.navigateToPage('/pages/login/login');
          }, 2000);
        } else if (res.cancel) {
          console.log('用户点击了取消，保持当前状态...');
        }
      }
    });
  },
  onShow: function() {
 
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2  //这个数字是当前页面在tabBar中list数组的索引
      })
    }
}
});