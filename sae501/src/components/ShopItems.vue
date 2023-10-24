<template>
    <div class="shop--items">
        <div class="shop--items--self" v-for="(item, index) in items" :key="index">
            <img :src="item.img" alt="item image" class="item--img">
            <div class="item--price">
                <p class="item--price--txt">{{ item.price }}</p>
                <img src="../assets/icons/streamz_yellow.svg" alt="streamz" class="item--price--img">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            items: Array,
            randomUser: Object,
        }
    }
</script>