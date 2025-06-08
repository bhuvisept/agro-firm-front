import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import {MatIconModule} from '@angular/material/icon'
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css'],
})
export class SidemenuComponent implements OnInit {
  // @HostListener('window:storage')
  // onStorageChange() {
  //   let userObj = JSON.parse(localStorage.getItem('truckStorage'));

  //   if (userObj == undefined) {
  //     window.location.reload()
  //   }
  // }
  navOpen: boolean = false
  userObj: any
  show: boolean
  changeText= false;
  constructor(private router: Router, private service: GeneralServiceService) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userObj['userInfo'].multiRole.length > 1) {
      this.show = false
    } else {
      this.show = true
    }
  }
  navigationSellerSideMenu = [
    { navimg: 'assets/dashboard.png', navimghov: 'assets/dashboardhov.png', navlink: '/layout/e-commerce/dashboard', navitem: 'Dashboard' },
    { navimg: 'assets/product.png', navimghov: 'assets/producthov.png', navlink: '/layout/e-commerce/manage-products-list', navitem: 'Manage Products' },
    { navimg: 'assets/question.png', navimghov: 'assets/questionhov.png', navlink: '/layout/e-commerce/questions', navitem: "Q&A's" },
    
    {
      navimg: 'assets/Master-settings.png',
      navimghov: 'assets/Master-settingshov.png',
      navitem: 'Master Setting',
      navdropdown: [
        { navitem: 'Brand List', navlink: '/layout/e-commerce/brand-list' },
        { navitem: 'Category List', navlink: '/layout/e-commerce/category-list' },
        { navitem: 'Model List', navlink: '/layout/e-commerce/model-list' },
      ],
    },
    // { navimg: 'assets/support.png', navimghov: 'assets/supporthov.png', navlink: '/layout/e-commerce/support', navitem: 'Contact' },
    { navimg: 'assets/support.png', navimghov: 'assets/supporthov.png', navlink: '/chat-window', navitem: 'Chat' },
    { navimg: 'assets/ticketInactive.svg', navimghov: 'assets/ticketInactive.svg', navlink: '/my-tickets', navitem: 'My Tickets' },
    
    // { navimg: 'assets/support.png', navimghov: 'assets/supporthov.png', navlink: '/chat-ewr', navitem: 'ChatTest' },
  ]

  logOutSeller() {
    let ipAddress = localStorage.getItem('ipAddress')
    let userId = localStorage.getItem('truck_userId')
    let source = localStorage.getItem('source')
    let logoutDate = new Date()

    let logoutHistory = {
      ipAddress: ipAddress,
      userId: userId,
      source: source,
      logoutDate: logoutDate,
    }
    this.service.userLogOut(logoutHistory).subscribe((result) => {
      localStorage.clear()
      localStorage.removeItem('userToken')
      localStorage.removeItem('truckStorage')
      localStorage.removeItem('planName')
      this.router.navigate(['/login'])
    })
  }

  // clicked(event) {
  //   let body = document.getElementsByTagName('BODY')[0].classList.toggle('open-close-sidemenu')
  // }
  navClosed() {
    let body = document.getElementsByTagName('BODY')[0].classList.remove('open-close-sidemenu')
  }
}
