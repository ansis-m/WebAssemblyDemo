#include <emscripten/emscripten.h>
#include <math.h>


static int result = 0;


EMSCRIPTEN_KEEPALIVE
int add (int a, int b) {
	return a + b;
}


EMSCRIPTEN_KEEPALIVE
int main () {
	result += add(3, 4);
	return (int) pow(result, 2);
}
