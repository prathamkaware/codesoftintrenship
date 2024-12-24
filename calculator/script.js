
let display = document.getElementById('display');
let elements = [];
let currNum = '';
let ans = '';

document.addEventListener('keydown', calculator);
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        calculator(e, e.target.innerText);
    }
});

function calculator(e, btnVal) {
    let value = btnVal || e.key;

    // Numbers and decimal point handling
    if (!isNaN(value)) {
        currNum += value;
        updateDisplay();
    } else if (value === '.') {
        if (!currNum) {
            currNum = '0.';
        } else if (!currNum.includes('.')) {
            currNum += value;
        } else {
            currNum = currNum; // Do nothing
        }
        updateDisplay();
    }
    // Operator handling
    else if (['+', '-', '*', 'x', 'X', '/', '÷', '%'].includes(value)) {
        if (currNum) {
            elements.push(currNum);
            currNum = '';
        }
        if (isLastOp()) {
            alert("Cannot enter two operators in a row.");
        } else {
            elements.push(['*', 'x', 'X'].includes(value) ? '*' : (['÷', '/'].includes(value) ? '/' : value));
            updateDisplay();
        }
    }
    // Ans button handling
    else if (value === 'Ans' || value === 'Shift') {
        if (ans) {
            if (!currNum) {
                elements.push(ans);
                updateDisplay();
            } else {
                alert("Enter an operator or press AC to reset.");
            }
        } else {
            alert("No previous answer available.");
        }
    }
    // Equals handling
    else if (value === '=' || value === 'Enter') {
        if (currNum.endsWith('.')) {
            currNum = currNum.slice(0, -1); // Remove trailing decimal if it exists
        }
        if (currNum) {
            elements.push(currNum);
            if (isLastOp()) {
                alert("Remove the trailing operator or enter a number.");
            } else {
                try {
                    const result = solve(elements);
                    display.innerText = result;
                    ans = result;
                    elements = [ans];
                    currNum = '';
                } catch (error) {
                    alert("Invalid operation.");
                }
            }
        } else {
            alert('Enter another number or remove the operator.');
        }
    }
    // Clear all (AC)
    else if (value === 'AC' || value === 'C' || 'c') {
        elements = [];
        currNum = '';
        display.innerText = '0';
    }
    // Delete/Backspace
    else if (value === 'DEL' || value === 'Backspace' || value === 'Delete') {
        rem();
    }
}

function rem() {
    if (currNum) {
        currNum = currNum.slice(0, -1);
    } else if (elements.length) {
        let lastElement = elements[elements.length - 1];
        if (lastElement.length > 1) {
            lastElement = lastElement.slice(0, -1);
            elements[elements.length - 1] = lastElement;
        } 
        else {
            elements.pop();
        }
    }
    updateDisplay();
}


function updateDisplay() {
    display.innerText = currNum ? elements.join('') + currNum : elements.join('') || '0';
}

function solve(arr) {
    const expression = arr.join('');
    return new Function('return ' + expression)();
}

function isLastOp() {
    const last = elements[elements.length - 1];
    return ['+', '-', '*', '/', '%'].includes(last); 
}
