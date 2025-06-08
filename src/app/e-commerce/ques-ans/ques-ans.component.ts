import { Component, Inject, OnInit , Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material'
import{BrandDeletConfirmationComponent} from '../manage-product/brand/brand-delet-confirmation/brand-delet-confirmation.component'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-ques-ans',
  templateUrl: './ques-ans.component.html',
  styleUrls: ['./ques-ans.component.css'],
})
export class QuesAnsComponent implements OnInit {
  userObj: any;
  userId: any;
  questionList: any;
  itemsPerPage:any=10
  totalCount:any
  page:any=1
  search:any
  isAnswered:any='no'
  answerArray=[
   {name:'Answered',value:'yes'},
   {name:'Unanswered',value:'no'}
  ]
  noRecordFound: boolean=false;
  question: any;
  constructor(
    private renderer:Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private service :GeneralServiceService,
    private dialog: MatDialog,
    private spinner :NgxSpinnerService,
    private toastr :ToastrService

  ) { }

  ngOnInit() {
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if( this.userObj.userInfo&& this.userObj.userInfo._id){
      this.userId =this.userObj.userInfo._id
    }
    this.questionsList(this.page)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  questionsList(page){
    let data ={
      page:page,
      count:this.itemsPerPage,
      isAnswered:this.isAnswered ?this.isAnswered:'yes',
      searchText:this.search ? this.search:null
    }
    if (this.userObj.userInfo.roleId.roleTitle == 'SELLER') {
      data['sellerId']= this.userId
    } else {
      data['sellerId'] = this.userObj.userInfo.companyId
    }
    this.page = page
    this.spinner.show()
    this.service.questionsList(data).subscribe((res)=>{
      this.spinner.hide()
      if(res['code']===200){
        this.questionList=res['data']
        this.totalCount=res['totalCount']
        if( this.questionList.length){
          this.noRecordFound=true
        }else{
          this.noRecordFound=false
        }
      }else{

      }
    })
  }
  pageChanged(event){
    this.page=event
    this.questionsList(event)
  }
  reset(){
    this.isAnswered='no'
    this.search=''
    this.questionsList(1)
  }
  deleteQuestion(id){
    let dialogRef = this.dialog.open(BrandDeletConfirmationComponent, {
      width: '400px',
      data: 'Are you sure you want to delete? ',  // Added by shivam kashyap 05/12/2022
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show()
        this.service.questionDelete({ id: id }).subscribe((res: any) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            this.spinner.hide()
            this.questionsList(1)
          } else {
            this.spinner.hide()
            this.toastr.error(res.message)
          }
        })
      }
    })
  }
  questionDetails(id) {
    this.question=''
    let data = {
      _id: id
    }
    this.spinner.show()
    this.service.questionsData(data).subscribe((res)=>{
      if(res['code']==200){
        this.question=res['data']
        this.spinner.hide()
      }else{this.spinner.hide()}
    })
  }
}
