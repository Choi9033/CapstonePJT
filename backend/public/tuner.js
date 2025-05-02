let audioContext = null;
let analyser = null;
let microphone = null;
let dataArray = null;
let intervalId = null;
let lastPitch = null;

const API_BASE_URL = "";

async function startTuning() {
  try {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    microphone.connect(analyser);

    const bufferLength = analyser.fftSize;
    dataArray = new Float32Array(bufferLength);

    intervalId = setInterval(detectPitch, 200); // 0.2초마다 분석
  } catch (err) {
    console.error("🎤 마이크 접근 실패:", err);
    document.getElementById("tuner-result").innerText = "마이크 접근에 실패했습니다.";
  }
}

async function detectPitch() {
  if (!analyser || !dataArray) return;

  analyser.getFloatTimeDomainData(dataArray);
  const pitch = autoCorrelate(dataArray, audioContext.sampleRate);

  if (pitch === -1) {
    console.log("❌ 감지 실패");
    return;
  }

  // 주파수가 너무 높으면 무시
  if (pitch > 10000) {
    console.log(`🚫 ${pitch.toFixed(2)}Hz는 10,000Hz 초과로 무시`);
    return;
  }

  console.log("🎵 감지된 pitch:", pitch.toFixed(2));

  if (lastPitch === null || Math.abs(pitch - lastPitch) > 0.5) {
    lastPitch = pitch;

    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze_pitch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency: pitch })
      });

      const result = await res.json();

      // 결과 출력은 여기서만 처리되며, 10000Hz 초과는 도달하지 않음
      document.getElementById("tuner-result").innerText = result.message;
    } catch (err) {
      console.error("🚨 서버 호출 실패:", err);
      document.getElementById("tuner-result").innerText = "API 호출 실패";
    }
  } else {
    console.log(`📭 pitch ${pitch.toFixed(2)}Hz는 이전과 유사하여 호출 생략`);
  }
}



function stopTuning() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  document.getElementById("tuner-result").innerText = "튜너 중지됨.";
}

// 개선된 pitch 추정 함수
function autoCorrelate(buffer, sampleRate) {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;  // 입력이 너무 약한 경우 무시

  for (let offset = 10; offset < MAX_SAMPLES; offset++) {  // 최소 offset 제한
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }

    correlation = 1 - (correlation / MAX_SAMPLES);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestCorrelation > 0.7 && bestOffset > 10) {
    const freq = sampleRate / bestOffset;
    return freq;
  }

  return -1;
}
