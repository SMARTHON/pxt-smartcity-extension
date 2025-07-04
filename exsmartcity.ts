

//% weight=20 color=#000000 block="SmartCity Extension"
namespace SmartCityExtension {
    //---Smart living-----------------------------------------------
    //---motor fan--------------------------------
    //% blockId="smarthon_motorfan"
    //% block="Set Motor Fan to intensity %intensity at %pin"
    //% intensity.min=0 intensity.max=1023
    //% weight=90
    //% blockHidden=false
    //% subcategory="Smart living"
    export function TurnMotorFan(intensity: number, pin: AnalogPin): void {
        pins.analogWritePin(pin, intensity);
    }
    //---motor fan--------------------------------

    //---flame sensor--------------------------------
    /** 
     * Read the detection result of flame sensor, return true when detect flame, otherwise return false
     */
    //% blockId="smarthon_get_flame" 
    //% block="Get flame detection at Pin %pin"
    //% subcategory="Smart living"
    //% weight=45	
    export function getFlame(pin: DigitalPin): boolean {
        flame_variable = pins.digitalReadPin(pin)
        if (flame_variable == 1) {
            return true;
        }
        else { return false; }
    }
    //---flame sensor--------------------------------

    //---button--------------------------------
    /**
     * When the Pin is pressed, it will trigger the function inside the block
     */

    //% blockId="button" 
    //% block="When Button at %pin pressed"	 
    //% subcategory="Smart living"
    //% weight=10
    export function Button(pin: PressButtonList, handler: () => void) {
        let buttonName;
        switch (pin) {
            case PressButtonList.b0:
                buttonName = DigitalPin.P0
                break
            case PressButtonList.b1:
                buttonName = DigitalPin.P1
                break
            case PressButtonList.b2:
                buttonName = DigitalPin.P2
                break
            /*
            case PressButtonList.b12:
                buttonName = DigitalPin.P12
                break
            case PressButtonList.b13:
                buttonName = DigitalPin.P13
                break
            case PressButtonList.b14:
                buttonName = DigitalPin.P14
                break
            case PressButtonList.b15:
                buttonName = DigitalPin.P15
                break
            */
            default:
                buttonName = DigitalPin.P0
                break
        }
        pins.onPulsed(buttonName, PulseValue.High, handler)
    }
    //---button--------------------------------

    //---servo360--------------------------------
    export enum ServoSpeed {
        //% blockId=servo360_level_0
        //% block="Stop"
        level0 = 0,
        //% blockId=servo360_level_1
        //% block="Level 1"
        level1 = 1,
        //% blockId=servo360_level_2
        //% block="Level 2"
        level2 = 2,
        //% blockId=servo360_level_3
        //% block="Level 3"
        level3 = 3
    }
    /**
     * Control the 360 degree servo to rotate with direction and Speed
     * 
     */

    //% blockId="smarthon_360_servo"
    //% block="Turn 360° Servo with %direction direction|speed %speed at %pin"
    //% weight=42
    //% subcategory="Smart living"

    export function Turn360Servo(direction: ServoDirection, speed: ServoSpeed, pin: AnalogPin): void {

        switch (direction) {

            case ServoDirection.clockwise:
                switch (speed) {
                    case ServoSpeed.level0:
                        pins.servoWritePin(pin, 90)
                        break
                    case ServoSpeed.level1:
                        pins.servoWritePin(pin, 83)
                        break
                    case ServoSpeed.level2:
                        pins.servoWritePin(pin, 82)
                        break
                    case ServoSpeed.level3:
                        pins.servoWritePin(pin, 80)
                        break
                }
                break

            case ServoDirection.anticlockwise:
                switch (speed) {
                    case ServoSpeed.level0:
                        pins.servoWritePin(pin, 90)
                        break
                    case ServoSpeed.level1:
                        pins.servoWritePin(pin, 96)
                        break
                    case ServoSpeed.level2:
                        pins.servoWritePin(pin, 97)
                        break
                    case ServoSpeed.level3:
                        pins.servoWritePin(pin, 98)
                        break
                }
                break
        }
    }
    //---servo360--------------------------------
    //---Smart living-----------------------------------------------



    //---Green Engineering------------------------------------------
    //---PM2.5 sensor--------------------------------
    /**
      * get PM2.5 value
      * @param PM25pin describe parameter here, eg: AnalogPin.P0
      */
    //% blockId="readPM25Value" block="value of PM2.5 sensor at pin %PM25pin"
    //% subcategory="Green Engineering"
    //% weight=59
    export function ReadPM25Value(PM25pin: DigitalPin): number {
        let pm25 = 0
        while (pins.digitalReadPin(PM25pin) != 0) {
        }//low
        while (pins.digitalReadPin(PM25pin) != 1) {
        }//high
        pm25 = input.runningTime()//start TimeHigh
        while (pins.digitalReadPin(PM25pin) != 0) {
        }//low
        pm25 = input.runningTime() - pm25   //End TimeHigh
        //now var pm25 = TH
        //Since the the formula P(ug/m3)=1000*(TH)/(TH+TL)
        //TH+TL assume is 1000ms, so P=1000*TH/1000=TH
        return pm25;
    }
    //---PM2.5 sensor--------------------------------
    //---CO2 sensor--------------------------------
    function indenvGasReady(): boolean {
        if (TVOC_OK != true) {
            return false
        }
        //pins.setPull(DigitalPin.P19, PinPullMode.PullUp)
        //pins.setPull(DigitalPin.P20, PinPullMode.PullUp)
        //basic.pause(200)
        pins.i2cWriteNumber(90, 0, NumberFormat.UInt8LE, true)
        //basic.pause(200)
        if ((pins.i2cReadNumber(90, NumberFormat.UInt8LE, false) % 16) != 8) {
            return false
        }
        return true
    }
	/**
    * CO2 and TVOC Sensor (CCS811) Start
    */
    //% blockId="indenvStart" block="CCS811 Start"
	//% group="CO2 and TVOC Sensor (CCS811)"
    //% subcategory="Green Engineering"
    //% weight=40
    export function indenvStart(): void {
        TVOC_OK = true
        //pins.setPull(DigitalPin.P19, PinPullMode.PullUp)
        //pins.setPull(DigitalPin.P20, PinPullMode.PullUp)
        //basic.pause(200)
        //basic.pause(200)
        /* CJMCU-8118 CCS811 addr 0x5A reg 0x20 Read Device ID = 0x81 */
        pins.i2cWriteNumber(90, 32, NumberFormat.UInt8LE, true)
        //basic.pause(200)
        if (pins.i2cReadNumber(90, NumberFormat.UInt8LE, false) != 129) {
            TVOC_OK = false
        }
        basic.pause(200)
        /* CJMCU-8118 AppStart CCS811 addr 0x5A register 0xF4 */
        pins.i2cWriteNumber(90, 244, NumberFormat.UInt8LE, false)
        //basic.pause(200)
        /* CJMCU-8118 CCS811 Driving Mode 1 addr 0x5A register 0x01 0x0110 */
        pins.i2cWriteNumber(90, 272, NumberFormat.UInt16BE, false)
        basic.pause(200)
        /* CJMCU-8118 CCS811 Status addr 0x5A register 0x00 return 1 byte */
        pins.i2cWriteNumber(90, 0, NumberFormat.UInt8LE, true)
        //basic.pause(200)
        if (pins.i2cReadNumber(90, NumberFormat.UInt8LE, false) % 2 != 0) {
            TVOC_OK = false
        }
        basic.pause(200)
        pins.i2cWriteNumber(90, 0, NumberFormat.UInt8LE, true)
        //basic.pause(200)
        if (Math.idiv(pins.i2cReadNumber(90, NumberFormat.UInt8LE, false), 16) != 9) {
            TVOC_OK = false
        }
        basic.pause(200)
    }
	/**
     * Set TVOC and CO2 baseline (Baseline should be a decimal value)
     * @param value  , eg: 33915
     */
	//% group="CO2 and TVOC Sensor (CCS811)"
    //% subcategory="Green Engineering"
    //% blockId=CCS811_setBaseline block="set CO2 and TVOC baseline|%value value"
	//% weight=39
	export function setBaseline(value: number): void {
        let buffer: Buffer = pins.createBuffer(3);
        buffer[0] = 0x20;
        buffer[1] = value >> 8 & 0xff;
        buffer[2] = value & 0xff;
        pins.i2cWriteBuffer(90, buffer);

    }
	/**
    * Read estimated CO2
    */
	//% group="CO2 and TVOC Sensor (CCS811)"
    //% subcategory="Green Engineering"
    //% blockId="indenvgeteCO2" block="Value of CO2"
	//% weight=38
    export function indenvgeteCO2(): number {

        let i

        i = 0

        while (indenvGasReady() != true) {
            basic.pause(200)
            i = i + 1
            if (i >= 10)
                return -1;
        }
        //pins.setPull(DigitalPin.P19, PinPullMode.PullUp)
        //pins.setPull(DigitalPin.P20, PinPullMode.PullUp)
        //basic.pause(200)
        pins.i2cWriteNumber(90, 2, NumberFormat.UInt8LE, true)
        //basic.pause(200)
        return pins.i2cReadNumber(90, NumberFormat.UInt16BE, false)
    }
	/**
    * Read Total VOC
    */
	//% group="CO2 and TVOC Sensor (CCS811)"
    //% blockId="indenvgetTVOC" block="Value of TVOC"
	//% weight=37
    export function indenvgetTVOC(): number {

        let i = 0;
        while (indenvGasReady() != true) {
            basic.pause(200)
            i = i + 1
            if (i >= 10)
                return -1;
        }
        //pins.setPull(DigitalPin.P19, PinPullMode.PullUp)
        //pins.setPull(DigitalPin.P20, PinPullMode.PullUp)
        //basic.pause(200)
        pins.i2cWriteNumber(90, 2, NumberFormat.UInt8LE, true)
        //basic.pause(200)
        return (pins.i2cReadNumber(90, NumberFormat.UInt32BE, false) % 65536)
    }
    //---CO2 sensor--------------------------------
    //---water quality sensor--------------------------------



    //---water quality sensor--------------------------------
    //---sunlight board--------------------------------
    let battery_level = 0

    //% subcategory="Green Engineering"
    //% weight=80
    //% group="Sunlight Charging"
    //% blockId="smarthon_read_battery_level"
    //% block="Read battery level (percentage) at Pin %pin"

    export function readBattery(pin: AnalogPin): void {
        let max = 1023;   // define the max reading from battery
        let min = 706;   // define the min reading from battery
        let sum = 0;

        //  read 30 times to get the average
        for (let n = 0; n < 30; n++) {
            sum += pins.analogReadPin(pin);
            basic.pause(10);
        }
        let avg = sum / 30;
        // OLED.writeNumNewLine(avg);

        if (avg > min && avg < max) {
            battery_level = Math.ceil(
                pins.map(avg, min, max, 0, 100) / 5) * 5;
            //  round up to multiple of 5
        }
        else if (avg > max) {
            battery_level = 100;
        }
        else {
            battery_level = 0;
        }
    }

    //% subcategory="Green Engineering"
    //% weight=70
    //% group="Sunlight Charging"
    //% blockId="smarthon_get_energy_transferred"
    //% block="Get battery level(percentage)"
    export function getBattery(): number {
        return battery_level;
    }

    //% subcategory="Green Engineering"
    //% weight=69
    //% group="Sunlight Charging"
    //% blockId="smarthon_get_energy_transferred"
    //% block="Get energy transferred (kWh)"

    export function getEnergyTransferred(): number {
        return battery_level * 0.00814;
    }

    //% subcategory="Green Engineering"
    //% weight=68
    //% group="Sunlight Charging"
    //% blockId="smarthon_get_CO2_Eliminated"
    //% block="Read CO2 Eliminated (ppm)"

    export function readCO2Eliminated(): number {
        return battery_level * 0.00892;
    }
    //---sunlight board--------------------------------
    //---Green Engineering------------------------------------------
    //---Transportation---------------------------------------------
    //---Laser sender--------------------------------
    //% blockId="turn_on/off_laser"
    //% block="Turn the laser to |%state| at %pin"
    //% weight=29
    //% group="Laser"
    //% subcategory="Transportation"
   
    export function turn_laser(state: boolean, pin: DigitalPin): void{
        let on_off = state ? 1 : 0;
        pins.digitalWritePin(pin, on_off)
    }

    //---Laser sender--------------------------------
    //---Laser receiver--------------------------------
    /**
    * det
    */
    //% blockId="smarthon_Laser"
    //% block="Get receiver (laser received or not) at %receiver"
    //% weight=30
	//% group="Laser"
	//% subcategory="Transportation"

    export function Laser(receiver: DigitalPin): boolean {
        if (pins.digitalReadPin(receiver))
            return true;
        else return false;
    }
    //---Laser receiver--------------------------------
    //---IR sensor--------------------------------
    //% blockId="smarthon_IR_detector"
    //% block="Get IR Sensor (object detected or not) at %pin"
    //% weight=70
    //% group="IR Sensor"
    //% subcategory=Transportation


    export function IRdetection(pin: DigitalPin): boolean {
        if (pins.digitalReadPin(pin) == 0)
            return false;
        else return true;
    }
    //---IR sensor--------------------------------
    //---4-digital screen--------------------------------
    let TubeTab: number [] = [
    0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07,
    0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71
    ];
    /**
     *
     */
    export class TM1637
    {
        clkPin: DigitalPin;
        dataPin: DigitalPin;
        brightnessLevel: number;
        pointFlag: boolean;
        buf: Buffer;

        private writeByte(wrData: number)
        {
            for(let i = 0; i < 8; i ++)
            {
                pins.digitalWritePin(this.clkPin, 0);
                if(wrData & 0x01)pins.digitalWritePin(this.dataPin, 1);
                else pins.digitalWritePin(this.dataPin, 0);
                wrData >>= 1;
                pins.digitalWritePin(this.clkPin, 1);
            }

            pins.digitalWritePin(this.clkPin, 0); // Wait for ACK
            pins.digitalWritePin(this.dataPin, 1);
            pins.digitalWritePin(this.clkPin, 1);
        }

        private start()
        {
            pins.digitalWritePin(this.clkPin, 1);
            pins.digitalWritePin(this.dataPin, 1);
            pins.digitalWritePin(this.dataPin, 0);
            pins.digitalWritePin(this.clkPin, 0);
        }

        private stop()
        {
            pins.digitalWritePin(this.clkPin, 0);
            pins.digitalWritePin(this.dataPin, 0);
            pins.digitalWritePin(this.clkPin, 1);
            pins.digitalWritePin(this.dataPin, 1);
        }

        private coding(dispData: number): number
        {
            let pointData = 0;

            if(this.pointFlag == true)pointData = 0x80;
            else if(this.pointFlag == false)pointData = 0;

            if(dispData == 0x7f)dispData = 0x00 + pointData;
            else dispData = TubeTab[dispData] + pointData;

            return dispData;
        }

        /**
         * Show a 4 digits number on display
         * @param dispData value of number
         */

        //% blockId=tm1637_display_number block="%TM1637 |show number|%dispData"
        //% group="TM1637 4-Digit Display"
        //% subcategory=Display
        show(dispData: number)
        {
            let compare_01:number = dispData % 100;
            let compare_001:number = dispData % 1000;

            if(dispData < 10)
            {
                this.bit(dispData, 3);
                this.bit(0x7f, 2);
                this.bit(0x7f, 1);
                this.bit(0x7f, 0);
            }
            else if(dispData < 100)
            {
                this.bit(dispData % 10, 3);
                if(dispData > 90){
                    this.bit(9, 2);
                } else{
                    this.bit(Math.floor(dispData / 10) % 10, 2);
                }

                this.bit(0x7f, 1);
                this.bit(0x7f, 0);
            }
            else if(dispData < 1000)
            {
                this.bit(dispData % 10, 3);
                if(compare_01 > 90){
                    this.bit(9, 2);
                } else{
                    this.bit(Math.floor(dispData / 10) % 10, 2);
                }
                if(compare_001 > 900){
                    this.bit(9, 1);
                } else{
                    this.bit(Math.floor(dispData / 100) % 10, 1);
                }
                this.bit(0x7f, 0);
            }
            else if(dispData < 10000)
            {
                this.bit(dispData % 10, 3);
                if(compare_01 > 90){
                    this.bit(9, 2);
                } else{
                    this.bit(Math.floor(dispData / 10) % 10, 2);
                }
                if(compare_001 > 900){
                    this.bit(9, 1);
                } else{
                    this.bit(Math.floor(dispData / 100) % 10, 1);
                }
                if(dispData > 9000){
                    this.bit(9, 0);
                } else{
                    this.bit(Math.floor(dispData / 1000) % 10, 0);
                }
            }
            else
            {
                this.bit(9, 3);
                this.bit(9, 2);
                this.bit(9, 1);
                this.bit(9, 0);
            }
        }

        /**
         * Set the brightness level of display at from 0 to 7
         * @param level value of brightness light level
         */
        //% blockId=tm1637_set_display_level block="%TM1637 |brightness level to|%level"
        //% level.min=0 level.max=7
        //% group="TM1637 4-Digit Display"
        //% subcategory=Display
        set(level: number)
        {
            this.brightnessLevel = level;

            this.bit(this.buf[0], 0x00);
            this.bit(this.buf[1], 0x01);
            this.bit(this.buf[2], 0x02);
            this.bit(this.buf[3], 0x03);
        }

        /**
         * Show a single number from 0 to 9 at a specified digit of 4-Digit Display
         * @param dispData value of number
         * @param bitAddr value of bit number
         */
        //% blockId=tm1637_display_bit block="%TM1637 |show single number|%dispData|at digit|%bitAddr"
        //% dispData.min=0 dispData.max=9
        //% bitAddr.min=0 bitAddr.max=3
        //% group="TM1637 4-Digit Display"
        //% subcategory=Display
        bit(dispData: number, bitAddr: number)
        {
            if((dispData == 0x7f) || ((dispData <= 9) && (bitAddr <= 3)))
            {
                let segData = 0;

                segData = this.coding(dispData);
                this.start();
                this.writeByte(0x44);
                this.stop();
                this.start();
                this.writeByte(bitAddr | 0xc0);
                this.writeByte(segData);
                this.stop();
                this.start();
                this.writeByte(0x88 + this.brightnessLevel);
                this.stop();

                this.buf[bitAddr] = dispData;
            }
        }

        /**
         * Turn on or off the colon point on 4-Digit Display
         * @param pointEn value of point switch
         */
        //% blockId=tm1637_display_point block="%TM1637 |turn|%point|colon point"
        //% group="TM1637 4-Digit Display"
        //% subcategory=Display
        point(point: boolean)
        {
            this.pointFlag = point;

            this.bit(this.buf[0], 0x00);
            this.bit(this.buf[1], 0x01);
            this.bit(this.buf[2], 0x02);
            this.bit(this.buf[3], 0x03);
        }

        /**
         * Clear the display
         */
        //% blockId=tm1637_display_clear block="%TM1637|clear"
        //% group="TM1637 4-Digit Display"
        //% subcategory=Display
        clear()
        {
            this.bit(0x7f, 0x00);
            this.bit(0x7f, 0x01);
            this.bit(0x7f, 0x02);
            this.bit(0x7f, 0x03);
        }
    }

    /**
     * Create a new TM1637 object
     * @param clkPin is clk pin, eg: DigitalPin.P14
     * @param dataPin is data pin,eg: DigitalPin.P15
     */
    //% blockId=tm1637_var_create block="TM1637 Display at|%clkPin|and|%dataPin"
    //% group="TM1637 4-Digit Display"
    //% blockSetVariable=TM1637
    //% subcategory=Display
    export function createDisplay(clkPin: DigitalPin, dataPin: DigitalPin): TM1637
    {
        let display = new TM1637();

        display.buf = pins.createBuffer(4);
        display.clkPin = clkPin;
        display.dataPin = dataPin;
        display.brightnessLevel = 0;
        display.pointFlag = false;
        display.clear();

        return display;
    }
    //---4-digital screen--------------------------------
    //---Transportation---------------------------------------------
}