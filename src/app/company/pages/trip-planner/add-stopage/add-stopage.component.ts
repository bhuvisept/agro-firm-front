import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import tt from '@tomtom-international/web-sdk-maps'
import { genralConfig } from '../../../../constant/genral-config.constant'
import tomtom from '@tomtom-international/web-sdk-services'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { environment } from 'src/environments/environment'
import { InstructionDialogComponent } from '../instruction-dialog/instruction-dialog.component'
import moment from 'moment'

@Component({
  selector: 'app-add-stopage',
  templateUrl: './add-stopage.component.html',
  styleUrls: ['./add-stopage.component.css'],
  providers: [NgxSpinnerService],
})
export class AddStopageComponent implements OnInit {
  isActive: boolean = false
  map: any
  popupOffsets: any
  marker: any
  savedMarker: tt.Marker
  ID: any
  sourcePoslat: any
  sourcePoslng: any
  destinationPoslat: any
  destinationPoslng: any
  weight: any
  fuelCapacity: any
  height: any
  width: any
  timeInsec: number
  distInMeters: number
  alternateRoute: any
  routeColors: any = ['#4A8FE1', '##4A8FE1', '##4A8FE1', '##4A8FE1', '##4A8FE1', '##4A8FE1', '##4A8FE1']
  ROUTE_WIDTH: any = 5
  hosButton: boolean
  lat: any
  lng: any
  submit: any
  maneuver = genralConfig.maneuver
  serviceName: any
  image: any
  popup: tt.Popup
  tripAddress: FormGroup
  public serviceIcons = environment.URLHOST + '/uploads/serviceIcons/'
  startMrk: any
  meanValue: any = []
  endMrk: any
  groupInst: Object[]
  groupDetailInst: Object[]
  meanValue1: any = []
  groupInst1: any = []
  time: any
  arriveTime: any
  tripDetail: any
  timeFlag: any
  callParameter: any
  hosUsage: any
  markerSet: tt.Marker
  userId: any
  totalDistance: number
  totalTime: number
  AverageSpeed: number = 64.5
  AverageSpeedKm: number = 104
  totalTravelDistance: number
  noOfDays: number
  days: any = []
  departTime: any
  unitConversion: boolean = false
  hosInfo: boolean = false
  stoppagepopup: tt.Popup
  router: any
  savePopUp: tt.Popup
  markerId: any
  UpdateArriveTime: Date
  checkId: HTMLInputElement
  DropImage: string
  description: HTMLInputElement
  DropServiceName: string
  checkId1: HTMLInputElement
  checkId2: HTMLInputElement
  checkId3: HTMLInputElement
  checkId4: HTMLInputElement
  checkId5: HTMLInputElement
  checkId6: HTMLInputElement
  popupOffset: any
  indexTags: any = []
  selectedRoute: number
  save: any = []
  typeList: string
  cusIndex: any
  deleteMark: any
  loadType: any
  truckWidth: any
  trialerWidth: any
  truckHeight: any
  trialerHeight: any
  value: any = 39.37
  weightValue: any = 2.2046
  routeArr: any[]

  tempArr: any = []
  markerArr: any = []
  allDestination: any =[]
  waypoints: any = []
  constructor(
    private Service: GeneralServiceService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formGroup: FormBuilder,
    private dialog: MatDialog,
    private routers: Router,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('truckStorage'))
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
    this.map = tt.map({
      key: genralConfig.GPSCONFIG.API_KEY,
      container: 'map',
      center: [-95.712891, 37.09024],
      style: 'https://api.tomtom.com/style/1/style/21.1.0-*?map=basic_main',
      stylesVisibility: { trafficFlow: true },
      zoom: 16,
      minZoom: 3,
    })
    this.tripAddress = this.formGroup.group({ source: [''],  destinations: this.formGroup.array([]) })

    this.map.addControl(new tt.NavigationControl())
    this.map.addControl(new tt.FullscreenControl())
    window.scroll(0, 0)
    this.route.params.subscribe((res) => (this.ID = res.id))
    this.createRoute()
    this.getStopages()

    this.displayDestinations();
    this.map.on('contextmenu', (e: any) => {
      if (this.popupOffsets) this.stoppagepopup.remove()
      this.lat = e.lngLat.lat
      this.lng = e.lngLat.lng
      this.popupOffsets = { top: [0, -10], bottom: [0, -30], 'bottom-right': [0, -50], 'bottom-left': [0, -50], left: [25, -35], right: [-25, 0] }
      this.stoppagepopup = new tt.Popup({ offset: this.popupOffsets })
        .setLngLat(e.lngLat)
        .setHTML(
          `<div>
        <div><strong>Choose Marker<span style="color:red">*</span></strong></div>
          <div class="row">
                <div class="col-sm-12">
                <div class="icon-marker">
                <tr>
                <input type="radio" id="img1" alt="Service" name="Services" value="truckWashing.png">&nbsp;&nbsp;<img style="margin-right:8px" src="${
                  environment.URLHOST + '/uploads/serviceIcons' + '/truckWashing.png'
                }" height="28px"; width="28px"><span>Truck Wash</span><hr>
                <input type="radio" id="img2" alt="Service" name="Services" value="truckRepair.png">&nbsp;&nbsp;<img style="margin-right:8px" src="${
                  environment.URLHOST + '/uploads/serviceIcons' + '/truckRepair.png'
                }" height="28px"; width="28px"><span style="margin-right:8px">Truck Repair</span><hr>
                <input type="radio" id="img3" alt="Service" name="Services" value="trailerRepair.png">&nbsp;&nbsp;<img style="margin-right:8px" src="${
                  environment.URLHOST + '/uploads/serviceIcons' + '/trailerRepair.png'
                }" height="28px"; width="28px"><span style="margin-right:8px">Trailer Wash</span><hr>
                <input type="radio" id="img4" alt="Service" name="Services" value="truckParking.png">&nbsp;&nbsp;<img style="margin-right:8px" src="${
                  environment.URLHOST + '/uploads/serviceIcons' + '/truckParking.png'
                }" height="28px"; width="28px"><span style="margin-right:8px">Truck Parking</span><hr>
                <input type="radio" id="img5" alt="Service" name="Services" value="restArea.png">&nbsp;&nbsp;<img style="margin-right:8px" src="${
                  environment.URLHOST + '/uploads/serviceIcons' + '/restArea.png'
                }" height="28px"; width="28px"><span style="margin-right:8px">Rest Area</span><hr>
                <input type="radio" id="img6" alt="Service" name="Services" value="gaspump.png">&nbsp;&nbsp;<img style="margin-right:8px" src="${
                  environment.URLHOST + '/uploads/serviceIcons' + '/gaspump.png'
                }" height="28px"; width="28px"><span style="margin-right:8px">Gas pump</span><hr>
                <input type="radio" id="img7" alt="HOS" name="Services" value="HOS.png">&nbsp;&nbsp;<img style="margin-right:8px" src="${
                  environment.URLHOST + '/uploads/serviceIcons' + '/HOS.png'
                }" height="28px"; width="28px"><span style="margin-right:8px">Hours Of Services</span>
                </tr>
                </div>
                <span id="marker_error" style="display: none;color:red;!important">Marker is required.</span>
                </div>
            </div>
            <div  style="margin-top:8px;margin-bottom:8px"><strong >Description<span style="color:red">*</span></strong></div>
           <div>
          <textarea id="marker-note" tabindex="1" rows="2" name="Note" class="input-block-level form-control w-100 m-0" 
          margin: 0 13px;"></textarea>
          <span id="note_error" style="display: none;color:red; !important;">Description is required.</span>
          <button  id="addMarkers" class="btn btn-primary w-100" style="padding: 5px 21px;background: #005aa6;margin: 13px 0;border-radius: 10px;" >Save</button>
          <h6 style="text-align: center;font-size: 12px;font-weight: 500;color: #ff2020;margin: 7px 0;">* All the fields are mandatory</h6>
         </div>`
        )
        .addTo(this.map)
      this.checkId = <HTMLInputElement>document.getElementById('img1')
      this.checkId.addEventListener('click', (e) => {
        this.DropImage = this.checkId.value
        this.typeList = this.checkId.alt
      })
      this.checkId1 = <HTMLInputElement>document.getElementById('img2')
      this.checkId1.addEventListener('click', (e) => {
        this.DropImage = this.checkId1.value
        this.typeList = this.checkId1.alt
      })
      this.checkId2 = <HTMLInputElement>document.getElementById('img3')
      this.checkId2.addEventListener('click', (e) => {
        this.DropImage = this.checkId2.value
        this.typeList = this.checkId2.alt
      })
      this.checkId3 = <HTMLInputElement>document.getElementById('img4')
      this.checkId3.addEventListener('click', (e) => {
        this.DropImage = this.checkId3.value
        this.typeList = this.checkId3.alt
      })
      this.checkId4 = <HTMLInputElement>document.getElementById('img5')
      this.checkId4.addEventListener('click', (e) => {
        this.DropImage = this.checkId4.value
        this.typeList = this.checkId4.alt
      })
      this.checkId5 = <HTMLInputElement>document.getElementById('img6')
      this.checkId5.addEventListener('click', (e) => {
        this.DropImage = this.checkId5.value
        this.typeList = this.checkId5.alt
      })
      this.checkId6 = <HTMLInputElement>document.getElementById('img7')
      this.checkId6.addEventListener('click', (e) => {
        this.DropImage = this.checkId6.value
        this.typeList = this.checkId6.alt
      })
      this.description = <HTMLInputElement>document.getElementById('marker-note')
      this.description.addEventListener('input', () => {
        this.DropServiceName = this.description.value
      })
      this.submit = document.getElementById('addMarkers')
      this.submit.addEventListener('click', () => {
        var data = document.getElementsByName('Services')
        var selected = Array.from(data).find((radio) => (<HTMLInputElement>radio).checked)
        if (!this.description.value) document.getElementById('note_error').style.display = 'block'
        else document.getElementById('note_error').style.display = 'none'
        if (!selected) document.getElementById('marker_error').style.display = 'block'
        else document.getElementById('marker_error').style.display = 'none'
        if (this.description.value && selected) {
          this.stoppagepopup.remove()
          this.saveMarker()
        }
      })
    })
  }
  displayDestinations() {
    const destinationsFormArray = this.tripAddress.get('destinations') as FormArray;
    this.allDestination.forEach(destination => {
      destinationsFormArray.push(this.formGroup.control(destination.address));
    });
  }

  // Getter for easier access to the destinations form array
  get destinationsFormArray() {
    return this.tripAddress.get('destinations') as FormArray;
  }
  getStopages() {
    this.popupOffset = { top: [0, -10], bottom: [0, -30], 'bottom-right': [0, -50], 'bottom-left': [0, -50], left: [25, -35], right: [-25, 0] }
    let data = { tripPlannerId: this.ID }
    this.Service.getStopages(data).subscribe((res) => {
      if (res['code'] == 200) {
        var stoppageArray = res['data'][0].stoppage
        stoppageArray.forEach((element, index) => {
          this.markerId = element._id
          let lat = element.location.coordinates[0]
          let lng = element.location.coordinates[1]
          let adress = element.address

          
          // this.serviceName = element.serviceName
          this.serviceName = element.description
          this.image = environment.URLHOST + '/uploads/serviceIcons/' + element.image
          var elements = document.createElement('img')
          elements.src = this.image
          elements.style.width = '40px'
          elements.style.height = '40px'
          elements.alt = this.markerId
          this.popup = new tt.Popup({ offset: this.popupOffset }).setHTML(
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
          this.savedMarker = new tt.Marker({ element: elements }).setLngLat([lng, lat]).setPopup(this.popup).addTo(this.map)
        })
      }
    })
  }
  deleteMarkerFun() {
    let data = { trip_id: this.ID, markerId: this.deleteMark.title }
    this.Service.deleteMarker(data).subscribe()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }
  readModeRemove() {
    document.getElementById('myInput').removeAttribute('readonly')
  }
  saveMarker() {
    let data = {
      rootId: 'route' + this.selectedRoute,
      _id: this.ID,
      location: { coordinates: [this.lat, this.lng] },
      description: this.DropServiceName,
      image: this.DropImage,
      type: this.typeList,
      serviceName: this.DropImage.split('.')[0],
    }
    this.spinner.show()
    this.Service.addStoppage(data).subscribe((res) => {
      if (res['code'] == 200) this.getStopages()
      this.spinner.hide()
    })
  }
  createRoute() {
    let data = { _id: this.ID }
    // this.spinner.show()
    this.Service.getTripDetails(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.tripDetail = res['data']
        this.tripAddress.patchValue({ source: res['data'].source.address, destination: res['data'].destination.address })
        this.time = res['data'].date_Time
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
          vehicleLoadType: this.loadType,
        }
        this.callParameter = callParameterDepart
      }

      // tomtom.services.calculateRoute(this.callParameter).then(
      //   (response) => {
      //     this.spinner.hide()
      //     var features = response.toGeoJson().features
      //     var geojson = response.toGeoJson()
      //     this.hosUsage = response.toGeoJson()
      //     features.forEach((feature, index) => {
      //       this.indexTags.push(index)
      //       this.groupInst = features[index].properties.guidance.instructionGroups
      //       this.groupInst1.push(this.groupInst)
      //       this.groupDetailInst = features[index].properties.guidance.instructions
      //       this.meanValue1.push({ index: index, data: this.groupDetailInst })
      //       this.timeInsec = geojson.features[index].properties.summary.travelTimeInSeconds
      //       this.distInMeters = geojson.features[index].properties.summary.lengthInMeters
      //       this.arriveTime = geojson.features[index].properties.summary.arrivalTime
      //       this.departTime = geojson.features[index].properties.summary.departureTime

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
      //       this.map.on('click', 'route' + index, () => this.ActiveRoute(index))
      //       this.DefaultSelectedRoute()
      //       this.addMarkers(geojson.features[index])
      //     })

      //     var bounds = new tt.LngLatBounds()
      //     geojson.features[0].geometry.coordinates.forEach((point) => bounds.extend(tt.LngLat.convert(point)))
      //     this.map.fitBounds(bounds, { duration: 0, padding: 50 })
      //   },
      //   () => {
      //     alert("Expired Trip Your trip got expired as it's end date was " + moment(callParameterArrive.arriveAt).format('MM-DD-YYYY h:mm a') + '.')
      //     this.routers.navigate(['/layout/myaccount/trip-planner'])
      //   }
      // )
      tomtom.services.calculateRoute(this.callParameter).then(
        (response) => {
          this.spinner.hide()
  
          this.routeArr = []
          var features = response.toGeoJson().features
          this.hosUsage = response.toGeoJson()
         var geojson = response.toGeoJson()

          features = response.toGeoJson().features
          this.tripAddress.value.planTitle = 'GPS'
          this.tripAddress.value.constName = 'NOOFTRIPS'
          // this.tripAddress.value.roleTitle = this.roleTitle
          this.tripAddress.value.createdById = this.userId
          this.tripAddress.value.companyId = this.userId
  
          this.indexTags = []
  
          // this.Service.gpsCreateRoute(this.tripAddress.value).subscribe((res) => res['code'] == 200 && this.getRecentTrips())
          features.forEach((feature, index) => {

            this.indexTags.push(index)
                  this.groupInst = features[index].properties.guidance.instructionGroups
                  this.groupInst1.push(this.groupInst)
                  this.groupDetailInst = features[index].properties.guidance.instructions
                  this.meanValue1.push({ index: index, data: this.groupDetailInst })
                  this.timeInsec = geojson.features[index].properties.summary.travelTimeInSeconds
                  this.distInMeters = geojson.features[index].properties.summary.lengthInMeters
                  this.arriveTime = geojson.features[index].properties.summary.arrivalTime
                  this.departTime = geojson.features[index].properties.summary.departureTime

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
          this.toastr.warning('No Route Found')
        }
      )
    })
  }

  DefaultSelectedRoute() {
    var i = 0
    this.cusIndex = i
    this.map.setPaintProperty('route' + i, 'line-width', 8)
    this.selectedRoute = i
    this.indexTags.splice(i, 1)
    this.map.setPaintProperty('route' + i, 'line-color', '#4a90e2')
    this.indexTags.forEach((element) => {
      this.map.setPaintProperty('route' + element, 'line-color', '##4A8FE1')
      this.map.setPaintProperty('route' + element, 'line-width', this.ROUTE_WIDTH)
      this.map.moveLayer('route' + this.selectedRoute)
    })
    this.indexTags.splice(i, 0, i)
  }
  ActiveRoute(data) {
    this.cusIndex = data
    this.map.setPaintProperty('route' + data, 'line-width', 8)
    this.selectedRoute = data
    this.indexTags.splice(data, 1)
    this.map.setPaintProperty('route' + data, 'line-color', '#4a90e2')
    this.indexTags.forEach((element) => {
      this.map.setPaintProperty('route' + element, 'line-color', '##4A8FE1')
      this.map.setPaintProperty('route' + element, 'line-width', this.ROUTE_WIDTH)
      this.map.moveLayer('route' + this.selectedRoute)
    })
    this.indexTags.splice(data, 0, data)
    var test = <HTMLDivElement>document.getElementById(data)
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
  //   this.savePopUp = new tt.Popup({ offset: this.popupOffsets, closeButton: false, closeOnClick: false })
  //     .setHTML(
  //       `<div class="text-center">${this.secondsToDhms(timeInHours)}<div class="text-center" >${this.formatAsImperialDistance(distanceInMeter)} / ${this.formatAsMetricDistance(distanceInMeter)} 
  //     </div></div>`
  //     )
  //     .setLngLat(popupPoint)
  //     .addTo(this.map)
  // }

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
      if (layers[index].type === 'fill-extrusion') return layers[index].id
    }
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '250px'
    document.getElementById('main').style.marginLeft = '250px'
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0'
    document.getElementById('main').style.marginLeft = '0'
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

  hoursOfServicesMiles() {
    this.days = []
    this.AverageSpeed = this.AverageSpeed ? this.AverageSpeed : 64.5
    this.hosInfo = true
    this.hosButton = true
    this.totalDistance = (this.hosUsage.features[0].properties.summary.lengthInMeters / 10 / 100) * 0.621371 // mile conversion
    this.totalTime = Math.round(this.hosUsage.features[0].properties.summary.travelTimeInSeconds / 3600) // in hours
    this.totalTravelDistance = 11 * this.AverageSpeed //oneday travel distance
    this.noOfDays = Math.round(this.totalDistance / this.totalTravelDistance)
    var date = new Date(this.departTime)

    if (this.noOfDays != 0) {
      for (var i = 1; i <= this.noOfDays; i++) {
        this.days.push(i)
      }
     
      this.UpdateArriveTime = new Date(date.setDate(date.getDate() + this.days.length - 1))

      console.log( this.UpdateArriveTime,"9999999999999999999")
    } else this.UpdateArriveTime = new Date(date.setDate(date.getDate()))
  }

  AverageSpeedFun() {
    this.hosButton = false
    this.days = []
    this.hoursOfServicesMiles()
  }

  back() {
    this.hosInfo = false
  }

  hoursOfServiceskm() {
    this.days = []
    this.AverageSpeedKm = this.AverageSpeedKm ? this.AverageSpeedKm : 104
    this.hosInfo = true
    this.hosButton = true
    console.log(this.hosUsage,"0000000000000000000000")
    this.totalDistance = (this.hosUsage.features[0].properties.summary.lengthInMeters / 10 / 100) * 0.621371 // mile conversion
    this.totalTime = Math.round(this.hosUsage.features[0].properties.summary.travelTimeInSeconds / 3600) // in hours
    this.totalTravelDistance = 11 * this.AverageSpeedKm //oneday travel distance
    this.noOfDays = Math.round(this.totalDistance / this.totalTravelDistance)
    var date = new Date(this.departTime)

    if (this.noOfDays != 0) {
      for (var i = 1; i <= this.noOfDays; i++) {
        this.days.push(i)
      }
      this.UpdateArriveTime = new Date(date.setDate(date.getDate() + this.days.length - 1))
    } else this.UpdateArriveTime = new Date(date.setDate(date.getDate()))
  }

  AverageSpeedFunkm() {
    this.days = []
    this.hosButton = false
    this.hoursOfServiceskm()
  }
  instructionHover(data) {
    if (this.save.length == 0) {
      var n = data.point
      this.map.flyTo({ center: [n.longitude, n.latitude], speed: 10, zoom: 10 })
      this.createMarker('/assets/pin.png', [n.longitude, n.latitude], data.message)
    } else {
      this.save[0].remove()
      this.save.splice(0, 1)
      var n = data.point
      this.map.flyTo({ center: [n.longitude, n.latitude], speed: 10, zoom: 10 })
      this.createMarker('/assets/pin.png', [n.longitude, n.latitude], data.message)
    }
  }
  reset() {
    if (this.save.length != 0) this.save[0].remove()
  }
  createMarker(icon, position, popupText) {
    var markerElement = document.createElement('div')
    markerElement.className = 'marker'
    var iconElement = document.createElement('img')
    iconElement.className = 'marker-icon'
    iconElement.src = icon
    markerElement.appendChild(iconElement)
    var popup = new tt.Popup({ offset: 30, closeButton: false, closeOnClick: false }).setText(popupText)
    this.markerSet = new tt.Marker({ element: markerElement, anchor: 'bottom' }).setLngLat(position).togglePopup().setPopup(popup).addTo(this.map)
    this.markerSet.setPopup(popup).togglePopup()
    this.save.push(this.markerSet)
  }
  conversionInKm() {
    this.unitConversion = true
    var someElement = document.getElementById('myElementKm')
    someElement.className += ' checked'
    document.getElementById('myElementMile').classList.remove('checked')
  }

  conversionInMiles() {
    this.unitConversion = false
    let myElementMile = document.getElementById('myElementMile')
    myElementMile.className += ' checked'
    document.getElementById('myElementKm').classList.remove('checked')
  }

  instructionFunc() {
    this.dialog.open(InstructionDialogComponent, { width: '350px' })
  }

  clickEvent() {
    this.isActive = !this.isActive
  }
}
