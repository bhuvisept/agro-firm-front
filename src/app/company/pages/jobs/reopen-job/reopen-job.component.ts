import { Component, NgZone, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { MapsAPILoader } from '@agm/core'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import * as moment from 'moment'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ThemePalette } from '@angular/material'
import { GeneralServiceService } from 'src/app/core/general-service.service'
@Component({
  selector: 'app-reopen-job',
  templateUrl: './reopen-job.component.html',
  styleUrls: ['./reopen-job.component.css'],
})
export class ReopenJobComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  jobCreateForm: FormGroup
  employees = genralConfig.employees
  public editor = ClassicEditor
  minexperience: any = []
  maxexperience: any = []
  minsalary = genralConfig.minsalary
  maxsalary = genralConfig.maxsalary
  workingHours = genralConfig.workingHours
  visible = true
  selectable = true
  removable = true
  skills: any = []
  userId = ''
  geoCoder: any
  googleaddress: any = {}
  lat: number
  lng: number
  fullAddress: string = ''
  industryList: any
  status: String
  functionalAreaList: any
  walkInDetails: boolean = false
  qualificationList: any
  functionalAreaId: String
  roleList: any
  skillList: any
  chipsDisable: boolean = false
  public date: moment.Moment
  public minDate: moment.Moment
  public maxDate: moment.Moment
  public disabled = false
  public showSpinners = true
  public showSeconds = false
  public touchUi = false
  public enableMeridian = false
  public stepHour = 1
  public stepMinute = 1
  public stepSecond = 1
  public color: ThemePalette = 'primary'
  min = new Date()
  startTime: any
  endTime: any
  jobId: any
  jobData: any
  roleTitle:any
  jobskills: any = []
  qualifications: any = []
  address: any
  deleteArray = [
    { value: 'true', name: 'Archived' },
    { value: 'false', name: 'Unarchived' },
  ]
  roleName: any
  skillsArray: any = []
  salaryTypeList: any
  currency = genralConfig.currency
  userDatas: any
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private zone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.zone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.maxexperience = this._generalService.yearsExperience()
    this.minexperience = this._generalService.monthsExperience()
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.userDatas = JSON.parse(localStorage.getItem('truckStorage'))

    this.userId = userData.userInfo._id
    this.roleName = userData.userInfo.roleId.roleTitle
    this.route.params.subscribe((params) => (this.jobId = params.id))
    this.getJobInfo()
    this.jobCreateForm = this.formbuilder.group({
      title: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      employmentType: ['', [Validators.required]],
      skills: ['', [Validators.required]],
      minWorkExp: ['', [Validators.required]],
      maxWorkExp: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      minSalary: [''],
      maxSalary: [''],
      salaryType: [''],
      location: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      functionalArea: ['', [Validators.required]],
      isDeleted: [],
      vacancy: [
        '',
        [
          Validators.required,
          Validators.maxLength(genralConfig.pattern.MAXIMUMVACANCY),
          Validators.minLength(genralConfig.pattern.MINIMUMVACANCY),
          Validators.pattern(genralConfig.pattern.BACKSPACE),
          Validators.pattern(genralConfig.pattern.WHITESPACE),
        ],
      ],
      qualification: ['', [Validators.required]],
      venue: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      startDate: [''],
      endDate: [''],
      description: ['', [Validators.required, Validators.pattern(genralConfig.pattern.MAXLENGTH)]],
      companyDetails: ['', [Validators.required]],
      companyName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      companyWebsite: ['', [Validators.pattern(genralConfig.pattern.URL)]],
      mapUrl: [''],
      contactNumber: ['', [Validators.pattern(genralConfig.pattern.PHONE_NO)]],
      contactPerson: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      walkinchk: [''],
    })
    if (localStorage.getItem('truckStorage') != null) this.userId = JSON.parse(localStorage.getItem('truckStorage')).userInfo._id
    this.getFunctionalArea()
    this.autosearch()
    this.getIndustry()
    this.getQualification()
    this.getSkillsList()
    this.salaryType()
  }
  salaryType() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getSalaryType(data).subscribe((res) => res['code'] == 200 && (this.salaryTypeList = res['data']))
  }
  getJobInfo() {
    let jobDataObj = { _id: this.jobId, userId: this.userId }
    this.spinner.show()
    this._generalService.jobView(jobDataObj).subscribe(
      (res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          this.jobData = res['data']
          this.jobCreateForm.patchValue({
            title: this.jobData.title ? this.jobData.title : '',
            employmentType: this.jobData.employmentType ? this.jobData.employmentType : '',
            minWorkExp: this.jobData.minimumExperience,
            maxWorkExp: this.jobData.maximumExperience,
            description: this.jobData.description ? this.jobData.description : '',
            functionalArea: this.jobData.functionalAreaId ? this.jobData.functionalAreaId : '',
            industry: this.jobData.industry ? this.jobData.industry : '',
            companyName: this.jobData.companyName ? this.jobData.companyName : '',
            companyDetails: this.jobData.companyDetails ? this.jobData.companyDetails : '',
            vacancy: this.jobData.vacancy ? this.jobData.vacancy : '',
            salaryType: this.jobData.salaryType ? this.jobData.salaryType : '',
            currency: this.jobData.salaryRang ? this.jobData.salaryRang[0].currency : '',
            minSalary: this.jobData.salaryRang[0].min ? this.jobData.salaryRang[0].min.toString() : '',
            maxSalary: this.jobData.salaryRang[0].max ? this.jobData.salaryRang[0].max.toString() : '',
            companyWebsite: this.jobData.companyWebsite ? this.jobData.companyWebsite : '',
            walkinchk: this.jobData.iswalkInDetails ? this.jobData.iswalkInDetails : false,
            duration: this.jobData.walkInDetails[0].duration ? this.jobData.walkInDetails[0].duration : '',
            contactPerson: this.jobData.walkInDetails[0].contactPerson ? this.jobData.walkInDetails[0].contactPerson : '',
            contactNumber: this.jobData.walkInDetails[0].number ? this.jobData.walkInDetails[0].number : '',
            venue: this.jobData.walkInDetails[0].venue ? this.jobData.walkInDetails[0].venue : '',
            startDate: this.jobData.walkInDetails[0].startDate ? this.jobData.walkInDetails[0].startDate : '',
            endDate: this.jobData.walkInDetails[0].endDate ? this.jobData.walkInDetails[0].endDate : '',
            isDeleted: this.jobData.isDeleted ? 'true' : 'false',
            location: this.jobData.fullAddress,
          })
          this.address = this.jobData.address
          this.walkInDetails = this.jobData.iswalkInDetails ? this.jobData.iswalkInDetails : ''
          for (let i = 0; i < this.jobData.skills.length; i++) {
            this.jobskills.push(this.jobData.skills[i].skillId)
          }
          this.jobCreateForm.controls['skills'].setValue(this.jobskills)
          for (let i = 0; i < this.jobData.qualification.length; i++) {
            this.qualifications.push(this.jobData.qualification[i].qualificationId)
          }
          this.jobCreateForm.controls['qualification'].setValue(this.qualifications)
          this.getselectval(this.jobData.functionalAreaId)
        } else {
          window.scrollTo(0, 0)
          this.toastr.error('error', res['message'])
        }
        this.spinner.hide()
      },
      () => {
        this.toastr.error('error')
        this.spinner.hide()
      }
    )
  }

  isInteger(event) {
    var ctl = document.getElementById('myText')
    var startPos = ctl['selectionStart']
    if (startPos == 0 && String.fromCharCode(event.which) == '0') return false
  }
  onSubmitJobEditForm() {
    if (this.jobCreateForm.valid) {
      if (this.walkInDetails == true) this.jobCreateForm.value.walkInDetails = 'show'
      else if (this.walkInDetails == false) this.jobCreateForm.value.walkInDetails = 'hide'
      this.jobCreateForm.value.createdById = this.userId
      if (this.lng && this.lat) {
        this.jobCreateForm.value.address = { coordinates: [this.lng, this.lat] }
        this.jobCreateForm.value.fullAddress = this.fullAddress
      } else {
        this.jobCreateForm.value.address = this.address
        this.jobCreateForm.value.fullAddress = this.jobData.fullAddress
      }
      // if (parseInt(this.jobCreateForm.value.minSalary) > parseInt(this.jobCreateForm.value.maxSalary)) {
      //   this.toastr.warning('', 'Minimum salary should not be greater then maximum  salary')
      //   return false
      // }
      if (parseFloat((this.jobCreateForm.value.minSalary).replace(/,/g, '')) > parseFloat((this.jobCreateForm.value.maxSalary).replace(/,/g, ''))) {
        this.toastr.warning('', 'Minimum salary should not be greater then maximum  salary')
        return false
      }
      if (this.jobCreateForm.value.walkinchk == true) {
        if (this.jobCreateForm.value.startDate == '' || this.jobCreateForm.value.startDate == null) {
          this.toastr.warning('', 'Please select start date')
          return false
        }
        if (this.jobCreateForm.value.endDate == '' || this.jobCreateForm.value.endDate == null) {
          this.toastr.warning('', 'Please select end date')
          return false
        }
        if (this.jobCreateForm.value.duration == '') {
          this.toastr.warning('', 'Please enter duration')
          return false
        }
        if (this.jobCreateForm.value.contactNumber == '') {
          this.toastr.warning('Please enter contact number')
          return false
        }
        if (this.jobCreateForm.value.venue == '') {
          this.toastr.warning('', 'Please enter walk-in address')
          return false
        }
      }
      this.jobCreateForm.value._id = this.jobId
      this.jobCreateForm.value.lastaddress = this.jobData.address
      this.spinner.show()

      this.jobCreateForm.value.minSalary =  parseFloat((this.jobCreateForm.value.minSalary).replace(/,/g, ''))
      this.jobCreateForm.value.maxSalary =  parseFloat((this.jobCreateForm.value.maxSalary).replace(/,/g, ''))

      this.jobCreateForm.value.constName= "NOOFJOBS" 
      this.jobCreateForm.value.planTitle= "JOB"
      this.jobCreateForm.value.roleTitle =this.roleName
      this.jobCreateForm.value.companyId= this.roleName == 'COMPANY' ? this.userId : this.userDatas.userInfo.companyId
      
      this._generalService.reopenJob(this.jobCreateForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.toastr.success('Update successfully')
            this.router.navigate(['/layout/myaccount/jobs'])
          } else this.toastr.warning('', result['message'])
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
        }
      )
    }
  }
  getFunctionalArea() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getFunctionalAreaList(data).subscribe((res) => res['code'] == 200 && (this.functionalAreaList = res['data']))
  }
  getselectval(val) {
    this.functionalAreaId = val
    if (this.functionalAreaId) this.getRole(this.functionalAreaId)
  }
  getRole(functionalAreaId) {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getFunctionalAreaList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.functionalAreaList = res['data']
        this.roleList = this.functionalAreaList.find((el) => el._id == functionalAreaId).roles
      }
    })
  }
  setWalkInDetails(event) {
    this.walkInDetails = event.checked
    if (this.walkInDetails == false) {
      this.jobCreateForm.controls['contactPerson'].reset()
      this.jobCreateForm.controls['contactNumber'].reset()
      this.jobCreateForm.controls['venue'].reset()
    }
  }
  // Industry Json
  getIndustry() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getIndustryList(data).subscribe((res) => res['code'] == 200 && (this.industryList = res['data']))
  }
  getSkillsList() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getSkillList(data).subscribe((res) => res['code'] == 200 && (this.skillList = res['data']))
  }
  getQualification() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getQualification(data).subscribe((res) => res['code'] == 200 && (this.qualificationList = res['data']))
  }

  autosearch() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder()
      var options = { componentRestrictions: { country: ['us', 'mx', 'ca'] } }
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options)
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace()
          if (place.geometry === undefined || place.geometry === null) {
            return
          }
          this.googleaddress.lat = place.geometry.location.lat()
          this.googleaddress.lng = place.geometry.location.lng()
          this.googleaddress.fullAddress = place.formatted_address
          this.lat = this.googleaddress.lat
          this.lng = this.googleaddress.lng
          this.fullAddress = this.googleaddress.fullAddress
        })
      })
    })
  }
}
