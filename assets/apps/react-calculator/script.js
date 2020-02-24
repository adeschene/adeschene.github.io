// Mapping from keyboard key codes to math symbols
const keyId =
{
  'Digit0': '0',
  'Numpad0': '0',
  'Digit1': '1',
  'Numpad1': '1',
  'Digit2': '2',
  'Numpad2': '2',
  'Digit3': '3',
  'Numpad3': '3',
  'Digit4': '4',
  'Numpad4': '4',
  'Digit5': '5',
  'Numpad5': '5',
  'Digit6': '6',
  'Numpad6': '6',
  'Digit7': '7',
  'Numpad7': '7',
  'Digit8': '8',
  'Numpad8': '8',
  'Digit9': '9',
  'Numpad9': '9',
  'Minus': '-',
  'NumpadSubtract': '-',
  'Enter': '=',
  'NumpadEnter': '=',
  'Period': '.',
  'NumpadDecimal': '.',
  'NumpadAdd': '+',
  'NumpadMultiply': '*',
  'NumpadDivide': '/',
  'Slash': '/',
  'Escape': 'C',
  'Backspace': 'B' };


// Mapping from button ids to math symbols
const btnId =
{
  'zero': '0',
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
  'subtract': '-',
  'equals': '=',
  'decimal': '.',
  'add': '+',
  'multiply': '*',
  'divide': '/',
  'clear': 'C',
  'e': 'e',
  'back': 'B',
  'modulo': '%',
  'sqr': 'sqr',
  'sqrt': '√',
  'pi': 'π' };


// Evaluate a given expression and return the result
const evaluate = expr => {
  /* Look for pi and e constants in a number and evaluate/return the number as follows:
                               2π34e => 2*π*34*e => 580.70193 */
  const evalNamedConsts = numAsString => {
    let val = numAsString; // Mutable version of numAsString
    let intermediate = 1; // Value that number parts are multiplied by
    // While there are pi or e constants in the current number, evaluate
    while (/[eπ]/.test(val)) {
      let piIndex = val.search(/π/); // Index of first pi constant
      let eIndex = val.search(/e/); // Index of first e constant
      if (piIndex > -1 && eIndex > -1) {// If both constants exist, evaluate the first one
        if (piIndex < eIndex) {
          intermediate *= piIndex === 0 ? Math.PI : parseFloat(val.slice(0, piIndex)) * Math.PI;
          val = val.slice(piIndex + 1);
        } else {
          intermediate *= eIndex === 0 ? Math.E : parseFloat(val.slice(0, eIndex)) * Math.E;
          val = val.slice(eIndex + 1);
        }
      } else if (piIndex > -1 && eIndex === -1) {// If only a pi, evaluate it
        intermediate *= piIndex === 0 ? Math.PI : parseFloat(val.slice(0, piIndex)) * Math.PI;
        val = val.slice(piIndex + 1);
      } else if (piIndex === -1 && eIndex > -1) {// If only an e, evaluate it
        intermediate *= eIndex === 0 ? Math.E : parseFloat(val.slice(0, eIndex)) * Math.E;
        val = val.slice(eIndex + 1);
      }
    }
    // If intermediate is still 1, either we didn't have constants or they cancelled out (i.e. π/π)
    return intermediate !== 1 ? val !== '' ? intermediate * parseFloat(val) : intermediate : parseFloat(val);
  };

  /* Sort of like a reduce function. Takes an array of numbers separated by operators
        and processes them from left to right, leading to an immediate-execution style */
  const primitiveReduce = arr => {
    // If there aren't at least 3 elements left, we are presumed to be done, return last result
    if (arr.length < 3) {return arr[0];}
    // Get the left and right operands and the operator from the expression array
    let [lRand, op, rRand] = [...arr.slice(0, 3)];
    // Determine the operator and combine the operands accordingly
    let operation = null;
    switch (op) {
      case '+':
        operation = lRand + rRand;
        break;
      case '+-':
      case '-':
        operation = lRand - rRand;
        break;
      case '*':
        operation = lRand * rRand;
        break;
      case '*-':
        operation = lRand * -rRand;
        break;
      case '/':
        operation = lRand / rRand;
        break;
      case '/-':
        operation = lRand / -rRand;
        break;
      case '%':
        operation = lRand % rRand;
        break;
      case '%-':
        operation = lRand % -rRand;
        break;
      default:
        console.log("eval error: opp = " + op);}

    /* Recursively use the result as the left operand of the next operation:
                                                     4 + 3 * 5 => 7 * 5 */
    return primitiveReduce([parseFloat(operation.toFixed(10))].concat(arr.slice(3)));
  };
  /* Map the evalNamedConsts function onto only the numbers in the expression
        before sending it into primitiveReduce so it doesn't have to deal with them */
  let reduced = primitiveReduce(expr.map(item => {
    if (/^-?[\dπe\.]+$/.test(item) === true) {// Any number (including constants)
      return parseFloat(evalNamedConsts(item).toFixed(10));
    }
    return item; // Leave operators untouched
  }));
  // Return the result as a string, for easier use with further calculations, etc.
  return reduced.toString();
};

// Contains all of the button elements and information
class Buttons extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      React.createElement("div", { id: "buttons" },
      React.createElement("div", { id: "buttons-left" },
      React.createElement("div", { id: "top-operators" },
      React.createElement("button", { id: "e", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "\uD835\uDC52")),
      React.createElement("button", { id: "pi", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "\u03C0")),
      React.createElement("button", { id: "modulo", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "%"))),

      React.createElement("div", { id: "bottom-operators" },
      React.createElement("button", { disabled: true, id: "sqr", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "x\xB2")),
      React.createElement("button", { disabled: true, id: "sqrt", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "\u221A")),
      React.createElement("button", { id: "back", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "\u2190"))),

      React.createElement("div", { id: "numpad" },
      React.createElement("div", { id: "numpad-row1" },
      React.createElement("button", { id: "seven", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "7")),
      React.createElement("button", { id: "eight", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "8")),
      React.createElement("button", { id: "nine", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "9"))),

      React.createElement("div", { id: "numpad-row2" },
      React.createElement("button", { id: "four", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "4")),
      React.createElement("button", { id: "five", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "5")),
      React.createElement("button", { id: "six", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "6"))),

      React.createElement("div", { id: "numpad-row3" },
      React.createElement("button", { id: "one", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "1")),
      React.createElement("button", { id: "two", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "2")),
      React.createElement("button", { id: "three", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "3"))),

      React.createElement("div", { id: "numpad-row4" },
      React.createElement("button", { id: "clear", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "C")),
      React.createElement("button", { id: "zero", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "0")),
      React.createElement("button", { id: "decimal", class: "numpadBtn", onClick: this.props.handleClick }, React.createElement("p", null, "."))))),



      React.createElement("div", { id: "buttons-right" },
      React.createElement("button", { id: "divide", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "\xF7")),
      React.createElement("button", { id: "multiply", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "\xD7")),
      React.createElement("button", { id: "subtract", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "\u2212")),
      React.createElement("button", { id: "add", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "+")),
      React.createElement("button", { id: "equals", class: "operatorBtn", onClick: this.props.handleClick }, React.createElement("p", null, "=")))));



  }}
;

/* Main class; contains the main elements of the calculator;
     User input is interpreted here, as are clicked and keystrokes */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expr: [], // Holds main expression
      oldSym: '', // Last symbol processed
      subExpr: '0', // Sub-expression currently being built
      result: '0', // Resulting value from an '=' input
      lastOp: [] // Last operation from the previous calculation
    };
    // Class function bindings
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }
  handleInput(symbol) {
    // Add char to the end of the expression being built
    const addToSubExpr = char => {
      /* If user did a calculation and then pressed a non-operator button,
                                     reset the state and start the new calculation from a fresh start */
      if (this.state.lastOp.length > 0) {
        clearDisplay();
      }
      /*
          If the current input is 0 and we are adding something other than a period,
          just replace it with the new input character. Do the same if the last input was
          an operator, so entering '3' followed by '+' leaves the user with the '3' on the
          screen, but if they start entering another number, they don't want to append it
          to the '3', otherwise they would input another '3', so replace the '3' instead.
          If we're just building on the last entered number, append the new input char to it
        */
      this.setState(oldState => ({
        subExpr: oldState.subExpr === '0' && char !== '.' || /[\+\*/%-]/.test(oldState.oldSym) ?
        char : oldState.subExpr.concat(char),
        oldSym: char }));

    };
    // Concat the sub-expression to the main expression
    const addSubExprToMain = () => {
      this.setState(oldState => ({
        expr: oldState.expr.concat(oldState.subExpr) }));

    };
    // Add the given operator (as if it were a sub-expression) to the main expression
    const addOperator = op => {
      this.setState(oldState => ({
        expr: oldState.expr.concat(op),
        oldSym: op }));

    };
    // Take the last operator entered, and concat a negative sign to it (i.e. '+' => '+-')
    const addNegative = () => {
      this.setState(oldState => ({
        expr: oldState.expr.slice(0, -1).concat([oldState.expr[oldState.expr.length - 1].concat('-')]),
        oldSym: '-' }));

    };
    // Replace the last entered operator with most recently chosen operator
    const replaceOperator = op => {
      this.setState(oldState => ({
        expr: oldState.expr.slice(0, -1).concat([op]),
        oldSym: op }));

    };
    /* Remove the last entered character from the sub-expression;
          If the last character is deleted, replace it with '0', unless already '0' */
    const backSpace = () => {
      if (this.state.subExpr !== '0') {
        let afterRemoval = this.state.subExpr.slice(0, -1);
        this.setState(oldState => ({
          subExpr: afterRemoval === '' ? '0' : afterRemoval,
          oldSym: afterRemoval === '' ? '' : afterRemoval.slice(-1) }));

      }
    };
    /* Given a regex, determines whether an operator that was chosen by the user
          should be used directly, used to replace the last operator, or ignored */
    const parseOperator = re => {
      /* If we just finished a calculation, use it as the first operand for a
                                    new calculation with the chosen operator */
      if (this.state.oldSym === '=') {
        this.setState(oldState => ({
          expr: [oldState.result, symbol],
          oldSym: symbol,
          result: '0',
          lastOp: [] }));
        // If last input was a different operator, replace it
      } else if (re.test(this.state.oldSym) === true) {
        if (symbol === '-') {
          addNegative(); // Special case: '-'s are added in addition to other operators
        } else {
          replaceOperator(symbol); // All others are replaced with the new operator
        }
      } else if (this.state.oldSym !== symbol) {// Don't replace an operator with itself
        // This is the first operator that has been added for this sub-expression
        addSubExprToMain(); // Push the current number input to the main expression
        addOperator(symbol); // Then push the given operator to it as well
      }
    };
    // Clear the state properties and, by extension, the display to the user
    const clearDisplay = () => {
      this.setState({
        expr: [],
        oldSym: '',
        subExpr: '0',
        result: '0',
        lastOp: [] });

    };

    switch (symbol) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case 'e':
      case 'π':
        addToSubExpr(symbol); // No special cases with these, they all get appended directly
        break;
      case '0': // Avoid appending a zero to another lone zero (i.e. 0 => 00)
        if (this.state.subExpr !== '0') {
          addToSubExpr('0');
        }
        break;
      case '.':
        // Forbid multiple decimals in the current sub-expression
        if (/\./.test(this.state.subExpr) === false) {
          addToSubExpr('.');
        }
        break;
      case '+':
        parseOperator(/[\*/%-]/);
        break;
      case '-':
        parseOperator(/[\*\+/%]/);
        break;
      case '*':
        parseOperator(/[\+/%-]/);
        break;
      case '/':
        parseOperator(/[\+\*%-]/);
        break;
      case '%':
        parseOperator(/[\+\*/-]/);
        break;
      case 'sqr':
        // TODO: Add squaring functionality
        break;
      case '√':
        // TODO: Add square root functionality
        break;
      case '=':
        /*
                  If user just finished a calculation with at least one operator in it,
                  and hit the equal button again, use the previous result as the left operand,
                  and the operator and right operand of the rightmost operation to make a new
                  equation and evaluate it as follows:
                     input: 2 + 3 = : output: 2 + 3 = 5
                  => input: =       : output: 5 + 3 = 8
                */
        if (/[\+\*%/-]/.test(this.state.lastOp[0])) {
          this.setState(oldState => ({
            expr: [oldState.result, ...oldState.lastOp, '='],
            oldSym: '=',
            subExpr: '0',
            result: evaluate([oldState.result, ...oldState.lastOp]) }));

        } else if (this.state.lastOp.length > 0) {
          /*
                                                    If the user pressed enter again after calculating something
                                                    that didn't include any operators, it must be a single constant
                                                    number, which will always equal itself, so return that number
                                                    again (i.e. do nothing)
                                                  */
        } else {
          /*
                  If this is the first calculation since last clear, evaluate
                  the given expression and set the lastOp to the rightmost operator
                  and its right operand in case the user hits enter again afterwards
                */
          this.setState(oldState => ({
            expr: oldState.expr.concat([oldState.subExpr, '=']),
            oldSym: '=',
            subExpr: '0',
            result: evaluate(oldState.expr.concat([oldState.subExpr])),
            lastOp: oldState.expr.slice(-1).concat(oldState.subExpr) }));

        }
        // Regardless of what happens, we need sub-expression == result to display to user
        this.setState(oldState => ({
          subExpr: oldState.result }));

        break;
      case 'B':
        backSpace();
        break;
      case 'C':
        clearDisplay();
        break;}

  }
  // Treat various keyboard inputs as button presses
  handleKeyPress(e) {
    const keyPressed = keyId[e.code];
    if (keyPressed !== undefined) {
      this.handleInput(keyPressed);
    }
  }
  handleClick(e) {
    const buttonClicked = e.currentTarget['id'];
    this.handleInput(btnId[buttonClicked]);
  }
  render() {
    return (
      React.createElement("div", { id: "wrapper" },
      React.createElement("div", { id: "calculator" },
      React.createElement("div", { id: "disp-outline" },
      React.createElement("div", { id: "display-area" },
      React.createElement("div", { id: "expression" },
      React.createElement("p", null, this.state.expr.join(''))),

      React.createElement("div", { id: "input-output" },
      React.createElement("p", { id: "display" }, this.state.subExpr.replace(/e/g, '𝑒'))))),



      React.createElement("div", { id: "branding" },
      React.createElement("h4", null, "TEXAS INSTRUMENTS"),
      React.createElement("h3", null, "TI-108")),

      React.createElement("div", { id: "solar-panels" },
      React.createElement("div", { class: "panel", id: "panel1" }),
      React.createElement("div", { class: "panel", id: "panel2" }),
      React.createElement("div", { class: "panel", id: "panel3" }),
      React.createElement("div", { class: "panel", id: "panel4" })),

      React.createElement(Buttons, { handleClick: this.handleClick })),

      React.createElement("div", { id: "design-info" },
      React.createElement("p", null, "\u2212 Design based on ", React.createElement("a", { href: "https://en.wikipedia.org/wiki/TI-108", target: "_blank" }, "this"), " calculator \u2212"))));



  }}


ReactDOM.render(React.createElement(App, null), document.getElementById("app-surrogate"));