# home-assistant-xiaomi-fan-card
A custom card to integration Xiaomi fans with the Home Assistant lovelace UI

## Inspiration
This custom card is based on the awesome work from the [lovelace-xiaomi-vacuum-card](https://github.com/benct/lovelace-xiaomi-vacuum-card) repository and is written to visualize fans added to Home Assistant via the [Xiaomi_fan](https://github.com/syssi/xiaomi_fan) integration. I tested it with my model 1C fan but it should work with other fans using the same integration.

## Installation
You can manually install this card by adding the xiaomi-fan-card.js to your `<config>/www/` folder.

This card can also be installed via the [HACS]() community store. Install HACS and click the button on the top right. Select "Custom repositories" and add the URL `https://github.com/OliverHi/home-assistant-xiaomi-fan-card`. Now you should be able to find and install this card as `home-assistant-xiaomi-fan-card` via HACS.

## Usage
The card has to be added via the raw configuration editor as yaml. You need to provide the entity id itself, everything else is optional.
```
- type: 'custom:xiaomi-fan-card'
  entity: fan.xiaomi_fan_1c
```
![fan-card-2](https://user-images.githubusercontent.com/9283757/124400052-fd665980-dd1f-11eb-8f06-f795ee0d6eab.PNG)

You can also add the same optional configurations as in the linked xiaomi vacuum card. I personally use the image config to add a background image to the card.
```
- type: 'custom:xiaomi-fan-card'
  entity: fan.xiaomi_fan_1c
  image: /local/img/xiaomi_fan2.jpg
```
![fan-card-1](https://user-images.githubusercontent.com/9283757/124400049-fa6b6900-dd1f-11eb-9f31-31dd6d34704a.PNG)

This image has to be saved in the `<config>/www/img` folder of your Home Assistant installation.

The card shows the power state (on/off), the oscillation state (moving or not), fan speed (level 1 to 3), current mode and the minutes left on the shutdown timer.
The buttons can be used to power the fan on or off (first button), to enable the oscillation (second button), stop it (third button) or set the fan speed levels (button 3 to 6).

## Disclaimer
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Xiaomi Corporation, or any of its subsidiaries or its affiliates. The official Xiaomi website can be found at https://www.mi.com/global/.
