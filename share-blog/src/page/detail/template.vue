<template>
  <div id="detail">
    <section class="flex user-info">
      <img class="avatar" :src="user.avatar" :alt="user.username" :title="user.username">
      <div class="right">
        <h3>{{title}}</h3>
        <p>
          <router-link :to="`/user/${user.id}`">{{user.username}}</router-link> 发布于{{friendlyDate(createdAt)}}
        </p>
      </div>
    </section>
    <section class="article" v-html="html">

    </section>
  </div>
</template>

<script>
  import blog from '@/api/blog.js';
  import marked from 'marked';//markdown转html

  export default {
    data: function () {
      return {
        blogId: '',
        title: '',
        createdAt: '',
        user: {},
        markdown: ''
      }
    },
    computed: {
      html: function () {
        return marked(this.markdown);
      }
    },
    created: function () {
      this.blogId = this.$route.params.blogId;//url取参
      blog.getDetail({ blogId: this.blogId }).then(res => {
        this.title = res.data.title;
        this.createdAt = res.data.createdAt;
        this.user = res.data.user;
        this.markdown = res.data.content;
      });
    }
  }
</script>

<style>
  @import "../../assets/article.css";

  #detail .user-info {
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebebeb;
  }

  #detail .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 20px;
    flex: 0 0 auto;
  }

  #detail .right{
    min-height: 55px;
    flex: 1 1 auto;
  }

  #detail .right h3 {
    margin: 5px 0;
  }

  #detail .right p {
    font-size: 12px;
    color: var(--textLighterColor);
  }

  #detail .right h3,
  #detail .right p{
    word-break: break-all;/*英文、汉字都自动换行*/
  }
  #detail .right a {
    color: var(--themeColor);
    text-decoration: none;
  }

  #detail .article {
    padding: 30px 0;
  }
</style>