<template>
    <div class="searchbar">
      <input
        type="text"
        placeholder="Type an album"
        v-model="searchText"
        class="searchbar--txt"
      />
      <img src="../assets/icons/search_dark.svg" alt="search" class="searchbar--icon"/>
    </div>
</template>

<script>
export default {
data() {
    return {
    searchText: "",
    };
},
};
</script>
  