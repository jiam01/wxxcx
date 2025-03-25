// pages/addRecord/addRecord.js
Page({
  data: {
    cancerTypes: ['肺癌', '胃癌', '结直肠癌', '乳腺癌', '其他'],
    showOtherCancerInput: false,
    otherCancerType: '',
    selectedCancerIndex: 0,
    painLevel: 0,
    startTime: '',
    endTime: '',
    medicationName: '',
    dose: '',
    notes: '',
    painLocation: '' // 新增疼痛位置
  },

  // 癌症类别选择
  onCancerTypeChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedCancerIndex: index,
      showOtherCancerInput: index == 4, // 当选择"其他"时显示输入框
    });
    console.log('Selected Cancer Index:', index);
    console.log('Show Other Cancer Input:', index === 4);
  },

  onOtherCancerChange(e) {
    this.setData({
      otherCancerType: e.detail.value
    });
  },

  // 疼痛位置输入
  onPainLocationChange(e) {
    this.setData({
      painLocation: e.detail.value
    });
  },

// 计算疼痛等级对应的颜色
getPainLevelColor(level) {
  // 定义颜色范围
  const startColor = [40, 167, 69]; // 绿色 (#28a745)
  const midColor = [255, 193, 7];  // 黄色 (#ffc107)
  const endColor = [220, 53, 69];  // 红色 (#dc3545)

  if (level <= 5) {
    // 0-5: 绿色到黄色
    const ratio = level / 5;
    const r = Math.round(startColor[0] + (midColor[0] - startColor[0]) * ratio);
    const g = Math.round(startColor[1] + (midColor[1] - startColor[1]) * ratio);
    const b = Math.round(startColor[2] + (midColor[2] - startColor[2]) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // 6-10: 黄色到红色
    const ratio = (level - 5) / 5;
    const r = Math.round(midColor[0] + (endColor[0] - midColor[0]) * ratio);
    const g = Math.round(midColor[1] + (endColor[1] - midColor[1]) * ratio);
    const b = Math.round(midColor[2] + (endColor[2] - midColor[2]) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }
},

// 疼痛等级变化
onPainLevelChange(e) {
  const painLevel = e.detail.value;
  this.setData({
    painLevel,
    painLevelColor: this.getPainLevelColor(painLevel) // 更新颜色
  });
},

  // 开始时间选择
  onStartTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    });
  },

  // 结束时间选择
  onEndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    });
  },

  // 药物名称输入
  onMedicationNameChange(e) {
    this.setData({
      medicationName: e.detail.value
    });
  },

  // 剂量输入
  onDoseChange(e) {
    this.setData({
      dose: e.detail.value
    });
  },

  // 备注输入
  onNotesChange(e) {
    this.setData({
      notes: e.detail.value
    });
  },

  // 保存记录
  // 修改后的保存记录方法
  saveRecord() {
    const {
      selectedCancerIndex,
      showOtherCancerInput,
      otherCancerType,
      cancerTypes, // 从data中解构
      painLevel,
      startTime,
      endTime,
      medicationName,
      dose,
      notes,
      painLocation
    } = this.data;

    if (showOtherCancerInput && !otherCancerType) {
      wx.showToast({
        title: '请填写癌症类型',
        icon: 'none'
      });
      return;
    }

    const newRecord = {
      date: new Date().toLocaleDateString(),
      cancerType: showOtherCancerInput ? otherCancerType : cancerTypes[selectedCancerIndex],
      painLevel,
      startTime,
      endTime,
      medicationName,
      dose,
      notes,
      painLocation
    };

    // 后续存储逻辑保持不变...

    let records = wx.getStorageSync('records') || [];
    records.unshift(newRecord); // 将新记录添加到最前面

    wx.setStorageSync('records', records);

    wx.showToast({
      title: '记录已保存',
      icon: 'success'
    });

    wx.navigateBack(); // 返回上一页
  }
});