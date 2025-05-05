const container = document.querySelector("#container");
const screenTop = document.querySelector("#screen-top");
const screenBottom = document.querySelector("#screen-bottom");
const buttonGrid = document.querySelector("#buttonGrid");
const mainText = document.querySelector("#main-text");
const prevText = document.querySelector("#prev-text");

let currentInput = "0";
let previousInput = "";
let currentOperator = null;
let resultDisplayed = false;

const keys = [
  { name: "percentage", symbol: "%", type: "action", action: percentage },
  { name: "clearEntry", symbol: "CE", type: "action", action: clearEntry },
  { name: "clear", symbol: "C", type: "action", action: clearAll },
  { name: "backspace", symbol: "⌫", type: "action", action: backspace },
  { name: "reciprocal", symbol: "1/x", type: "action", action: getReciprocal },
  {
    name: "square",
    symbol: "x²",
    type: "action",
    action: getSquare,
  },
  {
    name: "squareRoot",
    symbol: "√x",
    type: "action",
    action: getSquareRoot,
  },
  { name: "divide", symbol: "÷", type: "operator" },
  { name: "7", symbol: "7", type: "digit" },
  { name: "8", symbol: "8", type: "digit" },
  { name: "9", symbol: "9", type: "digit" },
  { name: "multiply", symbol: "×", type: "operator" },
  { name: "4", symbol: "4", type: "digit" },
  { name: "5", symbol: "5", type: "digit" },
  { name: "6", symbol: "6", type: "digit" },
  { name: "minus", symbol: "–", type: "operator" },
  { name: "1", symbol: "1", type: "digit" },
  { name: "2", symbol: "2", type: "digit" },
  { name: "3", symbol: "3", type: "digit" },
  { name: "plus", symbol: "+", type: "operator" },
  {
    name: "sign",
    symbol: "±",
    type: "action",
    action: changeSign,
  },
  { name: "zero", symbol: "0", type: "digit" },
  { name: "decimal", symbol: ".", type: "digit" },
  { name: "equalTo", symbol: "=", action: evaluate },
];

function createButtons() {
  const keyWidth = 320 / 4;

  keys.forEach((key, _index) => {
    const btn = document.createElement("button");
    btn.id = key.name;
    btn.innerText = key.symbol;

    const baseClasses = [
      "oneKey",
      "h-[50px]",
      `w-[${keyWidth}px]`,
      "flex",
      "justify-center",
      "items-center",
      "rounded-md",
      "text-lg",
      "font-normal",
      "text-white",
    ];

    if (key.symbol === "=") {
      btn.classList.add(
        ...baseClasses,
        "bg-orange-500",
        "hover:bg-orange-400",
        "equals-btn"
      );
    } else if (key.type !== "digit" || key.name === "decimal") {
      btn.classList.add(
        ...baseClasses,
        "bg-neutral-800",
        "hover:bg-neutral-700",
        "operation-btn"
      );
    } else if (/[0-9]/.test(key.symbol)) {
      btn.classList.add(
        ...baseClasses,
        "bg-neutral-700",
        "hover:bg-neutral-800",
        "number-key"
      );
    }

    buttonGrid.appendChild(btn);

    btn.addEventListener("click", (e) => {
      clickEffect(e);

      processInput(e.currentTarget.id);
    });
  });
}

createButtons();

function clickEffect(event) {
  let button = event.currentTarget;

  button.classList.add("border", "border-2", "border-zinc-400");

  setTimeout(() => {
    button.classList.remove("border", "border-2", "border-zinc-400");
  }, 100);
}

function processInput(eventId) {
  const key = keys.find((el) => el.name === eventId);

  if (!key) return;

  if (key.type === "digit") {
    handleNumber(key.symbol);
  } else if (key.type === "action") {
    key.action();
  } else if (key.type === "operator") {
    handleOperator(key.symbol);
  }
  console.log(key.symbol);
  updateScreen();
}

function handleNumber(n) {
  if (currentInput.length < 15) {
    if (currentInput === "0" && n !== ".") {
      currentInput = n;
    } else if (n === "." && currentInput.includes(".")) {
      return; // prevent repeated decimals
    } else {
      currentInput += `${n}`;
    }
  }

  updateScreen();
}

function handleOperator(op) {
  if (parseFloat(currentInput) !== 0 || currentInput.includes(".")) {
    previousInput = `${currentInput} ${op}`;
    currentInput = "0";
    currentOperator = op;
  }
}

function updateScreen() {
  mainText.textContent = currentInput;
  prevText.textContent = previousInput;
  resizeText();
}

function getSquare() {
  previousInput = `(${currentInput})²`;
  currentInput = currentInput ** 2;
}

function getSquareRoot() {
  previousInput = `√${currentInput}`;
  currentInput = Math.sqrt(currentInput);
}

function changeSign() {
  currentInput = -currentInput;
}

function getReciprocal() {
  previousInput = currentInput;
  currentInput = 1 / currentInput;
}

function percentage(n) {
  const match = previousInput?.match(/([\d.]+)\s*([+\-×÷])/);

  if (match) {
    const prevNum = parseFloat(match[1]);
    currentInput = (prevNum * n) / 100;
  } else {
    previousInput = `${currentInput}%`;
    currentInput = parseFloat(n) / 100;
  }
}

function evaluate() {
  if (currentInput && previousInput === "") {
    previousInput = `${currentInput} =`;
  }
  updateScreen();
}

function clearAll() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  resultDisplayed = false;
}

function clearEntry() {
  currentInput = "0";
  resultDisplayed = false;
}

function backspace() {
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
}

function resizeText() {
  const container = document.getElementById("screen-bottom");
  const text = document.getElementById("main-text");

  let fontSize = 36;
  text.style.fontSize = `${fontSize}px`;

  while (text.scrollWidth > container.clientWidth && fontSize > 10) {
    fontSize -= 2;
    text.style.fontSize = `${fontSize}px`;
  }
}
