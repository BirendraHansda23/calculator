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
  { name: "equalTo", symbol: "=", type: "equals", action: evaluate },
];

function createButtons() {
  const keyWidth = 320 / 4;

  keys.forEach((key) => {
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
  } else if (key.type === "equals") {
    evaluate();
  }

  updateScreen();
}

function handleNumber(n) {
  if (resultDisplayed) {
    currentInput = "0";
    resultDisplayed = false;
  }

  if (currentInput === "0" && n !== ".") {
    currentInput = n;
  } else if (n === "." && currentInput.includes(".")) {
    return;
  } else {
    currentInput += n;
  }

  updateScreen();
}

function handleOperator(op) {
  if (resultDisplayed) {
    resultDisplayed = false;
  }

  if (currentInput) {
    previousInput = `${currentInput} ${op}`;
    currentOperator = op;
    currentInput = "0";
  }
}

function updateScreen() {
  let displayValue = currentInput.toString();

  if (displayValue.length > 17) {
    displayValue = displayValue.slice(0, 17);
  }

  mainText.textContent = displayValue;
  prevText.textContent = previousInput;
  resizeText();
}

function getSquare() {
  previousInput = `(${currentInput})²`;
  const result = Number(currentInput) ** 2;
  currentInput = formatNumber(result);
  resultDisplayed = true;
  updateScreen();
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

function percentage() {
  if (previousInput && currentOperator) {
    const prevValue = parseFloat(previousInput);
    const currValue = parseFloat(currentInput);
    currentInput = ((prevValue * currValue) / 100).toString();
    evaluate();
    previousInput = `${prevValue} ${currentOperator} ${currValue}%`;
  } else {
    previousInput = `${currentInput}%`;
    currentInput = (parseFloat(currentInput) / 100).toString();
  }
  updateScreen();
}

function evaluate() {
  if (!currentOperator || previousInput === "") return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);

  let result;

  switch (currentOperator) {
    case "+":
      result = prev + curr;
      break;
    case "–":
      result = prev - curr;
      break;
    case "×":
      result = prev * curr;
      break;
    case "÷":
      if (curr === 0) {
        currentInput = "Can't divide by 0";
        previousInput = "";
        currentOperator = null;
        document
          .getElementById("clear")
          .classList.add("border-1", "border-red-500");
        updateScreen();
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }
  previousInput = `${previousInput} ${currentInput}`;
  currentInput = result.toString();
  resultDisplayed = true;
}

function clearAll() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  resultDisplayed = false;
  document
    .getElementById("clear")
    .classList.remove("border-1", "border-red-500");
}

function clearEntry() {
  currentInput = "0";
  resultDisplayed = false;
}

function backspace() {
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
}

function formatNumber(num) {
  const absNum = Math.abs(num);

  if (absNum < 1e21) {
    return num.toString(); // Just return the full number string
  } else {
    return num.toExponential(6).replace(/\.?0+e/, "e");
  }
}
