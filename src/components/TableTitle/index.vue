<template>
  <div ref="tableTitle">
    <div class="table-title" :style="{height:height,lineHeight:height}">
      <span>{{tableTitle}}</span>
      <div class="title-panel">
        <div class="title-pic" @click="refeshOperation">
          <svg-icon class="icon-space" icon-class="refresh" />
          刷新
        </div>
        <div class="title-pic" @click="gradeOperation('serious')">
          <div class="color-area serious"></div>
          严重[{{seriousNum}}]
        </div>
        <div class="title-pic" @click="gradeOperation('important')">
          <div class="color-area important"></div>
          重要[{{importantNum}}]
        </div>
        <div class="title-pic" @click="gradeOperation('warning')">
          <div class="color-area warning"></div>
          警告[{{warningNum}}]
        </div>
        <div class="title-pic" @click="gradeOperation('tip')">
          <div class="color-area tip"></div>
          提示[{{tipNum}}]
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'tableTitle',
    props: {
      height: {
        type: String,
        default: '30px'
      },
      tableTitle: {
        type: String,
        default: ''
      },
      seriousNum: {
        type: String,
        default: '0'
      },
      importantNum: {
        type: String,
        default: '0'
      },
      warningNum: {
        type: String,
        default: '0'
      },
      tipNum: {
        type: String,
        default: '0'
      }
    },
    computed: {

    },
    methods: {
      refeshOperation() {
        this.$emit('refreshClick')
      },
      gradeOperation(grade) {
        this.grade = grade
        this.$emit('inforLevel', this.grade)
      }
    },
    data() {
      return {
        grade: null
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .table-title{
    padding-left: 10px;
    background-color: #01C9A7;
    color: #fff;
    border-color: #01C9A7;
  }
  .title-panel{
    display: inline-block;
    float: right;
    .title-pic{
      display: inline-block;
      cursor: pointer;
      margin-right: 20px;
      .color-area{
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align:middle;
      }
      .serious{
        background-color: #FF0000;
      }
      .important{
        background-color: #FF9933
      }
      .warning{
        background-color: #FFFF33
      }
      .tip{
        background-color: #66FF00
      }
    }
  }
</style>
