import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private worker: Worker;
  private wasmWorker: Worker;
  constructor() {
    this.worker = new Worker(new URL('../web.worker', import.meta.url), { type: 'module' });
    this.wasmWorker = new Worker(new URL('../wasm.worker', import.meta.url), { type: 'module' });
    this.wasmWorker.onmessage = ({ data }) => {
      console.log('Message received from worker:', JSON.stringify(data));
    };

    this.wasmWorker.postMessage("data");
    this.wasmWorker.postMessage("load");
  }
}
