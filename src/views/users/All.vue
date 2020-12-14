<template>
    <div>
        <!-- 导航栏 -->
      <div class="navigation">
        <li>所有产品</li>
      </div>
      <!-- 搜索栏 -->
        <div class="operation">
          <a href="#">员工编号：</a>
          <input type="text" v-model.trim="getList.employeeID">
          <a href="#">用户姓名：</a>
          <input type="text" v-model.trim="getList.employeeName">
          <div @click="editUser"><span class="iconfont icon-gouwuche"></span>添加用户</div>
          <div @click="queryLists"><span class="iconfont icon-search"></span>查询</div>
        </div>
      <!-- 表格区域 -->
        <div class="view">
          <div>用户列表</div>
          <table>
            <tr>
              <th>姓名</th>
              <th>性别</th>
              <th>住址</th>
              <th>出生日期</th>
              <th>部门</th>
              <th>岗位</th>
              <th>员工编号</th>
              <th>账号</th>
              <th>密码</th>
              <th>类型</th>
              <th>操作人</th>
              <th>操作</th>
            </tr>
            <tr v-if="usersList.length == 0">
              <td colspan="13">无数据</td>
            </tr>
            <tr v-for="data in usersList" :key="data.id" v-else>
              <td>{{ data.employeeName }}</td>
              <td>{{ data.sex | sexConvert }}</td>
              <td>{{ data.address }}</td>
              <td>{{ data.birthday | dateBirth }}</td>
              <td>{{ data.department }}</td>
              <td>{{ data.job }}</td>
              <td>{{ data.employeeID }}</td>
              <td>{{ data.username }}</td>
              <td>{{ data.password }}</td>
              <td>{{ data.type | typeConvert }}</td>
              <td>{{ data.openr }}</td>
              <td>
                <a @click="remUser(data.id)"><span class="iconfont icon-xiugai-copy"></span>修改</a>
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
            <div>{{ tabText }}</div>
            <div>
              <div>
                <a href="#">姓名：</a>
                <input type="text" v-model="editUserList.employeeName">
                <a href="#">性别：</a>
                <select v-model="editUserList.sex">
                  <option value="请选择">请选择</option>
                  <option value=0>男</option>
                  <option value=1>女</option>
                </select>
              </div>
              <div>
                <a href="#">住址：</a>
                <input type="text" v-model="editUserList.address">
              </div>
              <div>
                <a href="#">出生日期：</a>
                <select v-model="date.yyyy" @change="pitchOn">
                  <option>请选择</option>
                  <option :value="data" v-for="data in datalist.yeas" :key="data">{{ data }}</option>
                </select>
                <span>年</span>
                <select v-model="date.mm" @change="pitchOn">
                  <option>请选择</option>
                  <option :value="data-1" v-for="data in datalist.month" :key="data">{{ data }}</option>
                </select>
                <span>月</span>
                <select v-model="date.dd" @change="pitchOn">
                  <option>请选择</option>
                  <option :value="data" v-for="data in datalist.date" :key="data">{{ data }}</option>
                </select>
                <span>日</span>
              </div>
              <div>
                <a href="#">部门：</a>
                <select v-model="editUserList.department">
                  <option value="请选择">请选择</option>
                  <option :value="data" v-for="(data, index) in datalist.bumen" :key="index">{{ data }}</option>
                </select>
                <a href="#">岗位：</a>
                <select v-model="editUserList.job">
                  <option value="请选择">请选择</option>
                  <option :value="data" v-for="(data, index) in datalist.gangwei" :key="index">{{ data }}</option>
                </select>
              </div>
              <div>
                <a href="#">员工编号：</a>
                <input type="number" v-model="editUserList.employeeID">
              </div>
              <div>
                <a href="#">账号：</a>
                <input type="text" v-model="editUserList.username">
              </div>
              <div>
                <a href="#">密码：</a>
                <input type="password" v-model="editUserList.password">
              </div>
              <div>
                <a href="#">类型：</a>
                <select v-model="editUserList.type">
                  <option value=1>普通账户</option>
                  <option value=0>管理员</option>
                </select>
              </div>
              <div>
                <button class="useryes" @click="editYes">确定</button>
                <button class="userno" @click="editOff">取消</button>
              </div>
            </div> {{ editUserList }} {{ date }}
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
        employeeID: '',
        employeeName: ''
      },
      // 用户列表
      usersList: [],
      // 数据条数
      sum: 0,
      // 控制用户修改与添加面板显示隐藏
      shadeShow: false,
      // 添加与新修改用户标题
      tabText: '添加用户',
      // 添加用户数据（提交到服务器）
      editUserList: {
        id: null,
        employeeName: '',
        sex: '请选择',
        address: '',
        birthday: null,
        department: '请选择',
        job: '请选择',
        employeeID: '',
        username: '',
        password: '',
        type: 1,
        openr: window.sessionStorage.employeeName
      },
      // 下拉菜单数据
      datalist: {
        bumen: ['人力资源部', '行政部', '设计部', '市场部', '财务部', '客服部', '售后部'],
        gangwei: ['仓管员', '财务', '客服', '设计师', '秘书', '文员', '行政', '经理', '店长', '助理', '采购员'],
        yeas: [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        date: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
      },
      // 日期
      date: {
        yyyy: '请选择',
        mm: '请选择',
        dd: '请选择'
      }
    }
  },
  created () {
    this.gitUsers()
  },
  methods: {
    async gitUsers () {
      const { data: res } = await this.$http.get('/userList', { params: this.getList })
      if (res.success !== 200) {
        return this.$message.error('用户列表获取失败')
      }
      this.usersList = res.message
      this.sum = res.sum
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
    // 删除单条数据数据请求
    async deleteData (id) {
      console.log(id)
      const { data: res } = await this.$http.post('/deluserId', { id: id })
      if (res.success !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.gitUsers()
    },
    // 查询用户
    queryLists () {
      this.getList.start = 1
      this.gitUsers()
    },
    // 组件子传父自定义事件函数
    handleEvent (ev) {
      // console.log(ev)
      if (ev <= Math.ceil(this.sum / 12)) {
        this.getList.start = Number(ev)
        this.usersList = []
        this.gitUsers()
      }
    },
    // 处理日期时间
    pitchOn () {
      if (this.date.yyyy !== '请选择' && this.date.mm !== '请选择' && this.date.dd !== '请选择') {
        this.editUserList.birthday = Number(new Date(this.date.yyyy, this.date.mm - 1, this.date.dd)) / 1000
      } else {
        this.editUserList.birthday = null
      }
    },
    // 添加用户
    editUser () {
      this.editUserList.id = null
      this.tabText = '添加用户'
      this.shadeShow = true
    },
    // 修改用户资料
    async remUser (id) {
      this.tabText = '修改用户信息'
      const { data: res } = await this.$http.get('/userId', { params: { id: id } })
      if (res.success !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editUserList.id = id
      this.editUserList.employeeName = res.message.employeeName
      this.editUserList.sex = res.message.sex
      this.editUserList.address = res.message.address
      this.editUserList.birthday = res.message.birthday
      this.editUserList.department = res.message.department
      this.editUserList.job = res.message.job
      this.editUserList.employeeID = res.message.employeeID
      this.editUserList.username = res.message.username
      this.editUserList.password = res.message.password
      this.editUserList.type = res.message.type
      const dt = new Date(res.message.birthday * 1000)
      const y = dt.getFullYear() // 年
      const m = (dt.getMonth() + '').padStart(2, '0') // 月
      const d = (dt.getDate() + '').padStart(2, '0') // 日
      this.date.yyyy = y
      this.date.mm = m
      this.date.dd = d
      this.shadeShow = true
      console.log(id)
    },
    // 取消添加或者修改用户资料
    editOff () {
      this.editUserList = {
        id: null,
        employeeName: '',
        sex: 3,
        address: '',
        birthday: null,
        department: '请选择',
        job: '请选择',
        employeeID: '',
        username: '',
        password: '',
        type: 1,
        openr: window.sessionStorage.employeeName
      }
      this.date = {
        yyyy: '请选择',
        mm: '请选择',
        dd: '请选择'
      }
      this.shadeShow = false
    },
    // 提交需要修改或添加的用户数据到服务器
    async editYes () {
      if (this.editUserList.employeeName === '' || this.editUserList.sex === '请选择' || this.editUserList.address === '' || this.editUserList.birthday === null || this.editUserList.department === '请选择' || this.editUserList.job === '请选择' || this.editUserList.employeeID === '' || this.editUserList.username === '' || this.editUserList.password === '') {
        return this.$message.error('请填写完整用户信息')
      }
      const { data: res } = await this.$http.post('/useredit', this.editUserList)
      if (res.success !== 200) {
        return this.$message.error('操作失败')
      }
      this.$message.success(res.message)
      this.editUserList = {
        id: null,
        employeeName: '',
        sex: 3,
        address: '',
        birthday: null,
        department: '请选择',
        job: '请选择',
        employeeID: '',
        username: '',
        password: '',
        type: 1,
        openr: window.sessionStorage.employeeName
      }
      this.date = {
        yyyy: '请选择',
        mm: '请选择',
        dd: '请选择'
      }
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
      th:nth-child(12) {
        width: 160px;
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
    position:absolute;
    z-index: 100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    >div:nth-child(1) {
      background-color: #fe7844;
      width: 550px;
      height: 35px;
      color: #fff;
      text-align: center;
      line-height: 34px;
    }
    >div:nth-child(2) {
      background-color: #f1f1f1;
      width: 550px;
      height: 560px;
      color: #fff;
      line-height: 60px;
      a {
        margin-left: 50px;
      }
      select {
        margin-right: 5px;
        height: 26px;
        border: 1px solid #cccccc;
      }
      span {
        color: #000;
        margin-right: 15px;
      }
      input {
        border: 1px solid #cccccc;
        height: 26px;
      }
    }
  }
  .useryes {
    border: none;
    color: #fff;
    background-color: #fe7844;
    width: 80px;
    height: 34px;
    margin-left: 100px;
  }
  .userno {
    border: none;
    color: #fff;
    background-color: #666666;
    width: 80px;
    height: 34px;
    margin-left: 180px;
  }
</style>
