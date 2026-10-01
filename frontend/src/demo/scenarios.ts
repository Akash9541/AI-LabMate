import { DemoScenario } from '../types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'led_polarity',
    title: 'DEMO 1: LED Polarity Swap',
    tagline: '5V breadboard circuit with reversed diode polarity',
    circuit_image: '/demo_led_polarity.svg',
    measurements: [
      { id: 'm1', nodeName: 'Power Rail (VCC)', voltage: '5.02 V', current: '0.00 mA', resistance: 'Open' },
      { id: 'm2', nodeName: 'LED Terminals (Anode-Cathode)', voltage: '0.01 V', current: '0.00 mA', resistance: 'High (Mega-ohms)' },
      { id: 'm3', nodeName: 'Resistor R1 (220Ω)', voltage: '0.00 V', current: '0.00 mA', resistance: '218 Ω' }
    ],
    question: "Why isn't my LED turning on when 5V power is supplied?",
    expected_components: [
      { id: 'c1', type: 'LED', confidence: 0.94, location: 'center-right', status: 'suspicious', coordinates: { x: 55, y: 42, label: 'LED (Reversed Polarity)' } },
      { id: 'c2', type: 'Resistor (220Ω)', confidence: 0.91, location: 'center', status: 'normal', coordinates: { x: 38, y: 42, label: 'R1 (220Ω)' } },
      { id: 'c3', type: 'Power Rail (+5V)', confidence: 0.98, location: 'top-left', status: 'normal', coordinates: { x: 20, y: 25, label: '+5V Rail' } },
      { id: 'c4', type: 'GND Rail', confidence: 0.97, location: 'bottom-right', status: 'normal', coordinates: { x: 75, y: 70, label: 'GND Rail' } }
    ],
    expected_diagnostic: {
      id: 'diag-led-01',
      status: 'POTENTIAL_FAULT',
      fault_category: 'Polarity Mismatch / Wiring Error',
      confidence: 'High',
      confidence_score: 0.92,
      observed: [
        'Red LED detected on breadboard row 15-18',
        '220Ω current-limiting resistor R1 verified in series',
        '+5V rail voltage measured at 5.02V',
        'Voltage across LED terminals measured at 0.01V'
      ],
      likely_cause: 'LED diode polarity is reversed (Anode connected to GND, Cathode to R1/+5V). Reverse-biased diode blocks all current flow.',
      evidence: [
        { label: 'Measured Voltage', text: 'LED terminal voltage is 0.01V (expected 1.8V to 2.2V forward voltage drop).' },
        { label: 'Current Draw', text: 'Circuit current is 0.00 mA despite 5.02V rail supply.' },
        { label: 'Visual Inspection', text: 'Flat notch on LED casing indicates Cathode lead is oriented towards positive rail.' }
      ],
      recommended_checks: [
        'Power down circuit before adjusting wiring.',
        'Remove LED and rotate 180 degrees so long lead (Anode) connects towards R1/+5V.',
        'Verify cathode lead (short lead / flat side) connects to GND.',
        'Re-apply 5V power and measure forward voltage across LED.'
      ],
      next_measurement: {
        parameter: 'Voltage across LED terminals',
        expected_range: '1.8V - 2.2V DC',
        instructions: 'Touch red multimeter probe to LED Anode and black probe to LED Cathode while power is ON.'
      },
      lab_manual_evidence: [
        {
          doc_name: 'EE101_Lab_Manual_Basic_Circuits.pdf',
          page: 14,
          excerpt: 'Light Emitting Diodes (LEDs) are polarized components. Current flows only from Anode (+) to Cathode (-). Reverse biasing prevents conduction and results in zero current flow.',
          relevance_score: 0.96
        }
      ],
      timestamp: new Date().toISOString()
    },
    expected_schematic_diff: {
      reference_name: 'Lab Manual Ex. 1: Basic LED Circuit',
      observed_name: 'Breadboard Image Scan',
      matching_components: ['Resistor R1 (220Ω)', '+5V Supply', 'GND Rail'],
      missing_components: [],
      unexpected_components: [],
      connection_diffs: [
        { from: 'LED Anode', to: 'GND', status: 'incorrect', reason: 'Anode wired to GND instead of +5V rail' },
        { from: 'LED Cathode', to: 'R1 Output', status: 'incorrect', reason: 'Cathode wired towards R1 power side' }
      ],
      confidence: 0.92,
      summary: 'Reversed diode polarity detected between R1 node and GND node.'
    }
  },
  {
    id: 'resistor_issue',
    title: 'DEMO 2: Resistor Value Mismatch',
    tagline: 'Dim LED caused by 10kΩ resistor instead of 220Ω',
    circuit_image: '/demo_resistor.svg',
    measurements: [
      { id: 'm1', nodeName: 'Power Rail (+5V)', voltage: '5.00 V', current: '0.34 mA', resistance: 'Open' },
      { id: 'm2', nodeName: 'LED Terminals', voltage: '1.65 V', current: '0.34 mA', resistance: 'Diode Junction' },
      { id: 'm3', nodeName: 'Resistor R1 (Color: Brn-Blk-Org)', voltage: '3.35 V', current: '0.34 mA', resistance: '9,850 Ω (10kΩ)' }
    ],
    question: "Why is my LED extremely dim and barely visible?",
    expected_components: [
      { id: 'c1', type: 'LED (Red)', confidence: 0.95, location: 'center-right', status: 'normal', coordinates: { x: 60, y: 40, label: 'Red LED' } },
      { id: 'c2', type: 'Resistor (10kΩ)', confidence: 0.89, location: 'center', status: 'suspicious', coordinates: { x: 35, y: 40, label: 'R1 (Color code 10kΩ)' } },
      { id: 'c3', type: 'Power Rail (+5V)', confidence: 0.96, location: 'top-left', status: 'normal', coordinates: { x: 20, y: 25, label: '+5V Rail' } }
    ],
    expected_diagnostic: {
      id: 'diag-resistor-02',
      status: 'POTENTIAL_FAULT',
      fault_category: 'Incorrect Component Value',
      confidence: 'High',
      confidence_score: 0.94,
      observed: [
        'Resistor color bands detected: Brown-Black-Orange-Gold (10,000 Ω)',
        'Schematic calls for 220 Ω current limiting resistor',
        'Measured current is 0.34 mA (required: 15 mA - 20 mA for full brightness)'
      ],
      likely_cause: 'Resistor R1 value is 10kΩ instead of 220Ω. High resistance restricts current to 0.34 mA, causing the LED to emit negligible light.',
      evidence: [
        { label: 'Measured Resistance', text: 'Multimeter reading: 9,850 Ω across R1.' },
        { label: 'Ohm\'s Law Calculation', text: 'I = (5.0V - 1.65V) / 10,000Ω = 0.335 mA.' },
        { label: 'Target Current', text: 'Standard indicator LEDs require 15-20 mA for full luminosity.' }
      ],
      recommended_checks: [
        'Replace R1 (10kΩ) with a 220Ω resistor (Color bands: Red-Red-Brown-Gold).',
        'Verify resistance reading out of circuit before inserting.',
        'Re-measure total circuit current.'
      ],
      next_measurement: {
        parameter: 'Circuit Current (I_total)',
        expected_range: '14.0 mA - 18.0 mA DC',
        instructions: 'Break circuit at power rail and insert multimeter in series set to mA current mode.'
      },
      lab_manual_evidence: [
        {
          doc_name: 'EE101_Lab_Manual_Basic_Circuits.pdf',
          page: 8,
          excerpt: 'For a 5V supply and a 2.0V forward LED drop: R = (5V - 2V) / 0.015A = 200Ω. Use standard 220Ω resistor to achieve ~13.6mA.',
          relevance_score: 0.98
        }
      ],
      timestamp: new Date().toISOString()
    },
    expected_schematic_diff: {
      reference_name: 'Reference Diagram: LED Indicator Circuit',
      observed_name: 'Breadboard Component Inspection',
      matching_components: ['LED1 (Red)', '+5V Rail', 'GND Rail'],
      missing_components: ['Resistor 220Ω'],
      unexpected_components: ['Resistor 10kΩ'],
      connection_diffs: [
        { from: 'R1', to: 'LED Anode', status: 'incorrect', reason: 'Component value mismatch: 10kΩ installed instead of 220Ω' }
      ],
      confidence: 0.94,
      summary: 'Resistor value 10kΩ exceeds specification 220Ω by factor of 45x.'
    }
  },
  {
    id: 'arduino_sensor',
    title: 'DEMO 3: Arduino Sensor Wiring Fault',
    tagline: 'DHT11 sensor pinout inverted (VCC & GND reversed)',
    circuit_image: '/demo_arduino_sensor.svg',
    measurements: [
      { id: 'm1', nodeName: 'Arduino 5V Pin', voltage: '4.95 V', current: '82.5 mA', resistance: 'Rail' },
      { id: 'm2', nodeName: 'Sensor VCC Pin (Physical Pin 1)', voltage: '0.04 V', current: '82.5 mA', resistance: 'Swapped' },
      { id: 'm3', nodeName: 'Sensor GND Pin (Physical Pin 4)', voltage: '4.92 V', current: '82.5 mA', resistance: 'Swapped' },
      { id: 'm4', nodeName: 'Sensor Data Pin (Pin 2 → D2)', voltage: '0.85 V (Unstable)', current: '0.00 mA', resistance: 'Floating' }
    ],
    question: "Why is my temperature sensor returning timeout errors and getting uncomfortably warm?",
    expected_components: [
      { id: 'c1', type: 'Arduino Uno R3', confidence: 0.98, location: 'left', status: 'normal', coordinates: { x: 25, y: 50, label: 'Arduino Uno R3' } },
      { id: 'c2', type: 'DHT11 Temp/Humidity Sensor', confidence: 0.92, location: 'right', status: 'error', coordinates: { x: 70, y: 50, label: 'DHT11 (Hot to touch)' } },
      { id: 'c3', type: 'Jumper Wires (Red/Black)', confidence: 0.88, location: 'center', status: 'suspicious', coordinates: { x: 48, y: 48, label: 'Wiring Harness (Reversed)' } }
    ],
    expected_diagnostic: {
      id: 'diag-arduino-03',
      status: 'CRITICAL_FAULT',
      fault_category: 'Power Rail Swap / Thermal Overload Risk',
      confidence: 'High',
      confidence_score: 0.97,
      observed: [
        'DHT11 module detected connected to Arduino 5V, GND, and D2 pins',
        'Red jumper wire from 5V pin is connected to DHT11 Pin 4 (GND)',
        'Black jumper wire from GND pin is connected to DHT11 Pin 1 (VCC)',
        'Current draw elevated to 82.5 mA (idle limit: 1.5 mA)',
        'Component heating observed'
      ],
      likely_cause: 'Power (5V) and Ground (GND) connections are swapped on the sensor. Internal protection diode is forward-biased across power rails, causing excess current flow and heat.',
      evidence: [
        { label: 'Voltage Inversion', text: 'Sensor VCC pin measured at 0.04V, GND pin measured at 4.92V.' },
        { label: 'Overcurrent Draw', text: '82.5 mA current draw exceeds normal sensor operational current by 50x.' },
        { label: 'Serial Log Error', text: 'Arduino Serial Monitor reports "DHT Sensor Read Timeout / Check Connection".' }
      ],
      recommended_checks: [
        'IMMEDIATELY DISCONNECT USB POWER to prevent permanent silicon damage!',
        'Swap Red wire (Arduino 5V) to DHT11 Pin 1 (VCC / Left pin).',
        'Swap Black wire (Arduino GND) to DHT11 Pin 4 or Pin 3 (GND / Right pin).',
        'Confirm 10kΩ pull-up resistor between Data (Pin 2) and VCC.',
        'Allow sensor 2 minutes to cool before re-applying power.'
      ],
      next_measurement: {
        parameter: 'Sensor Supply Current',
        expected_range: '0.5 mA - 2.5 mA DC',
        instructions: 'Re-measure current in series after correcting wire polarity.'
      },
      lab_manual_evidence: [
        {
          doc_name: 'DHT11_Datasheet_Rev2.pdf',
          page: 3,
          excerpt: 'Pin 1: VCC (3.3V-5.5V), Pin 2: Data, Pin 3: NC, Pin 4: GND. Reversing VCC and GND will destroy internal sensor circuitry.',
          relevance_score: 0.99
        }
      ],
      timestamp: new Date().toISOString()
    },
    expected_schematic_diff: {
      reference_name: 'DHT11 Sensor Interfacing Manual',
      observed_name: 'Breadboard Wire Tracing',
      matching_components: ['Arduino Uno', 'DHT11 Sensor', 'Data Line D2'],
      missing_components: [],
      unexpected_components: [],
      connection_diffs: [
        { from: 'Arduino 5V', to: 'DHT11 Pin 4 (GND)', status: 'incorrect', reason: '5V line connected to Ground pin' },
        { from: 'Arduino GND', to: 'DHT11 Pin 1 (VCC)', status: 'incorrect', reason: 'GND line connected to VCC pin' }
      ],
      confidence: 0.97,
      summary: 'Critical power inversion: 5V supply connected to GND pin, GND connected to VCC pin.'
    }
  }
];
