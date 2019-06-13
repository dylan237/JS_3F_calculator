class Calculator{
  constructor(calculator_dom) {
    this.calculator = calculator_dom;
    this.computation = this.calculator.querySelector('.header__computation');
    this.result = this.calculator.querySelector('.header__result');
    this.btn_wrap = this.calculator.querySelector('.buttons');
    this.btn_data = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '+', '0', '00', '.', '-', 'AC', '⌫', '='];
    this.showComputingNumber = '';
    this.showComputingResult = '0';

    // 渲染計算機按鈕/判斷按鈕樣式
    this.btn_data.forEach((item)=> {
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
      this.btn_wrap.appendChild(btn);
    })

    // 綁定變數
    this.computation.innerText = this.addSpace(this.showComputingNumber);
    this.result.innerText = this.showComputingResult;

    ///////////
    //事件監聽//
    ///////////
    const self = this;
    // 數字按鈕監聽事件
    const numberBtn = this.calculator.querySelectorAll('.number');
    for(let i=0 ; i<numberBtn.length; i++) {
      numberBtn[i].addEventListener('click', function(e){
        self.numberBtnFn(e);
      }, false);
    }
    // "AC"和"刪除單一數字鍵"事件監聽
    const ACbtns = this.calculator.querySelectorAll('.txtBlue');
    for(let i=0 ; i<ACbtns.length; i++) {
      ACbtns[i].addEventListener('click', function(e){
        if(e.target.innerText == 'AC') {
          self.clearAll();
        } else {
          self.deleteSingleNumber();
        }
      }, false)
    }
    // 等於按鈕事件監聽
    const equalBtn = this.calculator.querySelector('.gradientBtn');
    equalBtn.addEventListener('click', function(){
      self.calculation(self.showComputingNumber);
    }, false)
    // 運算符號事件監聽
    const OperatorBtns = this.calculator.querySelectorAll('.operator');
    for(let i=0 ; i<OperatorBtns.length; i++) {
      OperatorBtns[i].addEventListener('click', function(e){
        self.operatorFn(e);
      }, false)
    }
    // 點符號事件監聽
    const dotOperator = this.calculator.querySelector('.dot');
    dotOperator.addEventListener('click', function(e){
      self.numberBtnFn(e);
    }, false)
  }

  /////////////
  // methods //
  /////////////

  // 數字按鈕功能
  numberBtnFn(e){
    this.showComputingNumber += e.target.innerText;
    this.showComputingNumber = this.afterRender(this.showComputingNumber);
    this.computation.innerText = this.addSpace(this.toCurrency(this.showComputingNumber));
  }

  // 運算符功能
  operatorFn(e){
    this.showComputingNumber += e.target.innerText;
    this.showComputingNumber = this.afterRender(this.showComputingNumber);
    this.computation.innerText = this.addSpace(this.toCurrency(this.showComputingNumber));
  }

  // AC功能
  clearAll(){
    this.showComputingNumber = '';
    this.showComputingResult = '0';
    this.computation.innerText = this.addSpace(this.toCurrency(this.showComputingNumber));
    this.result.innerText = this.showComputingResult;
  }

  // ⌫功能
  deleteSingleNumber(){
    if(!this.showComputingNumber) return;
    const newShowComputingNumber = this.showComputingNumber.split('');
    newShowComputingNumber.pop();
    this.showComputingNumber = newShowComputingNumber.join('');
    this.computation.innerText = this.addSpace(this.toCurrency(this.showComputingNumber));
  }

  // =功能
  calculation(computingNumber) {
    if(!computingNumber) return;
    // 排除最後字元是運算符的情況
    const new_computingNumber = computingNumber.split('');
    if(/[÷×+-]/.test(new_computingNumber[new_computingNumber.length-1])) {
      new_computingNumber.pop();
      computingNumber = new_computingNumber.join('');
    }
    const resultNum = eval(this.replaceOperator(computingNumber));
    const _resultNum = resultNum.toString().replace(/Infinity/, `Error`);
    this.showComputingResult = _resultNum;
    this.result.innerHTML = this.toCurrency(this.showComputingResult);
    this.showComputingNumber = '';
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
  afterRender(computingNumber) {
    const newStr = this.noDoubleOperator(computingNumber);
    const _newStr = this.DoubleDotRemove(newStr);
    return this.noDoubleZero(_newStr);
  }
  // 運算符左右增加空白
  addSpace(computingNumber) {
    return computingNumber.replace(/(\d+)([÷×+-])/g, `$1 $2 `);
  }
  // 替換運算符
  replaceOperator(computingNumber) {
    const newStr = this.noDoubleOperator(computingNumber);
    return this.noDoubleZero(newStr).replace(/÷/g, `/`).replace(/×/g, `*`);
  }

  // 排除開頭一個0以上和0後面接數字的狀況
  noDoubleZero(computingNumber) {
    return computingNumber.replace(/^0[0-9]+/, `0`).replace(/([÷×+-])0\d+/g, `$10`);
  }

  // 排除開頭為運算符及重複運算符情況
  noDoubleOperator(computingNumber) {
    return computingNumber.replace(/^[÷×+-]+/, ``).replace(/([÷×+-])[÷×+-]+/g, `$1`);
  }

  // 排除異常小數點
  DoubleDotRemove(computingNumber) {
    const newStr = computingNumber.replace(/^\.*/, ``);
    const _newStr = newStr.replace(/\.+/g, `.`);
    const __newStr = _newStr.replace(/\D00\.(\d+)/g, `0.$1`);
    const ___newStr = __newStr.replace(/([÷×+-])\./g, `$1`);
    return ___newStr.replace(/(\d+)\.+(\d+)\.*/g, `$1.$2`);
  }

  // 千分位
  toCurrency(num) {
    let newStr = num.toString().split(".");
    newStr[0] = newStr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return newStr.join(".");
  }
}

const calculator = new Calculator(document.querySelector('.calculator'));