import { Component, OnInit, Renderer2, Inject, NgZone, ChangeDetectorRef } from '@angular/core'
import tt from '@tomtom-international/web-sdk-maps'
import tomtom from '@tomtom-international/web-sdk-services'
import { genralConfig } from '../../../../constant/genral-config.constant'
import { DOCUMENT } from '@angular/common'
import { FormGroup, FormBuilder } from '@angular/forms'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/takeWhile'
import { environment } from 'src/environments/environment'
import { MatDialog } from '@angular/material/dialog'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import moment from 'moment'
@Component({
  selector: 'app-live-track',
  templateUrl: './live-track.component.html',
  styleUrls: ['./live-track.component.css'],
})
export class LiveTrackComponent implements OnInit {
  map: any
  marker: any
  ID: any
  sourcePoslat: any
  sourcePoslng: any
  destinationPoslat: any
  destinationPoslng: any
  weight: any
  fuelCapacity: any
  height: any
  width: any
  alternateRoute: any
  routeColors: any = ['#4a90e2', '#a1a1a1', '#a1a1a1', '#a1a1a1', '#a1a1a1', '#a1a1a1', '#a1a1a1']
  ROUTE_WIDTH: any = 5
  serviceName: any
  image: any
  popup: tt.Popup
  tripAddress: FormGroup
  startMrk: any
  endMrk: any
  time: any
  EndDate_Time: any    // changes by shivam kashyap 06-12-2022
  tripDetail: any
  timeFlag: any
  callParameter: any
  userId: any
  popupOffset: any
  cusIndex: number
  selectedRoute: number
  loadType: any
  truckHeight: any
  truckWidth: any
  trialerWidth: any
  trialerHeight: any
  value: any = 39.37
  weightValue: any = 2.2046
  selectedLevel: any = 'Day 1'
  data: any = [
    { id: 0, name: 'Day 1' },
    { id: 1, name: 'Day 2' },
    { id: 2, name: 'Day 3' },
    { id: 3, name: 'Days 3-7' },
  ]
  spareValue: any = 'Day 1'
  layerArray: any = []
  currentWeatherResult: any
  dayOneWeather: any
  currentTemp: any
  currentDay: any
  totalForeCast: any
  foreCastArray: any = []
  currentDesp: any
  currentWind: any
  currentWindDegree: any
  currentHumidity: any
  currentPrecipt: any
  currentGust: any
  currentPressue: any
  city: any
  state: any
  country: any
  currentWindDir: any
  loader: boolean = false
  weatherCurrentIcons: any
  operProductFilter: boolean = false
  Mrk: tt.Marker
  layerBanner: boolean = true
  isActive: boolean = false
  spareValueIdx: any
  planActive: boolean = false
  planInfo: any
  tripPlanInfo: any
  planNoOfTrip: any
  prepArray: any = []
  tempArray: any = []
  L1: any
  routeArr: any[]
  indexTags: any = []
  tempArr: any = []
  markerArr: any = []
  allDestination: any =[]
  waypoints: any = []

  constructor(
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private toaster: ToastrService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private Service: GeneralServiceService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private routers: Router,
    private formGroup: FormBuilder
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }
  ngOnInit() {
    this.map = tt.map({
      key: genralConfig.GPSCONFIG.API_KEY,
      container: 'map',
      center: [-95.712891, 37.09024],
      style: 'https://api.tomtom.com/style/1/style/21.1.0-*?map=basic_main',
      stylesVisibility: { trafficFlow: true },
      zoom: 16,
      minZoom: 3,
    })
    this.map.addControl(new tt.NavigationControl())
    this.map.addControl(new tt.FullscreenControl())
    this.userId = JSON.parse(localStorage.getItem('truckStorage'))
    this.planInfo = this.userId.userInfo.planData
    if (this.planInfo.length > 0) {
      let tripPlanInfo = this.planInfo.filter((planDtl) => planDtl.plan == 'WEATHER')
      this.tripPlanInfo = tripPlanInfo.length
      if (tripPlanInfo.length) {
        let tripplanConstName = tripPlanInfo[0].features.filter((data) => {
          return data.constName == 'WEATHER'
        })
        this.planNoOfTrip = tripplanConstName[0].keyValue
        this.planActive = true
        this.spareValueIdx = 0
        this.allOption()
        this.map.on('contextmenu', (e) => {
          this.operProductFilter = false
          this.closeNav()
          this.loader = false
          var elements = document.createElement('img')
          elements.src = '/assets/dropLocation.gif'
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
    }
    this.tripAddress = this.formGroup.group({ source: [''], destination: [''] })
    window.scroll(0, 0)
    this.route.params.subscribe((res) => (this.ID = res.id))
    this.createRoute()
    this.getStopages()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
  }

  closeNav() {
    if (this.operProductFilter === true || this.Mrk != null) this.Mrk.remove()
    this.operProductFilter = !this.operProductFilter
  }
  createTripPlan() {
    if (!this.planInfo || this.planInfo.length == 0 || this.tripPlanInfo == 0) this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: 'WEATHER' })
    else this.planActive = true
  }

  selected(e, index) {
    this.spareValue = e.target.innerText
    this.spareValueIdx = index
    this.allOption()
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
      this.Service.getSnowDay1(data).subscribe(
        (res) => {
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
        },
        () => this.spinner.hide()
      )
    }
    if (this.spareValue === 'Day 2') {
      let data = {}
      this.spinner.show()
      this.Service.getSnowDay2(data).subscribe(
        (res) => {
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
        },
        () => this.spinner.hide()
      )
    }

    if (this.spareValue === 'Day 3') {
      let data = {}
      this.spinner.show()
      this.Service.getSnowDay3(data).subscribe(
        (res) => {
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
                paint: {
                  'fill-color': weatherLayer1[i].properties.fill,
                  'fill-opacity': weatherLayer1[i].properties['fill-opacity'],
                  'fill-outline-color': 'white',
                },
              })
              this.layerArray.push({ id: 'overlay' + i + '149' })
              i++
            }
          }
        },
        () => this.spinner.hide()
      )
    }
  }

  freezeWeatherDay1() {
    let weatherLayer1
    if (this.spareValue === 'Day 1') {
      let data = {}
      this.spinner.show()
      this.Service.getfreezeDay1(data).subscribe(
        (res) => {
          this.spinner.hide()
          weatherLayer1 = res['data'].features
          if (res['code'] == 200 && res['data'].length != 0 && weatherLayer1.length != 0 && weatherLayer1[0].geometry != null) {
            weatherLayer1.forEach((element, index) => {
              this.map.addLayer({
                id: 'overlay' + index + '159',
                type: 'fill',
                source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
                layout: {},
                paint: {
                  'fill-color': '#ffcd42',
                  'fill-opacity': element.properties['fill-opacity'],
                  'fill-outline-color': 'white',
                },
              })
              this.layerArray.push({ id: 'overlay' + index + '159' })
            })
          }
        },
        () => this.spinner.hide()
      )
    }
    if (this.spareValue === 'Day 2') {
      let data = {}
      this.spinner.show()
      this.Service.getfreezeDay2(data).subscribe(
        (res) => {
          this.spinner.hide()
          weatherLayer1 = res['data'].features
          if (res['code'] == 200 && res['data'].length != 0 && weatherLayer1.length != 0 && weatherLayer1[0].geometry != null) {
            weatherLayer1.forEach((element, index) => {
              this.map.addLayer({
                id: 'overlay' + index + '169',
                type: 'fill',
                source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
                layout: {},
                paint: {
                  'fill-color': '#ffcd42',
                  'fill-opacity': element.properties['fill-opacity'],
                  'fill-outline-color': 'white',
                },
              })
              this.layerArray.push({ id: 'overlay' + index + '169' })
            })
          }
        },
        () => this.spinner.hide()
      )
    }
    if (this.spareValue === 'Day 3') {
      let data = {}
      this.spinner.show()
      this.Service.getfreezeDay3(data).subscribe(
        (res) => {
          this.spinner.hide()
          weatherLayer1 = res['data'].features
          if (res['code'] == 200 && res['data'].length != 0 && weatherLayer1.length != 0 && weatherLayer1[0].geometry != null) {
            weatherLayer1.forEach((element, index) => {
              this.map.addLayer({
                id: 'overlay' + index + '179',
                type: 'fill',
                source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: element.geometry.coordinates } } },
                layout: {},
                paint: {
                  'fill-color': '#ffcd42',
                  'fill-opacity': element.properties['fill-opacity'],
                  'fill-outline-color': 'white',
                },
              })
              this.layerArray.push({ id: 'overlay' + index + '179' })
            })
          }
        },
        () => this.spinner.hide()
      )
    }
  }

  thunderWeatherDay1() {
    let weatherLayer1
    if (this.spareValue === 'Day 1') {
      let data = {}
      this.spinner.show()
      this.Service.getthunderDay1(data).subscribe(
        (res) => {
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
          }
        },
        () => this.spinner.hide()
      )
    }
    if (this.spareValue === 'Day 2') {
      let data = {}
      this.spinner.show()
      this.Service.getthunderDay2(data).subscribe(
        (res) => {
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
          }
        },
        () => this.spinner.hide()
      )
    }
    if (this.spareValue === 'Day 3') {
      let data = {}
      this.spinner.show()
      this.Service.getthunderDay3(data).subscribe(
        (res) => {
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
        },
        () => this.spinner.hide()
      )
    }
  }
  PrepWeatherDay1() {
    let weatherLayer1
    this.prepArray = []
    if (this.spareValue == 'Days 3-7') {
      let data = {}
      var i = 0
      this.spinner.show()
      this.Service.getPrepDay37(data).subscribe(
        (res) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            weatherLayer1 = res['data'].features
            for (let i = 0; i < weatherLayer1.length; i++) {
              if (weatherLayer1[i].geometry.geometries) {
                this.L1 = weatherLayer1[i].geometry.geometries
                for (let x = 0; x < this.L1.length; x++) {
                  this.prepArray.push(this.L1[x])
                }
              } else if (weatherLayer1[i].geometry) this.prepArray.push(weatherLayer1[i].geometry)
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
          }
        },
        () => this.spinner.hide()
      )
    }
  }

  tempWeatherDay37() {
    let weatherLayer1
    this.tempArray = []
    if (this.spareValue === 'Days 3-7') {
      let data = {}
      var i = 0
      this.spinner.show()
      this.Service.getTempDay37(data).subscribe((res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          weatherLayer1 = res['data'].features
          for (let i = 0; i < weatherLayer1.length; i++) {
            if (weatherLayer1[i].geometry.geometries) {
              this.L1 = weatherLayer1[i].geometry.geometries
              for (let x = 0; x < this.L1.length; x++) {
                this.tempArray.push(this.L1[x])
              }
            } else if (weatherLayer1[i].geometry) this.tempArray.push(weatherLayer1[i].geometry)
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
        }
      })
    }
  }

  getHosStoppage() {
    let data = { tripPlannerId: this.ID }
    this.Service.getHosStoppageList(data).subscribe((res) => {
      if (res['code'] == 200) {
        var stoppageArray = res['data']
        stoppageArray.forEach((element) => {
          let lat = element.latitude
          let lng = element.longitude
          var elements = document.createElement('div')
          elements.id = 'marker'
          new tt.Marker({ element: elements }).setLngLat([lng, lat]).addTo(this.map)
        })
      }
    })
  }

  getStopages() {
    this.popupOffset = { top: [0, -10], bottom: [0, -30], 'bottom-right': [0, -50], 'bottom-left': [0, -50], left: [25, -35], right: [-25, 0] }
    let data = { tripPlannerId: this.ID }
    this.Service.getStopages(data).subscribe((res) => {
      if (res['code'] == 200) {
        var stoppageArray = res['data'][0].stoppage
        stoppageArray.forEach((element, index) => {
          let lat = element.location.coordinates[0]
          let lng = element.location.coordinates[1]
          let adress = element.address
          this.serviceName = element.description
          this.image = environment.URLHOST + '/uploads/serviceIcons/' + element.image
          var elements = document.createElement('img')
          elements.src = this.image
          elements.style.width = '30px'
          elements.style.height = '30px'
          this.popup = new tt.Popup({ offset: this.popupOffset, anchor: 'top' }).setHTML(
            `<div class="row">
            <div class="col-sm-3">  
            <img  src=${this.image} height="60px"; width="60px">
            </div>
            <div class="col-sm-9">
            <div><b><u>Location</u></b></div>
            <div>${adress}</div>
            <div ><b><u>Description</u></b></div>
            <div>${this.serviceName}</div>
            </div>
            </div> `
          )
          new tt.Marker({ element: elements }).setLngLat([lng, lat]).setPopup(this.popup).addTo(this.map)
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }
  createRoute() {
    let data = { _id: this.ID }
    this.spinner.show()
    this.Service.getTripDetails(data).subscribe(async (res) => {
      if (res['code'] == 200) {
        this.tripDetail = res['data']
        this.tripAddress.patchValue({ source: res['data'].source.address, destination: res['data'].destination.address })
        this.time = res['data'].date_Time
        this.EndDate_Time = res['data'].endDate
        this.timeFlag = res['data'].routeFlag
        this.loadType = res['data'].loadType
        this.sourcePoslat = res['data'].source.location.coordinates[0]
        this.sourcePoslng = res['data'].source.location.coordinates[1]

        this.allDestination = res['data'].destination

        // this.destinationPoslat = res['data'].destination.location.coordinates[0]
        // this.destinationPoslng = res['data'].destination.location.coordinates[1]
        this.weight = Math.round(res['data'].grossWeight / this.weightValue)
        this.fuelCapacity = res['data'].truckData.fuelCapacity
        this.truckHeight = res['data'].truckData.height
        this.truckWidth = res['data'].truckData.width
        this.alternateRoute = res['data'].alternateRoots
        if (this.tripDetail.trailerData) {
          this.trialerHeight = res['data'].trailerData.height
          this.trialerWidth = res['data'].trailerData.width
          if (this.truckWidth > this.trialerWidth) this.width = Math.round(this.truckWidth / this.value)
          else this.width = Math.round(this.trialerWidth / this.value)
          if (this.truckHeight > this.trialerHeight) this.height = Math.round(this.truckHeight / this.value)
          else this.height = Math.round(this.trialerHeight / this.value)
        } else {
          this.width = Math.round(this.truckWidth / this.value)
          this.height = Math.round(this.truckHeight / this.value)
        }
      }
 
      this.allDestination.forEach((element) => {
        this.waypoints.push({ lat: element.location.coordinates[0], lon: element.location.coordinates[1] })
      })
      this.waypoints.unshift({ lat: this.sourcePoslat, lon: this.sourcePoslng })
      


      if (this.timeFlag == 'arriveBy') {
        var callParameterArrive = {
          versionNumber: 1,
          contentType: 'json',
          key: genralConfig.GPSCONFIG.API_KEY,
          // locations: this.sourcePoslng + ',' + this.sourcePoslat + ':' + this.destinationPoslng + ',' + this.destinationPoslat,
          locations: this.waypoints,
          maxAlternatives: this.alternateRoute,
          routeRepresentation: 'polyline',
          instructionsType: 'text',
          language: 'en-US',
          // arriveAt: this.time,
          arriveAt: this.EndDate_Time, //changes by  shivam kashyap 06-12-2022 
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
          vehicleLoadType: this.loadType,
        }
        this.callParameter = callParameterArrive
      } else {
        var callParameterDepart = {
          versionNumber: 1,
          contentType: 'json',
          key: genralConfig.GPSCONFIG.API_KEY,
          // locations: this.sourcePoslng + ',' + this.sourcePoslat + ':' + this.destinationPoslng + ',' + this.destinationPoslat,
          locations: this.waypoints,
          maxAlternatives: this.alternateRoute,
          routeRepresentation: 'polyline',
          instructionsType: 'text',
          language: 'en-US',
          // departAt: this.time,
          departAt:this.EndDate_Time,
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
          vehicleLoadType: this.loadType,
        }
        this.callParameter = callParameterDepart
      }
      // tomtom.services.calculateRoute(this.callParameter).then(
      //   (response) => {
      //     this.spinner.hide()
      //     var features = response.toGeoJson().features
      //     var geojson = response.toGeoJson()
      //     features.forEach((feature, index) => {
      //       this.map.addLayer(
      //         {
      //           id: 'route' + index,
      //           type: 'line',
      //           source: { type: 'geojson', data: feature },
      //           paint: { 'line-color': this.routeColors[index], 'line-width': this.ROUTE_WIDTH },
      //           layout: { 'line-cap': 'round', 'line-join': 'round' },
      //         },
      //         this.findFirstBuildingLayerId()
      //       )
      //       this.DefaultSelectedRoute()
      //       this.addMarkers(geojson.features[index])
      //     })
      //     var bounds = new tt.LngLatBounds()
      //     geojson.features[0].geometry.coordinates.forEach((point) => bounds.extend(tt.LngLat.convert(point)))
      //     this.map.fitBounds(bounds, { duration: 0, padding: 50 })
      //   },
      //   () => {
      //     this.spinner.hide()
      //     let expireDate = this.timeFlag == 'departAt' ? callParameterDepart.departAt : callParameterArrive.arriveAt
      //     alert("Your trip got expired as it's end date was " + moment(expireDate).format('MMMM Do YYYY, h:mm a') + '.')
      //     this.routers.navigate(['/layout/myaccount/trip-planner'])
      //   }
      // )
      console.log(this.callParameter)
      tomtom.services.calculateRoute(this.callParameter).then(
        (response) => {
          this.spinner.hide()
  
          this.routeArr = []
          var features = response.toGeoJson().features

          features = response.toGeoJson().features
          this.tripAddress.value.planTitle = 'GPS'
          this.tripAddress.value.constName = 'NOOFTRIPS'
          // this.tripAddress.value.roleTitle = this.roleTitle
          this.tripAddress.value.createdById = this.userId
          this.tripAddress.value.companyId = this.userId
  
          this.indexTags = []
  
          // this.Service.gpsCreateRoute(this.tripAddress.value).subscribe((res) => res['code'] == 200 && this.getRecentTrips())
          features.forEach((feature, index) => {
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
  
              // this.map.on('click', 'route' + index, () => this.ActiveRoute(index))
  
              this.DefaultSelectedRoute()
  
              this.addMarkers(features[0])
            } else {
              console.log('========================== MultiLineStrinG ===========================')
              //For MultiLineStrinG
  
              this.indexTags.push(index)
  
              var coordinateLength = feature.geometry.coordinates.length
  
              if (!this.routeArr.length) {
                feature.geometry.coordinates.forEach((e, i) => {
                  feature.geometry.type = 'LineString'
  
                  // feature.properties.segmentSummary = [feature.properties.segmentSummary[0]]
  
                  features[index].geometry.coordinates = e
  
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
  
                  this.addMarkers(features[index], i, coordinateLength)
                })
              } else this.map.getSource('route' + index).setData(feature)
  
              // this.map.on('click', 'route' + index, () => this.ActiveRoute(index))
  
              this.DefaultSelectedRoute()
            }
            // }
          })
          // this.addDistanceBox(this.features[0], 1)
          // if (this.features.length > 1) this.addDistanceBox(this.features[1], 2)
          // this.addMarkers(this.features[0])
  
          var bounds = new tt.LngLatBounds()
          features[0].geometry.coordinates.forEach((point) => bounds.extend(tt.LngLat.convert(point)))
          this.map.fitBounds(bounds, { duration: 0, padding: 50 })
        
          this.routeArr = this.tempArr
        },
        () => {
          this.spinner.hide()
          this.toaster.warning('No Route Found')
        }
      )
    })
  }

  DefaultSelectedRoute() {
    var i = 0
    this.cusIndex = i
    this.map.setPaintProperty('route' + i, 'line-width', 8)
    this.map.moveLayer('route' + this.cusIndex)
  }
  formatAsImperialDistance(distanceInMiles) {
    var yards = Math.round(distanceInMiles * 1.094)
    if (yards >= 1760) return Math.round(yards / 17.6) / 100 + ' mi'
    return yards + ' yd'
  }
  formatAsMetricDistance(distanceInMeter) {
    var distance = Math.round(distanceInMeter)
    if (distance >= 1000) return Math.round(distance / 10) / 100 + ' km'
    return distance + ' m'
  }
  // addMarkers(feature) {
  //   let timeInHours = feature.properties.summary.travelTimeInSeconds
  //   let distanceInMeter = feature.properties.summary.lengthInMeters
  //   var startPoint, endPoint, popupPoint
  //   if (feature.geometry.type == 'MultiLineString') {
  //     startPoint = feature.geometry.coordinates[0][0]
  //     endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0]
  //     popupPoint = feature.geometry.coordinates.slice(-1300)[0].slice(-2000)[0]
  //   } else {
  //     startPoint = feature.geometry.coordinates[0]
  //     endPoint = feature.geometry.coordinates.slice(-1)[0]
  //     popupPoint = feature.geometry.coordinates.slice(feature.geometry.coordinates.length / 2)[0]
  //   }
  //   this.startMrk = new tt.Marker({ element: this.createMarkerElementStartPoint() }).setLngLat(startPoint).addTo(this.map)
  //   this.endMrk = new tt.Marker({ element: this.createMarkerElementendPoint() }).setLngLat(endPoint).addTo(this.map)
  //   new tt.Popup({ closeButton: false, closeOnClick: false })
  //     .setHTML(
  //       `<div class="text-center">${this.secondsToDhms(timeInHours)}<div class="text-center" >${this.formatAsImperialDistance(distanceInMeter)} / ${this.formatAsMetricDistance(distanceInMeter)} 
  //     </div></div>`
  //     )
  //     .setLngLat(popupPoint)
  //     .addTo(this.map)
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
    element.title = this.tripAddress.value.source
    return element
  }
  // createMarkerElementendPoint() {
  //   var element = document.createElement('img')
  //   element.src = '/assets/end.png'
  //   element.style.width = '30px'
  //   element.style.height = '30px'
  //   element.title = this.tripAddress.value.destination
  //   return element
  // }
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
      if (layers[index].type === 'fill-extrusion') return layers[index].id
    }
  }
  secondsToDhms(seconds) {
    var hours = Math.floor(seconds / 3600)
    var minutes = Math.floor((seconds - hours * 3600) / 60)
    var sec = seconds - hours * 3600 - minutes * 60
    if (hours < 10) hours = 0 + hours
    if (minutes < 10) minutes = 0 + minutes
    if (seconds < 10) seconds = 0 + seconds
    return hours + 'hr' + ' ' + minutes + 'min'
  }
}
