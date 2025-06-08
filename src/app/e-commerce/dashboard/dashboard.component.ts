import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import Chart from 'chart.js/auto'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userObj: any
  userId: any
  contactToSellerList: any
  lineChart: any = []
  totalQueries: any
  totalQueriesCount: any
  totalAnsweredQueries: any
  totalAnswerCount:any
  totalUnAnsweredCount:any
  userID:any
  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    window.scroll(0, 0)
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.queriesGraph()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  grothEcommerce = [
    { icon: 'fa fa-columns', tit: 'Online Visitors', pri: '12,000' },
    { icon: 'fa fa-ticket', tit: 'Booking Online', pri: '200' },
    { icon: 'fa fa-meh-o', tit: 'Cusotomers', pri: '3,000' },
    { icon: 'fa fa-dollar', tit: 'Earnings', pri: '92,000' },
  ]

  queriesGraph() {
    let totalCount = []
    let lableRange = []
    this.userID= this.userObj.userInfo.createdById ?this.userObj.userInfo.createdById : this.userObj.userInfo._id       // changes by shivam kashyap 13-12-2022
    // let data = { sellerId: this.userId }
    let data = { sellerId: this.userID }
    this._generalService.showGraph(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.totalQueries = response['data'][0].graphData
        this.totalQueriesCount = response['data'][0].totalQueries.length ? response['data'][0].totalQueries[0]['count'] : 0
        this.totalAnswerCount = response['data'][0].totalQueries.length ? response['data'][0].totalAnsweredQueries[0]['count'] : 0    // changes by shivam kashyap 13-12-2022
        this.totalUnAnsweredCount = this.totalQueriesCount- this.totalAnswerCount                                                      // changes by shivam kashyap 13-12-2022
        if(this.totalUnAnsweredCount>0){
          this.totalUnAnsweredCount = this.totalUnAnsweredCount
        }else{
          this.totalUnAnsweredCount = 0
        }
        // this.totalAnsweredQueries = response['data'][0].percent ? response['data'][0].percent : 0
       console.log(this.totalAnsweredQueries );
       
        if(response['data'][0].percent != null && response['data'][0].percent > 0){
          this.totalAnsweredQueries = response['data'][0].percent
        }else{
          this.totalAnsweredQueries  = 0
        }

        this.totalQueries.forEach((element) => {
          totalCount.push(element.count)
          lableRange.push(element._id)
        })
        this.lineChart = new Chart('linechart', {
          type: 'line',
          data: {
            labels: lableRange,
            datasets: [
              {
                fill: true,
                tension: 0.3,
                borderWidth: 1,
                pointRadius: 5,
                data: totalCount,
                pointHoverRadius: 6,
                borderColor: '#8e5ea2',
                label: 'Number of queries per day',
                backgroundColor: 'rgba(142,94,162,0.5)',
              },
            ],
          },
          options: { scales: { y: { beginAtZero: true } } },
        })
      }
    })
  }
  getProductQuriesList() {
    this.spinner.show()
    let data = { seller_id: this.userId }
    this._generalService.contactToSeller(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) this.contactToSellerList = response['data']
      else this.toastr.error(response['message'])
      this.spinner.hide()
    })
  }
}
