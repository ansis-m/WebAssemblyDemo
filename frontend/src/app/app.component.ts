import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, take} from "rxjs";
import {WasmService} from "./services/wasm.service";
import {WorkerService} from "./services/worker.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'frontend';
  private wasmSubscription: Subscription | undefined;


  constructor(private wasmService: WasmService,
              private workerService: WorkerService) {

  }

  ngOnInit(): void {
    this.subscribeToWasmLoaded();
    this.wasmService.loadWasm();
  }

  private subscribeToWasmLoaded(): void {
    this.wasmSubscription = this.wasmService.wasmLoaded$.pipe(take(1)).subscribe((loaded: any) => {
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
