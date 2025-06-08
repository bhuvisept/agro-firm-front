import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';  
import { environment } from 'src/environments/environment'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { Buffer } from "buffer";

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.scss']
})
export class ViewTicketComponent implements OnInit {
  optionsNews = {
    toolbar: [
      'heading', 'bold', 'italic', 'link', '|',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo',
      'TableToolbar'
    ],
  };
  public Editor = ClassicEditor;  
  attachmentUrlPath = `${environment.ticketUrl}/upload/tickets/`
  userData: any;

  public editorsReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
}


  subject: string;
  category: string;
  notes: string;
  ticketInformation: any;
  ticketId: string;
  uplaodedFile: File
  replyMessage:any=''
  priority: string= "";
  callApiOneTime:boolean = false
  constructor(
    private DialogRef: MatDialogRef<ViewTicketComponent>,
    private genralServices: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.ticketId = this.data._id;
    this.getTicketeDetail();
  }
  ngOnChanges() {
    this.scrollBottom();
  }
  getTicketeDetail() {
    this.spinner.show();
    let delimiter =''
    this.genralServices.getTicketDetails({ id: this.ticketId }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.spinner.hide();
          let rr = this.decodeOutput(res['data'], delimiter = "@@@")
          this.ticketInformation=JSON.parse(rr);
          // this.ticketInformation = res['data'];
          this.subject = this.ticketInformation.subject;
          this.notes = this.ticketInformation.description;
          this.priority = this.ticketInformation.priority;
          this.scrollBottom()
        } else {
          this.spinner.show();
          this.toastr.error(res['message']);
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.show();
        this.toastr.error(error);
        this.spinner.hide();
      }
    );
  }

  
  scrollBottom() {
    let el = document.getElementById('comment');
    setTimeout(() => {
      el.scroll({ top: el.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  sendReply() {
    // this.spinner.show()
    if (!this.replyMessage) return this.toastr.warning("Please enter message");
    let data = {
      reply:this.replyMessage,
      ticket_id: this.ticketId,
      reportedBy_id: this.userData.userInfo._id
    }
    const newFormData = new FormData()
    newFormData.append('input', this.encodeRequest(data))
    this.callApiOneTime = true
    this.genralServices.ticketReply(newFormData).subscribe(
      (res) => {
        if (res["code"] == genralConfig.statusCode.ok) {
          this.spinner.hide()
          this.toastr.success(res["message"]);
          this.getTicketeDetail()
          this.replyMessage = ''
          this.callApiOneTime = false
          // this.DialogRef.close({ add: true });
        } else this.toastr.warning(res["message"]);
        this.callApiOneTime = false
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error);
        this.callApiOneTime = false
      }
    );
  }

  encodeRequest = (input) => {
    let salt = '123'
    const buffer = Buffer.from(salt, 'utf-8')
    const base64EncodedSalt = buffer.toString('base64')
    console.log(base64EncodedSalt,"base64EncodedSalt")
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
