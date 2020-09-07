<template>
  <div class="create-box">
    <h2>新增案例分组</h2>

    <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="150px">
      <el-form-item label="案例分组名称" prop="caseName">
        <el-input v-model="ruleForm.caseName"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  import {createCase, getCaseGroupList} from '@/api/case'
  import {createCaseGroup} from "@/api/case-group";
  export default {
    name: "CreateGroup",
    data() {
      return {
        ruleForm: {
          caseName: '',

        },
        groupList:'',

        rules: {
          caseName: [
            { required: true, message: '请输入案例分组名称', trigger: 'blur' },
          ],
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
        getCaseGroupList({}).then(res=>{
          that.groupList=res.data
        })
      },


      onSubmit(formName) {
        let that=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let {caseName}=that.ruleForm

            let formData = new FormData()
            formData.append('caseGroup', caseName)

            createCaseGroup(formData).then(res=>{
              console.log(res,'res')
               this.$message({
                message: '添加成功',
                type: 'success',
              })
              setTimeout(()=>{
                that.$router.push({
                  path: '/case-list/group-list'
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
