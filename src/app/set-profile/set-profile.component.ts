import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MapsAPILoader } from '@agm/core'
import { SharedService } from 'src/app/service/shared.service'
import moment from 'moment'
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-set-profile',
  templateUrl: './set-profile.component.html',
  styleUrls: ['./set-profile.component.css'],
  providers: [NgxSpinnerService],
})
export class SetProfileComponent implements OnInit {
  @ViewChild('AddressSearch', { static: false }) searchElementRef: ElementRef
  editCompanyProfileForm: FormGroup
  updateCompanyProfileForm: FormGroup
  viewUserProfileForm: FormGroup
  updateUserProfileForm: FormGroup
  secondFormGroup: FormGroup
  roleName: any
  isLinear: true
  userObj: any
  countryList: any
  countryId: String
  stateList: any
  status: String
  fileData: File = null
  previewUrlLogo: any = null
  uploadedBannerImage: string = ''
  public banner_img_path = environment.URLHOST + '/uploads/company/banner/'
  public companyLogo_path = environment.URLHOST + '/uploads/company/'
  public image_url_profile = environment.URLHOST + '/uploads/company/banner/'
  public logo_url_profile = environment.URLHOST + '/uploads/company/'
  public image_enduser_profile = environment.URLHOST + '/uploads/enduser/'
  public docsData_url = environment.URLHOST + '/uploads/docs/'
  bannerImage: any
  profileLogo: any
  serviceList: any
  uploadedCompanyLogo: any
  companyservicesArray: any = []
  servicesArrayView: any = []
  serviceTempArray: any = []
  uploadedLogo: string = ''
  qualificationList: any
  skillList: any
  proImage: any
  skillsArray: any = []
  skillsArrayView: any = []
  qualificationArray: any = []
  qualificationArrayView: any = []
  userProfileLogo: any
  editService
  cityPatch: any
  docs: any

  progressData: any = {}
  counter: any
  public date: moment.Moment
  public disabled = false
  public showSpinners = true
  public showSeconds = false
  public touchUi = false
  public enableMeridian = false

  minDateOfBirth = moment(new Date()).subtract(16, 'y').format('YYYY-MM-DD')
  minBirth = moment(new Date()).format('YYYY-MM-DD')

  public stepHour = 1
  public stepMinute = 1
  public stepSecond = 1
  genderList = genralConfig.gender
  maritalStatus = genralConfig.maritalStatus
  public experience = genralConfig.experience
  minexperience:any
  language = genralConfig.language
  driverImage: any
  maxDate: any
  textarea: any
  userIdforServices
  zipcode: any
  validZipCode: any
  imageChangedEvent: any
  croppedImage: any
  finalCroppedBanner: File
  logoChangedEvent: any
  finalCroppedLogo: File
  croppedLogo: string
  companyFrmlength = genralConfig.storage.COMPANYFROMFIELDS
  userFrmlength = genralConfig.storage.USERFROMFIELDS
  accessLevel: any
  driverDocs = [
    { type: 'file', name: 'Driving License' },
    { type: 'file', name: 'DMV Medical Certificate' },
    { type: 'file', name: 'Resume' },
    { type: 'file', name: 'Additional document', input: 'text' },
  ]
  document_extension_array = genralConfig.document_extension_array
  driverDocumentsArr: any
  isOtherSelected : boolean =false
  isOtherSkillSelected: boolean = false
  isLoadingBanner:boolean = false
  isLoading:boolean=false
  isLoadingLogo: boolean = false

  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private SharedService: SharedService
  ) {}

  ngOnInit() {
    this.minexperience = this._generalService.monthsExperience()
    if (localStorage.getItem('progressBar') != undefined) {
      this.counter = parseInt(localStorage.getItem('progressBar'))
    } else {
      this.counter = 0
    }

    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    console.log(this.userObj.userInfo.accessLevel)
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.accessLevel = this.userObj.userInfo.accessLevel
    this.userIdforServices = this.userObj.userInfo._id

    if (this.roleName == genralConfig.rolename.COMPANY) {
      this.editCompanyProfileForm = this.formbuilder.group({
        companyName: [{ value: '', disabled: true }],
        firstName: [{ value: '', disabled: true }],
        lastName: [{ value: '', disabled: true }],
        incorporationDate: [{ value: '', disabled: true }],
        address: [{ value: '', disabled: true }],
        email: [{ value: '', disabled: true }],
        mobileNumber: [{ value: '', disabled: true }],
        middleName: [{ value: '', disabled: true }],
        aboutCompany: [{ value: '', disabled: true }],
        servicesView: [{ value: '', disabled: true }],
        postalCode: [{ value: '', disabled: true }],
        country: [{ value: '', disabled: true }],
        state: [{ value: '', disabled: true }],
        city: [{ value: '', disabled: true }],
        roleTitle: genralConfig.rolename.COMPANY,
      })
      this.getCompany()
    } else {
      if (this.roleName == genralConfig.rolename.ENDUSER) {
        this.viewUserProfileForm = this.formbuilder.group({
          firstName: [''],
          lastName: [''],
          email: [''],
          mobileNumber: [''],
          gender: [''],
          dateOfBirth: [''],
          experience: [''],
          monthsExperience: [''],
          maritalStatus: [''],
          skillsView: [''],
          qualificationView: [''],
          language: [''],
          workPlace: [''],
          designation: [''],
          corrAddress: [''],
          permAddress: [''],
          roleTitle: genralConfig.rolename.USER,
        })
        this.getUserProfileDetails()
        this.getQualification()
        this.getSkillsList()
        this.maxDate = new Date().toISOString().slice(0, 10)
        this.updateUserProfileForm = this.formbuilder.group({
          firstName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
          lastName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
          email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
          mobileNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]],
          gender: [''],
          dateOfBirth: ['', [Validators.required]],
          experience: ['', [Validators.required]],
          monthsExperience: ['', [Validators.required]],
          maritalStatus: [''],
          skills: [''],
          otherSkill: [''],
          qualification: [''],
          otherQualification: [''],
          language: [''],
          workPlace: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
          designation: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
          corrAddress: [''],
          permAddress: [''],
          aboutUser: ['', [Validators.required, this._generalService.noWhitespaceValidator]],
          roleTitle: genralConfig.rolename.USER,
        })
      }
    }
    this.updateCompanyProfileForm = this.formbuilder.group({
      companyName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      firstName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      lastName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      incorporationDate: ['', [Validators.required]],
      address: [''],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]],
      middleName: [''],
      aboutCompany: ['', [Validators.required, this._generalService.noWhitespaceValidator]],
      postalCode: ['', [Validators.required, this._generalService.noWhitespaceValidator, Validators.minLength(genralConfig.pattern.MINLENGTH)]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      roleTitle: genralConfig.rolename.COMPANY,
    })
    this.getCountry()
  }

  //event for logo image
  logoChangeEvent(event: any): void {
    this.isLoading = true
    this.logoChangedEvent = event
    if (this.logoChangedEvent.target.files[0].name) {
      document.getElementById('open-diaLog-logo').click()
    }
  }
  qualification(event) {

    this.isOtherSelected = event.value.includes('12345')
  }
  //event for logo image
  logoCropped(event: ImageCroppedEvent) {
    this.isLoading = false
    this.croppedLogo = event.base64
  }

  stateEmpty() {
    this.updateCompanyProfileForm.patchValue({
      state: '',
    })
  }

  //event for banner image
  fileChangeEvent(event: any): void {
    this.isLoading = true
    this.imageChangedEvent = event
    if (this.imageChangedEvent.target.files[0].name) {
      document.getElementById('open-diaLog').click()
    }
  }
  //event for banner image
  imageCropped(event: ImageCroppedEvent) {
    this.isLoading = false
    this.croppedImage = event.base64
  }

  //for banner image
  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const int8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([int8Array], { type: this.imageChangedEvent.target.files[0].type })
    return blob
  }

  //  for logo image
  DATAURItoBlob(dataURI) {
    const byteString = atob(dataURI)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const int8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([int8Array], { type: this.logoChangedEvent.target.files[0].type })
    return blob
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  getCityByZipcode() {
    this.spinner.show()
    let data = { zipcode: this.zipcode }
    this._generalService.getCityByZipcode(data).subscribe(
      (res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          this.validZipCode = res['data'].city
          this.editCompanyProfileForm.patchValue({ city: res['data'].city, postalCode: res['data'].zip })
          this.updateCompanyProfileForm.patchValue({ city: res['data'].city, postalCode: res['data'].zip })
        } else {
          this.toastr.warning(res['message'])
          this.updateCompanyProfileForm.patchValue({ city: '', postalCode: '' })
          this.editCompanyProfileForm.patchValue({ city: '', postalCode: '' })
          return false
        }
      },
      (error) => {}
    )
  }
  selectedServices(event) {
    this.servicesArrayView = []
    let tempSelectedService = event
    tempSelectedService.forEach((element) => {
      this.servicesArrayView.push({ serviceId: element })
    })
  }
  toggleMaxDate(evt: any) {
    if (evt.checked) {
      // this._setMaxDate();
    } else {
      this.maxDate = null
    }
  }

  getCompany() {
    let data = {
      companyId: this.userObj.userInfo._id,
    }
    this._generalService.getCompanyDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.profileLogo = response['data'].companyLogo
          this.bannerImage = response['data'].bannerImage
          this.cityPatch = response['data'].city
          this.editCompanyProfileForm.patchValue(response['data'])
          this.updateCompanyProfileForm.patchValue(response['data'])
          this.getState(response['data'].country)
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

  onSubmitCompanyProfileForm() {
    if (this.updateCompanyProfileForm.valid) {
      this.counter = ((this.companyFrmlength - 2) * 100) / this.companyFrmlength
      this.updateCompanyProfileForm.value.companyLogo = this.uploadedCompanyLogo
      this.updateCompanyProfileForm.value.bannerImage = this.uploadedBannerImage
      this.updateCompanyProfileForm.value.userId = this.userObj.userInfo._id
      this.updateCompanyProfileForm.value.city = this.validZipCode ? this.validZipCode : this.cityPatch
      this.updateCompanyProfileForm.value.profileComplete = true
      if (this.updateCompanyProfileForm.value.companyLogo || this.profileLogo) {
        this.counter += 100 / this.companyFrmlength
      }
      if (this.updateCompanyProfileForm.value.bannerImage || this.bannerImage) {
        this.counter += 100 / this.companyFrmlength
      }
      this.progressData = { value: this.counter }
      this.SharedService.setProfileProgress(this.progressData)
      let tempVar = ''
      tempVar = this.counter
      localStorage.setItem('progressBar', tempVar)
      this.SharedService.setProfileProgress(this.progressData)
      this.updateCompanyProfileForm.value.progressBar = this.counter
      this._generalService.updateCompanyProfile(this.updateCompanyProfileForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            let userInfo = {}
            let UserData = {
              personName: result['data'].companyResult.companyName,
              companyName: result['data'].companyResult.companyName,
              image: result['data'].userResult.image,
              _id: result['data'].userResult._id,
              roleId: this.userObj.userInfo.roleId,
              accessLevel: result['data'].userResult.accessLevel,
              profileComplete: true,
              multiRole: result['data'].userResult.multiRole,
              paymentToken: result['data'].userResult.paymentToken,
              planData: result['data'].userResult.planData,
              contactNumber: this.userObj.userInfo.mobileNumber,
              planName: [],
            }
            userInfo['userInfo'] = UserData
            this.SharedService.setHeader(UserData)

            localStorage.setItem('truckStorage', JSON.stringify(userInfo))
            this.SharedService.setHeader(UserData)

            if (userInfo['userInfo'].paymentToken != null && userInfo['userInfo'].paymentToken != '') {
              return this.router.navigate(['/payment'])
            }

            this.spinner.hide()
            this.toastr.success('', result['message'])

            this.router.navigate(['/layout/myaccount/dashboard'])
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
      this._generalService.markFormGroupTouched(this.updateCompanyProfileForm)
    }
  }

  userId(arg0: string, userId: any) {
    throw new Error('Method not implemented.')
  }

  // Country Json
  getCountry() {
    let data = {
      isActive: this.status ? this.status : 'true',
    }
    this._generalService.getCountryList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.countryList = res['data']
        }
      },
      (error) => {}
    )
  }

  getselectval(val) {
    this.countryId = val
    if (this.countryId) {
      this.getState(this.countryId)
    } else {
    }
  }

  getState(countryId) {
    this._generalService.getStateList({ countryId: countryId, isActive: 'true' }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.stateList = res['data']
        }
      },
      (error) => {}
    )
  }

  //COMPANY LOGO
  uploadCompanyLogo() {
    this.isLoadingLogo = true
    const imageName = this.logoChangedEvent.target.files[0].name
    const imageBlob = this.DATAURItoBlob(this.croppedLogo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedLogo = new File([imageBlob], imageName, { type: this.logoChangedEvent.target.files[0].type })
    if (this.finalCroppedLogo != undefined) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedLogo)
      formData.append('type', 'COMPANYLOGO')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.spinner.hide()
            this.uploadedCompanyLogo = res['data'].imagePath
            this.isLoadingLogo = false
            this.finalCroppedLogo = null
            this.croppedLogo = null
          } else {
            this.finalCroppedLogo = null
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
        },
        (error) => {
          this.spinner.hide()
        }
      )
    } else {
      this.previewUrlLogo = ''
    }
  }

  //COMPANY BANNER LOGO

  uploadBannerImage() {
    this.isLoadingBanner = true
    const imageName = this.imageChangedEvent.target.files[0].name
    const imageBlob = this.dataURItoBlob(this.croppedImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedBanner = new File([imageBlob], imageName, { type: this.imageChangedEvent.target.files[0].type })
    if (this.finalCroppedBanner != undefined) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedBanner)
      formData.append('type', 'COMPANYBANNER')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            this.spinner.hide()
            this.uploadedBannerImage = res['data'].imagePath
            this.isLoadingBanner = false
            this.finalCroppedBanner = null
            this.croppedImage = null
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
            this.finalCroppedBanner = null
          }
        },
        (error) => {
          this.spinner.hide()
        }
      )
    } else {
      this.previewUrlLogo = ''
    }
  }

  getUserProfileDetails() {
   
    let data = {
      endUserId: this.userObj.userInfo._id,
    }
    this._generalService.getEndUserDetails(data).subscribe(
      (response) => {
        if (response['code'] == genralConfig.statusCode.ok) {
          this.driverImage = response['data'].image
          let tempServiceList = response['data'].skills
          delete response['data'].skills
          this.viewUserProfileForm.patchValue(response['data'])
          this.updateUserProfileForm.patchValue(response['data'])
          this.driverDocumentsArr = response['data'].documents
          if (tempServiceList && tempServiceList.length) {
            tempServiceList.forEach((element) => {
              this.skillsArray.push(element.skillId)
            })
          }
          if(response['data'].otherSkill != ''  && response['data'].otherSkill != null){
            this.isOtherSkillSelected = true
            this.skillsArray.push('123456')
          }
       
          this.updateUserProfileForm.patchValue({ skills: this.skillsArray })

          for (let i = 0; i < response['data'].qualification.length; i++) {
            this.qualificationArrayView.push(response['data'].qualification[i]._id)
            this.qualificationArray.push(response['data'].qualification[i]._id)
          }

          if(response['data'].otherQualification != ''&& response['data'].otherQualification != null){
            this.isOtherSelected = true
            this.qualificationArray.push('12345')
          }
       
          this.updateUserProfileForm.controls['qualification'].setValue(this.qualificationArray)
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

  getSkillsList() {
    let data = {
      isActive: this.status ? this.status : 'true',
    }
    this._generalService.getSkillList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.skillList = res['data']
      this.skillList.push({skill:"Others",_id:"123456"})

        }
      },
      (error) => {}
    )
  }

  getQualification() {
    let data = {
      isActive: this.status ? this.status : 'true',
    }
    this._generalService.getQualification(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.qualificationList = res['data']
        this.qualificationList.push({qualification:"Others",_id:"12345"})

        }
      },
      (error) => {}
    )
  }
  selectedSkills(event) {
    this.skillsArrayView = []
    let tempSelectedService = event
    tempSelectedService.forEach((element) => {
      this.skillsArrayView.push({ skillId: element })
    })
 
    this.isOtherSkillSelected = event.includes('123456')
  }

 

  onSubmitUserProfileForm() {

    if (this.isOtherSelected && (this.updateUserProfileForm.value.otherQualification==""|| !this.updateUserProfileForm.value.otherQualification)) return this.toastr.warning('Other qualification name is required')
    if (this.isOtherSkillSelected && (this.updateUserProfileForm.value.otherSkill==""|| !this.updateUserProfileForm.value.otherSkill)) return this.toastr.warning('Other Skill name is required')
   


    if (this.updateUserProfileForm.valid) {
      this.counter = ((this.userFrmlength - 1) * 100) / this.userFrmlength
      this.updateUserProfileForm.value.proImage = this.driverImage
      // this.updateUserProfileForm.controls['userId'].setValue(this.userIdforServices)
      this.updateUserProfileForm.value.userId = this.userIdforServices
     
      this.updateUserProfileForm.value.bannerImage = this.uploadedBannerImage
      this.updateUserProfileForm.value.documentArray = this.driverDocumentsArr
      this.updateUserProfileForm.value.profileComplete = true
      this.skillsArrayView = []
      if (this.updateUserProfileForm.value.proImage || this.driverImage) {
        this.counter += 100 / this.userFrmlength
      }
      this.progressData = { value: this.counter }
      this.SharedService.setProfileProgress(this.progressData)
      let tempVar = ''
      tempVar = this.counter
      localStorage.setItem('progressBar', tempVar)
      this.SharedService.setProfileProgress(this.progressData)
      this.updateUserProfileForm.value.progressBar = this.counter
    
      if (!this.isOtherSelected) {
      //   this.updateUserProfileForm.controls['otherQualification'].patchValue('')
      this.updateUserProfileForm.value.otherQualification = ''
      }
      if (!this.isOtherSkillSelected) {
        this.updateUserProfileForm.value.otherSkill = ''
      }
      this.spinner.show()
console.log(this.updateUserProfileForm.value)

      this._generalService.updateUserProfile(this.updateUserProfileForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.spinner.hide()
            this.getUserProfileDetails()
            let userObj = JSON.parse(localStorage.getItem('truckStorage'))
            let userInfo = {}
            let UserData = {
              personName: result['data'].userResult.personName,
              image: result['data'].userResult.image,
              _id: result['data'].userResult._id,
              roleId: userObj.userInfo.roleId,
              companyId: userObj.userInfo.companyId,
              profileComplete: true,
              accessLevel: result['data'].userResult.accessLevel,
              multiRole: result['data'].userResult.multiRole,
              createdById: result['data'].userResult.createdById,
              planData: result['data'].userResult.planData,
              email:result['data'].userResult.email,
              firstName:result['data'].userResult.firstName,
              lastName:result['data'].userResult.lastName,
            }

            console.log(UserData,"UserDataUserDataUserDataUserDataUserDataUserDataUserDataUserData");
            
            localStorage.setItem('accessRole', JSON.stringify(result['data'].userResult.accessLevel))
            userInfo['userInfo'] = UserData
            this.SharedService.setHeader(UserData)
            localStorage.setItem('truckStorage', JSON.stringify(userInfo))
            this.toastr.success('', result['message'])

            if (UserData.roleId.roleTitle == 'ENDUSER' && UserData.accessLevel == 'DISPATCHER') {
              if (UserData.profileComplete) {
                this.router.navigate(['/layout/myaccount/trip-planner'])
              } else {
                this.router.navigate(['/set-profile'])
              }
            }

            if (UserData.roleId.roleTitle == 'ENDUSER' && UserData.accessLevel != 'DISPATCHER') {
              this.router.navigate(['/layout/myaccount/dashboard'])
            }
            if (UserData.roleId.roleTitle == 'ENDUSER' && UserData.accessLevel == 'SALESPERSON') {
              if (UserData.profileComplete) {
                this.router.navigate(['/layout/e-commerce/dashboard'])
              } else {
                this.router.navigate(['/set-profile'])
              }
            }
          } else {
            this.toastr.warning('', result['message'])
            this.spinner.hide()
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
          this.toastr.warning('Please upload profile image')
        }
      )
    } else {
      this._generalService.markFormGroupTouched(this.updateUserProfileForm)
    }
  }
  uploadUserProfilrImage() {
    this.spinner.show()
    const imageName = this.logoChangedEvent.target.files[0].name
    const imageBlob = this.DATAURItoBlob(this.croppedLogo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedLogo = new File([imageBlob], imageName, { type: this.logoChangedEvent.target.files[0].type })
    if (this.finalCroppedLogo != undefined) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedLogo)
      formData.append('type', 'PROFILEIMAGE')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.spinner.hide()
            this.driverImage = res['data'].imagePath
            this.finalCroppedLogo = null
            this.croppedLogo = null
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
            this.finalCroppedLogo = null
            this.spinner.hide()
          }
        },
        (error) => {
          this.spinner.hide()
        }
      )
    } else {
      this.previewUrlLogo = ''
    }
  }

  ProfileProgress(ProfileProgress: any) {
    throw new Error('Method not implemented.')
  }
  click(id) {
    document.getElementById(id).click()
  }

  uploadDriverDocument(event, type, i) {

    
    this.document_extension_array
    this.fileData = <File>event.target.files[0]
    let fileType = this.fileData.type
    if (this.document_extension_array.includes(fileType)) {
      const fd = new FormData()

      fd.append('file', this.fileData)
      this.spinner.show()
      this._generalService.driverDocs(fd).subscribe(
        (res) => {
          if (res['code'] == 200) {
            var item = this.driverDocumentsArr.find((x) => x.name == type)
            if (item) {
              this.driverDocumentsArr.splice(
                this.driverDocumentsArr.findIndex((el) => el.name === type),
                1
              )
              this.driverDocumentsArr.push({ name: type, fileName: res['data'] })
              this.driverDocs[i]['isDocs'] = res['data']
            } else {
              this.driverDocumentsArr.push({ name: type, fileName: res['data'] })
              this.driverDocs[i]['isDocs'] = res['data']
            }
            this.spinner.hide()
          } else {
            this.toastr.warning(res['message'])
            this.spinner.hide()
          }
        },
        () => {
          this.toastr.warning('Something went wrong')
        }
      )
    } else {
      this.toastr.warning('only pdf, docx file format are allowed')
    }
  }
}