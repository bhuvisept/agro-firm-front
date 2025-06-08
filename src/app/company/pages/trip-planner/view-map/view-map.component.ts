import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import tt from '@tomtom-international/web-sdk-maps'
import tomtom from '@tomtom-international/web-sdk-services'
import { genralConfig } from '../../../../constant/genral-config.constant'
import { DOCUMENT } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { MatDialog } from '@angular/material/dialog'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.css'],
})
export class ViewMapComponent implements OnInit {
  map: any
  tripDetail: any
  startMrk: tt.Marker
  endMrk: tt.Marker
  tripAddress: FormGroup
  ROUTE_WIDTH: any = 5
  routeColors: any = ['#4a90e2', '#a1a1a1', '#a1a1a1', '#a1a1a1', '#a1a1a1', '#a1a1a1', '#a1a1a1']
  departTime: any
  arriveTime: any
  distInMeters: any
  timeInsec: any
  callParameter: any
  timeFlag: any
  sourcePoslat: any
  sourcePoslng: any
  destinationPoslat: any
  destinationPoslng: any
  weight: any
  height: any
  width: any
  alternateRoute: any
  time: string
  truckDetails: any
  trailerDetails: any
  tripDetails: any
  features: any

  totalHeight: any
  totalWidth: any
  value: any = 39.37
  weightValue: any = 2.2046
  indexTags: any = []

  selectedLevel: any = 'Day 1'
  data: any = [
    { id: 0, name: 'Day 1' },
    { id: 1, name: 'Day 2' },
    { id: 2, name: 'Day 3' },
    { id: 3, name: 'Days 3-7' },
  ]
  weatherLayer1: any
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
  isActive: boolean = false
  layerBanner: boolean = true
  spareValueIdx: any = 0
  planNoOfTrip: any
  planActive: boolean = false
  tripPlanInfo: any
  userId: any
  planInfo: any
  prepArray: any = []
  tempArray: any = []
  L1: any
  tempArr: any = []

  waypoints: any = []
  routeArr: any = []
  markerArr: any = []

  constructor(
    private Service: GeneralServiceService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService,
    private formGroup: FormBuilder,
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {}
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
        let tripplanConstName = tripPlanInfo[0].features.filter(function (data) {
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
    this.createRoute()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
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
      this.Service.getSnowDay1(data).subscribe((res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          weatherLayer1 = res['data'].features
          var i
          for (i = 0; i < weatherLayer1.length - 1; i++) {
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
      this.Service.getSnowDay2(data).subscribe((res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          weatherLayer1 = res['data'].features
          var i
          for (i = 0; i < weatherLayer1.length - 1; i++) {
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
      this.Service.getSnowDay3(data).subscribe((res) => {
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
      this.Service.getfreezeDay1(data).subscribe((res) => {
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
        }
      })
    }
    if (this.spareValue === 'Day 2') {
      let data = {}
      this.spinner.show()
      this.Service.getfreezeDay2(data).subscribe((res) => {
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
        }
      })
    }
    if (this.spareValue === 'Day 3') {
      let data = {}
      this.spinner.show()
      this.Service.getfreezeDay3(data).subscribe((res) => {
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
        }
      })
    }
  }

  thunderWeatherDay1() {
    let weatherLayer1
    if (this.spareValue === 'Day 1') {
      let data = {}
      this.spinner.show()
      this.Service.getthunderDay1(data).subscribe((res) => {
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
      })
    }
    if (this.spareValue === 'Day 2') {
      let data = {}
      this.spinner.show()
      this.Service.getthunderDay2(data).subscribe((res) => {
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
      })
    }
    if (this.spareValue === 'Day 3') {
      let data = {}
      this.spinner.show()
      this.Service.getthunderDay3(data).subscribe((res) => {
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
      this.Service.getPrepDay37(data).subscribe((res) => {
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

  createRoute() {
    this.spinner.show()
    this.truckDetails = JSON.parse(localStorage.getItem('truck_Data'))
    this.trailerDetails = JSON.parse(localStorage.getItem('trailer_Data'))
    this.tripDetails = JSON.parse(localStorage.getItem('view_Info'))
    this.weight = Math.round(this.tripDetails.grossWeight / this.weightValue)
    this.time = this.tripDetails.date_Time
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
    this.sourcePoslat = this.tripDetails.source.location.coordinates[0]
    this.sourcePoslng = this.tripDetails.source.location.coordinates[1]

       // ! Create waypoints
       this.tripDetails.destination.forEach((element) => {
        this.waypoints.push({ lat: element.location.coordinates[0], lon: element.location.coordinates[1] })
      })
      this.waypoints.unshift({ lat: this.sourcePoslat, lon: this.sourcePoslng })
    // this.destinationPoslat = this.tripDetails.destination.location.coordinates[0]
    // this.destinationPoslng = this.tripDetails.destination.location.coordinates[1]
    this.height = Math.round(this.totalHeight / this.value)
    this.width = Math.round(this.totalWidth / this.value)
    this.alternateRoute = this.tripDetails.alternateRoots
    if (this.timeFlag == 'arriveBy') {
      var callParameterArrive = {
        versionNumber: 1,
        contentType: 'json',
        key: genralConfig.GPSCONFIG.API_KEY,
        locations: this.waypoints,
        maxAlternatives: this.alternateRoute,
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
        locations:this.waypoints,
        maxAlternatives: this.alternateRoute,
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

    tomtom.services.calculateRoute(this.callParameter).then(
      (response) => {
        this.spinner.hide()

        this.routeArr = []

        this.features = response.toGeoJson().features
        this.tripAddress.value.planTitle = 'GPS'
        this.tripAddress.value.constName = 'NOOFTRIPS'
        // this.tripAddress.value.roleTitle = this.roleTitle
        this.tripAddress.value.createdById = this.userId
        this.tripAddress.value.companyId = this.userId

        this.indexTags = []

       
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

            // this.map.on('click', 'route' + index, () => this.ActiveRoute(index))

    

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

            // this.map.on('click', 'route' + index, () => this.ActiveRoute(index))

           
          }
          // }
        })
        // this.addDistanceBox(this.features[0], 1)
        // if (this.features.length > 1) this.addDistanceBox(this.features[1], 2)
        // this.addMarkers(this.features[0])

        var bounds = new tt.LngLatBounds()
        this.features[0].geometry.coordinates.forEach((point) => bounds.extend(tt.LngLat.convert(point)))
        this.map.fitBounds(bounds, { duration: 0, padding: 50 })
       
        this.routeArr = this.tempArr
      },
      () => {
        this.spinner.hide()
        this.toaster.warning('No Route Found')
      }
    )
  }

  findFirstBuildingLayerId() {
    var layers = this.map.getStyle().layers
    for (var index in layers) {
      if (layers[index].type === 'fill-extrusion') return layers[index].id
    }
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
console.log(totalDestination,"99999999999999999")

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

    element.title = this.tripDetails.destination[incr - 1].address

    return element
  }
  createMarkerElementStartPoint() {
    var element = document.createElement('img')
    element.src = '/assets/startIcon.png'
    element.style.width = '30px'
    element.style.height = '30px'
    element.title = this.tripDetails.source.address
    return element
  }

  createMarkerElementendPoint() {
console.log(this.tripDetails.destination[this.tripDetails.destination.length-1].address,"99999999955555555555555555555")

    var element = document.createElement('img')
    element.src = '/assets/end.png'
    element.style.width = '30px'
    element.style.height = '30px'
    element.title = this.tripDetails.destination[this.tripDetails.destination.length-1].address
    return element
  }

  // createMarkerElementStartPoint() {
  //   var element = document.createElement('img')
  //   element.src = '/assets/startIcon.png'
  //   element.style.width = '30px'
  //   element.style.height = '30px'
  //   element.title = this.tripAddress.value.source
  //   return element
  // }

  // createMarkerElementendPoint() {
  //   var element = document.createElement('img')
  //   element.src = '/assets/end.png'
  //   element.style.width = '30px'
  //   element.style.height = '30px'
  //   element.title = this.tripAddress.value.destination
  //   return element
  // }

  secondsToDhms(seconds) {
    var hours = Math.floor(seconds / 3600)
    var minutes = Math.floor((seconds - hours * 3600) / 60)
    var sec = seconds - hours * 3600 - minutes * 60
    if (hours < 10) hours = 0 + hours
    if (minutes < 10) minutes = 0 + minutes
    if (seconds < 10) seconds = 0 + seconds
    return hours + 'hr' + ' ' + minutes + 'min'
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
}
