import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'],
})
export class BarcodeComponent implements OnInit {
  
  @Input() label: string;
  @Input() campo: string;
  @Output() onRead = new EventEmitter();

  constructor(private barcodeScanner: BarcodeScanner) { }

  abrirBarcode(): void {
    this.barcodeScanner.scan().then((barcodeData: BarcodeScanResult) => {
      this.campo = barcodeData.text;
      this.onRead.emit({texto: barcodeData.text});
     }).catch(err => {
         console.log('Error', err);
     });
  }

  onChange(): void {
    if(this.campo) {
      this.onRead.emit({texto: this.campo});
    }
  }

  ngOnInit() {}

}
