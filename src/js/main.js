// 渲染計算機按鈕/判斷按鈕樣式
const btn_wrap = document.querySelector('.buttons');
const btn_data = ['7', '8', '9', '÷', '4', '5', '6', 'x', '1', '2', '3', '+', '0', '00', '.', '-', 'AC', '⌫', '='];

btn_data.forEach((item)=> {
  const btn = document.createElement('li');
  btn.classList.add('btn');

  const btn_borderbox = document.createElement('div');
  btn_borderbox.classList.add('btn_borderline');
  btn_borderbox.innerText = item;

  if (item == '÷' || item == 'x' || item == '+' || item == '-') {
    btn_borderbox.classList.add('deepBlueBtn');
  } else if(item == 'AC' || item == '⌫') {
    btn_borderbox.classList.add('txtBlue');
  } else if(item == '=') {
    btn_borderbox.classList.add('gradientBtn');
    btn.classList.add('largeBtn');
  }
  
  btn.appendChild(btn_borderbox);
  btn_wrap.appendChild(btn);
})