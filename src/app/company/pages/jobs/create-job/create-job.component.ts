import { Component, NgZone, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { MapsAPILoader } from '@agm/core'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import * as moment from 'moment'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ThemePalette } from '@angular/material'
import { GeneralServiceService } from 'src/app/core/general-service.service'
@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css'],
})
export class CreateJobComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  jobCreateForm: FormGroup
  employees = genralConfig.employees
  public editor = ClassicEditor
  minexperience: any = []
  maxexperience: any = []
  minsalary = genralConfig.minsalary
  workingHours = genralConfig.workingHours
  maxsalary = genralConfig.maxsalary
  visible = true
  selectable = true
  removable = true
  skills: any = []
  userId = ''
  geoCoder: any
  googleaddress: any = {}
  locationData = {}
  lat: number
  lng: number
  fullAddress: string = ''
  industryList: any
  status: String
  functionalAreaList: any
  walkInDetails: any
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
  submitted: boolean
  deleteArray = [
    { value: 'true', name: 'Archived' },
    { value: 'false', name: 'Unarchived' },
  ]
  salaryTypeList: any
  currency = genralConfig.currency
  userObj
  roleTitle: any
  companyId: any
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.maxexperience = this._generalService.yearsExperience()
    this.minexperience = this._generalService.monthsExperience()
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
      venue: [null, [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      startDate: [''],
      endDate: [''],
      description: ['', [Validators.required, Validators.pattern(genralConfig.pattern.MAXLENGTH)]],
      companyDetails: ['', [Validators.required]],
      companyName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      companyWebsite: ['', [Validators.pattern(genralConfig.pattern.URL)]],
      mapUrl: [''],
      contactNumber: [null, [Validators.pattern(genralConfig.pattern.PHONE_NO)]],
      contactPerson: [null, [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
      walkinchk: [''],
    })
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userObj) {
      this.userId = JSON.parse(localStorage.getItem('truckStorage')).userInfo._id
      this.roleTitle = JSON.parse(localStorage.getItem('truckStorage')).userInfo.accessLevel
      this.companyId = JSON.parse(localStorage.getItem('truckStorage')).userInfo.companyId
    }
    this.autosearch()
    this.getIndustry()
    this.getFunctionalArea()
    this.getQualification()
    this.getSkillsList()
    this.salaryType()
    this.getCompany()
  }
  salaryType() {
    let data = { isActive: this.status ? this.status : 'true', isDeleted: 'false' , count:100}
    this._generalService.getSalaryType(data).subscribe((res) => res['code'] == 200 && (this.salaryTypeList = res['data']))
  }
  setWalkInDetails(event) {
    this.walkInDetails = event.checked
    if (!this.walkInDetails) {
      this.jobCreateForm.controls['contactPerson'].reset()
      this.jobCreateForm.controls['contactPerson'].setValidators([])
      this.jobCreateForm.controls['contactPerson'].updateValueAndValidity()

      this.jobCreateForm.controls['contactNumber'].reset()
      this.jobCreateForm.controls['contactNumber'].setValidators([])
      this.jobCreateForm.controls['contactNumber'].updateValueAndValidity()

      this.jobCreateForm.controls['venue'].reset()
      this.jobCreateForm.controls['venue'].setValidators([])
      this.jobCreateForm.controls['venue'].updateValueAndValidity()
    } else {
      this.jobCreateForm.controls['contactPerson'].setValidators([Validators.required])
      this.jobCreateForm.controls['contactPerson'].updateValueAndValidity()

      this.jobCreateForm.controls['contactNumber'].setValidators([Validators.required])
      this.jobCreateForm.controls['contactNumber'].updateValueAndValidity()

      this.jobCreateForm.controls['venue'].setValidators([Validators.required])
      this.jobCreateForm.controls['venue'].updateValueAndValidity()
    }
  }
  isInteger(event) {
    var ctl = document.getElementById('myText')
    var startPos = ctl['selectionStart']
    if (startPos == 0 && String.fromCharCode(event.which) == '0') {
      return false
    }
  }
 


  onSubmitJobCreateForm() {
    if (this.jobCreateForm.valid) {
      this.spinner.hide()
      if (this.jobCreateForm.value.location !== this.fullAddress) {
        this.toastr.warning('Please select location from Dropdown')
        return false
      }
      if (this.walkInDetails == true) {
        this.jobCreateForm.value.walkInDetails = 'show'
        this.spinner.hide()
      } else if (this.walkInDetails == false) {
        this.jobCreateForm.value.walkInDetails = 'hide'
        this.spinner.hide()
      }
      this.jobCreateForm.value.createdById = this.userId
      if (!this.lat && !this.lng) return
      this.jobCreateForm.value.address = {
        coordinates: [this.lng, this.lat],
      }

      if (this.jobCreateForm.value.functionalArea == '' || this.jobCreateForm.value.functionalArea == null) {
        return false
      }
      if (this.jobCreateForm.value.industry == '' || this.jobCreateForm.value.industry == null) {
        return false
      }
      if (this.jobCreateForm.value.vacancy == '' || this.jobCreateForm.value.vacancy == null) {
        return false
      }
      if (this.jobCreateForm.value.companyName == '' || this.jobCreateForm.value.companyName == null) {
        return false
      }
    
      // if (parseInt((this.jobCreateForm.value.minSalary).replace(/,/g, '')) > parseInt((this.jobCreateForm.value.maxSalary).replace(/,/g, ''))) 
      if (parseFloat((this.jobCreateForm.value.minSalary)) > parseFloat((this.jobCreateForm.value.maxSalary))){
        this.toastr.warning('', 'Minimum salary should not be greater then maximum  salary')
        return false
      }
      if (this.jobCreateForm.value.startDate == '' || this.jobCreateForm.value.startDate == null) {
        this.toastr.warning('', 'Please select start date')
        return false
      }
      if (this.jobCreateForm.value.endDate == '' || this.jobCreateForm.value.endDate == null) {
        this.toastr.warning('', 'Please select end date')
        return false
      }


      if (new Date(this.jobCreateForm.value.startDate) > new Date(this.jobCreateForm.value.endDate)) {
        this.toastr.warning('', 'End date should be greater then start date')
        return false
      }
      if (this.walkInDetails === true) {
        if (this.jobCreateForm.value.duration == '') {
          this.toastr.warning('Please enter duration')
          return false
        }
        if (this.jobCreateForm.value.venue == '') {
          this.toastr.warning('Please enter walk-in address')
          return false
        }
        if (this.jobCreateForm.value.contactNumber == '') {
          this.toastr.warning('Please enter phone number')
          return false
        }
        if (this.jobCreateForm.value.companyDetails == '') {
          this.submitted = true
          return
        }
      }
      if (this.jobCreateForm.value.companyDetails == '' || this.jobCreateForm.value.companyDetails == null) {
        return false
      }
      /** ADDED BY JITENDRA FOR PLAN ACCESS ON 6th Feb-2022 */
      if (this.roleTitle == 'COMPANY') {
        this.jobCreateForm.value.createdById = this.userId
        this.jobCreateForm.value.companyId = this.userId
      } else {
        this.jobCreateForm.value.createdById = this.userId
        this.jobCreateForm.value.companyId = this.companyId
      }
      this.jobCreateForm.value.planTitle = 'JOB'
      this.jobCreateForm.value.constName = 'NOOFJOBS'
      this.jobCreateForm.value.roleTitle = this.roleTitle
      ;(this.jobCreateForm.value.fullAddress = this.fullAddress),
        /** ADDED BY JITENDRA FOR PLAN ACCESS ON 6th Feb-2022 */
        this.spinner.show()

        // this.jobCreateForm.value.minSalary =  parseInt((this.jobCreateForm.value.minSalary).replace(/,/g, ''))
        // this.jobCreateForm.value.maxSalary =  parseInt((this.jobCreateForm.value.maxSalary).replace(/,/g, ''))
        this.jobCreateForm.value.minSalary =  parseFloat((this.jobCreateForm.value.minSalary))
        this.jobCreateForm.value.maxSalary =  parseFloat((this.jobCreateForm.value.maxSalary))

      this._generalService.createJob(this.jobCreateForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.spinner.hide()
            this.toastr.success('', result['message'])
            this.router.navigate(['/layout/myaccount/jobs'])
          } else {
            this.toastr.warning('', result['message'])
            this.spinner.hide()
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
        }
      )
    } else {
      this._generalService.markFormGroupTouched(this.jobCreateForm)
      this.spinner.hide()
    }
  }
  // Industry Json
  getIndustry() {
    let data = {
      isActive: 'true',
      isDeleted: 'false',
      count:100, 
    }
    this._generalService.getIndustryList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.industryList = res['data']
        } else {
        }
      },
      (error) => {}
    )
  }
  // Functional Area Json
  getFunctionalArea() {
    let data = {
      isActive: this.status ? this.status : 'true', count:100, 
    }
    this._generalService.getFunctionalAreaList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.functionalAreaList = res['data']
        } else {
        }
      },
      (error) => {}
    )
  }
  getSkillsList() {
    let data = {
      isActive: this.status ? this.status : 'true',
      count:100
    }
    this._generalService.getSkillList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.skillList = res['data']
        } else {
        }
      },
      (error) => {}
    )
  }

  getQualification() {
    let data = {
      isActive: this.status ? this.status : 'true',
      count:100
    }
    this._generalService.getQualification(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.qualificationList = res['data']
        } else {
        }
      },
      (error) => {}
    )
  }
  // GOOGLE AUTOPLACE API
  autosearch() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder()
      var options = {
        componentRestrictions: { country: ['us', 'mx', 'ca'] },
      }
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
          this.locationData = {
            data: this.googleaddress.fullAddress,
          }
          this.jobCreateForm.patchValue({
            location: this.fullAddress,
          })
        })
      })
    })
  }
  add(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value
    if ((value || '').trim()) {
      if (this.skills.length >= 3) {
        this.toastr.warning('Maximum 3 skills can be added')
        this.chipsDisable = true
      } else {
        this.skills.push(value.trim())
      }
    }
    if (input) {
      input.value = ''
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.skills.length >= 3) {
      this.toastr.warning('Maximum 3 skills can be added')
      this.chipsDisable = true
    } else {
      this.skills.push(event.option.viewValue)
    }
  }
  remove(index): void {
    if (index >= 0) {
      if (this.skills.length <= 3) {
        this.chipsDisable = false
      }
      this.skills.splice(index, 1)
    }
  }
  getCompany() {
    let data = {
      companyId: this.roleTitle == 'COMPANY' ? this.userObj.userInfo._id : this.userObj.userInfo.companyId,
    }
    this.spinner.show()
    this._generalService.getCompanyDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.spinner.hide()
          this.jobCreateForm.patchValue({
            companyDetails: response.data.aboutCompany,
            companyName: response.data.companyName,
          })
        } else {
          this.toastr.warning('', response['message'])
          this.spinner.hide()
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.warning('Something went wrong')
      }
    )
  }
}
