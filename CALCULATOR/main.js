let evaluateString = "";
let string = ""
let inputfeild = document.getElementById('inputfield')
let Result = document.getElementById('result')
let buttons = document.querySelectorAll('.btn');

const UpdateFeild = (str) => {
   inputfeild.innerText = str
}
const ShowResult = (str) => {
   Result.textContent = str
}
const Delete = (str) => {
   return str.slice(0, str.length - 1)
}

const ResolvingRoots = (expression) => {
   return Math.sqrt(eval(expression));
};

const EvaluatedExpression = (expression) => {
   return eval(expression);
};

const UnderRoot = (expression) => {
   try {
      if (expression.startsWith("√")) {
         newExp = expression.replace("√", "");
         if (newExp.startsWith("(")) {
            evalRoot = newExp.slice(0, newExp.search(/\)/) + 1);
            evalRootValue = ResolvingRoots(evalRoot);
            return EvaluatedExpression(expression.replace(`√${evalRoot}`, evalRootValue))
         }
         else if (expression.match(/\√\d$/) || expression.match(/\√\d\d$/) || expression.match(/\√\d\d\d$/)) {
            newExp = expression.slice(1, expression.length)
            return ResolvingRoots(newExp);
         }
         else if (newExp.search(/\+/) || newExp.search(/\-/) || newExp.search(/\*/) || newExp.search(/\//)) {
            let operatorIndex = newExp.search(/\+/) || newExp.search(/\-/) || newExp.search(/\*/) || newExp.search(/\//);
            evalRoot = newExp.slice(0, operatorIndex);
            evalRootValue = ResolvingRoots(evalRoot);
            return EvaluatedExpression(expression.replace(`√${evalRoot}`, evalRootValue))
         }
      }
      else {
         let rootIndex = expression.search("√");
         if (expression.match(/\√\(/)) {
            let ClosingParenthesisIndex = -1
            for (let i = rootIndex + 1; i < expression.length; i++) {
               if (expression[i] === ')') {
                  ClosingParenthesisIndex = i;
                  break;
               }
            }
            evalRoot = expression.slice(rootIndex + 1, ClosingParenthesisIndex + 1);
            evalRootValue = ResolvingRoots(evalRoot);
            return EvaluatedExpression(expression.replace(`√${evalRoot}`, evalRootValue))
         }
         else if (expression.match(/\√\d$/) || expression.match(/\√\d\d$/) || expression.match(/\√\d\d\d$/)) {
            evalRoot = expression.slice(rootIndex + 1, expression.length);
            evalRootValue = ResolvingRoots(evalRoot);
            return EvaluatedExpression(expression.replace(`√${evalRoot}`, evalRootValue));
         }
         else {
            newExp = expression.slice(rootIndex + 1, expression.length)
            operatorIndex = newExp.search(/\+/) || newExp.search(/\-/) || newExp.search(/\*/) || newExp.search(/\//);
            evalRoot = newExp.slice(0, operatorIndex);
            evalRootValue = ResolvingRoots(evalRoot);
            return EvaluatedExpression(expression.replace(`√${evalRoot}`, evalRootValue))
         }
      }
   }
   catch (error) {
      return "Error : Invalid Value"
   }
}

Array.from(buttons).forEach((button) => {
   button.addEventListener('click', (e) => {
      if (e.target.innerHTML == 'ENTER' || e.target.innerHTML == 'ans') {
         if (string.includes('√')) {
            evaluateString = UnderRoot(evaluateString);
            ShowResult(evaluateString)
            evaluateString = ''
            string = ''
            UpdateFeild(string)
         } else {
            evaluateString = eval(evaluateString);
            ShowResult(evaluateString)
            evaluateString = ''
            string = ''
            UpdateFeild(string)
         }
      }
      else if (e.target.innerHTML == 'del') {
         evaluateString = Delete(evaluateString)
         string = Delete(string)
         UpdateFeild(string)
      }
      else if (e.target.innerHTML == 'x') {
         evaluateString += "*"
         string += 'x'
         UpdateFeild(string)
      }
      else if (e.target.innerHTML == '÷') {
         evaluateString += "/"
         string += '÷'
         UpdateFeild(string)
      }
      else if (e.target.innerHTML == '±') {
         lastOperator = -1;
         newstr = ""
         expression = evaluateString;
         if (expression.match(/\d+$/)) {
            newstr = expression.match(/\d+$/)
            evaluateString = evaluateString.replace(new RegExp(`${newstr}$`), `-(${newstr})`)
            string = string.replace(new RegExp(`${newstr}$`), `-(${newstr})`)
         }
         // For expression = 5+-(3) or 5--(3)
         if (evaluateString.match(/\++\-|\-+\+/)) {
            newstr = evaluateString.match(/\++\-|\-+\+/);
            evaluateString = evaluateString.replace(newstr, '-')
            string = string.replace(newstr, '-')
         } else if (evaluateString.match(/\-+\-|\++\+/)) {
            newstr = evaluateString.match(/\-+\-|\++\+/);
            evaluateString = evaluateString.replace(newstr, '+')
            string = string.replace(newstr, '+')
         }
         UpdateFeild(string)
      }
      else if (e.target.innerHTML == '&#8730;') {
         evaluateString += "√";
         string += "√";
         UpdateFeild(string)
      }
      else if (e.target.innerHTML == 'clear') {
         string = "";
         evaluateString = "";
         Result.textContent = '';
         UpdateFeild(string)
      }
      else {
         evaluateString += e.target.innerHTML;
         string += e.target.innerHTML;
         UpdateFeild(string)
      }
   });
});