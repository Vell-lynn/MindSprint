
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionTimerEl = document.getElementById('questionTimer');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const questionEl = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const progressEl = document.getElementById('progress');
const boardCells = document.querySelectorAll('#board .cell');
const boardEl = document.getElementById('board');
const rabbitWrap = document.getElementById('rabbitWrap');
const rabbit = document.getElementById('rabbit');
const confettiContainer = document.getElementById('confetti-container');
const sfxWin = document.getElementById('sfx-win');
const sfxLose = document.getElementById('sfx-lose');

let score = 0;
let currentQuestionIndex = 0;
let shuffledQuestions = [];
let rabbitPosition = 0;
let lastAnswerWrong = false;
let questionTimer = null;
const questionTime = 10; // detik per soal

const questions = [
  {
    question: "Lebih berat mana antara 1 kg kapas dan 1 kg besi?",
    answers: [
      { text: "1 kg besi", correct: false },
      { text: "1 kg kapas", correct: false },
      { text: "Sama aja", correct: true }
    ]
  },
  {
    question: "Jika 3 kucing bisa tangkap 3 tikus dalam 3 menit, berapa menit 100 kucing butuh tangkap 100 tikus?",
    answers: [
      { text: "3 menit", correct: true },
      { text: "33 menit", correct: false },
      { text: "100 menit", correct: false }
    ]
  },
  {
    question: "Ada 10 burung di pohon. 2 ditembak. Berapa burung yang tersisa di pohon?",
    answers: [
      { text: "2", correct: false },
      { text: "0", correct: true },
      { text: "8", correct: false }
    ]
  },
  {
    question: "Jika sebuah jam berhenti selama 5 menit tiap 12 jam, berapa lama jam itu telat dalam 24 jam?",
    answers: [
      { text: "5 menit", correct: false },
      { text: "10 menit", correct: true },
      { text: "12 menit", correct: false }
    ]
  },
  {
    question: "Sebuah rumah punya 4 sisi, masing-masing menghadap selatan. Seekor beruang berjalan di depan rumah itu. Warnanya apa?",
    answers: [
      { text: "Putih", correct: true },
      { text: "Hitam", correct: false },
      { text: "Coklat", correct: false }
    ]
  },
  {
    question: "Ada 5 bebek, dikali 2. Berapa total bebeknya sekarang?",
    answers: [
      { text: "10 bebek", correct: false },
      { text: "7 bebek", correct: false },
      { text: "3 bebek", correct: true }
    ]
  },
  {
    question: "Apa huruf keempat dalam alfabet?",
    answers: [
      { text: "d", correct: true },
      { text: "a", correct: false },
      { text: "m", correct: false }
    ]
  },
  {
    question: "Ada berapa buah apel di pohon mapel?",
    answers: [
      { text: "40", correct: false },
      { text: "13", correct: false },
      { text: "tidak ada", correct: true }
    ]
  },
  {
    question: "Satu ibu punya 6 anak. Setiap anak punya satu saudara perempuan.",
    answers: [
      { text: "6", correct: false },
      { text: "7", correct: false },
      { text: "1", correct: true }
    ]
  },
  {
    question: "Apakah kata yang salah selalu dieja salah?",
    answers: [
      { text: "Benar", correct: false },
      { text: "Ya", correct: false },
      { text: "Salah", correct: true }
    ]
  },
  {
    question: "Aku tidak memiliki sayap, tetapi aku bisa terbang. Apa aku?",
    answers: [
      { text: "Batu", correct: false },
      { text: "Balon", correct: true },
      { text: "Ikan terbang", correct: false }
    ]
  }
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  score = 0;
  currentQuestionIndex = 0;
  rabbitPosition = 0;
  lastAnswerWrong = false;

  shuffledQuestions = shuffleArray([...questions]);

  progressEl.textContent = `Soal: 1/${shuffledQuestions.length}`;
  scoreEl.textContent = `Score: ${score}`;

  updateBoard();
  showQuestion();
}

function showQuestion() {
  const q = shuffledQuestions[currentQuestionIndex];
  questionEl.textContent = q.question;
  answerButtons.innerHTML = '';

  // start timer per soal
  if (questionTimer) clearInterval(questionTimer);
  let timeLeft = questionTime;
  questionTimerEl.textContent = `Waktu: ${timeLeft}`;
  questionTimer = setInterval(() => {
    timeLeft--;
    questionTimerEl.textContent = `Waktu: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(questionTimer);
      handleQuestionTimeout();
    }
  }, 1000);

  const shuffledAnswers = shuffleArray([...q.answers]);
  shuffledAnswers.forEach(ans => {
    const btn = document.createElement('button');
    btn.textContent = ans.text;
    btn.addEventListener('click', () => selectAnswer(ans.correct));
    answerButtons.appendChild(btn);
  });
}

function handleQuestionTimeout() {
  lastAnswerWrong = true;
  rabbitPosition = Math.max(0, rabbitPosition - 1);
  updateBoard();

  nextQuestion();
}

function selectAnswer(isCorrect) {
  if (questionTimer) clearInterval(questionTimer);

  if (isCorrect) {
    score++;
    rabbitPosition++;
    lastAnswerWrong = false;
  } else {
    if (lastAnswerWrong) {
      rabbitPosition = Math.max(0, rabbitPosition - 1);
    }
    lastAnswerWrong = true;
  }

  scoreEl.textContent = `Score: ${score}`;
  updateBoard();

  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length && rabbitPosition < 11) {
    progressEl.textContent = `Soal: ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
    showQuestion();
  } else {
    endGame();
  }
}

function updateBoard() {
  const cols = 4; 
  const rows = 3; 
  const totalCells = cols * rows;

  boardCells.forEach(cell => cell.textContent = ''); 
  boardCells[0].textContent = '🌱';
  boardCells[totalCells - 1].textContent = '🥕';

  let row = Math.floor(rabbitPosition / cols);
  let col = rabbitPosition % cols;

  if (row % 2 === 1) {
    col = cols - 1 - col;
  }

  let index = row * cols + col;
  boardCells[index].textContent = '🐰';
}


function endGame() {
  if (questionTimer) clearInterval(questionTimer);
  // determine win/lose by checking final rabbit position vs board end
  const totalCells = boardCells.length;
  const reachedFinish = rabbitPosition >= totalCells - 1;

  if (reachedFinish) {
    showWin();
  } else {
    showLose();
  }

  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  finalScoreEl.textContent = `Skor Akhir: ${score}`;
}

// Confetti creator (DOM-based, simple)
function createConfetti(count = 60) {
  if (!confettiContainer) return;
  const colors = ['#ffcc00','#ff6b6b','#6bffb3','#6bb3ff','#d36bff','#ffd36b'];
  const boxWidth = window.innerWidth;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.background = color;
    const left = Math.random() * boxWidth;
    piece.style.left = `${left}px`;
    const tx = (Math.random() - 0.5) * 200; // horizontal drift
    piece.style.setProperty('--tx', `${tx}px`);
    const duration = 1400 + Math.random() * 1600;
    piece.style.animation = `confetti-fall ${duration}ms linear forwards`;
    confettiContainer.appendChild(piece);
    // remove after animation
    setTimeout(() => piece.remove(), duration + 200);
  }
}

function showWin() {
  // play win sound (best effort)
  if (sfxWin) { sfxWin.currentTime = 0; sfxWin.play().catch(()=>{}); }
  // show confetti
  createConfetti(80);
}

function showLose() {
  if (sfxLose) { sfxLose.currentTime = 0; sfxLose.play().catch(()=>{}); }
  // optional: visual feedback for losing (shake board)
  boardEl.classList.add('shake');
  setTimeout(() => boardEl.classList.remove('shake'), 700);
}

function restartGame() {
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}
=======
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionTimerEl = document.getElementById('questionTimer');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const questionEl = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const progressEl = document.getElementById('progress');
const boardCells = document.querySelectorAll('#board .cell');
const boardEl = document.getElementById('board');
const rabbitWrap = document.getElementById('rabbitWrap');
const rabbit = document.getElementById('rabbit');
const confettiContainer = document.getElementById('confetti-container');
const sfxWin = document.getElementById('sfx-win');
const sfxLose = document.getElementById('sfx-lose');

let score = 0;
let currentQuestionIndex = 0;
let shuffledQuestions = [];
let rabbitPosition = 0;
let lastAnswerWrong = false;
let questionTimer = null;
const questionTime = 10; 

const questions = [
  {
    question: "Lebih berat mana antara 1 kg kapas dan 1 kg besi?",
    answers: [
      { text: "1 kg besi", correct: false },
      { text: "1 kg kapas", correct: false },
      { text: "Sama aja", correct: true }
    ]
  },
  {
    question: "Jika 3 kucing bisa tangkap 3 tikus dalam 3 menit, berapa menit 100 kucing butuh tangkap 100 tikus?",
    answers: [
      { text: "3 menit", correct: true },
      { text: "33 menit", correct: false },
      { text: "100 menit", correct: false }
    ]
  },
  {
    question: "Ada 10 burung di pohon. 2 ditembak. Berapa burung yang tersisa di pohon?",
    answers: [
      { text: "2", correct: false },
      { text: "0", correct: true },
      { text: "8", correct: false }
    ]
  },
  {
    question: "Jika sebuah jam berhenti selama 5 menit tiap 12 jam, berapa lama jam itu telat dalam 24 jam?",
    answers: [
      { text: "5 menit", correct: false },
      { text: "10 menit", correct: true },
      { text: "12 menit", correct: false }
    ]
  },
  {
    question: "Sebuah rumah punya 4 sisi, masing-masing menghadap selatan. Seekor beruang berjalan di depan rumah itu. Warnanya apa?",
    answers: [
      { text: "Putih", correct: true },
      { text: "Hitam", correct: false },
      { text: "Coklat", correct: false }
    ]
  },
  {
    question: "Ada 5 bebek, dikali 2. Berapa total bebeknya sekarang?",
    answers: [
      { text: "10 bebek", correct: false },
      { text: "7 bebek", correct: false },
      { text: "3 bebek", correct: true }
    ]
  },
  {
    question: "Apa huruf keempat dalam alfabet Indonesia?",
    answers: [
      { text: "d", correct: true },
      { text: "a", correct: false },
      { text: "o", correct: false }
    ]
  },
  {
    question: "Ada berapa buah apel di pohon mapel?",
    answers: [
      { text: "40", correct: false },
      { text: "13", correct: false },
      { text: "tidak ada", correct: true }
    ]
  },
  {
    question: "Satu ibu punya 6 anak. Setiap anak punya satu saudara perempuan.",
    answers: [
      { text: "6", correct: false },
      { text: "7", correct: false },
      { text: "1", correct: true }
    ]
  },
  {
    question: "Apakah kata yang salah selalu dieja salah?",
    answers: [
      { text: "Benar", correct: false },
      { text: "Ya", correct: false },
      { text: "Salah", correct: true }
    ]
  },
  {
    question: "Aku tidak memiliki sayap, tetapi aku bisa terbang. Apa aku?",
    answers: [
      { text: "Batu", correct: false },
      { text: "Balon", correct: true },
      { text: "Ikan terbang", correct: true }
    ]
  }
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  score = 0;
  currentQuestionIndex = 0;
  rabbitPosition = 0;
  lastAnswerWrong = false;

  shuffledQuestions = shuffleArray([...questions]);

  progressEl.textContent = `Soal: 1/${shuffledQuestions.length}`;
  scoreEl.textContent = `Score: ${score}`;

  updateBoard();
  showQuestion();
}

function showQuestion() {
  const q = shuffledQuestions[currentQuestionIndex];
  questionEl.textContent = q.question;
  answerButtons.innerHTML = '';

  // start timer per soal
  if (questionTimer) clearInterval(questionTimer);
  let timeLeft = questionTime;
  questionTimerEl.textContent = `Waktu: ${timeLeft}`;
  questionTimer = setInterval(() => {
    timeLeft--;
    questionTimerEl.textContent = `Waktu: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(questionTimer);
      handleQuestionTimeout();
    }
  }, 1000);

  const shuffledAnswers = shuffleArray([...q.answers]);
  shuffledAnswers.forEach(ans => {
    const btn = document.createElement('button');
    btn.textContent = ans.text;
    btn.addEventListener('click', () => selectAnswer(ans.correct));
    answerButtons.appendChild(btn);
  });
}

function handleQuestionTimeout() {
  lastAnswerWrong = true;
  rabbitPosition = Math.max(0, rabbitPosition - 1);
  updateBoard();

  nextQuestion();
}

function selectAnswer(isCorrect) {
  if (questionTimer) clearInterval(questionTimer);

  if (isCorrect) {
    score++;
    rabbitPosition++;
    lastAnswerWrong = false;
  } else {
    if (lastAnswerWrong) {
      rabbitPosition = Math.max(0, rabbitPosition - 1);
    }
    lastAnswerWrong = true;
  }

  scoreEl.textContent = `Score: ${score}`;
  updateBoard();

  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length && rabbitPosition < 11) {
    progressEl.textContent = `Soal: ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
    showQuestion();
  } else {
    endGame();
  }
}

function updateBoard() {
  const cols = 4; 
  const rows = 3; 
  const totalCells = cols * rows;

  boardCells.forEach(cell => cell.textContent = ''); 
  boardCells[0].textContent = '🌱';
  boardCells[totalCells - 1].textContent = '🥕';

  let row = Math.floor(rabbitPosition / cols);
  let col = rabbitPosition % cols;

  if (row % 2 === 1) {
    col = cols - 1 - col;
  }

  let index = row * cols + col;
  boardCells[index].textContent = '🐰';
}


function endGame() {
  if (questionTimer) clearInterval(questionTimer);
  const totalCells = boardCells.length;
  const reachedFinish = rabbitPosition >= totalCells - 1;

  if (reachedFinish) {
    showWin();
  } else {
    showLose();
  }

  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  finalScoreEl.textContent = `Skor Akhir: ${score}`;
}

function createConfetti(count = 60) {
  if (!confettiContainer) return;
  const colors = ['#ffcc00','#ff6b6b','#6bffb3','#6bb3ff','#d36bff','#ffd36b'];
  const boxWidth = window.innerWidth;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.background = color;
    const left = Math.random() * boxWidth;
    piece.style.left = `${left}px`;
    const tx = (Math.random() - 0.5) * 200; 
    piece.style.setProperty('--tx', `${tx}px`);
    const duration = 1400 + Math.random() * 1600;
    piece.style.animation = `confetti-fall ${duration}ms linear forwards`;
    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), duration + 200);
  }
}

function showWin() {
  if (sfxWin) { sfxWin.currentTime = 0; sfxWin.play().catch(()=>{}); }
  createConfetti(80);
}

function showLose() {
  if (sfxLose) { sfxLose.currentTime = 0; sfxLose.play().catch(()=>{}); }
  boardEl.classList.add('shake');
  setTimeout(() => boardEl.classList.remove('shake'), 700);
}

function restartGame() {
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}
>>>>>>> dc5a10e (update warna, menambahkan sound effect)
