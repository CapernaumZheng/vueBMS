<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div>
      <div class="page-name">用户管理列表+{{getTime}}</div>
      <el-form class="u-form" :model="formData" ref="formData">
        <el-form-item class="page-form-item common-form-item-82" label="用户姓名：" prop="name" style="width: calc((100% - 300px)/3)">
          <el-input v-model="formData.name" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item class="page-form-item common-form-item-82" label="登录账号：" prop="code" style="width: calc((100% - 300px)/3)">
          <el-input v-model="formData.code" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item class="page-form-item common-form-item-82" label="状态：" prop="status" style="width: calc((100% - 300px)/3)">
          <el-select v-model="formData.status" placeholder="请选择">
            <el-option
              :key="''"
              :label="'全部'"
              :value="''">
            </el-option>
            <el-option
              :key="'1'"
              :label="'正常'"
              :value="'1'">
            </el-option>
            <el-option
              :key="'2'"
              :label="'冻结'"
              :value="'2'">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button  style="width: 80px" v-waves class="primary-btn" @click="queryUserData(formData)">
          查询
        </el-button>
        <el-button  style="width: 80px" v-waves plain class="plain-btn" @click="resetPage()">
          重置
        </el-button>
      </el-form>
      <div style="padding-left: 10px">
        <el-button v-waves style="width: 100px" plain class="plain-btn" @click="clearUserAdd('addForm')">
          <svg-icon class="icon-space" icon-class="plusIcon" />
          新增
        </el-button>
        <el-button v-waves style="width: 100px" plain :class="{ 'btn-disabled': multipleSelection.length==0,'plain-btn': multipleSelection.length>0}"
                   :disabled="multipleSelection.length==0"
                   @click="deleteUser(multipleSelection)">
          <svg-icon class="icon-space" icon-class="deleteIcon"/>
          删除
        </el-button>
        <el-button v-waves style="width: 100px" plain :class="{ 'btn-disabled': multipleSelection.length==0||selectAllFrozen,'plain-btn': multipleSelection.length>0}"
                   :disabled="multipleSelection.length==0||selectAllFrozen"
                   @click="frozenUser(multipleSelection)">
          <svg-icon class="icon-space" icon-class="password" />
          冻结
        </el-button>
        <el-button v-waves style="width: 100px" plain :class="{ 'btn-disabled': multipleSelection.length==0||selectAllUnFrozen,'plain-btn': multipleSelection.length>0}"
                   :disabled="multipleSelection.length==0||selectAllUnFrozen"
                   @click="unFrozenUser(multipleSelection)">
          <svg-icon class="icon-space" icon-class="unlock" />
          解冻
        </el-button>
        <el-button v-waves style="width: 100px" plain :class="{ 'btn-disabled': multipleSelection.length==0,'plain-btn': multipleSelection.length>0}"
                   :disabled="multipleSelection.length==0"
                   @click="">
          重置密码
        </el-button>
      </div>
      <div style="margin-top: 20px;">
        <el-table class="table-norm"
                  :data="tableData"
                  :default-sort = "{prop: 'createTime', order: 'ascending'}"
                  border
                  :height="tableHeight"
                  style="width: 100%"
                  @sort-change="sortChanged"
                  @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            type="index"
            width="55"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户姓名">
          </el-table-column>
          <el-table-column
            prop="role"
            label="角色">
            <template slot-scope="scope">
              <span v-if="scope.row.isAdmin === 1">管理员</span>
              <span v-if="scope.row.isAdmin !== 1">普通人员</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="code"
            label="登录账号">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机">
          </el-table-column>
          <el-table-column
            prop="mail"
            label="邮箱">
          </el-table-column>
          <el-table-column
            sortable="custom"
            prop="sourceNum"
            label="资源数">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status !== 2" type="success">正常</el-tag>
              <el-tag v-if="scope.row.status === 2" type="danger">冻结</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            sortable
            label="创建时间">
            <template slot-scope="scope">
              {{scope.row.createTime | parseTime('{y}-{m}-{d}')}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 2" class="user-operate" title="解冻" @click="unFrozenUser([scope.row])">
                <svg-icon class="icon-space" icon-class="unlock" style="margin-right: 5px"/>
              </div>
              <div v-if="scope.row.status !== 2" class="user-operate" title="冻结" @click="frozenUser([scope.row])">
                <svg-icon class="icon-space" icon-class="password" style="margin-right: 5px"/>
              </div>
              <div class="user-operate" title="修改" @click="userEdit(scope.$index, scope.row)">
                <svg-icon class="icon-space" icon-class="editIcon" style="margin-right: 5px"/>
              </div>
              <div title="删除" @click="deleteUser([scope.row])" class="user-operate" style="display: inline-block">
                <svg-icon class="icon-space" icon-class="deleteIcon"/>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshUserList" @loadingList="loadingUserList" style="text-align: right;"></paging>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" top="20px" width="30%">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item class="common-form-item-102" label="用户姓名：" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item class="common-form-item-102" label="手机：" style="" prop="phone" style="position: relative;left: 28px;">
          <el-input v-model="addForm.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item class="common-form-item-102" label="邮箱：" style="" prop="email" style="position: relative;left: 28px;">
          <el-input v-model="addForm.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <hr>
        <el-form-item class="common-form-item-102" label="登录账号：" prop="code" style="margin-top: 22px;">
          <el-input v-model="addForm.code" placeholder="请输入登录账号" :disabled="edit"></el-input>
        </el-form-item>
        <el-form-item class="common-form-item-102" label="角色：" prop="isAdmin" style="position: relative;left: 28px;">
          <el-radio-group v-model="addForm.isAdmin">
            <el-radio label="1">管理员</el-radio>
            <el-radio label="0">普通人员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="common-form-item-102" label="登录密码：" prop="loginPwd">
          <el-input v-model="addForm.loginPwd"></el-input>
        </el-form-item>
        <el-form-item class="common-form-item-102" label="确认密码：" prop="rePwd">
          <el-input v-model="addForm.rePwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;" type="primary" @click="submitUserAdd('addForm')">确 定</el-button>
        <el-button v-waves style="width: 100px;" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="tipDialog" :visible.sync="deleteDialogVisible" width="30%">
      <div style="font-size: 25px;">{{ tip }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;" type="primary" @click="tipConfim">确 定</el-button>
        <el-button v-waves style="width: 100px;" @click="deleteDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import paging from '@/components/Paging'
  import { validateMobile } from '@/utils/validate'
  import { clearFormData, showMessage, objectAssignment, compareUp, compareDown, showLunarDay } from '@/utils/index'
  import { flipParam, queryUserList, userAdd, userUpdate, userDelete, frozenUsers, unFrozenUsers } from '@/api/peopleManage/index'
  export default {
    name: 'peopleManage',
    components: {
      paging
    },
    data() {
      const ifMobile = (rule, value, callback) => {
        if (!validateMobile(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
      const checkRePwd = (rule, value, callback) => {
        if (value === '' || value === null) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.addForm.loginPwd) {
          callback(new Error('两次输入的密码不一样'))
        } else {
          callback()
        }
      }
      return {
        list: null,
        edit: false,
        dialogTitle: null,
        listLoading: false,
        frozenUserInTable: null,
        unFrozenUserInTable: null,
        formData: {
          code: '',
          name: '',
          status: ''
        },
        addForm: {
          id: null,
          name: null,
          code: null,
          email: null,
          phone: null,
          position: null,
          isAdmin: null,
          loginPwd: '',
          rePwd: ''
        },
        addRules: {
          name: [
            { required: true, message: '请填写员工姓名', trigger: 'blur' },
            { max: 20, message: '名字最长不超过20个字符', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请填写登录账号', trigger: 'blur' },
            { max: 10, message: '登录账号最长不超过10个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, trigger: 'blur', validator: ifMobile }
          ],
          email: [
            { required: true, message: '请填写邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          loginPwd: [
            { required: true, trigger: 'blur', message: '请填写登录密码' }
          ],
          isAdmin: [
            { required: true, message: '请选择角色', trigger: 'blur' }
          ],
          rePwd: [
            { required: true, trigger: 'change', validator: checkRePwd },
            { required: true, trigger: 'blur', validator: checkRePwd }
          ]
        },
        operateType: null,
        toDelete: null,
        tableData: [],
        value: '',
        date: '',
        dialogFormVisible: false,
        deleteDialogVisible: false,
        multipleSelection: [],
        tipDialog: null,
        tip: null,
        tipType: null
      }
    },
    created() {
      this.queryUserData(this.formData)
    },
    computed: {
      getFlipParams() {
        flipParam.requestParams.condition.name = this.formData.name
        flipParam.requestParams.condition.code = this.formData.code
        return flipParam
      },
      tableHeight() {
        return (window.innerHeight - 330)
      },
      tableHeightRole() {
        return (window.innerHeight - 480)
      },
      selectAllUnFrozen() {
        let allUnFrozen = true
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          this.multipleSelection.forEach((selectItem, i) => {
            if (selectItem.status === 2) {
              allUnFrozen = false
            } else {
              if (allUnFrozen) {
                if (i === (this.multipleSelection.length - 1)) {
                  allUnFrozen = true
                }
              }
            }
          })
        }
        return allUnFrozen
      },
      selectAllFrozen() {
        let allFrozen = true
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          this.multipleSelection.forEach((selectItem, i) => {
            if (selectItem.status !== 2) {
              allFrozen = false
            } else {
              if (allFrozen) {
                if (i === (this.multipleSelection.length - 1)) {
                  allFrozen = true
                }
              }
            }
          })
        }
        return allFrozen
      },
      getTime() {
        var time = new Date()
        return showLunarDay(time)
      }
    },
    methods: {
      queryUserData(params) {
        this.listLoading = true
        queryUserList(params, undefined).then(response => {
          console.log(response)
          this.refreshUserList(response)
        })
      },
      resetPage() {
        this.formData.code = ''
        this.formData.name = ''
        this.formData.status = ''
        queryUserList(this.formData, undefined).then(response => {
          this.refreshUserList(response)
        })
      },
      clearUserAdd(formName) {
        this.dialogTitle = '新增用户'
        clearFormData(this, formName, this.addForm)
        this.operateType = 0
        this.dialogFormVisible = true
        this.addForm.loginPwd = '111111'
        this.addForm.rePwd = '111111'
        objectAssignment(this, this.addForm, ['isAdmin'], { 'isAdmin': '1' }, ['isAdmin'])
        this.edit = false
      },
      submitUserAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
            this.listLoading = true
            if (this.operateType === 0) {
              userAdd(this.addForm).then(response => {
                showMessage(response)
                clearFormData(this, 'formData', this.formData)
                queryUserList(this.formData, undefined).then(response => {
                  this.refreshUserList(response)
                })
              })
            } else {
              let footerParams = null
              if (this.$refs && this.$refs.pagingData) {
                footerParams = this.$refs.pagingData.footerParam
              } else {
                footerParams = undefined
              }
              userUpdate(this.addForm).then(response => {
                showMessage(response)
                clearFormData(this, 'formData', this.formData)
                queryUserList(this.formData, footerParams).then(response => {
                  this.refreshUserList(response)
                })
              })
            }
          } else {
            return false
          }
        })
      },
      userEdit(index, row) {
        clearFormData(this, 'addForm', this.addForm)
        const setAttr = ['id', 'name', 'code', 'phone', 'email', 'loginPwd', 'rePwd']
        const fromAttr = ['id', 'name', 'code', 'mobile', 'mail', 'password', 'password']
        objectAssignment(this, this.addForm, setAttr, row, fromAttr)
        objectAssignment(this, this.addForm, ['isAdmin'], { 'isAdmin': row.isAdmin + '' }, ['isAdmin'])
        this.edit = true
        this.dialogTitle = '编辑用户'
        this.operateType = 1
        this.dialogFormVisible = true
      },
      tipConfim() {
        if (this.tipType === 0) {
          // 删除操作
          this.listLoading = true
          userDelete(this.toDelete).then(response => {
            this.deleteDialogVisible = false
            showMessage(response)
            queryUserList(this.formData, undefined).then(response => {
              this.refreshUserList(response)
            })
          })
        } else if (this.tipType === 1 && this.multipleSelection.length > 0) {
          // 多选冻结操作
          this.listLoading = true
          frozenUsers(this.multipleSelection).then(response => {
            this.deleteDialogVisible = false
            showMessage(response)
            queryUserList(this.formData, undefined).then(response => {
              this.refreshUserList(response)
            })
          })
        } else if (this.tipType === 1) {
          // 单行表格冻结操作
          this.listLoading = true
          frozenUsers(this.frozenUserInTable).then(response => {
            this.deleteDialogVisible = false
            showMessage(response)
            queryUserList(this.formData, undefined).then(response => {
              this.refreshUserList(response)
            })
          })
        } else if (this.tipType === 3 && this.multipleSelection.length > 0) {
          // 多行解冻用户操作
          this.listLoading = true
          unFrozenUsers(this.multipleSelection).then(response => {
            this.deleteDialogVisible = false
            showMessage(response)
            queryUserList(this.formData, undefined).then(response => {
              this.refreshUserList(response)
            })
          })
        } else if (this.tipType === 3) {
          // 单行解冻用户操作
          this.listLoading = true
          unFrozenUsers(this.unFrozenUserInTable).then(response => {
            this.deleteDialogVisible = false
            showMessage(response)
            queryUserList(this.formData, undefined).then(response => {
              this.refreshUserList(response)
            })
          })
        } else {
          showMessage('错误！未知的操作类型！', 'error')
        }
      },
      deleteUser(param) {
        this.tipDialog = '删除用户'
        this.tip = '确定要删除这 ' + param.length + ' 名用户吗?'
        this.tipType = 0
        this.deleteDialogVisible = true
        this.toDelete = param
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      refreshUserList(response) {
        this.listLoading = false
        if (response.code === '20000') {
          this.tableData = response.result.records
          // const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
          // this.$refs.pagingData.refreshPagingData(footerData)
        } else {
          showMessage(response)
        }
      },
      loadingUserList() {
        this.listLoading = true
      },
      frozenUser(theSelect) {
        this.deleteDialogVisible = true
        this.frozenUserInTable = theSelect
        this.tipDialog = '冻结'
        this.tip = '确定要确定冻结这 ' + theSelect.length + ' 名用户吗？'
        this.tipType = 1
      },
      unFrozenUser(theSelect) {
        this.deleteDialogVisible = true
        this.unFrozenUserInTable = theSelect
        this.tipDialog = '解冻'
        this.tip = '确定要解冻这 ' + theSelect.length + ' 名用户吗？'
        this.tipType = 3
      },
      sortChanged({ column, prop, order }) {
        if (this.tableData.length > 0) {
          if (order === 'ascending') {
            if (prop === 'createTime') {
              this.tableData.sort(compareUp(this.tableData, prop, false))
            } else {
              this.tableData.sort(compareUp(this.tableData, prop, true))
            }
          } else {
            if (prop === 'createTime') {
              this.tableData.sort(compareDown(this.tableData, prop, false))
            } else {
              this.tableData.sort(compareDown(this.tableData, prop, true))
            }
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .u-form{
    margin-top: 10px;
    padding-left: 10px;
  }

  .role-top{
    padding-left: 10px;
    border: 1px solid #d8dce5;
    border-top: none;
    line-height: 40px;
    background-color: #fff;
    .role-label{
      color: #606266;
    }
  }

  .role-assign{
    margin-top: 10px;
    .el-tree{
      height: 200px;
      overflow: auto;
    }
  }

  .table, .table * {
    margin: 0 auto;
    padding: 0;
    font-size: 14px;
  }

  .table {
    display: table;
    width: 100%;
    border-collapse: collapse;
  }

  .table-tr {
    display: table-row;
    height: 30px;
  }

  .table-th {
    display: table-cell;
    font-weight: bold;
    height: 100%;
    border: 1px solid gray;
    text-align: center;
    vertical-align: middle;
  }

  .table-td {
    display: table-cell;
    height: 100%;
    border: 1px solid gray;
    text-align: center;
    background-color: #fff;
  }

  .custom-tree-node{
    margin: 0px;
  }

  .user-operate{
    display: inline-block;
    color: #333;
    .svg-icon{
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  .wait-tree>:first-child{
    display: none;
  }
</style>
