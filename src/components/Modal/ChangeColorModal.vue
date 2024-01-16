<script setup>
import { defineProps, inject } from "vue";

const props = defineProps({ period: String });
const colors = inject("colors");
const theme = inject("theme");

function changeThemeColor(color) {
  const index = colors.colorModal.value.findIndex((item) => item == true);
  if (index == 0) {
    theme.themeforView.value.pomodoro.bg = color;
  } else if (index == 1) {
    theme.themeforView.value.short.bg = color;
  } else {
    theme.themeforView.value.long.bg = color;
  }
  colors.colorModal.value[index] = false;
}
</script>
<template>
  <div class="modal-mask">
    <div class="modal-container">
      <h3 class="font-bold py-[18px] px-[23px] text-center border-b">
        Pick a color for {{ period }}
      </h3>

      <div class="p-4 grid grid-cols-5 gap-[0.6rem]">
        <button
          @click="() => changeThemeColor(color.color)"
          v-for="color in colors.colors.value"
          :key="color.name"
          class="w-[64px] h-[64px] rounded-xl"
          :style="{ backgroundColor: color.color }"
        >
          <div class="check" v-if="color.chosed"></div>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  height: 100vh;
}

.modal-container {
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  width: 400px;
}

.check::after {
  content: "";
  display: block;
  margin-left: 30px;
  width: 6px;
  height: 11px;
  border-style: solid;
  border-color: rgb(255, 255, 255);
  border-image: initial;
  border-width: 0px 3px 3px 0px;
  transform: rotate(45deg);
}
</style>
