<template>
  <div class="update-box">
    <h2>案例修改</h2>

    <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="150px">
      <el-form-item label="案例名称" prop="caseName">
        <el-input v-model="ruleForm.caseName"></el-input>
      </el-form-item>
      <el-form-item label="案例分组" prop="caseGroup">
        <el-select v-model="ruleForm.caseGroup"  placeholder="请选择案例分组">
          <el-option :label="item" :value="item" v-for="item in groupList"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="功能描述" prop="functionDes">
        <el-input v-model="ruleForm.functionDes"></el-input>
      </el-form-item>
      <el-form-item label="项目语言" prop="language">
        <el-input v-model="ruleForm.language"></el-input>
      </el-form-item>
      <el-form-item label="项目报价" prop="price">
        <el-input v-model="ruleForm.price" type="number" onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"></el-input>
      </el-form-item>
      <el-form-item label="演示图片" prop="imageUrl">
        <el-input v-model="ruleForm.imageUrl"></el-input>
      </el-form-item>

      <el-form-item label="案例网站地址" prop="caseIndexUrl">
        <el-input v-model="ruleForm.caseIndexUrl"></el-input>
      </el-form-item>
      <el-form-item label="案例后台地址" prop="caseBackgroundUrl">
        <el-input v-model="ruleForm.caseBackgroundUrl"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">立即修改</el-button>
        <el-button  @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  import {createCase, getCase, getCaseGroupList, updateCase} from '@/api/case'
  export default {
    name: "UpdateCase",
    data() {
      return {
        ruleForm: {
          id:0,
          caseName: '',
          caseIndexUrl: '',
          caseGroup: '',
          caseBackgroundUrl: '',
          functionDes:'',
          language:'',
          price:'',
          imageUrl:'',
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
          ],
          functionDes: [
            { required: true, message: '请填写功能描述', trigger: 'blur' }
          ],
          language: [
            { required: true, message: '请填写项目语言', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请填写项目报价', trigger: 'blur' },
          ],
          imageUrl: [
            { required: true, message: '请填写演示图片', trigger: 'blur' }
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
        getCaseGroupList({}).then(res=>{
          that.groupList=res.data
        })
      },
      fetchCase(){
        console.log('获取数据')
        let that=this
        getCase({
          id:this.ruleForm.id
        }).then(res=>{
          that.ruleForm=res.data
        })
      },

      onSubmit(formName) {
        let that=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = new FormData()
            formData.append('id', that.ruleForm.id)
            formData.append('caseName', that.ruleForm.caseName)
            formData.append('caseIndexUrl', that.ruleForm.caseIndexUrl)
            formData.append('caseGroup', that.ruleForm.caseGroup)
            formData.append('caseBackgroundUrl', that.ruleForm.caseBackgroundUrl)

            formData.append('functionDes', that.ruleForm.functionDes)
            formData.append('language', that.ruleForm.language)
            formData.append('price', that.ruleForm.price)
            formData.append('imageUrl', that.ruleForm.imageUrl)


            updateCase(formData).then(res=>{
              console.log(res,'res')
              this.$message({
                message: '修改成功',
                type: 'success',
              })
              setTimeout(()=>{
                that.$router.push({
                  path: '/case-list/list'
                })
              },1000)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

    },
    mounted() {
      this.fetchCaseGroupList()
      this.ruleForm.id=this.$route.params.id
      this.fetchCase()
    }
  }
</script>

<style scoped lang="scss">
  .update-box {
    padding: 20px;
    box-sizing: border-box;
    max-width: 50%;
  }
</style>
