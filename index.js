"use strict";

var Service, Characteristic, sm;
const SamsungMultiroom = require('samsung-multiroom');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-multiroom-speaker', 'MultiroomSpeaker', MULTIROOM_SPEAKER);
};

function MULTIROOM_SPEAKER(log, config, api) {
    this.log = log;
    this.host = config['host'];
    this.name = config['name'];
    this.port = config['port'] || 55001;

    sm = new SamsungMultiroom({
        host: this.host,
        port: this.port
    });

    this.volume = {};
    this.mute = {};
    
    this.speakerService = new Service.Speaker(this.name, "speakerService");
    
    this.log("... configuring mute characteristic");
        this.speakerService
            .getCharacteristic(Characteristic.Mute)
            .on("get", this.getMuteState.bind(this))
            .on("set", this.setMuteState.bind(this));

        this.log("... adding volume characteristic");
        this.speakerService
            .addCharacteristic(new Characteristic.Volume())
            .on("get", this.getVolume.bind(this))
            .on("set", this.setVolume.bind(this));


        this.informationService = new Service.AccessoryInformation(this.name, "speakerService");

        this.informationService
            .setCharacteristic(Characteristic.Manufacturer, "Samsung")
            .setCharacteristic(Characteristic.Model, "Samsung Soundbar")
            .setCharacteristic(Characteristic.SerialNumber, "SP01")
            .setCharacteristic(Characteristic.FirmwareRevision, "1.1.0");
            
    
    /*Future proof
    this.power = { enabled: false };

    if (config.power) { // if power is configured enable it
        this.power.enabled = true;
    }
    */
}

MULTIROOM_SPEAKER.prototype = {

    getServices: function () {
        this.log("Creating speaker!");

        var informationService = new Service.AccessoryInformation(this.name, "speakerService");

        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Samsung")
            .setCharacteristic(Characteristic.Model, "Samsung Soundbar")
            .setCharacteristic(Characteristic.SerialNumber, "SP01")
            .setCharacteristic(Characteristic.FirmwareRevision, "1.1.0");

        return [informationService, this.speakerService];
    },

    getMuteState: function (callback) {
        sm.getMute( (error, mute) => {
        if(error){
            this.log(`${this.name} speaker couldn't return mute state.`);
            return callback(null, false);
        }

        this.log(`${this.name} speaker muted: %s`, mute ? "Yes" : "No");

        callback(null, !mute);
    });
    },

    setMuteState: function (state, callback) {
        sm.setMute(!state, (error, mute) => {
        	if(error){
            	this.log(`${this.name} speaker couldn't set mute state.`);
            	return callback(null, false);
        	}

        	this.log(`${this.name} speaker muted: %s`, !state ? "Yes" : "No");
        	callback(null, true);
    	});
    },

    getPowerState: function (callback) {
        this.log.warn("Ignoring getPowerState() request, 'power.statusUrl' is not defined!");
        callback(new Error("No 'power.statusUrl' defined!"));
        return;
        
        /*
        if (!this.power.statusUrl) {
            this.log.warn("Ignoring getPowerState() request, 'power.statusUrl' is not defined!");
            callback(new Error("No 'power.statusUrl' defined!"));
            return;
        }
		
		
		For future versions:
        this._httpRequest(this.power.statusUrl, "", "GET", function (error, response, body) {
            if (error) {
                this.log("getPowerState() failed: %s", error.message);
                callback(error);
            }
            else if (response.statusCode !== 200) {
                this.log("getPowerState() request returned http error: %s", response.statusCode);
                callback(new Error("getPowerState() returned http error " + response.statusCode));
            }
            else {
                const powered = parseInt(body) > 0;
                this.log("Speaker is currently %s", powered? "OM": "OFF");

                callback(null, powered);
            }
        }.bind(this));
        */
        
    },

    setPowerState: function (power, callback) {
		
		this.log.warn("Ignoring setPowerState() request, 'power.onUrl' or 'power.offUrl' is not defined!");
        callback(new Error("No 'power.onUrl' or 'power.offUrl' defined!"));
        return;
		
		/* For future versions
        if (!this.power.onUrl || !this.power.offUrl) {
            this.log.warn("Ignoring setPowerState() request, 'power.onUrl' or 'power.offUrl' is not defined!");
            callback(new Error("No 'power.onUrl' or 'power.offUrl' defined!"));
            return;
        }
		
        const url = power ? this.power.onUrl : this.power.offUrl;

        this._httpRequest(url, "", this.power.httpMethod, function (error, response, body) {
            if (error) {
                this.log("setPowerState() failed: %s", error.message);
                callback(error);
            }
            else if (response.statusCode !== 200) {
                this.log("setPowerState() request returned http error: %s", response.statusCode);
                callback(new Error("setPowerState() returned http error " + response.statusCode));
            }
            else {
                this.log("setPowerState() successfully set power state to %s", power? "ON": "OFF");

                callback(undefined, body);
            }
        }.bind(this));
        */
    },

    getVolume: function (callback) {
        sm.getVolume( (error, volume) => {
        	if(error){
            	this.log(`${this.name} speaker couldn't return volume.`);
            	return callback(null, false);
        	}

        	this.log(`${this.name} speaker volume: ${volume}`);
        	callback(null, parseInt(volume));
    	});
    },

    setVolume: function (level, callback) {
        sm.setVolume(level, (error, mute) => {
        	if(error){
            	this.log(`${this.name} speaker couldn't set volume to ${level}.`);
            	return callback(null, false);
        	}

        	this.log(`${this.name} speaker set volume to ${level}.`);
        	callback(null, true);
    	});
    },
    
    getServices: function() {
    	return [this.speakerService];
    }
    //Future proofing
    /*,

    _httpRequest: function (url, body, method, callback) {
        request(
            {
                url: url,
                body: body,
                method: method,
                rejectUnauthorized: false
            },
            function (error, response, body) {
                callback(error, response, body);
            }
        )
    }
	*/
};