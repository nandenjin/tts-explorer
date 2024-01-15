<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import SiteHeader from "./components/SiteHeader.vue";
import Paragraph from "./components/Paragraph.vue";
import { IParagraph } from "./types";
import { useStore } from "vuex";
import { storeInjectionKey, voices } from "./store";

const store = useStore(storeInjectionKey);
const apiKey = computed(() => store.state.apiKey);
const paragraphs = ref<IParagraph[]>([]);

const selectedVoice = computed({
  get: () => store.state.voice,
  set: (value) => {
    store.commit("setVoice", value);
  },
});

const paragraphRefs = ref<InstanceType<typeof Paragraph>[]>([]);

const tasks = ref<{ [key: string]: Promise<unknown> }>({});
const generate = (paragraph: IParagraph) => {
  const token = apiKey.value;
  const { id, text } = paragraph;
  const voice = selectedVoice.value;

  if (paragraph?.audio?.text === text && paragraph?.audio?.voice === voice) {
    return;
  }

  if (!token) {
    alert("Please set your API key first");
    return;
  }

  tasks.value[id] = (async () => {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        voice,
        input: text,
      }),
    });
    if (!res.ok) {
      console.error(await res.text());
      delete tasks.value[id];
      throw new Error("Failed to generate audio");
    }
    const blob = await res.blob();
    paragraphs.value.find((p) => p.id === id)!.audio = {
      text,
      data: blob,
      voice,
    };
    delete tasks.value[id];
  })();
};

onMounted(() => {
  if (paragraphs.value?.length === 0) {
    paragraphs.value.push({
      id: Date.now().toString(),
      text: "",
    });
  }
});
</script>

<template>
  <SiteHeader />
  <div>
    <select v-model="selectedVoice">
      <option v-for="model in voices" :key="model">{{ model }}</option>
    </select>
    <button @click="paragraphs.forEach((paragraph) => generate(paragraph))">
      Generate all
    </button>
  </div>
  <div>
    <Paragraph
      v-for="(paragraph, i) in paragraphs"
      :key="paragraph.id"
      v-model="paragraph.text"
      :audio="paragraph.audio"
      ref="paragraphRefs"
      :loading="!!tasks[paragraph.id]"
      @requestAddLine="
        () => {
          paragraphs.splice(i + 1, 0, { id: Date.now().toString(), text: '' });
          nextTick(() => {
            paragraphRefs[i + 1].focus();
          });
        }
      "
      @requestRemoveLine="
        () => {
          if (paragraphs.length > 1) {
            paragraphs.splice(i, 1);
            nextTick(() => {
              paragraphRefs[i - 1].focus();
            });
          }
        }
      "
      @requestGenerate="generate(paragraph)"
    />
  </div>
</template>

<style scoped></style>
