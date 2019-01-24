<template>
    <div id="user">
        <section class="flex user-info">
            <img class="avatar" :src="user.avatar" :alt="user.username" :title="user.username">
            <h3>{{user.username}}</h3>
        </section>
        <section>
            <router-link :to="`/detail/${item.id}`" class="flex item" v-for="(item, index) in blogs" :key="item.index">
                <div class="date">
                    <span class="day">{{splitDate(item.createdAt).date}}</span>
                    <span class="month">{{splitDate(item.createdAt).month}}月</span>
                    <span class="year">{{splitDate(item.createdAt).year}}</span>
                </div>
                <div class="right">
                    <h3>{{item.title}}</h3>
                    <p>{{item.description}}</p>
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

    export default {
        data: function(){
            return {
                userId: '',
                blogs: [],
                user: {},
                page: 1,
                total: 0
            }
        },
        created: function(){
            this.page = this.$route.query.page || 1;//从url获取当前页数
            this.userId = this.$route.params.userId;
            blog.getBlogsByUserId(this.userId, { page: this.page }).then(res=>{
                this.blogs = res.data;
                this.page = res.page;
                this.total = res.total;
                if(res.data.length > 0){
                    this.user = res.data[0].user
                }
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
                blog.getBlogsByUserId(this.userId, { page: newPage }).then(res => {
                    this.blogs = res.data;
                    this.page = res.page;
                    this.total = res.total;
                    this.$router.push({ path: `/user/${this.user.id}`, query: { page: newPage } });//把页数写进url
                    window.scrollTo(0, 0);
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
.pagenation{
    margin: 20px 0;
    text-align: center;
}
</style>