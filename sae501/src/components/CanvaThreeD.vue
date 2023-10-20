<template>
    <div class="threedcanvas" id="webgl"></div>
</template>

<script>
import { createScene } from '../script/script.js';

export default {
  mounted() {
    createScene();

    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    gsapScript.async = true;

    const esModuleShimsScript = document.createElement('script');
    esModuleShimsScript.src = 'https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js';
    esModuleShimsScript.async = true;

    // Chargement des scripts
    document.head.appendChild(gsapScript);
    document.head.appendChild(esModuleShimsScript);

    // Attendez que les scripts soient chargés avant d'effectuer des opérations liées à GSAP ou es-module-shims.
    gsapScript.onload = () => {
      // Votre code GSAP ici
    };

    esModuleShimsScript.onload = () => {
      // Votre code lié à es-module-shims ici
    };
  }
};
</script>