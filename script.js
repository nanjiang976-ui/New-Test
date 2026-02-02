const questions = [
    { text: "我今天感到充满活力。", weight: 1 },
    { text: "我对未来感到乐观。", weight: 1 },
    { text: "我很容易因为小事感到烦躁。", weight: -1 },
    { text: "我今天能专注于手头的工作/学习。", weight: 1 },
    { text: "我感到身体很疲惫。", weight: -1 },
    { text: "我愿意与他人交流和分享。", weight: 1 },
    { text: "我觉得自己一无是处。", weight: -1 },
    { text: "我对周围的事物感兴趣。", weight: 1 },
    { text: "我感到紧张或焦虑。", weight: -1 },
    { text: "我今天的睡眠质量很好（或昨晚睡得好）。", weight: 1 },
    { text: "我觉得生活很有趣。", weight: 1 },
    { text: "我很难做出决定。", weight: -1 },
    { text: "我感到孤独。", weight: -1 },
    { text: "我有信心处理好今天的问题。", weight: 1 },
    { text: "我感到悲伤或想哭。", weight: -1 },
    { text: "我很享受今天的闲暇时光。", weight: 1 },
    { text: "我觉得别人都在针对我。", weight: -1 },
    { text: "我对自己今天的表现感到满意。", weight: 1 },
    { text: "我感到头痛或身体不适（非生病原因）。", weight: -1 },
    { text: "总的来说，我觉得今天是个好日子。", weight: 1 }
];

const options = [
    { text: "非常不符合", value: 1 },
    { text: "比较不符合", value: 2 },
    { text: "一般", value: 3 },
    { text: "比较符合", value: 4 },
    { text: "非常符合", value: 5 }
];

let currentQuestionIndex = 0;
let totalScore = 0;
let userAnswers = [];

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress');
const scoreDisplay = document.getElementById('score');
const analysisText = document.getElementById('analysis-text');
const scoreCircle = document.querySelector('.score-circle');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
    welcomeScreen.classList.add('hidden');
    welcomeScreen.classList.remove('active');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('active');
    currentQuestionIndex = 0;
    totalScore = 0;
    userAnswers = [];
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const question = questions[currentQuestionIndex];
    questionText.textContent = `${currentQuestionIndex + 1}. ${question.text}`;
    
    // Update progress bar
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('div');
        btn.classList.add('option-btn');
        btn.textContent = option.text;
        btn.addEventListener('click', () => selectOption(option.value));
        optionsContainer.appendChild(btn);
    });
}

function selectOption(value) {
    const question = questions[currentQuestionIndex];
    
    // Calculate score based on weight
    // If weight is 1 (positive question): 1->1, 5->5
    // If weight is -1 (negative question): 1->5, 5->1
    let points = 0;
    if (question.weight === 1) {
        points = value;
    } else {
        points = 6 - value; // Reverse scale for negative questions
    }
    
    userAnswers.push(points);
    totalScore += points;
    
    currentQuestionIndex++;
    loadQuestion();
}

function showResult() {
    quizScreen.classList.add('hidden');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('hidden');
    resultScreen.classList.add('active');

    // Calculate final score percentage or range (20 questions * 5 points max = 100 points max)
    // Minimum score = 20 * 1 = 20 points
    // Range: 20 - 100
    
    // Normalize to 0-100 scale for display
    // (score - min) / (max - min) * 100
    // (totalScore - 20) / 80 * 100
    // Actually, let's just use the raw score for simplicity but display it out of 100 for better understanding?
    // Let's stick to the raw sum: 20-100.
    
    // Animate score
    let currentDisplayScore = 0;
    const interval = setInterval(() => {
        if (currentDisplayScore >= totalScore) {
            clearInterval(interval);
        } else {
            currentDisplayScore++;
            scoreDisplay.textContent = currentDisplayScore;
        }
    }, 20);

    // Update score circle gradient
    const percentage = ((totalScore - 20) / 80) * 100;
    scoreCircle.style.background = `conic-gradient(var(--primary-color) ${percentage}%, #dfe4ea ${percentage}%)`;

    // Generate Analysis
    let analysis = "";
    if (totalScore >= 85) {
        analysis = "太棒了！你的心情状态非常好。你充满了正能量，对生活抱有极大的热情。继续保持这种积极的心态，把你的快乐传递给身边的人吧！";
        scoreDisplay.style.color = "#78e08f"; // Green
    } else if (totalScore >= 70) {
        analysis = "你的心情很不错！虽然可能有一些小波折，但总体上你能够保持乐观和积极。你有足够的能力应对日常的挑战。";
        scoreDisplay.style.color = "#6a89cc"; // Blue
    } else if (totalScore >= 50) {
        analysis = "你的心情比较平稳。可能没有特别兴奋，也没有特别低落。这是一种常态，试着找一些自己感兴趣的事情来提升一下活力吧。";
        scoreDisplay.style.color = "#f6b93b"; // Yellow
    } else if (totalScore >= 35) {
        analysis = "你的心情似乎有些低落。最近是不是遇到了什么烦心事？试着放松一下，听听音乐，或者和朋友聊聊天，不要把压力都憋在心里。";
        scoreDisplay.style.color = "#e58e26"; // Orange
    } else {
        analysis = "你现在的心情可能非常糟糕。感到疲惫、焦虑或悲伤都是正常的反应。请给自己多一些关爱，如果这种情绪持续很久，建议寻求专业的心理咨询帮助。";
        scoreDisplay.style.color = "#e55039"; // Red
    }
    
    analysisText.textContent = analysis;
}

function restartQuiz() {
    resultScreen.classList.add('hidden');
    resultScreen.classList.remove('active');
    welcomeScreen.classList.remove('hidden');
    welcomeScreen.classList.add('active');
}
