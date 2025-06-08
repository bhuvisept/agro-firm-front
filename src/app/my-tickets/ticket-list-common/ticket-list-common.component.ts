import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { genralConfig } from '../../constant/genral-config.constant';
import { GeneralServiceService } from '../../core/general-service.service';
import { AddTicketComponent } from '../add-ticket/add-ticket.component';
import { ViewTicketComponent } from '../view-ticket/view-ticket.component';
import { Buffer } from "buffer";

@Component({
  selector: 'app-ticket-list-common',
  templateUrl: './ticket-list-common.component.html',
  styleUrls: ['./ticket-list-common.component.scss']
})
export class TicketListCommonComponent implements OnInit {


  title: string = "My Tickets";
  ticketList: any[] = [];
  userInfo: any;
  search: string = "";
  page:number=1
  tab:string='MYTICKETS'
  statusArray = [
    { value: "MYTICKETS", name: "My List" },
    { value: "STAFFTICKETS", name: "My Team List" },

  ];
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage;
  totalCount:any
  parentId: any;
  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private genralServices: GeneralServiceService,
  ) {}

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    this.getTicketList(1);
  }

  getTicketList(pageNumber) {
    if(this.userInfo.userInfo.accessLevel== "COMPANY" || this.userInfo.userInfo.accessLevel == "SELLER"){
     this.parentId = this.userInfo.userInfo._id
    }else{
      this.parentId =  this.userInfo.userInfo.companyId
    }

    this.spinner.show();
    let data = {
      count: 10,
      page: pageNumber,
      search: this.search,
      project_id: genralConfig.ticket_config.projectId,
      tab: this.tab,
      reportedBy_id:this.userInfo.userInfo._id,
      parent_id: this.parentId
    };
    
    let delimiter = ""
    let newData = { input: this.encodeRequest(data) }
    let result = this.decodeOutput(this.encodeRequest(data), delimiter = "@@@")
    // if(this.status=='') delete data.status
    this.genralServices.getTicketList(newData).subscribe(
      (res) => {
        if (res["code"] === genralConfig.statusCode.ok) {
          this.spinner.hide();
          let rr = this.decodeOutput(res['data'], delimiter = "@@@")
          this.ticketList = JSON.parse(rr)
          this.totalCount = res['totalCount']
          console.log(this.totalCount,"999999999999");
          
          this.page = pageNumber
        } else {
          this.spinner.show();
          this.ticketList = []
          if(res["message"] !=='No record found')this.toastr.error(res["message"]);
          this.spinner.hide();
        }
        this.spinner.hide();
      },
      (error) => {
        console.log(error,"--------   error after else -----------------");
        this.spinner.hide();
        this.toastr.error(error);
      }
    );
  }

  reset() {
    if (
      this.search != "" ||
      this.tab != ""
    ) {
      this.search = "";
      this.tab = "MYTICKETS";
     this.getTicketList(1)
    }
  }

  addTicketDialog() {
    this.dialog
      .open(AddTicketComponent, { width: "800px", maxHeight:'550px' })
      .afterClosed()
      .subscribe((res) => res && res.add && this.getTicketList(1));
  }

  viewTicket(ticket) {
    this.dialog.open(ViewTicketComponent, { width: "800px", maxHeight:'550px', data: ticket });
  }

  // viewResolution(val) {
  //   this.dialog.open(ViewResolutionComponent, { width: "800px", data: val });
  // }

  encodeRequest = (input) => {
    let salt = '123'
    const buffer = Buffer.from(salt, 'utf-8')
    const base64EncodedSalt = buffer.toString('base64')
    let encodePayload = Buffer.from(JSON.stringify(input), 'utf-8').toString('base64')
    let encodeHash = Buffer.from('####', 'utf-8').toString('base64')
    let delimiter = '@@@'
    let base64Payload = encodePayload + delimiter + encodeHash + delimiter + base64EncodedSalt
    return base64Payload
  }
  decodeOutput = (result, delimiter = '@@@') => {
    const components = result.split(delimiter)
    return Buffer.from(components[0], 'base64').toString('utf-8')
  }
}

