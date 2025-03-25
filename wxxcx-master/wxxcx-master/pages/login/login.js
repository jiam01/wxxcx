Page({
  data: {
    account: '',
    password: '',
    loading: false
  },
  handleCancel() {
    const pages = getCurrentPages(); // 获取当前页面栈
    if (pages.length === 1) { // 如果是第一个页面
      wx.reLaunch({
        url: '/pages/home/home'
      }); // 跳转到首页
    } else {
      wx.navigateBack({
        delta: 1
      }); // 返回上一级页面
    }
  },

  handleLogin(e) {
    this.setData({
      loading: true
    });
    const {
      account,
      password
    } = e.detail.value;

    wx.request({
      url: 'http://localhost:3000/login',
      method: 'POST',
      data: {
        account,
        password
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 登录成功，保存 token 和 account，并跳转回上一页
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('account', account);
          getApp().getUserInfo();

          // 显示登录成功的提示
          wx.showToast({
            title: '登录成功', // 提示内容
            icon: 'success', // 成功图标
            duration: 2000 // 持续时间（毫秒）
          });

          // 延迟跳转，确保提示框有足够时间展示
          setTimeout(() => {
            this.handleCancel();
          }, 2000);
        } else {
          // 登录失败，显示错误信息
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none'
          });
        }
      },
      complete: () => this.setData({
        loading: false
      })
    });
  },


});