class SoundVisualizer {
  constructor(p) {
    this.p = p;
    this.freq = 440;
    this.amp = 0.3;
    this.type = "sine";
    this.playing = false;

    this.osc = new p5.Oscillator(this.type);
    this.osc.freq(this.freq);
    this.osc.amp(this.amp);

    this.fft = new p5.FFT();
  }

  setType(type) {
    this.type = type;
    this.osc.setType(type);
  }

  setFreq(freq) {
  this.freq = freq;
  this.osc.freq(freq);
  // update slider dan label
  if (window.freqSlider) window.freqSlider.value = freq;
  if (window.freqLabel) window.freqLabel.textContent = freq;  // label selalu sinkron
}

setAmp(amp) {
  this.amp = amp;
  this.osc.amp(amp);
  if (window.ampSlider) window.ampSlider.value = amp;
  if (window.ampLabel) window.ampLabel.textContent = amp.toFixed(2); // label selalu sinkron
}


  start() {
    if (!this.playing) {
      this.osc.start();
      this.playing = true;
    }
  }

  stop() {
    if (this.playing) {
      this.osc.stop();
      this.playing = false;
    }
  }

  toggle() {
    if (this.playing) this.stop();
    else this.start();
  }

  draw() {
    const p = this.p;
    p.background(30);

    // waveform
    let waveform = this.fft.waveform();
    p.noFill();
    p.stroke(0, 255, 0);
    p.beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = p.map(i, 0, waveform.length, 0, p.width);
      let y = p.map(waveform[i], -1, 1, 0, p.height / 2);
      p.vertex(x, y);
    }
    p.endShape();

    // spectrum
    let spectrum = this.fft.analyze();
    p.noStroke();
    p.fill(0, 0, 255, 150);
    for (let i = 0; i < spectrum.length; i++) {
      let x = p.map(i, 0, spectrum.length, 0, p.width);
      let h = -p.height / 2 + p.map(spectrum[i], 0, 255, p.height / 2, 0);
      p.rect(x, p.height, p.width / spectrum.length, h);
    }
  }
}

// ====== Setup ======
let visual;

function setup() {
  let cnv = createCanvas(650, 420);
  cnv.parent(document.getElementById('visuals'));
  visual = new SoundVisualizer(this);

  // ambil elemen slider & label
  window.freqSlider = document.getElementById('freqSlider');
  window.ampSlider = document.getElementById('ampSlider');
  window.freqLabel = document.getElementById('freqLabel');
  window.ampLabel = document.getElementById('ampLabel');
  const waveType = document.getElementById('waveType');

  waveType.addEventListener('change', e => visual.setType(e.target.value));
  freqSlider.addEventListener('input', e => visual.setFreq(+e.target.value));
  ampSlider.addEventListener('input', e => visual.setAmp(+e.target.value));

  document.getElementById('playBtn').addEventListener('click', () => {
    visual.start(); userStartAudio();
  });
  document.getElementById('stopBtn').addEventListener('click', () => {
    visual.stop();
  });

  // keyboard control
  window.addEventListener('keydown', function(e){
  switch(e.code){
    case 'Space':
      e.preventDefault();
      userStartAudio();
      visual.toggle();
      break;

    // Arrow keys
    case 'ArrowUp':
      e.preventDefault();
      visual.setFreq(Math.min(visual.freq + 10, 1000));
      break;
    case 'ArrowDown':
      e.preventDefault();
      visual.setFreq(Math.max(visual.freq - 10, 50));
      break;
    case 'ArrowRight':
      e.preventDefault();
      visual.setAmp(Math.min(visual.amp + 0.05, 1));
      break;
    case 'ArrowLeft':
      e.preventDefault();
      visual.setAmp(Math.max(visual.amp - 0.05, 0));
      break;

    // W/A/S/D keys
    case 'KeyW':
      e.preventDefault();
      visual.setFreq(Math.min(visual.freq + 10, 1000));
      break;
    case 'KeyS':
      e.preventDefault();
      visual.setFreq(Math.max(visual.freq - 10, 50));
      break;
    case 'KeyD':
      e.preventDefault();
      visual.setAmp(Math.min(visual.amp + 0.05, 1));
      break;
    case 'KeyA':
      e.preventDefault();
      visual.setAmp(Math.max(visual.amp - 0.05, 0));
      break;

      case 'Digit1':
      e.preventDefault();
      visual.setType('sine');
      document.getElementById('waveType').value = 'sine';
      break;
    case 'Digit2':
      e.preventDefault();
      visual.setType('square');
      document.getElementById('waveType').value = 'square';
      break;
    case 'Digit3':
      e.preventDefault();
      visual.setType('triangle');
      document.getElementById('waveType').value = 'triangle';
      break;
    case 'Digit4':
      e.preventDefault();
      visual.setType('sawtooth');
      document.getElementById('waveType').value = 'sawtooth';
      break;
  }
});

}

function draw() {
  visual.draw();
}
