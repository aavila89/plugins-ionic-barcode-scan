import { Component } from '@angular/core';
import {BarcodeScanner, BarcodeScannerOptions} from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Filesystem, Directory } from '@capacitor/filesystem';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  textScan: string = '-';
  urlImage!: string|Blob;
  constructor(
    private barcodeScanner: BarcodeScanner
  ) {}

  startScan() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera : false, // iOS and Android
      showFlipCameraButton : true, // iOS and Android
      showTorchButton : true, // iOS and Android
      torchOn: true, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt : "Place a barcode inside the scan area", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations : true, // iOS
      disableSuccessBeep: false // iOS and Android
    }
    this.barcodeScanner.scan(options).then( result => {
      this.textScan = result.text;
    }).catch( err => {});
  }

  startEncode() {
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, 'Hello work').then( async result => {
      await this.convertBase64(result.file);
    }).catch( err => {});
  }

  async convertBase64(filePath: string) {
        const {[1]: split} = filePath.split('private');
        // Get the actual base64 data of an image base on the name of the file
        const {data} = await Filesystem.readFile({
          path: `file:///${split}`
        });
        this.urlImage = `data:image/png;base64, ${data}`;
  }
}
