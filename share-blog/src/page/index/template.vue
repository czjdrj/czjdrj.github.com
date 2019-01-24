<template>
    <div id="index">
        <section class="blog-posts">
            <router-link :to="`/detail/${item.id}`" class="flex item" v-for="(item, index) in blogs" :key="index">
                <figure class="avatar">
                    <img :src="item.user.avatar" :alt="item.user.username" :title="item.user.username">
                    <figcaption>{{item.user.username}}</figcaption>
                </figure>
                <div class="right">
                    <h3>{{item.title}} <span>{{friendlyDate(item.createdAt)}}</span></h3>
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
                blogs: [],
                page: 1,
                total: 0
            }
        },
        created: function(){
            this.page = this.$route.query.page || 1;//从url获取当前页数
            blog.getIndexBlogs({ page: this.page }).then(res=>{
                this.blogs = res.data;
                this.page = res.page;
                this.total = res.total;
            });
        },
        methods: {
            onPageChange: function(newPage){
                blog.getIndexBlogs({ page: newPage }).then(res => {
                    this.blogs = res.data;
                    this.page = res.page;
                    this.total = res.total;
                    this.$router.push({ path: '/', query: { page: newPage } });//把页数写进url
                    window.scrollTo(0,0);
                });
            }
        }
    }
</script>

<style scoped>
#index{
    margin-top: 10px;
}
.blog-posts{
    overflow: hidden;
}
.item{
    align-items: flex-start;
    margin: 20px 0;
}
.item .avatar{
    width: 60px;
    text-align: center;
    margin-right: 20px;
    flex: 0 0 auto;
}
.avatar img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.avatar figcaption{
    width: 60px;
    overflow:hidden;
	white-space:nowrap;
	text-overflow:ellipsis;
    font-size: 12px;
    color: var(--textLighterColor);
}
.right{
    min-height: 85px;
    flex: 1 1 auto;
}
.right h3,
.right p{
    word-break: break-all;/*英文、汉字都自动换行*/
}
.right span{
    color: var(--textLighterColor);
    font-size: 12px;
    font-weight: normal;
}
.pagenation{
    margin: 20px 0;
    text-align: center;
}
</style>