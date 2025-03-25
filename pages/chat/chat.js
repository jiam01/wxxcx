Page({
  data: {
    doctor: {},
    messages: [],
    inputValue: '',
    isResponding: false,
    runtimeEnv: 'devtools' // 初始环境设置为开发者工具
  },

  onLoad(options) {
    // 检测运行环境
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      runtimeEnv: systemInfo.platform
    });
  
    // 默认医生信息（DeepSeek）
    const defaultDoctor = {
      id: 0,
      name: 'DeepSeek',
      avatar: 'http://localhost:3000/download/6d3b6701-94d1-4e01-b8b2-2b4ea80e3b44.jpg',
      title: '智能助手',
      specialty: 'DeepSeek随时为您解答问题'
    };
  
    // 检查是否传入了有效的参数
    if (options && options.doctorId && options.doctorName && options.doctorAvatar) {
      this.setData({
        doctor: {
          id: options.doctorId,
          name: decodeURIComponent(options.doctorName),
          avatar: decodeURIComponent(options.doctorAvatar)
        }
      });
    } else {
      // 如果没有传值，默认使用 DeepSeek
      this.setData({
        doctor: defaultDoctor
      });
    }
  
    // 输出传入的参数值
    console.log('传入的参数:', options);
    console.log('医生ID:', options?.doctorId || '未传值，默认为 DeepSeek');
    console.log('医生名称:', options?.doctorName ? decodeURIComponent(options.doctorName) : '未传值，默认为 DeepSeek');
    console.log('医生头像:', options?.doctorAvatar ? decodeURIComponent(options.doctorAvatar) : '未传值，默认为 DeepSeek');
  
    // 添加默认欢迎语
    const welcomeMessage = '亲爱的朋友，欢迎使用我们的“癌痛智慧化管理”小程序！在这里，我们致力于为您提供专业、便捷、贴心的癌痛管理服务。无论您是患者还是家属，都能在这个平台上找到实用的功能和温暖的支持。我们深知您所面临的挑战，所以精心打造了这个平台，希望能成为您抗击病痛路上的得力助手。感谢您的信任与选择，让我们携手共进，共同面对困难，迎接希望。';
    this.addMessage(welcomeMessage, 'system'); // 系统消息
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 新增二进制数据转换方法
  arrayBufferToString(buffer) {
    try {
      if (this.data.runtimeEnv === 'devtools') {
        return new TextDecoder().decode(buffer);
      }

      // 真机环境兼容方案
      const uint8Array = new Uint8Array(buffer);
      let str = '';
      for (let i = 0; i < uint8Array.length; i++) {
        str += String.fromCharCode(uint8Array[i]);
      }
      
      // 处理UTF-8中文（增强版）
      try {
        return decodeURIComponent(escape(str));
      } catch (e) {
        // 降级处理：正则替换非常见字符
        return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
      }
    } catch (e) {
      console.error('二进制转换失败:', e);
      return '';
    }
  },

  sendMessage() {
    const { inputValue, doctor } = this.data;
    if (!inputValue.trim()) return;

    // 检查是否是 DeepSeek
    if (doctor.id != 0) {
      wx.showToast({
        title: '该医生暂未开通在线咨询',
        icon: 'none'
      });
      return;
    }

    this.setData({ isResponding: true });
    this.addMessage(inputValue, 'user');
    this.setData({ inputValue: '' });

    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastReceivedTime = Date.now();
    let responseBuffer = '';
    let activeTask = null;

    const retryTimer = setInterval(() => {
      if (Date.now() - lastReceivedTime > 10000 && this.data.isResponding) {
        if (retryCount < MAX_RETRIES) {
          console.warn(`网络超时，第${retryCount + 1}次重试...`);
          retryCount++;
          startRequest();
        } else {
          clearInterval(retryTimer);
          this.setData({ isResponding: false });
          wx.showToast({ title: '网络连接失败', icon: 'none' });
        }
      }
    }, 10000);

    const startRequest = () => {
      if (activeTask) {
        activeTask.abort();
      }

      activeTask = wx.request({
        url: 'http://localhost:3000/api/chat-stream',
        method: 'POST',
        data: JSON.stringify({ prompt: inputValue }),
        header: { 'Content-Type': 'application/json' },
        enableChunked: true,
        responseType: 'text',
        success: () => {
          clearInterval(retryTimer);
          this.setData({ isResponding: false });
        },
        fail: (err) => {
          console.error('请求失败:', err);
          this.setData({ isResponding: false });
        }
      });

      activeTask.onChunkReceived(res => {
        try {
          lastReceivedTime = Date.now();
          retryCount = 0;

          // 使用兼容方法处理二进制数据
          const chunkData = typeof res.data === 'string' 
            ? res.data 
            : this.arrayBufferToString(res.data);

          responseBuffer += chunkData;

          while (responseBuffer.includes('\n\n')) {
            const packetEnd = responseBuffer.indexOf('\n\n');
            const rawPacket = responseBuffer.slice(0, packetEnd);
            responseBuffer = responseBuffer.slice(packetEnd + 2);

            const validChunks = rawPacket.split(/(data: |id: )/g)
              .filter(item => {
                // 增强过滤逻辑
                const isValid = item.startsWith('{') || 
                              item === '[DONE]' || 
                              item.startsWith('"content":');
                return isValid;
              })
              .map(item => {
                const cleanItem = item
                  .replace(/^data: /, '')
                  .replace(/^id: \d+\n/, '')
                  .replace(/\\n/g, '\n'); // 处理换行符
                return cleanItem === '[DONE]' ? '[DONE]' : cleanItem;
              });

            validChunks.forEach(rawChunk => {
              try {
                if (rawChunk === '[DONE]') {
                  this.finalizeMessage();
                  return;
                }

                // 处理不完整JSON
                const sanitizedChunk = rawChunk
                  .replace(/([\w\]"'])(?={)/g, '$1,') // 修复缺失逗号
                  .replace(/,(\s*})/g, '$1'); // 移除多余逗号

                const data = JSON.parse(sanitizedChunk);
                const choice = data.choices?.[0]?.delta;
                const content = choice?.reasoning_content || choice?.content;

                if (content) {
                  this.updateLastMessage(content);
                }

                if (choice?.role === 'assistant') {
                  this.addMessage('', 'assistant');
                }
              } catch (e) {
                console.warn('解析JSON失败:', rawChunk);
              }
            });
          }
        } catch (err) {
          console.error('分块处理失败:', err);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(startRequest, 1000 * retryCount);
          }
        }
      });
    };

    startRequest();

    this.onUnload = () => {
      clearInterval(retryTimer);
      if (activeTask) activeTask.abort();
      this.setData({ isResponding: false });
    };
  },

  addMessage(content, sender) {
    // 只在用户发送消息时进行检查
    if (sender === 'user' && this.data.doctor.id != 0) {
      wx.showToast({
        title: '该医生暂未开通在线咨询',
        icon: 'none'
      });
      return;
    }

    const messages = [...this.data.messages];
    messages.push({
      id: Date.now(),
      content: content + (sender === 'assistant' ? '▌' : ''),
      sender: sender
    });
    this.setData({ messages });
  },

  updateLastMessage(content) {
    const messages = [...this.data.messages];
    const lastIndex = messages.length - 1;

    messages[lastIndex] = {
      ...messages[lastIndex],
      content: messages[lastIndex].content.replace(/▌/g, '') + content + '▌'
    };

    this.setData({ messages });
  },

  finalizeMessage() {
    const messages = [...this.data.messages];
    const lastIndex = messages.length - 1;

    messages[lastIndex] = {
      ...messages[lastIndex],
      content: messages[lastIndex].content.replace(/▌/g, ''),
      id: Date.now()
    };

    this.setData({ messages });
  },

  onUnload() {
    this.setData({ isResponding: false });
  },
  onShow: function() {
 
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1  //这个数字是当前页面在tabBar中list数组的索引
      })
    }
}
});