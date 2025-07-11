all:
	node build.js

clean:
	@rm -rf build/*

re: clean all

.PHONY: all clean re
