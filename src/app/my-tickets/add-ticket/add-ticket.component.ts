import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Buffer } from "buffer";
@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss'],
})
export class AddTicketComponent implements OnInit {
  optionsNews = {
    placeholder:"Description"
  };
  public editor = ClassicEditor

  form: FormGroup = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('')
  })
  projectId = genralConfig.ticket_config.projectId
  userData: any
  // subject: string;
  // description: string = "";
  uplaodedFilesArry = []
  priority:string = ''
  priorityList = [
    {title:'LOW'},
    {title:'MEDIUM'},
    {title:'HIGH'},

  ]
  constructor(public DialogRef: MatDialogRef<AddTicketComponent>, private genralServices: GeneralServiceService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
  }

  deleteFile(index) {
    this.uplaodedFilesArry.splice(index, 1)
  }

  upload(value: any) {
    let file = value.target.files
    let uplaodedFilesArry = []
    for (const key in file) {
      if (file.hasOwnProperty(key)) {
        uplaodedFilesArry.push(file[key])
        console.log(uplaodedFilesArry)
      }
    }
    if (uplaodedFilesArry.length > 5) return this.toastr.warning('Can not upload more than 5 files')
    for (var i = 0; i < uplaodedFilesArry.length; i++) {
      if (uplaodedFilesArry[i].size > 104857600) return this.toastr.warning('File size must be less then 100 mb')
      else {
        this.imageProcess(uplaodedFilesArry[i])
      }
    }
  }
  imageProcess(file: any) {
    let extType = file.name.split('.').pop()
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      console.log(file)
      this.uplaodedFilesArry.push({ imgBase64: reader.result, imgFile: file, extType: extType })
    }
  }


  // addTicket = useFormik({
  //   initialValues: {
  //     subject: '',
  //     description: '',
  //   },
  //   validationSchema: ticket,
  //   onSubmit: (values) => {
  //     let date = moment().format()
  //     const formData = new FormData()
  //     formData.append('project_id', projectId)
  //     formData.append('reportDate', date)
  //     formData.append('source', 'ONLINE')
  //     formData.append('subject', values.subject)
  //     formData.append('description', values.description)
  //     formData.append(
  //       'reportedBy',
  //       JSON.stringify({
  //         id: userData?.userId,
  //         firstName: userData?.name,
  //         lastName: '',
  //         email: userData?.email,
  //       })
  //     )
  //     formData.append('type', 'TICKET')
  //     delete formData.files
  //     let formDataObject = {}
  //     for (const [key, value] of formData.entries()) {
  //       formDataObject[key] = value
  //     }
  //     const formDataObjectRR = JSON.parse(formDataObject.reportedBy)
  //     formDataObject.reportedBy = formDataObjectRR
  //     const newFormData = new FormData()
  //     newFormData.append('input', encodeRequest(formDataObject))
  //     if (imageFile.file) newFormData.append('files', imageFile.file)
  //     else newFormData.delete('files')
     
  //   },
  // })

  submitTicket() {
    if (!this.form.get('subject').value) return this.toastr.warning('Please enter subject')
    if (!this.form.get('description').value) return this.toastr.warning('Please enter description')
    let nowDate = new Date().toDateString()




    let userDetails = {
      id: this.userData.userInfo._id,
      firstName: this.userData.userInfo.firstName,
      lastName: this.userData.userInfo.lastName,
      email: this.userData.userInfo.email,
    }

    if(this.userData.userInfo.accessLevel=='COMPANY'){
      userDetails.firstName=this.userData.companyName
      userDetails.lastName=''
    }else{
      userDetails.firstName= this.userData.userInfo.firstName
      userDetails.lastName= this.userData.userInfo.lastName
    }


    const formData:any = new FormData()
    formData.append("parent_id", this.userData.userInfo.accessLevel == genralConfig.rolename.COMPANY ? this.userData.userInfo._id : this.userData.userInfo.companyId),
    formData.append('project_id', this.projectId)
    formData.append('reportDate', nowDate)
    formData.append('source', 'ONLINE')
    formData.append('subject', this.form.get('subject').value)
    formData.append('description', this.form.get('description').value)
    formData.append('reportedBy', JSON.stringify(userDetails))
    formData.append('type', 'TICKET')
    formData.append("priority", this.form.get('priority').value);
    this.uplaodedFilesArry.forEach((res) => {
      console.log(res)
      // delete res.imgBase64
      delete res.extType
      formData.append('files', res.imgFile)
    })
    formData.delete("files");
    let formDataObject:any = {}
    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value
    }
    const formDataObjectRR = JSON.parse(formDataObject.reportedBy)
    formDataObject.reportedBy = formDataObjectRR
    const newFormData = new FormData()
    newFormData.append('input', this.encodeRequest(formDataObject))
    this.uplaodedFilesArry.forEach((res) => {
      // delete res.imgBase64
      delete res.extType
      if (res.imgFile) newFormData.append('files', res.imgFile)
      else newFormData.delete('files')
    })
    this.spinner.show()
    this.genralServices.addTicket(newFormData).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.toastr.success(res['message'])
          this.DialogRef.close({ add: true })
          this.spinner.hide()
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error)
      }
    )
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




}
