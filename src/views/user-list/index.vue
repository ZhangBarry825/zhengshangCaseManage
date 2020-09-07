<template>
  <div class="user-box">
    <h2>用户列表</h2>
    <el-button-group style="padding: 5px 10px">
      <el-button size="small" type="primary" icon="el-icon-edit" @click="createCase">新增</el-button>
      <el-button size="small"  type="primary" icon="el-icon-delete" @click="deleteCase">删除</el-button>
    </el-button-group>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户账号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="nikeName"
        label="用户昵称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="role"
        label="用户角色"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="password"
        label="用户密码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    <div style="margin-top: 20px">-->
    <!--      <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>-->
    <!--      <el-button @click="toggleSelection()">取消选择</el-button>-->
    <!--    </div>-->

    <el-pagination
      class="pagination"
      background
      @current-change="changeUser"
      :current-page="pageNum"
      layout="prev, pager, next"
      :total="totalNum">
    </el-pagination>

  </div>
</template>

<script>
  import {deleteUser, getUserList} from '@/api/users'
  export default {
    name: "CaseList",
    data() {
      return {
        tableData: [

        ],
        multipleSelection: [],
        loading:false,
        pageNum:1,
        pageSize:10,
        totalNum:0
      }
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(index, row) {
        console.log(index, row);

        this.$router.push({
          name:'UpdateUser',
          params:{
            id:row.id
          }
        })
      },
      handleDelete(index, row) {
        console.log(index, row);
        let that = this
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let formData=new FormData()
          formData.append('username',row.username)
          deleteUser(formData).then(res=>{
            console.log(res,'res')
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.changeUser(that.pageNum)
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      changeUser(currentPage){
        let num = this.totalNum / this.pageSize
        if(num < this.pageNum){
          if(currentPage>1){
            this.pageNum=currentPage - 1
          }else {
            this.pageNum=currentPage
          }
        }else {
          this.pageNum=currentPage
        }
        this.fetchData()
      },
      fetchData(){
        let that=this
        this.loading=true
        let data={
          pageNum:this.pageNum,
          pageSize:this.pageSize,
        }
        getUserList(data).then(res=>{
          console.log(res.data)
          if(res.data!=null){
            that.tableData=res.data.list
            that.totalNum=res.data.total
            that.loading=false
          }else {
            that.tableData=[]
            that.totalNum=0
            that.loading=false
          }

        })
      },
      createCase(){
        this.$router.push({
          path: '/user-list/create'
        })
      },
      deleteCase(data){
        console.log(this.multipleSelection )
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>

<style scoped lang="scss">
  .user-box{
    padding: 20px;
    box-sizing: border-box;

    .pagination{
      margin: 20px 0;
    }
  }
</style>
