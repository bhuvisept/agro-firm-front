import { Component, Inject, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { ToastrService } from 'ngx-toastr'
 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-assign-group',
  templateUrl: './assign-group.component.html',
  styleUrls: ['./assign-group.component.css']
})
export class AssignGroupComponent implements OnInit {
  userObj: any;
  userId: any;
  admin:any
  dataLoad:boolean = true
  groupMemberList :any 
  result = []
  listData = ['data',"otherdata"]
  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    
    
    public dialogRef:
    MatDialogRef<AssignGroupComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
     ) {}


  ngOnInit() {
   
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.getGroupListView(this.data.group_Id)
  }



  getGroupListView(id) {

    let data = {
      groupId: id,
      userId:  this.userObj.userInfo._id
    }
    this._generalService.getgroupPostList(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
         this.groupMemberList = response['data']
         this.result = this.groupMemberList.filter(word => word.role === 'member');

          this.dataLoad = false
         
     
        }
      },
    )
  }



  submit(){
    this.dialogRef.close({admin:this.admin})    
  }













  onNoClick(): void {
    this.dialogRef.close()
  }

}
