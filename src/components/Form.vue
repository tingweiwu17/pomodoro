<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  plus: Function,
  minus: Function,
  title: String,
  pomo: Number,
  addnewTask: Function,
  showNote: Function,
  visibleNote: Boolean,
  submit: Function,
  note: String,
});

const emit = defineEmits(["update:title", "update:pomo", "update:note"]);

const pomo = computed({
  get() {
    return props.pomo;
  },
  set(value) {
    emit("update:pomo", value);
  },
});
const title = computed({
  get() {
    return props.title;
  },
  set(value) {
    emit("update:title", value);
  },
});

const note = computed({
  get() {
    return props.note;
  },
  set(value) {
    emit("update:note", value);
  },
});
</script>
<template>
  <form @submit.prevent="submit">
    <div class="bg-white rounded-t-lg py-2.5 px-5">
      <input
        class="w-full py-[18px] text-startBtn text-pomoColor font-bold"
        placeholder="What are you working on?"
        v-model="title"
        required
      />
      <div class="py-2">
        <p class="font-bold text-pomoColor">
          <slot name="subtitle"></slot>Est Pomodoros
        </p>
        <div class="mt-2.5">
          <slot name="finishedNum"></slot>
          <input
            class="bg-formGray mr-2.5 p-2.5 font-bold w-[75px] rounded"
            v-model="pomo"
          />

          <button
            type="button"
            @click="plus"
            class="up-and-down mx-0.5 w-10 h-[34px] border-inherit border-2 rounded"
          >
            <img
              class="w-2.5 h-2.5 m-auto"
              src="../assets/picture/caret-up.png"
              alt="up"
            />
          </button>
          <button
            @click="minus"
            type="button"
            class="up-and-down w-10 h-[34px] border-inherit border-2 rounded"
          >
            <img
              class="w-2.5 h-2.5 m-auto"
              src="../assets/picture/caret-down.png"
              alt="down"
            />
          </button>
        </div>
      </div>
      <textarea
        v-if="visibleNote"
        v-model="note"
        class="bg-formGray w-full text-pomoColor h-[62px] py-2.5 px-[14px] rounded"
      ></textarea>
      <div class="pt-2 pb-4 flex">
        <button
          @click="showNote"
          v-if="!visibleNote"
          type="button"
          class="text-addbtn px-[6px] py-[1px] underline"
        >
          +Add Note
        </button>
        <button
          type="button"
          class="text-addbtn flex items-center px-[6px] py-[1px] underline"
        >
          +Add Project
          <img
            src="../assets/picture/lock-black.png"
            class="w-3 h-3 ml-[6px] opacity-50"
            alt="lock"
          />
        </button>
      </div>
    </div>

    <div class="bg-formGray flex justify-between px-5 py-[14px] rounded-b-lg">
      <slot name="delete"></slot>
      <div>
        <button
          @click="addnewTask"
          type="button"
          class="text-cancelbtn mr-[14px] py-2 px-3 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-black text-white py-2 px-3 text-sm rounded"
        >
          Save
        </button>
      </div>
    </div>
  </form>
</template>
<style>
.up-and-down {
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;
}
.up-and-down:active {
  box-shadow: none;
}
input,
textarea {
  outline: none;
}
</style>
