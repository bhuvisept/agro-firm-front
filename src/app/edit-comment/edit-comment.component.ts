import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
const Filter = require('bad-words');
const customFilter = new Filter({ regex: /\*|\.|$/gi });

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.css']
})
export class EditCommentComponent implements OnInit {
  onNoClick(): void {
  this.dialogRef.close()
  }

  comment:any
  userObj:any
  loggedIn:any
  public postProfile = environment.URLHOST + '/uploads/enduser/'


  constructor(
    public dialogRef: MatDialogRef<EditCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    ) {}


  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.comment = this.data.commentId.comment
    
    this.loggedIn = this.userObj.userInfo.image

  }

  updateComment(){
   
    this.comment =  customFilter.clean(this.comment);
      let data = {userId:this.data.userId,postId:this.data.postId,commentId:this.data.commentId._id,comment:this.comment}
      this._generalService.editComment(data).subscribe(res=>{
        if(res.code == 200){this.dialogRef.close({comment:this.comment})}
        else{this.toastr.warning(res['message'])}
      });
      ()=>{this.toastr.warning('Server error')}

  }
}

