export type IParagraph = {
  id: string;
  text: string;
  audio?: GeneratedAudio;
};

export type GeneratedAudio = {
  data: Blob;
  text: string;
  voice: string;
};
