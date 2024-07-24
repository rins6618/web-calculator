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

const prepend = (prefix, str) => prefix.concat(str);

const appendTokenToExp = (token, exp) => exp.str += `${token} `
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
        const roundedNum = Math.ceil(num * (10**MAX_OPERAND_LENGTH)) / 10**MAX_OPERAND_LENGTH;
        let outString = roundedNum.toString();
        // i do not trust floating point math.
        if (outString.length > MAX_OPERAND_LENGTH) outString = outString.slice(0,MAX_OPERAND_LENGTH - 1);
        return (outString);
    }
}

// change this based on font size.
// FIX: Font fo monospace might just randomly change spacing size. wtf
const MAX_OPERAND_LENGTH = 15;
const operand = {str: '0'};
const evalExp = {str: ''};

// This will be executed if and only if operand, lastOperand and currentOperation are not null;
function handleOperation() {
    let tokenArray = evalExp.str.split(' ').slice(0, -1);
    while (tokenArray.length !== 1) {
        const expArray = tokenArray.slice(0, 3);
        console.log(expArray, tokenArray);
        if (expArray.length !== 3) throw "EvalError";
        const op1 = parseFloat(expArray[0]);
        const currentOperation = expArray[1];
        const op2 = parseFloat(expArray[2]);
        let result;
        switch (currentOperation) {
            case '+':
                result = add(op1, op2).toString();
                break;
            case '-':
                result = subtract(op1, op2).toString();
                break;
            case '/':
                try {
                    result = divide(op1, op2).toString();
                    break;
                } catch (e) {
                    return 'Division by 0'
                }
            case '×':
                result = multiply(op1, op2).toString();
                break;
            default:
                break;
        }
        tokenArray.splice(0, 3);
        tokenArray.unshift(result);
    }
    console.log(tokenArray);
    return toMaxSizeString(parseFloat(tokenArray.join('')));
}
function operate() {
    appendTokenToExp(operand.str, evalExp);
    if (evalExp.str === operand.str) return;
    operand.str = handleOperation();
    evalExp.str = '';
}

function clearScreen() {
    const screenObj = document.querySelector("#calculator-screen-text");
    const expObj = document.querySelector("#calculator-expression");
    const leadingArr = Array(MAX_OPERAND_LENGTH).fill('0');
    const innerSpan = document.createElement('span');
    screenObj.textContent = leadingArr.join('');
    innerSpan.textContent = '';
    expObj.textContent = '';
    screenObj.appendChild(innerSpan);
}
function updateScreen() {
    const screenObj = document.querySelector("#calculator-screen-text");
    const expObj = document.querySelector("#calculator-expression");
    let leadingZeros = MAX_OPERAND_LENGTH - operand.str.length;
    if (leadingZeros < 0) leadingZeros = 0;
    const leadingArr = Array(leadingZeros).fill('0');
    const innerSpan = document.createElement('span');
    innerSpan.textContent = operand.str;
    screenObj.textContent = `${leadingArr.join('')}`;
    const expStr = evalExp.str.length > 52 ? prepend("...", evalExp.str.slice(-49)) : `${evalExp.str}`;
    expObj.textContent = evalExp.str !== '' ? `${expStr} = ...` : '';
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
            operand.str = appendDigitToNum(operand.str, button);
            console.log(operand.str);
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
            appendTokenToExp(operand.str, evalExp);
            appendTokenToExp(button, evalExp);
            operand.str = '0';
            updateScreen();
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
                    evalExp.str = '';
                    clearScreen();
                    break;
                case '=':
                    operate();
                    updateScreen();
                    if (operand.str === 'Division by 0') operand.str = 0;
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

