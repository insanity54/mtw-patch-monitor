var plivo = require('plivo-node');

var arg = process.argv[2];
console.log('argument: ', arg);
var nconf = require('nconf');
var path = require('path');

nconf.file(path.join(__dirname, 'config.json'));

var api = plivo.RestAPI({
    authId: nconf.get('authId'),
    authToken: nconf.get('plivoToken')
});

var params = {
    from: nconf.get('call_from'),
    to: nconf.get('call_to'),
    ring_url: 'https://mtw-patch-monitor-insanity54.c9.io/response/sip/ringing/',
    answer_url: 'https://mtw-patch-monitor-insanity54.c9.io/response/sip/mobiletalk/'
    //machine_detection_url: 'https://mtw-patch-monitor-insanity54.c9.io/response/sip/machine/',
    //machine_detection: 'true'
};



function makeCall() {
    api.make_call(params, function(status, response) {
        if (status >= 200 && status < 300) {
            console.log('Successfully made call request.');
            console.log('Response:', response);
        }
        else {
            console.log('Oops! Something went wrong.');
            console.log('Status:', status);
            console.log('Response:', response);
        }
    });
}

function listCalls() {
    api.get_live_calls(params, function(status, response) {
                if (status >= 200 && status < 300) {
                    console.log('successfully made live calls request.');
                    console.log('Response: ', response);
                }
                else {
                    console.log('oop! error getting live calls');
                    console.log('response: ', response);
                }
    });
}


if (arg == 'list') {
    listCalls();
}
else {
    makeCall();
}