<template>
  <div class="create-box">
    <h2>新增案例</h2>

    <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="150px">
      <el-form-item label="案例名称" prop="caseName">
        <el-input v-model="ruleForm.caseName"></el-input>
      </el-form-item>
      <el-form-item label="案例分组" prop="caseGroup">
        <el-select v-model="ruleForm.caseGroup" placeholder="请选择案例分组">
          <el-option :label="item" :value="item" v-for="item in groupList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="案例网站地址" prop="caseIndexUrl">
        <el-input v-model="ruleForm.caseIndexUrl"></el-input>
      </el-form-item>
      <el-form-item label="案例后台地址" prop="caseBackgroundUrl">
        <el-input v-model="ruleForm.caseBackgroundUrl"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  import {createCase, getCaseGorupList} from '@/api/case'
  export default {
    name: "CreateCase",
    data() {
      return {
        ruleForm: {
          caseName: '',
          caseIndexUrl: '',
          caseGroup: '',
          caseBackgroundUrl: '',
        },
        groupList:'',

        rules: {
          caseName: [
            { required: true, message: '请输入案例名称', trigger: 'blur' },
          ],
          caseGroup: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          caseIndexUrl: [
            { required: true, message: '请填写案例网站地址', trigger: 'blur' }
          ],
          caseBackgroundUrl: [
            { required: true, message: '请填写案例后台地址', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      fetchCaseGroupList(){
        console.log('获取数据')
        let that=this
        getCaseGorupList({}).then(res=>{
          that.groupList=res.data
        })
      },


      onSubmit(formName) {
        let that=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let {caseName,caseIndexUrl,caseGroup,caseBackgroundUrl}=that.ruleForm

            let formData = new FormData()
            formData.append('caseName', caseName)
            formData.append('caseIndexUrl', caseIndexUrl)
            formData.append('caseGroup', caseGroup)
            formData.append('caseBackgroundUrl', caseBackgroundUrl)

            createCase(formData).then(res=>{
              console.log(res,'res')
               this.$message({
                message: '添加成功',
                type: 'success',
              })
              setTimeout(()=>{
                that.$router.push({
                  path: '/case-list/list'
                })
              },1000)
            })
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },

    },
    mounted() {
      this.fetchCaseGroupList()
    }
  }
</script>

<style scoped lang="scss">
  .create-box {
    padding: 20px;
    box-sizing: border-box;
    max-width: 50%;
  }
</style>
