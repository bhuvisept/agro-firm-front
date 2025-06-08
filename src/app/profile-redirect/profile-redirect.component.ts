import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { GeneralServiceService } from '../core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'
import { SharedService } from '../service/shared.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { MatDialog } from '@angular/material'
import { PermissionPolicyComponent } from '../permission-policy/permission-policy.component'

@Component({
  selector: 'app-profile-redirect',
  templateUrl: './profile-redirect.component.html',
  styleUrls: ['./profile-redirect.component.css'],
})
export class ProfileRedirectComponent implements OnInit {
  roleList: any
  oldRoleId: any
  userId: any
  roleName: any
  getBack: any
  resetkey: any
  roleTitle: any
  roleId: any
  roletitle: any
  module: any
  constructor(
    public dialogRef: MatDialogRef<ProfileRedirectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: GeneralServiceService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.roleList = this.data.Data.multipleRole
    this.oldRoleId = this.data.Data.userInfo.roleId._id
    this.userId = this.data.Data.userInfo._id

    this.sharedService.getPath().subscribe((res) => {
      this.getBack = res
    })
  }

  function(data, e) {
    this.roletitle = data
    this.roleId = e.value
  }

  selectRole() {
    let data = {
      oldRoleId: this.oldRoleId,
      userId: this.userId,
      roleId: this.roleId,
      roleTitle: this.roletitle,
    }

    this.spinner.show()
  
    this.service.switchRoles(data).subscribe((result) => {
      if (result['code'] == 200) {
        this.spinner.hide()
        this.onNoClick()
        if (this.data.returnTo) {
          this.module = this.data.returnTo.split('/')[2]
        }
        if (!result['data'].userInfo.policyStatus) {
          this.dialog.open(PermissionPolicyComponent, {
            width: '650px',
            data: {  returnTo: this.data.returnTo, userAccess: result['data'].userInfo.accessLevel, module: this.module,message:result['message'],AllData:result['data'],Ip:this.data.Ip,Source:this.data.Source },
            panelClass: 'open-login-dialog',
          })
        } else {
          let user = result['data'].userInfo.roleId.roleTitle
          let userAccess = result['data'].userInfo.accessLevel
          let UserData = {
            token: result['data'].token,
            firstName: result['data'].userInfo.personName,
            image: result['data'].userInfo.image,
            userId: result['data'].userInfo._id,
            email: result['data'].userInfo.email,
          }
          localStorage.setItem('truckStorage', JSON.stringify(result['data']))
          localStorage.setItem('truck_userId', result['data'].userInfo._id)
          localStorage.setItem('truck_userName', result['data'].userInfo.personName)
          localStorage.setItem('progressBar', result['data'].userInfo.progressBar)
          localStorage.setItem('ipAddress', this.data.Ip)
          localStorage.setItem('source', this.data.Source)
          this.roleName = result['data'].userInfo.roleId.roleTitle
          this.service.addUser(result['data'].userInfo._id)
          this.toastr.success('', result['message'])
          if (result['data'].userInfo.paymentToken != null && result['data'].userInfo.paymentToken != '' && result['data'].userInfo.profileComplete) {
            this.spinner.hide()
            return this.router.navigate(['/payment'])
          }
          if (this.roleName === 'SELLER') {
            if (result['data'].userInfo.profileComplete) {
              this.router.navigate(['/layout/e-commerce/dashboard'])
            } else {
              this.router.navigate(['/layout/e-commerce'])
            }
          } else if (this.data.returnTo != undefined && (userAccess == 'ENDUSER' || userAccess == 'DRIVER' || (userAccess == 'COMPANY' && this.module == 'e-commerce'))) {
            this.router.navigateByUrl(this.data.returnTo)
          } else if (result['data'].userInfo.profileComplete) {
            this.router.navigate(['/layout/myaccount/dashboard'])
          } else {
            this.router.navigate(['/set-profile'])
          }
          this.sharedService.setUserData(UserData.firstName)
          this.sharedService.setHeader(UserData)
        }
      
      } else if (result['code'] == 555) {
        this.spinner.hide()
        this.resetkey = result['data'].resetkey
        this.router.navigate(['/verify-otp/' + this.resetkey])
      } else {
        this.toastr.warning('', result['message'])
        this.spinner.hide()
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
