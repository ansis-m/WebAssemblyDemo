import {Component, OnDestroy, OnInit} from '@angular/core';
import {WasmService} from "./services/wasm.service";
import {Subscription, take} from "rxjs";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'frontend';
  private wasmSubscription: Subscription | undefined;

  constructor(private wasmService: WasmService) {
  }

  ngOnInit(): void {
    this.subscribeToWasmLoaded();
    console.log("environment production: " + environment.production);
    this.wasmService.loadWasm();


  }

  handleMessageFromSW(event: MessageEvent) {
    window.alert('Message from Service Worker:' + event.data);
  }

  sendMessageToServiceWorker() {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', this.handleMessageFromSW);
      navigator.serviceWorker.controller.postMessage({
        type: 'COMMAND_OR_MESSAGE_TYPE',
        data: { message1: 'message1' }
      });
    } else {
      console.error('Service Worker controller not available.');
    }
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
