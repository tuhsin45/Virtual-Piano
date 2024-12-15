const whiteKeys = document.querySelectorAll('.whitekey');
const blackKeys = document.querySelectorAll('.blackkey');
const startRecordingBtn = document.getElementById('start-recording');
const playRecordingBtn = document.getElementById('play-recording');

let isRecording = false;
let recording = [];
let activeKeys = new Set();

const playSound = sound => {
    const audio = new Audio(`sounds/${sound}.mp3`);
    audio.play();
};

const handleKeyPress = e => {
    const key = e.target;
    const sound = key.getAttribute('data-sound');
    if (sound && !activeKeys.has(sound)) {
        activeKeys.add(sound);
        playSound(sound);
        key.classList.add('active');
        setTimeout(() => {
            key.classList.remove('active');
        }, 150);
        if (isRecording) {
            recording.push({ sound, time: Date.now() });
        }
    }
};

const handleKeyRelease = e => {
    const key = e.target;
    const sound = key.getAttribute('data-sound');
    if (sound) {
        activeKeys.delete(sound);
    }
};

const startRecording = () => {
    recording = [];
    isRecording = true;
    startRecordingBtn.textContent = 'Recording...';
    startRecordingBtn.disabled = true;
    playRecordingBtn.disabled = true;
};

const stopRecording = () => {
    isRecording = false;
    startRecordingBtn.textContent = 'Start Recording';
    startRecordingBtn.disabled = false;
    playRecordingBtn.disabled = false;
    if (recording.length > 0) {
        const startTime = recording[0].time;
        recording = recording.map(event => {
            return { sound: event.sound, time: event.time - startTime };
        });
    }
};

const playRecording = () => {
    if (recording.length === 0) {
        return;
    }
    recording.forEach(event => {
        setTimeout(() => {
            const key = document.querySelector(`[data-sound="${event.sound}"]`);
            if (key) {
                playSound(event.sound);
                key.classList.add('active');
                setTimeout(() => {
                    key.classList.remove('active');
                }, 150);
            }
        }, event.time);
    });
};

whiteKeys.forEach(key => {
    key.addEventListener('mousedown', handleKeyPress);
    key.addEventListener('mouseup', handleKeyRelease);
});

blackKeys.forEach(key => {
    key.addEventListener('mousedown', handleKeyPress);
    key.addEventListener('mouseup', handleKeyRelease);
});

startRecordingBtn.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
        setTimeout(stopRecording, 10000);
    }
});

playRecordingBtn.addEventListener('click', () => {
    playRecording();
});

document.addEventListener('keydown', e => {
    const key = document.querySelector(`[data-key="${e.keyCode}"]`);
    const sound = key ? key.getAttribute('data-sound') : null;
    if (key && sound && !activeKeys.has(sound)) {
        activeKeys.add(sound);
        playSound(sound);
        key.classList.add('active');
        setTimeout(() => {
            key.classList.remove('active');
        }, 150);
        if (isRecording) {
            recording.push({ sound, time: Date.now() });
        }
    }
});

document.addEventListener('keyup', e => {
    const key = document.querySelector(`[data-key="${e.keyCode}"]`);
    const sound = key ? key.getAttribute('data-sound') : null;
    if (key && sound) {
        activeKeys.delete(sound);
    }
});
