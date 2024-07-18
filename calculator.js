const add = (op1, op2) => op1 + op2;
const subtract = (op1, op2) => op1 - op2;
const multiply = (op1, op2) => op1 * op2;
const divide = (op1, op2) => {
    if (op2 === 0) throw "DivideByZero";
    return op1 / op2;
}

const MAX_OPERAND_LENGTH = 11;
let operand = '0';

const appendDigitToNum = (num, digit) => {
    if (num.length === 11) return num;
    const numArray = num === '0' ? [] : num.split('');
    const digitArray = digit.split('');
    return numArray.concat(digitArray).join('');
}



function makeNumpadButtons() {
    const numpad = document.querySelector("#calculator-numpad");
    const NUMPAD_BUTTONS = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(num => num.toString());
    console.log(NUMPAD_BUTTONS)
    for (let i = 0; i < NUMPAD_BUTTONS.length; i++) {
        let button = NUMPAD_BUTTONS[i];
        const buttonElement = document.createElement("button");
        buttonElement.innerText = button;
        buttonElement.addEventListener("click", _ => {
            operand = appendDigitToNum(operand, button);
            console.log(operand);
        })
        numpad.appendChild(buttonElement);
    }
}

makeNumpadButtons();
