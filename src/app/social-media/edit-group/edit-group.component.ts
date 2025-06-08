import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material/dialog'
import { DeleteGroupConfirmationDialogComponent } from '../delete-group-confirmation-dialog/delete-group-confirmation-dialog.component'

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css'],
  providers: [NgxSpinnerService],
})
export class EditGroupComponent implements OnInit {
  public cover_img_path = environment.URLHOST + '/uploads/group/'
  public group_img_path = environment.URLHOST + '/uploads/group/'

  public cover_img_url_group = environment.URLHOST + '/uploads/group/coverImage/'
  public group_img_url_group = environment.URLHOST + '/uploads/group/'

  groupTypeList: any = [{ name: 'Public' }, { name: 'Private' }]

  roleName: any
  userObj: any
  userId: any
  groupId: any
  editGroupForm: FormGroup
  getGroupInfoList: any = []
  fileData: File = null
  uploadedBannerImage: string = ''
  uploadedBrandLogo: string = ''
  previewUrlLogo: any = null
  uploadedCoverImage: any
  uploadedGroupImage: string = ''
  eventLogo: any
  groupType = ['Private', 'Public']

  textarea: any
  isAdmin: any
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.roleName = this.userObj.userInfo.roleId.roleTitle

    this.route.params.subscribe((params) => {
      this.groupId = params.Id
    })
    this.editGroupForm = this.formbuilder.group({
      name: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.required]],
      description: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.required]],
      type: ['', [Validators.required]],
      roleTitle: genralConfig.rolename.COMPANY,
    })
    this.getGroupDetails()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')

    this.textarea = document.querySelector('#autoresizing')
    this.textarea.addEventListener('input', autoResize, false)

    function autoResize() {
      this.style.height = 'auto'
      this.style.height = this.scrollHeight + 'px'
    }
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }
  
  uploadCoverImage(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0]
    if (this.fileData != undefined) {
      const formData = new FormData()
      formData.append('file', this.fileData)
      formData.append('type', 'GROUPIMAGE')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            this.spinner.hide()
            this.uploadedBannerImage = res['data'].imagePath
            // this.previewBrandLogo();
          } else {
            window.scrollTo(0, 0)
            this.toastr.error('error', res['message'])
          }
        },
        (err) => {
          this.spinner.hide()
        }
      )
    } else {
      this.previewUrlLogo = ''
    }
  }

  uploadGroupImage(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0]
    if (this.fileData != undefined) {
      const formData = new FormData()
      formData.append('file', this.fileData)
      formData.append('type', 'GROUPIMAGE')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.spinner.hide()
            this.uploadedGroupImage = res['data'].imagePath
          } else {
            window.scrollTo(0, 0)
            this.toastr.error('error', res['message'])
          }
        },
        (err) => {
          this.spinner.hide()
        }
      )
    } else {
      this.previewUrlLogo = ''
    }
  }

  getGroupDetails() {
    let data = {
      groupId: this.groupId,
      userId: this.userObj.userInfo._id,
    }
    this.spinner.show()
    this._generalService.getCompanyGroupDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.spinner.hide()
        this.getGroupInfoList = response['data']
        this.isAdmin = this.getGroupInfoList.isAdmin
        this.uploadedGroupImage = this.getGroupInfoList.groupImage
        this.uploadedBannerImage = this.getGroupInfoList.coverImage
        this.editGroupForm.patchValue(this.getGroupInfoList)
      } else {
        this.spinner.hide()
      }
    })
  }

  updateGroupInfo() {
    if (this.editGroupForm.valid) {
      ;(this.editGroupForm.value.groupId = this.groupId), (this.editGroupForm.value.userId = this.userObj.userInfo._id), (this.editGroupForm.value.groupImage = this.uploadedGroupImage)
      this.editGroupForm.value.coverImage = this.uploadedBannerImage
      this.spinner.show()
      this._generalService.updateCompanyGroup(this.editGroupForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.router.navigate(['/layout/social-media/group-view/' + this.groupId])
            this.spinner.hide()
            this.toastr.success('Group Updated Successfully')
          } else {
            this.toastr.warning('', result['message'])
            this.spinner.hide()
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
          this.toastr.warning('Please upload logo & banner image')
        }
      )
    } else {
      this._generalService.markFormGroupTouched(this.editGroupForm)
    }
  }

  deleateGroupInfo() {
    if (this.isAdmin == false) {
      const dialogRef = this.dialog.open(DeleteGroupConfirmationDialogComponent, {
        width: '450px',
        data: 'Are you sure you want to archive this group?',
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.spinner.show()
          this._generalService.deleteCompanyGroup({ id: this.groupId }).subscribe((res: any) => {
            this.spinner.hide()
            if (res['code'] == genralConfig.statusCode.ok) {
              this.spinner.hide()
              this.router.navigate(['/layout/social-media/group-list'])
            } else {
              this.spinner.hide()
              this.toastr.error(res.message)
            }
          })
        }
      })
    } else {
      this.toastr.error('You cannot leave the group since you are the only owner of the group.')
    }
  }
}
