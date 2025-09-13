(function(){
  const displayEl = document.getElementById('current');
  const keys = document.querySelectorAll('.key');

  let current = '0';
  let previous = '';
  let operator = null;
  let resetNext = false;

  function updateDisplay(){
    displayEl.textContent = current;
  }

  function appendNumber(n){
    if(resetNext){ current = '0'; resetNext = false; }
    if(n === '.' && current.includes('.')) return;
    if(current === '0' && n !== '.') current = n;
    else current = current + n;
  }

  function chooseOperator(op){
    if(operator && !resetNext){ compute(); }
    operator = op;
    previous = current;
    resetNext = true;
  }

  function compute(){
    if(!operator) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result = NaN;
    switch(operator){
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? NaN : a / b; break;
    }
    result = sanitizeResult(result);
    current = result.toString();
    previous = '';
    operator = null;
    resetNext = true;
  }

  function sanitizeResult(r){
    if(!isFinite(r)) return 'Error';
    return Math.round((r + Number.EPSILON) * 1e12) / 1e12;
  }

  function clearAll(){ current = '0'; previous = ''; operator = null; resetNext = false; }
  function percent(){ current = (parseFloat(current) / 100).toString(); }
  function toggleSign(){
    if(current.startsWith('-')) current = current.slice(1);
    else if(current !== '0') current = '-' + current;
  }

  keys.forEach(k => {
    k.addEventListener('click', ()=>{
      const num = k.dataset.number;
      const action = k.dataset.action;
      const val = k.dataset.value;
      if(num !== undefined){ appendNumber(num); updateDisplay(); }
      else if(action === 'operator'){ chooseOperator(val); updateDisplay(); }
      else if(action === 'equals'){ compute(); updateDisplay(); }
      else if(action === 'clear'){ clearAll(); updateDisplay(); }
      else if(action === 'percent'){ percent(); updateDisplay(); }
      else if(action === 'sign'){ toggleSign(); updateDisplay(); }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e)=>{
    if(e.key >= '0' && e.key <= '9'){ appendNumber(e.key); updateDisplay(); return; }
    if(e.key === '.') { appendNumber('.'); updateDisplay(); return; }
    if(['+','-','*','/'].includes(e.key)){ chooseOperator(e.key); updateDisplay(); return; }
    if(e.key === 'Enter' || e.key === '='){ e.preventDefault(); compute(); updateDisplay(); return; }
    if(e.key === 'Backspace'){ current = current.slice(0,-1) || '0'; updateDisplay(); return; }
    if(e.key === 'Escape'){ clearAll(); updateDisplay(); return; }
    if(e.key === '%'){ percent(); updateDisplay(); return; }
  });

  updateDisplay();
})();
