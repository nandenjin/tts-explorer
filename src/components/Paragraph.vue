<template>
  <div>
    <input
      type="text"
      autocomplete="off"
      v-model="text"
      ref="inputRef"
      size="50"
      @keydown="handleKey"
    />
    <button
      @click="emit('requestGenerate')"
      :disabled="
        (props.audio?.text === text && props.audio?.voice === voice) || loading
      "
    >
      Generate
    </button>
    <progress v-if="loading" />
    <audio v-if="srcUrl" :src="srcUrl" controls />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { GeneratedAudio } from "../types";
import { storeInjectionKey } from "../store";
import { useStore } from "vuex";

const store = useStore(storeInjectionKey);
const voice = computed(() => store.state.voice);

const text = defineModel<string>();
const props = defineProps<{
  audio?: GeneratedAudio;
  loading?: boolean;
}>();
const emit = defineEmits<{
  requestAddLine: [];
  requestRemoveLine: [];
  requestGenerate: [];
}>();

const srcUrl = computed(() => {
  if (!props.audio) return null;
  return URL.createObjectURL(props.audio.data);
});

const inputRef = ref<HTMLInputElement>();

const handleKey = (keyEvent: KeyboardEvent) => {
  if (keyEvent.isComposing) return;
  if (keyEvent.key === "Enter") {
    emit("requestAddLine");
    keyEvent.preventDefault();
  } else if (keyEvent.key === "Backspace" && text.value === "") {
    emit("requestRemoveLine");
    keyEvent.preventDefault();
  }
};

defineExpose({
  focus: () => {
    inputRef.value?.focus();
  },
});
</script>
