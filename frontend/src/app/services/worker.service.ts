import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private worker: Worker;
  constructor() {
    this.worker = new Worker(new URL('../web.worker', import.meta.url), { type: 'module' });

    this.worker.onmessage = ({ data }) => {
      console.log('Message received from worker:', JSON.stringify(data));
    };

    this.worker.postMessage("data");
  }
}
