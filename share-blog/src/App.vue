<template>
  <div id="app">
    <Header id="header"></Header>
    <main id="main">
      <router-view></router-view>
    </main>
    <Footer id="footer"></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    'Header': Header,
    'Footer': Footer
  }
}
</script>

<style>
/* 全局变量 */
html{
  --themeColor: rgb(0,153,0);
  --themeLighterColor: rgba(0,153,51,.6);
  --bgColor: #149739;
  --textLighterColor: #999;
}
/* base style */
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a{
  text-decoration: none;
  color: #333;
}
img{
  vertical-align: middle;
}
body{
  font: 14px/1.6 Arial,"Microsoft YaHei","黑体","宋体",sans-serif;
  color: #333;
  /*  */
  padding: 0 !important;
}
html,body{
  padding: 0 !important;
}
html,body,#app{
  height: 100%;
}
.flex{
  display: flex;
  justify-content: center;
  align-items: center;
}
input,
textarea,
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder{
	font-weight: normal;
	font-family: Arial,"Microsoft YaHei","黑体","宋体",sans-serif;
}
input,
/* 消除IOSinpit样式 */
textarea{
	border-radius: 0;
	-webkit-appearance: none;
}
/* app */
#app {
  display: flex;
  flex-flow: column nowrap;
}
#main{
  padding: 0 20%;
  flex: 1 1 auto;/* 高度自适应 */
}
#header,#footer{
  flex: 0 0 auto;/* 不能缩放 */
}
/* 响应式 */
@media (max-width:768px){
  #main{
    padding: 0 10px 0 10px;
  }
  .el-message-box{
    padding: 10px;
    width: calc(100% - 20px);
  }
}
</style>
