<template>
  <header>
    <button @click="keyDialogOpen = true">Set API key</button>
    <dialog :open="keyDialogOpen">
      <h2>API Key</h2>
      <form>
        <div>
          <label>
            <span>Env name (just for password managers)</span>
            <input type="text" autocomplete="username" placeholder="default" />
          </label>
        </div>
        <div>
          <label>
            <span>OpenAI API Key</span>
            <input type="password" v-model="apiKey" />
          </label>
        </div>
      </form>
      <button @click="keyDialogOpen = false">Close</button>
    </dialog>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { storeInjectionKey } from "../store";

const keyDialogOpen = ref(false);
const store = useStore(storeInjectionKey);

const apiKey = computed<string | null>({
  get: () => store.state.apiKey,
  set: (value) => {
    store.commit("setApiKey", value);
  },
});
</script>
