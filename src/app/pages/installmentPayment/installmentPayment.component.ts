import { Component, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'
import { Console } from 'console'
import { Router } from '@angular/router'
import { MatDialog,MatDialogConfig } from '@angular/material'
import { PromosPopupComponent } from '../promos-popup/promos-popup.component'
import { exit } from 'process'
import { InstallmentConfirmationComponent } from 'src/app/installment-confirmation/installment-confirmation.component'


@Component({
  selector: 'app-installmentPayment',
  templateUrl: './installmentPayment.component.html',
  styleUrls: ['./installmentPayment.component.css']
})
export class InstallmentPaymentComponent implements OnInit {
  userData: any
  userId: any
  planList: any
  GrandTotal: any
  installmentPlan: any
  installmentArr: any = []
  plannameAll: any = []
  selectedObject: any
  accessLevel: any

 


  constructor(private service: GeneralServiceService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))

    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
      this.accessLevel = userData.userInfo.accessLevel
      this.userData = userData
    }
    this.subsPlanList()
  }

  displayObjectValue(obj: any) {
    this.selectedObject = obj;
  }


  payment(){

    if(this.selectedObject == null && this.selectedObject == undefined)   return this.toastr.warning('Please select any of  EMI plan')
    this.selectedObject.userId = this.userId
    this.selectedObject.userEmail = this.userData.userInfo.email
    this.selectedObject.personName =this.userData.userInfo.firstName
    this.selectedObject.planName =this.plannameAll
    const dialogConfig = new MatDialogConfig()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true;
    (dialogConfig.width = '450px'),
      (dialogConfig.data = {
        items:this.selectedObject
      })
    
    const dialogRef = this.dialog.open(InstallmentConfirmationComponent, dialogConfig)
    dialogRef.afterClosed().subscribe((result) => {
     if (result == 200) {
       // ! payment success then redirect on dashboard
       if (this.accessLevel == 'COMPANY') {
         this.router.navigate(['/layout/myaccount/dashboard'])
       } else if (this.accessLevel == 'SELLER') {
         this.router.navigate(['/layout/e-commerce/dashboard'])
       }
       else if (this.accessLevel == 'ENDUSER') {
        this.router.navigate(['/layout/myaccount/dashboard'])
      }
     }
    
    })
   
  }
  subsPlanList() {
    this.spinner.show()
    this.service.subsPlanList({ userId: this.userId }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          
          
          this.planList = res['data']
          console.log(this.planList,"0000000000");
          this.planList.forEach(element => {
            this.plannameAll.push(element.title)
            console.log(this.plannameAll);
            
          });
          this.GrandTotal = res['GrandTotal']
          this.spinner.hide()
          this.installmentplanList()
        } else {
          this.spinner.hide()
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }

  installmentplanList() {

    this.spinner.show()


    if(this.planList.length>1){

      // ! Multiplan select for payment then use common installment option

      this.service.installmentMultiplanList().subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.installmentPlan = res['data']
            this.installmentArr=[]
            this.installmentPlan[0].installmentPercent.forEach((element) => {
              // let P = this.GrandTotal // Principal loan amount
              // let R = parseFloat(element.number) // Monthly interest rate
              // let N = element.value // Loan tenure in months
              // let monthlyInterestRate = R / 100;
              // let numerator = P * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, N);
              // console.log(numerator,"numerator")
              // let denominator = Math.pow(1 + monthlyInterestRate, N) - 1;
              // console.log(Math.pow(1 + monthlyInterestRate, N) - 1,"Math.pow(1 + monthlyInterestRate, N) - 1")
              // console.log(denominator,"denominator")
              // console.log(numerator, denominator,"numerator / denominator")
              // let monthlyPayment = numerator / denominator;
              // console.log(monthlyPayment,"monthlyPayment")
              // this.installmentArr.push({
              //   month: element.value,
              //   interestRate:parseFloat(element.number),
              //   monthlyPay: monthlyPayment.toFixed(2),
              //   totalpay: (monthlyPayment * N).toFixed(2),
              //   totalInterest : ((monthlyPayment * N) - P).toFixed(2)
              // })


              let monthlyPayment =  this.GrandTotal / element.value;
              this.installmentArr.push({
                month: element.value,
                monthlyPay: monthlyPayment.toFixed(2),
                totalpay: (monthlyPayment * element.value),
              })
            })
            this.spinner.hide()
            console.log(this.installmentArr)
  
          } else {
            this.spinner.hide()
          }
        },
        () => {
          this.toastr.error('Something went wrong')
          this.spinner.hide()
        }
      )
    }else{

      // ! single plan select for payment then use selected plan installment option

      this.service.installmentplanList({ planId: this.planList[0].planId }).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.installmentPlan = res['data']

            if(this.installmentPlan[0].installmentPercent.length ){
              this.installmentArr=[]
              this.installmentPlan[0].installmentPercent.forEach((element) => {
              //   let P = this.GrandTotal // Principal loan amount
              //   let R = parseFloat(element.number) // Monthly interest rate
              //   let N = element.value // Loan tenure in months
    
              //   let monthlyInterestRate = R / 100;
              //   console.log(monthlyInterestRate,"monthlyInterestRate")
              //   let numerator = P * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, N);

              //   console.log(P * monthlyInterestRate,"P * monthlyInterestRate")
              //   console.log(Math.pow(1 + monthlyInterestRate, N),"Math.pow(1 + monthlyInterestRate, N)")
                
              //   let denominator = Math.pow(1 + monthlyInterestRate, N) - 1;


              // console.log(denominator,"denominator")

              // console.log(numerator, denominator,"numerator / denominator")

              //   let monthlyPayment = numerator / denominator;
              //   console.log(monthlyPayment,"monthlyPayment")
              
              //   this.installmentArr.push({
              //     month: element.value,
              //     interestRate:parseFloat(element.number),
              //     monthlyPay: monthlyPayment.toFixed(2),
              //     totalpay: (monthlyPayment * N).toFixed(2),
              //     totalInterest : ((monthlyPayment * N) - P).toFixed(2)
              //   })

              let monthlyPayment =  this.GrandTotal / element.value;
         
              this.installmentArr.push({
                month: element.value,
                monthlyPay: monthlyPayment.toFixed(2),
                totalpay: (monthlyPayment * element.value),
             
              })
              })
              this.spinner.hide()
              
            }else{
              this.toastr.error('You do not have any installment option on selected plan')
              this.router.navigate(['/pages/plan-cart'])
            }
  
          } else {
            this.spinner.hide()
          }
        },
        () => {
          this.toastr.error('Something went wrong')
          this.spinner.hide()
        }
      )
    }
  }

}
