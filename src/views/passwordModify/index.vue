<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">密码修改</div>
      <el-form :model="formData" :rules="rules" ref="formData" label-width="45%" class="demo-ruleForm" >
        <el-form-item label="旧密码：" prop="oldPassword" >
          <el-input type="password" v-model="formData.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword" >
          <el-input type="password" v-model="formData.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword">
          <el-input type="password" v-model="formData.confirmPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button  style="width: 80px"  v-waves class="primary-btn" @click="subForm(formData)" >
            重置
          </el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  import { showMessage } from '@/utils/index'
  import { submitChange } from '@/api/passwordModify/index'
  export default {
    name: 'passwordModify',
    // created() {
    //   // console.log(this.formData)
    //   this.queryFileData(this.ruleForm)
    // },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.formData.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const validatepass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不可为空'))
        } else {
          if (value !== '') {
            var reg = /^[a-zA-Z0-9_-]{4,16}$/
            if (!reg.test(value)) {
              callback(new Error('密码不能包括空格或非法符号'))
            }
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === this.formData.oldPassword) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          if (value !== '') {
            var reg = /^[a-zA-Z0-9_-]{4,16}$/
            if (!reg.test(value)) {
              callback(new Error('密码不能包括空格或非法符号'))
            }
          }
          callback()
        }
      }

      return {
        listLoading: false,
        formData: {
          // region: '',
          newPassword: '',
          oldPassword: '',
          confirmPassword: ''
          // belongCenter: []
        },

        rules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            { validator: validatepass1, trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ]
          // region: ''
        }
        // belongCenter: []
      }
    },
    methods: {
      // 用户名下拉列表
      // queryFileData(params) {
      //   this.listLoading = true
      //   queryTable(params).then(response => {
      //     this.listLoading = false
      //     if (response.code === '20000') {
      //       response.result.records.forEach(v => {
      //         for (const i in v) {
      //           if (v.hasOwnProperty(i)) {
      //             if (i === 'name') {
      //               this.belongCenter[i] = v[i]
      //               this.belongCenter.push(v[i])
      //               console.log(this.belongCenter)
      //             }
      //           }
      //         }
      //       })
      //       console.log(response)
      //     } else {
      //       showMessage(response)
      //     }
      //   })
      // },
      // 提交用户修改
      subForm(params) {
        this.listLoading = true
        submitChange(params).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            console.log('提交成功')
          } else {
            showMessage(response)
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
.demo-ruleForm{
  margin-top: 100px;
  padding-left: 10px;
}
</style>
