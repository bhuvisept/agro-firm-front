import { Component, OnInit } from '@angular/core';
import { Toast } from 'ngx-toastr';
import { element } from 'protractor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import {ToastrService} from 'ngx-toastr'
@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {
  product = { prdContainer: 1 };
  quantity


  productList = [
    { productId: '1001', image: "assets/bannertwo.png", productName: "Amazing Modern Chair", price: 148.00, qty: 2 ,inStock:5 },
    { productId: '1002', image: "assets/bannertwo.png", productName: " Pillow Cover", price: 248.00, qty: 2 ,inStock:8},
  ]

  total = 0;
  productTotal = 0;
  cartproducts = [];
  quantityInput: any;
  constructor(
    private toastr:ToastrService
  ) { }
  // quantityInput.value=+quantityInput.value-1
  // quantityInput.value=+quantityInput.value+1
  ngOnInit() {
    this.getTotal()
  }

  getTotal() {
    this.productList.forEach(item => {
      this.total += (item.price * item.qty)
    })
  }


  // removeProduct(at){

  //   this.productList.slice(at,1)
  // }

  decrement(product) {
    for (let i = 0; i <= this.productList.length; i++) {
      if (this.productList[i].productId === product.productId) {
        this.productList[i].qty = this.productList[i].qty-1
        
      }
      var total = this.productList[i].qty*this.productList[i].price
    }
    this.total=total;
    



  }
  increment(product) {
    product.qty = product.qty + 1
    this.total = product.qty * product.price

      if(product.inStock<=product.qty){
        this.toastr.warning('Item out of Stock')
      }
  }
  removeProduct(i) {
    this.productList.splice(i, 1)

  }
  removeAll(){
    this.productList=[]
    this.getTotal()
  }
}