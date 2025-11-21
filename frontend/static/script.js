const submitBtn = document.getElementById('submitBtn')
const resultDiv = document.getElementById('result')
const userInput = document.getElementById('userInput')
const functionSelect = document.getElementById('functionSelect')
const audioControls = document.getElementById('audioControls')
const playAudioBtn = document.getElementById('playAudio')
const speedSelect = document.getElementById('speedSelect')

// Tabs
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('show'))
    document.getElementById(btn.dataset.tab).classList.add('show')
  })
})

// ------------------------------------
// SEND TEXT TO BACKEND /process
// ------------------------------------
submitBtn.addEventListener('click', async () => {
  const text = userInput.value.trim()
  if (!text) return alert('Please enter text')

  resultDiv.innerText = 'Processing...'

  try {
    const resp = await fetch('http://127.0.0.1:5000/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })

    const data = await resp.json()

    if (resp.ok && data.response) {
      resultDiv.innerHTML = `<pre>${data.response}</pre>`
      audioControls.style.display = 'block'
    } else {
      resultDiv.innerHTML = `<div style="color:red">Error: ${data.error || 'Unknown error'}</div>`
      audioControls.style.display = 'none'
    }
  } catch (err) {
    resultDiv.innerHTML = `<div style="color:red">Network error: ${err}</div>`
  }
})


// ------------------------------------
// PLAY AUDIO USING /tts
// ------------------------------------
playAudioBtn.addEventListener('click', async () => {
  const textBlock = resultDiv.innerText || ''
  if (!textBlock) return alert('No text to play')

  try {
    const resp = await fetch('http://127.0.0.1:5000/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textBlock })
    })

    const data = await resp.json()

    if (!resp.ok || !data.audio) {
      alert("TTS failed")
      return
    }

    // Backend saved audio.mp3 → we play it
    const audio = new Audio("http://127.0.0.1:5000/" + data.audio)
    audio.play()

  } catch (e) {
    alert("Audio error: " + e)
  }
})


// ------------------------------------
// SIMPLE QUIZ
// ------------------------------------
const quizQuestion = document.getElementById('quizQuestion')
const quizAnswer = document.getElementById('quizAnswer')
const checkQuiz = document.getElementById('checkQuiz')
const quizFeedback = document.getElementById('quizFeedback')

const quizzes = [
  { q: "Identify the verb tense: 'She has been working all day.'", a: 'Present Perfect Continuous' },
  { q: "Choose the correct sentence: 'She don't like ice cream' or 'She doesn't like ice cream.'", a: "She doesn't like ice cream." }
]

let currentQuiz = quizzes[Math.floor(Math.random() * quizzes.length)]
quizQuestion.innerText = currentQuiz.q

checkQuiz.addEventListener('click', () => {
  const ans = quizAnswer.value.trim().toLowerCase()
  if (ans === currentQuiz.a.toLowerCase()) {
    quizFeedback.innerText = '✅ Correct!'
    currentQuiz = quizzes[Math.floor(Math.random() * quizzes.length)]
    quizQuestion.innerText = currentQuiz.q
    quizAnswer.value = ''
  } else {
    quizFeedback.innerText = '❌ Incorrect. Correct: ' + currentQuiz.a
  }
})

