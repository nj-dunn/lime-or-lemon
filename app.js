const limeImages = [
  "res/lime/gross-squeeze.png",
  "res/lime/lime-bowl.png",
  "res/lime/lime-cutting-board.png",
  "res/lime/pile-o-limes.png",
];

const lemonImages = [
  "res/lemon/basket.png",
  "res/lemon/image.png",
  "res/lemon/lemonade.png",
  "res/lemon/lemontree.png",
  "res/lemon/wedge.png",
];

const goodMessages = ["Congratulations!", "Nailed it!", "Acceptable!"];
const badMessages = ["Unacceptable!", "Incorrect.", "You need more practice."];

const allFruits = [
  ...limeImages.map((src) => ({ type: "lime", src })),
  ...lemonImages.map((src) => ({ type: "lemon", src })),
];

const fruitImage = document.getElementById("fruit-image");
const fruitStage = document.getElementById("fruit-stage");
const message = document.getElementById("message");
const buttons = Array.from(document.querySelectorAll(".button-row button"));

let currentFruit = null;
let previousFruitSrc = "";
let roundTimer = null;

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function setButtonsEnabled(enabled) {
  buttons.forEach((button) => {
    button.disabled = !enabled;
  });
}

function clearFeedback() {
  message.textContent = "";
  message.classList.remove("success", "error");
}

function pickFruit() {
  if (allFruits.length === 0) {
    throw new Error("No fruit images available.");
  }

  if (allFruits.length === 1) {
    return allFruits[0];
  }

  let nextFruit = randomFrom(allFruits);
  while (nextFruit.src === previousFruitSrc) {
    nextFruit = randomFrom(allFruits);
  }
  return nextFruit;
}

function startRound() {
  if (roundTimer) {
    clearTimeout(roundTimer);
    roundTimer = null;
  }

  clearFeedback();
  setButtonsEnabled(true);
  fruitStage.classList.remove("loading");

  currentFruit = pickFruit();
  previousFruitSrc = currentFruit.src;
  fruitImage.src = currentFruit.src;
}

function resolveGuess(choice) {
  if (!currentFruit) return;

  const isCorrect = choice === currentFruit.type;
  const text = isCorrect ? randomFrom(goodMessages) : randomFrom(badMessages);

  message.textContent = text;
  message.classList.toggle("success", isCorrect);
  message.classList.toggle("error", !isCorrect);

  setButtonsEnabled(false);
  fruitStage.classList.add("loading");
  roundTimer = setTimeout(startRound, 2500);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = button.getAttribute("data-choice");
    resolveGuess(choice);
  });
});

fruitImage.addEventListener("error", () => {
  // Skip broken assets and immediately try another round.
  startRound();
});

startRound();
