import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderdiscounttwoComponent } from '../orderdiscounttwo/orderdiscounttwo.component';

@Component({
  selector: 'app-orderdiscount',
  templateUrl: './orderdiscount.component.html',
  styleUrls: ['./orderdiscount.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderdiscountComponent implements OnInit {

  constructor(public dialog: MatDialog) {}
  discounttwo() {
    const dialogRef = this.dialog.open(OrderdiscounttwoComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  ngOnInit(): void {
  }


}

