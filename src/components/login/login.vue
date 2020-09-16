<template>
  <div class="login">
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
            <el-form-item label="密码" prop="pwd">
                <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                <el-button @click="register()">注册</el-button>
            </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import {login} from '@/common/js/httpAPI'
export default {
  data () {
    var validateUser = (rule, value, callback) => {
        if (value.trim() === '' || value.trim() === null) {
            callback(new Error('请输入用户账户'));
        } else {
            callback();
        }
    };
    var validatePwd = (rule, value, callback) => {
        if (value.trim() === '') {
            callback(new Error('请输入密码'));
        } else {
            callback();
        }
    };
    return {
        ruleForm: {
            user: '',
            pwd: ''
        },
        rules: {
          user: [
            { validator: validateUser, trigger: 'blur' }
          ],
          pwd: [
            { validator: validatePwd, trigger: 'blur' }
          ]
        }
    };
  },
  methods: {
    submitForm (formName) {
        this.$refs[formName].validate((valid) => {
            // 登录
            if (valid) {
                let formData = {
                    uId: this.ruleForm.user,
                    password: this.ruleForm.pwd
                };
                login('/login', formData).then(result => {
                    result = result.data;
                    if (!result.error) {
                        this.$message({
                            message: '登录成功',
                            type: 'success'
                        });
                        localStorage.setItem('userName', result.data);
                        // localStorage.setItem('token', result.data.token)
                        this.$router.replace('/')
                    } else {
                        this.$message(result.msg);
                    }
                }).catch(error => {
                    console.log('error')
                    this.$message(error)
                })
            } else {
                return false;
            }
        });
    },
    register () {
      this.$router.replace('/register')
    }
  },
  beforeMount () {
    //   注册成功在登录用户显示注册好的用户
      let userName = this.$route.query.userName;
      if (userName === '' || userName === null) {
          this.ruleForm.user = userName;
      }
  }
};
</script>

<style lang="stylus">
.login
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
