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
          <div><span class="iconfont icon-gouwuche"></span>新建订单</div>
          <div @click="getDataList"><span class="iconfont icon-search"></span>查询</div>
        </div>
        <!-- 表格区域 -->
        <div class="view">
          <div>后台订单列表<div><span class="iconfont icon-shanchu"></span>批量删除订单</div></div>
          <table>
            <tr>
              <th><input type="checkbox"/>全选</th>
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
              <td><input type="checkbox"/></td>
              <td>{{ data.employeeName }}</td>
              <td>{{ data.employeeID }}</td>
              <td>{{ data.commodity }}</td>
              <td>{{ data.amount }}</td>
              <td>{{ data.sum }}</td>
              <td>{{ data.address }}</td>
              <td>{{ data.phone }}</td>
              <td>{{ data.number }}</td>
              <td>{{ data.time }}</td>
              <td><i>{{ data.staus }}</i></td>
              <td>{{ data.operator }}</td>
              <td>
                <a><span class="iconfont icon-xiugai-copy"></span>修改</a>
                <a><span class="iconfont icon-shanchu"></span>删除</a>
              </td>
            </tr>
          </table>
        </div>
        <!-- 翻页按钮 -->
    </div>
</template>

<script>
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
      dataList: []
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
      console.log(this.dataList)
    }
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
      border: 1px solid #a9a9a9;
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
      td {
        border: 1px solid #cccccc;
        font-size: 15px;
        a:nth-child(1) {
            background: #35a097;
          }
        a:nth-child(2) {
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
       }
      }
    }
  }
</style>
