(function() {
    // @TODO: create a more resource alike url scheme
    // @TODO: make the viewport and screensize parameterizable
    // @TODO: import commandline configuration parameters for host and port to listen on

    /**
     * Navigates phantomjs to motiveUrl and creates
     * a 1024x768 sized screenshot of the website;
     * 
     * @param string motiveUrl       url to navigate to
     * @param function successCallback to return the screenshot
     */
    function screenCapture(motiveUrl, successCallback) {
        var webpage,
            width,
            height,
            page;

        webpage   = require('webpage'),
        width     = 1024;
        height    = 768;
        page      = webpage.create();

        page.viewportSize = {
            width: width,
            height:height
        };

        page.open(motiveUrl, function(status) {
            console.log('capturing ', motiveUrl);

            page.evaluate(function(w, h) {
                document.body.style.width  = w + 'px';
                document.body.style.height = h + 'px';
            }, width, height);

            page.clipRect = {
                top: 0,
                left: 0,
                width: width,
                height: height
            };

            successCallback(atob(page.renderBase64('png')));
        });
    }

    /**
     * Parses the incoming url path of the request.
     * Chops the query and parses for the 
     * parameter named 'targetUrl'.
     * 
     * @param  object request object of webserver listen
     * @return string parsedUrl target url to capture the screenshot of
     */
    function parseMotiveUrl(request) {
        var beef,
            chops,
            params,
            parsedUrl;

        beef   = request.url.split('?')[1]; 
        chops  = beef.split('&');
        params = {};

        chops.forEach(function(chop, idx) {
            var segements, key, value;

            segments = chop.split('=');
            key      = segments[0];
            value    = segments[1];

            params[key] = decodeURIComponent(value);
        });

        parsedUrl = params.targetUrl;

        return parsedUrl;
    }

// -- pseudo main

    var server,
        service;

    server  = require('webserver').create();
    service = server.listen('127.0.0.1:8081', function(request, response) {

        function respondWithBinary(mime, data) {
            response.statusCode = 200;
            response.headers    = {
                'Cache': 'no-cache',
                'Content-Type': mime
            };

            response.setEncoding('binary');
            response.write(data);
            response.close();
        }

        function respondWithError(errorCode) {
            response.statusCode = errorCode;
            response.write('Error: ' + errorCode);
            response.close();
        }

        function onCaptureSuccess(imageData) {
            if(imageData !== undefined) {
                respondWithBinary('image/png', imageData);
            } else {
                respondWithError(500);
            }
        }

        if(request.url.indexOf('/capture') > -1) {
            var hasMotiveUrl,
                motiveUrl;

            // hasMotiveUrl = request.post !== undefined;
            motiveUrl    = parseMotiveUrl(request);
            hasMotiveUrl = motiveUrl !== undefined;

            if(!hasMotiveUrl) {
                respondWithError(500);
            } else {
                screenCapture(motiveUrl, onCaptureSuccess);
            }
        } else {
            respondWithError(404);
        }
    }); /* end of server listen */

})();
