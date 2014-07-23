tests:
	@make test_for_mocha > /dev/null
	@mocha

test_for_mocha:
	@if [ ! mocha ] ; then npm install -g mocha ; fi ;

clean:
	@sudo rmdir delete_me
	@rm try_file

.PHONY: tests test_for_mocha clean
