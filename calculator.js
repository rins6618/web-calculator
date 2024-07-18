// Expressions for dealing with values
// the actual program logic happens on
// function definitions below

const add = (op1, op2) => op1 + op2;
const subtract = (op1, op2) => op1 - op2;
const multiply = (op1, op2) => op1 * op2;
const divide = (op1, op2) => {
    if (op2 === 0) throw "DivideByZero";
    return op1 / op2;
}

const appendDigitToNum = (num, digit) => {
    if (num.length === MAX_OPERAND_LENGTH) return num;
    const numArray = (num === '0') ? [] : num.split('');
    const digitArray = digit.split('');
    return numArray.concat(digitArray).join('');
}
const toMaxSizeString = (num) => {
    if (Math.round(num) === num) {
        let outString = num.toString();
        if (outString.length > MAX_OPERAND_LENGTH) {
            const cleanStr = outString
                .replace("-", "")
                .replace(".", "");
            const numDigits = cleanStr.length - 1;
            const mantissa = num / (10**numDigits);
            const expStr = `e${numDigits}`;
            let mantissaDigits = MAX_OPERAND_LENGTH - expStr.length;
            // don't think this will ever happen
            if (mantissaDigits < 0) return("Inf");
            const mantissaStr = mantissa.toString().slice(0, mantissaDigits);
            outString = `${mantissaStr}${expStr}`;
        }
        return (outString);
    }
    else {
        const roundedNum = Math.round(num * (10**MAX_OPERAND_LENGTH)) / 10**MAX_OPERAND_LENGTH;
        let outString = roundedNum.toString();
        if (outString.length > MAX_OPERAND_LENGTH) outString = outString.slice(0,MAX_OPERAND_LENGTH);
        return (outString);
    }
}

// change this based on font size.
const MAX_OPERAND_LENGTH = 16;
let operand = {str :'0'};
let lastOperand = {str: null};
let displayOperand = operand;
let currentOperation = null;
let retypeCheck = false;

// This will be executed if and only if operand, lastOperand and currentOperation are not null;
function handleOperation() {
    const operand_num = parseFloat(operand.str);
    const lastOpd_num = parseFloat(lastOperand.str);
    displayOperand = lastOperand;
    switch (currentOperation) {
        case '+':
            return toMaxSizeString(add(lastOpd_num, operand_num));
        case '-':
            return toMaxSizeString(subtract(lastOpd_num, operand_num));
        case '/':
            try {
                return toMaxSizeString(divide(lastOpd_num, operand_num));
            } catch (e) {
                return 'Division by 0'
            }
        case '×':
            return toMaxSizeString(multiply(lastOpd_num, operand_num));
        default:
            return;
    }
}
function handleEquals() {
    if (lastOperand.str === null) return;
    if (currentOperation === null) return;
    lastOperand.str = handleOperation();
}

function clearScreen() {
    const screenObj = document.querySelector("#calculator-screen");
    const leadingArr = Array(MAX_OPERAND_LENGTH).fill('0');
    const innerSpan = document.createElement('span');
    screenObj.textContent = leadingArr.join('');
    innerSpan.textContent = '';
    screenObj.appendChild(innerSpan);
}
function updateScreen() {
    const screenObj = document.querySelector("#calculator-screen");
    let leadingZeros = MAX_OPERAND_LENGTH - displayOperand.str.length;
    if (leadingZeros < 0) leadingZeros = 0;
    const leadingArr = Array(leadingZeros).fill('0');
    const innerSpan = document.createElement('span');
    innerSpan.textContent = displayOperand.str;
    screenObj.textContent = `${leadingArr.join('')}`;
    screenObj.appendChild(innerSpan);
}

function makeNumpadButtons() {
    const numpad = document.querySelector("#calculator-numpad");
    const NUMPAD_BUTTONS = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(num => num.toString());
    for (let i = 0; i < NUMPAD_BUTTONS.length; i++) {
        let button = NUMPAD_BUTTONS[i];
        const buttonElement = document.createElement("button");
        buttonElement.innerText = button;
        buttonElement.addEventListener("click", _ => {
            if (retypeCheck) {
                operand.str = button;
                retypeCheck = false;
                displayOperand = operand;
                updateScreen();
                return;
            }
            operand.str = appendDigitToNum(operand.str, button);
            console.log(operand);
            updateScreen();
        })
        numpad.appendChild(buttonElement);
    }
}
function makeOperatorButtons() {
    const operators = document.querySelector("#calculator-operators");
    const OPERATOR_BUTTONS = ["+", "-", '/', '×'];
    for (let i = 0; i < OPERATOR_BUTTONS.length; i++) {
        let button = OPERATOR_BUTTONS[i];
        const buttonElement = document.createElement("button");
        buttonElement.innerText = button;
        buttonElement.addEventListener("click", _ => {
            currentOperation = button;
            lastOperand.str = operand.str;
            retypeCheck = true;
        })
        operators.appendChild(buttonElement);
    }
}
function makeControlButtons() {
    const control = document.querySelector("#calculator-control");
    const CONTROL_BUTTONS = ['CL', '='];
    for (let i = 0; i < CONTROL_BUTTONS.length; i++) {
        let button = CONTROL_BUTTONS[i];
        const buttonElement = document.createElement("button");
        buttonElement.innerText = button;
        buttonElement.addEventListener("click", _ => {
            switch (button) {
                case 'CL':
                    operand.str = '0';
                    lastOperand.str = null;
                    currentOperation = null;
                    displayOperand = operand;
                    clearScreen();
                    break;
                case '=':
                    handleEquals();
                    updateScreen();
                    break;
            }
        })
        control.appendChild(buttonElement);
    }
}

clearScreen();
makeNumpadButtons();
makeOperatorButtons();
makeControlButtons();

