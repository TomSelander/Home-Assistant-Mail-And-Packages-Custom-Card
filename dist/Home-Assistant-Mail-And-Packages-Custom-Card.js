const LitElement = customElements.get("hui-masonry-view")
  ? Object.getPrototypeOf(customElements.get("hui-masonry-view"))
  : Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;

// Card version (update here to change displayed version)
const VERSION = "0.07";

const curDatetime = new Date();

const datetime = curDatetime.getMonth().toString() + curDatetime.getDate().toString() + curDatetime.getFullYear().toString() + curDatetime.getHours().toString() + curDatetime.getMinutes().toString();

const fireEvent = (node, type, detail, options) => {
    options = options || {};
    detail = detail === null || detail === undefined ? {} : detail;
    const event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
};

function hasConfigOrEntityChanged(element, changedProps) {
    if (changedProps.has("_config")) {
        return true;
    }

    return true;
}

class MailAndPackagesCard extends LitElement {
    static get properties() {
        return {
            _config: {},
            hass: {},
            _currentCameraIndex: { type: Number }
        };
    }

    static async getConfigElement() {
        await import("./Home-Assistant-Mail-And-Packages-Custom-Card-editor.js");
        return document.createElement("mail-and-packages-card-editor");
    }

    static getStubConfig() {
        return {};
    }

    setConfig(config) {
        if (!config.updated) {
            throw new Error("The sensor sensor.mail_updated is not found or not defined in lovelace.");
        }
        this._config = config;
        this._currentCameraIndex = 0;
    }

    shouldUpdate(changedProps) {
        return hasConfigOrEntityChanged(this, changedProps);
    }

    render() {
        if (!this._config || !this.hass) {
            return html ``;
        }

        this.numberElements = 0;

        const stateObj = this.hass.states[this._config.updated];

        if (!stateObj) {
            return html `
        <style>
          .not-found {
            flex: 1;
            background-color: yellow;
            padding: 8px;
          }
        </style>
        <ha-card>
          <div class="not-found">
            Entity not available: ${this._config.updated}
          </div>
        </ha-card>
      `;
        }

        return html `
      ${this.renderStyle()}
      <ha-card @click="${this._handleClick}">
        ${this._config.details !== false ? this.renderDetails(stateObj) : ""}
        ${this._config.image !== false ? this.renderImage(stateObj) : ""}
        ${this._config.camera !== false ? this.renderCamera(stateObj) : ""}
        <span class="usps_update">V ${VERSION} Checked: ${stateObj.state}</span>
      </ha-card>
    `;
    }

    renderDetails(stateObj) {
        const deliveries_message_config = this._config.deliveries_message || "";
        // Check if it's a sensor entity reference or plain text
        let deliveries_message = false;
        if (deliveries_message_config.includes(".") && deliveries_message_config in this.hass.states) {
            // It's a sensor entity
            deliveries_message = this.hass.states[deliveries_message_config].state;
        } else if (deliveries_message_config && deliveries_message_config.length > 0) {
            // It's plain text
            deliveries_message = deliveries_message_config;
        }
        
        const packages_delivered = this._config.packages_delivered ? this.hass.states[this._config.packages_delivered].state : false;
        const packages_in_transit = this._config.packages_in_transit ? this.hass.states[this._config.packages_in_transit].state : false;
        const fedex_packages = this._config.fedex_packages ? this.hass.states[this._config.fedex_packages].state : false;
        const ups_packages = this._config.ups_packages ? this.hass.states[this._config.ups_packages].state : false;
        const usps_packages = this._config.usps_packages ? this.hass.states[this._config.usps_packages].state : false;
        const amazon_packages = this._config.amazon_packages ? this.hass.states[this._config.amazon_packages].state : false;
        const usps_mail = this._config.usps_mail ? this.hass.states[this._config.usps_mail].state : false;
        const enable_links = this._config.enable_links !== false;
        
        const mail_icon = usps_mail > 0 ? 'mailbox-open-up' : 'mailbox-outline';
        const usps_icon = usps_packages > 0 ? 'package-variant' : 'package-variant-closed';
        const ups_icon = ups_packages > 0 ? 'package-variant' : 'package-variant-closed';
        const fedex_icon = fedex_packages > 0 ? 'package-variant' : 'package-variant-closed';
        const amazon_icon = amazon_packages > 0 ? 'package-variant' : 'package-variant-closed';
 
        this.numberElements++;

        return html `
      <div class="details">

    ${this._config.name
    ? html`
    <div class="title"> ${this._config.name} </div>
    `
    : ""}

    <br>
    <ul class="items space-evenly">
    ${packages_delivered
    ? html`
    <li><span class="mail-ha-icon"><ha-icon icon="mdi:package"></ha-icon>
        </span>Deliveries: ${packages_delivered}</li>
    `
    : ""}
    ${packages_in_transit
    ? html`
    <li><span class="mail-ha-icon"><ha-icon icon="mdi:truck-delivery"></ha-icon>
    </span>In Transit: ${packages_in_transit}</li>
    `
    : ""}
    </ul>
    ${deliveries_message
    ? html`
    <p>${deliveries_message}</p>
    `
    : ""}
    <ul class="items space-center">
    ${usps_mail
        ? html`
        <li class="item"><span class="mail-ha-icon">
        <ha-icon icon="mdi:${mail_icon}"></ha-icon>
        </span>${enable_links ? html`<a href="https://informeddelivery.usps.com/" title="Open the USPS Informed Delivery site" target="_blank"><span class="no-break">Mail: ${usps_mail}</span></a>` : html`<span class="no-break">Mail: ${usps_mail}</span>`}</li>
            `
            : ""}
    ${usps_packages
        ? html`
        <li class="item"><span class="mail-ha-icon">
                <ha-icon icon="mdi:${usps_icon}"></ha-icon>
            </span>${enable_links ? html`<a href="https://informeddelivery.usps.com/" title="Open the USPS Informed Delivery site" target="_blank"><span class="no-break">USPS: ${usps_packages}</span></a>` : html`<span class="no-break">USPS: ${usps_packages}</span>`}</li>
            `
            : ""}
    ${ups_packages
    ? html`
        <li class="item"><span class="mail-ha-icon">
                <ha-icon icon="mdi:${ups_icon}"></ha-icon>
            </span>${enable_links ? html`<a href="https://wwwapps.ups.com/mcdp" title="Open the UPS MyChoice site" target="_blank"><span class="no-break">UPS: ${ups_packages}</span></a>` : html`<span class="no-break">UPS: ${ups_packages}</span>`}</li>
        `
        : ""}
        ${fedex_packages
        ? html`
        <li class="item"><span class="mail-ha-icon">
                <ha-icon icon="mdi:${fedex_icon}"></ha-icon>
            </span>${enable_links ? html`<a href="https://www.fedex.com/apps/fedextracking" title="Open the Fedex site" target="_blank"><span class="no-break">Fedex: ${fedex_packages}</span></a>` : html`<span class="no-break">Fedex: ${fedex_packages}</span>`}</li>
            `
            : ""}
    ${amazon_packages
    ? html`
        <li class="item"><span class="mail-ha-icon">
                <ha-icon icon="mdi:${amazon_icon}"></ha-icon>
            </span>${enable_links ? html`<a href="https://www.amazon.com/gp/css/order-history/" title="Open the Amazon site" target="_blank"><span class="no-break">Amazon: ${amazon_packages}</span></a>` : html`<span class="no-break">Amazon: ${amazon_packages}</span>`}</li>
            `
            : ""}
    </ul>
    </div>
    `;
    }

    renderImage(image) {
        const gif = this._config.gif_sensor;
        if (!image || image.length < 2 || !gif || gif.length < 2) {
            return html ``;
        }
        
        const gif_sensor = this._config.gif_sensor ? this.hass.states[this._config.gif_sensor].state : false;
        const lang = this.hass.selectedLanguage || this.hass.language;

        this.numberElements++;
        return html `
      <img class="MailImg clear" src="${gif_sensor}" />
    `;
    }

    renderCamera(camera) {
        const cameras = {
            amazon: this._config.amazon_camera,
            fedex: this._config.fedex_camera,
            usps: this._config.usps_camera,
            ups: this._config.ups_camera
        };
        
        const enable_rotation = this._config.enable_camera_rotation === true;
        
        if (!camera || camera.length === 0) {
            return html ``;
        }

        // Get package counts for each service
        const amazon_packages = this._config.amazon_packages ? this.hass.states[this._config.amazon_packages]?.state : 0;
        const fedex_packages = this._config.fedex_packages ? this.hass.states[this._config.fedex_packages]?.state : 0;
        const ups_packages = this._config.ups_packages ? this.hass.states[this._config.ups_packages]?.state : 0;
        const usps_packages = this._config.usps_packages ? this.hass.states[this._config.usps_packages]?.state : 0;
        const usps_mail = this._config.usps_mail ? this.hass.states[this._config.usps_mail]?.state : 0;

        // Build array of cameras that have packages/mail
        const activeCameras = [];
        if (amazon_packages > 0 && cameras.amazon) activeCameras.push({ service: 'amazon', entity: cameras.amazon });
        if (fedex_packages > 0 && cameras.fedex) activeCameras.push({ service: 'fedex', entity: cameras.fedex });
        if (ups_packages > 0 && cameras.ups) activeCameras.push({ service: 'ups', entity: cameras.ups });
        if ((usps_packages > 0 || usps_mail > 0) && cameras.usps) activeCameras.push({ service: 'usps', entity: cameras.usps });

        // store active cameras so click handler can use them
        this._activeCameras = activeCameras;

        if (activeCameras.length === 0) {
            return html ``;
        }

        // always use the current index (mod length) so clicks advance the visible camera
        let cameraIndex = this._currentCameraIndex % activeCameras.length;
        
        if (enable_rotation && activeCameras.length > 1) {
            // Cycle to next camera every 30 seconds
            setTimeout(() => {
                this._currentCameraIndex = (this._currentCameraIndex + 1) % activeCameras.length;
                this.requestUpdate();
            }, 30000);
        }

        const selectedCamera = activeCameras[cameraIndex];
        
        if (!selectedCamera || !(selectedCamera.entity in this.hass.states)) {
            return html ``;
        }

        const camera_url = this.hass.states[selectedCamera.entity].attributes.entity_picture;

        this.numberElements++;
        return html `
        <img class="MailImg clear" src="${camera_url}&interval=30" />
    `;
    }

    _handleClick(ev) {
        // if click on a link, let it pass through
        if (ev && ev.target && ev.target.closest && ev.target.closest('a')) {
            return;
        }

        const enableClickCycle = this._config.enable_camera_click_cycle !== false;
        if (enableClickCycle && this._activeCameras && this._activeCameras.length > 1) {
            // advance to next active camera
            this._currentCameraIndex = (this._currentCameraIndex + 1) % this._activeCameras.length;
            this.requestUpdate();
            return;
        }

        fireEvent(this, "hass-more-info", {
            entityId: this._config.updated
        });
    }

    getCardSize() {
        return 3;
    }

    renderStyle() {
        return html `
            <style>
                ha-card {
                    cursor: pointer;
                    margin: auto;
                    padding: 1em;
                    position: relative;
                }

                a {
                    color: var(--secondary-text-color)
                }

                .spacer {
                    padding-top: 1em;
                }

                .clear {
                    clear: both;
                }

                .title {
                    position: relative;
                    font-weight: 300;
                    font-size: 2em;
                    color: var(--primary-text-color);
                }

                .details {
                    margin-bottom: .5em;
                }

                .items {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-wrap: wrap;
                }

                .item {
                    flex: 0 1 30%;
                    margin-bottom: .5rem;
                }
                .no-break {
                    white-space: nowrap;
                }
                .space-center {
                    justify-content: center;
                }
                .space-evenly {
                    justify-content: space-evenly;
                }

                .space-between {
                    justify-content: space-between;
                }

                .mail-clear {
                    clear: both;
                }

                .mail-and-packages {
                    margin: auto;
                    padding-top: 2em;
                    padding-bottom: 2em;
                    padding-left: 2em;
                    padding-right: 2em;
                    position: relative;
                }

                .mail-ha-icon {
                    height: 18px;
                    padding-right: 5px;
                    color: var(--paper-item-icon-color);
                }

                .MailImg {
                    position: relative;
                    width: 100%;
                    height: auto;
                    margin-top: 1em;
                }

                .usps_update {
                    font-size: .7em;
                }
        </style>
    `;
    }

}
customElements.define("mail-and-packages-card", MailAndPackagesCard);