Page({
  data: {
    detail: {}
  },

  onLoad(options) {
    const { id, type } = options;
    const mockData = {
      article: {
        1: { title: '疼痛：如何评？何时评？怎么记？', subtitle: '', author: '肿瘤科护理', image: 'https://via.placeholder.com/200', content: '    <h1>疼痛：如何评？何时评？怎么记？</h1>          <!-- 来源 -->     <p><strong>来源：</strong>肿瘤科护理公众号<br>        长沙知护网络科技有限公司<br>        中国肿瘤护理学习平台，突出专业性、实用性，主要以PPT、图文等多维度展示肿瘤护理前沿成果、临床经验</p>     <!-- WHO疼痛分级标准 -->     <h2>一、WHO疼痛分级标准</h2>     <table border="1" cellpadding="5" cellspacing="0">         <tr>             <th>疼痛等级</th>             <th>分值范围</th>             <th>描述</th>         </tr>         <tr>             <td>0级</td>             <td>0分</td>             <td>无疼痛</td>         </tr>         <tr>             <td>1级</td>             <td>1~3分</td>             <td>轻度疼痛：平卧时无疼痛，翻身咳嗽时有轻度疼痛，但可以忍受，睡眠不受影响</td>         </tr>         <tr>             <td>2级</td>             <td>4~6分</td>             <td>中度疼痛：静卧时痛，翻身咳嗽时加剧，不能忍受，睡眠受干扰，要求用镇痛药</td>         </tr>         <tr>             <td>3级</td>             <td>7~10分</td>             <td>重度疼痛：静卧时疼痛剧烈，不能忍受，睡眠严重受干扰，需要用镇痛药</td>         </tr>     </table>     <!-- 疼痛量化评估方法 -->     <h2>二、疼痛量化评估方法</h2>     <h3>1. 数字评定量表法（NRS）</h3>     <ul>         <li><strong>评分范围：</strong>0~10分</li>         <li><strong>评分含义：</strong>             <ul>                 <li>0：无痛</li>                 <li>1~3：轻度疼痛（疼痛尚不影响睡眠）</li>                 <li>4~6：中度疼痛</li>                 <li>7~9：重度疼痛（不能入睡或睡眠中痛醒）</li>                 <li>10：剧痛</li>             </ul>         </li>         <li><strong>使用方法：</strong>询问患者疼痛的严重程度，让患者选择一个最能代表自身疼痛程度的数字。</li>     </ul>     <p><strong>图1：数字评定量表示意图</strong></p>     <img src="https://example.com/image1.png" alt="数字评定量表示意图">     <h3>2. 面部表情疼痛量表法（FPS）</h3>     <ul>         <li><strong>描述：</strong>通过从快乐到悲伤及哭泣的6个不同面容表情来评估疼痛程度。</li>         <li><strong>适用人群：</strong>包括语言表达能力有限的幼儿或特殊患者。</li>     </ul>     <p><strong>图2：面部表情疼痛量表示意图</strong></p>     <img src="https://example.com/image2.png" alt="面部表情疼痛量表示意图">     <h3>3. 言语描述量表（VRS）</h3>     <ul>         <li><strong>评分等级：</strong>无痛、轻度疼痛、中度疼痛、重度疼痛、极度疼痛</li>         <li><strong>特点：</strong>词语易于理解，沟通方便，但不适合语言表达障碍患者。</li>     </ul>     <!-- 疼痛评估频率 -->     <h2>三、疼痛评估频率</h2>     <h3>1. 常规评估时间点</h3>     <ul>         <li><strong>入院/转科病人：</strong>2小时内完成首次评估。</li>         <li><strong>急诊评估：</strong>15分钟内完成。</li>     </ul>     <h3>2. 日常评估频率</h3>     <table border="1" cellpadding="5" cellspacing="0">         <tr>             <th>疼痛评分范围</th>             <th>评估频率</th>             <th>记录方式</th>         </tr>         <tr>             <td>≤3分</td>             <td>每日常规评估一次（14:00）</td>             <td>记录在体温单上</td>         </tr>         <tr>             <td>≥4分</td>             <td>每班评估一次（06:00、14:00、22:00）</td>             <td>记录在体温单和护理记录单上</td>         </tr>     </table>     <h3>3. 特殊情况评估</h3>     <ul>         <li><strong>术后使用镇痛泵患者：</strong>每天至少评估一次，出现疼痛时按相应要求评估。</li>         <li><strong>爆发性疼痛：</strong>立即评估。</li>         <li><strong>用药后评估：</strong>             <ul>                 <li>口服药物后60分钟</li>                 <li>皮下或肌肉注射后30分钟</li>                 <li>静脉用药后15分钟</li>             </ul>         </li>     </ul>     <!-- 疼痛记录方法 -->     <h2>四、疼痛记录方法</h2>     <h3>1. 体温单记录</h3>     <ul>         <li><strong>符号：</strong>疼痛评分以红点“●”表示，相邻两次疼痛评分之间用红线相连。</li>         <li><strong>重度疼痛处理后复评：</strong>记录在护理记录单上，并以红“○”表示，用红虚线连接前后评分。</li>     </ul>     <h3>2. 护理记录单记录</h3>     <ul>         <li><strong>首次评估：</strong>患者入院2小时内完成首次疼痛评估，如评分≥4分，需在6小时内完成全面评估并书写护理记录单。</li>         <li><strong>详细记录内容：</strong>             <ul>                 <li><strong>疼痛部位：</strong>如胸部、背部、腰部、腹部或全身等。</li>                 <li><strong>疼痛性质：</strong>如钝痛、刺痛、酸痛、胀痛、搏动痛、压迫性痛、痉挛痛、刀割痛、烧灼痛、电击痛、坠痛、放射痛、牵扯痛等。</li>                 <li><strong>疼痛强度：</strong>选择合适的评估工具（如NRS），记录评分。</li>             </ul>         </li>         <li><strong>干预措施记录：</strong>遵医嘱给予干预措施后，及时记录效果评估，观察生命体征和药物不良反应。</li>     </ul>     <!-- 总结 -->     <h2>五、总结</h2>     <p>疼痛评估是肿瘤科护理的重要环节，通过科学的评估工具和规范的记录方法，能够有效帮助医护人员了解患者的疼痛状况，制定个性化的治疗方案。希望以上内容对您的工作有所帮助！</p>     <!-- 温馨提示 -->     <p><strong>温馨提示：</strong>本文内容仅供参考，请结合实际情况和临床指南使用。</p>     <!-- 来源 -->     <p><strong>来源：</strong>肿瘤科护理公众号<br>        <strong>排版：</strong>肿瘤科护理公众号</p>     <!-- 二维码 -->     <p><strong>扫描下方二维码，关注更多内容：</strong></p>     <img src="https://example.com/qrcode.png" alt="二维码">' },
        2: { title: '文章标题2', subtitle: '副标题2', author: '作者B', image: 'https://via.placeholder.com/200', content: '这是文章内容2' }
      },
      video: {
        3: {
          title: '五步描述法让您正确描述疼痛',
          subtitle: '第1集',
          author: '肿瘤中心-淋巴肿瘤科',
          content: {
            type: 'video',
            src: 'http://localhost:3000/download/test.mp4'
          }
        },
        4: {
          title: '癌痛的非药物止痛疗法',
          subtitle: '',
          author: '陈星宇',
          content: {
            type: 'video',
            src: 'http://localhost:3000/download/陈星宇.mp4'
          }
        },
      }
    };
    this.setData({ detail: mockData[type][id] });
  }
});