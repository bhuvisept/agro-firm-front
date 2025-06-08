import { Component, OnInit, Inject, Renderer2, ChangeDetectorRef, NgZone } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { DOCUMENT } from '@angular/common'
import { Router } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import moment from 'moment'
import { MatDialog } from '@angular/material'
import { CancelPlanDialogComponent } from '../cancel-plan-dialog/cancel-plan-dialog.component'
import { Console } from 'console'
@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.css'],
})
export class ViewPlanComponent implements OnInit {
  userInfo: any
  planData: any
  appliedPromo: any
  chargeId: any
  planRefunded: any

  constructor(
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    this.myPlan()
    this.renderer.addClass(this.document.body, 'custom-view-plan')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'custom-view-plan')
  }

  myPlan() {
    this.spinner.show()
    this.service.getMyplan({ userId: this.userInfo.userInfo._id }).subscribe((res) => {
      this.spinner.hide()
      this.planData = res['data']
      this.planRefunded=res['planRefunded']
      
      if (this.planData.length == 1) this.chargeId = this.planData[0].group[0].chargeId
    })
  }

  upgradePlan(plan) {
    this.router.navigate(['/pages/upgrade-my-plan/' + plan])
  }

  checkPlan(data) {
    //   var startDate = moment(data.startDate);
    //   var endDate = moment(new Date(), "DDDD-MM-YYYY");
    //   var result =  endDate.diff(startDate, 'days');
    //   return result
  }

  cancelPlan(plan) {
    this.dialog.open(CancelPlanDialogComponent, { panelClass: '_plan_cancel_class', data: plan })
  }
}
