<script setup>
import { ref, onUnmounted, computed, inject, watch, watchEffect } from "vue";
import InputForm from "@/components/Form.vue";
import Modal from "@/components/Modal/SettingModal.vue";
import cloneDeep from "lodash/cloneDeep";
import DoneAll from "@/components/Object/FinishedAll.vue";

const newTask = ref(false);
const second = ref(0);
const isVisibleAddNote = ref(false);
const theme = inject("theme");
const tools = ref(false);
const openSetting = ref(false);
const formdata = ref({ pomoNum: 1, title: "", note: "" });
const fixNote = ref(false);
const nextId = ref(2);
const timeLine = ref(0);
const amOrPm = ref("AM");
const allDoneHour = ref();
const allDoneMin = ref();
const leftTime = ref();
const bigWidth = ref(window.innerWidth > 350);

const minute = ref(
  parseInt(
    theme.per === 2
      ? theme.themeforView.value.long.mins
      : theme.per === 1
        ? theme.themeforView.value.short.mins
        : theme.themeforView.value.pomodoro.mins
  )
);
const tasks = ref([
  {
    title: "First",
    finished: 2,
    allTask: 3,
    note: "www",
    id: 0,
    isChecked: false,
    isPoint: true,
    taskList: true,
    taskFix: false,
  },
  {
    title: "Second",
    finished: 0,
    allTask: 7,
    note: "",
    id: 1,
    isChecked: false,
    isPoint: false,
    taskList: true,
    taskFix: false,
  },
]);
const fixFormdata = ref(cloneDeep(tasks.value));
watch(
  tasks,
  (newVal) => {
    fixFormdata.value = cloneDeep(newVal);
  },
  { deep: true }
);

const tasksRef = ref(tasks.value);
const menuButtons = [
  { icon: "src/assets/picture/graph-white.png", text: "Report", click: "" },
  {
    icon: "src/assets/picture/config-white.png",
    text: "Setting",
    click: () => toSetting(true),
  },
  { icon: "src/assets/picture/user-white.png", text: "Login", click: "" },
];
const toolsBtns = [
  {
    icon: "src/assets/picture/delete-black.png",
    text: "Clear finished tasks",
    click: () => clearFinished(),
  },
  {
    icon: "src/assets/picture/clear-black.png",
    text: "Clear act pomodoros",
    click: "",
  },
  {
    icon: "src/assets/picture/save-black2.png",
    text: "Save as template",
    click: "",
  },
  {
    icon: "src/assets/picture/plus-black.png",
    text: "Add from templates",
    click: "",
  },
  {
    icon: "src/assets/picture/integration-black.png",
    text: "Import from Todoist",
    click: "",
  },
  {
    icon: "src/assets/picture/delete-black.png",
    text: "Clear all tasks",
    click: () => clearAll(),
  },
];

const finishedAll = computed(() => {
  return exitTask.value === true && leftPomo.value === nowSchedule.value;
});

const curTaskNum = computed(() => {
  const index = tasks.value.findIndex((item) => item.isPoint === true);
  if (tasks.value[index]) {
    return tasks.value[index].id + 1;
  }
});

const curTaskName = computed(() => {
  const index = tasks.value.findIndex((item) => item.isPoint === true);
  if (tasks.value[index]) {
    return tasks.value[index].title;
  }
});

const leftPomo = computed(() => {
  const left = tasks.value.filter((item) => item.isChecked === false);
  return left.reduce((acc, curr) => acc + curr.allTask, 0);
});

const nowSchedule = computed(() => {
  const left = tasks.value.filter((item) => item.isChecked === false);
  return left.reduce((acc, curr) => parseInt(acc) + parseInt(curr.finished), 0);
});

const exitTask = computed(() => {
  return tasks.value.length !== 0;
});

const fixMin = computed(() => {
  return minute.value < 10 ? "0" + minute.value : minute.value;
});

const fixSec = computed(() => {
  return second.value < 10 ? "0" + second.value : second.value;
});

watch(theme.per, (newValue, oldValue) => {
  minute.value = parseInt(theme.theme.value.mins);
  second.value = 0;
});

//新增任務
function addNewTask(condition) {
  const allFixClose = tasks.value.every((item) => !item.taskFix);
  if (!allFixClose) {
    showConfirmText();
  }
  if (condition == true) {
    tasks.value = tasks.value.map((item) => {
      return { ...item, taskFix: false, taskList: true };
    });
    newTask.value = true;
  } else {
    formdata.value = { pomoNum: 1, title: "", note: "" };
    newTask.value = false;
    isVisibleAddNote.value = false;
  }
}

function toSetting(condition) {
  openSetting.value = condition;
}

function clearFinished() {
  tasks.value = tasks.value.map((item) => !item.isChecked);
  tools.value = false;
}

function clearAll() {
  const confirm = window.confirm("Are you sure you want to delete all tasks?");
  if (confirm) {
    tasks.value = [];
  }
  tools.value = false;
}

watchEffect(() => {
  let curHour = new Date().getHours();
  let curMin = new Date().getMinutes();

  timeLine.value =
    ((theme.theme.value.mins * 60 - (minute.value * 60 + second.value)) /
      (theme.theme.value.mins * 60)) *
    100;

  const newTask = tasks.value.filter((item) => item.isChecked === false);

  if (newTask.length > 0) {
    const a = theme.themeforView.value.pomodoro.mins;
    const b = theme.themeforView.value.short.mins;
    const c = theme.themeforView.value.long.mins;
    const d = minute.value;
    const nowTotal = parseInt(leftPomo.value - nowSchedule.value);
    if (theme.per === 0) {
      curMin = curMin + d + (nowTotal - 1) * (a + b);
    } else if (theme.per === 1) {
      curMin = curMin + nowTotal * (a + b);
    } else {
      curMin = curMin + nowTotal * a + (nowTotal - 1) * b + c;
    }
    leftTime.value =
      Math.round(((curMin - new Date().getMinutes()) / 60) * 10) / 10;

    while (curMin >= 60) {
      curMin -= 60;
      curHour += 1;
    }
    while (curHour >= 24) {
      curHour -= 24;
    }
  }
  if (curHour > 12) {
    amOrPm.value = "PM";
    if (theme.timeForm.value === "12") {
      curHour -= 12;
    }
  }

  allDoneHour.value = curHour;
  allDoneMin.value = curMin >= 10 ? curMin : "0" + curMin;
});

function handleStart(condition) {
  theme.start.value = condition;
  if (condition == true) {
    counting();
  }
}

function toolsBtn() {
  tools.value = !tools.value;
}

//新增任務
function newTaskSubmitted() {
  const newItem = {
    title: formdata.value.title,
    allTask: formdata.value.pomoNum,
    note: formdata.value.note,
    finished: 0,
    id: nextId.value,
    taskFix: false,
    taskList: true,
    isChecked: false,
    isPoint: false,
  };
  nextId.value += 1;
  tasks.value.push(newItem);
  formdata.value = { pomoNum: 1, title: "", note: "" };
  newTask.value = false;
}

//修改任務
function fixSubmit(index) {
  tasks.value = fixFormdata.value;
  tasks.value[index].taskList = true;
  tasks.value[index].taskFix = false;
}

//刪除任務
function deleteTask(index) {
  const indexToDelete = tasks.value.findIndex((item) => item.id === index);

  if (indexToDelete !== -1) {
    tasks.value.splice(indexToDelete, 1);
    tasks.value.forEach((task, i) => {
      task.id = i;
    });
  }
}

function counting() {
  let intervelId;
  intervelId = setInterval(() => {
    if (theme.start.value && (minute.value > 0 || second.value > 0)) {
      if (second.value > 0) {
        console.log("test");
        second.value -= 1;
      } else if (minute.value > 0) {
        minute.value -= 1;
        second.value = 59;
      } else {
        clearInterval(intervelId);
      }
    } else {
      clearInterval(intervelId);
      theme.start.value = false;
    }
  }, 1000);

  onUnmounted(() => {
    clearInterval(intervelId);
    theme.start.value = false;
  });
}

watchEffect(() => {
  if (minute.value === 0 && second.value === 0) {
    const id = tasks.value.findIndex((item) => item.isPoint === true);
    theme.toNextPeriod();
    if (theme.per.value === 1) {
      tasks.value = tasks.value.map((item, index) => {
        if (index == id) {
          return { ...item, finished: item.finished + 1 };
        } else {
          return { ...item };
        }
      });
      theme.toggleBtn(1);
      if (theme.isSwitch[1] === false) {
        theme.start.value = false;
      }
    } else {
      theme.toggleBtn(0);
      if (theme.isSwitch[0] === false) {
        theme.start.value = false;
      }
    }
  }
});

watch(
  () => tasksRef.value,
  (newValue) => {
    if (theme.isSwitch.value[2] == true) {
      tasksRef.value = newValue.map((item) => {
        if (item.finished >= item.allTask) {
          return { ...item, isChecked: true };
        }
        return item;
      });
    }
  },
  { deep: true }
);

watchEffect(() => {
  if (theme.per.value === 0) {
    theme.periodLog.value.push("pomo");
  } else if (theme.per.value === 1) {
    theme.periodLog.value.push("short");
  } else {
    theme.periodLog.value = [];
  }
});

function plus() {
  if (formdata.value.pomoNum >= 1) {
    formdata.value.pomoNum += 1;
  } else {
    formdata.value.pomoNum += 0.1;
  }
}

function minus() {
  if (formdata.value.pomoNum > 1) {
    formdata.value.pomoNum -= 1;
  } else {
    formdata.value.pomoNum -= 0.1;
  }
}

function fixPlus(index) {
  if (fixFormdata.value[index].allTask >= 1) {
    fixFormdata.value[index].allTask += 1;
  } else {
    fixFormdata.value[index].allTask += 0.1;
  }
}

function fixMinus(index) {
  if (fixFormdata.value[index].allTask > 1) {
    fixFormdata.value[index].allTask -= 1;
  } else {
    fixFormdata.value[index].allTask -= 0.1;
  }
}

function showConfirmText() {
  window.confirm("The change will be lost. Are you sure you want to close it?");
}

function openFix(id) {
  const allFixClose = tasks.value.every((item) => !item.taskFix);
  if (!allFixClose) {
    showConfirmText();
  }
  tasks.value = tasks.value.map((item) => {
    if (item.id == id) {
      return { ...item, taskFix: true, taskList: false };
    } else {
      return { ...item, taskFix: false, taskList: true };
    }
  });
}

function closeFix(id) {
  if (
    fixFormdata.value[id].title !== tasks.value[id].title ||
    fixFormdata.value[id].note !== tasks.value[id].note ||
    fixFormdata.value[id].allTask !== tasks.value[id].allTask ||
    fixFormdata.value[id].finished !== tasks.value[id].finished
  ) {
    showConfirmText();
  }
  fixNote.value = false;
  tasks.value = tasks.value.map((item) => {
    return { ...item, taskFix: false, taskList: true };
  });
}

function showNoteInput() {
  isVisibleAddNote.value = true;
}
function showNote() {
  fixNote.value = true;
}

function handleCheck(id) {
  const newCheck = tasks.value.map((item) => {
    if (item.id === id) {
      if (item.isChecked) {
        return { ...item, isChecked: false };
      } else {
        return { ...item, isChecked: true };
      }
    } else {
      return item;
    }
  });

  const isCheckArray = newCheck.filter((x) => x.isChecked);
  const notCheckArray = newCheck.filter((x) => !x.isChecked);
  tasks.value = [...notCheckArray, ...isCheckArray];
}

function handlePoint(id) {
  tasks.value = tasks.value.map((item) => {
    if (item.id === id) {
      return { ...item, isPoint: true };
    } else {
      return { ...item, isPoint: false };
    }
  });
}
</script>

<template>
  <div class="m-auto max-w-[620px] all-view px-3">
    <div
      class="header flex justify-between shadow items-center h-[60px] border-black"
    >
      <h1
        class="text-white font-bold text-xl flex items-center"
        :class="{
          'text-transparent': theme.isSwitch.value[4] && theme.start.value,
        }"
      >
        <img
          class="h-5 w-5 mr-1 pomo-check"
          :class="{
            hidden: theme.isSwitch.value[4] && theme.start.value,
          }"
          src="../assets/picture/icon-white2.png"
          alt="A check icon"
        /><span class="title">Pomofocus</span>
      </h1>

      <div class="flex relative">
        <button
          v-for="item in menuButtons"
          :key="item.text"
          class="px-3 py-2 menu-btn text-xs text-white text-center font-bold items-center m-auto bg-btnColor rounded flex ml-2.5 relative active:top-0.5"
          @click="item.click"
        >
          <img class="menu-icon w-4 h-4 mr-1" :src="item.icon" />
          <p class="menu-name">{{ item.text }}</p>
        </button>
      </div>
      <Modal v-if="openSetting" :closeModal="() => toSetting(false)"></Modal>
    </div>
    <p class="bg-white h-[3px]" :style="{ width: timeLine + '%' }"></p>
    <div class="w-contentW all-view m-auto relative">
      <div
        class="bg-bgGray gray-area rounded-md pt-5 pb-[30px] mb-5 mt-10"
        :class="{
          'bg-transparent': theme.isSwitch.value[4] && theme.start.value,
        }"
      >
        <div class="flex justify-center relative select-period">
          <button
            v-for="(btn, index) in Object.keys(theme.themeforView.value)"
            :key="index"
            :class="{
              'text-white rounded py-0.5 px-3 relative active:top-0.5': true,
              'bg-checked': theme.nowShow.value[index],
              'text-transparent bg-transparent':
                theme.isSwitch.value[4] && theme.start.value,
            }"
            @click="theme.toggleBtn(index)"
          >
            <span v-if="bigWidth">{{
              theme.themeforView.value[btn].title
            }}</span>
            <span v-else>{{ theme.themeforView.value[btn].abbr }}</span>
          </button>
        </div>
        <div
          class="text-clock show-clock flex justify-center text-white font-bold mt-5 text-center whitespace-nowrap"
        >
          {{ fixMin }}
          <div class="show-second">:{{ fixSec }}</div>
        </div>
        <button
          v-if="!theme.start.value"
          :style="{ color: theme.theme.value.bg }"
          @click="handleStart(true)"
          class="start rounded font-bold mt-2 w-[200px] bg-white text-startBtn cursor-pointer px-3 h-[55px]"
        >
          START
        </button>
        <div v-else="!theme.start.value" class="flex items-center">
          <button
            :style="
              theme.isSwitch.value[4] && theme.start.value
                ? { color: 'white', backgroundColor: 'transparent' }
                : { color: theme.theme.value.bg }
            "
            @click="handleStart(false)"
            class="ml-[140px] pause rounded font-bold mt-[14px] -mb-[6px] w-[200px] bg-white text-startBtn cursor-pointer px-3 h-[55px]"
          >
            PAUSE
          </button>
          <button>
            <img
              class="next-btn h-[22px] w-[22px] ml-[50px] mt-[10px] cursor-pointer"
              src="../assets/picture/next-white.png"
              alt="next period"
              @click="theme.toNextPeriod()"
            />
          </button>
        </div>
      </div>
      <div
        class="flex justify-center h-12 items-center mt-2 mb-[6px] small-start"
      >
        <img
          src="../assets/picture/play-white.png"
          class="w-4 h-4 mx-[6px] cursor-pointer"
          alt="start"
          v-if="!theme.start.value"
          @click="handleStart(true)"
        />
        <img
          src="../assets/picture/pause-white.png"
          class="w-4 h-4 mx-[6px] cursor-pointer"
          alt="pause"
          @click="handleStart(false)"
          v-else="!theme.start.value"
        />
        <img
          src="../assets/picture/next-white3.png"
          class="w-4 h-4 mx-[6px] cursor-pointer"
          alt="next period"
          @click="theme.toNextPeriod()"
        />
      </div>

      <h3
        class="text-white current-num text-center text-base mb-1 cursor-pointer opacity-50 hover:opacity-100"
      >
        #{{ curTaskNum }}
      </h3>
      <h3 class="text-white text-center text-lg current-name">
        {{ curTaskName }}
      </h3>
      <div
        class="about-task"
        :class="{
          hidden: theme.isSwitch.value[4] && theme.start.value,
        }"
      >
        <div
          class="flex justify-between mb-[18px] border-white border-b-2 pb-[14px] items-center"
        >
          <h3 class="text-white font-bold relative">Tasks</h3>
          <button
            class="bg-btnColor p-2 rounded cursor-pointer relative active:top-0.5"
            @click="toolsBtn"
          >
            <img
              class="w-4 h-4"
              src="../assets/picture/threedots-white.png"
              alt="three dots"
            />
          </button>
        </div>
        <ul
          v-if="tools"
          class="bg-white w-[210px] z-10 py-2 rounded absolute top-[455px] right-0"
        >
          <li
            class="flex items-center"
            v-for="tool in toolsBtns"
            :key="tool.text"
            @click="tool.click"
          >
            <img class="w-[14px] h-[14px] mr-2" :src="tool.icon" />{{
              tool.text
            }}
          </li>
        </ul>
        <div v-for="(task, index) in tasks" :key="task.title">
          <div
            v-if="task.taskList"
            :class="{
              'bg-white mb-2 rounded  border-l-[6px] px-[14px] py-[18px] ': true,
              'border-black': task.isPoint,
              'border-transparent hover:border-l-btnColor': !task.isPoint,
            }"
            @click.capture="() => handlePoint(task.id)"
          >
            <div class="flex justify-between items-center">
              <h4 class="flex">
                <div
                  :class="{
                    'border-pomoRed bg-pomoRed': task.isChecked,
                    'border-checkIcon bg-checkIcon': !task.isChecked,
                  }"
                  class="check-icon inline-block w-[22px] h-[22px] border-2 rounded-full cursor-pointer mr-2.5"
                  @click="() => handleCheck(task.id)"
                ></div>
                {{ task.title }}
              </h4>
              <div class="flex">
                <div class="text-lg text-numColor font-bold mr-[18px]">
                  {{ task.finished }}
                  <span class="text-sm ml-0.5">/ {{ task.allTask }}</span>
                </div>
                <button
                  class="border rounded p-1"
                  @click="() => openFix(task.id)"
                >
                  <img
                    class="w-[18px] h-[18px]"
                    src="../assets/picture/vertical-ellipsis.png"
                    alt="three dots click to show more"
                  />
                </button>
              </div>
            </div>
            <p
              v-if="task.note"
              class="bg-yellow-100 shadow-sm max-w-[420px] mt-[18px] ml-[26px] py-2.5 rounded-lg pl-3"
            >
              {{ task.note }}
            </p>
          </div>
          <InputForm
            v-if="task.taskFix"
            class="mb-2"
            v-model:title="fixFormdata[task.id].title"
            v-model:pomo="fixFormdata[task.id].allTask"
            v-model:note="fixFormdata[task.id].note"
            :showNote="showNote"
            :visibleNote="task.note != '' || fixNote"
            :plus="() => fixPlus(task.id)"
            :minus="() => fixMinus(task.id)"
            :submit="() => fixSubmit(task.id)"
            :addnewTask="() => closeFix(task.id)"
            ><template v-slot:delete
              ><button @click="() => deleteTask(task.id)">
                Delete
              </button></template
            >
            <template v-slot:subtitle>Act/</template>
            <template v-slot:finishedNum
              ><input
                class="bg-formGray mr-2.5 p-2.5 font-bold w-[75px] rounded"
                v-model="fixFormdata[task.id].finished"
              />/
            </template>
          </InputForm>
        </div>

        <button
          v-if="!newTask"
          @click="addNewTask(true)"
          class="add-task mb-2 cursor-pointer bg-checked mt-1 h-[64px] flex justify-center items-center opacity-80 rounded-lg text-white"
        >
          +Add Task
        </button>

        <InputForm
          v-else="!newTask"
          v-model:pomo="formdata.pomoNum"
          v-model:title="formdata.title"
          v-model:note="formdata.note"
          :showNote="showNoteInput"
          :plus="plus"
          :minus="minus"
          :addnewTask="addNewTask"
          :submit="newTaskSubmitted"
          :visibleNote="isVisibleAddNote"
          ><template v-slot:delete><div></div></template
        ></InputForm>
        <div
          v-if="exitTask"
          class="bg-checked finished mt-7 py-[18px] px-3 flex justify-center text-white border-t-[1px]"
        >
          <div class="mx-2 text-timeColor">
            Pomos:<span class="mr-0.5 ml-[1px] text-2xl text-white font-bold">{{
              nowSchedule
            }}</span
            ><span class="ml-[1px] mr-[3px]">/</span
            ><span class="mr-0.5 ml-[1px] text-2xl text-white font-bold">{{
              leftPomo
            }}</span>
          </div>
          <div class="mx-2 text-timeColor">
            Fished At:
            <span class="mr-0.5 ml-[1px] text-2xl text-white font-bold"
              ><span v-if="theme.timeForm.value === '12'">{{ amOrPm }}</span>
              {{ allDoneHour }}:{{ allDoneMin }}</span
            >({{ leftTime }}H)
          </div>
        </div>
      </div>
    </div>
    <DoneAll :clear="() => clearAll()" v-if="finishedAll" />
  </div>
</template>

<style scoped lang="scss">
.check-icon::after {
  content: "";
  display: block;
  margin-left: 7px;
  margin-top: 3px;
  width: 5px;
  height: 11px;
  border-style: solid;
  border-color: rgb(255, 255, 255);
  border-image: initial;
  border-width: 0px 3px 3px 0px;
  transform: rotate(45deg);
}
.start {
  box-shadow: rgb(235, 235, 235) 0px 6px 0px;
}
.start,
.pause {
  margin-left: calc(50% - 100px);
}
.add-task {
  border: 2px dashed rgba(255, 255, 255, 0.4);
  width: 100%;
}
input:focus,
textarea:focus {
  outline: none;
}
ul {
  box-shadow:
    rgba(0, 0, 0, 0.15) 0px 10px 20px,
    rgba(0, 0, 0, 0.1) 0px 3px 6px;
  li {
    font-size: 14px;
    padding: 10px 16px;
    cursor: pointer;
    &:hover {
      background-color: rgb(223, 223, 223);
    }
  }
}

@media (max-width: 680px) {
  .show-clock {
    font-size: 100px;
  }
}
@media (max-width: 576px) {
  .menu-btn {
    padding: 8px;
  }
  .menu-name {
    display: none;
  }
  .menu-icon {
    width: 18px;
    height: 18px;
    margin: 0;
  }
}
@media (max-width: 520px) {
  .all-view {
    max-width: 100%;
  }
}
@media (max-width: 400px) {
  .finished {
    flex-direction: column;
    text-align: center;
  }
}
@media (max-width: 350px) {
  .title {
    display: none;
  }
  .show-clock {
    font-size: 80px;
  }
  .start,
  .pause {
    width: 165px;
    height: 50px;
    font-size: 18px;
    margin-left: calc(50% - 82px);
  }
  .pomo-check {
    width: 26px;
    height: 26px;
    margin: 0 4px 0 2px;
  }
}
@media (max-width: 230px) {
  .header,
  .about-task,
  .select-period,
  .start,
  .pause,
  .show-second,
  .current-num,
  .next-btn {
    display: none;
  }
  .gray-area {
    padding: 0;
    margin: 0px;
  }
  .current-name {
    transform: rotate(90deg);
  }
}
@media (min-width: 230px) {
  .small-start {
    display: none;
  }
}
@media (max-width: 200px) {
  .show-clock {
    font-size: 58px;
    line-height: 120px;
  }
}
</style>
