(function(){
  const MIN_PETALS = 8;
  const MAX_PETALS = 16;

  const flower = document.getElementById('flower');
  const flashEl = document.getElementById('flash');
  const feedbackEl = document.getElementById('feedback');
  const resultEl = document.getElementById('result');
  const resultStamp = document.getElementById('resultStamp');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');
  const instructions = document.getElementById('instructions');
  const replayBtn = document.getElementById('replayBtn');
  const messageZone = document.querySelector('.message-zone');

  const LOVES = 'ME QUIERE';
  const LOVES_NOT = 'NO ME QUIERE';

  // On-brand copy — serios pero graciosos.
  const lovesCopy = [
    {
      title: 'Bueno, esa personita sí te quiere.',
      text: 'Como nosotros queremos ser parte de tu equipo. Pero esta página la movimos o ya no existe, ups. Regresa al inicio o cuéntanos qué buscabas por WhatsApp.'
    }
  ];

  const lovesNotCopy = [
    {
      title: '¿No te quiere? Nosotros sí.',
      text: 'La página que buscabas no existe, pero puedes hablarnos igual. Aquí sí te queremos.'
    }
  ];

  let petals = [];
  let pluckedCount = 0;
  let startsWith = LOVES; // decided randomly on each build
  let flashTimeout = null;

  function opposite(msg){
    return msg === LOVES ? LOVES_NOT : LOVES;
  }

  function buildFlower(){
    flower.querySelectorAll('.petal').forEach(p => p.remove());
    petals = [];
    pluckedCount = 0;
    resultEl.classList.remove('show');
    instructions.classList.remove('hidden');
    messageZone.classList.remove('hidden');
    feedbackEl.textContent = '\u00A0';
    flashEl.textContent = '';
    flashEl.className = 'flash';

    // Randomize petal count AND which phrase starts the sequence —
    // guarantees a genuinely random outcome each time.
    const totalPetals = Math.floor(Math.random() * (MAX_PETALS - MIN_PETALS + 1)) + MIN_PETALS;
    startsWith = Math.random() < 0.5 ? LOVES : LOVES_NOT;

    for(let i=0;i<totalPetals;i++){
      const angle = (360/totalPetals)*i;
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.transform = `translate(-50%,-100%) rotate(${angle}deg)`;
      petal.dataset.angle = angle;
      petal.addEventListener('click', onPluck);
      flower.appendChild(petal);
      petals.push(petal);
    }
  }

  function onPluck(e){
    const petal = e.currentTarget;
    if(petal.classList.contains('plucked')) return;

    // The message alternates strictly with each pluck — the classic
    // "me quiere / no me quiere" mechanic — starting from the randomized seed.
    const message = (pluckedCount % 2 === 0) ? startsWith : opposite(startsWith);
    pluckedCount++;

    showFlash(message);

    const angle = parseFloat(petal.dataset.angle);
    const flyAngle = (angle * Math.PI/180);
    const dx = Math.sin(flyAngle) * 90;
    const dy = -Math.cos(flyAngle) * 60 - 40;
    petal.style.transform = `translate(calc(-50% + ${dx}px), calc(-100% + ${dy}px)) rotate(${angle + (Math.random()>0.5?40:-40)}deg)`;
    petal.classList.add('plucked');

    const remaining = petals.length - pluckedCount;
    if(remaining === 0){
      setTimeout(() => showResult(message), 900);
    } else if (remaining <= 2){
      feedbackEl.textContent = 'Ya casi...';
    } else {
      feedbackEl.textContent = '\u00A0';
    }
  }

  function showFlash(message){
    clearTimeout(flashTimeout);
    flashEl.classList.remove('play');
    // force reflow so the animation restarts even with the same text
    void flashEl.offsetWidth;
    flashEl.textContent = message;
    flashEl.className = 'flash play ' + (message === LOVES ? 'loves' : 'loves-not');
  }

  function showResult(finalMessage){
    instructions.classList.add('hidden');
    messageZone.classList.add('hidden');
    feedbackEl.textContent = '\u00A0';

    const isLoves = finalMessage === LOVES;
    const pool = isLoves ? lovesCopy : lovesNotCopy;
    const pick = pool[Math.floor(Math.random()*pool.length)];

    resultStamp.textContent = isLoves ? 'Me quiere' : 'No me quiere';
    resultStamp.className = 'stamp ' + (isLoves ? 'loves' : 'loves-not');
    resultTitle.textContent = pick.title;
    resultText.textContent = pick.text;
    resultEl.classList.add('show');
  }

  replayBtn.addEventListener('click', buildFlower);

  buildFlower();
})();