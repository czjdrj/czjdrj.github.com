<template>
    <div id="login" class="flex">
        <div class="flex content">
            <h4>用户名</h4>
            <input type="text" placeholder="用户名" v-model="username">
            <h4>密码</h4>
            <input type="password" placeholder="密码" v-model="password" @keyup.enter="onLogin()">
            <el-button size="medium" @click="onLogin()">立即登录</el-button>
            <p class="flex notice">没有账号？
                <router-link to="/register">注册新用户</router-link>
            </p>
        </div>
    </div>
</template>
<script>
    import { mapActions } from 'vuex';

    export default {
        data: function () {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            ...mapActions([
                'login'
            ]),
            onLogin: function () {
                this.login({ username: this.username, password: this.password }).then((res) => {
                    this.$router.push({ path: this.$route.query.redirect || '/' });//登录成功后，url有重定向参数就跳，没就返回首页
                });
            }
        }
    }
</script>
<style scoped>
    #login,
    #register {
        margin: 30px 0;
    }

    .content {
        flex-flow: column nowrap;
        align-items: flex-start;
        width: 400px;
    }

    h4 {
        width: 100%;
        margin: 10px 0 0 0;
    }

    input {
        width: 100%;
        line-height: 40px;
        border: 1px solid #eaeaea;
        border-radius: 4px;
        outline: none;
        text-indent: 10px;
    }

    input:focus {
        border: 1px solid var(--bgColor);
    }

    button {
        margin-top: 30px;
    }

    .notice {
        width: 100%;
        justify-content: center;
        font-size: 12px;
        color: var(--textLighterColor);
        margin-top: 30px;
    }

    .notice a {
        color: var(--bgColor);
        text-decoration: none;
    }
</style>