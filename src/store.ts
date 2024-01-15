import { InjectionKey } from "vue";
import { Store, createStore } from "vuex";

export type State = {
  apiKey: string | null;
  voice: string;
};
export const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

export const storeInjectionKey: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    apiKey: null,
    voice: voices[0],
  },
  mutations: {
    setApiKey(state, apiKey: string) {
      state.apiKey = apiKey;
    },
    setVoice(state, voice: string) {
      state.voice = voice;
    },
  },
});
