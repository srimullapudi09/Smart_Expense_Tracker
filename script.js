let expenses=JSON.parse(localStorage.getItem('expenses'))||[];
const expenseList=document.getElementById('expenseList');
const total=document.getElementById('total');
let chart;

function save(){localStorage.setItem('expenses',JSON.stringify(expenses));}

function showToast(msg){
 const t=document.createElement('div');
 t.className='toast'; t.innerText=msg;
 document.body.appendChild(t);
 setTimeout(()=>t.remove(),2000);
}

function updateStats(){
 document.getElementById('transactions').textContent=expenses.length;
 const max=expenses.length?Math.max(...expenses.map(e=>Number(e.amount))):0;
 document.getElementById('highest').textContent='₹'+max;
}

function updateChart(){
 const cats={};
 expenses.forEach(e=>cats[e.category]=(cats[e.category]||0)+Number(e.amount));
 const ctx=document.getElementById('expenseChart');
 if(chart) chart.destroy();
 chart=new Chart(ctx,{type:'pie',data:{labels:Object.keys(cats),datasets:[{data:Object.values(cats)}]}});
}

function render(data=expenses){
 expenseList.innerHTML='';
 let sum=0;
 data.forEach((e,i)=>{
  sum+=Number(e.amount);
  expenseList.innerHTML+=`<tr>
  <td>${e.title}</td><td>₹${e.amount}</td><td>${e.category}</td>
  <td><button onclick="editExpense(${i})">Edit</button>
  <button class="delete-btn" onclick="deleteExpense(${i})">Delete</button></td></tr>`;
 });
 total.textContent=sum;
 updateStats();
 updateChart();
}

function addExpense(){
 const title=document.getElementById('title').value;
 const amount=document.getElementById('amount').value;
 const category=document.getElementById('category').value;
 if(!title||!amount) return alert('Fill all fields');
 expenses.push({title,amount,category});
 save(); render();
 document.getElementById('title').value='';
 document.getElementById('amount').value='';
 showToast('Expense Added');
}

function deleteExpense(i){expenses.splice(i,1);save();render();}
function editExpense(i){
 const e=expenses[i];
 document.getElementById('title').value=e.title;
 document.getElementById('amount').value=e.amount;
 document.getElementById('category').value=e.category;
 expenses.splice(i,1); save(); render();
}

document.getElementById('search').addEventListener('keyup',function(){
 const k=this.value.toLowerCase();
 render(expenses.filter(e=>e.title.toLowerCase().includes(k)));
});

document.getElementById('filter').addEventListener('change',function(){
 const c=this.value;
 if(c==='All') return render();
 render(expenses.filter(e=>e.category===c));
});

function exportCSV(){
 let csv='Title,Amount,Category\n';
 expenses.forEach(e=>csv+=`${e.title},${e.amount},${e.category}\n`);
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
 a.download='expenses.csv'; a.click();
}

document.getElementById('themeBtn').onclick=()=>{
 document.body.classList.toggle('dark-mode');
 localStorage.setItem('theme',document.body.classList.contains('dark-mode'));
};
if(localStorage.getItem('theme')==='true') document.body.classList.add('dark-mode');

render();