<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">服务器指标报表</div>


    <!--筛选条件1-->
    <div class="filter-area1">
      <el-form class="u-form"  :model="formData" ref="formData">
        <el-form-item class="page-form-item form-label-four" label="技术中心:" prop="reportType" style="width: calc((100% - 300px)/3)">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="page-form-item form-label-four" label="机器类型:" prop="sartDate" style="width: calc((100% - 300px)/3)">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="page-form-item form-label-four" label="机器编号:" prop="endDate" style="width: calc((100% - 300px)/3)">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--筛选条件2-->
    <div class="filter-area2">
      <el-form class="u-form"  :model="formData" ref="formData">
        <el-form-item class="page-form-item form-label-four" label="报表类型:" prop="reportType" style="width: calc((100% - 300px)/3)">
          <el-select v-model="formData.machineType" placeholder="" @focus="queryMachineType" @change="center_type_code">
            <el-option label="日报" value="day"></el-option>
            <el-option label="周报" value="week"></el-option>
            <el-option label="月报" value="month"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item class="page-form-item form-label-four" label="开始日期:" prop="sartDate" style="">
          <el-date-picker type="date" v-model="formData.distributeTime" placeholder="" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item class="page-form-item form-label-four" label="结束日期:" prop="endDate" style="">
          <el-date-picker type="date" v-model="formData.distributeTime" placeholder="" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-button  style="width: 80px" v-waves class="primary-btn" @click="queryFileData(formData)">
          查询
        </el-button>
      </el-form>
    </div>
    <!--导出数据-->
    <div class="export-button">
      <el-button  v-waves style="width: 120px" plain class="primary-btn">
        <svg-icon class="icon-space" icon-class="exportIcon"/>
        导出数据
      </el-button>
    </div>
    <!--撤单/废单情况表格数据-->
    <div class="table">
      <el-table class="table-norm"
                :data="tableData"
                border
                :height="tableHeight"
                style="width: 100%">
        <el-table-column
          width="150"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="id"
          label="指标名称">
        </el-table-column>
      </el-table>
    </div>
    <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshDataIndex" @loadingList="loadingDataIndex" style="text-align: right;"></paging>


  </div>
</template>

<script>
    export default {
      name: 'indicationRange',
      data() {
        return {
          listLoading: false,
          formData: {

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

  .export-button{
    padding-left: 10px;
  }

  .table{
    margin-top: 30px;
    padding-left: 10px;
  }
</style>
