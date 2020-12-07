<template>
    <div>
        <!-- 导航栏 -->
        <div class="navigation" @click="handList($event)" id="approve">
          <li v-for="(item, index) in navList" :key="index" :index='index'>{{ item }}</li>
        </div>
        <!-- 搜索栏 -->
        <div class="operation">
          <a href="#">收货人姓名：</a>
          <input type="text" v-model.trim="getList.employeeName">
          <a href="#">订单编号：</a>
          <input type="number" v-model.trim="getList.employeeID">
          <a href="#">电话号码：</a>
          <input type="number" v-model.trim="getList.phone">
          <a href="#">物流单号：</a>
          <input type="text" v-model.trim="getList.number">
          <div @click="editOrder"><span class="iconfont icon-gouwuche"></span>新建订单</div>
          <div @click="queryList"><span class="iconfont icon-search"></span>查询</div>
        </div>
        <!-- 表格区域 -->
        <div class="view">
          <div>后台订单列表<div @click="deleteBatch"><span class="iconfont icon-shanchu"></span>批量删除订单</div></div>
          <table>
            <tr>
              <th><input type="checkbox" ref="checkboxRef" @click="checkAll" id="checkAllId"/>全选</th>
              <th>姓名</th>
              <th>订单编号</th>
              <th>商品</th>
              <th>数量</th>
              <th>应付金额</th>
              <th>收货地址</th>
              <th>电话</th>
              <th>物流单号</th>
              <th>下单时间</th>
              <th>状态</th>
              <th>操作人</th>
              <th>操作</th>
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
              <td>{{ data.sum }}</td>
              <td>{{ data.address }}</td>
              <td>{{ data.phone }}</td>
              <td>{{ data.number }}</td>
              <!-- 使用过滤将毫秒数转换成定义好的时间格式 -->
              <td>{{ data.time | dateFormat}}</td>
              <td><i @click="stausEditId(data.id)">{{ data.staus }}</i></td>
              <td>{{ data.operator }}</td>
              <td>
                <a @click="remOrder(data.id)"><span class="iconfont icon-xiugai-copy"></span>修改</a>
                <a @click="deleteAnima($event)"><span class="iconfont icon-shanchu"></span>删除</a>
                <a @click="deleteData(data.id)" @mouseout="deleteOut($event)" v-show="false"><span class="iconfont icon-shanchu"></span>删除</a>
              </td>
            </tr>
          </table>
        </div>
        <!-- 翻页按钮组 -->
        <paging :pagSum="sum" :pagStart="getList.start" @pagEvent='handleEvent($event)'></paging>
        <!-- 订单添加与修改面板 -->
        <div class="shade" v-show="shadeShow"></div>
          <div class="edit" v-show="shadeShow">
            <div>{{ oderText }}订单<img src="@/assets/images/off.png" alt="" @click="shadeShowEdit"></div>
            <div>
              <div>
                <a href="#">编号：</a>
                <input type="text" class="input1" v-model="editList.employeeID">
              </div>
              <div>
                <a href="#">姓名：</a>
                <input type="text" v-model="editList.employeeName">
                <a href="#">电话：</a>
                <input type="number" v-model="editList.phone">
              </div>
              <div>
                <a href="#">地址：</a>
                <input type="text" class="input2" v-model="editList.address">
              </div>
              <div>
                <a href="#">选择商品：</a>
                <select v-model="editList.commodity" @change="pitchOn($event)">
                  <option>请选择</option>
                  <option v-for="data in commodity" :key="data.id" :univalence="data.univalence" :commodityId="data.id">{{ data.commodity }}</option>
                </select>
                <a href="#">单价：</a>
                <input type="number" class="input3" v-model="editList.univalence" @blur="panduan">
                <span>元</span>
                <a href="#">数量：</a>
                <input type="number" class="input4" v-model="editList.amount" @blur="panduan">
                <span>件/台</span>
                <a>合计：</a>
                <span v-if="editList.sum != 0">{{ editList.sum }}元</span>
                <span v-else-if="sumComputed != 0">{{ sumComputed }}元</span>
              </div>
              <div><button class="yes" @click="yesOrder">确认</button><button @click="shadeShowEdit">取消</button></div>
            </div>
          </div>
          <!-- 售后添加事务面板 -->
          <div class="shade" v-show="stausEditShow"></div>
          <div class="editAffair" v-show="stausEditShow">
            <div>状态<img src="@/assets/images/off.png" alt="" @click="stausOff"></div>
            <div>
              <a href="#" class="message">姓名：{{ stausList[0].employeeName }}</a>
              <a href="#" class="message">订单编号：{{ stausList[0].employeeID }}</a>
              <a href="#" class="message">原始物流单号：{{ stausList[0].number }}</a>
              <div>
                <a href="#">维修记录：</a><div>{{ stausList[0].maintain }}</div>
                <button @click="editRecord1(stausList[0].id)">新建事务</button>
              </div>
              <div>
                <a href="#">换货记录：</a><div>{{ stausList[0].exchange }}</div>
                <button @click="editRecord2(stausList[0].id)">新建事务</button>
              </div>
              <div>
                <a href="#">退货记录：</a><div>{{ stausList[0].returns }}</div>
                <button @click="editRecord3(stausList[0].id)">新建事务</button><br>
                <button id="refund" @click="reimburse">确认退款</button>
              </div>
            </div>
            <!-- 添加事务对话框 -->
            <div class="editRecord" v-show="editRecordShow"></div>
            <div class="editRecords" v-show="editRecordShow">
              <div>事务内容</div>
              <div>
                <textarea v-model="stausEdit.stausText" placeholder="请输入事务内容"></textarea>
                <button class="btn1" @click="editRecordYes(stausList[0].id)">确定</button>
                <button class="btn2" @click="editRecordOff">取消</button>
              </div>
            </div>
            <popupbox boxtext="是否确认退款" :id='stausList[0].id' @boxbtnyes='handleBox($event)' @boxbtnon='handleBoxshow=false' v-show="handleBoxshow"></popupbox>
          </div>
    </div>
</template>

<script>
import paging from '@/components/Paging.vue'
import popupbox from '@/components/Popupbox.vue'
export default {
  data () {
    return {
      // 导航栏
      navList: ['所有订单', '退货订单', '换货订单', '维修订单'],
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
      // 订单数据列表
      dataList: [],
      // 数据条数
      sum: 0,
      // 提交到后台删除的id数组
      deleteId: [],
      // 控制遮罩的显示隐藏
      shadeShow: false,
      // 新建与修改订单数据
      editList: {
        id: null,
        employeeID: '',
        employeeName: '',
        phone: null,
        address: '',
        commodity: '请选择',
        commodityId: null,
        amount: 1,
        univalence: null,
        sum: 0,
        operator: window.sessionStorage.employeeName
      },
      // 商品列表数据
      commodity: {},
      // 订单修改面板标题
      oderText: '新建',
      // 售后面板状态显示
      stausEditShow: false,
      // 售后面板状态数据
      stausList: [{
        employeeName: '',
        employeeID: '',
        number: '',
        maintain: '',
        exchange: '',
        returns: ''
      }],
      // 添加事务输入面板显示隐藏
      editRecordShow: false,
      // 新建事务数据（发送到服务器）
      stausEdit: {
        id: '',
        staus: '',
        stausText: ''
      },
      // 控制警告面板的显示隐藏
      handleBoxshow: false
    }
  },
  created () {
    this.getDataList()
  },
  mounted () {
    // 默认高亮
    const div = document.getElementById('approve')
    div.getElementsByTagName('li')[this.getList.navigation].className = 'pitch'
  },
  methods: {
    // 点击导航栏时候的事件
    handList (e) {
      // console.log(e.target, e.target.getAttribute('index'), e.target.parentElement.getElementsByTagName('li'))
      this.getList.navigation = e.target.getAttribute('index')
      // 将所有选项class清除
      for (let i = 0; i < e.target.parentElement.getElementsByTagName('li').length; i++) {
        e.target.parentElement.getElementsByTagName('li')[i].className = ''
      }
      // 将需要高亮的选项加上class
      e.target.parentElement.getElementsByTagName('li')[this.getList.navigation].className = 'pitch'
      this.getList.start = 1
      this.getDataList()
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
    // 查询订单
    queryList () {
      this.getList.start = 1
      this.getDataList()
    },
    // 发送请求获取订单列表
    async getDataList () {
      const { data: res } = await this.$http.get('/order', { params: this.getList })
      // console.log(res)
      if (res.success !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      this.dataList = res.message
      // this.$message.success('获取成功')
      this.sum = res.sum
      // console.log(this.sum)
    },
    // 点击单条删除时的动画效果
    deleteAnima (ev) {
      // console.log(ev.target.nextElementSibling)
      ev.currentTarget.style.display = 'none'
      ev.currentTarget.previousElementSibling.style.display = 'none'
      ev.currentTarget.nextElementSibling.style.display = 'inline'
    },
    // 鼠标移出删除按钮
    deleteOut (ev) {
      ev.currentTarget.style.display = 'none'
      ev.currentTarget.previousElementSibling.style.display = 'inline'
      ev.currentTarget.previousElementSibling.previousElementSibling.style.display = 'inline'
    },
    // 删除数据函数
    async deletes () {
      if (this.deleteId.length !== 0) {
        const { data: res } = await this.$http.post('/delete', { deleteId: this.deleteId })
        if (res.success !== 200) {
          return this.$message.error('删除订单数据失败')
        }
        this.$message.success('删除订单数据成功')
        // 获取数据列表
        const { data: ress } = await this.$http.get('/order', { params: this.getList })
        if (ress.success !== 200) {
          return this.$message.error('获取订单数据失败')
        } else if (ress.message.length === 0 && this.getList.start !== 1) {
          this.getList.start--
          this.getDataList()
        } else {
          this.dataList = ress.message
          this.sum = ress.sum
        }
      }
    },
    // 删除单条数据数据请求
    deleteData (id) {
      // console.log(id)
      this.deleteId.push(id)
      this.deletes()
      this.deleteId = []
    },
    // 批量删除数据
    deleteBatch () {
      var otd = document.getElementsByClassName('multipleC')
      this.deleteId = []
      otd.forEach((item) => {
        if (item.checked === true) {
          this.deleteId.push(item.getAttribute('index'))
        }
      })
      console.log(this.deleteId)
      this.deletes()
      this.deleteId = []
      // console.log(this.$refs.checkboxRef)
      this.$refs.checkboxRef.checked = false
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
      if (str < this.dataList.length) {
        oth.checked = false
      } else if (str === this.dataList.length) {
        oth.checked = true
      }
    },
    // 控制隐藏弹出栏
    shadeShowEdit () {
      this.editList = {
        id: null,
        employeeID: '',
        employeeName: '',
        phone: null,
        address: '',
        commodity: '请选择',
        commodityId: null,
        amount: 1,
        univalence: null,
        sum: 0,
        operator: window.sessionStorage.employeeName
      }
      this.shadeShow = false
    },
    // 判断与数量是否符合常理
    panduan () {
      if (this.editList.univalence <= 0) {
        this.editList.univalence = 1
      }
      if (this.editList.amount <= 0) {
        this.editList.amount = 1
      }
      this.editList.amount = parseInt(this.editList.amount)
    },
    // 新增订单
    async editOrder () {
      this.oderText = '新建'
      const { data: res } = await this.$http.get('/commodity')
      if (res.success !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      this.commodity = res.message
      this.shadeShow = true
    },
    // 修改订单
    async remOrder (id) {
      this.oderText = '修改'
      const { data: res } = await this.$http.get('/commodity')
      if (res.success !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      this.commodity = res.message
      const { data: resId } = await this.$http.get('/orderId', { params: { id: id } })
      this.editList.id = id
      this.editList.employeeID = resId.message[0].employeeID
      this.editList.employeeName = resId.message[0].employeeName
      this.editList.commodityId = resId.message[0].commodityId
      this.editList.phone = resId.message[0].phone
      this.editList.address = resId.message[0].address
      this.editList.commodity = resId.message[0].commodity
      this.editList.amount = resId.message[0].amount
      this.editList.sum = resId.message[0].sum
      this.shadeShow = true
    },
    // 确认修改或添加订单
    async yesOrder () {
      if (this.editList.employeeID !== '' && this.editList.employeeName !== '' && this.editList.phone !== null && this.editList.address !== '' && this.editList.commodity !== '请选择') {
        const { data: res } = await this.$http.post('/editOrder', this.editList)
        if (res.success !== 200) {
          return this.$message.error('操作失败')
        }
        this.$message.success('操作成功')
        this.editList = {
          id: null,
          employeeID: '',
          employeeName: '',
          phone: null,
          address: '',
          commodity: '请选择',
          commodityId: null,
          amount: 1,
          univalence: null,
          sum: 0,
          operator: window.sessionStorage.employeeName
        }
        this.getDataList()
        this.shadeShow = false
      } else {
        this.$message.error('请正确填写订单信息')
      }
    },
    // 获取新增修改面板下拉选择栏的商品单价与商品id
    pitchOn (ev) {
      const myselect = ev.target
      const index = myselect.selectedIndex
      this.editList.sum = 0
      this.editList.univalence = myselect.options[index].getAttribute('univalence')
      this.editList.commodityId = myselect.options[index].getAttribute('commodityId')
    },
    // 打开售后状态面板
    async stausEditId (id) {
      const { data: res } = await this.$http.get('/orderId', { params: { id } })
      if (res.success !== 200) {
        return this.$message.error('获取售后信息失败')
      }
      this.stausEditShow = true
      this.stausList = res.message
      console.log(this.stausList)
    },
    // 关闭售后状态面板
    stausOff () {
      this.stausEditShow = false
    },
    // 新增维修记录
    editRecord1 (id) {
      this.stausEdit.id = id
      this.stausEdit.staus = 'maintain'
      this.editRecordShow = true
    },
    // 新增换货记录
    editRecord2 (id) {
      this.stausEdit.id = id
      this.stausEdit.staus = 'exchange'
      this.editRecordShow = true
    },
    // 新增退货记录
    editRecord3 (id) {
      this.stausEdit.id = id
      this.stausEdit.staus = 'returns'
      this.editRecordShow = true
    },
    // 提交新增的事务
    async editRecordYes (id) {
      if (this.stausEdit.stausText !== '') {
        const { data: res } = await this.$http.post('/orderStaus', this.stausEdit)
        if (res.success !== 200) {
          return this.$message.error('新建事务失败')
        }
        this.$message.success('添加事务成功')

        this.getDataList()
        const { data: res1 } = await this.$http.get('/orderId', { params: { id } })
        if (res1.success !== 200) {
          return this.$message.error('获取售后信息失败')
        }
        this.stausList = res1.message
        this.stausEdit.stausText = ''
        this.editRecordShow = false
      } else {
        this.$message.error('请输入事务内容')
      }
    },
    // 取消新建事务（隐藏新建事务面板）
    editRecordOff () {
      this.stausEdit.stausText = ''
      this.editRecordShow = false
    },
    // 退款面板显示
    reimburse () {
      this.handleBoxshow = true
    },
    // 警告确认弹窗面板
    async handleBox (id) {
      const { data: res } = await this.$http.post('/orderReimburse', { id: id })
      if (res.success !== 200) {
        return this.$message.error('添加订事务失败')
      }
      this.$message.success('添加事务成功')
      this.getDataList()
      const { data: res1 } = await this.$http.get('/orderId', { params: { id } })
      if (res1.success !== 200) {
        return this.$message.error('获取售后信息失败')
      }
      this.stausList = res1.message
      this.stausEdit.stausText = ''
      this.handleBoxshow = false
    }
  },
  computed: {
    // 计算总价
    sumComputed () {
      return this.editList.amount * this.editList.univalence
    }
  },
  components: {
    paging: paging,
    popupbox: popupbox
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
      th:nth-child(13) {
        width: 150px;
      }
      td {
        border: 1px solid #cccccc;
        font-size: 15px;
        a:nth-child(1) {
            background: #35a097;
          }
        a:nth-child(2) {
            background: #fd4c4c;
          }
        a:nth-child(3) {
            padding: 4px 34px;
            background: #fd4c4c;
          }
        a {
          width: 60px;
          height: 28px;
          margin: 0 5px;
          color: #fff;
          padding: 4px 8px;
          font-size: 14px;
          cursor: default;
        }
        i {
          font-style: initial;
          color: blue;
          cursor: default;
       }
      }
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
      width: 820px;
      height: 320px;
      padding: 20px;
      background-color: #fff;
      border-radius: 0 0 6px 6px;
      div {
        margin-top: 20px;
        margin-bottom: 35px;
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
      select {
        width: 180px;
        height: 28px;
        border: 1px solid #a9a9a9;
      }
      button {
        width: 80px;
        height: 34px;
        margin: 0 160px;
        border: none;
        background-color: #797979;
        color: #fff;
        font-size: 17px;
      }
      .yes {
        background-color: #fe7844;
      }
    }
    .input1 {
      width: 300px;
    }
    .input2 {
      width: 380px;
    }
    .input3 {
      width: 60px;
      margin-right: 10px;
    }
    .input4 {
      width: 60px;
      margin-right: 10px;
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
      div {
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
          // border: 1px solid #000000;
          display: block;
          float: left;
          margin-top: 10px;
          width: 78%;
          height: 130px;
          overflow: hidden;
        }
        button {
          float: right;
          color: #fff;
          background-color: #35a097;
          border: none;
          width: 80px;
          height: 27px;
          margin-top: 10px;
        }
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
    #refund {
      background-color: #fd4c4c;
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
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 100;
    >div:nth-child(1) {
      width: 300px;
      height: 40px;
      background-color: #fe7844;
      color: #fff;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
    }
    >div:nth-child(2) {
      width: 300px;
      height: 260px;
      background: #fff;
      overflow: hidden;
      border-radius: 0 0 8px 8px;
      textarea {
        width: 300px;
        height: 200px;
        border: none;
        outline: none;
        font-size: 16px;
        padding: 5px;
      }
      .btn1 {
      background-color: #fe7844;
        border: none;
        color: #fff;
        font-size: 16px;
        width: 80px;
        height: 35px;
        margin-left: 50px;
    }
    .btn2 {
      background-color: #fe7844;
        border: none;
        color: #fff;
        font-size: 16px;
        width: 80px;
        height: 35px;
        float: right;
        margin-right: 50px;
        background-color: #999999;
    }
    }
  }
</style>
