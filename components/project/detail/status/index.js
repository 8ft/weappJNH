// components/project/status/index.js
Component({

  properties: {
    status:{
      type:String,
      value:''
    },
    character: {
      type: String,
      value: ''
    }
  },

  data: {
    content:{
      '2':{
        'publisher':{
          title: '招募专家',
          desc: '有专家申请你的项目了，快去选择心仪的TA！',
          img: 'zmzj'
        }
      },
      '3': {
        'publisher': {
          title: '待项目验收',
          desc: '我退回了验收，等待专家重新提交...',
          img: 'zmzj'
        },
        'applicant': {
          title: '待项目方验收',
          desc: '项目方发起验收不通过，请修改后重新提交验收',
          img: 'zmzj'
        }
      },
      '5': {
        'publisher': {
          title: '雇佣并付款',
          desc: '我发起了合作意向，等待专家确认...',
          img: 'zmzj'
        },
        'applicant':{
          title: '确认合作意向',
          desc: '项目方发起了合作意向，点击立即处理查看详情',
          img: 'zmzj'
        }
      },
      '6': {
        'publisher': {
          title: '雇佣并付款',
          desc: '专家已确认合作意向，快去付款吧！',
          img: 'zmzj'
        },
        'applicant': {
          title: '已确认合作',
          desc: '我已确认合作意向，等待项目方付款',
          img: 'zmzj'
        }
      },
      '7': {
        title: '招募专家',
        desc: '专家拒绝了合作，重新招募其他专家',
        img: 'zmzj'
      },
      '8': {
        'publisher': {
          title: '项目执行中',
          desc: '已完成付款，等待专家交付项目成果',
          img: 'zmzj'
        },
        'applicant': {
          title: '项目执行中',
          desc: '项目方已付款，请在交付日期前完成项目',
          img: 'zmzj'
        }
      },
      '10': {
        'publisher': {
          title: '待项目验收',
          desc: '专家已提交验收，点击处理验收查看详情',
          img: 'zmzj'
        },
        'applicant': {
          title: '待项目方验收',
          desc: '我已提交项目成果，等待项目方验收',
          img: 'zmzj'
        }
      },
      '11': {
        'publisher': {
          title: '合作完成',
          desc: '平台将在24小时内打款至专家账户',
          img: 'zmzj'
        },
        'applicant': {
          title: '合作完成',
          desc: '平台将在24小时内打款至你的账户',
          img: 'zmzj'
        }
      },
      '12': {
        title: '待项目验收',
        desc: '专家拒绝了合作，重新招募其他专家',
        img: 'zmzj'
      }
    }
  },

  methods: {

  }
})
