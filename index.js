const container = document.querySelector("#container");
const screenTop = document.querySelector("#screen-top");
const screenBottom = document.querySelector("#screen-bottom");
const buttonGrid = document.querySelector("#buttonGrid");
const mainText = document.querySelector("#main-text");
const prevText = document.querySelector("#prev-text");

let currentInput = "0";
let previousInput = "";
let currentOperand = "";
let currentOperator = null;
let resultDisplayed = false;
let mainDisplayText = "";
let topDisplayText = "";

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
    topDisplayText = `${currentInput} ${op}`;
    previousInput = currentInput;
    currentOperator = op;
    currentInput = "0";
    currentOperand = parseFloat(previousInput);
  }
}

function updateScreen() {
  mainDisplayText = currentInput.toString();

  if (mainDisplayText.length > 17) {
    mainDisplayText = mainDisplayText.slice(0, 17);
  }

  mainText.textContent = mainDisplayText;
  prevText.textContent = topDisplayText;
}

function getSquare() {
  topDisplayText = `(${currentInput})²`;
  const result = Number(currentInput) ** 2;
  currentInput = formatNumber(result);
  updateScreen();
}

function getSquareRoot() {
  topDisplayText = `√${currentInput}`;
  currentInput = Math.sqrt(currentInput);
}

function changeSign() {
  currentInput = -currentInput;
}

function getReciprocal() {
  previousInput = currentInput;
  topDisplayText = previousInput;
  currentInput = 1 / currentInput;
}

function percentage() {
  if (previousInput && currentOperator) {
    const prevValue = parseFloat(previousInput);
    const currValue = parseFloat(currentInput);
    currentInput = ((prevValue * currValue) / 100).toString();
    evaluate();
    topDisplayText = `${prevValue} ${currentOperator} ${currValue}%`;
  } else {
    topDisplayText = `${currentInput}%`;
    currentInput = (parseFloat(currentInput) / 100).toString();
  }
  updateScreen();
}

function evaluate() {
  if (!currentOperator || previousInput === "") return;

  let prev;

  if (resultDisplayed === true) {
    prev = parseFloat(currentInput);
  } else {
    prev = parseFloat(previousInput);
    currentOperand = parseFloat(currentInput);
  }

  let result;

  switch (currentOperator) {
    case "+":
      result = prev + currentOperand;
      break;
    case "–":
      result = prev - currentOperand;
      break;
    case "×":
      result = prev * currentOperand;
      break;
    case "÷":
      if (currentOperand === 0 && prev !== 0) {
        currentInput = "Can't divide by 0";
        topDisplayText = `${prev} ${currentOperator} ${currentOperand}`;
        currentOperator = null;
        document
          .getElementById("clear")
          .classList.add("border-1", "border-red-500");
        return;
      } else if (currentOperand === 0 && prev === 0) {
        currentInput = "Undefined";
        topDisplayText = `${prev} ${currentOperator} ${currentOperand}`;
        currentOperator = null;
        document
          .getElementById("clear")
          .classList.add("border-1", "border-red-500");
        return;
      } else {
        result = prev / currentOperand;
      }

      break;
    default:
      return;
  }

  currentInput = result;
  topDisplayText = `${prev} ${currentOperator} ${currentOperand}`;

  resultDisplayed = true;
  updateScreen();
}

function clearAll() {
  currentInput = "";
  previousInput = 0;
  topDisplayText = "";
  operator = null;
  resultDisplayed = false;
  document
    .getElementById("clear")
    .classList.remove("border-1", "border-red-500");
}

function clearEntry() {
  currentInput = "";
  resultDisplayed = false;
}

function backspace() {
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
}

function formatNumber(num) {
  const absNum = Math.abs(num);

  if (absNum < 1e18) {
    return num.toLocaleString("fullwide", { useGrouping: false });
  } else {
    return num.toExponential(6); // fallback with limited precision
  }
}
