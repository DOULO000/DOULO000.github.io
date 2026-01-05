(() => {
  const startBackdrop = document.getElementById('start-backdrop');
  const confirmBtn = document.getElementById('confirm-btn');
  const popupLayer = document.getElementById('popup-layer');
  const bgMusic = document.getElementById('bgMusic');

  if (!startBackdrop || !confirmBtn || !popupLayer || !bgMusic) {
    console.warn('[heart] 缺少必要节点，取消初始化');
    return;
  }

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

  const HEART_POINTS = 150;
  const SPAWN_INTERVAL_MS = 200;

  function generateHeartPoints(n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      pts.push({ x, y });
    }
    return pts;
  }

  const heartShape = generateHeartPoints(HEART_POINTS);

  let spawnTimer = null;
  let spawned = 0;

  const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (min, max) => Math.random() * (max - min) + min;

  function choosePopupSize(viewW) {
    let w = 140, h = 50;
    if (viewW <= 375) { w = 55; h = 36; }
    else if (viewW <= 480) { w = 65; h = 38; }
    else if (viewW <= 640) { w = 80; h = 42; }
    else if (viewW <= 768) { w = 95; h = 46; }
    else if (viewW <= 1024) { w = 110; h = 50; }
    else if (viewW <= 1440) { w = 130; h = 54; }
    else { w = 150; h = 58; }
    return { w, h };
  }

  function spawnHeartPopup() {
    if (spawned >= HEART_POINTS) return;

    const el = document.createElement('div');
    el.className = `popup ${sample(themeClasses)}`;
    el.classList.add('heart-anim');

    const header = document.createElement('div');
    header.className = 'header';

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = '💝';

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = '提示';

    header.append(icon, title);

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = sample(messages);

    el.append(header, content);

    const { innerWidth: ww, innerHeight: wh } = window;
    const { w: popupW, h: popupH } = choosePopupSize(ww);

    const p = heartShape[spawned];
    const gridW = 32, gridH = 34, margin = 40;
    const usableW = ww - margin * 2;
    const usableH = wh - margin * 2;
    const scale = Math.min(usableW / gridW, usableH / gridH) * 0.95;

    const finalLeft = ww / 2 + p.x * scale - popupW / 2;
    const finalTop = wh / 2 + p.y * scale - popupH / 2;

    let startLeft, startTop;
    switch (Math.floor(Math.random() * 4)) {
      case 0: startLeft = rand(0, ww); startTop = -popupH - 100; break;
      case 1: startLeft = ww + 100; startTop = rand(0, wh); break;
      case 2: startLeft = rand(0, ww); startTop = wh + 100; break;
      default: startLeft = -popupW - 100; startTop = rand(0, wh); break;
    }

    const rotation = Math.floor(rand(-3, 3));

    el.style.left = `${startLeft}px`;
    el.style.top = `${startTop}px`;
    el.style.zIndex = String(100 + spawned);
    el.style.setProperty('--start-left', `${startLeft}px`);
    el.style.setProperty('--start-top', `${startTop}px`);
    el.style.setProperty('--final-left', `${finalLeft}px`);
    el.style.setProperty('--final-top', `${finalTop}px`);
    el.style.setProperty('--rotation', `${rotation}deg`);

    popupLayer.appendChild(el);
    spawned += 1;
  }

  function startSpawnSequence() {
    if (spawnTimer) return;
    spawnTimer = setInterval(() => {
      spawnHeartPopup();
      if (spawned >= HEART_POINTS) {
        clearInterval(spawnTimer);
        spawnTimer = null;
        setTimeout(() => {
          console.log('开始爱心后续动画');
          runGatherAndExplode();
        }, 3500);
      }
    }, SPAWN_INTERVAL_MS);
  }

  function runGatherAndExplode() {
    const nodes = popupLayer.querySelectorAll('.popup');
    console.log('找到弹窗数量:', nodes.length);

    const { innerWidth: ww, innerHeight: wh } = window;
    const centerX = ww / 2;
    const centerY = wh / 2;

    // 固化当前动画后的样式，防止跳变
    nodes.forEach(node => {
      const cs = window.getComputedStyle(node);
      node.style.animation = 'none';
      node.style.left = cs.left;
      node.style.top = cs.top;
      node.style.transform = cs.transform;
      node.style.opacity = '1';
    });

    setTimeout(() => {
      console.log('开始从爱心位置聚拢到中央');
      nodes.forEach((node, i) => {
        setTimeout(() => {
          node.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
          node.style.left = `${centerX - 55}px`;
          node.style.top = `${centerY - 25}px`;
          node.style.transform = 'scale(1) rotate(0deg)';
          node.style.zIndex = String(1000 + i);
          node.style.boxShadow = '0 1px 3px rgba(255,105,135,0.3)';
        }, i * 5);
      });

      const afterGatherDelay = HEART_POINTS * 5 + 1000;
      setTimeout(() => {
        console.log('开始爆炸散开');
        nodes.forEach((node, i) => {
          const targetLeft = Math.random() * (ww + 100) - 50;
          const targetTop = Math.random() * (wh + 100) - 50;
          const r = Math.random() * 20 - 10;
          const s = 1.2 + Math.random() * 0.6;
          setTimeout(() => {
            node.style.transition = 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            node.style.left = `${targetLeft}px`;
            node.style.top = `${targetTop}px`;
            node.style.transform = `scale(${s}) rotate(${r}deg)`;
            node.style.boxShadow = '0 2px 8px rgba(255,105,135,0.4)';
          }, i * 8);
        });
      }, afterGatherDelay);
    }, 50);
  }

  function startExperience() {
    startBackdrop.setAttribute('aria-hidden', 'true');
    startBackdrop.style.display = 'none';

    try {
      bgMusic.volume = 0.6;
      bgMusic.loop = true;
      const p = bgMusic.play();
      if (p && typeof p.then === 'function') p.catch(err => console.log('音频播放失败:', err));
    } catch (err) {
      console.log('音频播放失败:', err);
    }

    const floatBalls = document.getElementById('float-balls');
    if (floatBalls) {
      floatBalls.style.display = 'flex';
      const ballMake = document.getElementById('ball-make');
      if (ballMake && Math.random() > 1 / 7) ballMake.style.display = 'none';
      setTimeout(() => floatBalls.classList.add('show'), 100);
    }

    startSpawnSequence();
  }

  confirmBtn.addEventListener('click', startExperience);
  startBackdrop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startExperience();
  });
})();