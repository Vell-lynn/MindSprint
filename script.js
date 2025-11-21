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
const ayamWrap = document.getElementById('ayamWrap');
const ayam = document.getElementById('ayama');
const confettiContainer = document.getElementById('confetti-container');
const sfxWin = document.getElementById('sfx-win');
const sfxLose = document.getElementById('sfx-lose');

let score = 0;
let currentQuestionIndex = 0;
let shuffledQuestions = [];
let ayamPosition = 0;
let lastAnswerWrong = false;
let questionTimer = null;
const questionTime = 15; 

const questions = [
  {
    question: "Kerajaan besar yang pernah berdiri di Jawa pada abad ke-14?",
    answers: [
      { text: "Sriwijaya", correct: false },
      { text: "Majapahit", correct: true },
      { text: "Pajang", correct: false }
    ]
  },
  {
    question: "Siapa mahapatih paling terkenal dari Majapahit?",
    answers: [
      { text: "Patih Logender", correct: false },
      { text: "Gajah Mada", correct: true },
      { text: "Mpu Tantular", correct: false }
    ]
  },
  {
    question: "Sumpah apa yang diucapkan Gajah Mada untuk mempersatukan Nusantara?",
    answers: [
      { text: "Sumpah Amukti Palapa", correct: false },
      { text: "Sumpah Palapa", correct: true },
      { text: "Sumpah Nusantara", correct: false }
    ]
  },
  {
    question: "Kerajaan Hindu-Buddha yang menjadi cikal bakal Majapahit?",
    answers: [
      { text: "Kediri", correct: false },
      { text: "Singhasari", correct: true },
      { text: "Tarumanegara", correct: false }
    ]
  },
  {
    question: "Raja Singhasari yang dibunuh dalam kudeta Jayakatwang?",
    answers: [
      { text: "Anusapati", correct: false },
      { text: "Kertanegara", correct: true },
      { text: "Tunggul Ametung", correct: false }
    ]
  },
  {
    question: "Siapa raja pertama Majapahit?",
    answers: [
      { text: "Raden Wijaya", correct: true },
      { text: "Jayanegara", correct: false },
      { text: "Hayam Wuruk", correct: false }
    ]
  },
  {
    question: "Candi Buddha terbesar di dunia yang berada di Jawa?",
    answers: [
      { text: "Candi Borobudur", correct: true },
      { text: "Candi Sewu", correct: false },
      { text: "Candi Kalasan", correct: false }
    ]
  },
  {
    question: "Candi Hindu terbesar di Indonesia yang ada di Jawa?",
    answers: [
      { text: "Candi Penataran", correct: false },
      { text: "Candi Prambanan", correct: true },
      { text: "Candi Gedong Songo", correct: false }
    ]
  },
  {
    question: "Siapa pendiri Kerajaan Mataram Islam?",
    answers: [
      { text: "Sultan Agung", correct: false },
      { text: "Panembahan Senopati", correct: true },
      { text: "Ki Ageng Pemanahan", correct: false }
    ]
  },
  {
    question: "Perjanjian apa yang membelah Jawa menjadi dua wilayah (Kasunanan & Kesultanan)?",
    answers: [
      { text: "Perjanjian Salatiga", correct: false },
      { text: "Perjanjian Giyanti", correct: true },
      { text: "Perjanjian Jepara", correct: false }
    ]
  },
  {
    question: "Siapa pemimpin Perang Diponegoro (1825–1830)?",
    answers: [
      { text: "Pangeran Mangkunegara", correct: false },
      { text: "Pangeran Diponegoro", correct: true },
      { text: "Pangeran Mangkubumi", correct: false }
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
  ayamPosition = 0;
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
  ayamPosition = Math.max(0, ayamPosition - 1);
  updateBoard();

  nextQuestion();
}

function selectAnswer(isCorrect) {
  if (questionTimer) clearInterval(questionTimer);

  if (isCorrect) {
    score++;
    ayamPosition++;
    lastAnswerWrong = false;
  } else {
    if (lastAnswerWrong) {
      ayamPosition = Math.max(0, ayamPosition - 1);
    }
    lastAnswerWrong = true;
  }

  scoreEl.textContent = `Score: ${score}`;
  updateBoard();

  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length && ayamPosition < 11) {
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
  boardCells[0].textContent = '⭐';
  boardCells[totalCells - 1].textContent = '🌾';

  let row = Math.floor(ayamPosition / cols);
  let col = ayamPosition % cols;

  if (row % 2 === 1) {
    col = cols - 1 - col;
  }

  let index = row * cols + col;
  boardCells[index].textContent = '🐥';
}


function endGame() {
  if (questionTimer) clearInterval(questionTimer);

  const totalCells = boardCells.length;
  const reachedFinish = ayamPosition >= totalCells - 1;

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


(function initstarRain(){
  const container = document.getElementById('star-rain') || (() => {
    const el = document.createElement('div');
    el.id = 'star-rain';
    el.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(el, document.body.firstChild);
    return el;
  })();

  function spawnstar() {
    const el = document.createElement('div');
    el.className = 'star';
    el.textContent = '⭐';
    const size = 12 + Math.random() * 22; 
    el.style.fontSize = `${size}px`;
    const left = Math.random() * 100;
    el.style.left = `${left}%`;
    const tx = (Math.random() - 0.5) * 30 + 'vw'; 
    el.style.setProperty('--tx', tx);
    const duration = 3500 + Math.random() * 4500;
    el.style.animation = `star-fall ${duration}ms linear forwards`;
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  
  let spawnInterval = 400;
  if (window.innerWidth < 500) spawnInterval = 900;
  setInterval(spawnstar, spawnInterval);
})();



