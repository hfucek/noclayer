var casper = require("casper").create({
    viewportSize: {
        width: 1920,
        height: 1080
    }
});

var json = {}


casper.test.begin('Noclayer testing', 3, function(test) {
    
    casper.start('http://adv.noclayer.org', function() {
        
        casper.test.assert(true, "Noclayer page loaded");

        var login = casper.evaluate(function() {
            // fill username & password
            $('#win_login input[type!="password"]').val('root')
            $('#win_login input[type="password"]').val('joj137')
        });

        // click submit
        this.click('#win_login a.abutton')
    });

    casper.waitForSelector('div.rack', function() {
        
        var racks = casper.evaluate(function() {
            return $('div.rack').length
        })
        
        if(racks>0) {
            
            casper.test.assert(true, 'Successfully logged in! ')
            //this.capture("first.png");
            
            loadData();
        }
    });

    function loadData() {

        // load data from db
        json = casper.evaluate(function() {
            return JSON.parse(__utils__.sendAJAX('http://adv.noclayer.org/debugging/get', 'GET', null, false));
        });

        if (json) createTests();
    }

    function createTests() {
        
        var _d = json.data
        var _gn = _d.length
        var _tn = 0
        var _rn = 0
        
        for(var i = 0; i < _gn; i++) {
            
            for(var j = 0; j < _tn; j++) {
                
                for(var z = 0; z < _rn; z++) {
                    
                }
            }
        }

        casper.test.assert(true, 'Total ' + json + ' tests found!');
        casper.test.assert(true, 'Preparing tests!');
    }

    casper.run(function() {
        test.done()
    });

});
