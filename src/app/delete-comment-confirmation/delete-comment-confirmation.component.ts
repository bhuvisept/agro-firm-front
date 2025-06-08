import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-delete-comment-confirmation',
  templateUrl: './delete-comment-confirmation.component.html',
  styleUrls: ['./delete-comment-confirmation.component.css'],
})
export class DeleteCommentConfirmationComponent implements OnInit {
  userObj: any

  constructor(public dialogRef: MatDialogRef<DeleteCommentConfirmationComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _generalService: GeneralServiceService) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  deletComment() {
    this._generalService.DeleteComment(this.data).subscribe((res) => res.code === 200 && this.dialogRef.close({ apiHit: true }))
  }
}
