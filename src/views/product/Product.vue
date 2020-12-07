<template>
    <div>
      <!-- 导航栏 -->
      <div class="navigation">
        <li>所有产品</li>
      </div>
      <!-- 搜索栏 -->
        <div class="operation">
          <a href="#">产品编号：</a>
          <input type="text" v-model.trim="getList.product">
          <a href="#">产品名称：</a>
          <input type="text" v-model.trim="getList.commodity">
          <div @click="editcommod"><span class="iconfont icon-gouwuche"></span>添加产品</div>
          <div @click="queryLists"><span class="iconfont icon-search"></span>查询</div>
        </div>
        <!-- 表格区域 -->
        <div class="view">
          <div>后台订单列表<div @click="deleteBatch"><span class="iconfont icon-shanchu"></span>批量删除订单</div></div>
          <table>
            <tr>
              <th><input type="checkbox" ref="checkboxRef" @click="checkAll" id="checkAllId"/>全选</th>
              <th>产品编号</th>
              <th>产品名称</th>
              <th>单价</th>
              <th>库存</th>
              <th>操作人</th>
              <th>操作</th>
            </tr>
            <tr v-if="commodityLists.length == 0">
              <td colspan="13">无数据</td>
            </tr>
            <tr v-for="data in commodityLists" :key="data.id" v-else>
              <td><input type="checkbox" @click="multiple" :index="data.id" class="multipleC"/></td>
              <td>{{ data.product }}</td>
              <td>{{ data.commodity }}</td>
              <td>{{ data.univalence }}</td>
              <td>{{ data.repertory }}</td>
              <td>{{ data.operator }}</td>
              <td>
                <a @click="remCommod(data.id)"><span class="iconfont icon-xiugai-copy"></span>修改</a>
                <a @click="deleteAnima($event)"><span class="iconfont icon-shanchu"></span>删除</a>
                <a @click="deleteData(data.id)" @mouseout="deleteOut($event)" v-show="false"><span class="iconfont icon-shanchu"></span>删除</a>
              </td>
            </tr>
          </table>
        </div>
                <!-- 翻页按钮组 -->
        <paging :pagSum="sum" :pagStart="getList.start" @pagEvent='handleEvent($event)'></paging>
        <!-- 添加与修改商品信息 -->
            <div class="editRecord" v-show="editCommodShow"></div>
            <div class="editRecords" v-show="editCommodShow">
              <div>{{ boxname }}</div>
              <div>
                <div>
                  <a href="#">产品编号：</a>
                  <input type="text" v-model="editCommodity.product">
                </div>
                <div>
                  <a href="#">产品名称：</a>
                  <input type="text" v-model="editCommodity.commodity">
                </div>
                <div>
                  <a href="#">产品单价：</a>
                  <input type="number" v-model="editCommodity.univalence">
                </div>
                <div>
                  <a href="#">产品库存：</a>
                  <input type="number" v-model="editCommodity.repertory">
                </div>
                <div>
                  <button class="btn1" @click="editRecordYes">确定</button>
                  <button class="btn2" @click="editRecordOff">取消</button>
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
      // 提交服务端的数据
      getList: {
        start: 1,
        limit: 12,
        product: '',
        commodity: ''
      },
      // 商品列表数据
      commodityLists: [],
      // 数据条数
      sum: 0,
      // 提交到后台删除的id数组
      deleteId: [],
      // 面板名称
      boxname: '添加产品',
      // 面板显示与隐藏
      editCommodShow: false,
      // 添加与修改面板的数据
      editCommodity: {
        id: null,
        product: '',
        univalence: null,
        commodity: '',
        repertory: null,
        operator: window.sessionStorage.employeeName
      }
    }
  },
  created () {
    this.commodityList()
  },
  methods: {
    async commodityList () {
      const { data: res } = await this.$http.get('/commoditys', { params: this.getList })
      if (res.success !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.commodityLists = res.message
      this.sum = res.sum
      console.log(this.commodityLists)
    },
    // 组件子传父自定义事件函数
    handleEvent (ev) {
      // console.log(ev)
      if (ev <= Math.ceil(this.sum / 12)) {
        this.getList.start = Number(ev)
        this.commodityLists = []
        this.commodityList()
      }
    },
    // 查询订单
    queryLists () {
      this.getList.start = 1
      this.commodityList()
      console.log(this.commodityLists)
    },
    // 删除数据函数
    async deletes () {
      if (this.deleteId.length !== 0) {
        const { data: res } = await this.$http.post('/deleteCommod', { deleteId: this.deleteId })
        if (res.success !== 200) {
          return this.$message.error('删除订单数据失败')
        }
        this.$message.success('删除订单数据成功')
        // 获取数据列表
        const { data: ress } = await this.$http.get('/commoditys', { params: this.getList })
        if (ress.success !== 200) {
          return this.$message.error('获取订单数据失败')
        } else if (ress.message.length === 0 && this.getList.start !== 1) {
          this.getList.start--
          this.commodityList()
        } else {
          this.dataList = ress.message
          this.sum = ress.sum
          this.commodityList()
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
      if (str < this.commodityLists.length) {
        oth.checked = false
      } else if (str === this.commodityLists.length) {
        oth.checked = true
      }
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
    // 添加商品
    editcommod () {
      this.boxname = '添加产品信息'
      this.editCommodShow = true
    },
    // 取消商品的添加
    editRecordOff () {
      this.editCommodShow = false
      this.editCommodity = {
        id: null,
        product: '',
        univalence: null,
        commodity: '',
        repertory: null,
        operator: window.sessionStorage.employeeName
      }
    },
    // 修改商品信息
    async remCommod (id) {
      const { data: res } = await this.$http.post('/editCommodId', { id: id })
      if (res.success !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      this.editCommodity.id = id
      this.editCommodity.product = res.message.product
      this.editCommodity.univalence = res.message.univalence
      this.editCommodity.commodity = res.message.commodity
      this.editCommodity.repertory = res.message.repertory
      this.boxname = '修改产品信息'
      this.editCommodShow = true
    },
    // 将修改或需要添加的数据提交到服务器
    async editRecordYes () {
      if (this.editCommodity.product !== '' && this.editCommodity.univalence !== null && this.editCommodity.commodity !== '' && this.editCommodity.repertory !== null) {
        const { data: res } = await this.$http.post('/editCommodity', this.editCommodity)
        if (res.success !== 200) {
          return this.$message.error('操作失败')
        }
        console.log(res)
        this.$message.success('操作成功')
        this.commodityList()
        this.editCommodShow = false
        this.editCommodity = {
          id: null,
          product: '',
          univalence: null,
          commodity: '',
          repertory: null,
          operator: window.sessionStorage.employeeName
        }
      } else {
        this.$message.error('请正确填写产品信息')
      }
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
      color: #fe7844;
    }
  }
  // 导航栏
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
  .operation>div:nth-child(5) {
    background-color: #fd4c4c;
    margin-right: 20px;
  }
  .operation>div:nth-child(6) {
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
      th:nth-child(7) {
        width: 180px;
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

  // 添加修改商品
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
      width: 380px;
      height: 40px;
      background-color: #fe7844;
      color: #fff;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
    }
    >div:nth-child(2) {
      width: 380px;
      height: 320px;
      background-color: #fff;
      color: #fff;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
      border-radius: 0 0 8px 8px;
      >div {
        padding: 10px 0;
      }
      a {
        font-size: 16px;
      }
      input {
        border: 1px solid #cccccc;
      }
      button {
        width: 80px;
        height: 35px;
        border: none;
        background-color: #a8a8a8;
        color: #fff;
        margin: 0 40px;
      }
    }
  }
  .btn1 {
    background-color: #fe7844 !important;
  }
</style>
