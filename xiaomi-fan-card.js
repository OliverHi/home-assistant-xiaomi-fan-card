((LitElement) => {
    console.info(
        '%c XIAOMI-FAN-CARD %c 1.0.0 ',
        'color: cyan; background: black; font-weight: bold;',
        'color: darkblue; background: white; font-weight: bold;',
    );

    const state = {
        power: {
            key: 'state',
            label: 'Power: ',
            icon: 'mdi:power',
        },
        oscillating: {
            key: 'oscillate',
            label: 'Oscillating: ',
            icon: 'mdi:rotate-left',
        }
    };

    const attributes = {
        speed: {
            key: 'raw_speed',
            label: 'Fan speed level: ',
        },
        mode: {
            key: 'mode',
            label: 'Modus: ',
        },
        offCountdown: {
            key: 'delay_off_countdown',
            label: 'Minutes left on off countdown: ',
            unit: ' min'
        }
    };

    const buttons = {
        onOff: {
            label: 'On/Off',
            icon: 'mdi:play-pause',
            service: 'fan.toggle'
        },
        swivelOn: {
            label: 'Oscillate',
            icon: 'mdi:rotate-right',
            service: 'fan.oscillate',
            service_data: {
                oscillating: true
            }
        },
        swivelOff: {
            label: 'Stop moving',
            icon: 'mdi:pause',
            service: 'fan.oscillate',
            service_data: {
                oscillating: false
            }
        },
        speed1: {
            label: 'Level 1',
            icon: 'mdi:fan-speed-1',
            service: 'fan.set_preset_mode',
            service_data: {
                preset_mode: 'Level 1'
            }
        },
        speed2: {
            label: 'Level 2',
            icon: 'mdi:fan-speed-2',
            service: 'fan.set_preset_mode',
            service_data: {
                preset_mode: 'Level 2'
            }
        },
        speed3: {
            label: 'Level 3',
            icon: 'mdi:fan-speed-3',
            service: 'fan.set_preset_mode',
            service_data: {
                preset_mode: 'Level 3'
            }
        }
    };

    const compute = {
        trueFalse: v => (v === true ? 'Yes' : (v === false ? 'No' : '-')),
        divide100: v => Math.round(Number(v) / 100),
    }

    const html = LitElement.prototype.html;
    const css = LitElement.prototype.css;

    class XiaomiFanCard extends LitElement {

        static get properties() {
            return {
                _hass: {},
                config: {},
                stateObj: {},
            }
        }

        static get styles() {
            return css`
.background {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.title {
  font-size: 20px;
  padding: 12px 16px 8px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, auto);
  cursor: pointer;
}
.grid-content {
  display: grid;
  align-content: space-between;
  grid-row-gap: 6px;
}
.grid-left {
  text-align: left;
  font-size: 110%;
  padding-left: 10px;
  border-left: 2px solid var(--primary-color);
}
.grid-right {
  text-align: right;
  padding-right: 10px;
  border-right: 2px solid var(--primary-color);
}`;
        }

        render() {
            return this.stateObj ? html`
            <ha-card class="background" style="${this.config.styles.background}">
              ${this.config.show.name ?
                html`<div class="title">${this.config.name || this.stateObj.attributes.friendly_name}</div>`
                : null}
              ${(this.config.show.state || this.config.show.attributes) ? html`
              <div class="grid" style="${this.config.styles.content}" @click="${() => this.fireEvent('hass-more-info')}">
                ${this.config.show.state ? html`
                <div class="grid-content grid-left">
                  ${Object.values(this.config.state).filter(v => v).map(this.renderAttribute.bind(this))}
                </div>` : null}
                ${this.config.show.attributes ? html`
                <div class="grid-content grid-right">
                  ${Object.values(this.config.attributes).filter(v => v).map(this.renderAttribute.bind(this))}
                </div>` : null}
              </div>` : null}
              ${this.config.show.buttons ? html`
              <div class="flex">
                ${Object.values(this.config.buttons).filter(v => v).map(this.renderButton.bind(this))}
              </div>` : null}
            </ha-card>` : html`<ha-card style="padding: 8px 16px">Entity '${this.config.entity}' not available...</ha-card>`;
        }

        renderAttribute(data) {
            const computeFunc = data.compute || (v => v);
            const isValidAttribute = data && data.key in this.stateObj.attributes;
            const isValidEntityData = data && data.key in this.stateObj;

            const value = isValidAttribute
                ? computeFunc(this.stateObj.attributes[data.key]) + (data.unit || '')
                : isValidEntityData
                    ? computeFunc(this.stateObj[data.key]) + (data.unit || '')
                    : this._hass.localize('state.default.unavailable');
            const attribute = html`<div>${data.icon && this.renderIcon(data)}${(data.label || '') + value}</div>`;

            const hasDropdown = `${data.key}_list` in this.stateObj.attributes;

            return (hasDropdown && (isValidAttribute || isValidEntityData))
                ? this.renderDropdown(attribute, data.key)
                : attribute;
        }

        renderIcon(data) {
            const icon = (data.key === 'battery_level' && 'battery_icon' in this.stateObj.attributes)
                ? this.stateObj.attributes.battery_icon
                : data.icon;
            return html`<ha-icon icon="${icon}" style="margin-right: 10px; ${this.config.styles.icon}"></ha-icon>`;
        }

        renderButton(data) {
            return data && data.show !== false
                ? html`<ha-icon-button
                    @click="${() => this.callService(data.service, data.service_data)}"
                    icon="${data.icon}"
                    title="${data.label || ''}"
                    style="${this.config.styles.icon}"></ha-icon-button>`
                : null;
        }

        renderDropdown(attribute, key) {
            const selected = this.stateObj.attributes[key];
            const list = this.stateObj.attributes[`${key}_list`];

            return html`
              <paper-menu-button slot="dropdown-trigger" @click="${e => e.stopPropagation()}" style="padding: 0">
                <paper-button slot="dropdown-trigger">${attribute}</paper-button>
                <paper-listbox slot="dropdown-content" selected="${list.indexOf(selected)}" @click="${e => this.handleChange(e, key)}">
                  ${list.map(item => html`<paper-item value="${item}" style="text-shadow: none;">${item}</paper-item>`)}
                </paper-listbox>
              </paper-menu-button>
            `;
        }

        getCardSize() {
            if (this.config.show.name && this.config.show.buttons) return 4;
            if (this.config.show.name || this.config.show.buttons) return 3;
            return 2;
        }

        shouldUpdate(changedProps) {
            return changedProps.has('stateObj');
        }

        setConfig(config) {
            if (!config.entity) throw new Error('Please define an entity.');
            if (config.entity.split('.')[0] !== 'fan') throw new Error('Please define a fan entity.');

            this.config = {
                name: config.name,
                entity: config.entity,
                show: {
                    name: config.name !== false,
                    state: config.state !== false,
                    attributes: config.attributes !== false,
                    buttons: config.buttons !== false,
                },
                buttons: this.deepMerge(buttons, config.buttons),
                state: this.deepMerge(state, config.state),
                attributes: this.deepMerge(attributes, config.attributes),
                styles: {
                    background: config.image ? `background-image: url('${config.image}'); color: white; text-shadow: 0 0 10px black;` : '',
                    icon: `color: ${config.image ? 'white' : 'var(--paper-item-icon-color)'};`,
                    content: `padding: ${config.name !== false ? '8px' : '16px'} 16px ${config.buttons !== false ? '8px' : '16px'};`,
                },
            };
        }

        set hass(hass) {
            if (hass && this.config) {
                this.stateObj = this.config.entity in hass.states ? hass.states[this.config.entity] : null;
            }
            this._hass = hass;
        }

        handleChange(e, key) {
            const mode = e.target.getAttribute('value');
            this.callService(`fan.set_${key}`, {entity_id: this.stateObj.entity_id, [key]: mode});
        }

        callService(service, data) {
            if (!data ||!data.entity_id) {
                data.entity_id = this.stateObj.entity_id;
            }
            const [domain, name] = service.split('.');
            this._hass.callService(domain, name, data);
        }

        fireEvent(type, options = {}) {
            const event = new Event(type, {
                bubbles: options.bubbles || true,
                cancelable: options.cancelable || true,
                composed: options.composed || true,
            });
            event.detail = {entityId: this.stateObj.entity_id};
            this.dispatchEvent(event);
        }

        deepMerge(...sources) {
            const isObject = (obj) => obj && typeof obj === 'object';
            const target = {};

            sources.filter(source => isObject(source)).forEach(source => {
                Object.keys(source).forEach(key => {
                    const targetValue = target[key];
                    const sourceValue = source[key];

                    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                        target[key] = targetValue.concat(sourceValue);
                    } else if (isObject(targetValue) && isObject(sourceValue)) {
                        target[key] = this.deepMerge(Object.assign({}, targetValue), sourceValue);
                    } else {
                        target[key] = sourceValue;
                    }
                });
            });

            return target;
        }
    }

    customElements.define('xiaomi-fan-card', XiaomiFanCard);
})(window.LitElement || Object.getPrototypeOf(customElements.get("hui-masonry-view") || customElements.get("hui-view")));