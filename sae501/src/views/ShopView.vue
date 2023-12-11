<template>
    <div class="view shop">
        <ShopHead/>
        <ShopItems/>
    </div>    
</template>

<script>
import ShopHead from "../components/ShopHead.vue"
import ShopItems from "../components/ShopItems.vue"

export default {
    components: {
        ShopHead,
        ShopItems
    }
};
</script>



