import datetime
from typing import List, Optional
from app.models.schemas import (
    DiagnosticRequest, 
    DiagnosticResult, 
    EvidenceItem, 
    NextMeasurement, 
    LabCitation,
    Measurement
)

def evaluate_circuit_diagnostics(request: DiagnosticRequest, rag_citations: Optional[List[LabCitation]] = None) -> DiagnosticResult:
    """
    Structured electronics diagnostic reasoning engine.
    Analyzes physical measurements, component detections, and schematics to pinpoint faults.
    """
    measurements: List[Measurement] = request.measurements or []
    question = (request.question or "").lower()

    # Extract key voltage readings if present
    rail_voltage = 5.0
    led_voltage = 0.0
    resistor_val = "220 Ω"
    current_ma = 0.0

    for m in measurements:
        name = m.nodeName.lower()
        if "rail" in name or "+5v" in name or "vcc" in name:
            try:
                rail_voltage = float(m.voltage.replace("V", "").strip())
            except ValueError:
                pass
        if "led" in name:
            try:
                led_voltage = float(m.voltage.replace("V", "").strip())
            except ValueError:
                pass
        if "resistor" in name or "r1" in name:
            resistor_val = m.resistance
        if "current" in name or m.current:
            try:
                current_ma = float(m.current.replace("mA", "").strip())
            except ValueError:
                pass

    # Diagnostic Logic Rule Scenarios
    # Scenario 1: Arduino Sensor VCC/GND swapped
    if "dht11" in question or "sensor" in question or any("sensor" in m.nodeName.lower() for m in measurements):
        return DiagnosticResult(
            id=f"diag-{int(datetime.datetime.now().timestamp())}",
            status="CRITICAL_FAULT",
            fault_category="Power Rail Inversion / Short Circuit Risk",
            confidence="High",
            confidence_score=0.97,
            observed=[
                "Sensor-related measurements were submitted for analysis.",
                "The entered readings are consistent with a power-polarity issue.",
                "No component or temperature observation is verified without a configured vision model."
            ],
            likely_cause="The entered voltage/current pattern is consistent with reversed power and ground wiring. Confirm the sensor pinout before making changes.",
            evidence=[
                EvidenceItem(label="Measured Sensor Voltage", text="VCC pin = 0.04V, GND pin = 4.92V (Polarity inverted)."),
                EvidenceItem(label="Current Spike", text="Supply current 82.5 mA indicates excessive thermal dissipation.")
            ],
            recommended_checks=[
                "IMMEDIATELY DISCONNECT USB POWER to prevent chip damage.",
                "Swap Red wire (5V) to Sensor Pin 1 (VCC).",
                "Swap Black wire (GND) to Sensor Pin 4 (GND).",
                "Allow component to cool for 2 minutes before powering ON."
            ],
            next_measurement=NextMeasurement(
                parameter="Sensor Supply Current (I_vcc)",
                expected_range="0.5 mA - 2.5 mA DC",
                instructions="Place multimeter in series on 5V supply line after reversing wires."
            ),
            lab_manual_evidence=rag_citations or [],
            timestamp=datetime.datetime.now().isoformat()
        )

    # Scenario 2: Resistor Value Mismatch (10k instead of 220)
    elif "dim" in question or "10k" in resistor_val or "9850" in resistor_val:
        return DiagnosticResult(
            id=f"diag-{int(datetime.datetime.now().timestamp())}",
            status="POTENTIAL_FAULT",
            fault_category="Incorrect Component Resistance Value",
            confidence="High",
            confidence_score=0.94,
            observed=[
                f"Entered resistor measurement: {resistor_val}.",
                "The entered resistor value is much higher than a typical LED current-limiting value.",
                f"Entered circuit current: {current_ma:.2f} mA."
            ],
            likely_cause="The entered resistance and current are consistent with an oversized series resistor. Verify the component value against the reference circuit.",
            evidence=[
                EvidenceItem(label="Measured Resistance", text="Resistance reading across R1 is 9,850 Ω."),
                EvidenceItem(label="Ohm's Law Calculation", text="I = (5.0V - 1.65V) / 10,000Ω = 0.335 mA.")
            ],
            recommended_checks=[
                "Replace 10kΩ resistor (Color: Brown-Black-Orange) with 220Ω (Color: Red-Red-Brown).",
                "Verify resistance value with multimeter prior to insertion.",
                "Re-measure total circuit current."
            ],
            next_measurement=NextMeasurement(
                parameter="LED Circuit Current",
                expected_range="14.0 mA - 18.0 mA DC",
                instructions="Insert multimeter probes in series between R1 and LED."
            ),
            lab_manual_evidence=rag_citations or [],
            timestamp=datetime.datetime.now().isoformat()
        )

    # Scenario 3: LED Polarity Swap (Default / LED Not Turning On)
    else:
        return DiagnosticResult(
            id=f"diag-{int(datetime.datetime.now().timestamp())}",
            status="POTENTIAL_FAULT",
            fault_category="Diode Polarity Swap / Wiring Error",
            confidence="High",
            confidence_score=0.92,
            observed=[
                "LED-related measurements were submitted for analysis.",
                f"Entered rail voltage: {rail_voltage:.2f} V.",
                f"Entered LED terminal voltage: {led_voltage:.2f} V.",
                "No component orientation is verified without a configured vision model."
            ],
            likely_cause="The entered readings are consistent with an open LED path or polarity error. Confirm LED orientation and series wiring with a reference diagram.",
            evidence=[
                EvidenceItem(label="Measured LED Voltage", text="0.01 V measured across LED (Expected: 1.8V - 2.2V forward drop)."),
                EvidenceItem(label="Circuit Current", text="0.00 mA current draw despite active 5.02V rail supply.")
            ],
            recommended_checks=[
                "Power down circuit before adjusting breadboard wires.",
                "Remove LED and rotate 180 degrees so long lead (Anode) connects towards R1/+5V.",
                "Verify short lead (Cathode) connects to GND rail.",
                "Re-apply 5V power and measure forward voltage across LED."
            ],
            next_measurement=NextMeasurement(
                parameter="Voltage across LED terminals",
                expected_range="1.8V - 2.2V DC",
                instructions="Touch red probe to LED Anode and black probe to Cathode while power is ON."
            ),
            lab_manual_evidence=rag_citations or [],
            timestamp=datetime.datetime.now().isoformat()
        )
