import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AdminSideService } from 'src/app/services/admin-side.service';
import { InteriorPaints } from 'src/app/models/interior-paints.models';
import { InteriorDescription } from 'src/app/models/interior-description.model';

@Component({
  selector: 'app-interior-pdf',
  templateUrl: './interior-pdf.component.html',
  styleUrls: ['./interior-pdf.component.css']
})



export class InteriorPdfComponent implements OnInit {

  project_information: any;
  interior_paints: Array<InteriorPaints>;
  interior_descriptions: Array<InteriorDescription>;
  project_descriptions: any;
  projectDetailsObj: any;
  totalAmount: number = 0;
  spentAmount: number = 0;
  project_id: number;
  generatedPdfName : string ;
  constructor(private _route: ActivatedRoute, public _sharedService: SharedService, private _adminsideService: AdminSideService) {

  }

  ngOnInit() {

    // this.onGetCustomerPayments(2);
    // this.onGetEstimate(2);
    // this.onGetAllProjectExpenses(2)

    this._route.params.subscribe(param => {
      this.project_id = +param['id'];
      if (!isNaN(this.project_id)) {
        this.generatedPdfName = "interior" + this.project_id + ".pdf" ;
        // this.onGetEstimate(this.project_id);
        // this.onGetCustomerPayments(this.project_id);
        this.onGetPDFData();
      }
    });
    this.interior_paints = new Array<InteriorPaints>();
    this.interior_descriptions = new Array<InteriorDescription>();
  }

  public captureScreen() {
    this._sharedService.loading = true;
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight)
      pdf.save(this.generatedPdfName); // Generated PDF
      this._sharedService.loading = false;
    }, error => {
      this._sharedService.loading = false;
    });

  }

  onGetEstimate(id: number) {
    this._adminsideService.getEstimate(id).subscribe((res: any) => {

      this.projectDetailsObj = res;
    }, (error) => {
      this._sharedService.error(error);

    })
  }

  onGetCustomerPayments(id: number) {
    this._adminsideService.getCustomerPayments(id).subscribe((res: any) => {
      if (res != undefined && res.customer_payments.length > 0) {
        res.customer_payments.forEach(element => {
          this.totalAmount = this.totalAmount + +element.payment_amount;
        });
      }
    },
      (error) => {
        this._sharedService.loading = false;
        this._sharedService.error(error.message);
    })
  }

  onGetPDFData() {
    
    this._adminsideService.getPDFData(this.project_id).subscribe((res: any) => {
      this.project_information = res.project_information;
      this.interior_paints = res.interior_paints;
      this.interior_descriptions = res.interior_descriptions;
      this.project_descriptions = res.project_descriptions[0];
    }, (error) => {
      this._sharedService.error(error);
    })
  }

}
