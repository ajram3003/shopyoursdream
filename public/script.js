
function addPulseToButton(){
   const button = document.querySelector('.row .fixed-action-btn a');
   button.classList.add('pulse');
   setTimeout(() => {
     button.classList.remove('pulse');
   }, 10000);
}

//adding event listeners
function addEventListenerForCards(){
  const cards = document.querySelectorAll('.card .card-action a');
  cards.forEach((card,index,cards) => {
    card.addEventListener('click',addProduct);
  });
}

//adding event listeners for removing products
function addEventListeneremoveProduct(){
  const removes = document.querySelectorAll('.removeProduct');
  removes.forEach((remove,index,removes) => {
    remove.addEventListener('click',fnRemoveProduct);
  })
}





function removeGreenExistClass(id){
  const cards = document.querySelectorAll('.card');
  cards.forEach((card,index,cards)=>{
     const cid = card.querySelector('[data-id]').dataset.id;
     if(cid == id){
      card.querySelector('[data-id]').closest('.card').querySelector('.card-action a i').classList.remove('greenExist');
      card.querySelector('[data-id]').closest('.card').querySelector('.card-action a span').classList.remove('greenExist');
      card.querySelector('[data-id]').closest('.card').querySelector('.card-action a span').innerText = "Add to Cart";
      return;
     }
  });
}


function fnRemoveProduct(e){
  const productRemove = e.target;
  const data_id = productRemove.parentElement.parentElement.querySelectorAll('td input[data-id]')[0].dataset.id;
  //console.log(data_id);
  productRemove.parentElement.parentElement.remove();
  
  //retrievving data id
  removeGreenExistClass(data_id);
  getTotalOfMoney();
}

function addEventListenerForInputNumber(){
  const inputNumbers = document.querySelectorAll('[type="number"]');
  inputNumbers.forEach((inputNumber,index,inputNumbers)=>{
    inputNumber.addEventListener('change',onNumberInputChange);
  });
}


addEventListenerForCards();
addEventListeneremoveProduct();
/*
document.querySelector('.card .card-content .card-title').innerText
document.querySelector('.card .card-content .card-title').innerText*/

//adding product in table
function addInTable(itemName,itemPrice,id){

  const htmlContent = `<tr><td>${itemName}</td><td><input data-id="${id}" type="number" value="1" id="quantity" name="quantity" min="1"></td><td>${itemPrice}</td><td><button type="button" class="btn red removeProduct">&times;</button></td></tr>`;
  //const htmlContent = new DOMParser().parseFromString(htmlContent_string,'text/xml');
  const tableBody = document.querySelector('table tbody').lastElementChild;
  if(tableBody != null){
      document.querySelector('table tbody').insertAdjacentHTML('beforeend',htmlContent);
  } else {
      document.querySelector('table tbody').innerHTML = htmlContent;
  }
  Materialize.toast(itemName+' added in Cart',4000);
  addPulseToButton();
  addEventListeneremoveProduct();
  addEventListenerForInputNumber();
}

function addProduct(e){
  const product    = e.currentTarget.closest('.card');

  //checking if given element is added or not 
  const classExist = product.querySelector('.card-action a i').classList.contains('greenExist');
  const itemName   = product.querySelector('.card-title').innerText;

  if(classExist){
    alert('Product '+itemName+' already been added in the cart :)');
    return;
  } else {
    product.querySelector('.card-action a i').classList.add('greenExist');
    product.querySelector('.card-action a span').innerText = "Added to Cart";
    product.querySelector('.card-action a span').classList.add('greenExist');
  }
  
  const itemPrice  = product.querySelector('.card-content').querySelector('p').innerText;
  const id = product.querySelector('.card-title').dataset.id;
  //check only one cart is added
  
  const tbodyItems = document.querySelectorAll('.product_table tbody tr');
  for(let i = 0 ; i < tbodyItems.length; i ++){
     const tdElementName = tbodyItems[i].querySelectorAll('td')[0].innerText;
     console.log( tbodyItems[i].querySelectorAll('td')[0].innerHTML);
   //console.log(tbodyItems[i]);
    if(itemName == tdElementName){
      alert('Product '+itemName+' already been added in the cart :)');
      return;
    }
  }
  addInTable(itemName,itemPrice,id);
  getTotalOfMoney();
}

function onNumberInputChange(e){
  const onNumber = e;
  console.log(e);
  getTotalOfMoney();

}

function getTotalOfMoney(){
  const rows = document.querySelectorAll('.product_table tbody tr');
  /*
  rows.forEach((row,index,rows)=>{
    const row1 = parseFloat(row.querySelectorAll('td')[2].replace('$',''));
    console.log(row1);
  });
*/
    const sumTotal = Array.from(rows).reduce(function(total, currentValue, currentIndex, rows1){

          const quantityElement = currentValue.querySelectorAll('td')[1];
          const quantity = quantityElement.querySelector('input[type="number"').value;

          const itemPriceElement = currentValue.querySelectorAll('td')[2];
          const itemPrice = parseFloat(itemPriceElement.innerText.substring(1,itemPriceElement.innerText.length));

          return total + quantity*itemPrice;

   },0);
  //updating total show
  updatingTotalCount(sumTotal);
}

function updatingTotalCount(sumTotal){
   const rupeesUnicode = document.querySelector('input[name="rupeesUnicode"]').value;
   document.querySelectorAll('.product_table tfoot td')[2].innerText = `${rupeesUnicode}${sumTotal}`;
}

function callproductsBought(){
  const products = [];
  const trRows = document.querySelectorAll('.product_table tbody tr');

  trRows.forEach((trRow,index,trRows)=>{
    const tdRows = trRow.querySelectorAll('td');
    const itemName = tdRows[0].innerText;
    const id = tdRows[1].querySelector('input[type="number"]').dataset.id;
    const itemQuantity = tdRows[1].querySelector('input[type="number"]').value;
    const itemPrice = parseFloat(tdRows[2].innerText.substring(1,tdRows[2].innerText.length));
    const boughtDate = new Date();
    //console.log(itemName,itemQuantity,itemPrice);
    const product = {};
    product['id'] = id;
    product['itemName'] = itemName;
    product['itemQuantity'] = itemQuantity;
    product['itemPrice'] = itemPrice;
    product['boughtDate'] = boughtDate;
    products.push(product);
  });

  console.log(JSON.stringify(products));
  document.querySelector('#productsList').value = JSON.stringify(products);
}