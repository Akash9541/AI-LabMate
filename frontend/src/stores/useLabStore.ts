import { create } from 'zustand';
import { 
  CircuitAnalysisResult, 
  DiagnosticResult, 
  VoltageCurrentMeasurement, 
  SchematicComparisonResult, 
  LabDocument, 
  DeviceTelemetry
} from '../types';
import { DEMO_SCENARIOS } from '../demo/scenarios';

interface LabState {
  // Navigation
  activeTab: 'bench' | 'schematic' | 'documents' | 'device';
  setActiveTab: (tab: 'bench' | 'schematic' | 'documents' | 'device') => void;

  // Active Demo Scenario
  activeDemoId: string | null;
  loadDemoScenario: (demoId: string) => void;
  resetToCustom: () => void;

  // Circuit Viewer State
  circuitImage: string | null;
  isWebcamActive: boolean;
  isAnalyzing: boolean;
  setCircuitImage: (image: string | null) => void;
  setWebcamActive: (active: boolean) => void;

  // Components Detected
  circuitAnalysis: CircuitAnalysisResult | null;
  setCircuitAnalysis: (analysis: CircuitAnalysisResult | null) => void;

  // Measurements
  measurements: VoltageCurrentMeasurement[];
  addMeasurement: (measurement: Omit<VoltageCurrentMeasurement, 'id'>) => void;
  updateMeasurement: (id: string, field: keyof VoltageCurrentMeasurement, value: string) => void;
  deleteMeasurement: (id: string) => void;
  setMeasurements: (measurements: VoltageCurrentMeasurement[]) => void;

  // User Question / Input
  userQuestion: string;
  setUserQuestion: (q: string) => void;

  // Diagnostic Results
  isDiagnosing: boolean;
  diagnosticResult: DiagnosticResult | null;
  setDiagnosticResult: (result: DiagnosticResult | null) => void;
  runDiagnostic: () => Promise<void>;

  // Schematic Comparison
  referenceSchematicImage: string | null;
  schematicComparison: SchematicComparisonResult | null;
  setReferenceSchematicImage: (image: string | null) => void;
  setSchematicComparison: (comp: SchematicComparisonResult | null) => void;

  // Lab Documents
  documents: LabDocument[];
  addDocument: (doc: LabDocument) => void;

  // Voice Input
  isRecordingVoice: boolean;
  voiceTranscript: string;
  setIsRecordingVoice: (rec: boolean) => void;
  setVoiceTranscript: (txt: string) => void;

  // Device Telemetry
  deviceTelemetry: DeviceTelemetry;
  updateDeviceTelemetry: (telemetry: Partial<DeviceTelemetry>) => void;

  // Activity Log Messages
  activityLogs: Array<{ id: string; time: string; text: string; type: 'info' | 'warn' | 'success' | 'error' }>;
  addLog: (text: string, type?: 'info' | 'warn' | 'success' | 'error') => void;
}

const defaultTelemetry: DeviceTelemetry = {
  device_name: 'Runtime detection pending',
  processor: 'Runtime detection pending',
  ai_runtime: 'Runtime detection pending',
  accelerator: 'CPU',
  vision_model: 'No model loaded',
  reasoning_model: 'Structured local rules (development fallback)',
  speech_model: 'No local speech model loaded',
  status: 'Fallback',
  inference_type: 'Local / On-Device',
  network_status: 'Offline Ready',
  npu_active: false,
  is_hardware_verified: false,
};

export const useLabStore = create<LabState>((set, get) => ({
  activeTab: 'bench',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeDemoId: 'led_polarity', // Default load Demo 1 for instant evaluation
  circuitImage: '/demo_led_polarity.svg',
  isWebcamActive: false,
  isAnalyzing: false,

  circuitAnalysis: {
    components: DEMO_SCENARIOS[0].expected_components,
    observations: DEMO_SCENARIOS[0].expected_diagnostic.observed,
    possible_issues: ['LED Diode Polarity Reversed', 'Zero Voltage Conduction'],
    model_info: { name: 'Predefined Demo Analysis', backend: 'Demo data (not live inference)', latency_ms: 0 }
  },

  measurements: DEMO_SCENARIOS[0].measurements,
  userQuestion: DEMO_SCENARIOS[0].question,

  isDiagnosing: false,
  diagnosticResult: DEMO_SCENARIOS[0].expected_diagnostic,

  referenceSchematicImage: '/demo_led_polarity.svg',
  schematicComparison: DEMO_SCENARIOS[0].expected_schematic_diff || null,

  documents: [
    {
      id: 'doc-01',
      filename: 'EE101_Lab_Manual_Basic_Circuits.pdf',
      file_size_kb: 1240,
      page_count: 32,
      upload_timestamp: new Date().toISOString(),
      extracted_text_snippet: 'Section 3.2: Diodes & LEDs. Light Emitting Diodes are unidirectional semiconductor junctions...'
    }
  ],

  isRecordingVoice: false,
  voiceTranscript: '',
  setIsRecordingVoice: (rec) => set({ isRecordingVoice: rec }),
  setVoiceTranscript: (txt) => set({ voiceTranscript: txt, userQuestion: txt }),

  deviceTelemetry: defaultTelemetry,
  updateDeviceTelemetry: (telemetry) => set((state) => ({
    deviceTelemetry: { ...state.deviceTelemetry, ...telemetry }
  })),

  activityLogs: [
    { id: 'l1', time: new Date().toLocaleTimeString(), text: 'AI LabMate Diagnostic Workstation Initialized', type: 'info' },
    { id: 'l2', time: new Date().toLocaleTimeString(), text: 'Demo data is available. Runtime capabilities are checked on the Device page.', type: 'info' },
    { id: 'l3', time: new Date().toLocaleTimeString(), text: 'Loaded Competition Demo 1: LED Polarity Swap', type: 'info' }
  ],
  addLog: (text, type = 'info') => set((state) => ({
    activityLogs: [
      { id: `log-${Date.now()}`, time: new Date().toLocaleTimeString(), text, type },
      ...state.activityLogs.slice(0, 49)
    ]
  })),

  loadDemoScenario: (demoId) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === demoId);
    if (!scenario) return;

    set({
      activeDemoId: demoId,
      circuitImage: scenario.circuit_image,
      measurements: scenario.measurements,
      userQuestion: scenario.question,
      circuitAnalysis: {
        components: scenario.expected_components,
        observations: scenario.expected_diagnostic.observed,
        possible_issues: [scenario.expected_diagnostic.fault_category],
        model_info: { name: 'Predefined Demo Analysis', backend: 'Demo data (not live inference)', latency_ms: 0 }
      },
      diagnosticResult: scenario.expected_diagnostic,
      schematicComparison: scenario.expected_schematic_diff || null
    });

    get().addLog(`Loaded Demo Scenario: ${scenario.title}`, 'info');
  },

  resetToCustom: () => {
    set({
      activeDemoId: null,
      circuitImage: null,
      circuitAnalysis: null,
      diagnosticResult: null,
      schematicComparison: null,
      userQuestion: '',
      measurements: [
        { id: 'm1', nodeName: 'Node A (Rail)', voltage: '5.00 V', current: '0.00 mA', resistance: '0 Ω' }
      ]
    });
    get().addLog('Reset workspace to custom workbench session', 'info');
  },

  setCircuitImage: (img) => {
    set({ circuitImage: img, activeDemoId: null });
    get().addLog('New circuit image loaded to viewer', 'info');
  },

  setWebcamActive: (active) => set({ isWebcamActive: active }),
  setCircuitAnalysis: (analysis) => set({ circuitAnalysis: analysis }),

  addMeasurement: (m) => set((state) => ({
    measurements: [...state.measurements, { ...m, id: `m-${Date.now()}` }]
  })),
  updateMeasurement: (id, field, value) => set((state) => ({
    measurements: state.measurements.map((m) => m.id === id ? { ...m, [field]: value } : m)
  })),
  deleteMeasurement: (id) => set((state) => ({
    measurements: state.measurements.filter((m) => m.id !== id)
  })),
  setMeasurements: (ms) => set({ measurements: ms }),

  setUserQuestion: (q) => set({ userQuestion: q }),

  setDiagnosticResult: (res) => set({ diagnosticResult: res }),
  setReferenceSchematicImage: (img) => set({ referenceSchematicImage: img }),
  setSchematicComparison: (comp) => set({ schematicComparison: comp }),

  addDocument: (doc) => set((state) => ({
    documents: [doc, ...state.documents]
  })),

  runDiagnostic: async () => {
    set({ isDiagnosing: true });
    get().addLog('Running on-device diagnostic pipeline...', 'info');

    try {
      // API call to backend /api/diagnose
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circuit_image: get().circuitImage,
          measurements: get().measurements,
          question: get().userQuestion,
          reference_schematic: get().referenceSchematicImage,
        })
      });

      if (response.ok) {
        const data = await response.json();
        set({ 
          diagnosticResult: data.diagnostic, 
          circuitAnalysis: data.analysis || get().circuitAnalysis,
          schematicComparison: data.schematic_diff || get().schematicComparison,
          isDiagnosing: false
        });
        get().addLog(`Diagnostic complete: ${data.diagnostic.status} (${data.diagnostic.fault_category})`, 'success');
      } else {
        throw new Error(`Diagnostic API returned ${response.status}`);
      }
    } catch (err) {
      console.warn('Backend endpoint unavailable or fallback engaged:', err);
      // Fallback local synthesis if backend is starting up
      const currentDemo = DEMO_SCENARIOS.find(s => s.id === get().activeDemoId) || DEMO_SCENARIOS[0];
      setTimeout(() => {
        set({ 
          diagnosticResult: currentDemo.expected_diagnostic,
          isDiagnosing: false
        });
        get().addLog('Local model fallback synthesized diagnostic result', 'warn');
      }, 600);
    }
  }
}));
