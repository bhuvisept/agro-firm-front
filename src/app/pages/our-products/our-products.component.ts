import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-our-products',
  templateUrl: './our-products.component.html',
  styleUrls: ['./our-products.component.css']
})
export class OurProductsComponent implements OnInit {
  productList: any
  product_img_url = environment.URLHOST + '/uploads/products/'
  constructor() { }
 

  ngOnInit() {
      this.productList = [
      {
        "_id":1,
        "image":"borers.jpg",
        "title":"Product 1",
        "description":"Dummy text Dummy text Dummy text Dummy text"
      },
       {
        "_id":1,
        "image":"Fungicides.jpg",
        "title":"Product 1",
        "description":"Dummy text Dummy text Dummy text Dummy text"
      },
       {
        "_id":1,
        "image":"Herbicides.jpg",
        "title":"Product 1",
        "description":"Dummy text Dummy text Dummy text Dummy text"
      },
      {
        "_id":1,
        "image":"plan5.jpg",
        "title":"Product 1",
        "description":"Dummy text Dummy text Dummy text Dummy text"
      }
    ];
  }

}
