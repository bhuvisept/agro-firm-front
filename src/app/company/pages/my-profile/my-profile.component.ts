import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material'
import { CompanyLeftComponent } from '../company-left/company-left.component'
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component'
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  providers: [NgxSpinnerService],
})
export class MyProfileComponent implements OnInit {
  @ViewChild('AddressSearch', { static: false }) searchElementRef: ElementRef
  editCompanyProfileForm: FormGroup
  viewUserProfileForm: FormGroup
  updateUserProfileForm: FormGroup
  isLinear = true
  secondFormGroup: FormGroup
  roleName: any
  userObj: any
  countryList: any
  countryId: String
  stateList: any
  status: String
  public image_url_profile = environment.URLHOST + '/uploads/company/banner/'
  public logo_url_profile = environment.URLHOST + '/uploads/company/'
  public image_enduser_profile = environment.URLHOST + '/uploads/enduser/'
  public docs = environment.URLHOST + '/uploads/docs/'
  bannerImage: any
  companyLogo: any
  serviceList: any
  private sub: any
  uploadedCompanyLogo: any
  servicesArray: any = []
  qualificationList: any
  skillList: any
  skillsArrayView: any = []
  skillsArray: any = []
  qualificationArrayView: any = []
  qualificationArray: any = []
  userProfileLogo: any
  proImage: any
  userIdforServices: any
  aboutDetails: any
  genderList = genralConfig.gender
  maritalStatus = genralConfig.maritalStatus
  public experience = genralConfig.experience
  language = genralConfig.language
  acceLevel: any
  companyName: any
  companyId: any
  CompanyData: any
  UserData: any
  driverDocs: any = []

  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (!this.userObj && !this.userObj.userInfo._id) this._generalService.logout()
    this.userIdforServices = this.userObj.userInfo._id
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.acceLevel = this.userObj.userInfo.accessLevel
   

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
      this.getService()
    } else if (this.roleName == genralConfig.rolename.ENDUSER) {
      this.viewUserProfileForm = this.formbuilder.group({
        firstName: [{ value: '', disabled: true }],
        lastName: [{ value: '', disabled: true }],
        email: [{ value: '', disabled: true }],
        mobileNumber: [{ value: '', disabled: true }],
        gender: [{ value: '', disabled: true }],
        dateOfBirth: [{ value: '', disabled: true }],
        experience: [{ value: '', disabled: true }],
        maritalStatus: [{ value: '', disabled: true }],
        skillsView: [{ value: '', disabled: true }],
        qualificationView: [{ value: '', disabled: true }],
        language: [{ value: '', disabled: true }],
        workPlace: [{ value: '', disabled: true }],
        designation: [{ value: '', disabled: true }],
        corrAddress: [{ value: '', disabled: true }],
        permAddress: [{ value: '', disabled: true }],
        roleTitle: genralConfig.rolename.ENDUSER,
      })
      this.getUserProfileDetails()
      this.getQualification()
      this.getSkillsList()
    }
    this.getCountry()
  }

  getService() {
    let data = { isActive: this.status ? this.status : 'true', _id: this.userIdforServices }
    this._generalService.getServicesList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.serviceList = res['data']
        this.servicesArray.serviceName
      }
    })
  }
  redirectPost() {
    this.router.navigate([`/layout/social-media/connection-profileview/${this.userObj.userInfo._id}`])
  }
  selectedServices(event) {
    this.servicesArray = []
    let tempSelectedService = event
    tempSelectedService.forEach((element) => this.servicesArray.push({ serviceId: element }))
  }

  getCompany() {
    let data = { companyId: this.userObj.userInfo._id }
    this.spinner.show()
    this._generalService.getCompanyDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.companyLogo = response['data'].companyLogo
          this.bannerImage = response['data'].bannerImage
          this.CompanyData = response['data']
          this.editCompanyProfileForm.patchValue(response['data'])
          this.getState(response['data'].country)
          this.aboutDetails = response.data.aboutCompany
        } else this.toastr.warning('', response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Something went wrong')
      }
    )
  }
  userId(arg0: string, userId: any) {
    throw new Error('Method not implemented.')
  }
  getCountry() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getCountryList(data).subscribe((res) => res['code'] == 200 && (this.countryList = res['data']))
  }

  getselectval(val) {
    this.countryId = val
    if (this.countryId) this.getState(this.countryId)
  }
  getState(countryId) {
    this._generalService.getStateList({ countryId: countryId, isActive: 'true' }).subscribe((res) => res['code'] == 200 && (this.stateList = res['data']))
  }
  showUpdateForm() {
    this.router.navigate(['/layout/myaccount/edit-profile'])
  }
  getUserProfileDetails() {
    let data = { endUserId: this.userObj.userInfo._id }
    this.spinner.show()
    this._generalService.getEndUserDetails(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.userProfileLogo = response['data'].image
        this.bannerImage = response['data'].bannerImage
        this.viewUserProfileForm.patchValue(response['data'])
        this.UserData = response['data']
        if(this.UserData.otherQualification !=null && this.UserData.otherQualification !='' ){
          this.UserData.qualification.push({_id:'12345',qualification:'Others'})
        }
        
        this.driverDocs = response['data'].documents
        for (let i = 0; i < response['data'].qualification.length; i++) {
          this.qualificationArrayView.push(response['data'].qualification[i]._id)
          this.qualificationArray.push(response['data'].qualification[i]._id)
        }
        this.viewUserProfileForm.controls['qualificationView'].setValue(this.qualificationArrayView)
        for (let i = 0; i < response['data'].skillData.length; i++) {
          this.skillsArrayView.push(response['data'].skillData[i]._id)
          this.skillsArray.push(response['data'].skillData[i]._id)
        }
        this.viewUserProfileForm.controls['skillsView'].setValue(this.skillsArrayView)
        this.proImage = response['data'].proImage
        this.viewUserProfileForm.patchValue(response['data'])
        this.companyName = response['data'].companyName
        this.companyId = response['data'].createdById
      } else this.toastr.warning('', response['message'])
      this.spinner.hide()
    })
  }

  getSkillsList() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getSkillList(data).subscribe((res) => res['code'] == 200 && (this.skillList = res['data']))
  }

  getQualification() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getQualification(data).subscribe(
      (res) => res['code'] == 200 && (this.qualificationList = res['data']),
      () => this.toastr.warning('Server Error')
    )
  }

  leaveCompany() {
    this.dialog.open(CompanyLeftComponent, {
      width: '450px',
      data: { companyId: this.companyId, userId: this.userIdforServices, accessLevel: this.acceLevel, userName: this.userObj.userInfo.personName },
    })
  }

  delete(id, name, i) {
    let data = { documentId: id, file: name, userId: this.userObj.userInfo._id }
    this.spinner.show()
    this._generalService.deleteDriverDocs(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.driverDocs.splice(i, 1)
        this.toastr.success(res['message'])
      } else this.toastr.warning(res['message'])
      this.spinner.hide()
    })
  }

  deleteAccount() {
    this.dialog
      .open(ConfirmationDialogComponent, { data: 'Are you sure want to delete your account' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this._generalService.deleteAccount({ id: this.userObj.userInfo._id }).subscribe((res) => {
            if (res['code'] == 200) {
              this.toastr.success('Account deleted successfully')
              localStorage.removeItem('userToken')
              localStorage.removeItem('truckStorage')
              localStorage.removeItem('planName')
              this.router.navigate(['/login'])
            }
          })
        }
      })
  }
}
