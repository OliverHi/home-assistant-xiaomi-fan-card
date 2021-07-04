# home-assistant-xiaomi-fan-card
A custom card to integration Xiaomi fans with the Home Assistant lovelace UI

## Inspiration
This custom card is based on the awesome work from the [lovelace-xiaomi-vacuum-card](https://github.com/benct/lovelace-xiaomi-vacuum-card) repository and is written to visualize fans added to Home Assistant via the [Xiaomi_fan](https://github.com/syssi/xiaomi_fan) integration. I tested it with my model 1C fan but it should work with other fans using the same integration.

## The card
The card has to be added via the raw configuration editor as yaml. You need to provide the entity id itself, everything else is optional.
```
- type: 'custom:xiaomi-fan-card'
        entity: fan.xiaomi_fan_1c
```
You can also add the same optional configurations as in the linked xiaomi vacuum card. I personally use the image config to add a background image to the card.
```
- type: 'custom:xiaomi-fan-card'
        entity: fan.xiaomi_fan_1c
        image: /local/img/xiaomi_fan2.jpg
```
This image has to be saved in the `<config>/www/img` folder of your Home Assistant installation.

## Installation
You can manually install this card by adding the xiaomi-fan-card.js to your `<config>/www/` folder.

## Disclaimer
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Xiaomi Corporation, or any of its subsidiaries or its affiliates. The official Xiaomi website can be found at https://www.mi.com/global/.
