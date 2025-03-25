Page({
  data: {
    account: '',
    password: '',
    loading: false
  },

  handleRegister(e) {
    this.setData({ loading: true });
    const { account, password } = e.detail.value;

    wx.request({
      url: 'http://localhost:3000/register',
      method: 'POST',
      data: { account, password },
      success: (res) => {
        if (res.statusCode === 201) {
          // 注册成功，保存 token 和 account，并跳转回上一页
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('account', account);
          getApp().getUserInfo();

          // 显示注册成功的提示
          wx.showToast({
            title: '注册成功', // 提示内容
            icon: 'success',  // 成功图标
            duration: 2000     // 持续时间（毫秒）
          });

          // 延迟跳转，确保提示框有足够时间展示
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        } else {
          // 注册失败，显示错误信息
          wx.showToast({
            title: res.data.message || '注册失败',
            icon: 'none'
          });
        }
      },
      complete: () => this.setData({ loading: false })
    });
  },
  handleCancel() {
    const pages = getCurrentPages(); // 获取当前页面栈
    if (pages.length === 1) { // 如果是第一个页面
      wx.reLaunch({ url: '/pages/home/home' }); // 跳转到首页
    } else {
      wx.navigateBack({ delta: 1 }); // 返回上一级页面
    }
  }
});