<script setup lang="ts">
import Auth from './Auth.vue'
import Registration from './Registration.vue'
import { ref } from 'vue'

//  При каждом транзите  прописвать emit = defineEmits(['popUpLoginForm'])
const emit = defineEmits(['popUpLoginForm'])

const auth = ref(true)
</script>

<template>
    <!-- Синтаксис для передачи транзитом значения через emit @popUpLoginForm="emit('popUpLoginForm')
      @popUpAuth= не через : а @ и название такое же как в defineEmits(['popUpLoginForm'] те что предаешь и не событие @Click-->
      
  <div v-if="auth === true"><Auth @auth="auth = false" @popUpLoginForm="emit('popUpLoginForm')" /></div>
  <div v-else><Registration @popUpLoginForm="emit('popUpLoginForm')" /></div>
</template>

