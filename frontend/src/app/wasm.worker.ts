/// <reference lib="webworker" />


// @ts-ignore
let wasmModule;

function loadWasm() {
  fetch('assets/web_assembly_c_module/main.wasm')
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const memory = new WebAssembly.Memory({initial: 256});

      const importObject = {
        env: {
          emscripten_memcpy_js: (dest: number, src: number, num: any) => {
            // @ts-ignore
            const memory = new Uint8Array(wasmModule.exports.memory.buffer);
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
          emscripten_date_now: () => Date.now(),
          emscripten_get_now: () => performance.now(),
          _emscripten_get_now_is_monotonic: () => 1,
          memory: memory,
          table: new WebAssembly.Table({initial: 0, element: 'anyfunc'}),
        }
      };

      return WebAssembly.instantiate(buffer, importObject);
    })
    .then(result => {
      wasmModule = result.instance;
      console.log('Loaded WASM:' + Object.keys(result.instance.exports));
      postMessage(Object.keys(result.instance.exports));
    })
    .catch(error => {
      console.error('Error loading WASM:', error);
      postMessage({type: 'error', error: error.toString()});
    });
}


addEventListener('message', ({data}) => {

  switch (data) {
    case 'load':
      loadWasm();
      break;
    case 'add':
      // @ts-ignore
      const result = wasmModule.exports.add(5, 3);
      console.log('Result from web worker:', result);
        postMessage(result);
      break;
    case 'main':
      // @ts-ignore
      const r = wasmModule.exports.main();
      console.log('Main from web worker:', r);
      postMessage(r);
      break;
    case 'getJSON':
      // @ts-ignore
      const json = readWasmString(wasmModule.exports.getJSON());
      console.log('Main from web worker:', json);
      postMessage(json);
      // @ts-ignore
      const free = wasmModule.exports.freeJSON();
      postMessage("memory freed: " + free);
      break;
    default:
      const response = `worker response to ${data}`;
      postMessage(response);
  }
});

function readWasmString(ptr: number): string {
  // @ts-ignore
  const memoryBuffer = new Uint8Array(wasmModule.exports.memory.buffer);
  let str = '';
  let currentByte = memoryBuffer[ptr];
  while (currentByte !== 0) {
  str += String.fromCharCode(currentByte);
  ptr++;
  currentByte = memoryBuffer[ptr];
}
  return str;
}
