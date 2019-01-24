<template>
    <footer class="flex">
        <p>© Let's share</p>
        <!-- <p>{{name}} <span @click="onChangeName">test login</span></p> -->
    </footer>
</template>
<script>
    // import { mapGetters, mapActions } from 'vuex';

    // export default {
    //     data: function(){
    //         return {}
    //     },
    //     computed: {
    //         ...mapGetters([
    //             'name'
    //         ])
    //     },
    //     methods: {
    //         ...mapActions([
    //             'chengeName'
    //         ]),
    //         onChangeName: function () {
    //             this.chengeName({ username: 'czjdrj', password: 'dajdajdaj' }).then(res=>{
    //                 console.log('Promise callback~');
    //             });
    //         }
    //     }
    // }
</script>
<style scoped>
    footer{
        padding: 20px;
        background: #d7d7d7;
        color: #666;
        font-size: 13px;
        text-align: center;
    }
</style>