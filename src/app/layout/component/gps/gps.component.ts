import { element } from 'protractor';
import { Component, OnInit, Renderer2, Inject, ViewChild, ElementRef, NgZone } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import tt from '@tomtom-international/web-sdk-maps'
import { NgxSpinnerService } from 'ngx-spinner'
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms'
import moment from 'moment'
import { MapsAPILoader } from '@agm/core'
import tomtom from '@tomtom-international/web-sdk-services'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { ViewChildren, QueryList } from '@angular/core'

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.css'],
})
export class GpsComponent implements OnInit {
  map: any
  openNav: boolean = true
  tripAddress: FormGroup
  public stepHour = 1
  public stepMinute = 1
  public stepSecond = 1
  currentDate = new Date()
  startDate = moment(this.currentDate).format('YYYY-MM-DD')
  endDate = new Date(moment.utc(this.startDate).add(0, 'days').format('YYYY-MM-DD').toString())
  public maxDate: moment.Moment
  public min = this.endDate
  googleaddress: any = {}
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  @ViewChild('destination', { static: false }) searchdestinationRef: ElementRef
  @ViewChildren('destination') searchdestinationRefs: QueryList<ElementRef>

  routeColors: any = ['#4A8FE1']
  ROUTE_WIDTH: any = 5

  truckList: any[] = []
  trailerList: any[] = []
  geoCoder: google.maps.Geocoder
  Slat: any
  Slng: any
  SfullAddress: string = ''
  Dlat: any
  Dlng: any
  DfullAddress: string = ''
  hazmat: any = false
  vehicleLoadType = genralConfig.loadType
  startMrk: tt.Marker
  endMrk: tt.Marker
  userObj: any
  weight: number
  totalWidth: any
  sourcePoslat: any
  sourcePoslng: any
  destinationPoslat: any
  destinationPoslng: any
  value: any = 39.37
  totalHeight: any
  height: number
  width: number

  foreCastArray: any[]
  loader: boolean
  city: any
  state: any
  country: any
  currentWeatherResult: any
  weatherCurrentIcons: any
  currentTemp: any
  currentDay: any
  currentDesp: any
  currentWind: any
  currentWindDegree: any
  currentHumidity: any
  currentPressue: any
  currentGust: any
  currentPrecipt: any
  currentWindDir: any
  dayOneWeather: any
  totalForeCast: any
  planInfo: any
  tripPlanInfo: any
  planActive: boolean
  spareValueIdx: number
  layerArray: any[] = []
  prepArray: any
  L1: any
  spareValue: any = 'Day 1'
  operProductFilter: boolean = false
  Mrk: tt.Marker
  layerBanner: boolean = true
  isAddDestination: any = false
  tempArray: any = []
  tempArr: any = []
  groupInst1: any = []
  data: any = [
    { id: 0, name: 'Day 1' },
    { id: 1, name: 'Day 2' },
    { id: 2, name: 'Day 3' },
    { id: 3, name: 'Days 3-7' },
  ]
  isActive: boolean = false
  selectedLevel: any = 'Day 1'
  public color = 'primary'
  public showSpinners = true
  public showSeconds = false
  public touchUi = false
  public enableMeridian = false

  roleTitle: any
  userId: any
  recentTrips: any
  recentTotalCount: any
  cusIndex: number
  selectedRoute: number
  indexTags: any = []

  selectedTruck: any = {}
  selectedTrailer: any = {}

  routeArr: any[] = []
  firstRoutePopup: tt.Popup
  secondRoutePopup: tt.Popup
  features: any
  allDestination: any = []
  indexToShift: any
  newPosition: number
  indexToShift1: number
  isShowAddButton: any = true
  waypoints: any = []
  uniqueData: any = []
  markerArr: any = []
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private service: GeneralServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleTitle = JSON.parse(localStorage.getItem('truckStorage')).userInfo.roleId.roleTitle
    this.userId = JSON.parse(localStorage.getItem('truckStorage')).userInfo._id

    this.map = tt.map({
      key: genralConfig.GPSCONFIG.API_KEY,
      container: 'map',
      center: [-95.712891, 37.09024],
      style: 'https://api.tomtom.com/style/1/style/21.1.0-*?map=basic_main',
      stylesVisibility: { trafficFlow: true },
      zoom: 16,
      minZoom: 3,
    })

    this.tripAddress = this.fb.group({
      source: ['', Validators.required],
      destination: this.fb.array([this.fb.control(null)]),
      routeFlag: ['', Validators.required],
      date_Time: ['', Validators.required],
      truckId: ['', Validators.required],
      trailerId: ['', Validators.required],
      loadType: [''],
      grossWeight: ['', Validators.required],
    })

    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
    this.planInfo = this.userObj.userInfo.planData

    if (this.planInfo.length > 0) {
      let tripPlanInfo = this.planInfo.filter((planDtl) => planDtl.plan == 'WEATHER')
      this.tripPlanInfo = tripPlanInfo.length
      if (tripPlanInfo.length) {
        let tripplanConstName = tripPlanInfo[0].features.filter(function (data) {
          return data.constName == 'WEATHER'
        })

        this.planActive = true
        this.spareValueIdx = 0
        this.allOption()
        this.map.on('contextmenu', (e) => {
          this.operProductFilter = false
          this.closeNav()
          this.loader = false
          var elements = document.createElement('img')
          // elements.src = '/assets/dropLocation.gif';
          elements.style.width = '60px'
          elements.style.height = '60px'
          this.Mrk = new tt.Marker({ element: elements }).setLngLat(e.lngLat).addTo(this.map)
          setTimeout(() => {
            var url = 'https://api.weatherapi.com/v1/forecast.json?key=' + genralConfig.GPSCONFIG.WeatherApiKey + '&q=' + e.lngLat.lat + ',' + e.lngLat.lng + '&days=10&aqi=no&alerts=no'
            let weatherResponses = fetch(url).then((response) =>
              response.json().then((result) => {
                this.spinner.hide()
                this.loader = true
                this.foreCastArray = []
                this.city = result.location.name
                this.state = result.location.region
                this.country = result.location.country
                this.currentWeatherResult = result.current
                this.weatherCurrentIcons = result.current.condition.icon
                this.currentTemp = result.current.temp_f
                this.currentDay = result.current.last_updated
                this.currentDesp = result.current.condition.text
                this.currentWind = result.current.wind_mph
                this.currentWindDegree = result.current.wind_degree
                this.currentHumidity = result.current.humidity
                this.currentPressue = result.current.pressure_mb
                this.currentGust = result.current.gust_mph
                this.currentPrecipt = result.current.precip_mm
                this.currentWindDir = result.current.wind_dir
                this.dayOneWeather = result.forecast.forecastday
                this.dayOneWeather.forEach((element) => {
                  this.totalForeCast = element
                  this.foreCastArray.push(this.totalForeCast)
                })
              })
            )
          }, 2000)
        })
      }
      this.getTruckList()
      this.getTrailerList()
      this.tripAddress.patchValue({ date_Time: new Date(Date.now() + 2 * (60 * 60 * 1000)), routeFlag: 'arriveBy', grossWeight: 40000 })

      this.autosearch()
      this.autosearchdestination(1)
    }
    this.getRecentTrips()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  // !  code for add multiple destination //

  addDestination(): void {

if(this.tripAddress.value.destination.length>= 3){
     this.toastr.warning('You cannot add more than 3 destination')
     this.isAddDestination = true
}else{
  (this.tripAddress.get('destination') as FormArray).push(this.fb.control(null))
}

  }

  removeDestination(index) {
    ;(this.tripAddress.get('destination') as FormArray).removeAt(index)
    if (this.allDestination.length >= index) {
      this.allDestination.splice(index, 1)
    }

    if(this.tripAddress.value.destination.length < 3){
     this.isAddDestination = false
      
    }
  }

  getdestinationFormControls(): AbstractControl[] {
    return (<FormArray>this.tripAddress.get('destination')).controls
  }

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
    this.waypoints = []
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
    return this.tripAddress.get('destination') as FormArray
  }

  // ! End code for drag and drop //

  destination(index, dataDestination) {
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

  toggleBtn() {
    this.openNav = !this.openNav
  }

  createTripPlan() {
    if (!this.planInfo || this.planInfo.length == 0 || this.tripPlanInfo == 0) {
      const dialogRef = this.dialog.open(PlanConfirmationDialogComponent, {
        width: '550px',
        data: 'WEATHER',
      })
    } else {
      this.planActive = true
    }
  }

  getTruckList() {
    this.spinner.show()
    this.service.gpsTruckTrailer({ createdById: this.userObj.userInfo._id, vehicleType: 'TRUCK' }).subscribe((res) => {
      if (res['code'] == 200) {
        this.truckList = res['data']
        this.spinner.hide()
      } else {
        this.toastr.warning(res['message'])
        this.spinner.hide()
      }
    })
  }

  getTrailerList() {
    this.service.gpsTruckTrailer({ createdById: this.userObj.userInfo._id, vehicleType: 'TRAILER' }).subscribe((res) => {
      if (res['code'] == 200) {
        this.trailerList = res['data']
        this.spinner.hide()
      } else {
        this.toastr.warning(res['message'])
        this.spinner.hide()
      }
    })
  }

  getRecentTrips() {
    this.service.gpsRecentTrips({ createdById: this.userObj.userInfo._id, count: 6 }).subscribe((res) => {
      if (res['code'] == 200) {
        this.recentTrips = res['data']
        this.recentTotalCount = res['totalCount']
        this.tripAddress.patchValue({ truckId: res['data'][0].truckData._id })
        this.tripAddress.patchValue({ trailerId: res['data'][0].trailerData._id })
        this.selectedTruck = res['data'][0].truckData
        this.selectedTrailer = res['data'][0].trailerData
      } else {
        this.toastr.warning(res['message'])
      }
    })
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

          this.destination(index, dataDestination) // For Change Destination
        })
      })
    })
  }

  back() {
    window.history.back()
  }

  selected(e, index) {
    this.spareValue = e.target.innerText
    this.spareValueIdx = index
    this.allOption()
  }
  closeNav() {
    if (this.operProductFilter === true || this.Mrk != null) this.Mrk.remove()
    this.operProductFilter = !this.operProductFilter
  }

  allOption() {
    this.layerRemove()
    if (this.spareValue === 'Days 3-7' || this.spareValue === 'Days 8-14') {
      this.layerBanner = false
      this.tempWeatherDay37()
      this.PrepWeatherDay1()
    } else {
      this.layerBanner = true
      this.thunderWeatherDay1()
      this.freezeWeatherDay1()
      this.snowWeatherDay1()
    }
  }

  layerRemove() {
    this.layerArray.forEach((element) => this.map.removeLayer(element.id).removeSource(element.id))
    this.layerArray.length = 0
  }

  snowWeatherDay1() {
    let weatherLayer1
    if (this.spareValue === 'Day 1') {
      let data = {}
      this.spinner.show()
      this.service.getSnowDay1(data).subscribe((res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          weatherLayer1 = res['data'].features
          var i
          for (i = 0; i < weatherLayer1.length; i++) {
            this.map.addLayer({
              id: 'overlay' + i + '129',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: weatherLayer1[i].geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': weatherLayer1[i].properties.fill, 'fill-opacity': weatherLayer1[i].properties['fill-opacity'] },
            })
            this.layerArray.push({ id: 'overlay' + i + '129' })
            i++
          }
        }
      })
    }
    if (this.spareValue === 'Day 2') {
      let data = {}
      this.spinner.show()
      this.service.getSnowDay2(data).subscribe((res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          weatherLayer1 = res['data'].features
          var i
          for (i = 0; i < weatherLayer1.length; i++) {
            this.map.addLayer({
              id: 'overlay' + i + '139',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: weatherLayer1[i].geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': weatherLayer1[i].properties.fill, 'fill-opacity': weatherLayer1[i].properties['fill-opacity'], 'fill-outline-color': 'white' },
            })
            this.layerArray.push({ id: 'overlay' + i + '139' })
            i++
          }
        }
      })
    }

    if (this.spareValue === 'Day 3') {
      let data = {}
      this.spinner.show()
      this.service.getSnowDay3(data).subscribe((res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          weatherLayer1 = res['data'].features
          var i
          for (i = 0; i < weatherLayer1.length - 1; i++) {
            this.map.addLayer({
              id: 'overlay' + i + '149',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: weatherLayer1[i].geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': weatherLayer1[i].properties.fill, 'fill-opacity': weatherLayer1[i].properties['fill-opacity'], 'fill-outline-color': 'white' },
            })
            this.layerArray.push({ id: 'overlay' + i + '149' })
            i++
          }
        }
      })
    }
  }

  freezeWeatherDay1() {
    let weatherLayer1
    if (this.spareValue === 'Day 1') {
      let data = {}
      this.spinner.show()
      this.service.getfreezeDay1(data).subscribe((res) => {
        this.spinner.hide()

        weatherLayer1 = res['data'].features
        if (res['code'] == 200 && res['data'].length != 0 && weatherLayer1.length != 0 && weatherLayer1[0].geometry != null) {
          weatherLayer1.forEach((element, index) => {
            this.map.addLayer({
              id: 'overlay' + index + '159',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': '#ffcd42', 'fill-opacity': element.properties['fill-opacity'], 'fill-outline-color': 'white' },
            })
            this.layerArray.push({ id: 'overlay' + index + '159' })
          })
        } else {
        }
      })
    }
    if (this.spareValue === 'Day 2') {
      let data = {}
      this.spinner.show()
      this.service.getfreezeDay2(data).subscribe((res) => {
        this.spinner.hide()
        weatherLayer1 = res['data'].features
        if (res['code'] == 200 && res['data'].length != 0 && weatherLayer1.length != 0 && weatherLayer1[0].geometry != null) {
          weatherLayer1.forEach((element, index) => {
            this.map.addLayer({
              id: 'overlay' + index + '169',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': '#ffcd42', 'fill-opacity': element.properties['fill-opacity'], 'fill-outline-color': 'white' },
            })
            this.layerArray.push({ id: 'overlay' + index + '169' })
          })
        } else {
        }
      })
    }
    if (this.spareValue === 'Day 3') {
      let data = {}
      this.spinner.show()
      this.service.getfreezeDay3(data).subscribe((res) => {
        this.spinner.hide()
        weatherLayer1 = res['data'].features
        if (res['code'] == 200 && res['data'].length != 0 && weatherLayer1.length != 0 && weatherLayer1[0].geometry != null) {
          weatherLayer1.forEach((element, index) => {
            this.map.addLayer({
              id: 'overlay' + index + '179',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': '#ffcd42', 'fill-opacity': element.properties['fill-opacity'], 'fill-outline-color': 'white' },
            })
            this.layerArray.push({ id: 'overlay' + index + '179' })
          })
        } else {
        }
      })
    }
  }

  thunderWeatherDay1() {
    let weatherLayer1
    if (this.spareValue === 'Day 1') {
      let data = {}
      this.spinner.show()
      this.service.getthunderDay1(data).subscribe((res) => {
        this.spinner.hide()
        weatherLayer1 = res['data'].features
        if (res['code'] == 200 && res['data'].length != 0 && weatherLayer1.length != 0 && weatherLayer1[0].geometry != null) {
          weatherLayer1.forEach((element, index) => {
            this.map.addLayer({
              id: 'overlay' + index + '189',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': '#1c4fad', 'fill-opacity': 0.2 },
            })
            this.layerArray.push({ id: 'overlay' + index + '189' })
          })
        } else {
        }
      })
    }
    if (this.spareValue === 'Day 2') {
      let data = {}
      this.spinner.show()
      this.service.getthunderDay2(data).subscribe((res) => {
        this.spinner.hide()
        weatherLayer1 = res['data'].features
        if (res['code'] == 200 && weatherLayer1[0].geometry != null && res['data'].length != 0 && weatherLayer1.length != 0) {
          weatherLayer1.forEach((element, index) => {
            this.map.addLayer({
              id: 'overlay' + index + '199',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': '#1c4fad', 'fill-opacity': 0.2 },
            })
            this.layerArray.push({ id: 'overlay' + index + '199' })
          })
        } else {
        }
      })
    }
    if (this.spareValue === 'Day 3') {
      let data = {}
      this.spinner.show()
      this.service.getthunderDay3(data).subscribe((res) => {
        this.spinner.hide()
        weatherLayer1 = res['data'].features
        if (res['code'] == 200 && weatherLayer1[0].geometry != null && res['data'].length != 0 && weatherLayer1.length != 0) {
          weatherLayer1.forEach((element, index) => {
            this.map.addLayer({
              id: 'overlay' + index + '209',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
              layout: {},
              paint: { 'fill-color': '#1c4fad', 'fill-opacity': 0.2 },
            })
            this.layerArray.push({ id: 'overlay' + index + '209' })
          })
        }
      })
    }
  }
  PrepWeatherDay1() {
    let weatherLayer1
    this.prepArray = []
    if (this.spareValue == 'Days 3-7') {
      let data = {}
      var i = 0
      this.spinner.show()
      this.service.getPrepDay37(data).subscribe((res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          weatherLayer1 = res['data'].features
          for (let i = 0; i < weatherLayer1.length; i++) {
            if (weatherLayer1[i].geometry.geometries) {
              this.L1 = weatherLayer1[i].geometry.geometries
              for (let x = 0; x < this.L1.length; x++) {
                this.prepArray.push(this.L1[x])
              }
            } else if (weatherLayer1[i].geometry) {
              this.prepArray.push(weatherLayer1[i].geometry)
            }
          }
          let z = 0
          this.prepArray.forEach((element) => {
            this.map.addLayer({
              id: 'overlay' + z + '320',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.coordinates } } },
              layout: {},
              paint: { 'fill-color': '#a200ff', 'fill-opacity': 0.3 },
            })
            this.layerArray.push({ id: 'overlay' + z + '320' })
            z++
          })
        } else {
        }
      })
    }
  }

  tempWeatherDay37() {
    let weatherLayer1
    this.tempArray = []
    if (this.spareValue === 'Days 3-7') {
      let data = {}
      var i = 0
      this.spinner.show()
      this.service.getTempDay37(data).subscribe((res) => {
        this.spinner.hide()

        if (res['code'] == 200) {
          weatherLayer1 = res['data'].features
          for (let i = 0; i < weatherLayer1.length; i++) {
            if (weatherLayer1[i].geometry.geometries) {
              this.L1 = weatherLayer1[i].geometry.geometries
              for (let x = 0; x < this.L1.length; x++) {
                this.tempArray.push(this.L1[x])
              }
            } else if (weatherLayer1[i].geometry) {
              this.tempArray.push(weatherLayer1[i].geometry)
            }
          }
          let z = 0
          this.tempArray.forEach((element) => {
            this.map.addLayer({
              id: 'overlay' + z + '419',
              type: 'fill',
              source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.coordinates } } },
              layout: {},
              paint: { 'fill-color': '#ff6f00', 'fill-opacity': 0.3 },
            })
            this.layerArray.push({ id: 'overlay' + z + '419' })
            z++
          })
        } else {
        }
      })
    }
  }
  recentRoute(tripData) {
    this.tripAddress.patchValue({ source: tripData.source.address, destination: tripData.destination.address })
    this.document.getElementById('navDiv').scrollTop = 0
    this.Slat = tripData.source.location.coordinates[0]
    this.Slng = tripData.source.location.coordinates[1]
    this.SfullAddress = tripData.source.address
    this.DfullAddress = tripData.destination.address
    this.Dlat = tripData.destination.location.coordinates[0]
    this.Dlng = tripData.destination.location.coordinates[1]
    this.tripAddress.controls['truckId'].setValue(tripData.truckId)
    this.tripAddress.controls['trailerId'].setValue(tripData.trailerId)
    this.onsubmit()
  }

  getTruck() {
    this.selectedTruck = this.truckList.filter((ele) => ele._id == this.tripAddress.value.truckId)[0]
  }

  getTrailer() {
    this.selectedTrailer = this.trailerList.filter((ele) => ele._id == this.tripAddress.value.trailerId)[0]
  }
  // removeMarkerIcon(allLocation){
  //   allLocation.forEach(element => {
  //     let marker1 = new tt.Marker({element}).addTo(this.map);
  //     marker1.remove();
  //   });

  // }

  onsubmit() {
    if (!this.tripAddress.valid) return
    this.waypoints = []

    // ! for remove layes in map
    if (this.routeArr.length) {
      this.routeArr.forEach((routeId) => {
        this.map.removeLayer(routeId)
        this.map.removeSource(routeId)
      })
      // this.removeMarkerIcon(this.uniqueData)
      this.routeArr = []
      this.tempArr = []
      this.features = []
      this.removeMarker() // ! remove marker icon startPoint and EndPoint and all Destination
    }
    // ! End remove layes in map

    this.tripAddress.value.source = { location: { coordinates: [this.Slat, this.Slng] }, address: this.SfullAddress }
    // this.tripAddress.value.destination = { location: { coordinates: [this.Dlat, this.Dlng] }, address: this.DfullAddress }
    this.tripAddress.value.destination = this.allDestination
    let weightValue = 2.2046
    this.spinner.show()
    this.weight = Math.round(this.tripAddress.value.grossWeight / weightValue)
    if (this.selectedTruck.height > this.selectedTrailer.height) this.totalHeight = this.selectedTruck.height
    else this.totalHeight = this.selectedTrailer.height
    if (this.selectedTruck.width > this.selectedTrailer.width) this.totalWidth = this.selectedTruck.width
    else this.totalWidth = this.selectedTrailer.width

    // ! Create waypoints
    this.allDestination.forEach((element) => {
      this.waypoints.push({ lat: element.location.coordinates[0], lon: element.location.coordinates[1] })
    })
    this.waypoints.unshift({ lat: this.Slat, lon: this.Slng })
    // ! End  waypoints
    this.uniqueData = this.waypoints.filter((item, index) => {
      const jsonString = JSON.stringify(item)
      return index === this.waypoints.findIndex((obj) => JSON.stringify(obj) === jsonString)
    })

    this.sourcePoslat = this.tripAddress.value.source.location.coordinates[0]
    this.sourcePoslng = this.tripAddress.value.source.location.coordinates[1]

    // this.destinationPoslat = this.tripAddress.value.destination.location.coordinates[0]
    // this.destinationPoslng = this.tripAddress.value.destination.location.coordinates[1]

    this.height = Math.round(this.totalHeight / this.value)
    this.width = Math.round(this.totalWidth / this.value)

    let callParameter: any = {
      versionNumber: 1,
      contentType: 'json',
      key: genralConfig.GPSCONFIG.API_KEY,
      // locations: this.sourcePoslng + ',' + this.sourcePoslat + ':' + this.destinationPoslng + ',' + this.destinationPoslat,
      locations: this.uniqueData,
      maxAlternatives: 0,
      routeRepresentation: 'polyline',
      instructionsType: 'text',
      language: 'en-US',
      departAt: this.tripAddress.value.date_Time,
      arriveAt: this.tripAddress.value.date_Time,
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
      vehicleLoadType: this.tripAddress.value.loadType,
    }
    if (this.tripAddress.value.routeFlag == 'arriveBy') delete callParameter.departAt
    else delete callParameter.arriveAt

    tomtom.services.calculateRoute(callParameter).then(
      (response) => {
        this.spinner.hide()

        this.routeArr = []

        this.features = response.toGeoJson().features
        this.tripAddress.value.planTitle = 'GPS'
        this.tripAddress.value.constName = 'NOOFTRIPS'
        this.tripAddress.value.roleTitle = this.roleTitle
        this.tripAddress.value.createdById = this.userId
        this.tripAddress.value.companyId = this.userId

        this.indexTags = []

        this.service.gpsCreateRoute(this.tripAddress.value).subscribe((res) => res['code'] == 200 && this.getRecentTrips())
        this.features.forEach((feature, index) => {
          if (feature.geometry.type == 'LineString') {
            this.indexTags.push(index)

            this.tempArr.push('route' + index)
            if (!this.routeArr.length) {
              this.map.addLayer(
                {
                  id: 'route' + index,

                  type: 'line',

                  source: { type: 'geojson', data: feature },

                  paint: { 'line-color': this.routeColors[0], 'line-width': this.ROUTE_WIDTH },

                  layout: { 'line-cap': 'round', 'line-join': 'round' },
                },

                this.findFirstBuildingLayerId()
              )
            } else this.map.getSource('route' + index).setData(feature)

            this.map.on('click', 'route' + index, () => this.ActiveRoute(index))

            this.DefaultSelectedRoute()

            this.addMarkers(this.features[0])
          } else {
            console.log('========================== MultiLineStrinG ===========================')
            //For MultiLineStrinG

            this.indexTags.push(index)

            var coordinateLength = feature.geometry.coordinates.length

            if (!this.routeArr.length) {
              feature.geometry.coordinates.forEach((e, i) => {
                feature.geometry.type = 'LineString'

                // feature.properties.segmentSummary = [feature.properties.segmentSummary[0]]

                this.features[index].geometry.coordinates = e

                this.map.addLayer(
                  {
                    id: 'route' + i,

                    type: 'line',

                    source: { type: 'geojson', data: feature },

                    paint: { 'line-color': this.routeColors[0], 'line-width': this.ROUTE_WIDTH },

                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                  },

                  this.findFirstBuildingLayerId()
                )

                if (!this.tempArr.includes('route' + i)) {
                  this.tempArr.push('route' + i)
                }

                this.addMarkers(this.features[index], i, coordinateLength)
              })
            } else this.map.getSource('route' + index).setData(feature)

            this.map.on('click', 'route' + index, () => this.ActiveRoute(index))

            this.DefaultSelectedRoute()
          }
          // }
        })
        // this.addDistanceBox(this.features[0], 1)
        // if (this.features.length > 1) this.addDistanceBox(this.features[1], 2)
        // this.addMarkers(this.features[0])

        var bounds = new tt.LngLatBounds()
        this.features[0].geometry.coordinates.forEach((point) => bounds.extend(tt.LngLat.convert(point)))
        this.map.fitBounds(bounds, { duration: 0, padding: 50 })
        this.openNav = !this.openNav
        this.routeArr = this.tempArr
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('No Route Found')
      }
    )
  }

  ActiveRoute(data) {
    this.cusIndex = data

    this.map.setPaintProperty('route' + data, 'line-width', 8)
    this.selectedRoute = data
    this.indexTags.splice(data, 1)
    this.map.setPaintProperty('route' + data, 'line-color', '#4a90e2')
    this.indexTags.forEach((element) => {
      this.map.setPaintProperty('route' + element, 'line-color', '#4A8FE1')
      this.map.setPaintProperty('route' + element, 'line-width', this.ROUTE_WIDTH)
      this.map.moveLayer('route' + this.selectedRoute)
    })
    this.indexTags.splice(data, 0, data)
    var test = <HTMLDivElement>document.getElementById(data)
  }

  DefaultSelectedRoute() {
    var i = 0
    this.cusIndex = i
    this.map.setPaintProperty('route' + i, 'line-width', 8)
    this.selectedRoute = i
    this.indexTags.splice(i, 1)
    this.map.setPaintProperty('route' + i, 'line-color', '#4a90e2')
    this.indexTags.forEach((element) => {
      this.map.setPaintProperty('route' + element, 'line-color', '#4A8FE1')
      this.map.setPaintProperty('route' + element, 'line-width', this.ROUTE_WIDTH)
      this.map.moveLayer('route' + this.selectedRoute)
    })
    this.indexTags.splice(i, 0, i)
  }

  // addMarkers(feature) {
  //   var startPoint, endPoint
  //   if (feature.geometry.type == 'MultiLineString') {
  //     startPoint = feature.geometry.coordinates[0][0]
  //     endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0]
  //   } else {
  //     startPoint = feature.geometry.coordinates[0]
  //     endPoint = feature.geometry.coordinates.slice(-1)[0]
  //   }
  //   this.startMrk = new tt.Marker({ element: this.createMarkerElementStartPoint() }).setLngLat(startPoint).addTo(this.map)
  //   this.endMrk = new tt.Marker({ element: this.createMarkerElementendPoint() }).setLngLat(endPoint).addTo(this.map)
  // }

  addMarkers(feature, incr = 0, totalDestination = 1) {
    var startPoint, endPoint
    if (incr == 0) {
    }
    if (feature.geometry.type == 'MultiLineString') {
      startPoint = feature.geometry.coordinates[0][0]

      endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0]
    } else {
      startPoint = feature.geometry.coordinates[0]

      endPoint = feature.geometry.coordinates.slice(-1)[0]
    }

    if (incr != 0) {
      this.startMrk = new tt.Marker({ element: this.multipleDestinationMarker(incr) }).setLngLat(startPoint).addTo(this.map)
      this.markerArr.push(this.startMrk)

      if (incr == totalDestination - 1) {
        this.endMrk = new tt.Marker({ element: this.createMarkerElementendPoint() }).setLngLat(endPoint).addTo(this.map)
        this.markerArr.push(this.endMrk)

      }
    } else {
      this.startMrk = new tt.Marker({ element: this.createMarkerElementStartPoint() }).setLngLat(startPoint).addTo(this.map)
      this.markerArr.push(this.startMrk)

      if (totalDestination == 1) {
        this.endMrk = new tt.Marker({ element: this.createMarkerElementendPoint() }).setLngLat(endPoint).addTo(this.map)
        this.markerArr.push(this.endMrk)
      }
    }

    // ! Store the marker icon start , end and all destination icon in the markerArr array
  }

  // ! remove marker icon 
  removeMarker() {
    this.markerArr.forEach((marker) => {
      marker.remove()
    })
    this.markerArr = []
  }


  addDistanceBox(feature, index: number) {
    let timeInHours = feature.properties.summary.travelTimeInSeconds
    let distanceInMeter = feature.properties.summary.lengthInMeters
    var popupPoint
    if (feature.geometry.type == 'MultiLineString') popupPoint = feature.geometry.coordinates.slice(-1300)[0].slice(-2000)[0]
    else popupPoint = feature.geometry.coordinates.slice(feature.geometry.coordinates.length / 2)[0]
    index == 1
      ? (this.firstRoutePopup = new tt.Popup({ closeButton: false, closeOnClick: false })
          .setHTML(
            `<div class="text-center">${this.secondsToDhms(timeInHours)}<div class="text-center" >${this.formatAsImperialDistance(distanceInMeter)} / ${this.formatAsMetricDistance(distanceInMeter)} 
      </div></div>`
          )
          .setLngLat(popupPoint)
          .addTo(this.map))
      : (this.secondRoutePopup = new tt.Popup({ closeButton: false, closeOnClick: false })
          .setHTML(
            `<div class="text-center">${this.secondsToDhms(timeInHours)}<div class="text-center" >${this.formatAsImperialDistance(distanceInMeter)} / ${this.formatAsMetricDistance(distanceInMeter)} 
      </div></div>`
          )
          .setLngLat(popupPoint)
          .addTo(this.map))
  }

  multipleDestinationMarker(incr) {
    var element = document.createElement('img')

    element.src = '/assets/dropLocation.gif'

    element.style.width = '30px'

    element.style.height = '30px'

    element.title = this.allDestination[incr - 1].address

    return element
  }
  createMarkerElementStartPoint() {
    var element = document.createElement('img')
    element.src = '/assets/startIcon.png'
    element.style.width = '30px'
    element.style.height = '30px'
    element.title = this.tripAddress.value.source.address
    return element
  }

  createMarkerElementendPoint() {
    var element = document.createElement('img')
    element.src = '/assets/end.png'
    element.style.width = '30px'
    element.style.height = '30px'
    element.title = this.allDestination[this.allDestination.length - 1].address
    return element
  }

  findFirstBuildingLayerId() {
    var layers = this.map.getStyle().layers
    for (var index in layers) {
      if (layers[index].type === 'fill-extrusion') {
        return layers[index].id
      }
    }
  }

  secondsToDhms(seconds) {
    var hours = Math.floor(seconds / 3600)
    var minutes = Math.floor((seconds - hours * 3600) / 60)
    var sec = seconds - hours * 3600 - minutes * 60
    if (hours < 10) {
      hours = 0 + hours
    }
    if (minutes < 10) {
      minutes = 0 + minutes
    }
    if (seconds < 10) {
      seconds = 0 + seconds
    }
    return hours + 'hr' + ' ' + minutes + 'min'
  }

  formatAsMetricDistance(distanceInMeter) {
    var distance = Math.round(distanceInMeter)
    if (distance >= 1000) {
      return Math.round(distance / 10) / 100 + ' km'
    }
    return distance + ' m'
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            this.Slat = position.coords.latitude
            this.Slng = position.coords.longitude
            // this.tripAddress.patchValue({ source: 'Your Location' })
            // this.tripAddress.controls['source'].disable();
            // this.searchElementRef.nativeElement.value = "Your Loaction"
            this.getReverseGeocodingData(this.Slat, this.Slng)
          }
        },
        (error) => this.toastr.warning(error.message)
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  formatAsImperialDistance(distanceInMiles) {
    var yards = Math.round(distanceInMiles * 1.094)
    if (yards >= 1760) {
      return Math.round(yards / 17.6) / 100 + ' mi'
    }
    return yards + ' yd'
  }

  setLoadType(e) {
    this.hazmat = e.checked
    if (this.hazmat) {
      this.tripAddress.controls['loadType'].setValidators([Validators.required])
      this.tripAddress.controls['loadType'].updateValueAndValidity()
    } else {
      this.tripAddress.controls['loadType'].reset()
      this.tripAddress.get('loadType').setValidators([])
      this.tripAddress.controls['loadType'].updateValueAndValidity()
    }
  }

  getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng)
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(status)
      }
      // This is checking to see if the Geoeode Status is OK before proceeding
      if (status == google.maps.GeocoderStatus.OK) {
        var address = results[0].formatted_address

        this.tripAddress.patchValue({ source: address })
      }
    })
  }
}
