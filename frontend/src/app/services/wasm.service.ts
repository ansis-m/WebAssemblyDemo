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

      const memory = new WebAssembly.Memory({ initial: 256 });
      const importObject = {
        env: {
          emscripten_memcpy_js: (dest: number, src: number, num: any) => {
            const memory = new Uint8Array(this.wasmModule.exports.memory.buffer);
            memory.copyWithin(dest, src, src + num);
          },
          emscripten_resize_heap: (size: number) => {
            const PAGE_SIZE = 65536;
            const currentSize = memory.buffer.byteLength;
            const requiredSize = Math.ceil(size / PAGE_SIZE);
            const currentPages = currentSize / PAGE_SIZE;

            if (requiredSize > currentPages) {
              const additionalPages = requiredSize - currentPages;
              memory.grow(additionalPages);
              return true;
            } else {
              return false;
            }
          },
          memory: memory,
          table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        }
      };


      WebAssembly.instantiate(result, importObject).then(result => {
        this.wasmModule = result.instance;
        this.loaded = true;
        this.wasmLoadedSubject.next(true);
      })
    });
  }

  callWasmFunction(): number {
    const result = this.wasmModule.exports.add(5, 3);
    console.log('Result from WebAssembly:', result);
    return result;
  }

  callMainFunction(): number {
    const result = this.wasmModule.exports.main();
    console.log('Main from WebAssembly:', result);
    return result;
  }


  getString() {
    const ptr = this.wasmModule.exports.getJSON();
    this.readWasmString(ptr);
  }

  readWasmString(ptr: number): void {
    const memoryBuffer = new Uint8Array(this.wasmModule.exports.memory.buffer);
    let str = '';
    let currentByte = memoryBuffer[ptr];
    while (currentByte !== 0) {
      str += String.fromCharCode(currentByte);
      ptr++;
      currentByte = memoryBuffer[ptr];
    }
    console.log(str);
  }

  get exports(): any {
    return this.wasmModule.exports;
  }
}
