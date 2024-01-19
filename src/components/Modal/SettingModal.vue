<script setup>
import { inject, ref, defineProps, provide, watchEffect } from "vue";
import ChangeColor from "@/components/Modal/ChangeColorModal.vue";

const theme = inject("theme");
const colorModal = ref([false, false, false]);
const props = defineProps({ closeModal: Function });
const colors = ref([
  { name: "red", color: "rgb(186,73,73)", chosed: false },
  { name: "green", color: "rgb(56,133,138)", chosed: false },
  { name: "blue", color: "rgb(57,112,151)", chosed: false },
  { name: "yellow", color: "rgb(164,137,60)", chosed: false },
  { name: "purple", color: "rgb(125,83,162)", chosed: false },
  { name: "pink", color: "rgb(175,78,145)", chosed: false },
  { name: "grass", color: "rgb(81,138,88)", chosed: false },
  { name: "grayColor", color: "rgb(84,87,100)", chosed: false },
]);
const colorBlock = [
  { color: "", id: 0 },
  { color: "", id: 1 },
  { color: "", id: 2 },
];

provide("colors", { colors, colorModal });

function changeColor(id) {
  colorModal.value[id] = true;
}

watchEffect(() => {
  let tentative =
    colorModal.value[0] === true
      ? theme.themeforView.value.pomodoro.bg
      : colorModal.value[1] === true
        ? theme.themeforView.value.short.bg
        : theme.themeforView.value.long.bg;
  const id = colors.value.findIndex((item) => item.color == tentative);
  colors.value = colors.value.map((item, index) => {
    return {
      ...item,
      chosed: index === id,
    };
  });
});
</script>

<template>
  <div class="modal-mask">
    <div class="modal-container">
      <h3
        class="font-bold py-[18px] px-[23px] flex justify-between items-center border-b"
      >
        Setting<img
          src="../../assets/picture/remove-black-sm.png"
          alt="Close setting"
          class="w-[14px] h-[14px] cursor-pointer"
          @click="closeModal"
        />
      </h3>
      <div class="modal-body">
        <h3 class="text-numColor font-bold text-sm mt-7 mb-2.5">TIMER</h3>
        <div class="py-3">
          <h3 class="text-pomoColor font-bold">Time(minutes)</h3>
          <div class="flex justify-between mt-2.5">
            <div v-for="item in theme.themeforView.value" :key="item.title">
              <h4 class="text-sm mb-1 text-numColor">{{ item.title }}</h4>
              <input class="time-input" v-model="item.mins" type="number" />
            </div>
          </div>
        </div>

        <div class="flex justify-between font-bold text-pomoColor py-3">
          Auto Start Breaks
          <button
            @click="theme.clickSwitch(0)"
            class="switch-btn"
            :class="{
              'bg-on': theme.isSwitch.value[0],
              'bg-off': !theme.isSwitch.value[0],
            }"
          >
            <div
              class="bg-white w-7 h-7 relative rounded-full"
              :class="{
                'left-[30px]': theme.isSwitch.value[0],
                'left-0.5': !theme.isSwitch.value[0],
              }"
            ></div>
          </button>
        </div>
        <div class="flex justify-between font-bold text-pomoColor py-3">
          Auto Start Pomodoros<button
            @click="theme.clickSwitch(1)"
            class="switch-btn"
            :class="{
              'bg-on': theme.isSwitch.value[1],
              'bg-off': !theme.isSwitch.value[1],
            }"
          >
            <div
              class="bg-white w-7 h-7 relative rounded-full"
              :class="{
                'left-[30px]': theme.isSwitch.value[1],
                'left-0.5': !theme.isSwitch.value[1],
              }"
            ></div>
          </button>
        </div>
        <div class="flex justify-between font-bold text-pomoColor py-3 mb-6">
          Long Break interval<input
            class="w-[70px] bg-formGray p-2.5 rounded h-10"
            v-model="theme.longInterval.value"
          />
        </div>
        <h3 class="text-numColor font-bold text-sm mb-2.5 border-t pt-7">
          TASK
        </h3>
        <div class="flex justify-between font-bold text-pomoColor py-3">
          Auto Check Tasks<button
            @click="theme.clickSwitch(2)"
            class="switch-btn"
            :class="{
              'bg-on': theme.isSwitch.value[2],
              'bg-off': !theme.isSwitch.value[2],
            }"
          >
            <div
              class="bg-white w-7 h-7 relative rounded-full"
              :class="{
                'left-[30px]': theme.isSwitch.value[2],
                'left-0.5': !theme.isSwitch.value[2],
              }"
            ></div>
          </button>
        </div>
        <div class="flex justify-between font-bold text-pomoColor py-3 mb-6">
          Auto Switch tasks
          <button
            @click="() => theme.clickSwitch(3)"
            class="switch-btn"
            :class="{
              'bg-on': theme.isSwitch.value[3],
              'bg-off': !theme.isSwitch.value[3],
            }"
          >
            <div
              class="bg-white w-7 h-7 relative rounded-full"
              :class="{
                'left-[30px]': theme.isSwitch.value[3],
                'left-0.5': !theme.isSwitch.value[3],
              }"
            ></div>
          </button>
        </div>

        <h3 class="text-numColor font-bold text-sm mb-2.5 border-t pt-7">
          THEME
        </h3>
        <div class="flex justify-between font-bold text-pomoColor py-3">
          Color Themes
          <div>
            <button
              @click="() => changeColor(color.id)"
              v-for="(color, index) in colorBlock"
              :key="color.color"
              class="w-7 h-7 rounded-md"
              :class="{ 'mr-3': color.id !== 2 }"
              :style="{
                backgroundColor:
                  index == 0
                    ? theme.themeforView.value.pomodoro.bg
                    : index == 1
                      ? theme.themeforView.value.short.bg
                      : theme.themeforView.value.long.bg,
              }"
            ></button>
          </div>
        </div>
        <ChangeColor v-if="colorModal[0]" :period="'Pomodoro'"></ChangeColor>
        <ChangeColor v-if="colorModal[1]" :period="'Short Break'"></ChangeColor>
        <ChangeColor v-if="colorModal[2]" :period="'Long Break'"></ChangeColor>
        <div class="flex justify-between font-bold text-pomoColor py-3">
          Hour Format
          <select
            class="h-10 w-[130px] p-3 text-sm bg-select rounded"
            v-model="theme.timeForm.value"
          >
            <option value="24">24-hour</option>
            <option value="12">12-hour</option>
          </select>
        </div>
        <div class="flex justify-between font-bold text-pomoColor py-3 mb-6">
          Dark Mode when running<button
            @click="() => theme.clickSwitch(4)"
            class="switch-btn"
            :class="{
              'bg-on': theme.isSwitch.value[4],
              'bg-off': !theme.isSwitch.value[4],
            }"
          >
            <div
              class="bg-white w-7 h-7 relative rounded-full"
              :class="{
                'left-[30px]': theme.isSwitch.value[4],
                'left-0.5': !theme.isSwitch.value[4],
              }"
            ></div>
          </button>
        </div>
      </div>

      <div class="bg-formGray rounded-b-lg text-right py-[14px] px-5">
        <button
          class="bg-black ok text-white text-sm rounded min-w-[70px] border-2 border-black py-2 px-3"
          @click="closeModal"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  height: 100vh;
  overflow-y: scroll;
  padding: 48px 0px;
}

.modal-container {
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  width: 400px;
}
.modal-body {
  margin: 20px auto;
  padding: 0px 20px;
}
.time-input {
  background-color: rgb(239, 239, 239);
  width: 100px;
  padding: 10px;
  border-radius: 4px;
}
.switch-btn {
  cursor: pointer;
  width: 60px;
  height: 32px;
  border-radius: 50px;
  position: relative;
  display: inline-flex;
  align-items: center;
}
.ok {
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;
}
</style>
