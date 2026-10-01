export interface ComponentLocation {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width?: number;
  height?: number;
  label?: string;
}

export interface CircuitComponent {
  id: string;
  type: string; // e.g. "LED", "Resistor", "Arduino Uno", "DHT11", "Capacitor", "Wire"
  confidence: number;
  location: string; // e.g. "center-right" or bounding box
  coordinates?: ComponentLocation;
  status?: 'normal' | 'suspicious' | 'error';
  notes?: string;
}

export interface CircuitAnalysisResult {
  components: CircuitComponent[];
  observations: string[];
  possible_issues: string[];
  uncertainty_notes?: string;
  model_info?: {
    name: string;
    backend: string;
    latency_ms: number;
  };
}

export interface VoltageCurrentMeasurement {
  id: string;
  nodeName: string;
  voltage: string; // e.g. "5.02 V"
  current: string; // e.g. "0.00 mA"
  resistance: string; // e.g. "218 Ω"
  frequency?: string;
  temperature?: string;
  notes?: string;
}

export interface LabManualCitation {
  doc_name: string;
  page?: number;
  excerpt: string;
  relevance_score: number;
}

export interface DiagnosticResult {
  id: string;
  status: 'NORMAL' | 'POTENTIAL_FAULT' | 'CRITICAL_FAULT' | 'UNCERTAIN';
  fault_category: string;
  confidence: 'High' | 'Medium' | 'Low';
  confidence_score: number;
  observed: string[];
  likely_cause: string;
  evidence: Array<{ label: string; text: string }>;
  recommended_checks: string[];
  next_measurement: {
    parameter: string;
    expected_range: string;
    instructions: string;
  };
  lab_manual_evidence?: LabManualCitation[];
  timestamp: string;
}

export interface SchematicNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  pins?: string[];
}

export interface ConnectionDiff {
  from: string;
  to: string;
  status: 'matching' | 'missing' | 'unexpected' | 'incorrect';
  reason: string;
}

export interface SchematicComparisonResult {
  reference_name: string;
  observed_name: string;
  matching_components: string[];
  missing_components: string[];
  unexpected_components: string[];
  connection_diffs: ConnectionDiff[];
  confidence: number;
  summary: string;
}

export interface LabDocument {
  id: string;
  filename: string;
  file_size_kb: number;
  page_count: number;
  upload_timestamp: string;
  extracted_text_snippet: string;
}

export interface DeviceTelemetry {
  device_name: string;
  processor: string;
  ai_runtime: string;
  accelerator: 'NPU' | 'GPU' | 'CPU';
  vision_model: string;
  reasoning_model: string;
  speech_model: string;
  status: 'Ready' | 'Loading' | 'Error' | 'Fallback';
  inference_type: 'Local / On-Device';
  network_status: 'Offline Ready' | 'Online';
  last_inference_ms?: number;
  memory_used_mb?: number;
  cpu_percent?: number;
  npu_active?: boolean;
  is_hardware_verified: boolean; // False if fallback, True if actual tested Snapdragon runtime
}

export interface DemoScenario {
  id: string;
  title: string;
  tagline: string;
  circuit_image: string;
  schematic_image?: string;
  measurements: VoltageCurrentMeasurement[];
  question: string;
  expected_components: CircuitComponent[];
  expected_diagnostic: DiagnosticResult;
  expected_schematic_diff?: SchematicComparisonResult;
}
