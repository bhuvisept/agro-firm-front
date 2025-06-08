import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-installmentList',
  templateUrl: './installmentList.component.html',
  styleUrls: ['./installmentList.component.css']
})
export class InstallmentListComponent implements OnInit {
  userObj: any;
  userId: any;
  installmentData: any;

  constructor(  
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private genralServices: GeneralServiceService,) { }

  ngOnInit() {

    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.userInstallment()
  }
  userInstallment(){
    let data = {
      userId:this.userId
    }
    this.genralServices.userInstallment(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.installmentData = res['data']
         
console.log(this.installmentData);
for (let index = 0; index < this.installmentData.length; index++) {
            
  const element = this.installmentData[index];
  let totalAmount = 0
  for (let indexPaymentSchedule = 0; indexPaymentSchedule < element.paymentSchedule.length; indexPaymentSchedule++) {
    const paymentSchedules = element.paymentSchedule[indexPaymentSchedule];
    
    totalAmount += paymentSchedules.amount
    
    if(element.paymentSchedule.length-1 == indexPaymentSchedule){
      console.log( this.installmentData);
      
      element.totalAmounts =totalAmount
    }

  }
  
  // console.log(element.paymentSchedule);
}
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        // this.toastr.error(messages.apiError)
      }
    )
  }
  toggleAccordian(event, index) {
    const element = event.target;
    element.classList.toggle("active");
    if (this.installmentData[index].isActive) {
      this.installmentData[index].isActive = false;
    } else {
      this.installmentData[index].isActive = true;
    }
    const panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
}
