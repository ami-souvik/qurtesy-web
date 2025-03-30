import { useState, useRef, useEffect } from 'react';
import wavEncoder from 'wav-encoder';
import { getDatabase, ref, onValue } from 'firebase/database';
import { CiMicrophoneOn, CiMicrophoneOff } from 'react-icons/ci';
import { queueTranscribe } from '../webservices/transcribes-ws';

const AudioRecorder = () => {
  const [transcripts, setTranscripts] = useState({});
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  // const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const db = getDatabase();
    const realdbRef = ref(db, 'transcribes');
    onValue(realdbRef, (snapshot) => {
      const data = snapshot.val();
      setTranscripts(data);
    });
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const sampleRate = 16000; // Set sample rate to 16 kHz
      // const source = audioContext.createMediaStreamSource(stream);
      // const processor = audioContext.createScriptProcessor(4096, 1, 1);

      // Configure MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const wavBlob = await convertToWav(audioBlob, sampleRate);
        setAudioBlob(wavBlob);
        // setAudioUrl(URL.createObjectURL(wavBlob)); // Create audio URL for playback
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const convertToWav = async (audioBlob, sampleRate) => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await new AudioContext({ sampleRate }).decodeAudioData(arrayBuffer);

    const wavData = await wavEncoder.encode({
      sampleRate,
      channelData: [audioBuffer.getChannelData(0)], // Mono audio
    });

    return new Blob([wavData], { type: 'audio/wav' });
  };

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  const transcribe = () => {
    if (audioBlob) {
      queueTranscribe(new File([audioBlob], 'audio.wav', { type: 'audio/wav' }));
    }
  };

  return (
    <div>
      <div className="px-4 py-2 flex flex-col gap-2 border rounded-xl">
        <h2 className="text-xl font-bold">Transaction Recorder</h2>
        {/* Audio Player */}
        {/* <div className="h-24">
          {audioUrl && (
            <>
              <h3 className="text-lg font-semibold">Playback:</h3>
              <audio controls src={audioUrl} />
            </>
          )}
        </div> */}
        <div className="flex items-center py-2 gap-2">
          <button className="p-4 border rounded-2xl" onClick={toggleRecording}>
            {recording ? <CiMicrophoneOff size={24} /> : <CiMicrophoneOn size={24} />}
          </button>
          {recording && (
            <div className="flex">
              <div
                className="w-4 h-4 m-1 rounded"
                style={{
                  backgroundColor: 'red',
                }}
              />
              <p>Recording...</p>
            </div>
          )}
        </div>
        {transcripts && Object.keys(transcripts).map((key: string) => <p key={key}>{transcripts[key]}</p>)}
        <button className="py-1 border" onClick={transcribe}>
          Check
        </button>
      </div>
    </div>
  );
};

export default AudioRecorder;
