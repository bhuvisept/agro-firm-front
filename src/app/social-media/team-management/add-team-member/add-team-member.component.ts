import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT, getLocaleFirstDayOfWeek } from '@angular/common'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Router } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.css'],
  providers: [NgxSpinnerService],
})
export class AddTeamMemberComponent implements OnInit {
  public InviteNewMemberForm: FormGroup

  userObj: any
  UserInfo: any
  userId: string
  groupLists: any
  deleted: string = 'false'
  selectedGroup: string
  invitedToArray: any = []
  groupNameLists: any
  groupByLists: any

  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService, // private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // NUMBERnDECIMAL
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.InviteNewMemberForm = this.formbuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE),Validators.pattern(genralConfig.pattern.NAME)]],
      lastName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE),Validators.pattern(genralConfig.pattern.NAME)]],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]],
    })
    this.getGroupList()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  getGroupList() {
    let data = {
      userId: this.userObj.userInfo._id,
    }
    this.spinner.show()
    this._generalService.getGroupListDetails(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.groupLists = response['data']
        this.spinner.hide()
      } else {
         this.spinner.hide()
        this.toastr.error(response['message'])
      }
    })
  }

  onSubmit() {
    if (this.InviteNewMemberForm.valid) {
      this.InviteNewMemberForm.value.invitedBy = this.userObj.userInfo._id
      this.InviteNewMemberForm.value.groupId = this.selectedGroup
      this.spinner.show()
    
      let data = {
      sendTo:[this.selectedGroup],
      groupId:this.selectedGroup,
      sendBy:this.userObj.userInfo._id
      }
      return 0
      this._generalService.sendNewInviteMemberForm(this.InviteNewMemberForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {


            this.toastr.success(result['message'])
            this.spinner.hide()
            this.InviteNewMemberForm.reset()
            this.router.navigate(['/layout/social-media/team-member-list'])
          } else {
            this.spinner.hide()
            this.toastr.warning(result['message'])
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.error(error['message'])
        }
      )
    } else {
      this.toastr.warning('Please enter mandatory fields')
      this.validateAllFormFields(this.InviteNewMemberForm)
      this.spinner.hide()
    }
  }
  validateAllFormFields(frmbuilder: FormGroup) {
    Object.keys(frmbuilder.controls).forEach((field) => {
      const control = frmbuilder.get(field)
      control.markAsTouched({ onlySelf: true })
      control.markAsDirty({ onlySelf: true })
    })
  }
}
