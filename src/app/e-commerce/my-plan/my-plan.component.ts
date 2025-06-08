import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { MatDialog } from '@angular/material'
import { CancelEcommercePlanComponent } from '../cancel-ecommerce-plan/cancel-ecommerce-plan.component'
import { Router } from '@angular/router'
@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.component.html',
  styleUrls: ['./my-plan.component.css'],
})
export class MyPlanComponent implements OnInit {
  userInfo: any
  planRefunded: any

  planData: any
  length: any = 0
  constructor(
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private router: Router
  ) {}
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    this.myPlan()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  cancelPlan(plan) {
    this.dialog.open(CancelEcommercePlanComponent, {
      width: '900px',
      panelClass: '_plan_cancel_class',
      data: plan,
    })
  }
  upgradePlan(plan) {
    this.router.navigate(['/pages/upgrade-my-plan/' + plan])
  }
  myPlan() {
    this.spinner.show()
    this.service.getMyplan({ userId: this.userInfo.userInfo._id, roleTitle: this.userInfo.userInfo.roleId.roleTitle }).subscribe((res) => {
      if (res['code'] == 200) {
        this.spinner.hide()
        this.planData = res['data']
        this.length = res['data']
      this.planRefunded=res['planRefunded']

      } else {
        this.length = 0
      }
    }),
      (error) => {
        this.spinner.hide()
        this.toastr.error('server error')
      }
  }
}
