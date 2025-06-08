import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { FormControl } from '@angular/forms'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { ToastrService } from 'ngx-toastr'
import { LoginDialogComponent } from 'src/app/pages/login-dialog/login-dialog.component'

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
})
export class MyEventsComponent implements OnInit {
  public image_url_truck = environment.URLHOST + '/uploads/event/image/thumbnail/'
  userObj: any
  userId: any
  everyeventLists: any
  interested: any
  // dialog: MatDialog
  exampleTime
  isTimerStart
  filterType
  myEvents: boolean
  everyeventListsfav
  everyeventListInt
  eveTotalCount: any
  eventBookLst: any
  ROLETITLE: any
  everyevent: boolean = true
  bookTotalCount: any
  bookevent: boolean = true
  intTotalCount: any
  intevent: boolean = false
  newVar: any
  everyeventListIntImg: any
  element: any
  favpagination: boolean = false
  Intpagination: boolean = false
  bookpagination: boolean = false
  pagefav: any
  Favorite: boolean = true
  Interested: boolean = false
  Booked: boolean = false

  //Pagination Ver
  totalCount: any
  page: number = 1
  itemsPerPage = genralConfig.enevtPageNationConfig.itemsPerPage
  // eveitemsPerPage = genralConfig.enevtPageNationConfig.itemsPerPage
  tabs = ['Favourite', 'Interested', 'Booked']
  selected: FormControl
  totalCountfav: any
  pagenum: any
  totalCountint: any
  pageint: any
  totalCountbook: any
  pagebook: any

  constructor(
    private dialog: MatDialog,
    private _generalService: GeneralServiceService,
    private router: Router,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }
  ngOnInit() {
    window.scroll(0, 0)
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.ROLETITLE = this.userObj.userInfo.roleId.roleName
    if (this.userObj && this.ROLETITLE == 'company') {
      this.router.navigateByUrl('/home-page')
    }
    this.selected = new FormControl(0)
    this.getFavList('FAVOURITE', 1)
  }

  showSubsPopUp() {
    this.dialog.open(LoginDialogComponent, { width: '500px', data: 'PLANFEATURE' })
  }

  ngAfterViewInit() {}

  // Tab changed function
  getTabChangeValue(event) {
    this.filterType = event.tab.textLabel

    switch (this.filterType) {
      case 'Favourite':
        this.getFavList('FAVOURITE', 1)
        this.Favorite = true
        this.Interested = false
        this.Booked = false

        clearInterval(this.isTimerStart)
        this.exampleTime = []
        break
      case 'Interested':
        this.Interested = true
        this.Favorite = false
        this.Booked = false
        this.getInterList('INTRESTED', 1)
        clearInterval(this.isTimerStart)
        this.exampleTime = []
        break

      case 'Booked':
        this.Interested = false
        this.Favorite = false
        this.Booked = true
        this.getEventbookLists('BOOk', 1)
        clearInterval(this.isTimerStart)
        this.exampleTime = []
        break
    }
  }

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New')

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1)
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1)
  }

  //FAVOURITE  List
  getFavList(event, pageNumber) {
    let data = {
      searchType: event,
      userId: this.userObj.userInfo._id,
      count: genralConfig.eventPaginator.COUNT,
      page: pageNumber, //pagenation page number send in api
    }
    this._generalService.eventList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.everyeventListsfav = response['data']
        this.totalCountfav = response['totalCount']
        this.pagenum = pageNumber
        if (this.everyeventListsfav.length) {
          this.everyevent = true
        } else {
          this.everyevent = false
        }
        if (this.everyeventListsfav.length > 4) {
          this.favpagination = true
        } else {
          this.favpagination = false
        }
      } else {
      }
    })
  }
  savePageChanged(event) {
    this.getFavList('FAVOURITE', event)
  }

  //INTERESTED  List
  getInterList(event, pageNumber) {
    let data = {
      searchType: event,
      userId: this.userId,
      count: genralConfig.eventPaginator.COUNT,
      page: pageNumber, //pagenation page number send in api
    }
    this._generalService.viewattende(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.everyeventListInt = response['data']
        this.totalCountint = response['totalCount']
        this.pageint = pageNumber

        if (this.totalCount > 4) {
          this.Intpagination = true
        } else {
          this.Intpagination = false
        }
      } else {
      }
    })
  }
  interPageChanged(event) {
    this.getInterList('INTRESTED', event)
  }

  //BOOKED  List
  getEventbookLists(event, pageNumber) {
    let data = {
      searchType: event,
      userId: this.userObj.userInfo._id,
      page: pageNumber,
    }
    this._generalService.getmyeventBookList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.eventBookLst = response['data']
        this.totalCountint = response['totalCount']
        this.pagebook = pageNumber

        if (this.totalCountbook == 0) {
          this.bookevent = true
        } else {
          this.bookevent = false
        }
      } else {
      }
    })
  }
  bookPageChanged(event) {
    this.getEventbookLists('BOOk', event)
  }
  removeintrest(eventId) {
    let data = {
      userId: this.userId,
      eventId: eventId,
    }
    this._generalService.removeInterestedAttendee(data).subscribe((res) => {
      if (res['code'] == genralConfig.statusCode.ok) {
        this.toastr.success(res['message'])
        this.getInterList('INTRESTED', 1)
      } else {
      }
    })
  }

  removeFavourite(eventId: any) {
    if (this.userId != null) {
      let data = {
        userId: this.userId,
        eventId: eventId,
      }
      this._generalService.removeFavouriteEvent(data).subscribe(
        (res) => {
          if (res['code'] == genralConfig.statusCode.ok) {
            this.toastr.success(res['message'])
            this.getFavList('FAVOURITE', 1)
          } else {
            this.toastr.warning(res['message'])
          }
        },
        (error) => {
          this.toastr.warning('Something went wrong')
        }
      )
    } else {
      this.router.navigateByUrl('login')
    }
  }
}
