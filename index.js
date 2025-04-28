const container = document.querySelector("#container");
const screenTop = document.querySelector("#screen-top");
const screenBottom = document.querySelector("#screen-bottom");
const buttonGrid = document.querySelector("#buttonGrid");
const mainText = document.querySelector("#main-text");
const lastText = document.querySelector("#last-text");

let currentInput = "0";
let previousInput = "0";
let operator = null;
let resultDIsplayed = false;

const keys = [
  { name: "percentage", symbol: "%" },
  { name: "clearEntry", symbol: "CE" },
  { name: "clear", symbol: "C" },
  { name: "backspace", symbol: "⌫" },
  { name: "reciprocal", symbol: "1/x" },
  { name: "square", symbol: "x²" },
  { name: "squareRoot", symbol: "√x" },
  { name: "divide", symbol: "÷" },
  { name: "7", symbol: "7" },
  { name: "8", symbol: "8" },
  { name: "9", symbol: "9" },
  { name: "multiply", symbol: "×" },
  { name: "4", symbol: "4" },
  { name: "5", symbol: "5" },
  { name: "6", symbol: "6" },
  { name: "minus", symbol: "–" },
  { name: "1", symbol: "1" },
  { name: "2", symbol: "2" },
  { name: "3", symbol: "3" },
  { name: "plus", symbol: "+" },
  { name: "sign", symbol: "±" },
  { name: "zero", symbol: "0" },
  { name: "decimal", symbol: "." },
  { name: "equalTo", symbol: "=" },
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

    if (
      [
        "%",
        "CE",
        "C",
        "⌫",
        "1/x",
        "x²",
        "√x",
        "+",
        "–",
        "×",
        "÷",
        "±",
        ".",
      ].includes(key.symbol)
    ) {
      btn.classList.add(
        ...baseClasses,
        "bg-neutral-800",
        "hover:bg-neutral-700",
        "operation-btn"
      );
    } else if (key.symbol === "=") {
      btn.classList.add(
        ...baseClasses,
        "bg-orange-500",
        "hover:bg-orange-400",
        "equals-btn"
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
  const value = keys.find((el) => el.name === eventId);

  if (!value) return;

  const symbol = value.symbol;

  if (/[0-9.]/.test(symbol)) {
    handleNumber(symbol);
  } else if (value.name === "clear") {
    clearAll();
  }

  updateScreen();
}

function handleNumber(num) {
  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else if (num === "." && currentInput.includes(".")) {
    return; // prevent repeated decimals
  } else {
    currentInput += num;
  }
}

function updateScreen() {
  mainText.textContent = currentInput;
}

function clearAll() {
  currentInput = "0";
  previousInput = "0";
  operator = null;
  resultDIsplayed = false;

  updateScreen();
}
