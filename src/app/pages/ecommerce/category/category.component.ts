import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { genralConfig } from 'src/app/constant/genral-config.constant';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoriesList: any;
  category_image_url = environment.URLHOST + '/uploads/category/thumbnail/'
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.categoryList()
  }
  categoryList(){
    let data={
      // parentFlag:'true'
    }
    this.spinner.show()
    this._generalService.getCategoryList(data).subscribe((res)=>{
      if(res['code']==genralConfig.statusCode.ok){
        this.spinner.hide()
        this.categoriesList=res['data']
        console.log("categoriesList ",this.categoriesList)
        window.scroll(0,0)
      }else{
        window.scroll(0,0)
        this.spinner.hide()
      }
    })
  }

}
