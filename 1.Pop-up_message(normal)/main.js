(() => {
  const startBackdrop = document.getElementById('start-backdrop');
  const confirmBtn = document.getElementById('confirm-btn');
  const popupLayer = document.getElementById('popup-layer');
  const bgMusic = document.getElementById('bgMusic');

  if (!startBackdrop || !confirmBtn || !popupLayer || !bgMusic) {
    console.warn('[main] 缺少必要的页面节点，功能未启动。');
    return;
  }
  // 这是弹窗信息，你可以修改
  const messages = [
    "多喝水哦~",
    "保持微笑呀",
    "每天都要元气满满",
    "记得吃水果",
    "保持好心情",
    "好好爱自己",
    "我想你了",
    "我想你了",
    "我想你了",
    "梦想成真",
    "期待下一次见面",
    "金榜题名",
    "别太累啦，偶尔偷懒也好",
    "要相信自己奥",
    "你超棒的",
    "记得好好护肤",
    "珍惜每一刻",
    "学会爱自己，才能更好地爱别人",
    "顺顺利利",
    "早点休息",
    "愿所有烦恼都消失",
    "别熬夜",
    "今天过得开心嘛",
    "天冷了，多穿衣服"
  ];

  const themeClasses = [
    "theme-blue", "theme-green", "theme-orange", "theme-purple", "theme-pink", "theme-yellow",
    "theme-cyan", "theme-lime", "theme-red", "theme-teal", "theme-indigo", "theme-amber",
    "theme-rose", "theme-mint", "theme-peach", "theme-lavender", "theme-coral", "theme-sky", "theme-lemon"
  ];

  const animationClasses = [
    "anim-top", "anim-bottom", "anim-left", "anim-right", "anim-topleft", "anim-topright", "anim-bottomleft", "anim-bottomright"
  ];

  let intervalId = null;
  let popupCount = 0;

  const MAX_POPUPS = 420;
  const SPAWN_INTERVAL_MS = 100;

  function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnPopup() {
    if (popupCount >= MAX_POPUPS) return;

    const popup = document.createElement('div');
    popup.className = `popup ${sample(themeClasses)} ${sample(animationClasses)}`;

    const header = document.createElement('div');
    header.className = 'header';

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = '💝';

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = '提示';

    header.appendChild(icon);
    header.appendChild(title);

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = sample(messages);

    popup.appendChild(header);
    popup.appendChild(content);

    const { innerWidth: ww, innerHeight: wh } = window;
    const popupW = 230;
    const popupH = 65;
    const pad = 5;

    const left = Math.floor(randomBetween(pad, Math.max(pad, ww - popupW - pad)));
    const top = Math.floor(randomBetween(pad, Math.max(pad, wh - popupH - pad)));
    const deg = Math.floor(randomBetween(-5, 5));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.transform = `rotate(${deg}deg)`;
    popup.style.zIndex = String(100 + popupCount);

    popupLayer.appendChild(popup);
    popupCount += 1;
  }

  function startSpawning() {
    if (intervalId) return;
    intervalId = setInterval(() => {
      spawnPopup();
      if (popupCount >= MAX_POPUPS) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }, SPAWN_INTERVAL_MS);
  }

  function startExperience() {
    startBackdrop.setAttribute('aria-hidden', 'true');
    startBackdrop.style.display = 'none';

    try {
      bgMusic.volume = 0.6;
      bgMusic.loop = true;
      const p = bgMusic.play();
      if (p && typeof p.then === 'function') {
        p.catch(err => console.log('音频播放失败:', err));
      }
    } catch (err) {
      console.log('音频播放失败:', err);
    }

    const floatBalls = document.getElementById('float-balls');
    if (floatBalls) {
      floatBalls.style.display = 'flex';
      const ballMake = document.getElementById('ball-make');
      if (ballMake && Math.random() > 1 / 7) ballMake.style.display = 'none';
      setTimeout(() => { floatBalls.classList.add('show'); }, 100);
    }

    startSpawning();
  }

  confirmBtn.addEventListener('click', startExperience);
  startBackdrop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startExperience();
  });
})();