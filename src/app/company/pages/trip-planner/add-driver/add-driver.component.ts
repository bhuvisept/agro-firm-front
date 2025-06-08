import { Component, OnInit, Renderer2, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { map, startWith } from 'rxjs/operators'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Router, ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
})
export class AddDriverComponent implements OnInit {
  thirdForm: FormGroup
  driverList: any = []
  anotherDriverList: any = []
  driverID: any
  anotherID: any
  selectedDriver: any
  selectedsecondDriver: any
  anotherDriverId: any
  filteredanotherDriver: any
  userId: any
  filteredDriver: any
  driver: FormControl
  anotherDriver: FormControl
  ID: any
  tripDetails: any
  userData: any
  rDriver: any
  rAnotherDriver: any
  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private service: GeneralServiceService,
    private router: Router,
    private toaster: ToastrService
  ) {
    this.driver = new FormControl()
    this.anotherDriver = new FormControl()
  }

  ngOnInit() {
    this.route.params.subscribe((res) => (this.ID = res.id))
    this.thirdForm = this.fb.group({ driver: ['', Validators.required], anotherDriver: [''] })
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userData.userInfo._id
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
    this.getDriverDetail()
    this.getDrivers()
    this.getAnotherDriver()
  }

  getDriverDetail() {
    let data = { _id: this.ID }
    this.service.getTripDetails(data).subscribe((res) => {
      if (res['data']) {
        this.tripDetails = res['data']
        this.thirdForm.patchValue(this.tripDetails)
      }
    })
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  filtereddriver(data: string) {
    return this.driverList.filter((driver) => driver['personName'] && driver['personName'].toLowerCase().indexOf(data.toLowerCase()) === 0)
  }
  filteredAnotherDriver(data: string) {
    return this.anotherDriverList.filter((driver) => driver['personName'] && driver['personName'].toLowerCase().indexOf(data.toLowerCase()) === 0)
  }

  get drivers() {
    return this.thirdForm.get('driver')
  }
  getName(driverId: string) {
    // if (!driverId) return false
    this.driverID = driverId
    this.selectDriver(driverId)
    this.getAnotherDriver()
    return this.driverList.find((driver) => driver._id === driverId).personName
  }

  getAnotherName(driverId: string) {
    // if (!driverId) return false
    this.anotherID = driverId
    this.selectedAnotherDriver(driverId)
    this.getDrivers()
    return this.anotherDriverList.find((driver) => driver._id === driverId).personName
  }
  removedDriver(e: any) {
    if (this.rDriver.length == 0) {
      this.driverID = ''
      this.selectedDriver = {}
      this.selectDriver('')
      this.getAnotherDriver()
    }
  }
  removedAnotherDriver(e: any) {
    if (this.rAnotherDriver.length == 0) {
      this.anotherID = ''
      this.selectedsecondDriver = {}
      this.selectedAnotherDriver('')
      this.getDrivers()
    }
  }
  getData(id) {
    this.thirdForm.patchValue({ driver: id })
  }
  getAnotherData(id) {
    this.thirdForm.patchValue({ anotherDriver: id })
  }

  Back() {
    this.router.navigate(['layout/myaccount/trip-planner/'])
  }

  selectDriver(driverId) {
    let data = { endUserId: driverId }
    this.spinner.show()
    this.service.getDriver(data).subscribe((res) => {
      this.selectedDriver = res['data']
      this.spinner.hide()
    })
  }

  selectedAnotherDriver(driverId) {
    this.anotherDriverId = driverId
    let data = { endUserId: driverId }
    this.spinner.show()
    this.service.getAnotherDriver(data).subscribe((res) => {
      this.selectedsecondDriver = res['data']
      this.spinner.hide()
    })
  }
  getAnotherDriver() {
    let data = {
      userId: this.userId,
      companyId: this.userData.userInfo.companyId ? this.userData.userInfo.companyId : this.userData.userInfo._id,
      selectedDriverId: this.driverID ? this.driverID : '',
      accessLevel: this.userData.userInfo.accessLevel,
    }
    this.service.getAnotherDriverByName(data).subscribe((res) => {
      this.anotherDriverList = res['data']
      this.filteredanotherDriver = this.anotherDriver.valueChanges.pipe(
        startWith(''),
        map((anotherDriver) => (anotherDriver ? this.filteredAnotherDriver(anotherDriver) : this.anotherDriverList.slice()))
      )
    })
  }

  getDrivers() {
    let data = {
      userId: this.userId,
      companyId: this.userData.userInfo.companyId ? this.userData.userInfo.companyId : this.userData.userInfo._id,
      anotherDriverId: this.anotherDriverId ? this.anotherDriverId : '',
      accessLevel: this.userData.userInfo.accessLevel,
    }
    this.service.getDriverByName(data).subscribe((res) => {
      this.driverList = res['data']
      this.filteredDriver = this.driver.valueChanges.pipe(
        startWith(''),
        map((driver) => (driver ? this.filtereddriver(driver) : this.driverList.slice()))
      )
    })
  }

  showErrorDriver() {
    if (!this.driverID || !this.thirdForm.value.driver) return this.toaster.warning('Please select driver from dropdown list')
  }
  onUpdate() {
    if (!this.driverID || !this.thirdForm.value.driver) return this.toaster.warning('Please select driver from dropdown list')
    if (!this.thirdForm.valid) return false
    let data = {
      trip_id: this.ID,
      startDate: this.tripDetails.startDate,
      truckId: this.tripDetails.truckData._id,
      driverId: this.driverID,
      anotherDriverId: this.anotherID,
      trailerId: this.tripDetails.trailerData ? this.tripDetails.trailerData._id : '',
      userName: this.userData.userInfo.personName,
      companyId: this.userData.userInfo.accessLevel == 'DISPATCHER' ? this.userData.userInfo.companyId : this.userData.userInfo._id,
      userId: this.userData.userInfo._id,
      createdById: this.userData.userInfo._id,
    }
    this.spinner.show()
    this.service.AddDriver(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.toaster.success(res['message'])
          this.router.navigate(['/layout/myaccount/trip-planner'])
        } else this.toaster.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toaster.warning('Server Error')
      }
    )
  }
}
