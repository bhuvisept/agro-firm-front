import { Component, Renderer2, OnInit, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { MatDialog, MatDialogConfig } from '@angular/material'
import { DialogInviteTeamComponent } from '../dialog-invite-team/dialog-invite-team.component'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-installmentList',
  templateUrl: './installmentList.component.html',
  styleUrls: ['./installmentList.component.css']
})
export class InstallmentListComponent implements OnInit {
  
  typeCategorie = [{ name: 'Salesperson', value: 'SALESPERSON' }]
  userObj: any
  companyId: any
  inviteList: any
  SearchText: string = ''
  accessLevel: any = 'SALESPERSON'
  userId: any;
  installmentData: any;


  constructor(@Inject(DOCUMENT) private document: Document,
  private toastr: ToastrService, private renderer: Renderer2, private service: GeneralServiceService, private dialog: MatDialog, private spinner: NgxSpinnerService) {}
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userObj.userInfo.accessLevel == '"SELLER"') this.companyId = this.userObj.userInfo._id
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    // this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.userInstallment()
  }
  userInstallment(){
    let data = {
      userId:this.userId
    }
    this.service.userInstallment(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          console.log(res['data'],"00000000000000000000000000000000000")
          this.installmentData = res['data']
         

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
