import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { MatDialog } from '@angular/material/dialog'
import { BooknowEventConfirmationDialogComponent } from '../../booknow-event-confirmation-dialog/booknow-event-confirmation-dialog.component';
import { EventBookDialogComponent } from '../../event-book-dialog/event-book-dialog.component'
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  editEventForm: FormGroup
  getEventInfoView = []
  id: string
  private sub: any
  public event_banner_image = environment.URLHOST + '/uploads/event/image/'
  public logo_url_event = environment.URLHOST + '/uploads/event/brand_logo/'
  bannerImage: any
  brandLogo: any
  name: any
  startDate: any
  startTime: any
  endDate: any
  endTime: any
  venue: any
  registrationLink: any
  timezoneId: any
  description: any
  speaker: any
  visibility: any
  address: any
  createdBy: any
  eventData: any = []
  groupId: any
  userId: any
  interestUserDataCount:number
  website: any
  userData: any
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute, 
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    window.scroll(0, 0)
     this.userData = JSON.parse(localStorage.getItem("truckStorage"));
    if(this.userData){this.userId = this.userData.userInfo._id;}
    this.route.params.subscribe((params) => {
      this.id = params.id
    })
    this.getEventInfo()
  }
  getEventInfo() { 
    this.spinner.show();
    this._generalService.eventView({eventId: this.id,userId: this.userId}).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.eventData = res['data']
          this.website = res['data'].broadcast.link
          this.interestUserDataCount = this.eventData.interestUserData.length
          this.spinner.hide()
        } else {this.spinner.hide();this.toastr.error(res['message']);}
    });
    (err) => {this.toastr.error('Server Error');this.spinner.hide()}
  }
  goBack(){window.history.back()}

  deleateGroupInfo() {
    const dialogRef = this.dialog.open(BooknowEventConfirmationDialogComponent, {
      width: '800px',
      data: 'Are you sure you want to archive this event?',
    })
    this.spinner.show()
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._generalService.deleteCompanyGroup({ id: this.groupId }).subscribe((res: any) => {
          if (res['code'] == genralConfig.statusCode.ok) {this.spinner.hide()}
           else {this.spinner.hide();this.toastr.error(res.message)}
        });
        (error)=>{this.spinner.hide();this.toastr.error('Server Error')}
      }
    })
  }
  Back() {
    window.history.back();
  }
  bookEvent(id) {
    const dialogRef1 = this.dialog.open(EventBookDialogComponent, {
      width: '500px',
      data: { jobId: id }
    });
    dialogRef1.afterClosed().subscribe(result => {
      if (result) {
        let data = {
          userId: this.userId,
          eventId: id,
          userName:this.userData.userInfo.personName,
          userImage:this.userData.userInfo.image
        }
        this.spinner.show();
        this._generalService.bookedEvent(data).subscribe((res) => {
          this.spinner.hide();
          if (res && res.code == genralConfig.statusCode.ok) {
            this.toastr.success(res.message);
            this.spinner.hide();
            this.getEventInfo()
          }
          else {
            this.toastr.error(res.message);
            this.spinner.hide();
          }
        })
      }
    });
  }

}
