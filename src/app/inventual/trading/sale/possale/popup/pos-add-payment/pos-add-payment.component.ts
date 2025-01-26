import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from '../success-popup/success-popup.component';

@Component({
  selector: 'app-pos-add-payment',
  templateUrl: './pos-add-payment.component.html',
  styleUrls: ['./pos-add-payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PosAddPaymentComponent {
  constructor(public dialog: MatDialog) { }

  successPopup() {
    this.dialog.open(SuccessPopupComponent);
  }
}
