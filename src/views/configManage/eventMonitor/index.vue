<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <!-- 配置文件，事件监控 -->
      <div class="eventmonitor" v-show="eventshow">
        <div class="page-name">新增文件</div>
        <el-form style="padding: 30px;overflow: hidden" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <div class="top">
            <el-form-item label="文件名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入文件名称"></el-input>
            </el-form-item>
            <el-form-item label="文件类型" prop="region">
              <el-select v-model="ruleForm.region" :disabled="disabledInput">
                <el-option label="配置命令" value="order"></el-option>
                <el-option label="配置文件" value="file"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文件后缀" prop="suffix">
              <el-input placeholder="输入文件后缀"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="state">
              <el-input placeholder="请输入文件说明" style="width: 300px"></el-input>
            </el-form-item>
            <div class="line">
              <p class="line_address"><span>默认下发地址</span></p>
            </div>
          </div>
          <div class="bottom">
            <el-form-item label="机房位置" prop="location">
              <el-select v-model="ruleForm.location">
                <el-option label="技术中心1" value="location1"></el-option>
                <el-option label="技术中心2" value="location2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="机器类型" prop="robottype">
              <el-select v-model="ruleForm.robottype">
                <el-option label="机器1" value="type1"></el-option>
                <el-option label="机器2" value="type2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文件目录" prop="catalog" >
              <el-input v-model="ruleForm.catalog" placeholder="请输入文件目录" style="width: 300px"></el-input>
            </el-form-item>
            <el-tabs type="border-card">
              <el-tab-pane label="配置命令">
                <div class="preview">
                  <el-row style="padding-top: 15px">
                    <el-button style="color: #409eff; border-color: #409eff;" :plain="true" @click="open" class="perviewfile">预览配置文件</el-button>
                  </el-row>
                </div>
                <textarea name="" class="order" style="width: 100%; height: 225px">配置命令</textarea>
              </el-tab-pane>
              <el-tab-pane label="配置文件">
                <textarea name="" class="file" style="width: 100%; height: 295px; padding-top: 10px">配置文件</textarea>
              </el-tab-pane>
            </el-tabs>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
              <el-button @click="resetForm('ruleForm')">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    <!-- 查看文件-->
    <div class="checkoutfile" v-show="checkoutfile">
      <div class="page-name">查看文件</div>
      <el-form style="padding: 30px;overflow: hidden" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="top">
          <el-form-item label="文件名称" prop="checkname">
            <el-input v-model="ruleForm.checkname" disabled></el-input>
          </el-form-item>
          <el-form-item label="文件类型" prop="checkregion">
            <el-select v-model="ruleForm.checkregion" disabled>
              <el-option label="配置命令" value="order"></el-option>
              <el-option label="配置文件" value="file"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本名称" prop="checksuffix">
            <el-input v-model="ruleForm.checksuffix" disabled></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="checkexplain">
            <el-input v-model="ruleForm.explain" placeholder="请输入文件说明" style="width: 300px"></el-input>
          </el-form-item>
          <div class="line">
            <p class="line_address"><span>默认下发地址</span></p>
          </div>
        </div>
        <div class="bottom">
          <el-form-item label="技术中心" prop="checklocation">
            <el-select v-model="ruleForm.checklocation" disabled>
              <el-option label="技术中心1" value="location1"></el-option>
              <el-option label="技术中心2" value="location2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机器类型" prop="checkrobottype">
            <el-select v-model="ruleForm.checkrobottype" disabled>
              <el-option label="机器1" value="type1"></el-option>
              <el-option label="机器2" value="type2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件目录" prop="checkcatalog" >
            <el-input v-model="ruleForm.checkcatalog" style="width: 300px" disabled></el-input>
          </el-form-item>
          <el-tabs type="border-card">
            <!--<el-tab-pane label="配置命令">-->
            <div class="preview">
              <el-row style="padding-top: 15px">
                <p class="perviewfile" >配置文件内容</p>
              </el-row>
            </div>
            <textarea name="" class="order" style="width: 100%; height: 225px">配置文件内容</textarea>
            <!--</el-tab-pane>-->
            <!--<el-tab-pane label="配置文件">-->
            <!--</el-tab-pane>-->
          </el-tabs>
        </div>
      </el-form>
    </div>
      </div>
</template>
<script type="text/javascript">
    export default {
      name: 'eventMonitor',
      data() {
        return {
          listLoading: false,
          eventshow: true,
          checkoutfile: false,
          disabledInput: false,
          ruleForm: {
            name: '',
            checkname: '',
            region: '',
            checkregion: '',
            suffix: '',
            checksuffix: '',
            explain: '',
            checkexplain: '',
            location: '',
            checklocation: '',
            robottype: '',
            checkrobottype: '',
            catalog: '',
            checkcatalog: '',
            itemsArray: []
          },
          rules: {
            name: [
              { required: true, message: '请输入文件名称', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }
            ],
            checkname: [
              { required: true, message: '请输入文件名称', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }
            ],
            region: [
              { required: true, message: '请选择文件类型', trigger: 'change' },
              { message: '文件类型，数据字典维护；修改时,类型不可修改,默认请选择' }
            ],
            checkregion: [
              { required: true, message: '请选择文件类型', trigger: 'change' },
              { message: '文件类型，数据字典维护；修改时,类型不可修改,默认请选择' }
            ],
            suffix: [
              { required: false, message: '请输入文件后缀', trigger: 'change' }
            ],
            checksuffix: [
              { required: false, message: '请输入文件后缀', trigger: 'change' }
            ],
            explain: [
              { required: false, message: '请填写说明', trigger: 'change' },
              { min: 1, max: 20, message: '长度在1到20个字' }
            ],
            checkexplain: [
              { required: false, message: '请填写说明', trigger: 'change' },
              { min: 1, max: 20, message: '长度在1到20个字' }
            ],
            location: [
              { required: true, message: '请输入机房位置', trigger: 'change' }
            ],
            checklocation: [
              { required: true, message: '请输入机房位置', trigger: 'change' }
            ],
            robottype: [
              { required: true, message: '请输入机器类型', trigger: 'change' }
            ],
            checkrobottype: [
              { required: true, message: '请输入机器类型', trigger: 'change' }
            ],
            catalog: [
              { required: true, message: '请输入文件目录', trigger: 'change' }
            ],
            checkcatalog: [
              { required: true, message: '请输入文件目录', trigger: 'change' }
            ]
          }
        }
      },
      created() {
        console.log(this.ruleForm.name)
        // console.log(this.$route.query.type)
        if (this.$route.query.type === 'add') {
          this.eventshow = true
          this.checkoutfile = false
        } else if (this.$route.query.type === 'check') {
          this.checkoutfile = true
          this.eventshow = false
        } else if (this.$route.query.type === 'update') {
          this.eventshow = true
          this.checkoutfile = false
          this.disabledInput = true
        }
        this.itemsArray = JSON.parse(sessionStorage.getItem('items'))
        // console.log(this.itemsArray)
        this.ruleForm.checkname = this.itemsArray[0]
        this.ruleForm.region = this.itemsArray[1]
        this.ruleForm.checkregion = this.itemsArray[1]
        this.ruleForm.checksuffix = this.itemsArray[2]
        this.ruleForm.checkexplain = this.itemsArray[3]
        this.ruleForm.checklocation = this.itemsArray[4]
        this.ruleForm.checkrobottype = this.itemsArray[5]
        this.ruleForm.checkcatalog = this.itemsArray[6]
      },
      methods: {
        submitForm(formName) {
          this.listLoading = true
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!')
            } else {
              console.log('error submit!!')
              return false
            }
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields()
        },
        open() {
          this.listLoading = true
          console.log(1)
          if (this.ruleForm.name === '' || this.ruleForm.region === '' || this.ruleForm.location === '' || this.ruleForm.robottype === '' || this.ruleForm.catalog === '') {
            this.$message.error('机器属性未配置,请先去配置后，才可预览配置文件')
          } else {
            this.eventshow = false
            this.checkoutfile = true
          }
          this.listLoading = false
        }
      }
    }

</script>
<style>
.page-name {
  margin-bottom: 10px;
}
.line {
  position: relative;
}
  .line_address {
    display: inline-block;
    font-size: 14px;
    font-weight: 700;
  }
  .line_address:after {
    display: inline-block;
    content: '';
    width: 100%;
    height: 1px;
    position: absolute;
    left: 99px;
    top: 20px;
    background: #ccc;
  }
  /*.order {*/
    /*height: 100px!important;*/
  /*}*/
.preview {
  height: 50px;
  background-color: rgba(242, 242, 242, 1);
}
.previewfile {
  color: #5D5C5A;
}
.el-tabs--border-card>.el-tabs__content {
  padding-top: 0px;
}

.el-row {
  padding-top: 0px!important;
}
  .el-tabs__content {
    height: 300px;
  }
.el-form-item {
  margin-top: 15px;
}
.el-form-item__content {
  margin: 0px auto!important;
}
.tags-view-container .tags-view-wrapper .tags-view-item.active, .tags-view-container .tags-view-wrapper .tags-view-item.home-active, .page-name {
  background-color: #01C9A7 !important;
  color: #fff !important;
  border-color: #01C9A7 !important;
}
</style>
