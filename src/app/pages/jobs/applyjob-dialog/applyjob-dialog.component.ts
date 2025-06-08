import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { Subscription } from 'rxjs'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { SharedService } from 'src/app/service/shared.service'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-applyjob-dialog',
  templateUrl: './applyjob-dialog.component.html',
  styleUrls: ['./applyjob-dialog.component.css'],
})
export class ApplyjobDialogComponent implements OnInit {
  public editor = ClassicEditor
  userId: String = ''
  requiredFileType: string
  fileName = ''
  uploadProgress: number
  uploadSub: Subscription
  uploadedBannerImage: string = ''
  fileData: File = null
  previewUrlLogo: any = null
  document_extension_array = genralConfig.document_extension_array
  uploadedImage: any
  uploadedDoc: any
  jobId: any
  UserData
  jobData: any
  jobDataObj: any
  sendTextarea: boolean = false
  checkUploadData: boolean = true
  textarea: any
  resumeText: string = ''
  userName: any
  driverDocuments: any = []
  driverSelectedDocs: any = []
  returnRoute: string
  constructor(
    private router: Router,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private SharedService: SharedService,
    public dialogRef: MatDialogRef<ApplyjobDialogComponent>,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.jobId = this.data.jobId
    this.jobData = this.data.jobData
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.UserData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
      this.userName = userData.userInfo.personName
    }
    this.textarea = document.querySelector('#autoresizing')
    if (this.textarea) {
      this.textarea.addEventListener('input', autoResize, false)
    }

    function autoResize() {
      this.style.height = 'auto'
      this.style.height = this.scrollHeight + 'px'
    }
    this.forDriverDocuments()
    this.returnRoute = this.router.url
  }

  forDriverDocuments() {
    let data = {
      endUserId: this.userId,
    }
    // this.spinner.show();
    this._generalService.getEndUserDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        response['data'].documents.map((doc) => {
          if (doc.name != 'Resume') {
            this.driverDocuments.push(doc)
          }
        })
      }
    })
  }

  selectedDocs(e, doc) {
    if (e.checked) {
      this.driverSelectedDocs.push(doc)
    } else {
      let index = this.driverSelectedDocs.indexOf(doc)
      this.driverSelectedDocs.splice(index, 1)
    }
  }

  login() {
    this.dialogRef.close()

    this.router.navigate(['/login'], { queryParams: { returnUrl: this.returnRoute } })
  }
  userRegister() {
    this.dialogRef.close()
    this.router.navigate(['/signup/user-signup'])
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
  goBackClick() {
    this.checkUploadData = true
    this.sendTextarea = false
  }
  uploadResumeCv(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0]
    let imageType = this.fileData.type
    if (this.document_extension_array.includes(imageType)) {
      const formData = new FormData()
      formData.append('file', this.fileData)
      
      this.spinner.show()
      this._generalService.uploadResume(formData).subscribe(
        (res) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            console.log(res['data']);

            this.spinner.hide()
            this.uploadedDoc = res['data']
          } else {
            this.toastr.error(res['message'])
            this.spinner.hide()
          }
        },
        (err) => {
          this.spinner.hide()
        }
      )
    } else {
      this.toastr.warning('only pdf, docx file format are allowed')
      this.spinner.hide()
    }
  }
  applyJob() {
    if (this.resumeText || this.uploadedDoc) {
      let data = {
        userId: this.userId,
        jobId: this.jobId,
        resume: this.uploadedDoc ? this.uploadedDoc : null,
        description: this.resumeText ? this.resumeText : null,
        applicantName: this.userName,
        companyEmail: this.jobData.userdata.email,
        companyName: this.jobData.companyName,
        jobTitle: this.jobData.title,
        companyId: this.jobData.createdById,
        userName: this.userName,
        driverDocuments: this.driverSelectedDocs.length ? this.driverSelectedDocs : [],
      }
      this.spinner.show()
      this._generalService.getApplicant(data).subscribe(
        (res) => {
          if (res['code'] == 200) this.toastr.success('', res['message'])
          else this.toastr.warning('', res['message'])
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
        }
      )
    }
  }
  getJobInfo() {
    if (this.userId) this.jobDataObj = { _id: this.jobId, userId: this.userId }
    if (!this.userId) this.jobDataObj = { _id: this.jobId }
    this._generalService.jobView(this.jobDataObj).subscribe(
      (res) => {
        this.spinner.show()
        if (res['code'] == 200) {
          this.jobData = res['data']
          this.spinner.hide()
        } else {
          window.scrollTo(0, 0)
          this.toastr.error('error', res['message'])
          this.spinner.hide()
        }
      },
      (err) => {
        this.toastr.error('error')
        this.spinner.hide()
      }
    )
  }
  checkData() {
    this.checkUploadData = false
    this.sendTextarea = true
  }
}
