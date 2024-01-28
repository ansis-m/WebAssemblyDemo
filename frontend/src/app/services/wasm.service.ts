import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WasmService {
  private wasmModule: any;
  public loaded = false;

  private wasmLoadedSubject = new Subject<boolean>();
  public wasmLoaded$ = this.wasmLoadedSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadWasm(): void {
    if (this.loaded) {
      return;
    }
    this.http.get('assets/web_assembly_c_module/main.wasm', { responseType: 'arraybuffer' }).subscribe(result => {
      WebAssembly.instantiate(result).then(result => {
        this.wasmModule = result.instance;
        this.loaded = true;
        this.wasmLoadedSubject.next(true);
      });
    });
  }

  callWasmFunction(): number {
    const result = this.wasmModule.exports.add(5, 3);
    console.log('Result from WebAssembly:', result);
    return result;
  }
}
