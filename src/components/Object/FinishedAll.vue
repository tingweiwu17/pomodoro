<template>
  <div
    class="bg-white w-[495px] p-[14px] finished rounded-lg flex justify-between items-center fixed bottom-4"
  >
    <p class="ml-[6px] text-sm">
      You've finished all your tasks for today<span>🎉</span>
    </p>
    <button
      @click="clear"
      class="bg-finished text-white border-2 border-finished py-2 px-4 rounded opacity-90 text-sm"
    >
      Clear Tasks
    </button>
  </div>
</template>
<script setup>
const props = defineProps({ clear: Function });
</script>
<style scoped>
.finished {
  left: calc(50% - 248px);
}
</style>
