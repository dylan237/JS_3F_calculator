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
  }
  
  btn.appendChild(btn_borderbox);
  btn_wrap.appendChild(btn);
})


let computation = document.querySelector('.header__computation');
let result = document.querySelector('.header__result');
let compute = false; // 判斷是否有在運算(是否有按下運算按鈕)
let showComputingNumber = ''; // 顯示運算數字
let showComputingResult = '0'; // 顯示運算結果
let numberCache = ''; // 暫存待計算數字
let waitForCount = []; // 暫存待計算數字及運算符

// 綁定變數
computation.innerText = showComputingNumber;
result.innerText = showComputingResult;

///////////
//事件監聽//
///////////

// 為所有數字按鈕增加監聽事件
const numberBtn = document.querySelectorAll('.number');
for(let i=0 ; i<numberBtn.length; i++) {
  numberBtn[i].addEventListener('click', function(e){
    showComputingNumber += e.target.innerText;
    computation.innerText = showComputingNumber;
    numberCache += e.target.innerText; /**/
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
// 運算符號事件監聽
const OperatorBtns = document.querySelectorAll('.operator');
for(let i=0 ; i<OperatorBtns.length; i++) {
  OperatorBtns[i].addEventListener('click', function(e){
    
    numberCache!=='' ? waitForCount.push(numberCache) : false; 
    const ifDoubleOperator = /\d+/.test([...waitForCount].pop()); // 判斷waitForCount最後一個元素是否為運算符

    if(ifDoubleOperator) {
      console.log(numberCache);
      waitForCount.push(e.target.innerText);
      numberCache = '';
      showComputingNumber += ` ${e.target.innerText} `;
      console.log(waitForCount);
      computation.innerText = showComputingNumber;
    } else {
      console.log('double Operator!');
      return;
    }
  }, false)
}
/////////////
// methods //
/////////////

// 清空
function clearAll(){
  waitForCount = [];
  showComputingNumber = '';
  showComputingResult = '0';
  computation.innerText = showComputingNumber;
  result.innerText = showComputingResult;
}

// 刪除單一數字
function deleteSingleNumber(){
  // if(showComputingNumber.length > 1) {
    // showComputingNumber = showComputingNumber.split('');
    // showComputingNumber.pop()
    // showComputingNumber = showComputingNumber.join('');
    numberCache!=='' ? waitForCount.push(numberCache) : false;
    const targetNum = Object.assign([], waitForCount).pop();
    const ifNotOperator = /\d+/.test(targetNum);
    const ifSingleNum = /[0-9]?/.test(targetNum);

    if(ifNotOperator && targetNum.length > 1) {
      numberCache = '';
      // 處理waitForCount陣列
      const newtargetNum = targetNum.split('');
      newtargetNum.pop();
      const _targetNum = newtargetNum.join('');
      waitForCount.pop();
      waitForCount.push(_targetNum);
      console.log(waitForCount);

      // 處理showComputingNumber字串 (顯示給使用者看的)
      const newShowComputingNumber = showComputingNumber.split('');
      newShowComputingNumber.pop();
      const _showComputingNumber = newShowComputingNumber.join('');
      showComputingNumber = _showComputingNumber;
      computation.innerText = showComputingNumber;
    } else if(ifSingleNum) {
      waitForCount.pop();
      console.log(waitForCount);
      console.log('只剩一位數，直接移除')
    } else {
      console.log('最後一個元素為運算符，無法刪除')
      return;
    }
  // } else {
  //   showComputingNumber = '';
  // }
  computation.innerText = showComputingNumber;
  console.log(showComputingNumber);
}


