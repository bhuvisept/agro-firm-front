import { Component, OnInit, Inject, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { genralConfig } from 'src/app/constant/genral-config.constant'
const Filter = require('bad-words')
const customFilter = new Filter({ regex: /\*|\.|$/gi })
@Component({
  selector: 'app-answer-ques',
  templateUrl: './answer-ques.component.html',
  styleUrls: ['./answer-ques.component.css'],
})
export class AnswerQuesComponent implements OnInit {
  addForm: FormGroup
  quesId: any
  quesData: any
  userObj: any
  userId: any
  question: any
  data: any
  answer: any
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private service: GeneralServiceService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _generalService: GeneralServiceService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((res) => (this.quesId = res.id))
    this.addForm = this.fb.group({ answer: ['', [Validators.required]] })
    this.questionDetails()
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userObj && this.userObj.userInfo._id) this.userId = this.userObj.userInfo._id
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  questionDetails() {
    let data = { _id: this.quesId }
    this.spinner.show()
    this.service.questionsData(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.data = res['data']
          this.question = res['data'].question
        }
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.error('server error')
      }
    )
  }
  submit() {
    if (this.addForm.valid) {
      if (this.addForm.value.answer) this.answer = customFilter.clean(this.addForm.value.answer)
      let data = { answeredById: this.userId, _id: this.quesId, answer: this.answer, receiver: this.data.customerId, userName: this.userObj.userInfo.personName, productId: this.data.productId }
      this.spinner.show()
      this.service.questionsAnswer(data).subscribe((res) => {
        if (res['code'] == 200) {
          this.router.navigate(['/layout/e-commerce/questions'])
          this.toastr.success(res['message'])
        }
        this.spinner.hide()
      })
    } else this._generalService.markFormGroupTouched(this.addForm)
  }
  goBack() {
    window.history.back()
  }
}
