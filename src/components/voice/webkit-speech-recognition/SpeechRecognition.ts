const recognition = {
  continuous: false,
};

export const SpeechRecognition = {
  startListening: ({ continuous = true }) => {
    recognition.continuous = continuous;
  },
  stopListening: () => {},
};
