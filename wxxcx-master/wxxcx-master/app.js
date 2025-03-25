App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    const token = wx.getStorageSync('token');
    const account = wx.getStorageSync('account');

    if (token && account) {
      this.autoLogin(account, token);
    } else {
      wx.redirectTo({ url: '/pages/login/login' });
    }
  },

  async autoLogin(account, token) {
    wx.showLoading({ title: '自动登录中', mask: true });
    try {
      const res = await wx.request({
        url: 'http://localhost:3000/login',
        method: 'POST',
        data: { account, token },
        timeout: 5000
      });

      if (res.statusCode === 200) {
        wx.setStorageSync('token', res.data.token);

        // 添加自动登录成功的提示
        wx.showToast({
          title: '自动登录成功', // 提示内容
          icon: 'success',       // 成功图标
          duration: 2000         // 持续时间（毫秒）
        });

        // 获取用户信息并跳转到首页
        await this.getUserInfo(res.data.token);
        wx.switchTab({ url: '/pages/mine/mine' });
      } else {
        this.clearCacheAndRedirect();
      }
    } catch (error) {
      this.clearCacheAndRedirect();
    } finally {
      wx.hideLoading();
    }
  },

  async getUserInfo() {
    const account = wx.getStorageSync('account');
    const token = wx.getStorageSync('token');
    try {
      const res = await wx.request({
        url: 'http://localhost:3000/user',
        method: 'GET',
        data: { account, token }
      });

      if (res.statusCode === 200) {
        wx.setStorageSync('username', res.data.username);
        wx.setStorageSync('avatar', res.data.avatar || ''); // 添加默认值
        this.globalData.userInfo = res.data;
        return true;
      }
      return false;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return false;
    }
  },

  clearCacheAndRedirect() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('account');
    wx.showToast({
      title: '登录过期，请重新登录',
      icon: 'none'
    });
    wx.redirectTo({ url: '/pages/login/login' });
  }
});