<template>
    <div>
        <!-- 导航栏 -->
      <div class="navigation">
        <li>出库明细表</li>
      </div>
      <!-- 搜索栏 -->
        <div class="operation">
          <a href="#">产品名称：</a>
          <input type="text" v-model.trim="getList.commodity">
          <a href="#">订单编号：</a>
          <input type="text" v-model.trim="getList.employeeID">
          <div @click="queryLists"><span class="iconfont icon-search"></span>查询</div>
        </div>
        <!-- 表格区域 -->
        <div class="view">
          <div>出库明细表<a href="#">合计：{{ summation }}元</a></div>
          <table>
            <tr>
              <th>商品名称</th>
              <th>订单编号</th>
              <th>创建时间</th>
              <th>状态</th>
              <th>数量</th>
              <th>总价</th>
            </tr>
            <tr v-if="commodityLists.length == 0">
              <td colspan="13">无数据</td>
            </tr>
            <tr v-for="data in commodityLists" :key="data.id" v-else>
              <td>{{ data.commodity }}</td>
              <td>{{ data.employeeID }}</td>
              <td>{{ data.time }}</td>
              <td>{{ data.staus }}</td>
              <td>{{ data.amount }}</td>
              <td>{{ data.sum }}</td>
            </tr>
          </table>
        </div>
                        <!-- 翻页按钮组 -->
        <paging :pagSum="sum" :pagStart="getList.start" @pagEvent='handleEvent($event)'></paging>

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
        commodity: '',
        employeeID: ''
      },
      // 列表数据
      commodityLists: [],
      // 数据条数
      sum: 0,
      // 合计价格
      summation: ''
    }
  },
  created () {
    this.commodityList()
  },
  methods: {
    async commodityList () {
      const { data: res } = await this.$http.get('/detailList', { params: this.getList })
      if (res.success !== 200) {
        return this.$message.error('获取列表数据失败')
      }
      this.commodityLists = res.message
      this.sum = res.sum
      this.summation = res.summation['SUM(sum)']
      console.log(res)
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
      a {
        float: right;
        margin-right: 60px;
      }
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
</style>
