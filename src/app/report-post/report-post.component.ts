import { Component, OnInit, Inject } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { ToastrService } from 'ngx-toastr'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
@Component({
  selector: 'app-report-post',
  templateUrl: './report-post.component.html',
  styleUrls: ['./report-post.component.css'],
})
export class ReportPostComponent implements OnInit {
  createPostForm: FormGroup
  userObj
  postId
  reportLists = ['Spam', 'Violence', 'Harassment', 'Inappropriate Content', 'Other']
  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private formbuilder: FormBuilder,
    public currentDialogRef: MatDialogRef<ReportPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.postId = this.data.postId
    this.createPostForm = this.formbuilder.group({ type: ['', [Validators.required]] })
  }
  onNoClick(): void {
    this.currentDialogRef.close()
  }

  onSubmitCreateReport() {
    if (this.createPostForm.valid) {
      this.spinner.show()
      let data = { userId: this.userObj.userInfo._id, reason: this.createPostForm.value.type, postId: this.postId }
      this._generalService.report(data).subscribe(
        (response) => {
          if (response.code == 200) {
            this.currentDialogRef.close({ apiHit: true })
            this.toastr.success(response['message'])
          } else this.toastr.warning(response['message'])
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.warning('Server Error')
        }
      )
    }
  }
}
