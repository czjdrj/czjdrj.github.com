<template>
    <div id="mine">
        <section class="flex user-info">
            <img class="avatar" :src="user.avatar" :alt="user.username" :title="user.username">
            <h3>{{user.username}}</h3>
        </section>
        <section>
            <div class="nothing" v-if="nothing">未发表任何文章</div>
            <router-link :to="`/detail/${item.id}`" class="flex item" v-for="(item, index) in blogs" :key="item.index">
                <div class="date">
                    <span class="day">{{splitDate(item.createdAt).date}}</span>
                    <span class="month">{{splitDate(item.createdAt).month}}月</span>
                    <span class="year">{{splitDate(item.createdAt).year}}</span>
                </div>
                <div class="right">
                    <h3>{{item.title}}</h3>
                    <p>{{item.description}}</p>
                    <div class="actions">
                        <router-link :to="`/edit/${item.id}`">编辑</router-link>
                        <a href="javascript:;" @click.prevent="onDelete(item.id)">删除</a>
                    </div>
                </div>
            </router-link>
        </section>
        <section class="pagenation">
            <el-pagination small background layout="prev, pager, next" :total="total" :current-page="page" @current-change="onPageChange"></el-pagination>
        </section>
    </div>
</template>

<script>
    import blog from '@/api/blog.js';
    import { mapGetters } from 'vuex';

    export default {
        data: function(){
            return {
                blogs: [],
                page: 1,
                total: 0,
                nothing: false
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        created: function(){
            this.page = this.$route.query.page || 1;//从url获取当前页数
            blog.getBlogsByUserId(this.user.id, { page: this.page }).then(res=>{
                this.page = res.page;
                this.total = res.total;
                this.blogs = res.data;
                if(this.blogs.length == 0) this.nothing = true;
            });
        },
        methods: {
            splitDate: function(dateString){//处理日期
                let dateObj = typeof dateString === 'object' ? dateString : new Date(dateString);
                return {
                    date: dateObj.getDate(),
                    month: dateObj.getMonth() + 1,
                    year: dateObj.getFullYear()
                }
            },
            onPageChange: function(newPage){
                blog.getBlogsByUserId(this.user.id, { page: newPage }).then(res => {
                    this.page = res.page;
                    this.total = res.total;
                    this.blogs = res.data;
                    this.$router.push({ path: '/mine', query: { page: newPage } });//把页数写进url
                    window.scrollTo(0, 0);
                });
            },
            onDelete: function(id){
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    return blog.deleteBlog({ blogId: id });//删除博客 返回的是promise对象，可以接着链式操作
                }).then(res=>{
                    this.$message.success('删除成功!');
                    this.$router.push({ path: '/mine' });//删除后 再删除url上的参数
                    return blog.getBlogsByUserId(this.user.id);//删除后再获取第一页的博客 - 意为刷新
                }).then(res => {
                    this.page = res.page;
                    this.total = res.total;
                    this.blogs = res.data;
                    if (this.blogs.length == 0) this.nothing = true;
                });
            }
        }
    }
</script>

<style scoped>
.user-info{
    justify-content: flex-start;
    margin-top: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebebeb;
}
.avatar{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 20px;
    flex: 0 0 auto;
}
.user-info h3{
    flex: 1 1 auto;
    word-break: break-all;/*英文、汉字都自动换行*/
}
.nothing{
    font-size: 16px;
    text-align: center;
    color: var(--textLighterColor);
    padding: 30px 0;
}
.item{
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
}
.date{
    width: 46px;
    text-align: center;
    margin-right: 20px;
    flex: 0 0 auto;
}
.right{
    margin-top: 14px;
    min-height: 94px;
    flex: 1 1 auto;
}
.right h3,
.right p{
    word-break: break-all;/*英文、汉字都自动换行*/
}
.date span{
    display: block;
    color: var(--textLighterColor);
}
.day{
    font-size: 40px;
}
.actions{
    font-size: 12px;
}
.actions a{
    color: var(--themeLighterColor);
    text-decoration: none;
}
.pagenation{
    margin: 20px 0;
    text-align: center;
}
</style>