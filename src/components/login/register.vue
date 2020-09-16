<template>
  <div class="register">
      <div class="wrapper">
        <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="80px"
            class="demo-ruleForm"
            >
            <el-form-item label="用户名" prop="user">
                <el-input v-model="ruleForm.user" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
                <el-button @click="back()">返回</el-button>
            </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import {queryUserByUid, addUser} from '@/common/js/httpAPI'
export default {
  data () {
    var validateUser = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入用户账户'));
        } else {
            callback();
        }
    };
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
    };
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
        ruleForm: {
            user: '',
            pass: '',
            checkPass: ''
        },
        rules: {
          user: [
            { validator: validateUser, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
    };
  },
  methods: {
    submitForm (formName) {
        this.$refs[formName].validate((valid) => {
            // 校验通过
            if (valid) {
                // 查询用户是否存在
                queryUserByUid(this.ruleForm.user).then(result => {
                    result = result.data;
                    if (result.error) {
                        // 添加用户
                        let formData = {
                            uId: this.ruleForm.user,
                            password: this.ruleForm.pass,
                            role: 'user'
                        };
                        addUser('/register', formData).then(result => {
                            result = result.data;
                            if (!result.error) {
                                this.$message({
                                    message: '注册成功',
                                    type: 'success',
                                    offset: 30
                                });
                                this.$router.replace({
                                    path: '/login',
                                    query: {
                                        userName: formData.uId
                                    }
                                });
                            }
                        }).catch(error => {
                            this.$message('注册失败' + error);
                        })
                    } else {
                        this.$message(result.msg);
                    }
                }).catch(error => {
                    this.$message('查询失败' + error);
                });
            } else {
            console.log('error submit!!');
            return false;
            }
        });
    },
    back () {
      this.$router.replace('/login')
    }
  }
};
</script>

<style lang="stylus">
.register
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align center
  background-color: rgba(7, 17, 27, .9);
  .wrapper
    width 90%
    padding-top 50%
</style>
