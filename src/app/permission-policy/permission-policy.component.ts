import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { GeneralServiceService } from '../core/general-service.service';
import { ToastrService } from 'ngx-toastr'
import { SharedService } from '../service/shared.service';
@Component({
  selector: 'app-permission-policy',
  templateUrl: './permission-policy.component.html',
  styleUrls: ['./permission-policy.component.css']
})
export class PermissionPolicyComponent implements OnInit {
  TermsAndCondition :any = false
  userInfo:any
  roleName:any
  constructor(
    public dialogRef: MatDialogRef<PermissionPolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private router: Router,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: GeneralServiceService,
  ) { }
  permissionList:any = [
    {
     "list":"I will not use any abusive language."
    },
    {
      "list":"I will respect other users."
    },
    {
      "list":"I will not share any sexual content of any kind of abusive content."
     },
     {
       "list":"I will not harass anyone."
     },
     {
      "list":"I will not send any hacking or cheats links."
     },
     {
       "list":"I will respect other users."
     }
  ]
  ngOnInit() {
    
    // this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
     
  }
  termAndCondition(){

    let TCdata ={email:this.data.AllData.userInfo.email,userId:this.data.AllData.userInfo._id}
    this.service.AcceptPolicies(TCdata).subscribe(
      (response) => {
        if (response['code'] == 200) {

          let user = this.data.AllData.userInfo.roleId.roleTitle
          let userAccess = this.data.AllData.userInfo.accessLevel
          let UserData = {
            token: this.data.AllData.token,
            firstName: this.data.AllData.userInfo.personName,
            image: this.data.AllData.userInfo.image,
            userId: this.data.AllData.userInfo._id,
            email: this.data.AllData.userInfo.email,
          }
          localStorage.setItem('truckStorage', JSON.stringify(this.data.AllData))
          localStorage.setItem('truck_userId', this.data.AllData.userInfo._id)
          localStorage.setItem('truck_userName', this.data.AllData.userInfo.personName)
          localStorage.setItem('progressBar', this.data.AllData.userInfo.progressBar)
          localStorage.setItem('ipAddress', this.data.Ip)
          localStorage.setItem('source', this.data.Source)
          this.roleName = this.data.AllData.userInfo.roleId.roleTitle
          this.service.addUser(this.data.AllData.userInfo._id)

          this.toastr.success('',this.data.message)
           this.onNoClick()
          if (this.roleName === 'SELLER') {
            if (this.data.AllData.userInfo.profileComplete) {
              this.router.navigate(['/layout/e-commerce/dashboard'])
            } else {
              this.router.navigate(['/layout/e-commerce'])
            }
          } else if (this.data.returnTo != undefined && (userAccess == 'ENDUSER' || userAccess == 'DRIVER' || (userAccess == 'COMPANY' && this.data.module == 'e-commerce'))) {
            this.router.navigateByUrl(this.data.returnTo)
          } else if (this.data.AllData.userInfo.profileComplete) {
            this.router.navigate(['/layout/myaccount/dashboard'])
          } else {
            this.router.navigate(['/set-profile'])
          }
          this.sharedService.setUserData(UserData.firstName)
          this.sharedService.setHeader(UserData)
        }
       
      },
      () => {
      
      }
    )
  }
 
  onNoClick(): void {
    this.dialogRef.close()
  }

}
