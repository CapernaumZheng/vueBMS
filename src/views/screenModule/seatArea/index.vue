<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div>
      <div class="page-name">省市二级联动组件 + IP输入框组件</div>
      <el-form class="seat-area-form" :model="formData" ref="formData">
        <el-form-item class="page-form-item common-form-item-68" label="席位号：" prop="name">
          <el-input v-model="formData.seatNumber" placeholder="请输入席位号" ></el-input>
        </el-form-item>
        <el-form-item class="page-form-item common-form-item-96" label="所属会员号：" prop="code">
          <el-select v-model="formData.member"
                     filterable
                     remote
                     :remote-method="remoteMembersMethod"
                     :loading="membersLoading"
                     placeholder="请输入关键字">
            <el-option
              v-for="item in members"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <provincecity class="page-form-province" ref="searchProvince" @selectChange="provinceCityChange"></provincecity>
        <el-button  style="width: 80px" v-waves class="primary-btn" @click="queryTableData(formData)">
          查询
        </el-button>
        <el-button  style="width: 80px" v-waves plain class="plain-btn" @click="resetPage()">
          重置
        </el-button>
      </el-form>
      <div style="padding-left: 10px">
        <el-button v-waves plain class="plain-btn" @click="addNewSeatArea">
          <svg-icon class="icon-space" icon-class="plusIcon" />
          新增
        </el-button>
        <el-upload style="display: inline-block;margin-left: 10px"
                   accept=".xlsx, .xls"
                   :on-success="uploadSuccess"
                   :on-error="uploadFailed"
                   :on-progress="uploadProgress"
                   :show-file-list="showFileList"
                   :headers="uploadHeader"
                   :action="uploadPath">
          <el-button v-waves plain class="plain-btn">
            <svg-icon class="icon-space" icon-class="exportIcon" />
            导入Excel
          </el-button>
        </el-upload>
      </div>
      <div style="margin-top: 20px;">
        <el-table class="table-norm"
                  :data="tableData"
                  border
                  :height="tableHeight"
                  style="width: 100%">
          <el-table-column
            type="index"
            width="55"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="seatNumber"
            label="席位号">
          </el-table-column>
          <el-table-column
            prop="seatIP"
            label="席位IP">
          </el-table-column>
          <el-table-column
            prop="member"
            label="所属会员号">
          </el-table-column>
          <el-table-column
            prop="provinceCityCode"
            label="城市编码">
          </el-table-column>
          <el-table-column
            prop="province"
            label="所属省">
          </el-table-column>
          <el-table-column
            prop="city"
            label="市"
            width="80">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <div class="user-operate" title="修改" @click="editSeatArea(scope.row)">
                <svg-icon class="icon-space" icon-class="editIcon" style="margin-right: 5px"/>
              </div>
              <div title="删除" @click="deleteSeatArea(scope.row)" class="user-operate" style="display: inline-block">
                <svg-icon class="icon-space" icon-class="deleteIcon"/>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--<paging :flipParam="getFlipParams" ref="pagingData" @refreshTableList="refreshTableList" @loadingList="loadingTableList" style="text-align: right;"></paging>-->
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="35%">
      <el-form :model="addForm" :rules="addRules" ref="addForm" style="margin-right: 30px">
        <el-form-item class="common-form-item-78" label="席位号：" prop="seatNumber" style="position: relative;left: 28px;">
          <el-input v-model="addForm.seatNumber" :disabled="isAdd"></el-input>
        </el-form-item>
        <el-form-item class="common-form-item-78" label="席位IP：" style="position: relative;left: 38px;">
          <ipinput ref="addFormIpinput" :ipValue="addForm.seatIP" @loseFocus="inputLoseFocus"></ipinput>
        </el-form-item>
        <el-form-item class="common-form-item-106" label="所属会员号：" prop="member">
          <el-select v-model="addForm.member"
                     filterable
                     remote
                     :remote-method="remoteMembersMethod"
                     :loading="membersLoading"
                     placeholder="请输入关键字">
            <el-option
              v-for="item in members"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <provincecity ref="addFormProvince" @selectChange="addFormProvinceCityChange" style="position: relative;left: 37px;"></provincecity>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;" type="primary" @click="submitSeatAreaAdd('addForm')">提 交</el-button>
        <el-button v-waves style="width: 100px;" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="deleteDialogVisible" width="25%">
      <div style="font-size: 20px;">确认要删除该席位区域吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;" type="primary" @click="deleteConfim">确认</el-button>
        <el-button v-waves style="width: 100px;" @click="deleteDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/javascript">
  import paging from '@/components/Paging'
  import { getToken } from '@/utils/auth'
  import { showMessage, objectAssignment, clearFormData } from '@/utils/index'
  import { queryTable, queryMembersCode, deleteSeat, uploadExcelPath, seatAreaAdd, seatAreaUpdate } from '@/api/seatArea/index'
  import provincecity from '@/components/ProvinceCity'
  import ipinput from '@/components/IPinput'
  export default {
    name: 'seatArea',
    components: {
      paging,
      provincecity,
      ipinput
    },
    data() {
      return {
        listLoading: false,
        membersLoading: false,
        showFileList: false,
        members: [],
        formData: {
          seatNumber: null,
          member: null,
          province: null,
          city: null
        },
        addForm: {
          seatNumber: '',
          seatIP: '0.0.0.0',
          member: '',
          province: '',
          city: ''
        },
        addRules: {
          seatNumber: [
            { required: true, message: '请填写席位号', trigger: 'blur' },
            { max: 20, message: '名字最长不超过20个字符', trigger: 'blur' }
          ],
          member: [
            { required: true, message: '请选择一个会员号', trigger: 'change' }
          ]
        },
        tableData: [],
        dialogTitle: '',
        dialogFormVisible: false,
        deleteDialogVisible: false,
        deleteObj: null,
        operateType: null,
        isAdd: false,
        uploadHeader: { 'token': null }
      }
    },
    created() {
      this.queryTableData(this.formData)
    },
    mounted() {
      this.uploadHeader.token = getToken()
    },
    computed: {
      // getFlipParams() {
      //   flipParam.requestParams.condition.seatNumber = this.formData.seatNumber
      //   flipParam.requestParams.condition.member = this.formData.member
      //   flipParam.requestParams.condition.province = this.formData.province
      //   flipParam.requestParams.condition.city = this.formData.city
      //   return flipParam
      // },
      tableHeight() {
        return (window.innerHeight - 330)
      },
      uploadPath() {
        return uploadExcelPath
      }
    },
    methods: {
      queryTableData(params) {
        this.listLoading = true
        queryTable(params, undefined).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            console.log(response)
            this.refreshTableList(response)
          } else {
            showMessage(response)
          }
        })
      },
      resetPage() {
        clearFormData(this, 'formData', this.formData)
        this.$refs.searchProvince.resetProviceCity()
        queryTable(this.formData, undefined).then(response => {
          this.refreshTableList(response)
        })
      },
      // 刷新表格数据
      refreshTableList(response) {
        this.listLoading = false
        if (response.code === '20000') {
          this.tableData = response.result
          // const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
          // this.$refs.pagingData.refreshPagingData(footerData)
        } else {
          showMessage(response)
        }
      },
      loadingTableList() {
        this.listLoading = true
      },
      provinceCityChange(province, city) {
        objectAssignment(this, this.formData, ['province', 'city'], { 'province': province, 'city': city }, ['province', 'city'])
      },
      addFormProvinceCityChange(province, city) {
        objectAssignment(this, this.addForm, ['province', 'city'], { 'province': province, 'city': city }, ['province', 'city'])
      },
      addNewSeatArea() {
        clearFormData(this, 'addForm', this.addForm)
        this.addForm.seatIP = '0.0.0.0'
        this.dialogFormVisible = true
        this.dialogTitle = '新增席位区域'
        this.$nextTick(() => {
          this.$refs.addFormProvince.resetProviceCity()
          this.$refs.addFormIpinput.resetIpInput()
        })
        this.operateType = 0
        this.isAdd = false
      },
      // 新增、修改完成的数据提交
      submitSeatAreaAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
            this.listLoading = true
            if (this.operateType === 0) {
              seatAreaAdd(this.addForm).then(response => {
                showMessage(response)
                clearFormData(this, 'formData', this.formData)
                queryTable(this.formData, undefined).then(response => {
                  this.refreshTableList(response)
                })
              })
            } else {
              let footerParams = null
              if (this.$refs && this.$refs.pagingData) {
                footerParams = this.$refs.pagingData.footerParam
              } else {
                footerParams = undefined
              }
              seatAreaUpdate(this.addForm).then(response => {
                showMessage(response)
                clearFormData(this, formName, this.addForm)
                queryTable(this.formData, footerParams).then(response => {
                  this.refreshTableList(response)
                })
              })
            }
          } else {
            return false
          }
        })
      },
      inputLoseFocus(seatIP) {
        this.addForm.seatIP = seatIP
      },
      remoteMembersMethod(query) {
        this.membersLoading = true
        queryMembersCode({ 'value': query }).then(response => {
          this.membersLoading = false
          if (response.code === '20000') {
            // debugger
            this.members = response.result.map(item => {
              return { value: item.value, label: item.value }
            })
            console.log(this.members)
          } else {
            this.members = []
          }
        })
      },
      deleteSeatArea(obj) {
        this.deleteDialogVisible = true
        this.deleteObj = obj.seatNumber
      },
      deleteConfim() {
        deleteSeat(this.deleteObj).then(response => {
          this.deleteDialogVisible = false
          showMessage(response)
          if (response.code === '20000') {
            this.queryTableData(this.formData)
          }
        })
      },
      editSeatArea(obj) {
        clearFormData(this, 'addForm', this.addForm)
        this.dialogTitle = '编辑席位区域'
        objectAssignment(this, this.addForm, ['seatNumber', 'seatIP', 'member', 'province', 'city'], obj, ['seatNumber', 'seatIP', 'member', 'provinceCode', 'provinceCityCode'])
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.addFormProvince.resetProviceCity(obj.provinceCode, obj.provinceCityCode)
          this.$refs.addFormIpinput.resetIpInput(obj.seatIP)
        })
        this.operateType = 1
        this.isAdd = true
      },
      uploadSuccess(response, file, fileList) {
        showMessage(response)
        this.listLoading = false
        if (response.code === '20000') {
          this.queryTableData(this.formData)
        }
      },
      uploadProgress(event, file, fileList) {
        this.listLoading = true
      },
      uploadFailed() {
        showMessage({ 'code': '0', 'msg': '文件上传失败！请重新上传' })
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .seat-area-form{
    margin-top: 10px;
    margin-left: 10px;
    .page-form-item{
      width: calc((100% - 300px)/4)
    }
    .page-form-province{
      width: calc((100% - 300px)/2);
      display: inline-block
    }
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
</style>
