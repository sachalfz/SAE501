<template>
    <div class="redirection--header">
        <p class="redirection--header--title">We're sorry,</p>
        <p class="redirection--header--description">You can't access this game using your phone, please use a <span class="redirection--highlight">computer</span> instead</p>
    </div>
    <div class="redirection--body">
        <p class="redirection--body--txt">Check out our other gamemodes !</p>
        <div class="redirection--body--list">
            <a :href="basePath" class="redirection--body--item">
                <img src="../assets/nav/solo.svg" alt="solo" class="redirection--body--item--icon">
                <p class="redirection--body--item--txt">SOLO</p>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            basePath: String,
        }
    }
</script>