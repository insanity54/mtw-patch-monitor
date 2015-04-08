var plivo = require('plivo-node');
var express = require('express');
var app = express();
app.use(express.bodyParser()); // Required for parsing POST
var port = process.env.PORT || 5000;
//var sound = require('./sound');
var nconf = require('nconf');
var path = require('path');

nconf.file(path.join(__dirname, 'config.json'));

var api = plivo.RestAPI({
    authId: nconf.get('authId'),
    authToken: nconf.get('plivoToken')
});




app.all('/response/sip/mobiletalk/', function(req, res) {
    console.log(req.query);
    var hangup = req.param('HangupCause');
    //console.log('hangup: ' + hangup);
    var r = plivo.Response();

    var recordOptions = {
        recordSession: "true",
        //startOnDialAnswer: "true",
        redirect: "false",
        action: "https://mtw-patch-monitor-insanity54.c9.io/response/sip/recording/",
        maxLength: "20"
    };
    
    var digitOptions = {
        action: 'https://mtw-patch-monitor-insanity54.c9.io/response/sip/digits/',
        redirect: "false",
        timeout: 30,
        digitTimeout: 1
    };    
    
    r.addRecord(recordOptions);
    r.addWait({length: "9"});
    //r.addSpeak('enter digits');
    //r.addGetDigits(digitOptions);
    r.addWait({length: "20"});
    //r.addSpeak('end');
    r.addHangup();
    // var dial = r.addDial();
    // dial.addNumber('15099220951');
    //r.addWait({ length: "3" });

    // if (hangup) {
    //     res.end("SIP Route hangup callback");
    //     return;
    // }

    res.set({
        'Content-Type': 'text/xml'
    });
    res.end(r.toXML());

});


app.all('/response/sip/hangup/', function(req, res) {
  console.log('hangup check');
  console.log(req.query);
  var hangup = req.param('HangupCause');
  var id = req.param('CallUUID');
   
  if (hangup) {
      console.log("This call is done! call id: ", id);
      //return sound.analyze();
      return;
  }
});


// app.all('/response/sip/route/', function(req, res) {
//     console.log(req.query);
//     console.log('routing! ');
//     var hangup = req.param('HangupCause');
//     //var machine = req.param('Machine');

//     //console.log('machine? ' + machine);
    
//     var r = plivo.Response();
    
//     var recordOptions = {
//         //recordSession: "true",
//         startOnDialAnswer: "true",
//         redirect: "false",
//         action: "https://mtw-patch-monitor-insanity54.c9.io/response/sip/recording/",
//         maxLength: "20"
//     };
    
//     var digitOptions = {
//         action: 'https://mtw-patch-monitor-insanity54.c9.io/response/sip/digits/',
//         redirect: "false"
//     };
    
//     //r.addHangup({reason: 'busy'});
//     //r.addGetDigits(digitOptions);
//     r.addSpeak('Checking mobiletalk gateway');
//     r.addRecord(recordOptions);
//     var dial = r.addDial();
//     dial.addNumber('15099220951');
//     dial.addGetDigits(digitOptions);

//     dial.addWait({length: "13"});
//     r.addSpeak('farts in the woods');
//     r.addHangup();

//     if (hangup) {
//         // res.end("SIP Route hangup callback");
//         // return;
//         console.log('hangup reason: ' + hangup);
//     }

//     res.set({
//         'Content-Type': 'text/xml'
//     });
//     res.end(r.toXML());
// });

app.post('/response/sip/digits/', function(req, res) {
    console.log(req.query);
    var digits = req.param('Digits');
    console.log('got digits: ', digits);
    
    var r = plivo.Response();
    r.addSpeak('you entered a digit, ma sun');
    r.addWait({length: 3});
    res.end(r.toXML());
});


app.post('/response/sip/ringing/', function(req, res) {
    
    console.log('ringing nao. ', req.query);
});

app.post('/response/sip/recording/', function(req, res) {
    console.log('** recording received **');
    var file = req.param('RecordUrl');
    var id = req.param('RecordingID');
    var time = req.param('RecordingStartMs');
    
    if (file && id && time) {
        console.log('got recording. File: ' + file + ' id: ' + id + ' time: ' + time);
    } else {
        console.log('got some request at the url but didnt get the file id and time like expected.');
    }
    
    res.end();
});


app.listen(port);
console.log('Listening on port ' + port);
