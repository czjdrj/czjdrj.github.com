<template>
    <header class="flex" :class="{'login': isLogin, 'no-login': !isLogin}">
        <div class="flex" v-if="!isLogin">
            <router-link to="/">
                <h1>Let's share</h1>
            </router-link>
            <p>精品博客汇聚</p>
            <div class="btns">
                <router-link to="/login">
                    <el-button>立即登录</el-button>
                </router-link>
                <router-link to="/register">
                    <el-button>注册账号</el-button>
                </router-link>
            </div>
        </div>

        <div class="flex" v-if="isLogin">
            <router-link to="/">
                <h1>Let's share</h1>
            </router-link>
            <div class="flex right">
                <router-link to="/create">
                    <i class="edit el-icon-plus"></i>
                </router-link>
                <div class="user">
                    <img class="avatar" :src="user.avatar" :alt="user.username" :title="user.username">
                    <ul>
                        <li><router-link to="/mine">我的</router-link></li>
                        <li><a href="javascript:;" @click="onLogout">注销</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';//vuex提供的映射方法

    export default {
        data: function(){
            return {}
        },
        computed: {
            ...mapGetters([//映射vuex的属性到当前组件内
                'user',
                'isLogin'
            ])
        },
        created: function(){
            this.checkLogin();
        },
        methods: {
            ...mapActions([//映射vuex的方法
                'checkLogin',
                'logout'
            ]),
            onLogout: function(){
                this.logout().then(res=>{
                    this.$router.push({ path: '/' });
                });
            }
        }
    }
</script>
<style scoped>
/* 未登录 */
header{
    width: 100%;
    padding: 20px 0;
    background: var(--bgColor);
}
header > div.flex{
    flex-flow: column nowrap;
}
header h1{
    color: #fff;
    font-size: 40px;
    text-transform: uppercase;
}
header p{
    color: #fff;
}
header .btns{
    margin-top: 20px;
}
header button{
    margin: 0 10px 0 10px !important;
}
/* 登录 */
header.login{
    padding: 0 20%;
}
@media (max-width:768px){
    header.login{
        padding: 0 10px;
    }
    header.login h1{
        font-size: 30px;
    }
}
header.login > div.flex{
    width: 100%;
    flex-flow: row nowrap;
    justify-content: space-between;
}
header.login .edit{
    color: #fff;
    font-size: 30px;
}
header.login .avatar{
    width: 40px;
    height: 40px;
    border: 1px solid #fff;
    border-radius: 50%;
    margin-left: 15px;
}
header.login .user{
    position: relative;
}
header.login .user ul{
    display: none;
    position: absolute;
    right: -3px;
    list-style: none;
    border: 1px solid #eaeaea;
    background: #fff;
}
header.login .user:hover ul{
    display: block;
}
header.login .user ul a{
    display: block;
    text-decoration: none;
    color: #333;
    font-size: 12px;
    padding: 5px 10px;
}
header.login .user ul a:hover{
    background: #eaeaea;
}
</style>