<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">可展开表格+可勾选</div>
    <el-form class="template-form" :model="formData" ref="formData">
      <el-form-item class="page-form-item form-label-four" label="模板名称：" prop="temName" style="width: calc((100% - 300px)/3)">
        <el-input v-model="formData.temName" placeholder="请输入模板名称"></el-input>
      </el-form-item>
      <el-form-item class="page-form-item form-label-four" label="指标名称：" prop="kpiName" style="width: calc((100% - 300px)/3)">
        <el-input v-model="formData.kpiName" placeholder="请输入指标名称"></el-input>
      </el-form-item>
      <el-button  v-waves class="primary-btn" @click="queryTemplate(formData)">
        查询
      </el-button>
      <el-button v-waves plain class="plain-btn" @click="resetPage()">
        重置
      </el-button>
    </el-form>
    <div class="template-area">
      <div class="template-button">
        <el-button v-waves plain class="plain-btn" @click="">
          <svg-icon class="icon-space" icon-class="plusIcon" />
          新增
        </el-button>
        <el-button v-waves plain class="plain-btn" @click="">
          <svg-icon class="icon-space" icon-class="deleteIcon"/>
          删除
        </el-button>
      </div>
      <el-scrollbar wrapClass="scrollbar-wrapper">
        <div class="template-table" :style="templateTableHeight">
          <el-table
            class="expand-table"
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  class="expand-inside"
                  :data="props.row.inTable"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="index_name"
                    label="指标名称">
                  </el-table-column>
                  <el-table-column
                    prop="index_source"
                    label="指标来源">
                  </el-table-column>
                  <el-table-column
                    prop="data_type"
                    label="数据类型">
                  </el-table-column>
                  <el-table-column
                    prop="index_unit"
                    label="指标单位">
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-checkbox-group v-model="selectedList">
                  <el-checkbox :label="scope.row.title">
                    <b class="header">{{scope.row.title}}</b>
                    <b class="header" v-if="scope.row.desc!=null">（{{scope.row.desc}}）</b>
                  </el-checkbox>
                  <b class="header index-count">【指标数：{{scope.row.inTable.length}}】</b>
                  <div class="header header-button">
                    <span class="operation operation-edit" @click="editTemplate(scope.$index)"><svg-icon class="icon-space" icon-class="editIcon" />修改</span>
                    <span class="operation operation-edit" @click="copyAdd(scope.$index)"><svg-icon class="icon-space" icon-class="copy" />复制模板</span>
                    <span class="operation"><svg-icon class="icon-space" icon-class="deleteIcon" />删除</span>
                  </div>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
      <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshTemplateList" @loadingList="loadingMainTable" style="text-align: right;"></paging>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="90%" top="20px">
      <el-form :model="addEditForm" :rules="addEditRules" ref="addEditForm">
        <el-form-item class="add-half-item common-form-item-92" label="模板名称：" prop="name" style="margin-right: 35px">
          <el-input v-model="addEditForm.name" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item class="add-half-item common-form-item-82" label="模板描述：" prop="desc">
          <el-input v-model="addEditForm.jobId" placeholder="请输入模板描述"></el-input>
        </el-form-item>
      </el-form>
      <div class="template-modal">
        <div class="left-area">
          <label>指标库</label>
          <div class="border-area">
            <el-scrollbar wrapClass="scrollbar-wrapper">
              <div :style="templateModalHeight">
                <el-tree
                  :data="treedata"
                  show-checkbox
                  node-key="id"
                  ref="tree"
                  :props="defaultProps">
                </el-tree>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="mid-area" style="margin-top: 200px;">
          <el-button  v-waves plain class="plain-btn" @click="moveSelectNode" style="width: 60px;">
            <svg-icon class="icon-space" icon-class="coarseArrowR" style="width: 20px;height: 20px;"/>
          </el-button>
        </div>
        <div class="right-area">
          <label>已添加指标</label>
          <div class="border-area" style="height: 430px">
            <el-table
              :data="indicatorTable"
              border
              style="width: 100%">
              <el-table-column
                prop="id"
                label="指标ID"
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="指标名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="source"
                label="指标来源">
              </el-table-column>
              <el-table-column
                label="操作">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves type="primary" @click="">确 定</el-button>
        <el-button v-waves @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import paging from '@/components/Paging'
  import { showMessage, addToTable, clearFormData } from '@/utils/index'
  import { flipParam, queryTemplateList, queryIndicatorsLibrary } from '@/api/templateSetting/index'
  export default {
    name: 'templateSetting',
    components: {
      paging
    },
    data() {
      return {
        listLoading: false,
        dialogFormVisible: false,
        dialogTitle: '',
        formData: {
          temName: null,
          kpiName: null
        },
        addEditForm: {
          name: null,
          desc: null
        },
        addEditRules: {
          name: [
            { required: true, message: '请填写模板名称', trigger: 'blur' }
          ]
        },
        selectedList: [],
        selectedIndicator: [],
        indicatorTable: [],
        tableData: [],
        defaultProps: {
          isLeaf: 'leaf',
          label: 'name',
          children: 'children'
        },
        treedata: []
      }
    },
    created() {
      this.queryTemplate()
    },
    computed: {
      getFlipParams() {
        flipParam.requestParams.condition.name = this.formData.name
        flipParam.requestParams.condition.code = this.formData.code
        return flipParam
      },
      templateTableHeight() {
        return 'max-height:' + (window.innerHeight - 310) + 'px'
      },
      templateModalHeight() {
        return 'height:' + (window.innerHeight - 310) + 'px'
      }
    },
    methods: {
      loadingMainTable() {
        this.listLoading = true
      },
      queryTemplate() {
        this.listLoading = true
        queryTemplateList(this.formData).then(response => {
          this.refreshTemplateList(response)
        })
      },
      copyAdd() {
        clearFormData(this, 'addEditForm', this.addEditForm)
        this.indicatorTable = []
        this.dialogFormVisible = true
        this.dialogTitle = '模板新增'
        queryIndicatorsLibrary({}).then(res => {
          if (res.code === '20000') {
            this.treedata = res.result
          } else {
            showMessage(res)
          }
        })
      },
      editTemplate(index) {
        clearFormData(this, 'addEditForm', this.addEditForm)
        this.indicatorTable = []
        this.dialogFormVisible = true
        this.dialogTitle = '模板编辑'
        queryIndicatorsLibrary({}).then(res => {
          if (res.code === '20000') {
            this.treedata = res.result
          } else {
            showMessage(res)
          }
        })
      },
      moveSelectNode() {
        this.selectedIndicator = this.$refs.tree.getCheckedNodes()
        this.selectedIndicator.forEach((item, i) => {
          if (item && item.children) {
            //  根节点，不添加
          } else {
            addToTable(this, this.indicatorTable, item, 'id')
          }
        })
      },
      refreshTemplateList(response) {
        this.listLoading = false
        if (response.code === '20000') {
          this.tableData = response.result.records
          const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
          this.$refs.pagingData.refreshPagingData(footerData)
        } else {
          showMessage(response)
        }
      },
      resetPage() {

      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .template-form{
    padding-left: 10px;
    margin-top: 10px;
  }
  .template-area{
    position: relative;
    .template-button{
      padding-left: 10px;
      /*position: absolute;*/
      /*top: 0px;*/
      /*z-index: 1000;*/
    }
    .template-table{
      padding-top: 20px;
      .expand-table{
        .header{
          font-size: 16px;
          position: relative;
          top: 1px;
        }
        .index-count{
          right: 50%;
          position: absolute;
          top: 13px;
        }
        .header-button{
          display: inline-block;
          position: absolute;
          top: 13px;
          right: 10px;
          .operation{
            cursor: pointer;
            .icon-space{
              width: 20px;
              height: 20px;
            }
          }
          .operation-edit{
            padding-right: 15px;
          }
        }
      }
    }
  }
  .template-modal{
    .left-area{
      float: left;
      width: calc(40% - 34px)
    }
    .mid-area{
      float: left;
      margin-left: 4px;
      margin-right: 4px;
    }
    .right-area{
      float: left;
      width: calc(60% - 34px)
    }
    .border-area{
      border: 1px solid #dcdfe6;
    }
  }
</style>
