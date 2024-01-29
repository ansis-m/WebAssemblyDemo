#include <emscripten/emscripten.h>
#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>



static int result = 0;
static char* pointer;

typedef struct {
	int age;
	char name[50];

} Person;


int add (int a, int b) {

	Person p = {1000, "name"};
	return a + b + p.age;
}


int main () {
	result += add(3, 4);
//	sleep(7);
	return (int) pow(result, 2);
}

EMSCRIPTEN_KEEPALIVE
char* getJSON() {
    Person p;
    p.age = 25;
    strcpy(p.name, "John");

    int requiredSize = snprintf(NULL, 0, "{\"id\": %d, \"name\": \"%s\"}", p.age, p.name) + 2;

    char* json = (char*)malloc(requiredSize);
    snprintf(json, requiredSize, "{\"age\": %d, \"name\": \"%s\"}", p.age, p.name);
	  pointer = json;
//	  sleep(7);
    return json;
}

EMSCRIPTEN_KEEPALIVE
int freeJSON() {
	free(pointer);
//	sleep(7);
  return 69;
}
