import { Component, NgZone,ChangeDetectionStrategy, OnInit, ElementRef, ViewChild, Inject, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
// import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { FormBuilder, FormGroup,FormControl, Validators, FormArray, AbstractControl } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { Router } from '@angular/router'
import { MapsAPILoader } from '@agm/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr'
import moment from 'moment'
import { MatStepper } from '@angular/material'
import { genralConfig } from '../../../../constant/genral-config.constant'
import tomtom from '@tomtom-international/web-sdk-services'
import { environment } from 'src/environments/environment'
import { ViewChildren, QueryList } from '@angular/core'

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTripComponent implements OnInit {
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper
  map: any
  thirdForm: FormGroup
  firstForm: FormGroup
  secondForm: FormGroup
  state: string
  vehicleLoadType = genralConfig.loadType
  destinationFormControls: any[] = [];

  // Initialize destinationFormControls appropriately

  showAddDestinationButton: boolean = true;
  isLinear = true
  submitButton: boolean = false
  public showSpinners = true
  public showSeconds = false
  public touchUi = false
  public enableMeridian = false
  public maxDate: moment.Moment
  public stepHour = 1
  public stepMinute = 1
  public stepSecond = 1
  public color = 'primary'
  currentDate = new Date()
  startDate = moment(this.currentDate).format('YYYY-MM-DD')
  endDate = new Date(moment.utc(this.startDate).add(0, 'days').format('YYYY-MM-DD').toString())
  public min = this.endDate
  Slat: any
  Slng: any
  Scoordinates = []
  Dlat: any
  Dlng: any
  Dcoordinates = []
  minDate: any
  SfullAddress: string = ''
  DfullAddress: string = ''
  truckList: any = []
  driverList: any = []
  anotherDriverList: any = []
  googleaddress: any = {}
  private geoCoder
  filteredTruck: Observable<any[]>
  truckID: any
  driverID: any
  anotherID: any
  driver: FormControl
  truck: FormControl
  trailer: FormControl
  filteredDriver: Observable<any[]>
  filteredanotherDriver: Observable<any[]>
  selectedTruck: any
  selectedDriver: any
  alternateRoutes = [{ routes: 0 }, { routes: 1 }, { routes: 2 }, { routes: 3 }]
  submitted: boolean = false
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  // @ViewChild('destination', { static: false }) searchdestinationRef: ElementRef
  @ViewChild('destination', { static: false }) searchdestinationRef: ElementRef
  @ViewChildren('destination') searchdestinationRefs: QueryList<ElementRef>

  HOS: any = false
  filteredTrailer: Observable<any>
  trailerList: any
  trailerID: string
  selectedTrailer: any
  ID: any
  userId: any
  userData: any
  selectedsecondDriver: any
  anotherDriver: FormControl
  anotherDriverId: any
  brand: any
  truckWeight: any
  Data: any
  userRoleName: any
  hazmat: boolean = false
  truckDetails: any
  tripDetails: any
  trailerDetails: any
  timeFlag: any
  time: any
  totalHeight: any
  totalWidth: any
  sourcePoslat: any
  sourcePoslng: any
  destinationPoslat: any
  destinationPoslng: any
  weight: number
  value: any = 39.37
  weightValue: any = 2.2046
  height: number
  width: number
  alternateRoute: any
  callParameter: any
  departTime: string
  arriveTime: string
  roleTitle: any
  companyId: any
  rDriver: any
  rAnotherDriver: any
  error: any
  public postProfile = environment.URLHOST + '/uploads/enduser/'
  allDestination: any = []
  indexToShift1: number
  indexToShift: number
  isAddDestination: any = false
  waypoints: any = []
  brandsName: any

  constructor(
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {
    this.driver = new FormControl()
    this.truck = new FormControl()
    this.anotherDriver = new FormControl()
    this.trailer = new FormControl()
  }

  ngOnInit() {
    this.thirdForm = this.fb.group({ driver: ['', Validators.required], anotherDriver: [''] })
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.userRoleName = this.userData.userInfo.accessLevel
    this.roleTitle = JSON.parse(localStorage.getItem('truckStorage')).userInfo.roleId.roleTitle
    this.companyId = JSON.parse(localStorage.getItem('truckStorage')).userInfo.companyId
    if (!this.userData) this.service.logout()
    else {
      this.userId = this.userData.userInfo._id
      this.secondForm = this.fb.group({
        date_Time: ['', Validators.required],
        trailer: [''],
        source: ['', Validators.required],
        routeFlag: [''],
        destination: this.fb.array([this.fb.control('')]),
        alternateRoots: [''],
        hoursOfServices: [''],
        loadType: [''],
        grossWeight: [''],
        loadNumber: ['', Validators.required],
      })
      this.getTrucks()
      this.getDrivers()
      this.getAnotherDriver()
      this.autosearch()
      // this.autosearchdestination()
      this.getTrailers()
      this.minDate = new Date().toISOString().slice(0, 10)
      this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
      window.scroll(0, 0)
      this.secondForm.patchValue({ alternateRoots: 0, routeFlag: 'arriveBy' })
      this.firstForm = this.fb.group({ truck: ['', Validators.required] })
    }
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  // !  code for add multiple destination //


  addDestination(): void {
    if(this.secondForm.value.destination.length>= 3){
      this.toastr.warning('You cannot add more than 3 destination')
      this.isAddDestination = true
 }else{

   
   (this.secondForm.get('destination') as FormArray).push(this.fb.control(''))
  //  console.log((this.secondForm.get('destination') as FormArray).push(this.fb.control('')))

   console.log(this.secondForm.get('destination'))

 }
  }

  removeDestination(index) {
    (this.secondForm.get('destination') as FormArray).removeAt(index)
    if (this.allDestination.length >= index) {
      this.allDestination.splice(index, 1)
    }

    if(this.secondForm.value.destination.length < 3){
      this.isAddDestination = false
     }
  }

  getdestinationFormControls(): AbstractControl[] {
    return (<FormArray>this.secondForm.get('destination')).controls
  }

  // !  code  End for add multiple destination //

  // ! code for drag and drop //

  onDragStart(event: DragEvent, index: number) {
    this.indexToShift = index
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', index.toString())
    }
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault()
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault()

    this.indexToShift1 = index
    if (event.dataTransfer) {
      const draggedIndex = +event.dataTransfer.getData('text/plain')
      const destinationFormControls = this.destinationFormArray.controls
      const draggedControl = destinationFormControls[draggedIndex]

      // Remove the dragged control from its original position
      destinationFormControls.splice(draggedIndex, 1)

      // Insert the dragged control at the new index
      destinationFormControls.splice(index, 0, draggedControl)
      this.destinationLatLng()
    }
  }

  get destinationFormArray(): FormArray {
    return this.secondForm.get('destination') as FormArray
  }

  // ! End code for drag and drop //


// ! For create destination
  AddDestination(index, dataDestination) {


    if (index >= 0 && index < this.allDestination.length) {
      this.allDestination.splice(index, 1, dataDestination)
    } else {
      this.allDestination.push(dataDestination)
    }
  }
  destinationLatLng() {
    const element = this.allDestination.splice(this.indexToShift, 1)[0]
    // const element1 = this.allDestination.splice(this.indexToShift1, 1)[0]; // Remove the element at the given index
    this.allDestination.splice(this.indexToShift1, 0, element)
    // this.allDestination.splice(this.indexToShift, 0, element1);
    
  }



  setWalkInDetails(event) {
    this.hazmat = event.checked
    if (this.hazmat == false) this.secondForm.value.loadType = ''
  }
  skipDriver(event) {
    this.submitButton = event.checked
  }
  filteredtruck(data: string) {
    return this.truckList.filter((truck) => truck.name.toLowerCase().indexOf(data.toLowerCase()) === 0)
  }
  filteredtrailer(data: string) {
    return this.trailerList.filter((trailer) => trailer.trailerType.toLowerCase().indexOf(data.toLowerCase()) === 0)
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
  get trucks() {
    return this.firstForm.get('truck')
  }
  get source() {
    return this.secondForm.get('source')
  }
  get date_Time() {
    return this.secondForm.get('date_Time')
  }
  get destination() {
    return this.secondForm.get('destination')
  }



  get alternateRoots() {
    return this.secondForm.get('alternateRoots')
  }
  getTitile(truckId: string) {
    if (!truckId) return
    this.truckID = truckId
    this.selectTruck(truckId)
    return this.truckList.find((truck) => truck._id === truckId).name
  }
  getTrailer(trailerId: string) {
    if (!trailerId) return
    this.trailerID = trailerId
    this.selectTrailer(trailerId)
    return this.trailerList.find((trailer) => trailer._id === trailerId).name
  }
  getName(driverId: string) {
    // if (!driverId) return
    this.driverID = driverId
    this.selectDriver(driverId)
    this.getAnotherDriver()
    return this.driverList.find((driver) => driver._id === driverId).personName
  }
  removeDataForTruck() {
    this.firstForm.controls['truck'].reset()
    this.selectedTruck = ' '
    this.brand = ''
    this.brandsName = ''
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
  removeDataForTrailer() {
    localStorage.removeItem('trailer_Data')
    this.secondForm.controls['trailer'].reset()
    this.selectedTrailer = ' '
    this.trailerID = ''
    this.selectTrailer('')
  }
  nextTab(stepper: MatStepper) {
    stepper.next()
  }
  getAnotherName(driverId: string) {
    // if (!driverId) return false
    this.anotherID = driverId
    this.selectedAnotherDriver(driverId)
    this.getDrivers()
    return this.anotherDriverList.find((driver) => driver._id === driverId).personName
  }

  getTrucks() {
    let data = {
      roleName: this.userRoleName,
      companyId: this.userData.userInfo.companyId ? this.userData.userInfo.companyId : this.userData.userInfo._id,
      userId: this.userId,
      isActive: 'true',
      isDeleted: 'false',
      vehicleType: 'TRUCK',
    }
    this.service.getTrucks(data).subscribe((res) => {
      this.truckList = res['data']
      this.filteredTruck = this.truck.valueChanges.pipe(
        startWith(''),
        map((truck) => (truck ? this.filteredtruck(truck) : this.truckList.slice()))
      )
    })
  }
  getTrailers() {
    let data = {
      roleName: this.userRoleName,
      companyId: this.userData.userInfo.companyId ? this.userData.userInfo.companyId : this.userData.userInfo._id,
      userId: this.userId,
      isActive: 'true',
      isDeleted: 'false',
      vehicleType: 'TRAILER',
    }
    this.service.getTrucks(data).subscribe((res) => {
      this.trailerList = res['data']
      this.filteredTrailer = this.trailer.valueChanges.pipe(
        startWith(''),
        map((trailer) => (trailer ? this.filteredtrailer(trailer) : this.trailerList.slice()))
      )
    })
  }

  selectTruck(truckId) {
    let data = { _id: truckId }
    this.spinner.show()
    this.service.oneTruck(data).subscribe((res) => {
      this.selectedTruck = res['data']
      if(this.selectedTruck.brandName == null ){
   this.brandsName = this.selectedTruck.brand.name
      }else{
   this.brandsName = this.selectedTruck.brandName

      }
      let truckData = { truckWeight: this.selectedTruck.weight, truckHeight: this.selectedTruck.height, truckWidth: this.selectedTruck.width }
      localStorage.setItem('truck_Data', JSON.stringify(truckData))
      this.truckWeight = this.selectedTruck.weight
      this.brand = this.selectedTruck.brand.name
      this.spinner.hide()
    })
  }
  selectTrailer(trailerId) {
    if (trailerId == '') return
    let data = { _id: trailerId }
    this.spinner.show()
    this.service.oneTruck(data).subscribe((res) => {
      this.selectedTrailer = res['data']
      let trailerData = { trailerWeight: this.selectedTrailer.weight, trailerHeight: this.selectedTrailer.height, trailerWidth: this.selectedTrailer.width }
      localStorage.setItem('trailer_Data', JSON.stringify(trailerData))
      this.spinner.hide()
    })
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
  Back() {
    this.router.navigate(['layout/myaccount/trip-planner'])
  }

  autosearch() {
    this.mapsAPILoader.load().then(() => {
      var options = { componentRestrictions: { country: ['us', 'mx', 'ca'] } }
      this.geoCoder = new google.maps.Geocoder()
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options)
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace()
          if (place.geometry === undefined || place.geometry === null) return
          this.googleaddress.lat = place.geometry.location.lat()
          this.googleaddress.lng = place.geometry.location.lng()
          this.googleaddress.fullAddress = place.formatted_address
          this.Slat = this.googleaddress.lat
          this.Slng = this.googleaddress.lng
          this.SfullAddress = this.googleaddress.fullAddress
        })
      })
    })
  }
  // autosearchdestination() {
  //   this.mapsAPILoader.load().then(() => {
  //     var options = { componentRestrictions: { country: ['us', 'mx', 'ca'] } }
  //     this.geoCoder = new google.maps.Geocoder()
  //     let autocomplete = new google.maps.places.Autocomplete(this.searchdestinationRef.nativeElement, options)
  //     autocomplete.addListener('place_changed', () => {
  //       this.ngZone.run(() => {
  //         let place: google.maps.places.PlaceResult = autocomplete.getPlace()
  //         if (place.geometry === undefined || place.geometry === null) return
  //         this.googleaddress.lat = place.geometry.location.lat()
  //         this.googleaddress.lng = place.geometry.location.lng()
  //         this.googleaddress.fullAddress = place.formatted_address
  //         this.Dlat = this.googleaddress.lat
  //         this.Dlng = this.googleaddress.lng
  //         this.DfullAddress = this.googleaddress.fullAddress
  //       })
  //     })
  //   })
  // }

  autosearchdestination(index: number) {
    const searchDestinationRef = this.searchdestinationRefs.toArray()[index]
    this.mapsAPILoader.load().then(() => {
      var options = { componentRestrictions: { country: ['us', 'mx', 'ca'] } }
      this.geoCoder = new google.maps.Geocoder()
      let autocomplete = new google.maps.places.Autocomplete(searchDestinationRef.nativeElement, options)
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace()
          if (place.geometry === undefined || place.geometry === null) return
          this.googleaddress.lat = place.geometry.location.lat()
          this.googleaddress.lng = place.geometry.location.lng()
          this.googleaddress.fullAddress = place.formatted_address
          this.Dlat = this.googleaddress.lat
          this.Dlng = this.googleaddress.lng
          this.DfullAddress = this.googleaddress.fullAddress
          const dataDestination = { location: { coordinates: [this.Dlat, this.Dlng] }, address: this.DfullAddress }
          
          this.AddDestination(index, dataDestination) // For Change Destination
        })
      })
    })
  }
  Hos(event) {
    this.HOS = event.checked
  }
  viewMapFun() {
    if (this.secondForm.valid) {
      if (!this.SfullAddress) return this.toastr.warning('Select source from dropdown')
      // if (!this.DfullAddress) return this.toastr.warning('Select destination from dropdown')
      // if (this.SfullAddress == this.DfullAddress) return this.toastr.warning('Source and destination cannot be same')
      if (this.hazmat == true) if (this.secondForm.value.loadType == '') return this.toastr.warning('', 'Please select loadType')

      this.Dcoordinates.splice(0, this.Dcoordinates.length, this.Dlat, this.Dlng)
      this.Scoordinates.splice(0, this.Dcoordinates.length, this.Slat, this.Slng)
      let data = {
        routeFlag: this.secondForm.value.routeFlag ? this.secondForm.value.routeFlag : 'arriveBy',
        source: { location: { coordinates: this.Scoordinates }, address: this.SfullAddress },
        date_Time: new Date(this.secondForm.value.date_Time.getTime() + 2 * 60000),
        destination:this.allDestination,
        alternateRoots: this.secondForm.value.alternateRoots,
        loadType: this.secondForm.value.loadType ? this.secondForm.value.loadType : '',
        grossWeight: this.secondForm.value.grossWeight,
        loadNumber: this.secondForm.value.loadNumber,
      }
      this.Data = data
      localStorage.setItem('view_Info', JSON.stringify(data))
    }
  }

  onSubmit() {
    
    if (!this.driverID || !this.thirdForm.value.driver) return this.toastr.warning('Please select driver from dropdown list')
    if (this.error) return this.toastr.warning('No Route Found')
    if (this.thirdForm.valid && this.secondForm.valid) {
      this.submitted = true
      let data = {
        driverId: this.driverID,
        truckId: this.truckID,
        routeFlag: this.secondForm.value.routeFlag ? this.secondForm.value.routeFlag : 'arriveBy',
        // createdById: JSON.parse(localStorage.getItem('truckStorage')).userInfo._id,
        createdById: this.userData.userInfo._id ,   // 06/12/2022 shivam kashyap
        companyId: this.userData.userInfo.createdById ? this.userData.userInfo.createdById : this.userData.userInfo._id,
        source: { location: { coordinates: this.Scoordinates }, address: this.SfullAddress },
        date_Time: new Date(this.secondForm.value.date_Time.getTime() + 2 * 60000),
        startDate: moment(this.departTime).utc(),
        endDate: moment(this.arriveTime).utc(),
        // destination: { location: { coordinates: this.Dcoordinates }, address: this.DfullAddress },
        destination:this.allDestination,
        alternateRoots: this.secondForm.value.alternateRoots,
        loadType: this.secondForm.value.loadType ? this.secondForm.value.loadType : '',
        grossWeight: this.secondForm.value.grossWeight,
        hoursOfServices: this.HOS,
        loadNumber: this.secondForm.value.loadNumber,
        anotherDriverId: this.anotherID,
        trailerId: this.trailerID,
        userName: this.userData.userInfo.personName,
        userId: JSON.parse(localStorage.getItem('truckStorage')).userInfo._id,
      }

      this.spinner.show()
      data['planTitle'] = 'TRIPPLAN'
      data['constName'] = 'NOOFTRIPS'
      data['roleTitle'] = this.roleTitle
      this.service.createTrip(data).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.toastr.success(res['message'])
            this.router.navigate(['/layout/myaccount/trip-planner'])
          } else this.toastr.warning(res['message'])
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('Something went wrong')
        }
      )
    }
  }

  async withoutDriverSubmit() {
    if (this.secondForm.valid) {
      this.viewMapFun()
      if (!this.SfullAddress) return this.toastr.warning('Select source from dropdown')
      if (!this.DfullAddress) return this.toastr.warning('Select destination from dropdown')
      if (this.SfullAddress == this.DfullAddress) return this.toastr.warning('Source and destination cannot be same')
      if (this.hazmat == true) if (this.secondForm.value.loadType == '') return this.toastr.warning('', 'Please select loadType')
      if (this.error) return this.toastr.warning('No Route Found')
      await this.createRoute()
      this.submitted = true
      
      let data = {
        truckId: this.truckID,
        routeFlag: this.secondForm.value.routeFlag ? this.secondForm.value.routeFlag : 'arriveBy',
        // createdById: JSON.parse(localStorage.getItem('truckStorage')).userInfo._id,
        createdById:this.userData.userInfo._id,
        companyId: this.userData.userInfo.createdById ? this.userData.userInfo.createdById : this.userData.userInfo._id,
        source: { location: { coordinates: this.Scoordinates }, address: this.SfullAddress },
        date_Time: new Date(this.secondForm.value.date_Time.getTime() + 2 * 60000),
        startDate: this.departTime,
        endDate: this.arriveTime,
        destination:this.allDestination,
        alternateRoots: this.secondForm.value.alternateRoots,
        loadType: this.secondForm.value.loadType ? this.secondForm.value.loadType : '',
        grossWeight: this.secondForm.value.grossWeight,
        hoursOfServices: this.HOS,
        loadNumber: this.secondForm.value.loadNumber,
        trailerId: this.trailerID,
        runningStatus: 'UNASSINGED',
      }
      data['planTitle'] = 'TRIPPLAN'
      data['constName'] = 'NOOFTRIPS'
      data['roleTitle'] = this.roleTitle
      if (data.routeFlag == 'arriveBy') if (data.date_Time < new Date()) return this.toastr.warning('Provided time cannot be in the past.')
      this.spinner.show()
      this.service.createTripWithoutDriver(data).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.toastr.success(res['message'])
            this.router.navigate(['/layout/myaccount/trip-planner'])
          } else this.toastr.warning(res['message'])
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('Something went wrong')
        }
      )
    }
  }
  getData(id) {
    this.thirdForm.patchValue({ driver: id })
  }
  getAnotherData(id) {
    this.thirdForm.patchValue({ anotherDriver: id })
  }

  getTruckData(id) {
    this.firstForm.patchValue({ truck: id })
  }
  getTrailerData(id) {
    this.secondForm.patchValue({ trailer: id })
  }
  showErrorDriver() {
    if (!this.driverID || !this.thirdForm.value.driver) this.toastr.warning('Please select driver from dropdown list')
  }
  showErrorTruck() {
    if (!this.truckID || !this.firstForm.value.truck) this.toastr.warning('Please select truck from dropdown list')
  }
  showErrorTrailer() {
    if (this.secondForm.valid) {
      if (this.secondForm.value.routeFlag == 'arriveBy')
        if (new Date(this.secondForm.value.date_Time.getTime() + 2 * 60000) < new Date()) return this.toastr.warning('Provided time cannot be in the past.')
      if (!this.SfullAddress) return this.toastr.warning('Select source from dropdown')
      if (!this.DfullAddress) return this.toastr.warning('Select destination from dropdown')
      if (this.SfullAddress == this.DfullAddress) return this.toastr.warning('Source and destination cannot be same')
      this.myStepper.next()
      this.viewMapFun()
      this.createRoute()
    }
  }
  nameReq(e) {
    if (e.checked) {
      this.secondForm.controls['loadType'].setValidators([Validators.required])
      this.secondForm.controls['loadType'].updateValueAndValidity()
    } else {
      this.secondForm.controls['loadType'].reset()
      this.secondForm.get('loadType').setValidators([])
      this.secondForm.controls['loadType'].updateValueAndValidity()
    }
  }

  async createRoute() {
    this.spinner.show()
    this.truckDetails = JSON.parse(localStorage.getItem('truck_Data'))
    this.trailerDetails = JSON.parse(localStorage.getItem('trailer_Data'))
    this.tripDetails = JSON.parse(localStorage.getItem('view_Info'))
    this.time = new Date(this.secondForm.value.date_Time.getTime() + 2 * 60000)
    this.timeFlag = this.tripDetails.routeFlag
    if (this.trailerDetails) {
      if (this.truckDetails.truckHeight > this.trailerDetails.trailerHeight) this.totalHeight = this.truckDetails.truckHeight
      else this.totalHeight = this.trailerDetails.trailerHeight
      if (this.truckDetails.truckWidth > this.trailerDetails.trailerWidth) this.totalWidth = this.truckDetails.truckWidth
      else this.totalWidth = this.trailerDetails.trailerWidth
    } else {
      this.totalHeight = this.truckDetails.truckHeight
      this.totalWidth = this.truckDetails.truckWidth
    }
    this.weight = Math.round(this.tripDetails.grossWeight / this.weightValue)
    this.sourcePoslat = this.tripDetails.source.location.coordinates[0]
    this.sourcePoslng = this.tripDetails.source.location.coordinates[1]
    // this.destinationPoslat = this.tripDetails.destination.location.coordinates[0]
    // this.destinationPoslng = this.tripDetails.destination.location.coordinates[1]
    this.height = Math.round(this.totalHeight / this.value)
    this.width = Math.round(this.totalWidth / this.value)
    this.alternateRoute = this.tripDetails.alternateRoots


    this.tripDetails.destination.forEach((element) => {
      this.waypoints.push({ lat: element.location.coordinates[0], lon: element.location.coordinates[1] })
    })
    this.waypoints.unshift({ lat: this.sourcePoslat, lon: this.sourcePoslng })


    if (this.timeFlag == 'arriveBy') {
      var callParameterArrive = {
        versionNumber: 1,
        contentType: 'json',
        key: genralConfig.GPSCONFIG.API_KEY,
        locations: this.waypoints,
        routeRepresentation: 'polyline',
        instructionsType: 'text',
        language: 'en-US',
        arriveAt: this.time,
        travelMode: 'truck',
        sectionType: 'travelMode',
        routeType: 'eco',
        traffic: true,
        avoid: 'unpavedRoads',
        vehicleCommercial: true,
        vehicleEngineType: 'combustion',
        vehicleWeight: this.weight,
        vehicleWidth: this.width,
        vehicleHeight: this.height,
        vehicleLoadType: this.tripDetails.loadType,
      }
      this.callParameter = callParameterArrive
    } else {
      var callParameterDepart = {
        versionNumber: 1,
        contentType: 'json',
        key: genralConfig.GPSCONFIG.API_KEY,
        locations: this.waypoints,
        routeRepresentation: 'polyline',
        instructionsType: 'text',
        language: 'en-US',
        departAt: this.time,
        travelMode: 'truck',
        sectionType: 'travelMode',
        routeType: 'eco',
        traffic: true,
        avoid: 'unpavedRoads',
        vehicleCommercial: true,
        vehicleEngineType: 'combustion',
        vehicleWeight: this.weight,
        vehicleWidth: this.width,
        vehicleHeight: this.height,
        vehicleLoadType: this.tripDetails.loadType,
      }
      this.callParameter = callParameterDepart
    }
    await tomtom.services.calculateRoute(this.callParameter).then(
      (response) => {
        this.spinner.hide()
        this.error = null
        this.departTime = response.toGeoJson().features[0].properties.summary.departureTime
        this.arriveTime = response.toGeoJson().features[0].properties.summary.arrivalTime
      },
      (error) => {
        this.spinner.hide()
        this.error = error['data'].code
        return false
      }
    )
  }
}
