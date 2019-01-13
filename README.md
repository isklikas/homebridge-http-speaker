# "homebridge-http-speaker" Plugin


With this plugin you can create HomeKit speaker services which will communicate with your Samsung Soundbar.
This could be handy to outsource the "brains" of the speaker to an separate application, maybe in an entirely different 
language.

## Compatibility notice
The speaker service was introduced within HAP with the release of iOS 10. It is meant for video doorbells to indicate 
that they support audio output. However Apps like the [Eve App](https://itunes.apple.com/app/elgato-eve/id917695792) 
just display the service and you can control your speaker volume. Though neither the Home App nor Siri support controlling
standalone Speaker services.

## Installation
First of all you should already have installed `Homebridge` on your device. Follow the instructions over at the
[HomeBridge Repo](https://github.com/nfarina/homebridge)

To install the `homebridge-http-speaker` plugin simply run `sudo npm install -g homebridge-multiroom-speaker`

### Configuration

Here is an example configuration. Note that the `host` section is the only required one.
(required by HomeKit Accessory Protocol). `port` is fully optional. `power` was included by the original developers and has been kept for future proofing.
The power attribute is not foreseen for the speaker but the Eve App manages to handle this 'abnormal' characteristic.
We will see what the Home App will do with it.


```
    "accessories": [
        {
            "accessory": "MULTIROOM-SPEAKER",
            "name": "Speaker",
            
      		"host": "192.168.0.40",
      		"port": "55001",
            
            "power": {
                "statusUrl": "http://localhost/api/powerStatus",
                "onUrl": "http://localhost/api/powerOn",
                "offUrl": "http://localhost/api/powerOff"
            }
        }
    ]
```
