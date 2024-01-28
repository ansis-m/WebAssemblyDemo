#include <stdio.h>
#include <emscripten/emscripten.h>


static int result = 0;


EMSCRIPTEN_KEEPALIVE
int add (int a, int b) {
	return a + b;
}


EMSCRIPTEN_KEEPALIVE
int main () {
	result += add(3, 4);Y
	return result;
}
