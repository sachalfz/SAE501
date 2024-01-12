<template>
    <div class="rules" @click="openPopupRules">
        <p class="rules-txt" style="cursor: pointer;">Guess an album by its criteria !</p>
        <font-awesome-icon icon="question-circle" class="rules-svg"> </font-awesome-icon>
    </div>
    <div class="solo-rules">
        <div class="rules-bloc true">
            <p class="bloc-txt">True</p>
        </div>
        <div class="rules-bloc mid">
            <p class="bloc-txt">One or more correct</p>
        </div>
        <div class="rules-bloc false">
            <p class="bloc-txt">False</p>
        </div>
    </div>

    <div v-if="popupRulesVisible" class="popuprules">
        <div class="popuprules--header">
            <p class="popuprules--header--title">Guess a Rap Album</p>
            <font-awesome-icon icon="times" class="close--icon" @click="closePopupRules"/>
        </div>
        <p class="popuprules--description">Enter a random album to begin. Next, with the clues you got by choosing one, try to find the right album and win the game !</p>
        <div class="popuprules--lifes">
            <div class="popuprules--lifes--group">
                <img src="../assets/icons/disk_full.svg" alt="disk full" class="popuprules--lifes--icon">
                <img src="../assets/icons/disk_broken.svg" alt="disk full" class="popuprules--lifes--icon">
            </div>
            <p class="popuprules--lifes--txt">You have 10 lives per game, so choose well !</p>
        </div>
    </div>

</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// Dans votre fichier script
library.add(faQuestionCircle, faTimes);

export default {
    name: 'SoloRules',
    data() {
        return {
            popupRulesVisible: false,
        }
    },
    methods: {
        openPopupRules() {
            this.popupRulesVisible = true;
        },
        closePopupRules() {
            this.popupRulesVisible = false;
        }
    },
    components: {
        FontAwesomeIcon
    }
}
</script>