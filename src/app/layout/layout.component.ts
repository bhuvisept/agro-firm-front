import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  userInfo: any

  constructor() {}

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
  }
}
