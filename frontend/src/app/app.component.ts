import {Component, OnInit} from '@angular/core';
import {WasmService} from "./services/wasm.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';

  constructor(private wasmService: WasmService) {
  }

  ngOnInit(): void {
    this.wasmService.wasmLoaded$.subscribe(loaded => {
      if (loaded) {
        const result: number = this.wasmService.callWasmFunction();
        window.alert("result from component : " + result);
      }
    })
    this.wasmService.loadWasm();

  }
}