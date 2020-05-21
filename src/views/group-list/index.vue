<template>
  <div class="content-box">
    <h2>案例分组列表</h2>
    <el-button-group style="padding: 5px 10px">
      <el-button size="small" type="primary" icon="el-icon-edit" @click="createCase" v-if="checkPermission(['admin'])">
        新增
      </el-button>
      <el-button size="small" type="primary" icon="el-icon-delete" @click="deleteCase"
                 v-if="checkPermission(['admin'])">删除
      </el-button>
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
        width="100">
      </el-table-column>

      <el-table-column
        prop="caseGroup"

        label="案例分组">
      </el-table-column>

      <el-table-column label="操作" width="220" v-if="checkPermission(['admin'])" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      background
      @current-change="changePage"
      :current-page="pageNum"
      layout="prev, pager, next"
      :total="totalNum">
    </el-pagination>

  </div>
</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {deleteCase, getCaseGroupList, getCaseList} from '@/api/case'
  import {deleteCaseGroup, fetchCaseGroupList} from "@/api/case-group";

  export default {
    name: "GroupList",
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        loading: false,
        pageNum: 1,
        pageSize: 10,
        totalNum: 0,
      }
    },
    methods: {
      checkPermission,
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
          name: 'UpdateCase',
          params: {
            id: row.id
          }
        })
      },

      changePage(currentPage, isDelete = false, deleteNum = 1) {
        if (isDelete) {
          let num = this.totalNum % this.pageSize
          if (num > deleteNum) {
            this.pageNum = currentPage
          } else {
            if (currentPage > 1) {
              this.pageNum = currentPage - 1
            } else {
              this.pageNum = currentPage
            }
          }
        }else {
          this.pageNum=currentPage
        }
        this.fetchData()
      },
      fetchData() {
        let that = this
        this.loading = true
        let data = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
        fetchCaseGroupList(data).then(res => {
          console.log(res.data)
          if (res.data != null) {
            that.tableData = res.data.list
            that.totalNum = res.data.total
            that.loading = false
          } else {
            that.tableData = []
            that.totalNum = 0
            that.loading = false
          }

        })
      },
      createCase() {
        this.$router.push({
          path: '/case-list/group-create'
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
          let formData = new FormData()
          formData.append('id', row.id)
          deleteCaseGroup(formData).then(res => {
            console.log(res, 'res')
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.changePage(that.pageNum,true)
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      deleteCase(data) {
        let that = this
        if(that.multipleSelection.length>0){
          let deleteId=[]
          for(let i=0;i<that.multipleSelection.length;i++){
            deleteId.push(that.multipleSelection[i].id)
          }
          console.log(deleteId,555)
          that.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let formData = new FormData()
            formData.append('id', deleteId)
            deleteCaseGroup(formData).then(res => {
              console.log(res, 'res')
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              that.changePage(that.pageNum, true,that.multipleSelection.length)
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>

<style scoped lang="scss">
  .content-box {
    padding: 20px;
    box-sizing: border-box;

    .pagination {
      margin: 20px 0;
    }

    .sampleImg {
      width: 50px;
      height: 50px;
    }
  }
</style>
