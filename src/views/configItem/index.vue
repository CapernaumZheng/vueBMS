<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">{{pageName}}</div>
    <div class="page-area" v-show="showMain">
      <div class="dic-tree system-tree">
        <el-scrollbar wrapClass="scrollbar-wrapper">
          <div :style="treeHeight">
            <el-input class="clear-icon"
                      style="padding:10px"
                      clearable
                      placeholder="输入节点名称进行过滤"
                      v-model="filterText">
              <i slot="suffix" style="position: absolute;right: 20px;font-size: 20px" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-tree :props="defaultProps" ref="treeOut"
                     :data="sysTreeData"
                     node-key="identId"
                     :highlight-current="true"
                     accordion
                     @node-click="handleNodeClick"
                     :filter-node-method="filterNode"
                     style="min-height: 200px"
            >
                <span slot-scope="{ node, data }">
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_trade" v-if="data.depth === 0" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_sys" v-if="data.depth === 1" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_system" v-if="data.depth === 2" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_host" v-if="data.depth === 3" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_comupter" v-if="data.depth === 4" />
                  {{data.value}}
                </span>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>
      <div class="dic-table">
        <el-button v-waves class="plain-btn" @click="refreshLeftTree">
          <svg-icon class="icon-space" icon-class="refresh" />
          刷新
        </el-button>
        <el-button v-waves
                   :class="{ 'btn-disabled': selectedNode==null || selectedNode.data.depth==0|| selectedNode.data.depth==1 ,'plain-btn': selectedNode!=null &&  selectedNode.data.depth!==0 && selectedNode.data.depth!==1}"
                   :disabled="selectedNode==null || selectedNode==null || selectedNode.data.depth==0|| selectedNode.data.depth==1"
                   @click="editTechnologyCenter">
          <svg-icon class="icon-space" icon-class="editIcon" />
          编辑
        </el-button>
        <el-button v-waves class="plain-btn" @click="batchTransmission">
          <svg-icon class="icon-space" icon-class="transfe" />
          批量传输设置
        </el-button>
        <div class="page-name" style="margin-top: 10px;">{{addEditform.pageName2}}</div>
        <div class="tip-text" v-if="!techNode && !machineTypeNode && !machineNode">
          <svg-icon class="icon-space" icon-class="c_smile" />
          温馨提示：选中左侧节点操作
        </div>
        <el-scrollbar wrapClass="scrollbar-wrapper">
          <div class="form-area" :style="rightTableHeight">
            <el-form class="add-edit-form" :model="addEditform" ref="addEditform" :rules="addEditFormRules">
              <el-form-item v-if="techNode" class="common-form-item-138 form-item-code" label="技术中心编号：" prop="code">
                <el-input :disabled="!isEdit" maxlength="1" v-model="addEditform.code" placeholder="请输入技术中心编号" style="width: 50%;"></el-input>
              </el-form-item>

              <el-form-item v-if="machineTypeNode" class="common-form-item-138 form-item-code" style="position: relative;left: 50px;" label="机器类型：" prop="machine_type">
                <el-select disabled  v-model="addEditform.machine_type" placeholder="请选择">
                </el-select>
              </el-form-item>
              <el-form-item v-if="machineTypeNode" class="common-form-item-138 form-item-code" label="是否使用中间件：" prop="middleware">
                <el-radio-group v-model="addEditform.middleware">
                  <el-radio :disabled="!isEdit" label="5fc1229fd66c11e8a05800505698e995" >是</el-radio>
                  <el-radio :disabled="!isEdit" label="9ebb1fcbd66c11e8a05800505698e995">否</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item v-if="machineNode" class="common-form-item-138 form-item-code" label="机器编号：" style="position: relative;left: 5px;" prop="machine_code">
                <el-input :disabled="!isEdit" maxlength="3" v-model="addEditform.machine_code" placeholder="请输入机器编号" style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item v-if="machineNode" class="common-form-item-138 form-item-code" label="机器类型：" style="position: relative;left: 15px;" prop="machine_type">
                <el-select :disabled="true" v-model="addEditform.machine_type" placeholder="请选择" >
                </el-select>
              </el-form-item>
              <el-form-item v-if="machineNode" class="common-form-item-138 form-item-code" label="自定义类型：" prop="custom_type">
                <el-input :disabled="!isEdit" v-model="addEditform.custom_type" placeholder="请输入自定义类型" style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item v-if="machineNode" class="common-form-item-138 form-item-code" label="自定义索引：" prop="custom_index">
                <el-input :disabled="!isEdit" v-model="addEditform.custom_index" placeholder="请输入自定义索引" style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item v-if="machineNode" class="common-form-item-138 form-item-code" label="是否备用：" style="position: relative;left: 14px;" prop="reserve">
                <el-radio-group v-model="addEditform.reserve">
                  <el-radio :disabled="!isEdit" label="3e7cd0a268f24d34999b535fe126a8f1" >是</el-radio>
                  <el-radio :disabled="!isEdit" label="590642988e3a4690a1bf79dd8df1cfe8" >否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="machineNode" class="common-form-item-138 form-item-code" label="机器位置：" style="position: relative;left: 15px;" prop="machine_position">
                <el-input :disabled="!isEdit" v-model="addEditform.machine_position" placeholder="请输入机器位置" style="width: 50%"></el-input>
              </el-form-item>
            </el-form>
            <div style="position: relative">
              <el-table key="1" v-if="techNode" class="table-norm dynamic-form"
                        :data="tableData"
                        border
                        :max-height="tableHeight"
                        style="width: 100%">
                <el-table-column
                  type="index"
                  width="55"
                  label="序号">
                </el-table-column>
                <el-table-column
                  label="子网编号">
                  <template slot-scope="scope">
                    <el-form :model="scope.row" :rules="addEditRules" :ref="'subnetCode'+ scope.$index">
                      <span v-if="!isEdit">{{scope.row.subNetId}}</span>
                      <el-form-item prop="subNetId" v-if="isEdit">
                        <el-input type="number" @blur="validateNumber()" min="1" step="1" v-model="scope.row.subNetId" placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="子网"
                  width="300">
                  <template slot-scope="scope">
                    <el-form :model="scope.row.subnetArray" :rules="subnetRules" :ref="'subnet'+ scope.$index">
                      <span v-if="!isEdit">{{scope.row.netIpAddr}}</span>
                      <el-form-item style="display: inline-block;" prop="subnetFirst" v-if="isEdit">
                        <el-input maxlength="3" style="width: 60px"
                                  :disabled= false
                                  v-model="scope.row.subnetArray.subnetFirst"
                                  @blur="validateSubnet(scope.$index)"></el-input>
                        <b class="input-dot">.</b>
                      </el-form-item>
                      <el-form-item style="display: inline-block;" prop="subnetSecond" v-if="isEdit">
                        <el-input maxlength="3" style="width: 60px"
                                  :disabled= false
                                  v-model="scope.row.subnetArray.subnetSecond"
                                  @blur="validateSubnet(scope.$index)"></el-input>
                        <b class="input-dot">.</b>
                      </el-form-item>
                      <el-form-item style="display: inline-block;" prop="subnetThird" v-if="isEdit">
                        <el-input maxlength="3" style="width: 60px"
                                  :disabled=false
                                  v-model="scope.row.subnetArray.subnetThird"
                                  @blur="validateSubnet(scope.$index)"></el-input>
                        <b class="input-dot">.</b>
                      </el-form-item>
                     <!-- <el-form-item style="display: inline-block;" prop="subnetFour" v-if="isEdit">
                        <el-input maxlength="3" style="width: 60px"
                                  v-model="scope.row.subnetArray.subnetFour"
                                  @blur="validateSubnet(scope.$index)"></el-input>
                      </el-form-item>-->
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="TCP传输">
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.tcp">
                      <el-radio  v-if="isEdit || (!isEdit && scope.row.tcp ==='3e7cd0a268f24d34999b535fe126a8f1')" label="3e7cd0a268f24d34999b535fe126a8f1">启用</el-radio>
                      <el-radio  :style="radioMarginLeft" v-if="isEdit || (!isEdit && scope.row.tcp==='590642988e3a4690a1bf79dd8df1cfe8')" label="590642988e3a4690a1bf79dd8df1cfe8">禁用</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column
                  label="UDP传输">
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.udp">
                      <el-radio  v-if="isEdit || (!isEdit && scope.row.udp==='3e7cd0a268f24d34999b535fe126a8f1')" label="3e7cd0a268f24d34999b535fe126a8f1">启用</el-radio>
                      <el-radio  :style="radioMarginLeft" v-if="isEdit || (!isEdit && scope.row.udp==='590642988e3a4690a1bf79dd8df1cfe8')" label="590642988e3a4690a1bf79dd8df1cfe8">禁用</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column
                  label="ACK传输">
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.ack">
                      <el-radio  v-if="isEdit || (!isEdit && scope.row.ack==='3e7cd0a268f24d34999b535fe126a8f1')" label="3e7cd0a268f24d34999b535fe126a8f1">启用</el-radio>
                      <el-radio  :style="radioMarginLeft" v-if="isEdit || (!isEdit && scope.row.ack==='590642988e3a4690a1bf79dd8df1cfe8')" label="590642988e3a4690a1bf79dd8df1cfe8">禁用</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="80"
                  v-if="isEdit">
                  <template slot-scope="scope">
                    <div class="icon-operate" @click="deleteFromTable(scope.$index)">
                      <svg-icon class="icon-space" icon-class="deleteIcon"/>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-table key="2" v-if="machineNode" class="table-norm dynamic-form"
                        :data="machineNodeTable"
                        v-show="isShowTable"
                        border
                        style="width: 100%">
                <el-table-column
                  type="index"
                  width="55"
                  label="序号">
                </el-table-column>
                <el-table-column
                  label="IP地址">
                  <template slot-scope="scope">
                    <el-form :model="scope.row" :rules="machineIpRules" :ref="'machineIp'+ scope.$index">
                      <el-form-item style="display: inline-block;" prop="lastIp" v-if="isEdit">
                        {{scope.row.netIpAddr.split('.')[0]}}.{{scope.row.netIpAddr.split('.')[1]}}.{{scope.row.netIpAddr.split('.')[2]}}.
                        <el-input maxlength="3" style="width: 60px"
                                  v-model="scope.row.lastIp"
                                  @blur="validateMachineIp(scope.$index)"></el-input>
                      </el-form-item>
                      <span v-if="!isEdit">{{scope.row.netIpAddr}}</span>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="子网编号"
                  prop="subNetId">
                </el-table-column>
                <el-table-column
                  label="子网"
                  prop="ip">
                </el-table-column>
              </el-table>
              <div class="machine-table-tip"  v-if="selectedNode!==null && selectedNode.data.depth === 4 &&  machineNodeTable.length === 0 && showMiddleWare === 0">
                <svg-icon class="icon-space" icon-class="warnYellow" style=""/>
                未设置子网，请先去该机器所属中心节点设置子网
                <span class="setting" @click="settingTechCenter">去设置</span>
              </div>
            </div>
            <hr v-if="machineNode">
            <el-form v-if="machineNode" class="add-edit-form" :model="userPasswordForm" ref="userPasswordForm" :rules="userPasswordFormRules">
              <el-form-item class="common-form-item-138 form-item-code" label="用户名：" style="position: relative;left: 21px;" prop="name">
                <el-input :disabled="!isEdit" v-model="userPasswordForm.name" placeholder="请输入用户名" style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item class="common-form-item-138 form-item-code" label="密码：" style="position: relative;left: 35px;" prop="password">
                <el-input :disabled="!isEdit" v-model="userPasswordForm.password" placeholder="请输入密码" style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item class="common-form-item-138 form-item-code" label="IP地址：" style="position: relative;left: 21px;" prop="ip">
                <el-input :disabled="!isEdit" v-model="userPasswordForm.ip" placeholder="请输入密码" style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item class="common-form-item-138 form-item-code" label="端口：" style="position: relative;left: 35px;" prop="port">
                <el-input :disabled="!isEdit" v-model="userPasswordForm.port" placeholder="请输入端口" style="width: 50%"></el-input>
              </el-form-item>
              <hr>
              <el-form-item class="common-form-item-138 form-item-code" label="交易员账户：" style="position: relative;left: 5px;" prop="deal_account">
                <el-input :disabled="!isEdit" v-model="userPasswordForm.deal_account" placeholder="请输入用户名" style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item class="common-form-item-138 form-item-code" label="交易员密码：" style="position: relative;left: 5px;" prop="deal_password">
                <el-input :disabled="!isEdit" v-model="userPasswordForm.deal_password" placeholder="请输入密码" style="width: 50%"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align: left;padding-left: 10px" v-if="machineNode && isEdit">
              <el-button  v-waves class="primary-btn" @click="machineEditSubmit">
                确认
              </el-button>
              <el-button v-waves plain class="plain-btn" @click="cancelEditMachine">
                取消
              </el-button>
            </div>
            <div style="text-align: left;padding-left: 10px" v-if="machineTypeNode && isEdit">
              <el-button  v-waves class="primary-btn" @click="editMachineTypeSubmit">
                确认
              </el-button>
              <el-button v-waves plain class="plain-btn" @click="cancelEditMachineType">
                取消
              </el-button>
            </div>
            <div class="btn-area" v-if="techNode && isEdit">
              <el-button v-waves class="plain-btn plus-button" @click="appendToTable">
                <svg-icon class="icon-space" icon-class="plusIcon" />
                添加一行
              </el-button>
              <el-button  v-waves
                          :class="{ 'btn-disabled': !(subnetCodeValidate && subnetValidate),'primary-btn': subnetCodeValidate && subnetValidate}"
                          :disabled="!(subnetCodeValidate && subnetValidate)"
                          @click="commitEditTechCenter">
                确认
              </el-button>
              <el-button v-waves plain class="plain-btn" @click="cancelEditTechCenter">
                取消
              </el-button>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="page-area" v-show="!showMain">
      <div class="trans-out">
        <el-form :model="transform" ref="transform" :rules="transRules" class="trans-form">
          <el-form-item class="common-form-item-110" label="用户名：" prop="name" style="position: relative;left: 34px;">
            <el-input v-model="transform.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item class="common-form-item-110" label="密码：" prop="password" style="position: relative;left: 48px;">
            <el-input v-model="transform.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item class="common-form-item-110" label="选择设置机器：" style="margin-bottom: 0px">
            <span style="color: blue;">共选择<b class="machine-amout">{{selectedMachine.length}}</b>台机器</span>
            <div class="trans-tree">
              <el-scrollbar wrapClass="scrollbar-wrapper">
                <div :style="transHeight">
                  <el-tree :props="defaultProps" ref="tree"
                           :data="transTreeData"
                           node-key="identId"
                           show-checkbox
                           @check-change="handleCheckChange"
                           style="min-height: 200px"
                  >
                <span slot-scope="{ node, data }">
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_trade" v-if="data.depth === 0" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_sys" v-if="data.depth === 1" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_system" v-if="data.depth === 2" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_host" v-if="data.depth === 3" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_comupter" v-if="data.depth === 4" />
                  {{data.value}}
                </span>
                  </el-tree>
                </div>
              </el-scrollbar>
            </div>
            <div style="margin-top: 10px">
              <el-button  v-waves class="primary-btn" @click="massTransferSubmit">
                保存
              </el-button>
              <el-button  v-waves plain class="plain-btn" @click="massTransferCancel">
                取消
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import paging from '@/components/Paging'
  import { validateUnique, validatPositiveInt, validatInt } from '@/utils/validate'
  import { showMessage, clearFormData, deepClone, constructTree, objectAssignment, addToTable, deleteFromTable, refreshAllLoadTree, manualClickChecked } from '@/utils/index'
  import { queryTree } from '@/api/sysTree/index'
  import { queryTable, editTechCenter, editMachineType, queryMachineInfo, editMachine, updateSSHSubmit } from '@/api/configItem/index'
  export default {
    name: 'configItem',
    components: {
      paging
    },
    watch: {
      filterText(val) {
        this.$refs.treeOut.filter(val)
      }
    },
    created() {
      /* queryTree().then(response => {
        if (response.code === '20000') {
          const rootTree = [{ 'name': '商品交易所', 'id': '0', 'type': '0' }]
          this.sysTreeData = constructTree([], rootTree)
        } else {
          showMessage(response)
        }
      })*/
      queryTree().then(response => {
        this.listLoading = false
        if (response.code === '20000') {
          // this.showTablePage = false
          const rootTree = response.result.records
          var treeData = []
          var root = []
          if (rootTree && rootTree.length > 0) {
            rootTree.forEach((item, i) => {
              if (item && item['depth'] !== 0) {
                treeData.push(item)
              } else {
                root.push(item)
              }
            })
          }
          this.sysTreeData = constructTree(treeData, root)
        } else {
          showMessage(response)
        }
      })
    },
    computed: {
      tableHeight() {
        return (window.innerHeight - 365)
      },
      treeHeight() {
        return 'max-height:' + (window.innerHeight - 150) + 'px'
      },
      rightTableHeight() {
        return 'max-height:' + (window.innerHeight - 270) + 'px'
      },
      transHeight() {
        return 'height:' + (window.innerHeight - 400) + 'px'
      },
      techNode() {
        if (this.selectedNode) {
          if (this.selectedNode.data) {
            if (this.selectedNode.data.depth === 2) {
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        } else {
          return false
        }
      },
      machineTypeNode() {
        if (this.selectedNode) {
          if (this.selectedNode.data) {
            if (this.selectedNode.data.depth === 3) {
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        } else {
          return false
        }
      },
      machineNode() {
        if (this.selectedNode) {
          if (this.selectedNode.data) {
            if (this.selectedNode.data.depth === 4) {
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        } else {
          return false
        }
      },
      radioMarginLeft() {
        if (this.isEdit) {
          return 'margin-left: 10px'
        } else {
          return 'margin-left: 0px'
        }
      }
    },
    data() {
      const subnetNumber = (rule, value, callback) => {
        if (!validateUnique(value, this.tableData, 'subNetId')) {
          callback(new Error('编号不唯一'))
        } else if (!validatInt(value)) {
          callback(new Error('无效的编号'))
        } else {
          callback()
        }
      }
      const subnetSingle = (rule, value, callback) => {
        if (!validatPositiveInt(value)) {
          callback(new Error('不合法'))
        } else {
          callback()
        }
      }
      const noRequireInt = (rule, value, callback) => {
        if (value) {
          if (value.length === 0) {
            callback()
          } else {
            if (!validatInt(value)) {
              callback(new Error('不填或填写大于0的整数'))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }
      return {
        pageName: '树选中节点数展示',
        showMain: true,
        radioYes: '0',
        listLoading: false,
        isEdit: false,
        showMiddleWare: '0',
        filterText: '',
        sysTreeData: [],
        transTreeData: [],
        defaultProps: {
          isLeaf: 'leaf',
          label: 'name',
          children: 'children'
        },
        selectedNode: null,
        isShowTable: true,
        isTipShow: true,
        addEditform: {
          pageName2: null,
          name: null,
          code: null,
          machine_type: null,
          middleware: '5fc1229fd66c11e8a05800505698e995',
          machine_code: null,
          custom_type: null,
          custom_index: null,
          reserve: '590642988e3a4690a1bf79dd8df1cfe8',
          machine_position: null
        },
        addEditFormRules: {
          code: [
            { required: true, message: '请填写技术中心编号', trigger: 'blur' },
            { required: true, message: '仅支持一位数字', validator: subnetSingle }
          ],
          /* machine_type: [
            { required: true, message: '请选择一个机器类型', trigger: 'change' }
          ],*/
          middleware: [
            { required: true, message: '请选择是否使用中间件', trigger: 'change' }
          ],
          machine_code: [
            { required: true, message: '请填写机器编号', trigger: 'blur' },
            { required: true, message: '最多支持三位数字', validator: subnetSingle }
          ],
          custom_index: [
            { required: false, trigger: 'blur', validator: noRequireInt }
          ]
        },
        addEditRules: {
          subNetId: [
            { required: true, message: '请填写子网编码', trigger: 'blur' },
            { required: true, trigger: 'blur', validator: subnetNumber }
          ]
        },
        subnetRules: {
          subnetFirst: [
            { required: true, message: '必填', trigger: 'blur' },
            { required: true, trigger: 'blur', validator: subnetSingle }
          ],
          subnetSecond: [
            { required: true, message: '必填', trigger: 'blur' },
            { required: true, trigger: 'blur', validator: subnetSingle }
          ],
          subnetThird: [
            { required: true, message: '必填', trigger: 'blur' },
            { required: true, trigger: 'blur', validator: subnetSingle }
          ]
          /* subnetFour: [
            { required: true, message: '必填', trigger: 'blur' },
            { required: true, trigger: 'blur', validator: subnetSingle }
          ]*/
        },
        machineIpRules: {
          lastIp: [
            { required: true, message: '必填', trigger: 'blur' },
            { required: true, message: '正整数，最大三位', trigger: 'blur', validator: subnetSingle }
          ]
        },
        transRules: {
          name: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ]
        },
        userPasswordForm: {
          name: null,
          password: null,
          ip: null,
          port: null,
          transmission: '0',
          deal_account: null,
          deal_password: null
        },
        userPasswordFormRules: {
          name: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: '请填写ip地址', trigger: 'blur' }
          ],
          port: [
            { required: true, message: '请填写端口', trigger: 'blur' }
          ],
          transmission: [
            { required: true, message: '请选择传输类型', trigger: 'change' }
          ]
        },
        subnetCodeValidate: true,
        subnetValidate: true,
        machineIpValidate: true,
        tableData: [],
        machineNodeTable: [],
        transform: {
          name: null,
          password: null
        },
        selectedMachine: [],
        checkedNodeCount: 0
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.value.indexOf(value) !== -1
      },

      handleNodeClick(data, node) {
        objectAssignment(this, this.addEditform, ['pageName2'], node.data, ['value'])
        if (this.selectedNode && this.selectedNode.data) {
          if (this.selectedNode.data.identId === node.data.identId) {
            if (this.isEdit) {
              this.isEdit = false
              clearFormData(this, 'addEditform', this.addEditform)
              clearFormData(this, 'userPasswordForm', this.userPasswordForm)
              this.operationAccordNodeType()
            }
            // 同一个节点点，再次点击
          } else {
            // 切换到其他节点
            this.selectedNode = node
            if (this.isEdit) {
              this.isEdit = false
              clearFormData(this, 'addEditform', this.addEditform)
              clearFormData(this, 'userPasswordForm', this.userPasswordForm)
            }
            this.operationAccordNodeType()
          }
        } else {
          // 第一次选中节点
          this.selectedNode = node
          this.operationAccordNodeType()
        }
      },
      operationAccordNodeType() {
        if (this.selectedNode.data && this.selectedNode.data.depth === 2) {
          this.queryTechnologyCenter(this.selectedNode.data)
        } else if (this.selectedNode.data && this.selectedNode.data.depth === 3) {
          objectAssignment(this, this.addEditform, ['machine_type'], this.selectedNode.data, ['value'])
          queryMachineInfo(this.selectedNode).then(res => {
            if (res.code === '20000') {
              objectAssignment(this, this.addEditform, ['middleware'], { 'isMiddleware': res.result.isMiddleware }, ['isMiddleware'])
            }
          })
          this.tableData = []
        } else if (this.selectedNode.data && this.selectedNode.data.depth === 4) {
          objectAssignment(this, this.addEditform, ['machine_type'], this.selectedNode.parent.data, ['value'])
          this.machineInfo(this.selectedNode)
        } else {
          // 其他节点类型，不作处理
        }
      },

      // 点击"编辑"按钮编辑节点
      editTechnologyCenter() {
        if (this.isEdit) {
          // 当前已经在编辑状态，频繁点击编辑按钮不做任何操作
        } else {
          this.isEdit = true
          if (this.selectedNode) {
            if (this.selectedNode.data.depth === 2) {
              for (var value of this.tableData) {
                if (value.subnetArray) {
                  // has subnetArray
                } else {
                  value.subnetArray = { 'subnetFirst': '', 'subnetSecond': '', 'subnetThird': '' }
                }
                value.subnetArray.subnetFirst = value.netIpAddr.split('.')[0]
                value.subnetArray.subnetSecond = value.netIpAddr.split('.')[1]
                value.subnetArray.subnetThird = value.netIpAddr.split('.')[2]
                /* value.subnetArray.subnetFour = value.netIpAddr.split('.')[3]*/
              }
            } else if (this.selectedNode.data.depth === 4) {
              for (var machineValue of this.machineNodeTable) {
                console.log(this.machineValue)
                if (machineValue.lastIp) {
                  // has lastIp
                } else {
                  machineValue.lastIp = machineValue.netIpAddr.split('.')[3] // netIpAddr的值代入ip的第四位input框中
                }
              }
            }
          } else {
            showMessage({ 'msgType': 'warning', 'msg': '未选中任何节点！' })
          }
        }
      },

      // 点击中心节点
      queryTechnologyCenter(params) {
        queryTable(params).then(response => {
          if (response.code === '20000') {
            objectAssignment(this, this.addEditform, ['code'], response.result, ['code'])
            this.tableData = response.result.subNetPojos
            for (var value of this.tableData) {
              if (value.subnetArray) {
                continue
              } else {
                value.subnetArray = { 'subnetFirst': '', 'subnetSecond': '', 'subnetThird': '' }
              }
            }
          } else {
            showMessage(response)
          }
        })
      },
      // 修改中心节点--添加子网之后点击确认
      commitEditTechCenter() {
        this.$refs['addEditform'].validate((valid) => {
          if (valid) {
            this.isEdit = false
            this.listLoading = true
            console.log(this.selectedNode)
            editTechCenter(this.addEditform, this.selectedNode, this.tableData).then(response => {
              showMessage(response)
              this.listLoading = false
              this.queryTechnologyCenter(this.selectedNode.data)
            })
          } else {
            showMessage({ 'msgType': 'warning', 'msg': '警告！技术中心编码不合法！' })
          }
        })
      },
      deleteFromTable(index) {
        deleteFromTable(this, this.tableData, index)
        this.validateNumber()
      },
      cancelEditTechCenter() {
        this.isEdit = false
        clearFormData(this, 'addEditform', this.addEditform)
        objectAssignment(this, this.addEditform, ['middleware', 'reserve'], { 'middleware': '0', 'reserve': '590642988e3a4690a1bf79dd8df1cfe8' }, ['middleware', 'reserve'])
        this.queryTechnologyCenter(this.selectedNode.data)
      },

      // 修改机器类型--是否使用中间件
      editMachineTypeSubmit() {
        this.isEdit = false
        editMachineType(this.addEditform, this.selectedNode).then(response => {
          showMessage(response)
          if (response.code === '20000') {
            console.log(response)
            const data = deepClone(this.selectedNode.data)
            data.middleware = this.addEditform.middleware
            refreshAllLoadTree(this.$refs.treeOut, data, this.selectedNode)
          }
        })
      },
      cancelEditMachineType() {
        this.isEdit = false
        objectAssignment(this, this.addEditform, ['middleware'], this.selectedNode.data, ['middleware'])
      },

      // 点击机器节点
      machineInfo(selectedNode) {
        queryTable(this.selectedNode.parent.parent.data).then(response => {
          if (response.code === '20000') {
            if (response.result.subNetPojos && response.result.subNetPojos.length > 0) {
              const subTemp = response.result.subNetPojos
              for (const hh of subTemp) {
                hh.ip = hh.netIpAddr// 子网在前端存储值的字段为ip,而后台则为netIpAddr
              }
              this.machineNodeTable = subTemp
              // 此时需要嵌套请求，如果机器节点未被编辑过，则machineNodeTable被返回值中的subNetPojos赋值；
              // 如果机器节点已经被编辑保存过即ip第四位的input是有值的，则machineNodeTable被返回值中的nodeIpPojos赋值,覆盖前一次machineNodeTable的值
              queryMachineInfo(this.selectedNode).then(response => {
                if (response.code === '20000') {
                  if (response.result.nodeIpPojos && response.result.nodeIpPojos.length > 0) {
                    const temp = response.result.nodeIpPojos
                    for (const hh of temp) {
                      hh.netIpAddr = hh.ipAddr
                    }
                    this.machineNodeTable = temp
                    objectAssignment(this,
                      this.addEditform,
                      ['machine_code', 'custom_type', 'custom_index', 'reserve', 'machine_position'],
                      response.result,
                      ['code', 'selfMachineType', 'selfCode', 'isSpare', 'machineLocation'])
                    objectAssignment(this,
                      this.userPasswordForm,
                      ['name', 'password', 'ip', 'port', 'deal_account', 'deal_password'],
                      response.result,
                      ['user', 'pwd', 'ip', 'port', 'tradeUser', 'tradePwd', 'ipAddrs'])
                  } else {
                    this.machineNodeTable = []
                    this.showMiddleWare = 0
                  }
                  queryMachineInfo(this.selectedNode.parent).then(res => {
                    const a_middle = res.result.isMiddleware
                    if (a_middle === '5fc1229fd66c11e8a05800505698e995') { // 取值为'是',则显示表格,取值为'否',则不显示
                      this.isShowTable = true
                    } else {
                      this.isShowTable = false
                      this.showMiddleWare = 1
                    }
                  })
                } else if (response.code === '1') {
                  // 如果code==1,则再调一次机器类型的接口获取中间件isMiddleware的取值
                  queryMachineInfo(this.selectedNode.parent).then(response => {
                    if (response.code === '20000') {
                      const a_middle = response.result.isMiddleware
                      if (a_middle === '5fc1229fd66c11e8a05800505698e995') { // 取值为'是',则显示表格,取值为'否',则不显示
                        this.isShowTable = true
                      } else {
                        this.isShowTable = false
                        this.showMiddleWare = 1
                      }
                    } else {
                      alert('已调机器类型接口,返回code仍旧为1')
                    }
                  })
                }
              })
            } else {
              this.machineNodeTable = []
              this.showMiddleWare = 0
            }
          } else {
            showMessage(response)
          }
        })
      },
      // 修改机器节点
      machineEditSubmit() {
        const formParams = Object.assign(this.addEditform, this.userPasswordForm)
        this.$refs['addEditform'].validate((valid) => {
          if (valid) {
            this.$refs['userPasswordForm'].validate((valid) => {
              if (valid) {
                if (this.machineIpValidate) {
                  this.listLoading = true
                  editMachine(formParams, this.selectedNode, this.machineNodeTable).then(response => {
                    this.listLoading = false
                    showMessage(response)
                    if (response.code === '20000') {
                      this.isEdit = false
                      this.machineInfo(this.selectedNode)
                    }
                  })
                } else {
                  showMessage({ 'msgType': 'warning', 'msg': '警告！信息填写不正确！' })
                }
              } else {
                showMessage({ 'msgType': 'warning', 'msg': '警告！信息填写不正确！' })
              }
            })
          } else {
            showMessage({ 'msgType': 'warning', 'msg': '警告！信息填写不正确！' })
          }
        })
      },
      cancelEditMachine() {
        this.isEdit = false
        clearFormData(this, 'addEditform', this.addEditform)
        clearFormData(this, 'userPasswordForm', this.userPasswordForm)
        this.machineInfo(this.selectedNode)
      },

      refreshLeftTree() {
        this.listLoading = true
        this.selectedNode = null
        queryTree().then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            // this.showTablePage = false
            const rootTree = response.result.records
            var treeData = []
            var root = []
            if (rootTree && rootTree.length > 0) {
              rootTree.forEach((item, i) => {
                if (item && item['depth'] !== 0) {
                  treeData.push(item)
                } else {
                  root.push(item)
                }
              })
            }
            this.sysTreeData = constructTree(treeData, root)
          } else {
            showMessage(response)
          }
        })
      },
      validateNumber() {
        try {
          this.tableData.forEach((item, i) => {
            this.$refs['subnetCode' + i].validate((valid) => {
              if (valid) {
                if (i === (this.tableData.length - 1)) {
                  this.subnetCodeValidate = true
                }
              } else {
                this.subnetCodeValidate = false
                throw new Error('EndIterative')
              }
            })
          })
        } catch (e) {
          if (e.message !== 'EndIterative') throw e
        }
        if (this.isEdit) {
          try {
            this.tableData.forEach((item, i) => {
              this.$refs['subnet' + i].validate((valid) => {
                if (valid) {
                  if (i === (this.tableData.length - 1)) {
                    this.subnetValidate = true
                  }
                } else {
                  this.subnetValidate = false
                  throw new Error('EndIterative')
                }
              })
            })
          } catch (e) {
            if (e.message !== 'EndIterative') throw e
          }
        }
      },
      validateSubnet() {
        try {
          this.tableData.forEach((item, i) => {
            this.$refs['subnet' + i].validate((valid) => {
              if (valid) {
                item.netIpAddr = item.subnetArray.subnetFirst + '.' + item.subnetArray.subnetSecond + '.' + item.subnetArray.subnetThird + '.'
                if (i === (this.tableData.length - 1)) {
                  this.subnetValidate = true
                }
              } else {
                this.subnetValidate = false
                throw new Error('EndIterative')
              }
            })
          })
        } catch (e) {
          if (e.message !== 'EndIterative') throw e
        }
        if (this.isEdit) {
          try {
            this.tableData.forEach((item, i) => {
              this.$refs['subnetCode' + i].validate((valid) => {
                if (valid) {
                  if (i === (this.tableData.length - 1)) {
                    this.subnetCodeValidate = true
                  }
                } else {
                  this.subnetCodeValidate = false
                  throw new Error('EndIterative')
                }
              })
            })
          } catch (e) {
            if (e.message !== 'EndIterative') throw e
          }
        }
      },
      validateMachineIp() {
        try {
          this.machineNodeTable.forEach((item, i) => {
            this.$refs['machineIp' + i].validate((valid) => {
              if (valid) {
                item.ip = item.netIpAddr.split('.')[0] + '.' + item.netIpAddr.split('.')[1] + '.' + item.netIpAddr.split('.')[2] + '.' + item.lastIp
                if (i === (this.machineNodeTable.length - 1)) {
                  this.machineIpValidate = true
                }
              } else {
                this.machineIpValidate = false
                throw new Error('EndIterative')
              }
            })
          })
        } catch (e) {
          if (e.message !== 'EndIterative') throw e
        }
      },
      appendToTable() {
        let subnetFirst = ''
        let subnetSecond = ''
        let subnetThird = ''
        let netIpAddr = ''
        if (this.tableData && this.tableData.length > 0 && this.tableData[0].netIpAddr) {
          subnetFirst = this.tableData[0].netIpAddr.split('.')[0]
          subnetSecond = this.tableData[0].netIpAddr.split('.')[1]
          subnetThird = this.tableData[0].netIpAddr.split('.')[2]
          netIpAddr = this.tableData[0].netIpAddr
        }
        addToTable(this, this.tableData, { 'tcp': '3e7cd0a268f24d34999b535fe126a8f1',
          'udp': '3e7cd0a268f24d34999b535fe126a8f1',
          'ack': '3e7cd0a268f24d34999b535fe126a8f1',
          'subnetArray': {
            'subnetFirst': subnetFirst,
            'subnetSecond': subnetSecond,
            'subnetThird': subnetThird
          },
          'netIpAddr': netIpAddr })
        const addIndex = this.tableData.length - 1
        this.$nextTick(function() {
          this.$refs['subnet' + addIndex].validate((valid) => {
            if (valid) {
              this.subnetValidate = true
            } else {
              this.subnetValidate = false
            }
          })
          this.$refs['subnetCode' + addIndex].validate((valid) => {
            if (valid) {
              this.subnetCodeValidate = true
            } else {
              this.subnetCodeValidate = false
            }
          })
        })
      },
      batchTransmission() {
        this.pageName = '批量传输设置'
        this.showMain = false
        this.selectedMachine = []
        this.checkedNodeCount = 0
        this.queryTransTree()
      },
      handleCheckChange() {
        var checkedArray = this.$refs.tree.getCheckedNodes()
        if (checkedArray.length === this.checkedNodeCount) {
          // 节点选中数目没有变化，不做其他操作
        } else {
          this.selectedMachine = []
          for (const checkedNode of checkedArray) {
            if (checkedNode.depth === 4) {
              this.selectedMachine.push(checkedNode)
            }
          }
          this.checkedNodeCount = checkedArray.length
        }
      },
      queryTransTree() {
        queryTree().then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            // this.showTablePage = false
            const rootTree = response.result.records
            var treeData = []
            var root = []
            if (rootTree && rootTree.length > 0) {
              rootTree.forEach((item, i) => {
                if (item && item['depth'] !== 0) {
                  treeData.push(item)
                } else {
                  root.push(item)
                }
              })
            }
            this.sysTreeData = constructTree(treeData, root)
            this.transTreeData = constructTree(treeData, root)
          } else {
            showMessage(response)
          }
        })
      },
      massTransferSubmit() {
        this.$refs['transform'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            updateSSHSubmit(this.transform, this.selectedMachine).then(response => {
              this.listLoading = false
              if (response.code === '20000') {
                showMessage(response)
                this.listLoading = false
              } else {
                showMessage(response)
              }
            })
          }
        })
      },
      massTransferCancel() {
        this.pageName = '配置项管理'
        this.showMain = true
        clearFormData(this, 'transform', this.transform)
      },

      // 未设置子网，去设置子网
      settingTechCenter() {
        manualClickChecked(this.$refs.treeOut, this.selectedNode.parent.parent)
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scope>
  .page-area{
    width: 100%;
    position: relative;
    height: calc(100% - 30px);
    .dic-tree{
      width: 25%;
      height: 100%;
      position: absolute;
    }
    .dic-table{
      width: 75%;
      height: 100%;
      position: absolute;
      top: 10px;
      left: 25%;
      .form-area{
        .add-edit-form{
          padding-top: 0px;
          padding-left: 0px;
          .form-item-code{
            width:calc(100% - 50px);
            margin-top: 10px;
            padding-left: 10px;
          }
        }
        .btn-area{
          text-align: right;
          padding-right: 10px;
          padding-top: 10px;
          position: relative;
          .plus-button{
            float: left;
          }
        }
      }
    }
  }
  .table-norm{
    .input-dot{
      position: relative;
      top: 10px;
    }
  }
  .trans-out{
    text-align: center;
    padding-top: 22px;
    .trans-form{
      display: inline-block;
      width: 60%;
      .common-form-item-110{
        text-align: left;
      }
      .machine-amout{
        font-size: 20px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .trans-tree{
        padding-top: 10px;
        border: 1px solid #dcdfe6;
      }
    }
  }
  .tip-text{
    position: relative;
    text-align: center;
    top: 40%;
    font-size: 20px;
  }
  .machine-table-tip{
    position: absolute;
    top: 60%;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    width: 99%;
    text-align: center;
    .setting{
      color: #3a8ee6;
      cursor: pointer;
      text-decoration: underline
    }
  }
</style>
