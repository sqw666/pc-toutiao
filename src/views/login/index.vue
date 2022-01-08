<template>
  <div class="login-container">
    <div class="login-head"></div>
    <el-form
      class="login-form"
      ref="login-form"
      :rules="formRules"
      :model="user"
    >
      <el-form-item prop="mobile">
        <el-input placeholder="请输入手机号" v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input placeholder="请输入验证码" v-model="user.code"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          :loading="loginLoading"
          type="primary"
          @click="onLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/user";

export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "",
        code: "",
        agree: false,
      },
      // checked: false,
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "change",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
            trigger: "change",
          },
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请勾选用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onLogin() {
      // const user = this.user;
      // debugger;
      this.$refs["login-form"].validate((valid) => {
        if (!valid) {
          return;
        }
        this.login();
      });
    },
    login() {
      // const user = this.user;

      this.loginLoading = true;

      login(this.user)
        .then((res) => {
          this.$message({
            message: "登录成功",
            type: "success",
          });

          this.loginLoading = false;
          window.localStorage.setItem("user", JSON.stringify(res.data.data));
          this.$router.push({
            name: "home",
          });
        })
        .catch((err) => {
          this.$message.error("登录失败，手机号或验证码错误");
          this.loginLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="less">
@import "./index.less";
</style>>