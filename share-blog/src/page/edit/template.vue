<template>
    <div id="edit">
        <h1>编辑文章</h1>
        <h3>文章标题</h3>
        <el-input v-model="title"></el-input>
        <p class="msg">字数不限</p>
        <h3>内容简介</h3>
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="description"></el-input>
        <p class="msg">字数不限</p>
        <h3>文章内容</h3>
        <el-input type="textarea" :autosize="{ minRows: 12, maxRows: 24}" placeholder="文章内容支持 markdown 语法" v-model="content"></el-input>
        <p class="msg">字数不限</p>
        <div class="flex switch-wrap">
            <label class="tips">是否展示到首页</label>
            <label>否</label>
            <el-switch v-model="atIndex" active-color="#149739" inactive-color="#e84233">
            </el-switch>
            <label>是</label>
        </div>
        <el-button @click="onEdit">确定</el-button>
    </div>
</template>

<script>
    import blog from '@/api/blog.js';

    export default {
        data: function () {
            return {
                blogId: '',
                title: '',
                description: '',
                content: '',
                atIndex: false
            }
        },
        created: function(){
            this.blogId = this.$route.params.blogId;//url取参
            blog.getDetail({ blogId: this.blogId }).then(res=>{
                this.title = res.data.title;
                this.description = res.data.description;
                this.content = res.data.content;
                this.atIndex = res.data.atIndex;
            });
        },
        methods: {
            onEdit: function(){
                if (this.title == '') return this.$message.error('"标题"不能为空');
                if (this.description == '') return this.$message.error('"简介"不能为空');
                if (this.content == '') return this.$message.error('"内容"不能为空');

                let atIndexToString = this.atIndex === false ? 'false' : 'true';
                blog.updateBlog({ blogId: this.blogId }, { title: this.title, description: this.description, content: this.content, atIndex: atIndexToString }).then(res=>{
                    this.$message.success(res.msg);
                    this.$router.push({path: `/detail/${res.data.id}`});//编辑成功后，跳转到详情页
                });
            }
        }
    }
</script>

<style scoped>
    #create,
    #edit {
        margin: 20px 0;
    }

    h1 {
        text-align: center;
    }

    p {
        text-align: right;
        font-size: 12px;
        color: var(--textLighterColor);
    }

    .switch-wrap {
        justify-content: flex-start;
        margin: 10px 0 20px 0;
    }

    label.tips {
        margin-right: 10px;
    }

    label {
        margin: 0 4px;
    }
</style>