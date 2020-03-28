<template>
    <div>
        <p>轻量、方便、快捷</p>
        <p>尽在妮可云盘</p>
        <p>限时限量开放注册中，请联系站长</p>
        <img src="../assets/login.webp" alt="">
    </div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
}
</script>
<style lang="less" scoped>
div{
    p{
        font-size: 50px;
        color: #606266;
    }
    p:nth-child(1){
        margin-left: 20%;
    }
    p:nth-child(2){
        margin-left: 30%;
    }
    p:nth-child(3){
        font-size: 12px;
        position: absolute;
        bottom: 0;
        left: 40%;
    }
    img{
        position: absolute;
        bottom: 0;
        left: 60%;
        vertical-align: bottom;
    }
    
}
</style>