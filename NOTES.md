# Notes

I decided to take a straightforward BDD approach and simply make all the supplied tests pass. I've never really used cucumber.js before so a lot of my time was spent getting to grips with that.

If you want to try running the app start by running `npm install` then you can run `make test` to run the tests or `make setup run` to run the app.  This will chuck some dummy data in the "database" (flat json files) and run the app on port 3003.  You will need node V6+.  If you're using a PC you probably don't have `make` but if you find the commands from the Makefile and copy/paste them into the terminal that will probably work too.

I've just tried to fulfil the spec and haven't given much thought either to performance or security.  In the real world I would be using `Vary` headers and `cache-control` or `surrogate-cotntrol` headers to allow the CDN to cache the different endpoints correctly.  I would also be validating the input to each method a lot more thoroughly and using CORS headers on the user and endpoints as well as stuff like `X-XSS-Protection` `Strict-Transport-Security` and serving over https.