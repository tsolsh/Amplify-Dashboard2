const GATT_DATA_SERVICE = 'f000c0e0-0451-4000-b000-000000000000';
const GATT_DATA_CHARACT = 'f000c0e1-0451-4000-b000-000000000000';
const enc = new TextEncoder();

export default () => {
    var pm, chr, upBuffer = [];
    return {
        byteCount: 0,
        loose() {
            pm.gatt.disconnect();
            pm = null;
        },
        stateChanged: () => {},
        async find() {
            this.stateChanged(pm ? -2 : -1);
            try {
                if (!pm) {
                    pm = await navigator.bluetooth.requestDevice({
                        filters: [{name: 'SMARTrode'}],
                        optionalServices: [/*'battery_service',*/ GATT_DATA_SERVICE]
                    });
                    if (!pm) {
                        this.stateChanged(0);
                        return false;
                    }
                    this.stateChanged(1);
                    pm.addEventListener('gattserverdisconnected', e => { chr = null; this.stateChanged(0, e); });
                }
                chr = await (await (await pm.gatt.connect()).
                      getPrimaryService(GATT_DATA_SERVICE)).
                      getCharacteristic(GATT_DATA_CHARACT);
                chr.addEventListener('characteristicvaluechanged', e => {
                    const data = e.target.value;
                    this.byteCount += data.byteLength;
                    upBuffer.push(data);
                });
                await chr.startNotifications();
                this.stateChanged(2);
            } catch(error) {
                chr = null;
                this.stateChanged(0, error);
                return false;
            }
            return true;
        },
        async write(str) {
            const data = str.split('\n'), gatewayInstructions = [];
            for (let line of data) {
                if (line.length === 0) continue;
                let c = line.charCodeAt(0);
                if (c === 48 || c >= 65 && c <= 122)
                    await chr.writeValue(enc.encode(line + '\n'));
                else
                    gatewayInstructions.push(line);
            }
            return gatewayInstructions;
        },
        read(max) { return upBuffer.splice(0, max || 255); },
        clearBuffer() { return upBuffer.splice(0); },
        canRead() { return upBuffer.length !== 0; }
     };
}