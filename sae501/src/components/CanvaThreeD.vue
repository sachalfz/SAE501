<template>
    <div class="threedcanvas" id="webgl"></div>
</template>

<script>
import { createScene } from '../script/script.js';

export default {
  mounted() {
    this.createThree();
  },
  methods: {
    async createThree() {
      await createScene();
    }
  }
};
</script>
