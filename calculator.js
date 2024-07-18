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

const MAX_OPERAND_LENGTH = 11;
let operand = '0';
let lastOperand = null;
let currentOperation = null;
let retypeCheck = false;

// This will be executed if and only if operand, lastOperand and currentOperation are not null;
function handleOperation() {
    const operand_num = parseFloat(operand);
    const lastOpd_num = parseFloat(lastOperand);
    switch (currentOperation) {
        case '+':
            return add(lastOpd_num, operand_num).toString();
        case '-':
            return subtract(lastOpd_num, operand_num).toString();
        case '/':
            try {
                return divide(lastOpd_num, operand_num).toString();
            } catch (e) {
                return 'ERR: DivBy0'
            }
        case '×':
            return multiply(lastOpd_num, operand_num).toString();
        default:
            return handleEquals();
    }
}

function handleEquals() {
    const currentOp = operand;
    if (lastOperand === null) return operand;
    if (currentOperation === null) return operand;
    return handleOperation();
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
    const leadingZeros = MAX_OPERAND_LENGTH - operand.length;
    const leadingArr = Array(leadingZeros).fill('0');
    const innerSpan = document.createElement('span');
    innerSpan.textContent = operand;
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
                operand = button;
                retypeCheck = false;
                updateScreen();
                return;
            }
            operand = appendDigitToNum(operand, button);
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
            lastOperand = operand;
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
                    operand = '0';
                    lastOperand = null;
                    currentOperation = null;
                    clearScreen();
                    break;
                case '=':
                    operand = handleEquals();
                    updateScreen();
                    break;
            }
        })
        control.appendChild(buttonElement);
    }
}


makeNumpadButtons();
makeOperatorButtons();
makeControlButtons();

