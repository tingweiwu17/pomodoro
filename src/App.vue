<script setup>
import { computed, provide, ref } from "vue";
import Focus from "./views/Focus.vue";

const themeforView = ref({
  pomodoro: { bg: "rgb(186,73,73)", mins: 25, title: "Pomodoro", abbr: "Pomo" },
  short: {
    bg: "rgb(56,133,138)",
    mins: 5,
    title: "Short Break",
    abbr: "Short",
  },
  long: { bg: "rgb(57,112,151)", mins: 15, title: "Long Break", abbr: "Long" },
});

const longInterval = ref(3);
const periodLog = ref([]);
const num = periodLog.value.filter((item) => item === "pomo").length;
const timeForm = ref("24");
const isSwitch = ref([true, false, true, false, false]);
const per = ref(0);
const nowShow = ref([true, false, false]);
const start = ref(false);

const theme = computed(() => {
  return per.value == 0
    ? themeforView.value.pomodoro
    : per.value == 1
      ? themeforView.value.short
      : themeforView.value.long;
});

function clickSwitch(id) {
  isSwitch.value[id] = !isSwitch.value[id];
}

function toggleBtn(id) {
  per.value = id;
  nowShow.value = nowShow.value.map((item, index) => index === id);
}

function toNextPeriod() {
  const index = nowShow.value.findIndex((item) => item === true);
  if (num.value >= longInterval.value) {
    toggleBtn(2);
  } else {
    if (index == 1 || index == 2) {
      toggleBtn(0);
    } else {
      toggleBtn(1);
    }
  }
}

provide("theme", {
  theme,
  per,
  nowShow,
  themeforView,
  toggleBtn,
  toNextPeriod,
  isSwitch,
  clickSwitch,
  longInterval,
  periodLog,
  num,
  timeForm,
  start,
});
</script>

<template>
  <main
    class="min-h-screen pb-[60px]"
    :style="
      isSwitch[4] && start
        ? { backgroundColor: 'black' }
        : { backgroundColor: theme.bg }
    "
  >
    <Focus></Focus>
  </main>
</template>

<style scoped></style>
