<template>
    <div>
        <!-- 导航栏 -->
        <div class="navigation" @click="handList($event)" id="approve">
          <li v-for="(item, index) in navList" :key="item.id" :index='index'>{{ item.name }}</li>
        </div>
        <!-- 搜索栏 -->
        <div class="operation">
          <a href="#">收货人姓名：</a>
          <input type="text" v-model.trim="getList.employeeName">
          <a href="#">订单编号：</a>
          <input type="number" v-model.trim="getList.employeeID">
          <a href="#">电话号码：</a>
          <input type="number" v-model.trim="getList.phone">
          <a href="#" v-show="inputShow">物流单号：</a>
          <input type="text" v-model.trim="getList.number" v-show="inputShow">
          <div @click="queryLists"><span class="iconfont icon-search"></span>查询</div>
        </div>
        <!-- 表格区域 -->
        <div class="view">
          <div>后台订单列表</div>
          <table>
            <tr>
              <th><input type="checkbox" ref="checkboxRef" @click="checkAll" id="checkAllId"/>全选</th>
              <th>姓名</th>
              <th>订单编号</th>
              <th>商品</th>
              <th>数量</th>
              <th>收货地址</th>
              <th>电话</th>
              <th>物流信息</th>
              <th>下单时间</th>
              <th>状态</th>
              <th>{{ caozuo }}</th>
            </tr>
            <tr v-if="dataList.length == 0">
              <td colspan="13">无数据</td>
            </tr>
            <tr v-for="data in dataList" :key="data.id" v-else>
              <td><input type="checkbox" @click="multiple" :index="data.id" class="multipleC"/></td>
              <td>{{ data.employeeName }}</td>
              <td>{{ data.employeeID }}</td>
              <td>{{ data.commodity }}</td>
              <td>{{ data.amount }}</td>
              <td>{{ data.address }}</td>
              <td>{{ data.phone }}</td>
              <td>{{ data.number }}</td>
              <td>{{ data.time | dateFormat}}</td>
              <td>{{ data.staus }}</td>
              <td>
                <a v-if="getList.navigation === 0" class="btnOperation" @click="editNumber(data.id)"><span class="iconfont icon-icon_huabanfuben"></span>发货</a>
                <a v-else-if="getList.navigation === 1" class="btnOperation" @click="stausEditId(data.id)"><span class="iconfont icon-icon"></span>新建事务</a>
                <a v-else>{{ data.cangku }}</a>
              </td>
            </tr>
          </table>
        </div>
         <!-- 翻页按钮组 -->
        <paging :pagSum="sum" :pagStart="getList.start" @pagEvent='handleEvent($event)'></paging>
        <!-- 发货添加物流单号面板面板 -->
        <div class="shade" v-show="shadeShow"></div>
        <div class="edit" v-show="shadeShow">
            <div>发货</div>
            <div>
              <div>
                <a href="#">物流单号：</a>
                <input type="text" class="input1" v-model="editList.number">
              </div>
              <div><button class="yes" @click="newRecordOn">确认</button><button @click="shadeShowEdit">取消</button></div>
            </div>
        </div>
        <!-- 待收货弹窗操作面板 -->
          <div class="shade" v-show="stausEditShow"></div>
          <div class="editAffair" v-show="stausEditShow">
            <div>状态<img src="@/assets/images/off.png" alt="" @click="stausOff"></div>
            <div>
              <a href="#" class="message">姓名：{{ stausList[0].employeeName }}</a>
              <a href="#" class="message">订单编号：{{ stausList[0].employeeID }}</a>
              <a href="#" class="message">原始物流单号：{{ stausList[0].number }}</a>
              <div>
                <a href="#">{{statusTab}}</a><div>{{ statusText }}</div>
              </div>
              <button @click="received">已收货</button>
              <button @click="editRecord">发货</button>
              <button @click="stausOff">取消</button>
            </div>
            <!-- 添加物流单号-->
            <div class="editRecord" v-show="editRecordShow"></div>
            <div class="editRecords" v-show="editRecordShow">
              <div>发货</div>
              <div>
                <div>
                  <a href="#">物流单号：</a>
                  <input type="text" class="input1" v-model="editList.orderNumber">
                </div>
                <div><button class="yes" @click="editRecordOn">确认</button><button @click="editRecordOff">取消</button></div>
              </div>
            </div>
          </div>
    </div>
</template>

<script>
import paging from '@/components/Paging.vue'
export default {
  data () {
    return {
      // 导航栏
      // navList: ['发货', '待收货', '已发货'],
      navList: [{ name: '发货', id: 0 }, { name: '待收货', id: 1 }, { name: '已发货', id: 2 }],
      // 提交服务端的数据
      getList: {
        navigation: 0,
        start: 1,
        limit: 12,
        employeeName: '',
        employeeID: '',
        phone: '',
        number: ''
      },
      // th标题
      caozuo: '操作',
      // 物流input框的显示隐藏
      inputShow: false,
      // 订单数据列表
      dataList: [],
      // 数据条数
      sum: 0,
      // 控制遮罩与添加物流面板的显示隐藏
      shadeShow: false,
      // 添加物流信息提交数据
      editList: {
        id: null,
        number: '',
        cangku: window.sessionStorage.employeeName,
        orderStatus: '',
        orderText: '',
        orderNumber: ''
      },
      // 新建事务面板状态显示
      stausEditShow: false,
      // 售后面板状态数据
      stausList: [{
        employeeName: '',
        employeeID: '',
        number: '',
        statusText: ''
      }],
      // 面板售后内容标题
      statusTab: '维修中：',
      // 面板售后内容
      statusText: '无',
      // 添加售后物流面板显示隐藏
      editRecordShow: false,
      // 面板id暂存
      boxId: null
    }
  },
  mounted () {
    // 默认高亮
    const div = document.getElementById('approve')
    div.getElementsByTagName('li')[this.getList.navigation].className = 'pitch'
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 发送请求获取订单列表
    async getDataList () {
      const { data: res } = await this.$http.get('/getmanagement', { params: this.getList })
      // console.log(res)
      if (res.success !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      this.dataList = res.message
      // this.$message.success('获取成功')
      this.sum = res.sum
      // console.log(this.sum)
    },
    // 点击导航栏时候的事件
    handList (e) {
      // console.log(e.target, e.target.getAttribute('index'), e.target.parentElement.getElementsByTagName('li'))
      this.getList.navigation = Number(e.target.getAttribute('index'))
      if (this.getList.navigation === 0) {
        this.caozuo = '操作'
        this.inputShow = false
        this.getList.number = ''
      } else if (this.getList.navigation === 1) {
        this.caozuo = '操作'
        this.inputShow = true
      } else {
        this.caozuo = '操作人'
        this.inputShow = true
      }
      // 将所有选项class清除
      for (let i = 0; i < e.target.parentElement.getElementsByTagName('li').length; i++) {
        e.target.parentElement.getElementsByTagName('li')[i].className = ''
      }
      // 将需要高亮的选项加上class
      e.target.parentElement.getElementsByTagName('li')[this.getList.navigation].className = 'pitch'
      this.getList.start = 1
      this.getDataList()
    },
    // 查询订单
    queryLists () {
      this.getList.start = 1
      this.getDataList()
    },
    // 全选事件函数
    checkAll () {
      var oth = document.getElementById('checkAllId')
      var otd = document.getElementsByClassName('multipleC')
      // console.log(oth.checked)
      if (oth.checked === true) {
        otd.forEach((item, index) => {
          item.checked = true
        })
      } else {
        otd.forEach((item, index) => {
          item.checked = false
        })
      }
    },
    // 单选事件
    multiple () {
      var oth = document.getElementById('checkAllId')
      var otd = document.getElementsByClassName('multipleC')
      var str = 0
      otd.forEach((item) => {
        if (item.checked === true) {
          str++
        }
      })
      if (str < this.commodityLists.length) {
        oth.checked = false
      } else if (str === this.commodityLists.length) {
        oth.checked = true
      }
    },
    // 组件子传父自定义事件函数
    handleEvent (ev) {
      // console.log(ev)
      if (ev <= Math.ceil(this.sum / 12)) {
        this.getList.start = Number(ev)
        this.dataList = []
        this.getDataList()
      }
      // console.log(this.getList.start)
    },
    // 发货物流录入面板
    editNumber (id) {
      this.editList.id = id
      this.shadeShow = true
    },
    // 控制隐藏弹出栏
    shadeShowEdit () {
      this.editList.number = ''
      this.shadeShow = false
    },
    // 取消新建事务物流添加
    editRecordOff () {
      this.editList.orderNumber = ''
      this.editList.orderText = ''
      this.editList.orderStatus = ''
      this.editRecordShow = false
    },
    // 新增售后物流单号
    editRecord () {
      this.editRecordShow = true
    },
    // 关闭新建事务状态面板
    stausOff () {
      this.editList.orderNumber = ''
      this.editList.orderText = ''
      this.editList.orderStatus = ''
      this.stausEditShow = false
    },
    // 打开售后状态面板
    async stausEditId (id) {
      const { data: res } = await this.$http.get('/orderId', { params: { id } })
      if (res.success !== 200) {
        return this.$message.error('获取事务信息失败')
      }
      this.editList.id = id
      this.boxId = id
      this.stausEditShow = true
      this.stausList = res.message
      if (this.stausList[0].staus === '维修中') {
        this.statusTab = '维修记录：'
        this.statusText = this.stausList[0].maintain
        this.editList.orderStatus = 'maintain'
      } else if (this.stausList[0].staus === '换货中') {
        this.statusTab = '换货记录：'
        this.statusText = this.stausList[0].exchange
        this.editList.orderStatus = 'exchange'
      } else {
        this.statusTab = '退货记录：'
        this.statusText = this.stausList[0].returns
        this.editList.orderStatus = 'returns'
      }
      console.log(this.stausList)
    },
    // 已收货
    async received () {
      this.editList.orderNumber = ''
      this.editList.orderText = '仓库已收货'
      const { data: res } = await this.$http.post('/logistics', this.editList)
      if (res.success !== 200) {
        return this.$message.error('操作失败，请重试')
      }
      this.$message.success('操作成功')
      this.editList.orderText = ''
      this.stausEditId(this.boxId)
    },
    // 提交售后订单发货物流提交
    async editRecordOn () {
      this.editList.orderText = ''
      if (this.editList.orderNumber === '') {
        return this.$message.error('请输入物流单号')
      }
      const { data: res } = await this.$http.post('/logistics', this.editList)
      if (res.success !== 200) {
        return this.$message.error('操作失败，请重试')
      }
      this.$message.success('操作成功')
      this.editList.orderNumber = ''
      this.getDataList()
      this.editRecordShow = false
      this.stausEditShow = false
    },
    // 新订单添加物流信息
    async newRecordOn () {
      this.editList.orderText = ''
      this.editList.orderNumber = ''
      if (this.editList.number === '') {
        return this.$message.error('请输入物流单号')
      }
      const { data: res } = await this.$http.post('/logistics', this.editList)
      if (res.success !== 200) {
        return this.$message.error('操作失败，请重试')
      }
      this.$message.success('操作成功')
      this.editList.number = ''
      this.getDataList()
      this.shadeShow = false
    }
  },
  components: {
    paging: paging
  }
}
</script>

<style lang="less" scoped>
  .navigation {
    margin-top: 1%;
    margin-left: 2%;
    overflow: hidden;
    li {
      float: left;
      margin-right: 5%;
      cursor: default;
    }
    .pitch {
      color: #fe7844;
    }
  }
  .operation {
    background-color: #fff;
    width: 97%;
    height: 50px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 20px;
    input {
      border: 1px solid #e7e7e7;
      background-color: #eeeeee;
      width: 12%;
      height: 28px;
      margin-right: 20px;
    }
    a {
      margin-left: 0.6%;
      line-height: 48px;
    }
    div {
      float: right;
      margin: 0 10px;
      font-size: 15px;
      width: 5.5%;
      color: #fff;
      height: 28px;
      text-align: center;
      line-height: 28px;
      margin-top: 11px;
      cursor: default;
      span {
        margin-right: 5px;
        color: #fff;
      }
    }
  }
  .operation>div:nth-child(9) {
    background-color: #fd4c4c;
    margin-right: 20px;
  }
  .operation>div:nth-child(10) {
    background-color: #33cc66;
  }
  // 表格
  .view {
    background-color: #fff;
    width: 97%;
    height: 90%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 20px;
    div {
      width: 99.5%;
      height: 40px;
      border-bottom: 1px solid #cccccc;
      margin: 0 10px;
      display: inline-block;
      line-height: 40px;
      position: relative;
      cursor: default;
      div {
        width: 125px;
        height: 28px;
        color: #fff;
        margin-left: 30px;
        background-color: #fe7844;
        position:absolute;
        top: 50%;
        text-align: center;
        line-height: 28px;
        transform: translateY(-50%);
      }
    }
    table {
      border-collapse: collapse;
      margin-top: 25px;
      margin-left: 10px;
      width: 99%;
      text-align: center;
      tr {
        // border: 1px solid #797979;
        height: 40px;
      }
      tr:hover {
        background-color: #cccccc;
        // color: #fff;
      }
      th {
        border: 1px solid #cccccc;
        background-color: #e2e2e2;
        font-size: 15px;
      }
      th:nth-child(11) {
        width: 120px;
      }
      td {
        border: 1px solid #cccccc;
        font-size: 15px;
        a {
         font-size: 15px;
        }
        i {
          font-style: initial;
          color: blue;
          cursor: default;
       }
      }
    }
  }
  .btnOperation {
     width: 60px;
    height: 28px;
    margin: 0 5px;
    color: #fff;
    padding: 4px 12px;
    font-size: 14px;
    cursor: default;
    background-color: #009933;
    span {
      margin-right: 4px;
    }
  }
    .shade {
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 20px;
  }
  .edit {
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    >div:nth-child(1) {
      background-color: #fe7844;
      color: #fff;
      width: 320px;
      height: 42px;
      line-height: 42px;
      font-size: 18px;
      text-align: center;
    }
    >div:nth-child(2) {
      width: 320px;
      height: 100px;
      background-color: #fff;
      padding: 50px 0;
      border-radius: 0 0 6px 6px;
      >div:nth-child(2) {
        margin-top: 50px;
        width: 320px;
        border-top: 1px solid #cccccc ;
      }
      a {
        font-weight: bold;
        font-size: 16px;
        margin-left: 20px;
      }
      input {
        border: 1px solid #a9a9a9;
        height: 25px;
        font-size: 16px;
      }
      button {
        margin-top: 20px;
        width: 80px;
        height: 34px;
        border: none;
        background-color: #797979;
        color: #fff;
        font-size: 17px;
      }
      .yes {
        background-color: #fe7844;
        margin-left: 40px;
        margin-right: 78px;
      }
    }
  }
  .editAffair {
    position: absolute;
    z-index: 40;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    >div:nth-child(1) {
      background-color: #fe7844;
      color: #fff;
      width: 820px;
      height: 42px;
      line-height: 42px;
      padding: 0 20px;
      img {
        float: right;
        margin-top: 10px;
        width: 20px;
      }
    }
    >div:nth-child(2) {
      background-color: #fff;
      height: 500px;
      position: relative;
      padding-top: 10px;
      border-radius: 0 0 8px 8px;
      div:nth-child(4) {
        border-top: 1px solid #cccccc;
        height: 140px;
        width: 94%;
        margin: 0 auto;
        margin-top: 10px;
        a {
          margin-left: 0px;
          line-height: 40px;
          font-weight: bold;
          font-size: 16px;
          float: left;
        }
        div {
          display: block;
          float: left;
          margin-top: 10px;
          width: 78%;
          height: 130px;
          overflow: hidden;
        }
      }
      button {
          float: left;
          color: #fff;
          background-color: #fe7844;
          border: none;
          width: 80px;
          height: 35px;
          margin: 0 100px;
          margin-top: 230px;
        }
      >button:nth-child(7) {
        background-color: #aaaaaa;
      }
      .message:nth-child(1) {
        font-weight: bold;
        font-size: 16px;
        margin-left: 25px;
      }
      .message:nth-child(2) {
        font-weight: bold;
        font-size: 16px;
        position: absolute;
        position: absolute;
        left: 300px;
      }
      .message:nth-child(3) {
        font-weight: bold;
        font-size: 16px;
        position: absolute;
        left: 580px;
      }
    }
  }
    .editRecord {
    z-index: 80;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
  }
    .editRecords {
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    >div:nth-child(1) {
      background-color: #fe7844;
      color: #fff;
      width: 320px;
      height: 42px;
      line-height: 42px;
      font-size: 18px;
      text-align: center;
    }
    >div:nth-child(2) {
      width: 320px;
      height: 100px;
      background-color: #fff;
      padding: 50px 0;
      border-radius: 0 0 6px 6px;
      >div:nth-child(2) {
        margin-top: 50px;
        width: 320px;
        border-top: 1px solid #cccccc ;
      }
      a {
        font-weight: bold;
        font-size: 16px;
        margin-left: 20px;
      }
      input {
        border: 1px solid #a9a9a9;
        height: 25px;
        font-size: 16px;
      }
      button {
        margin-top: 20px;
        width: 80px;
        height: 34px;
        border: none;
        background-color: #797979;
        color: #fff;
        font-size: 17px;
      }
      .yes {
        background-color: #fe7844;
        margin-left: 40px;
        margin-right: 78px;
      }
    }
  }
</style>
