/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import PandaBridge from 'pandasuite-bridge';
import './index.css';

let timer = null;

function waveFlag(canvas, wavelength, amplitude, period, shading, squeeze) {
  if (!squeeze) squeeze = 0;
  if (!shading) shading = 100;
  if (!period) period = 200;
  if (!amplitude) amplitude = 10;
  if (!wavelength) wavelength = canvas.width / 10;

  const fps = 30;
  const ctx = canvas.getContext('2d');
  const w = canvas.width; const
    h = canvas.height;
  const od = ctx.getImageData(0, 0, w, h).data;
  // var ct = 0, st=new Date;
  return setInterval(() => {
    const id = ctx.getImageData(0, 0, w, h);
    const d = id.data;
    const now = (new Date()) / period;
    for (let y = 0; y < h; ++y) {
      let lastO = 0; let shade = 0;
      const sq = (y - h / 2) * squeeze;
      for (let x = 0; x < w; ++x) {
        const px = (y * w + x) * 4;
        const pct = x / w;
        const o = Math.sin(x / wavelength - now) * amplitude * pct;
        const y2 = y + (o + sq * pct) << 0;
        const opx = (y2 * w + x) * 4;
        shade = (o - lastO) * shading;
        d[px] = od[opx] + shade;
        d[px + 1] = od[opx + 1] + shade;
        d[px + 2] = od[opx + 2] + shade;
        d[px + 3] = od[opx + 3];
        lastO = o;
      }
    }
    ctx.putImageData(id, 0, 0);
  }, 1000 / fps);
}

function myInit() {
  const imageUrl = PandaBridge.resolvePath('my_image.png');

  if (timer) {
    clearInterval(timer);
  }

  const h = new Image();
  h.onload = () => {
    const flag = document.getElementById('flag');
    const amp = 20;
    const d = 0.8;

    const cur = {
      width: document.body.clientWidth * d,
      height: (document.body.clientWidth * (h.height / h.width)) * d,
    };

    flag.width = cur.width;
    flag.height = cur.height + amp * 2;
    flag.getContext('2d').drawImage(h, 0, amp, cur.width, cur.height);
    timer = waveFlag(flag, cur.width / 10, amp);
  };
  h.src = imageUrl;
}

PandaBridge.init(() => {
  PandaBridge.onLoad(() => {
    if (document.readyState === 'complete') {
      myInit();
    } else {
      document.addEventListener('DOMContentLoaded', myInit, false);
    }
  });

  PandaBridge.onUpdate(() => {
    myInit();
  });
});
