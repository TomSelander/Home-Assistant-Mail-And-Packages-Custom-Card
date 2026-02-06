const fireEvent = (node, type, detail, options) => {
    options = options || {};
    detail = detail === null || detail === undefined ? {} : detail;
    const event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed,
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
};

if (
    !customElements.get("ha-switch") &&
    customElements.get("paper-toggle-button")
) {
    customElements.define("ha-switch", customElements.get("paper-toggle-button"));
}

const LitElement = customElements.get("hui-masonry-view") ?
    Object.getPrototypeOf(customElements.get("hui-masonry-view")) :
    Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

export class MailAndPackagesCardEditor extends LitElement {
    setConfig(config) {
        this._config = config;
    }

    static get properties() {
        return {
            hass: {},
            _config: {}
        };
    }

    get _name() {
        return this._config.name || "";
    }

    get _updated() {
        return this._config.updated || "";
    }

    get _deliveries_message() {
        return this._config.deliveries_message || "";
    }

    get _packages_delivered() {
        return this._config.packages_delivered || "";
    }

    get _packages_in_transit() {
        return this._config.packages_in_transit || "";
    }

    get _fedex_packages() {
        return this._config.fedex_packages || "";
    }

    get _ups_packages() {
        return this._config.ups_packages || "";
    }

    get _usps_packages() {
        return this._config.usps_packages || "";
    }

    get _amazon_packages() {
        return this._config.amazon_packages || "";
    }

    get _usps_mail() {
        return this._config.usps_mail || "";
    }

    get _gif_sensor() {
        return this._config.gif_sensor || "";
    }

    get _amazon_camera() {
        return this._config.amazon_camera || "";
    }

    get _fedex_camera() {
        return this._config.fedex_camera || "";
    }

    get _usps_camera() {
        return this._config.usps_camera || "";
    }

    get _ups_camera() {
        return this._config.ups_camera || "";
    }

    get _image() {
        return this._config.image !== false;
    }

    get _camera() {
        return this._config.camera !== false;
    }

    get _enable_camera_rotation() {
        return this._config.enable_camera_rotation === true;
    }

    get _details() {
        return this._config.details !== false;
    }

    get _enable_links() {
        return this._config.enable_links !== false;
    }

    render() {
        if (!this.hass) {
            return html ``;
        }

        const entities = Object.keys(this.hass.states).filter(
            (eid) => eid.substr(0, eid.indexOf(".")) === "sensor"
        );

        const camera_entities = Object.keys(this.hass.states).filter(
            (eid) => eid.substr(0, eid.indexOf(".")) === "camera"
        );

        return html `
      <div class="card-config">
    Version: 0.07
        <div>
          <paper-input
            label="Name"
            .value="${this._name}"
            .configValue="${"name"}"
            @value-changed="${this._valueChanged}"
          ></paper-input>
            <ha-switch
            .checked=${this._details}
            .configValue="${"details"}"
            @change="${this._valueChanged}"
            >Show Details</ha-switch>
          <div class="switch-row">
            <div class="switch-label">Enable Text Links</div>
            <ha-switch
              .checked=${this._enable_links}
              .configValue="${"enable_links"}"
              @change="${this._valueChanged}"
            ></ha-switch>
          </div>
          ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="Mail Updated Sensor"
                  .hass="${this.hass}"
                  .value="${this._updated}"
                  .configValue=${"updated"}
                  domain-filter="sensor"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="Mail Updated Sensor"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"updated"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${entities.indexOf(this._updated)}"
                  >
                    ${entities.map((updated) => {
                      return html`
                        <paper-item>${updated}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}
          <paper-input
            label="Delivery Message (plain text or sensor entity)"
            .value="${this._deliveries_message}"
            .configValue="${"deliveries_message"}"
            @value-changed="${this._valueChanged}"
            placeholder="e.g., 'You have deliveries!' or 'sensor.delivery_message'"
          ></paper-input>
         ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="Packages Delivered Sensor"
                  .hass="${this.hass}"
                  .value="${this._packages_delivered}"
                  .configValue=${"packages_delivered"}
                  domain-filter="sensor"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="Packages Delivered Sensor"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"packages_delivered"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${entities.indexOf(this._packages_delivered)}"
                  >
                    ${entities.map((packages_delivered) => {
                      return html`
                        <paper-item>${packages_delivered}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}
          ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="Packages In Transit Sensor"
                  .hass="${this.hass}"
                  .value="${this._packages_in_transit}"
                  .configValue=${"packages_in_transit"}
                  domain-filter="sensor"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="Packages In Transit Sensor"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"packages_in_transit"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${entities.indexOf(this._packages_in_transit)}"
                  >
                    ${entities.map((packages_in_transit) => {
                      return html`
                        <paper-item>${packages_in_transit}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}
              ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="FedEx Package Sensor"
                  .hass="${this.hass}"
                  .value="${this._fedex_packages}"
                  .configValue=${"fedex_packages"}
                  domain-filter="sensor"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="FedEx Package Sensor"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"fedex_packages"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${entities.indexOf(this._fedex_packages)}"
                  >
                    ${entities.map((fedex_packages) => {
                      return html`
                        <paper-item>${fedex_packages}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}
              ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="UPS Package Sensor"
                  .hass="${this.hass}"
                  .value="${this._ups_packages}"
                  .configValue=${"ups_packages"}
                  domain-filter="sensor"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="UPS Package Sensor"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"ups_packages"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${entities.indexOf(this._ups_packages)}"
                  >
                    ${entities.map((ups_packages) => {
                      return html`
                        <paper-item>${ups_packages}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}
              ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="USPS Package Sensor"
                  .hass="${this.hass}"
                  .value="${this._usps_packages}"
                  .configValue=${"usps_packages"}
                  domain-filter="sensor"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="USPS Package Sensor"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"usps_packages"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${entities.indexOf(this._usps_packages)}"
                  >
                    ${entities.map((usps_packages) => {
                      return html`
                        <paper-item>${usps_packages}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}
              ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="Amazon Package Sensor"
                .hass="${this.hass}"
                .value="${this._amazon_packages}"
                .configValue=${"amazon_packages"}
                domain-filter="sensor"
                @change="${this._valueChanged}"
                allow-custom-entity
              ></ha-entity-picker>
            `
          : html`
              <paper-dropdown-menu
                label="Amazon Package Sensor"
                @value-changed="${this._valueChanged}"
                .configValue="${"amazon_packages"}"
              >
                <paper-listbox
                  slot="dropdown-content"
                  .selected="${entities.indexOf(this._amazon_packages)}"
                >
                  ${entities.map((amazon_packages) => {
                    return html`
                      <paper-item>${amazon_packages}</paper-item>
                    `;
                  })}
                </paper-listbox>
              </paper-dropdown-menu>
            `}
            ${customElements.get("ha-entity-picker")
          ? html`
              <ha-entity-picker
                label="USPS Mail Sensor"
                  .hass="${this.hass}"
                  .value="${this._usps_mail}"
                  .configValue=${"usps_mail"}
                  domain-filter="sensor"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="USPS Mail Sensor"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"usps_mail"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${entities.indexOf(this._usps_mail)}"
                  >
                    ${entities.map((usps_mail) => {
                      return html`
                        <paper-item>${usps_mail}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}
          <ha-switch
            .checked=${this._image}
            .configValue="${"image"}"
            @change="${this._valueChanged}"
            >Show Image</ha-switch
          >
            ${customElements.get("ha-entity-picker")
          ? html`
              <ha-entity-picker
                label="GIF Sensor"
                  .hass="${this.hass}"
                  .value="${this._gif_sensor}"
                  .configValue=${"gif_sensor"}
                  domain-filter="sensor"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="GIF Sensor"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"gif_sensor"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${entities.indexOf(this._gif_sensor)}"
                  >
                    ${entities.map((gif_sensor) => {
                      return html`
                        <paper-item>${gif_sensor}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}

        <div class="switch-row">
            <div class="switch-label">Show Camera</div>
            <ha-switch
              .checked=${this._camera}
              .configValue="${"camera"}"
              @change="${this._valueChanged}"
            ></ha-switch>
          </div>

        ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="Amazon Camera Entity"
                  .hass="${this.hass}"
                  .value="${this._amazon_camera}"
                  .configValue=${"amazon_camera"}
                  domain-filter="camera"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="Amazon Camera Entity"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"amazon_camera"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${camera_entities.indexOf(this._amazon_camera)}"
                  >
                    ${camera_entities.map((camera_entity) => {
                      return html`
                        <paper-item>${camera_entity}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}

        ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="FedEx Camera Entity"
                  .hass="${this.hass}"
                  .value="${this._fedex_camera}"
                  .configValue=${"fedex_camera"}
                  domain-filter="camera"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="FedEx Camera Entity"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"fedex_camera"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${camera_entities.indexOf(this._fedex_camera)}"
                  >
                    ${camera_entities.map((camera_entity) => {
                      return html`
                        <paper-item>${camera_entity}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}

        ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="USPS Camera Entity"
                  .hass="${this.hass}"
                  .value="${this._usps_camera}"
                  .configValue=${"usps_camera"}
                  domain-filter="camera"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="USPS Camera Entity"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"usps_camera"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${camera_entities.indexOf(this._usps_camera)}"
                  >
                    ${camera_entities.map((camera_entity) => {
                      return html`
                        <paper-item>${camera_entity}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}

        ${customElements.get("ha-entity-picker")
            ? html`
                <ha-entity-picker
                label="UPS Camera Entity"
                  .hass="${this.hass}"
                  .value="${this._ups_camera}"
                  .configValue=${"ups_camera"}
                  domain-filter="camera"
                  @change="${this._valueChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              `
            : html`
                <paper-dropdown-menu
                  label="UPS Camera Entity"
                  @value-changed="${this._valueChanged}"
                  .configValue="${"ups_camera"}"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    .selected="${camera_entities.indexOf(this._ups_camera)}"
                  >
                    ${camera_entities.map((camera_entity) => {
                      return html`
                        <paper-item>${camera_entity}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              `}

        <div class="switch-row">
            <div class="switch-label">Enable Camera Rotation</div>
            <ha-switch
              .checked=${this._enable_camera_rotation}
              .configValue="${"enable_camera_rotation"}"
              @change="${this._valueChanged}"
            ></ha-switch>
          </div>
        </div>
      </div>
    `;
    }

    _valueChanged(ev) {
        if (!this._config || !this.hass) {
            return;
        }
        const target = ev.target;
        if (this[`_${target.configValue}`] === target.value) {
            return;
        }
        if (target.configValue) {
            if (target.value === "") {
                delete this._config[target.configValue];
            } else {
                this._config = {
                    ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
                };
            }
        }
        fireEvent(this, "config-changed", {
            config: this._config
        });
    }

    static get styles() {
        return css `
      ha-switch {
        padding-top: 16px;
      }
      .side-by-side {
        display: flex;
      }
      .side-by-side > * {
        flex: 1;
        padding-right: 4px;
      }
      .switch-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
      }
      .switch-label {
        font-size: 14px;
        color: var(--primary-text-color);
        padding-right: 8px;
      }
    `;
    }
}

customElements.define("mail-and-packages-card-editor", MailAndPackagesCardEditor);
