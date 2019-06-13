// 渲染計算機按鈕/判斷按鈕樣式
const btn_wrap = document.querySelector('.buttons');
const btn_data = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '+', '0', '00', '.', '-', 'AC', '⌫', '='];

btn_data.forEach((item)=> {
  const btn = document.createElement('li');
  
  const btn_borderbox = document.createElement('div');
  btn_borderbox.classList.add('btn_borderline');
  btn_borderbox.innerText = item;

  if (item == '÷' || item == '×' || item == '+' || item == '-') {
    btn_borderbox.classList.add('operator');
  } else if(item == 'AC' || item == '⌫') {
    btn_borderbox.classList.add('txtBlue');
  } else if(item == '=') {
    btn_borderbox.classList.add('gradientBtn');
    btn.classList.add('largeBtn');
  } else if(/^[\d]+$/.test(item)) { // 判斷字串是否為數字
    btn_borderbox.classList.add('number');
  } else {
    btn_borderbox.classList.add('dot');
  }
  
  btn.appendChild(btn_borderbox);
  btn_wrap.appendChild(btn);
})

// 宣告變數
let computation = document.querySelector('.header__computation');
let result = document.querySelector('.header__result');
let showComputingNumber = ''; // 顯示運算數字
let showComputingResult = '0'; // 顯示運算結果

// 綁定變數
computation.innerText = addSpace(showComputingNumber);
result.innerText = showComputingResult;

///////////
//事件監聽//
///////////

// 數字按鈕監聽事件
const numberBtn = document.querySelectorAll('.number');
for(let i=0 ; i<numberBtn.length; i++) {
  numberBtn[i].addEventListener('click', function(e){
    numberBtnFn(e);
  }, false);
}
// "AC"和"刪除單一數字鍵"事件監聽
const ACbtns = document.querySelectorAll('.txtBlue');
for(let i=0 ; i<ACbtns.length; i++) {
  ACbtns[i].addEventListener('click', function(e){
    if(e.target.innerText == 'AC') {
      clearAll();
    } else {
      deleteSingleNumber();
    }
  }, false)
}
// 等於按鈕事件監聽
const equalBtn = document.querySelector('.gradientBtn');
equalBtn.addEventListener('click', function(){
  calculation(showComputingNumber);
}, false)
// 運算符號事件監聽
const OperatorBtns = document.querySelectorAll('.operator');
for(let i=0 ; i<OperatorBtns.length; i++) {
  OperatorBtns[i].addEventListener('click', function(e){
    operatorFn(e);
  }, false)
}
// 點符號事件監聽
const dotOperator = document.querySelector('.dot');
dotOperator.addEventListener('click', function(e){
  numberBtnFn(e);
}, false)

/////////////
// methods //
/////////////

// 數字按鈕功能
function numberBtnFn(e){
  showComputingNumber += e.target.innerText;
  showComputingNumber = afterRender(showComputingNumber);
  computation.innerText = addSpace(toCurrency(showComputingNumber));
}

// 運算符功能
function operatorFn(e){
  showComputingNumber += e.target.innerText;
  showComputingNumber = afterRender(showComputingNumber);
  computation.innerText = addSpace(toCurrency(showComputingNumber));
}

// AC功能
function clearAll(){
  showComputingNumber = '';
  showComputingResult = '0';
  computation.innerText = addSpace(toCurrency(showComputingNumber));
  result.innerText = showComputingResult;
}

// ⌫功能
function deleteSingleNumber(){
  if(!showComputingNumber) return;
  const newShowComputingNumber = showComputingNumber.split('');
  newShowComputingNumber.pop();
  showComputingNumber = newShowComputingNumber.join('');
  computation.innerText = addSpace(toCurrency(showComputingNumber));
}

// =功能
function calculation(computingNumber) {
  if(!computingNumber) return;
  // 排除最後字元是運算符的情況
  const new_computingNumber = computingNumber.split('');
  if(/[÷×+-]/.test(new_computingNumber[new_computingNumber.length-1])) {
    new_computingNumber.pop();
    computingNumber = new_computingNumber.join('');
  }
  const resultNum = eval(replaceOperator(computingNumber));
  const _resultNum = resultNum.toString().replace(/Infinity/, `Error`);
  showComputingResult = _resultNum;
  result.innerHTML = toCurrency(showComputingResult);
  showComputingNumber = '';
}

///////////
// 正規式 //
///////////
// 基本判斷
// function basicFormat(computingNumber) {
//   const regExp = /[0?\d+]\.?\d*[÷×+-]?[0?\d+]\.?\d*[÷×+-]?/;
//   return regExp.test(computingNumber);
// }

// 渲染前的處理
function afterRender(computingNumber) {
  newStr = noDoubleOperator(computingNumber);
  _newStr = DoubleDotRemove(newStr);
  return noDoubleZero(_newStr);
}
// 運算符左右增加空白
function addSpace(computingNumber) {
  return computingNumber.replace(/(\d+)([÷×+-])/g, `$1 $2 `);
}
// 替換運算符
function replaceOperator(computingNumber) {
  const newStr = noDoubleOperator(computingNumber);
  const _newStr = noDoubleZero(newStr).replace(/÷/g, `/`);
  return _newStr.replace(/×/g, `*`);
}

// 排除開頭一個0以上和0後面接數字的狀況
function noDoubleZero(computingNumber) {
  const newStr = computingNumber.replace(/^0[0-9]+/, `0`);
  return newStr.replace(/([÷×+-])0\d+/g, `$10`);
}

// 排除開頭為運算符及重複運算符情況
function noDoubleOperator(computingNumber) {
  const newStr = computingNumber.replace(/^[÷×+-]+/, ``);
  return newStr.replace(/([÷×+-])[÷×+-]+/g, `$1`);
}

// 排除異常小數點
function DoubleDotRemove(computingNumber) {
  const newStr = computingNumber.replace(/^\.*/, ``);
  const _newStr = newStr.replace(/\.+/g, `.`);
  const __newStr = _newStr.replace(/\D00\.(\d+)/g, `0.$1`);
  const ___newStr = __newStr.replace(/([÷×+-])\./g, `$1`);
  return ___newStr.replace(/(\d+)\.+(\d+)\.*/g, `$1.$2`);
}

// 千分位
function toCurrency(num) {
  let newStr = num.toString().split(".");
  newStr[0] = newStr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return newStr.join(".");
}