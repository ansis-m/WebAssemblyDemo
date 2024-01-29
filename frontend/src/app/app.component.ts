import {Component, OnDestroy, OnInit} from '@angular/core';
import {WasmService} from "./services/wasm.service";
import {Subscription, take} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'frontend';
  private wasmSubscription: Subscription | undefined;
  private worker: Worker;

  constructor(private wasmService: WasmService) {
    this.worker = new Worker(new URL('./web.worker', import.meta.url), { type: 'module' });
  }

  ngOnInit(): void {
    this.subscribeToWasmLoaded();
    this.wasmService.loadWasm();
  }

  private subscribeToWasmLoaded(): void {
    this.wasmSubscription = this.wasmService.wasmLoaded$.pipe(take(1)).subscribe(loaded => {
      if (loaded) {
        console.log(this.wasmService.exports);
        const result: number = this.wasmService.callWasmFunction();
        window.alert("result from component : " + result);
        this.wasmService.callMainFunction();
        this.wasmService.getJSON();
      }
    })
  }

  ngOnDestroy(): void {
  }
}
