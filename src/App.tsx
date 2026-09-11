import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Info, Wand2, Star, Shield, Award, Lightbulb, User, Clock, FileText, Zap, Target, Users, TrendingUp } from "lucide-react";
import OportunidadView from "./OportunidadView";

const ciiuList = [
  { code: "0111", desc: "Cultivo de cereales, legumbres y semillas oleaginosas" },
  { code: "4711", desc: "Comercio al por menor en establecimientos no especializados" },
  { code: "4724", desc: "Comercio al por menor de bebidas y productos del tabaco" },
  { code: "4921", desc: "Transporte de pasajeros" },
  { code: "5611", desc: "Expendio a la mesa de comidas preparadas" },
  { code: "6201", desc: "Actividades de desarrollo de sistemas informáticos" },
  { code: "6202", desc: "Actividades de consultoría informática" },
  { code: "6820", desc: "Actividades inmobiliarias" },
  { code: "6910", desc: "Actividades jurídicas" },
  { code: "6920", desc: "Actividades de contabilidad y auditoría" },
  { code: "7020", desc: "Actividades de consultoría de gestión" },
  { code: "7110", desc: "Actividades de arquitectura e ingeniería" },
  { code: "7310", desc: "Publicidad" },
  { code: "8551", desc: "Formación académica no formal" },
  { code: "8621", desc: "Actividades de la práctica médica, sin internación" },
  { code: "9602", desc: "Peluquería y otros tratamientos de belleza" },
];

export default function App() {
  const [currentView, setCurrentView] = useState("Cotizador");
  const [currentStep, setCurrentStep] = useState(0);
  const [isCiiuOpen, setIsCiiuOpen] = useState(false);
  const [ciiuSearch, setCiiuSearch] = useState("");
  const [planPago, setPlanPago] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    producto: "Vida a mi medida individual",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaCotizacion: new Date().toISOString().split("T")[0],
    nombreCompleto: "",
    fechaNacimiento: "",
    edad: "",
    sexo: "Masculino",
    codigoCIIU: "",
    celular: "",
    correo: "",
    moto: "",
    tipoCotizacion: "",
    ingresosMensuales: "",
    gastosMensuales: "",
    necesidadProteccion: "",
    estadoCivil: "",
    estadoCivilOtro: "",
    tieneHijos: false,
    numeroHijos: "",
    tieneFamiliares: false,
    numeroFamiliares: "",
    tieneEmpresa: false,
    valorAcciones: "",
    tieneSeguroVida: false,
    metaCompraBien: false,
    montoCompraBien: "",
    metaOtros: false,
    montoOtros: "",
    metaEducacion: false,
    montoEducacion: "120000000",
    metaPension: false,
    montoPension: "300000000",
    perfilRiesgo: "Generación Futuro",
    valorAseguradoPersonalizado: "",
    vigenciaPoliza: "",
    tiempoPagoPoliza: "",
    coberturaITP: false,
    coberturaITPPct: "",
    coberturaExoITP: false,
    coberturaMA: false,
    coberturaMAPct: "",
    coberturaEG: false,
    coberturaEGPct: "",
    coberturaExoEG: false,
    coberturaAH: false,
    coberturaAHPlazo: "3",
    coberturaSobrevivencia: false,
    coberturaSobrevivenciaPct: "",
    coberturaAhorro: false,
    coberturaAhorroPct: "",
    perfilInversion: "",
    habeasData: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [resultados, setResultados] = useState<any>(null);
  const [resultadosSugerida, setResultadosSugerida] = useState<any>(null);
  const [resultadosPersonalizada, setResultadosPersonalizada] = useState<any>(null);
  const [quoteSelection, setQuoteSelection] = useState<"sugerida" | "personalizada" | null>(null);
  const [highlightField, setHighlightField] = useState<string | null>(null);
  const [highlightPlanPago, setHighlightPlanPago] = useState(false);
  const [planPagoSugerida, setPlanPagoSugerida] = useState<string | null>(null);
  const [planPagoPersonalizada, setPlanPagoPersonalizada] = useState<string | null>(null);
  const [isFromComparison, setIsFromComparison] = useState(false);
  const [sendingState, setSendingState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [initialOportunidadId, setInitialOportunidadId] = useState<number | null>(null);

  const handleConfirmSend = () => {
    setSendingState('sending');
    setTimeout(() => {
      setSendingState('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setSendingState('idle');
        setResultados(null);
        setResultadosSugerida(null);
        setResultadosPersonalizada(null);
        setPlanPago(null);
        setCurrentStep(0);
        setInitialOportunidadId(1); // Juan Pérez opportunity has ID 1
        setCurrentView("Oportunidad");
      }, 2500);
    }, 2000);
  };

  const navItems = [
    { name: "Inicio", active: currentView === "Inicio" },
    { name: "Casos", active: currentView === "Casos" },
    { name: "Informes", active: currentView === "Informes" },
    { name: "Paneles", active: currentView === "Paneles" },
    { name: "Oportunidad", active: currentView === "Oportunidad" },
    { name: "Cotizador", active: currentView === "Cotizador" },
  ];

  const baseSteps = [
    { name: "Producto", id: 0, title: "Cotizador" },
    { name: "Buscar cliente", id: 1 },
    { name: "Datos básicos", id: 2, title: "Datos básicos del asegurado" },
  ];

  const isSugerida = formData.tipoCotizacion === "Cotización sugerida";
  const steps = formData.tipoCotizacion
    ? [...baseSteps, { name: "Cotización", id: 3, title: formData.tipoCotizacion }]
    : baseSteps;

  const docTypes = [
    "Pasaporte",
    "Cedula de Extranjería",
    "Cedula de Ciudadanía",
    "Permiso Por Protección Temporal",
  ];

  const handleNext = () => {
    if (currentStep === 3) {
      if (formData.tipoCotizacion === "Cotización personalizada") {
        const SMMLV = 1300000;
        const valAseguradoNum = parseInt(formData.valorAseguradoPersonalizado.replace(/\./g, '')) || 100000000;
        const exceedsSarlaft = valAseguradoNum > (1300000 * 135);
        const vigenciaAños = parseInt(formData.vigenciaPoliza.replace(/\D/g, '')) || 1;

        // build selected coverages list
        const coberturas: string[] = ['Fallecimiento', 'Gastos Exequiales'];
        if (formData.vigenciaPoliza !== '1 año') {
          if (formData.coberturaITP) coberturas.push('ITP');
          if (formData.coberturaExoITP && formData.tiempoPagoPoliza !== 'Pago único') coberturas.push('Exo-ITP');
          if (formData.coberturaMA) coberturas.push('Muerte Accidental');
          if (formData.tiempoPagoPoliza !== 'Pago único') {
            if (formData.coberturaEG) coberturas.push('Enf. Graves');
            if (formData.coberturaExoEG) coberturas.push('Exo-EG');
            if (formData.coberturaSobrevivencia) coberturas.push('Sobrevivencia');
            if (formData.coberturaAhorro) coberturas.push('Ahorro');
          }
          if (formData.coberturaAH) coberturas.push('Auxilio Hosp.');
        }

        const res = {
          perfil: formData.perfilRiesgo || 'Generación Futuro',
          tipo: 'personalizada',
          valorAsegurado: valAseguradoNum,
          exceedsSarlaft,
          vigencia: vigenciaAños,
          tiempoPago: formData.tiempoPagoPoliza || 'Pago único',
          coberturas,
          formSnap: { ...formData },
          cotizacionAnual: valAseguradoNum * 0.012,
          cotizacionSemestral: (valAseguradoNum * 0.012) / 2 * 1.05,
          cotizacionMensual: (valAseguradoNum * 0.012) / 12 * 1.1,
          pagoAnualSemestral: (valAseguradoNum * 0.012) * 1.05,
          pagoAnualMensual: (valAseguradoNum * 0.012) * 1.1
        };
        setResultados(res);
        setResultadosPersonalizada(res);
        setPlanPago(null);
        setPlanPagoPersonalizada(null);
      } else {
        const valorAsegurado = Math.floor(Math.random() * (1500000000 - 30000000 + 1)) + 30000000;
        const exceedsSarlaft = valorAsegurado > (1300000 * 135);
        const vigencias = [1, 5, 10];
        const randomVigencia = vigencias[Math.floor(Math.random() * vigencias.length)];
        let tiempoPagoStr = randomVigencia === 1 ? 'Pago permanente' : randomVigencia === 5 ? 'Pago en 2 años' : 'Pago en 5 años';
        const coberturasSug = ['Fallecimiento', 'Gastos Exequiales', 'ITP', 'Exo-ITP', 'Muerte Accidental', 'Enf. Graves', 'Exo-EG', 'Auxilio Hosp.'];
        if (formData.tieneFamiliares || formData.tieneHijos) coberturasSug.push('Sobrevivencia');
        if (formData.metaEducacion || formData.metaPension || formData.metaCompraBien || formData.metaOtros) coberturasSug.push('Ahorro');
        const res2 = {
          perfil: formData.perfilRiesgo,
          tipo: 'sugerida',
          valorAsegurado,
          exceedsSarlaft,
          vigencia: randomVigencia,
          tiempoPago: tiempoPagoStr,
          coberturas: coberturasSug,
          formSnap: { ...formData },
          cotizacionAnual: valorAsegurado * 0.015,
          cotizacionSemestral: (valorAsegurado * 0.015) / 2 * 1.05,
          cotizacionMensual: (valorAsegurado * 0.015) / 12 * 1.1,
          pagoAnualSemestral: (valorAsegurado * 0.015) * 1.05,
          pagoAnualMensual: (valorAsegurado * 0.015) * 1.1
        };
        setResultados(res2);
        setResultadosSugerida(res2);
        setPlanPago(null);
        setPlanPagoSugerida(null);
      }
      return;
    }

    if (currentStep < steps.length - 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const openQuoteForReview = (quoteType: 'sugerida' | 'personalizada') => {
    const isSugeridaQuote = quoteType === 'sugerida';
    const selectedResult = isSugeridaQuote ? resultadosSugerida : resultadosPersonalizada;
    const selectedPlan = isSugeridaQuote ? planPagoSugerida : planPagoPersonalizada;
    const tipoCotizacion = isSugeridaQuote ? 'Cotización sugerida' : 'Cotización personalizada';

    if (!selectedResult) return;

    setQuoteSelection(quoteType);
    setFormData(prev => ({
      ...(selectedResult.formSnap || prev),
      tipoCotizacion,
    }));
    setResultados(selectedResult);
    setPlanPago(selectedPlan);
    setCurrentStep(3);
    setIsCompareOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (field: string, value: string | boolean) => {
    // Don't clear resultados when editing — the sidebar compare button depends on resultadosSugerida/resultadosPersonalizada
    setFormData(prev => ({ ...prev, [field]: value }));
    if (typeof value === "string") {
      if (errors[field]) {
        setErrors(prev => {
          const newErrs = { ...prev };
          delete newErrs[field];
          return newErrs;
        });
      }
    }
  };

  const handleNumberChange = (field: string, value: string) => {
    const onlyNums = value.replace(/\D/g, "");
    handleChange(field, onlyNums);
  };

  const handleCurrencyChange = (field: string, value: string) => {
    const onlyNums = value.replace(/\D/g, "");
    handleChange(field, onlyNums);
  };

  const formatCurrency = (val: string) => {
    if (!val) return "";
    return new Intl.NumberFormat("es-CO").format(parseInt(val, 10));
  };

  useEffect(() => {
    if (formData.fechaNacimiento) {
      const birthDate = new Date(formData.fechaNacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, edad: age.toString() }));
    }
  }, [formData.fechaNacimiento]);

  useEffect(() => {
    if (formData.metaEducacion) {
      const randomVal = Math.floor(Math.random() * (8000000 - 3000000 + 1)) + 3000000;
      handleChange("montoEducacion", randomVal.toString());
    } else {
      handleChange("montoEducacion", "");
    }
  }, [formData.metaEducacion]);

  useEffect(() => {
    if (formData.metaPension) {
      const ingresos = parseInt(formData.ingresosMensuales) || 0;
      const gastos = parseInt(formData.gastosMensuales) || 0;
      let val = 0;
      if (ingresos > 0 && ingresos > gastos) {
        val = Math.floor((ingresos - gastos) * 0.2 * 12);
      } else {
        val = Math.floor(Math.random() * (8000000 - 3000000 + 1)) + 3000000;
      }
      if (val < 3000000) val = Math.floor(Math.random() * (8000000 - 3000000 + 1)) + 3000000;
      handleChange("montoPension", val.toString());
    } else {
      handleChange("montoPension", "");
    }
  }, [formData.metaPension, formData.ingresosMensuales, formData.gastosMensuales]);

  // Auto-clear highlight after 3 seconds when navigating back from comparison
  useEffect(() => {
    if (!highlightField) return;
    const t = setTimeout(() => setHighlightField(null), 3000);
    return () => clearTimeout(t);
  }, [highlightField]);

  useEffect(() => {
    if (!highlightPlanPago) return;
    const t = setTimeout(() => setHighlightPlanPago(false), 3000);
    return () => clearTimeout(t);
  }, [highlightPlanPago]);

  const validateDocumento = (value: string) => {
    if (value && value.length < 5) {
      setErrors(prev => ({ ...prev, numeroDocumento: "Campo no cumple con el formato requerido" }));
    }
  };

  const validateNombre = (value: string) => {
    if (value && /\d/.test(value)) {
      setErrors(prev => ({ ...prev, nombreCompleto: "Campo no cumple con el formato requerido" }));
    }
  };

  const validateCelular = (value: string) => {
    if (!value) return;
    const isNum = /^\d+$/.test(value);
    if (!isNum) {
      setErrors(prev => ({ ...prev, celular: "Campo no cumple con el formato requerido" }));
      return;
    }
    if (value.length !== 10) {
      setErrors(prev => ({ ...prev, celular: "Campo no cumple con el formato requerido" }));
      return;
    }
    if (!value.startsWith("3")) {
      setErrors(prev => ({ ...prev, celular: "Campo no cumple con el formato requerido" }));
      return;
    }
    const prefijo = parseInt(value.substring(0, 3));
    if (prefijo < 300 || prefijo > 399) {
      setErrors(prev => ({ ...prev, celular: "Campo no cumple con el formato requerido" }));
      return;
    }
  };

  const validateCorreo = (value: string) => {
    if (value && (!value.includes("@") || !value.toLowerCase().includes(".com"))) {
      setErrors(prev => ({ ...prev, correo: "Campo no cumple con el formato requerido" }));
    }
  };

  const autoFill = () => {
    // If we're in step 3 personalizada, just fill the personalizada-specific fields
    if (currentStep === 3 && formData.tipoCotizacion === 'Cotización personalizada') {
      setFormData(prev => ({
        ...prev,
        tipoCotizacion: 'Cotización personalizada',
        valorAseguradoPersonalizado: '150000000',
        vigenciaPoliza: '10 años',
        tiempoPagoPoliza: 'Pago en 5 años',
        coberturaITP: true,
        coberturaITPPct: '100',
        coberturaExoITP: true,
        coberturaMA: true,
        coberturaMAPct: '100',
        coberturaEG: true,
        coberturaEGPct: '50',
        coberturaExoEG: true,
        coberturaAH: true,
        coberturaSobrevivencia: false,
        coberturaSobrevivenciaPct: '',
        coberturaAhorro: false,
        coberturaAhorroPct: ''
      }));
      return;
    }
    // Otherwise fill all steps (global autocomplete)
    setFormData(prev => ({
      ...prev,
      producto: "Vida a mi medida individual",
      tipoDocumento: "Cedula de Ciudadanía",
      numeroDocumento: "1020304050",
      nombreCompleto: "Juan Pérez",
      fechaNacimiento: "1990-05-15",
      edad: "35",
      sexo: "Masculino",
      codigoCIIU: "6201",
      celular: "3001234567",
      correo: "juan.perez@email.com",
      moto: "No",
      habeasData: true,
      tipoCotizacion: "Cotización sugerida",
      ingresosMensuales: "5000000",
      gastosMensuales: "2000000",
      necesidadProteccion: "2",
      estadoCivil: "Soltero(a)",
      estadoCivilOtro: "",
      tieneHijos: false,
      numeroHijos: "",
      tieneFamiliares: false,
      numeroFamiliares: "",
      tieneEmpresa: true,
      valorAcciones: "50000000",
      tieneSeguroVida: false,
      metaCompraBien: true,
      montoCompraBien: "20000000",
      metaOtros: false,
      montoOtros: "",
      metaEducacion: false,
      montoEducacion: "",
      metaPension: true,
      montoPension: "8000000",
      perfilRiesgo: 'Generación Futuro'
    }));
  };

  const renderError = (field: string) => {
    if (!errors[field]) return null;
    return (
      <div className="flex items-start mt-1.5 text-red-500 text-xs font-medium">
        <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5" />
        <span>{errors[field]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-800">
      <header className="w-full bg-white border-b border-gray-300">
        <img
          src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1774479971/IMG_0555_qfggwf.png"
          alt="Office background"
          className="w-full h-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </header>

      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-8">
          <ul className="flex justify-center space-x-12">
            {navItems.map((item) => (
              <li key={item.name} className="relative py-3">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentView(item.name); }}
                  className={`text-sm font-medium transition-colors ${item.active ? "text-[#00008F] font-bold" : "text-blue-700 hover:text-blue-900"
                    }`}
                >
                  {item.name}
                </a>
                {item.active && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {currentView === "Oportunidad" ? (
        <OportunidadView 
          initialOportunidadId={initialOportunidadId} 
          onClearInitialId={() => setInitialOportunidadId(null)}
        />
      ) : currentView === "Cotizador" ? (
      <main className="container mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-1 max-w-4xl">
          <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            <h2 className="text-2xl font-serif font-bold text-blue-900 mb-8 border-b border-gray-100 pb-4">
              {(steps as any)[currentStep]?.title || steps[currentStep]?.name}
            </h2>

            {currentStep === 0 && (
              <div className="space-y-8 animate-in fade-in">
                <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200">
                  <img
                    src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1781015324/Banner_AXA__Life_is_Back_ng6seh.jpg"
                    alt="Banner cotizador"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="max-w-md">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Seleccione el Producto: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.producto}
                      onChange={(e) => handleChange("producto", e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] focus:border-transparent transition-all cursor-pointer hover:bg-white"
                    >
                      <option>Vida a mi medida individual</option>
                      <option>Vida a mi medida deudor</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button onClick={handleNext} className="bg-[#00008F] hover:bg-blue-900 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-all active:scale-95 flex items-center space-x-2">
                    <span>Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Tipo de documento <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.tipoDocumento}
                        onChange={(e) => handleChange("tipoDocumento", e.target.value)}
                        className={`w-full appearance-none bg-white border ${errors.tipoDocumento ? "border-red-500" : "border-gray-300"} rounded-lg py-3 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all`}
                      >
                        <option value="">Seleccione...</option>
                        {docTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {renderError("tipoDocumento")}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Número de documento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.numeroDocumento}
                      onChange={(e) => {
                        handleNumberChange("numeroDocumento", e.target.value);
                        if (e.target.value.length >= 5) {
                          setErrors(prev => { const newErrs = { ...prev }; delete newErrs.numeroDocumento; return newErrs; });
                        }
                      }}
                      onBlur={(e) => validateDocumento(e.target.value)}
                      placeholder="Ingrese el número"
                      className={`w-full bg-white border ${errors.numeroDocumento ? "border-red-500" : "border-gray-300"} rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] focus:border-[#00008F] transition-all`}
                    />
                    {renderError("numeroDocumento")}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 gap-3 md:gap-0 pt-10">
                  <button onClick={handleBack} className="w-full md:w-auto border-2 border-[#00008F] text-[#00008F] hover:bg-blue-50 font-bold py-3 px-10 rounded-full transition-all active:scale-95 flex items-center justify-center space-x-2">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Atrás</span>
                  </button>
                  <button
                    onClick={formData.tipoDocumento && formData.numeroDocumento ? handleNext : undefined}
                    disabled={!formData.tipoDocumento || !formData.numeroDocumento}
                    className={`w-full md:w-auto bg-[#00008F] hover:bg-blue-900 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${(!formData.tipoDocumento || !formData.numeroDocumento) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Nombre completo <span className="text-red-500">*</span></label>
                    <input
                      value={formData.nombreCompleto}
                      onChange={(e) => {
                        handleChange("nombreCompleto", e.target.value);
                        if (!/\d/.test(e.target.value)) {
                          setErrors(prev => { const newErrs = { ...prev }; delete newErrs.nombreCompleto; return newErrs; });
                        } else {
                          validateNombre(e.target.value);
                        }
                      }}
                      onBlur={(e) => validateNombre(e.target.value)}
                      type="text"
                      className={`w-full bg-white border ${errors.nombreCompleto ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-200"} rounded-md p-2.5 text-sm focus:outline-none focus:border-transparent focus:ring-2 ${errors.nombreCompleto ? "" : "focus:ring-[#00008F]"} transition-all`}
                    />
                    {renderError("nombreCompleto")}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Fecha de nacimiento <span className="text-red-500">*</span></label>
                    <input value={formData.fechaNacimiento} onChange={(e) => handleChange("fechaNacimiento", e.target.value)} type="date" className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#00008F] transition-all" />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-gray-500">Sexo <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={formData.sexo} onChange={(e) => handleChange("sexo", e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-md p-2.5 pr-10 text-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#00008F] transition-all">
                        <option>Masculino</option>
                        <option>Femenino</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-gray-500">Ocupación (código CIIU) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        value={ciiuSearch || formData.codigoCIIU}
                        onChange={(e) => {
                          setCiiuSearch(e.target.value);
                          handleChange("codigoCIIU", e.target.value);
                          setIsCiiuOpen(true);
                        }}
                        onFocus={() => setIsCiiuOpen(true)}
                        onBlur={() => setTimeout(() => setIsCiiuOpen(false), 200)}
                        type="text"
                        placeholder="Busca por código o actividad"
                        className={`w-full bg-white border border-gray-200 rounded-md p-2.5 pr-10 text-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#00008F] transition-all`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {isCiiuOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {ciiuList.filter(c => c.code.includes(ciiuSearch) || c.desc.toLowerCase().includes(ciiuSearch.toLowerCase())).length > 0 ? (
                          ciiuList.filter(c => c.code.includes(ciiuSearch) || c.desc.toLowerCase().includes(ciiuSearch.toLowerCase())).map(c => (
                            <div
                              key={c.code}
                              className="p-2.5 text-sm hover:bg-blue-50 cursor-pointer text-gray-700"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleChange("codigoCIIU", `${c.code} - ${c.desc}`);
                                setCiiuSearch("");
                                setIsCiiuOpen(false);
                              }}
                            >
                              <span className="font-bold">{c.code}</span> - {c.desc}
                            </div>
                          ))
                        ) : (
                          <div className="p-2.5 text-sm text-gray-500">No se encontraron resultados</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Número de celular <span className="text-red-500">*</span></label>
                    <input
                      value={formData.celular}
                      onChange={(e) => handleChange("celular", e.target.value)}
                      onBlur={(e) => validateCelular(e.target.value)}
                      type="tel"
                      placeholder="Ej: 3001234567"
                      className={`w-full bg-white border ${errors.celular ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-200"} rounded-md p-2.5 text-sm focus:outline-none focus:border-transparent focus:ring-2 ${errors.celular ? "" : "focus:ring-[#00008F]"} transition-all`}
                    />
                    {renderError("celular")}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Correo electrónico <span className="text-red-500">*</span></label>
                    <input
                      value={formData.correo}
                      onChange={(e) => handleChange("correo", e.target.value)}
                      onBlur={(e) => validateCorreo(e.target.value)}
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      className={`w-full bg-white border ${errors.correo ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-200"} rounded-md p-2.5 text-sm focus:outline-none focus:border-transparent focus:ring-2 ${errors.correo ? "" : "focus:ring-[#00008F]"} transition-all`}
                    />
                    {renderError("correo")}
                  </div>
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">¿Usas moto? <span className="text-red-500">*</span></label>
                    <div className="relative w-full md:w-1/2">
                      <select
                        value={formData.moto}
                        onChange={(e) => handleChange("moto", e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md p-2.5 pr-10 text-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#00008F] transition-all"
                      >
                        <option value="">Selecciona una opción...</option>
                        <option value="Si, eventualmente">Si, eventualmente</option>
                        <option value="Si, como medio de transporte">Si, como medio de transporte</option>
                        <option value="Si, como medio de trabajo">Si, como medio de trabajo</option>
                        <option value="No">No</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 pt-4">
                    <label className="flex items-start space-x-3 cursor-pointer p-4 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                      <div className="mt-0.5">
                        <input
                          type="checkbox"
                          checked={formData.habeasData}
                          onChange={(e) => handleChange("habeasData", e.target.checked)}
                          style={{ accentColor: '#00008F' }}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium leading-relaxed">
                        El cliente autoriza a AXA COLPATRIA SEGUROS S.A y AXA COLPATRIA SEGUROS DE VIDA S.A el tratamiento de sus datos personales para cotizar la póliza, así como para fines comerciales, su contacto y la transferencia nacional e internacional de los mismos, conforme a la Política de Tratamiento de Datos Personales <a href="https://www.axacolpatria.co/sac/tratamiento-de-datos-personales" target="_blank" rel="noopener noreferrer" className="text-[#00008F] underline hover:text-blue-800 font-bold"><span className="whitespace-nowrap">AXA COLPATRIA</span> | Tratamiento de datos personales.</a>
                      </span>
                    </label>
                  </div>

                  <div className="space-y-3 col-span-1 md:col-span-2 pt-2">
                    <label className="text-xs font-bold text-gray-500 block">¿Qué tipo de cotización deseas? <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Cotización sugerida */}
                      <div
                        onClick={() => handleChange("tipoCotizacion", "Cotización sugerida")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-4 ${formData.tipoCotizacion === "Cotización sugerida" ? "border-[#00008F] bg-blue-50/50" : "border-gray-100 hover:border-gray-300 bg-gray-50"}`}
                      >
                        <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${formData.tipoCotizacion === "Cotización sugerida" ? "border-[#00008F]" : "border-gray-300"}`}>
                          {formData.tipoCotizacion === "Cotización sugerida" && <div className="w-2.5 h-2.5 rounded-full bg-[#00008F]" />}
                        </div>
                        <span className={`text-sm font-semibold flex-1 ${formData.tipoCotizacion === "Cotización sugerida" ? "text-[#00008F]" : "text-gray-600"}`}>
                          Cotización sugerida
                        </span>
                        <div className="relative flex items-center group/tip" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center cursor-help flex-shrink-0 transition-transform hover:scale-110">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#00008F" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                          </div>
                          <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip:block w-96 bg-gray-800 text-white text-sm p-6 rounded-xl shadow-2xl z-30 leading-relaxed pointer-events-none border border-gray-700">
                            Cotización generada automáticamente con base en el perfil del cliente.
                            <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>

                      {/* Cotización personalizada */}
                      <div
                        onClick={() => handleChange("tipoCotizacion", "Cotización personalizada")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-4 ${formData.tipoCotizacion === "Cotización personalizada" ? "border-[#00008F] bg-blue-50/50" : "border-gray-100 hover:border-gray-300 bg-gray-50"}`}
                      >
                        <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${formData.tipoCotizacion === "Cotización personalizada" ? "border-[#00008F]" : "border-gray-300"}`}>
                          {formData.tipoCotizacion === "Cotización personalizada" && <div className="w-2.5 h-2.5 rounded-full bg-[#00008F]" />}
                        </div>
                        <span className={`text-sm font-semibold flex-1 ${formData.tipoCotizacion === "Cotización personalizada" ? "text-[#00008F]" : "text-gray-600"}`}>
                          Cotización personalizada
                        </span>
                        <div className="relative flex items-center group/tip2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center cursor-help flex-shrink-0 transition-transform hover:scale-110">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#00008F" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                          </div>
                          <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip2:block w-96 bg-gray-800 text-white text-sm p-6 rounded-xl shadow-2xl z-30 leading-relaxed pointer-events-none border border-gray-700">
                            Cotización ajustada manualmente según necesidad del cliente.
                            <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 gap-3 md:gap-0 pt-10">
                  <button onClick={handleBack} className="w-full md:w-auto border-2 border-[#00008F] text-[#00008F] hover:bg-blue-50 font-bold py-3 px-10 rounded-full transition-all active:scale-95 flex items-center justify-center space-x-2">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Atrás</span>
                  </button>
                  <button onClick={formData.tipoCotizacion && formData.habeasData && formData.moto ? handleNext : undefined} className={`w-full md:w-auto bg-[#00008F] hover:bg-blue-900 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${(!formData.tipoCotizacion || !formData.habeasData || !formData.moto) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span>Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && formData.tipoCotizacion === "Cotización sugerida" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">¿Cuál de estas opciones te preocupa más? <span className="text-red-500">*</span></label>
                    <div className="relative w-full">
                      <select
                        value={formData.necesidadProteccion}
                        onChange={(e) => handleChange("necesidadProteccion", e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md p-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all truncate"
                      >
                        <option value="">Selecciona la opción más representativa...</option>
                        <option value="1">Protección económica de tu familia en caso de fallecimiento.</option>
                        <option value="2">Respaldo económico ante imprevistos</option>
                        <option value="3">Proteger tu empresa y socios clave</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">¿Cuál es tu estado civil? <span className="text-red-500">*</span></label>
                    <div className="flex flex-col space-y-3">
                      <div className="relative w-full">
                        <select
                          value={formData.estadoCivil}
                          onChange={(e) => handleChange("estadoCivil", e.target.value)}
                          className="w-full appearance-none bg-white border border-gray-200 rounded-md p-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Casado(a)">Casado(a)</option>
                          <option value="Divorciado(a)">Divorciado(a)</option>
                          <option value="Separado(a)">Separado(a)</option>
                          <option value="Soltero(a)">Soltero(a)</option>
                          <option value="Unión Libre">Unión Libre</option>
                          <option value="Viudo(a)">Viudo(a)</option>
                          <option value="Otro">Otro...</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      {formData.estadoCivil === "Otro" && (
                        <input
                          value={formData.estadoCivilOtro}
                          onChange={(e) => handleChange("estadoCivilOtro", e.target.value)}
                          type="text"
                          placeholder="¿Cuál?"
                          className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#00008F] transition-all animate-in fade-in slide-in-from-top-1"
                        />
                      )}
                    </div>
                  </div>



                  <div className="space-y-2 col-span-1">
                    <label className="text-xs font-bold text-gray-500">¿Tienes hijos que dependan económicamente de ti? <span className="text-red-500">*</span></label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input style={{ accentColor: '#00008F' }} type="radio" checked={formData.tieneHijos} onChange={() => handleChange("tieneHijos", true)} className="accent-[#00008F] text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                        <span className="text-sm font-medium">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input style={{ accentColor: '#00008F' }} type="radio" checked={!formData.tieneHijos} onChange={() => { handleChange("tieneHijos", false); handleChange("numeroHijos", ""); }} className="accent-[#00008F] text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                    {formData.tieneHijos && (
                      <div className="pt-2 animate-in fade-in slide-in-from-top-1">
                        <input type="text" value={formData.numeroHijos} onChange={(e) => handleNumberChange("numeroHijos", e.target.value)} placeholder="¿Cuántos?" className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 col-span-1">
                    <label className="text-xs font-bold text-gray-500">¿Algún otro familiar depende económicamente de ti? <span className="text-red-500">*</span></label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input style={{ accentColor: '#00008F' }} type="radio" checked={formData.tieneFamiliares} onChange={() => handleChange("tieneFamiliares", true)} className="accent-[#00008F] text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                        <span className="text-sm font-medium">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input style={{ accentColor: '#00008F' }} type="radio" checked={!formData.tieneFamiliares} onChange={() => { handleChange("tieneFamiliares", false); handleChange("numeroFamiliares", ""); }} className="accent-[#00008F] text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                    {formData.tieneFamiliares && (
                      <div className="pt-2 animate-in fade-in slide-in-from-top-1">
                        <input type="text" value={formData.numeroFamiliares} onChange={(e) => handleNumberChange("numeroFamiliares", e.target.value)} placeholder="¿Cuántos?" className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 col-span-1">
                    <label className="text-xs font-bold text-gray-500">¿Tienes empresa propia? <span className="text-red-500">*</span></label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input style={{ accentColor: '#00008F' }} type="radio" checked={formData.tieneEmpresa} onChange={() => handleChange("tieneEmpresa", true)} className="accent-[#00008F] text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                        <span className="text-sm font-medium">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input style={{ accentColor: '#00008F' }} type="radio" checked={!formData.tieneEmpresa} onChange={() => { handleChange("tieneEmpresa", false); handleChange("valorAcciones", ""); }} className="accent-[#00008F] text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                    {formData.tieneEmpresa && (
                      <div className="pt-2 relative animate-in fade-in slide-in-from-top-1 space-y-1.5">
                        <div className="flex items-center space-x-1.5">
                          <label className="text-xs font-bold text-gray-500">¿Cuál es el valor de tus acciones?</label>
                          <div className="relative flex items-center cursor-help group/tip-empresa">
                            <div className="flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="#00008F" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                              </svg>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tip-empresa:block w-[400px] bg-gray-800 text-white text-sm p-6 rounded-xl shadow-2xl z-30 text-center leading-relaxed border border-gray-700">
                              Incluye solo el valor de tus acciones. No consideres socios ni terceros
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                          <input
                            type="text"
                            value={formatCurrency(formData.valorAcciones)}
                            onChange={(e) => handleCurrencyChange("valorAcciones", e.target.value)}
                            placeholder="¿Cuál es el valor de tus acciones en la empresa?"
                            className="w-full bg-white border border-gray-200 rounded-md p-2.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all"
                          />
                        </div>
                      </div>
                    )}
                  </div>


                  <div className="space-y-2 col-span-1">
                    <label className="text-xs font-bold text-gray-500">¿Tienes actualmente un seguro de vida? <span className="text-red-500">*</span></label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input style={{ accentColor: '#00008F' }} type="radio" checked={formData.tieneSeguroVida} onChange={() => handleChange("tieneSeguroVida", true)} className="text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                        <span className="text-sm font-medium">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input style={{ accentColor: '#00008F' }} type="radio" checked={!formData.tieneSeguroVida} onChange={() => handleChange("tieneSeguroVida", false)} className="text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Ingresos mensuales principales <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                      <input
                        value={formatCurrency(formData.ingresosMensuales)}
                        onChange={(e) => handleCurrencyChange("ingresosMensuales", e.target.value)}
                        type="text"
                        placeholder="0"
                        className="w-full bg-white border border-gray-200 rounded-md p-2.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 relative group">
                    <div className="flex items-center space-x-1.5">
                    <label className="text-xs font-bold text-gray-500">Total gastos mensuales <span className="text-red-500">*</span></label>
                      <div className="relative flex items-center cursor-help group/tip4">
                        <div className="flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#00008F" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tip4:block w-[400px] bg-gray-800 text-white text-sm p-6 rounded-xl shadow-2xl z-30 text-center leading-relaxed border border-gray-700">
                          Tener en cuenta la suma de los gastos mensuales como vivienda, servicios públicos, alimentación, transporte, educación y ocio.
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                      <input
                        value={formatCurrency(formData.gastosMensuales)}
                        onChange={(e) => handleCurrencyChange("gastosMensuales", e.target.value)}
                        type="text"
                        placeholder="0"
                        className="w-full bg-white border border-gray-200 rounded-md p-2.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 col-span-1 md:col-span-2 pt-4 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-500 block">¿Qué metas financieras importantes estás trabajando en este momento?</label>
                    <p className="text-xs text-gray-400 -mt-2">Selecciona las opciones que apliquen e ingresa el monto estimado para cada una.</p>

                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="flex items-center space-x-3 cursor-pointer w-full md:w-1/2">
                          <input style={{ accentColor: '#00008F' }} type="checkbox" checked={formData.metaCompraBien} onChange={(e) => { handleChange("metaCompraBien", e.target.checked); if (!e.target.checked) handleChange("montoCompraBien", ""); }} className="accent-[#00008F] rounded text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                          <span className="text-sm font-medium text-gray-700">Compra de un bien</span>
                        </label>
                        {formData.metaCompraBien && (
                          <div className="relative w-full md:w-1/2 animate-in fade-in slide-in-from-left-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                            <input type="text" value={formatCurrency(formData.montoCompraBien)} onChange={(e) => handleCurrencyChange("montoCompraBien", e.target.value)} placeholder="Monto estimado" className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="flex items-center space-x-3 cursor-pointer w-full md:w-1/2">
                          <input style={{ accentColor: '#00008F' }} type="checkbox" checked={formData.metaOtros} onChange={(e) => { handleChange("metaOtros", e.target.checked); if (!e.target.checked) handleChange("montoOtros", ""); }} className="accent-[#00008F] rounded text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                          <span className="text-sm font-medium text-gray-700">Otros proyectos (Viajes, carro, etc.)</span>
                        </label>
                        {formData.metaOtros && (
                          <div className="relative w-full md:w-1/2 animate-in fade-in slide-in-from-left-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                            <input type="text" value={formatCurrency(formData.montoOtros)} onChange={(e) => handleCurrencyChange("montoOtros", e.target.value)} placeholder="Monto estimado" className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="flex items-center space-x-3 cursor-pointer w-full md:w-1/2">
                          <input style={{ accentColor: '#00008F' }} type="checkbox" checked={formData.metaEducacion} onChange={(e) => handleChange("metaEducacion", e.target.checked)} className="accent-[#00008F] rounded text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                          <span className="text-sm font-medium text-gray-700">Ahorro para la educación de tus hijos</span>
                        </label>
                        {formData.metaEducacion && (
                          <div className="relative w-full md:w-1/2 animate-in fade-in slide-in-from-left-2 opacity-80">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00008F] text-sm font-bold">$</span>
                            <input type="text" readOnly value={formatCurrency(formData.montoEducacion)} placeholder="Calculando..." className="w-full bg-blue-50 border border-blue-200 text-[#00008F] font-bold rounded-md p-2 pl-8 text-sm cursor-not-allowed" title="Valor sugerido por sistema" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <label className="flex items-center space-x-3 cursor-pointer w-full md:w-1/2">
                          <input style={{ accentColor: '#00008F' }} type="checkbox" checked={formData.metaPension} onChange={(e) => handleChange("metaPension", e.target.checked)} className="accent-[#00008F] rounded text-[#00008F] focus:ring-[#00008F] w-4 h-4 cursor-pointer" />
                          <span className="text-sm font-medium text-gray-700">Ahorro para la pensión</span>
                        </label>
                        {formData.metaPension && (
                          <div className="relative w-full md:w-1/2 animate-in fade-in slide-in-from-left-2 opacity-80">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00008F] text-sm font-bold">$</span>
                            <input type="text" readOnly value={formatCurrency(formData.montoPension)} placeholder="Calculando..." className="w-full bg-blue-50 border border-blue-200 text-[#00008F] font-bold rounded-md p-2 pl-8 text-sm cursor-not-allowed" title="Valor calculado por tus finanzas" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 col-span-1 md:col-span-2 pt-6 mt-2 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-sm font-bold text-gray-700 block mb-3 leading-snug">Elige la opción que mejor te describa <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => handleChange("perfilInversion", "garantizado")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 h-full ${formData.perfilInversion === "garantizado" ? "border-[#00008F] bg-blue-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200 bg-gray-50/50"}`}
                      >
                        <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${formData.perfilInversion === "garantizado" ? "border-[#00008F] bg-white" : "border-gray-300 bg-white"}`}>
                          {formData.perfilInversion === "garantizado" && <div className="w-2.5 h-2.5 rounded-full bg-[#00008F]" />}
                        </div>
                        <span className={`text-xs font-semibold leading-relaxed ${formData.perfilInversion === "garantizado" ? "text-[#00008F]" : "text-gray-600"}`}>
                          Prefiero tener un retorno garantizado menor, a poner mi ahorro en riesgo
                        </span>
                      </div>

                      <div
                        onClick={() => handleChange("perfilInversion", "rentabilidad")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 h-full ${formData.perfilInversion === "rentabilidad" ? "border-[#00008F] bg-blue-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200 bg-gray-50/50"}`}
                      >
                        <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${formData.perfilInversion === "rentabilidad" ? "border-[#00008F] bg-white" : "border-gray-300 bg-white"}`}>
                          {formData.perfilInversion === "rentabilidad" && <div className="w-2.5 h-2.5 rounded-full bg-[#00008F]" />}
                        </div>
                        <span className={`text-xs font-semibold leading-relaxed ${formData.perfilInversion === "rentabilidad" ? "text-[#00008F]" : "text-gray-600"}`}>
                          Prefiero generar una mayor rentabilidad, así exista una probabilidad de perder valor en mi ahorro
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 col-span-1 md:col-span-2 pt-4 border-t border-gray-100 mt-6 animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-xs font-bold text-gray-500 block mb-3">Coberturas sugeridas (Calculadas según tu perfil)</label>
                    <div className="overflow-hidden rounded-md border border-gray-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide w-1/3">Cobertura</th>
                            <th className="text-center px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">% Aplicado</th>
                            <th className="text-center px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Monto Asegurado</th>
                            <th className="text-center px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Prima Anual</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { id: 'Fallecimiento', name: 'Fallecimiento', active: true, pct: '100%' },
                            { id: 'Gastos Exequiales', name: 'Gastos Exequiales', active: true, pct: '10%' },
                            { id: 'ITP', name: 'Incapacidad Total y Permanente', active: true, pct: '100%' },
                            { id: 'Exo-ITP', name: 'Exoneración de Primas ITP', active: true, pct: 'Auto' },
                            { id: 'Muerte Accidental', name: 'Muerte Accidental', active: true, pct: '100%' },
                            { id: 'Enf. Graves', name: 'Enfermedades Graves', active: true, pct: '50%' },
                            { id: 'Exo-EG', name: 'Exoneración de Primas EG', active: true, pct: 'Auto' },
                            { id: 'Auxilio Hosp.', name: 'Auxilio de Hospitalización', active: true, pct: '3' },
                            { id: 'Sobrevivencia', name: 'Sobrevivencia', active: true, pct: '1.00' },
                            { id: 'Ahorro', name: 'Ahorro', active: true, pct: '1.50' }
                          ].map(cov => (
                            <tr key={cov.id} className={cov.active ? "bg-blue-50/20" : "bg-gray-50/50 opacity-60"}>
                              <td className="px-4 py-3">
                                <label className="flex items-center space-x-2 cursor-not-allowed">
                                  <input type="checkbox" checked={cov.active} readOnly disabled style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-not-allowed disabled:opacity-70" />
                                  <span className={`text-xs font-semibold ${cov.active ? 'text-gray-700' : 'text-gray-400'}`}>{cov.name}</span>
                                </label>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {cov.active ? (
                                  cov.pct === 'Auto' ? (
                                    ""
                                  ) : (
                                    <span className="text-xs font-bold text-[#00008F] bg-blue-50 px-2 py-1 rounded-md">{cov.pct}</span>
                                  )
                                ) : (
                                  <span className="text-xs font-bold text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">
                                {(() => {
                                  if (!cov.active) return '-';
                                  const va = resultadosSugerida?.valorAsegurado;
                                  if (!va) return '-';
                                  if (cov.pct === 'Auto' || cov.id === 'Auxilio Hosp.') return cov.id === 'Auxilio Hosp.' ? '$150.000' : `$${va.toLocaleString('es-CO')}`;
                                  if (cov.id === 'Sobrevivencia' || cov.id === 'Ahorro') return '--';
                                  const num = parseFloat(cov.pct);
                                  return isNaN(num) ? '-' : `$${Math.round(va * num / 100).toLocaleString('es-CO')}`;
                                })()}
                              </td>
                              <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">
                                {(() => {
                                  if (!cov.active) return '-';
                                  const va = resultadosSugerida?.valorAsegurado;
                                  if (!va) return '-';
                                  if (cov.pct === 'Auto' || cov.id === 'Auxilio Hosp.') return cov.id === 'Auxilio Hosp.' ? '$42.000' : '$25.000';
                                  const num = parseFloat(cov.pct);
                                  return isNaN(num) ? '-' : `$${Math.round(va * num / 100 * 0.005).toLocaleString('es-CO')}`;
                                })()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-blue-50/50 font-bold border-t-2 border-blue-100">
                            <td colSpan={3} className="px-4 py-4 text-right text-xs uppercase tracking-widest text-gray-600 font-extrabold">Total Prima Anual</td>
                            <td className="px-4 py-4 text-center text-[13px] font-black text-[#00008F] bg-blue-100/30">
                              {(() => {
                                const va = resultadosSugerida?.valorAsegurado;
                                if (!va) return '$0';
                                
                                const coverages = [
                                  { id: 'Fallecimiento', active: true, pct: '100%' },
                                  { id: 'Gastos Exequiales', active: true, pct: '10%' },
                                  { id: 'ITP', active: true, pct: '100%' },
                                  { id: 'Exo-ITP', active: true, pct: 'Auto' },
                                  { id: 'Muerte Accidental', active: true, pct: '100%' },
                                  { id: 'Enf. Graves', active: true, pct: '50%' },
                                  { id: 'Exo-EG', active: true, pct: 'Auto' },
                                  { id: 'Auxilio Hosp.', active: true, pct: '3' },
                                  { id: 'Sobrevivencia', active: true, pct: '1.00' },
                                  { id: 'Ahorro', active: true, pct: '1.50' }
                                ];

                                const total = coverages.reduce((sum, cov) => {
                                  if (!cov.active) return sum;
                                  if (cov.pct === 'Auto' || cov.id === 'Auxilio Hosp.') {
                                    return sum + (cov.id === 'Auxilio Hosp.' ? 42000 : 25000);
                                  }
                                  const num = parseFloat(cov.pct);
                                  return sum + Math.round(va * num / 100 * 0.005);
                                }, 0);

                                return `$${total.toLocaleString('es-CO')}`;
                              })()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 gap-3 md:gap-0 pt-10">
                  <button onClick={handleBack} className="w-full md:w-auto border-2 border-[#00008F] text-[#00008F] hover:bg-blue-50 font-bold py-3 px-10 rounded-full transition-all active:scale-95 flex items-center justify-center space-x-2">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Atrás</span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={
                      !formData.ingresosMensuales || 
                      !formData.gastosMensuales || 
                      !formData.necesidadProteccion || 
                      !formData.estadoCivil ||
                      !formData.perfilInversion ||
                      (formData.tieneHijos && !formData.numeroHijos) ||
                      (formData.tieneFamiliares && !formData.numeroFamiliares) ||
                      (formData.tieneEmpresa && !formData.valorAcciones)
                    }
                    className={`w-full md:w-auto bg-[#00008F] hover:bg-blue-900 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${
                      (!formData.ingresosMensuales || !formData.gastosMensuales || !formData.necesidadProteccion || !formData.estadoCivil || !formData.perfilInversion || (formData.tieneHijos && !formData.numeroHijos) || (formData.tieneFamiliares && !formData.numeroFamiliares) || (formData.tieneEmpresa && !formData.valorAcciones)) 
                      ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span>Calcular cotización sugerida</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && formData.tipoCotizacion === "Cotización personalizada" && (() => {
              const SMMLV = 1300000;
              const valAseguradoRaw = parseInt(formData.valorAseguradoPersonalizado.replace(/\./g, '')) || 0;
              // After calculation use the stored result value; before calculation use live form value
              const valParaTabla = resultados?.valorAsegurado || valAseguradoRaw;
              const montoFallecimiento = valParaTabla;
              const montoExequialesBruto = valParaTabla * 0.10;
              const montoExequiales = Math.min(montoExequialesBruto, SMMLV * 20);
              const hasResult = !!resultados;

              return (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    <div className="space-y-1.5 col-span-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 block">Valor Asegurado Deseado <span className="text-red-500">*</span></label>
                      <div className={`relative md:w-1/2 transition-all duration-300 ${highlightField === 'valorAseguradoPersonalizado' ? 'ring-2 ring-indigo-400 ring-offset-2 rounded-md' : ''}`}>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                        <input
                          value={formatCurrency(formData.valorAseguradoPersonalizado)}
                          onChange={(e) => handleCurrencyChange("valorAseguradoPersonalizado", e.target.value)}
                          type="text"
                          placeholder="0"
                          className={`w-full bg-white border ${valAseguradoRaw > 0 && (valAseguradoRaw < 40000000 || valAseguradoRaw > 1500000000) ? 'border-red-500' : 'border-gray-200'} rounded-md p-2.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all`}
                        />
                      </div>
                      {valAseguradoRaw > 0 && valAseguradoRaw < 30000000 && (
                        <div className="flex items-start mt-1.5 text-red-500 text-xs font-medium">
                          <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5" />
                          <span>El valor no puede ser inferior a $40.000.000</span>
                        </div>
                      )}
                      {valAseguradoRaw > 1500000000 && (
                        <div className="flex items-start mt-1.5 text-red-500 text-xs font-medium">
                          <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5" />
                          <span>El valor no puede ser mayor a $1.500.000.000</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-gray-500 block">Vigencia de la Póliza <span className="text-red-500">*</span></label>
                      <div className={`relative transition-all duration-300 ${highlightField === 'vigenciaPoliza' ? 'ring-2 ring-indigo-400 ring-offset-2 rounded-md' : ''}`}>
                        <select
                          value={formData.vigenciaPoliza}
                          onChange={(e) => {
                            handleChange("vigenciaPoliza", e.target.value);
                            handleChange("tiempoPagoPoliza", "");
                          }}
                          className="w-full appearance-none bg-white border border-gray-200 rounded-md p-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all"
                        >
                          <option value="">Selecciona la vigencia...</option>
                          <option value="1 año">1 año</option>
                          <option value="5 años">5 años</option>
                          <option value="10 años">10 años</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-gray-500 block">Tiempo de Pago de la Póliza <span className="text-red-500">*</span></label>
                      <div className={`relative transition-all duration-300 ${highlightField === 'tiempoPagoPoliza' ? 'ring-2 ring-indigo-400 ring-offset-2 rounded-md' : ''}`}>
                        <select
                          value={formData.tiempoPagoPoliza}
                          onChange={(e) => handleChange("tiempoPagoPoliza", e.target.value)}
                          disabled={!formData.vigenciaPoliza}
                          className="w-full appearance-none bg-white border border-gray-200 rounded-md p-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Selecciona el tiempo de pago...</option>
                          <option value="Pago permanente">Pago permanente</option>
                          <option value="Pago único">Pago único</option>
                          {formData.vigenciaPoliza === "5 años" && <option value="Pago en 2 años">Pago en 2 años</option>}
                          {formData.vigenciaPoliza === "10 años" && <option value="Pago en 5 años">Pago en 5 años</option>}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Coverage Table - spans full width */}
                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100">
                      <label className="text-xs font-bold text-gray-500 block mb-1">Coberturas <span className="text-red-500">*</span></label>
                      <p className="text-[13px] text-gray-600 mb-3 italic">A continuación te voy a mencionar algunas coberturas. Por favor indicame cuáles deseas incluir</p>
                      <div className="overflow-hidden rounded-md border border-gray-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide w-1/3">Cobertura</th>
                              <th className="text-center px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">% Aplicado</th>
                              <th className="text-center px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Monto Asegurado</th>
                              <th className="text-center px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Prima Anual</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {/* Fixed: Fallecimiento */}
                            <tr className="bg-blue-50/30">
                              <td className="px-4 py-3 flex items-center space-x-2">
                                <div className="w-4 h-4 rounded border-2 border-[#00008F] bg-[#00008F] flex items-center justify-center flex-shrink-0">
                                  <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <span className="text-xs font-semibold text-gray-700">Fallecimiento</span>
                              </td>
                              <td className="px-4 py-3 text-center"><span className="text-xs font-bold text-[#00008F] bg-blue-50 px-2 py-1 rounded-md">100%</span></td>
                              <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{hasResult ? `$${(valParaTabla).toLocaleString('es-CO')}` : ""}</td>
                              <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult ? `$${Math.round(valParaTabla * 0.005).toLocaleString('es-CO')}` : ""}</td>
                            </tr>
                            {/* Fixed: Gastos Exequiales */}
                            <tr>
                              <td className="px-4 py-3 flex items-center space-x-2">
                                <div className="w-4 h-4 rounded border-2 border-[#00008F] bg-[#00008F] flex items-center justify-center flex-shrink-0">
                                  <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <span className="text-xs font-semibold text-gray-700">Gastos Exequiales</span>
                              </td>
                              <td className="px-4 py-3 text-center"><span className="text-xs font-bold text-[#00008F] bg-blue-50 px-2 py-1 rounded-md">10%</span></td>
                              <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{hasResult ? `$${Math.round(montoExequiales).toLocaleString('es-CO')}` : ""}</td>
                              <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult ? `$${Math.round(montoExequiales * 0.005).toLocaleString('es-CO')}` : ""}</td>
                            </tr>

                            {/* Optional Coverages header */}
                            <tr className="bg-gray-50/80">
                              <td colSpan={4} className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coberturas opcionales</td>
                            </tr>

                            {/* ITP */}
                            {formData.vigenciaPoliza !== "1 año" && (
                              <tr className={formData.coberturaITP ? "bg-blue-50/20" : ""}>
                                <td className="px-4 py-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.coberturaITP} onChange={(e) => handleChange("coberturaITP", e.target.checked)} style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-xs font-semibold text-gray-700">Incapacidad Total y Permanente</span>
                                  </label>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="relative inline-block">
                                    <select disabled={!formData.coberturaITP} value={formData.coberturaITPPct} onChange={(e) => handleChange("coberturaITPPct", e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-md px-2 py-1 text-xs pr-7 disabled:bg-gray-50 disabled:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00008F]">
                                      <option value="">Elige %</option>
                                      {["50", "100", "150", "200", "250", "300"].map(p => <option key={p} value={p}>{p}%</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{hasResult && formData.coberturaITP && formData.coberturaITPPct ? `$${Math.round(valParaTabla * (parseInt(formData.coberturaITPPct)/100)).toLocaleString('es-CO')}` : ""}</td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult && formData.coberturaITP && formData.coberturaITPPct ? `$${Math.round(valParaTabla * (parseInt(formData.coberturaITPPct)/100) * 0.003).toLocaleString('es-CO')}` : ""}</td>
                              </tr>
                            )}

                            {/* Exo-ITP */}
                            {formData.vigenciaPoliza !== "1 año" && formData.tiempoPagoPoliza !== "Pago único" && (
                              <tr className={formData.coberturaExoITP ? "bg-blue-50/20" : ""}>
                                <td className="px-4 py-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.coberturaExoITP} onChange={(e) => handleChange("coberturaExoITP", e.target.checked)} style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-xs font-semibold text-gray-700">Exoneración de Primas ITP</span>
                                  </label>
                                </td>
                                <td className="px-4 py-3 text-center"></td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{hasResult && formData.coberturaExoITP ? `$${(valParaTabla).toLocaleString('es-CO')}` : ""}</td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult && formData.coberturaExoITP ? `$25.000` : ""}</td>
                              </tr>
                            )}

                            {/* Muerte Accidental */}
                            {formData.vigenciaPoliza !== "1 año" && (
                              <tr className={formData.coberturaMA ? "bg-blue-50/20" : ""}>
                                <td className="px-4 py-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.coberturaMA} onChange={(e) => handleChange("coberturaMA", e.target.checked)} style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-xs font-semibold text-gray-700">Muerte Accidental</span>
                                  </label>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="relative inline-block">
                                    <select disabled={!formData.coberturaMA} value={formData.coberturaMAPct} onChange={(e) => handleChange("coberturaMAPct", e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-md px-2 py-1 text-xs pr-7 disabled:bg-gray-50 disabled:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00008F]">
                                      <option value="">Elige %</option>
                                      {["50", "100", "150", "200", "250", "300"].map(p => <option key={p} value={p}>{p}%</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{hasResult && formData.coberturaMA && formData.coberturaMAPct ? `$${Math.round(valParaTabla * (parseInt(formData.coberturaMAPct)/100)).toLocaleString('es-CO')}` : ""}</td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult && formData.coberturaMA && formData.coberturaMAPct ? `$${Math.round(valParaTabla * (parseInt(formData.coberturaMAPct)/100) * 0.002).toLocaleString('es-CO')}` : ""}</td>
                              </tr>
                            )}

                            {/* Enfermedades Graves */}
                            {formData.vigenciaPoliza !== "1 año" && formData.tiempoPagoPoliza !== "Pago único" && (
                              <tr className={formData.coberturaEG ? "bg-blue-50/20" : ""}>
                                <td className="px-4 py-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.coberturaEG} onChange={(e) => handleChange("coberturaEG", e.target.checked)} style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-xs font-semibold text-gray-700">Enfermedades Graves</span>
                                  </label>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="relative inline-block">
                                    <select disabled={!formData.coberturaEG} value={formData.coberturaEGPct} onChange={(e) => handleChange("coberturaEGPct", e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-md px-2 py-1 text-xs pr-7 disabled:bg-gray-50 disabled:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00008F]">
                                      <option value="">Elige %</option>
                                      {["25", "50", "100", "150", "200", "250", "300"].map(p => <option key={p} value={p}>{p}%</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{hasResult && formData.coberturaEG && formData.coberturaEGPct ? `$${Math.round(valParaTabla * (parseInt(formData.coberturaEGPct)/100)).toLocaleString('es-CO')}` : ""}</td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult && formData.coberturaEG && formData.coberturaEGPct ? `$${Math.round(valParaTabla * (parseInt(formData.coberturaEGPct)/100) * 0.006).toLocaleString('es-CO')}` : ""}</td>
                              </tr>
                            )}

                            {/* Exo-EG */}
                            {formData.vigenciaPoliza !== "1 año" && formData.tiempoPagoPoliza !== "Pago único" && (
                              <tr className={formData.coberturaExoEG ? "bg-blue-50/20" : ""}>
                                <td className="px-4 py-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.coberturaExoEG} onChange={(e) => handleChange("coberturaExoEG", e.target.checked)} style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-xs font-semibold text-gray-700">Exoneración de Primas EG</span>
                                  </label>
                                </td>
                                <td className="px-4 py-3 text-center"></td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{hasResult && formData.coberturaExoEG ? `$${(valParaTabla).toLocaleString('es-CO')}` : ""}</td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult && formData.coberturaExoEG ? `$35.000` : ""}</td>
                              </tr>
                            )}

                            {/* Auxilio Hospitalización */}
                            {formData.vigenciaPoliza !== "1 año" && (
                              <tr className={formData.coberturaAH ? "bg-blue-50/20" : ""}>
                                <td className="px-4 py-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.coberturaAH} onChange={(e) => handleChange("coberturaAH", e.target.checked)} style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-xs font-semibold text-gray-700">Auxilio de Hospitalización</span>
                                  </label>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="relative inline-block">
                                    <select disabled={!formData.coberturaAH} value={formData.coberturaAHPlazo} onChange={(e) => handleChange("coberturaAHPlazo", e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-md px-2 py-1 text-xs pr-7 disabled:bg-gray-50 disabled:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00008F]">
                                      <option>3</option>
                                      <option>5</option>
                                      <option>7</option>
                                      <option>10</option>
                                    </select>
                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{hasResult && formData.coberturaAH ? "$150.000" : ""}</td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult && formData.coberturaAH ? `$42.000` : ""}</td>
                              </tr>
                            )}

                            {/* Sobrevivencia */}
                            {formData.vigenciaPoliza !== "1 año" && formData.tiempoPagoPoliza !== "Pago único" && (
                              <tr className={formData.coberturaSobrevivencia ? "bg-blue-50/20" : ""}>
                                <td className="px-4 py-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.coberturaSobrevivencia} onChange={(e) => handleChange("coberturaSobrevivencia", e.target.checked)} style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-xs font-semibold text-gray-700">Sobrevivencia</span>
                                  </label>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="relative inline-block">
                                    <select disabled={!formData.coberturaSobrevivencia} value={formData.coberturaSobrevivenciaPct} onChange={(e) => handleChange("coberturaSobrevivenciaPct", e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-md px-2 py-1 text-xs pr-7 disabled:bg-gray-50 disabled:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00008F]">
                                      <option value="">Elige</option>
                                      {["0.25", "0.50", "1.00", "1.50", "2.00", "2.50", "3.00"].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{formData.coberturaSobrevivencia ? "--" : ""}</td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult && formData.coberturaSobrevivencia && formData.coberturaSobrevivenciaPct ? `$${Math.round(valParaTabla * (parseFloat(formData.coberturaSobrevivenciaPct)/100) * 0.008).toLocaleString('es-CO')}` : ""}</td>
                              </tr>
                            )}

                            {/* Ahorro */}
                            {formData.vigenciaPoliza !== "1 año" && formData.tiempoPagoPoliza !== "Pago único" && (
                              <tr className={formData.coberturaAhorro ? "bg-blue-50/20" : ""}>
                                <td className="px-4 py-3">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.coberturaAhorro} onChange={(e) => handleChange("coberturaAhorro", e.target.checked)} style={{ accentColor: '#00008F' }} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-xs font-semibold text-gray-700">Ahorro</span>
                                  </label>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="relative inline-block">
                                    <select disabled={!formData.coberturaAhorro} value={formData.coberturaAhorroPct} onChange={(e) => handleChange("coberturaAhorroPct", e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-md px-2 py-1 text-xs pr-7 disabled:bg-gray-50 disabled:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00008F]">
                                      <option value="">Elige</option>
                                      {["0.25", "0.50", "1.00", "1.50", "2.00", "2.50", "3.00"].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-gray-700">{formData.coberturaAhorro ? "--" : ""}</td>
                                <td className="px-4 py-3 text-center text-xs font-bold text-[#00008F]">{hasResult && formData.coberturaAhorro && formData.coberturaAhorroPct ? `$${Math.round(valParaTabla * (parseFloat(formData.coberturaAhorroPct)/100) * 0.01).toLocaleString('es-CO')}` : ""}</td>
                              </tr>
                            )}

                          </tbody>
                          <tfoot>
                            <tr className="bg-blue-50/50 font-bold border-t-2 border-blue-100">
                              <td colSpan={3} className="px-4 py-4 text-right text-xs uppercase tracking-widest text-gray-600 font-extrabold">Total Prima Anual</td>
                              <td className="px-4 py-4 text-center text-[13px] font-black text-[#00008F] bg-blue-100/30">
                                {(() => {
                                  if (!hasResult) return '';
                                  // Fixed coverages
                                  let total = Math.round(valParaTabla * 0.005) + Math.round(montoExequiales * 0.005);
                                  
                                  // Optional ones
                                  if (formData.coberturaITP && formData.coberturaITPPct) total += Math.round(valParaTabla * (parseInt(formData.coberturaITPPct)/100) * 0.003);
                                  if (formData.coberturaExoITP) total += 25000;
                                  if (formData.coberturaMA && formData.coberturaMAPct) total += Math.round(valParaTabla * (parseInt(formData.coberturaMAPct)/100) * 0.002);
                                  if (formData.coberturaEG && formData.coberturaEGPct) total += Math.round(valParaTabla * (parseInt(formData.coberturaEGPct)/100) * 0.006);
                                  if (formData.coberturaExoEG) total += 35000;
                                  if (formData.coberturaAH) total += 42000;
                                  if (formData.coberturaSobrevivencia && formData.coberturaSobrevivenciaPct) total += Math.round(valParaTabla * (parseFloat(formData.coberturaSobrevivenciaPct)/100) * 0.008);
                                  if (formData.coberturaAhorro && formData.coberturaAhorroPct) total += Math.round(valParaTabla * (parseFloat(formData.coberturaAhorroPct)/100) * 0.01);
                                  
                                  return `$${total.toLocaleString('es-CO')}`;
                                })()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                  </div>

                  <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 gap-3 md:gap-0 pt-10">
                    <button onClick={handleBack} className="w-full md:w-auto border-2 border-[#00008F] text-[#00008F] hover:bg-blue-50 font-bold py-3 px-10 rounded-full transition-all active:scale-95 flex items-center justify-center space-x-2">
                      <ChevronLeft className="h-4 w-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className={`w-full md:w-auto bg-[#00008F] hover:bg-blue-900 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${(!formData.valorAseguradoPersonalizado || !formData.vigenciaPoliza || !formData.tiempoPagoPoliza || valAseguradoRaw < 40000000 || valAseguradoRaw > 1500000000 || 
                        (formData.coberturaITP && !formData.coberturaITPPct) ||
                        (formData.coberturaMA && !formData.coberturaMAPct) ||
                        (formData.coberturaEG && !formData.coberturaEGPct) ||
                        (formData.coberturaSobrevivencia && !formData.coberturaSobrevivenciaPct) ||
                        (formData.coberturaAhorro && !formData.coberturaAhorroPct) ||
                        !(formData.coberturaITP || formData.coberturaMA || formData.coberturaEG || formData.coberturaSobrevivencia || formData.coberturaAhorro || formData.coberturaExoITP || formData.coberturaExoEG || formData.coberturaAH)
                      ) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={(!formData.valorAseguradoPersonalizado || !formData.vigenciaPoliza || !formData.tiempoPagoPoliza || valAseguradoRaw < 40000000 || valAseguradoRaw > 1500000000 ||
                        (formData.coberturaITP && !formData.coberturaITPPct) ||
                        (formData.coberturaMA && !formData.coberturaMAPct) ||
                        (formData.coberturaEG && !formData.coberturaEGPct) ||
                        (formData.coberturaSobrevivencia && !formData.coberturaSobrevivenciaPct) ||
                        (formData.coberturaAhorro && !formData.coberturaAhorroPct) ||
                        !(formData.coberturaITP || formData.coberturaMA || formData.coberturaEG || formData.coberturaSobrevivencia || formData.coberturaAhorro || formData.coberturaExoITP || formData.coberturaExoEG || formData.coberturaAH)
                      )}
                    >
                      <span>Calcular cotización personalizada</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <aside className={`w-full transition-all duration-500 ease-in-out ${(resultados || resultadosSugerida || resultadosPersonalizada) ? 'md:w-96 lg:w-[420px]' : 'md:w-72 md:min-w-[220px]'}`}>
          {(() => {
            const displayResult = resultados || resultadosSugerida || resultadosPersonalizada;
            if (!displayResult) return (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24 transition-all">
                <h4 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">
                  Progreso del Proceso
                </h4>
                <ul className="space-y-2">
                  {steps.map((step, index) => {
                    const isCompleted = currentStep > index;
                    const isActive = currentStep === index;
                    return (
                      <li
                        key={step.name}
                        className={`flex items-center p-3 rounded-md transition-all ${isActive ? "bg-blue-50 border border-[#00008F]" : "bg-transparent"}`}
                      >
                        <div className="relative flex items-center justify-center mr-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isActive ? "bg-[#00008F] text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${isActive || isCompleted ? "text-[#00008F]" : "text-gray-400"}`}>
                            {step.name}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
            return (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 sticky top-24">



                <div className="bg-gradient-to-br from-[#00008F] to-blue-800 rounded-[5px] p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <div className="relative z-10">
                    <div className="bg-white/10 p-4 rounded-[5px] backdrop-blur-sm border border-white/20">
                      <p className="text-blue-100 text-[10px] uppercase tracking-wider font-semibold">Valor Asegurado</p>
                      <p className="text-3xl font-bold tracking-tight">${displayResult.valorAsegurado.toLocaleString('es-CO')}</p>
                    </div>
                    <div className="mt-4 bg-black/20 rounded-[5px] p-3 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-100">Vigencia:</span>
                        <span className="font-bold text-white text-base">{displayResult.vigencia} {displayResult.vigencia === 1 ? 'año' : 'años'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                        <span className="text-blue-100">Tiempo de pago:</span>
                        <span className="font-bold text-white text-base">{displayResult.tiempoPago}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {resultados ? (
                  <div id="plan-pago-selector" className={`bg-white rounded-[5px] p-5 border shadow-sm relative transition-all duration-300 ${highlightPlanPago ? 'border-indigo-400 ring-2 ring-indigo-300 ring-offset-2' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Detalle de Primas Fraccionadas</h4>
                      <div className="relative flex items-center group/tip5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center cursor-help flex-shrink-0 transition-transform hover:scale-110">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#00008F" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                        </div>
                        <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip5:block w-96 bg-gray-800 text-white text-[12px] p-6 rounded-xl shadow-2xl z-30 leading-relaxed pointer-events-none border border-gray-700">
                          Si eliges pagar tu prima en cuotas (semestral o mensual), el valor total será ligeramente mayor por costos administrativos y financieros asociados.
                          <div className="absolute top-full right-3 border-8 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 font-medium mb-4">Elige la forma de pago deseada</p>
                    <div className="space-y-3 mt-4">
                      <div onClick={() => { 
                        setPlanPago('Anual'); 
                        if (displayResult?.tipo === 'sugerida') setPlanPagoSugerida('Anual');
                        else setPlanPagoPersonalizada('Anual');
                      }} className={`flex flex-col p-3.5 rounded-[5px] border-2 cursor-pointer transition-all relative mt-2 ${planPago === 'Anual' ? 'bg-blue-50/40 border-[#00008F]' : 'bg-white border-gray-100 hover:border-blue-900'}`}>
                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-xs font-bold uppercase tracking-wide ${planPago === 'Anual' ? 'text-[#00008F]' : 'text-gray-500'}`}>Pago Anual</span>
                          <span className={`font-bold text-xl ${planPago === 'Anual' ? 'text-[#00008F]' : 'text-gray-800'}`}>${resultados.cotizacionAnual.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                      <div onClick={() => { 
                        setPlanPago('Semestral'); 
                        if (displayResult?.tipo === 'sugerida') setPlanPagoSugerida('Semestral');
                        else setPlanPagoPersonalizada('Semestral');
                      }} className={`flex flex-col p-3 rounded-[5px] border-2 cursor-pointer transition-all ${planPago === 'Semestral' ? 'bg-blue-50/40 border-[#00008F]' : 'bg-white border-gray-100 hover:border-blue-900'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[11px] font-bold uppercase tracking-wide ${planPago === 'Semestral' ? 'text-[#00008F]' : 'text-gray-500'}`}>Semestral</span>
                          <span className={`font-bold text-base ${planPago === 'Semestral' ? 'text-[#00008F]' : 'text-gray-800'}`}>${resultados.cotizacionSemestral.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 border border-blue-100 rounded-[5px] text-[10px] shadow-sm">
                          <span className="text-gray-500 font-medium">Pago total anual</span>
                          <span className="font-bold text-gray-700">${resultados.pagoAnualSemestral.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                      <div onClick={() => { 
                        setPlanPago('Mensual'); 
                        if (displayResult?.tipo === 'sugerida') setPlanPagoSugerida('Mensual');
                        else setPlanPagoPersonalizada('Mensual');
                      }} className={`flex flex-col p-3 rounded-[5px] border-2 cursor-pointer transition-all ${planPago === 'Mensual' ? 'bg-blue-50/40 border-[#00008F]' : 'bg-white border-gray-100 hover:border-blue-900'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[11px] font-bold uppercase tracking-wide ${planPago === 'Mensual' ? 'text-[#00008F]' : 'text-gray-500'}`}>Mensual</span>
                          <span className={`font-bold text-base ${planPago === 'Mensual' ? 'text-[#00008F]' : 'text-gray-800'}`}>${resultados.cotizacionMensual.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 border border-blue-100 rounded-[5px] text-[10px] shadow-sm">
                          <span className="text-gray-500 font-medium">Pago total anual</span>
                          <span className="font-bold text-gray-700">${resultados.pagoAnualMensual.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white rounded-[5px] p-5 border border-gray-200 shadow-sm">
                    <p className="text-[11px] text-gray-400 font-medium text-center py-2">Genera una cotización para ver el detalle de primas</p>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (resultados && planPago) {
                          setIsFromComparison(false);
                          setIsModalOpen(true);
                        }
                      }}
                      disabled={!planPago}
                      className={`w-full bg-[#00008F] text-white font-bold py-3 px-4 rounded-full shadow-md transition-all active:scale-95 flex justify-center items-center group ${!planPago ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-900'}`}
                    >
                      {displayResult?.tipo === 'sugerida' ? 'Enviar cotización sugerida' : 'Enviar cotización personalizada'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                    </button>

                    <div className="flex items-center my-4">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">O</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {displayResult?.tipo === 'sugerida' ? (
                      <button
                        onClick={() => {
                          if (resultadosPersonalizada) {
                            setFormData(resultadosPersonalizada.formSnap || { ...formData, tipoCotizacion: 'Cotización personalizada' });
                            setResultados(resultadosPersonalizada);
                            setPlanPago(planPagoPersonalizada);
                          } else {
                            setFormData(prev => ({ ...prev, tipoCotizacion: 'Cotización personalizada' }));
                            setResultados(null);
                          }
                          setCurrentStep(3);
                        }}
                        disabled={!planPago}
                        className={`w-full bg-white border-2 border-[#00008F] text-[#00008F] font-bold py-3 px-4 rounded-full transition-all ${!planPago ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                      >
                        Personalizar cotización
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (resultadosSugerida) {
                            setFormData(prev => ({ ...prev, tipoCotizacion: 'Cotización sugerida' }));
                            setResultados(resultadosSugerida);
                            setPlanPago(planPagoSugerida);
                          } else {
                            setFormData(prev => ({ ...prev, tipoCotizacion: 'Cotización sugerida' }));
                            setResultados(null);
                            setCurrentStep(3);
                          }
                        }}
                        disabled={!planPago}
                        className={`w-full bg-white border-2 border-[#00008F] text-[#00008F] font-bold py-3 px-4 rounded-full transition-all ${!planPago ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                      >
                        Iniciar cotización sugerida
                      </button>
                    )}
                  </div>

                  <div className="flex justify-center items-center pt-3 border-t border-gray-100 mt-4">
                    {resultadosSugerida && resultadosPersonalizada ? (
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setIsCompareOpen(true); }}
                        className="text-base font-bold flex items-center transition-all text-[#00008F] hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>
                        Comparar cotizaciones
                      </a>
                    ) : (
                      <div className="relative flex items-center group/tip-compare">
                        <span
                          className="text-base font-bold flex items-center text-gray-300 cursor-not-allowed select-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>
                          Comparar cotizaciones
                        </span>
                        <div className="ml-1.5 cursor-help flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                          <Info size={14} />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tip-compare:block w-72 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-normal text-center border border-gray-700 font-normal">
                          Opción disponible cuando se hayan realizado las dos cotizaciones: personalizada y sugerida
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </aside>
      </main>
      ) : (
        <div className="container mx-auto px-8 py-20 text-center text-gray-500">
          Esta sección ({currentView}) está en construcción.
        </div>
      )}

      <footer className="mt-20 border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        &copy; 2026 CRM de Servicio. Todos los derechos reservados.
      </footer>

      {currentView === "Cotizador" && (
        <button
          onClick={autoFill}
          className="fixed bottom-6 left-6 z-[90] bg-purple-600 hover:bg-purple-700 text-white p-3.5 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center justify-center group"
          title="Autocompletar formulario (Modo Dev)"
        >
          <Wand2 className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap overflow-ellipsis group-hover:ml-3 text-sm font-bold tracking-wide">Autocompletar</span>
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {sendingState === 'idle' ? (
              <>
                <div className="p-6 md:p-8">
                  <div className="w-14 h-14 bg-blue-50 text-[#00008F] rounded-full flex items-center justify-center mb-6 border border-blue-100 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight leading-snug text-center">¿Confirmas que esta es la cotización seleccionada por tu cliente?</h2>
                  <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                    <p className="text-center">Al confirmar, se enviará al correo registrado.</p>
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                      <p className="font-semibold text-[#00008F] flex items-start">
                        <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Recuerda que, una vez enviada, no podrá modificarse y deberás generar una nueva oportunidad.</span>
                      </p>
                    </div>
                    {!isFromComparison && (
                      <p className="text-center text-gray-500">
                        {resultados?.tipo === 'sugerida'
                          ? 'Si el cliente desea ajustarla, te invitamos a revisar la cotización personalizada antes de continuar.'
                          : 'Si el cliente desea, te invitamos a revisar la cotización sugerida antes de continuar.'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 border-t border-gray-100 p-6 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-white hover:border-gray-400 transition-all w-full sm:w-auto focus:ring-2 focus:ring-gray-200 focus:outline-none"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmSend}
                    className="px-8 py-2.5 rounded-full bg-[#00008F] text-white font-bold hover:bg-blue-900 transition-all shadow border border-transparent w-full sm:w-auto active:scale-95 focus:ring-2 focus:ring-[#00008F] focus:ring-offset-2 focus:outline-none"
                  >
                    Aceptar
                  </button>
                </div>
              </>
            ) : sendingState === 'sending' ? (
              <div className="p-8 md:p-10 flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-[#00008F] animate-spin"></div>
                  <div className="absolute inset-2 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#00008F] animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 animate-pulse">Enviando cotización...</h3>
                <p className="text-xs text-gray-500 mt-2">Por favor, espera un momento.</p>
              </div>
            ) : (
              <div className="p-8 md:p-10 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
                  <svg className="w-10 h-10 text-emerald-600 animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">¡Correo enviado con éxito!</h3>
                <p className="text-sm text-gray-600 text-center px-4">La cotización ha sido enviada al cliente.</p>
                <div className="mt-6 flex items-center space-x-2 text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  <svg className="w-3.5 h-3.5 animate-spin text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Redirigiendo a la oportunidad de Juan Pérez...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {isCompareOpen && (() => {
        const allCoverages = ['Fallecimiento', 'Gastos Exequiales', 'ITP', 'Exo-ITP', 'Muerte Accidental', 'Enf. Graves', 'Exo-EG', 'Auxilio Hosp.', 'Sobrevivencia', 'Ahorro'];
        const hasBothQuotes = !!(resultadosSugerida && resultadosPersonalizada);
        const normalizeResult = (r: any) => r || {
          valorAsegurado: 0,
          vigencia: 0,
          tiempoPago: '-',
          cotizacionAnual: 0,
          cotizacionSemestral: 0,
          cotizacionMensual: 0,
          coberturas: [] as string[],
        };
        const sug = normalizeResult(resultadosSugerida || resultados);
        const per = normalizeResult(resultadosPersonalizada || resultados);
        const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-CO')}`;
        const Check = () => <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 mx-auto"><svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
        const Cross = () => <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-50 border border-red-200 mx-auto"><svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>;
        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-blue-950/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#00008F] to-blue-700 px-6 py-5 flex justify-between items-center flex-shrink-0">
                <div>
                  <p className="text-blue-200 text-[10px] uppercase tracking-widest font-bold mb-0.5">Resumen comparativo</p>
                  <h2 className="text-white text-lg font-bold tracking-tight">Comparar Cotizaciones</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setIsCompareOpen(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 w-2/5">Criterios</th>
                      <th className={`text-center px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-b ${quoteSelection === 'sugerida' ? 'text-[#4F39F6] border-l-2 border-r-2 border-t-2 border-[#4F39F6]' : 'text-[#00008F] bg-blue-50 border-blue-100'}`}>
                        <button
                          type="button"
                          onClick={() => openQuoteForReview('sugerida')}
                          className="text-inherit underline-offset-4 hover:underline"
                        >
                          Cotización Sugerida
                        </button>
                        <div className="mt-2 flex justify-center">
                          <input type="radio" name="compare_select" checked={quoteSelection === 'sugerida'} onChange={() => setQuoteSelection('sugerida')} className="w-4 h-4 cursor-pointer" style={{ accentColor: '#4F39F6' }} />
                        </div>
                      </th>
                      <th className={`text-center px-4 py-3 text-[10px] font-bold uppercase tracking-wider border-b ${quoteSelection === 'personalizada' ? 'text-[#4F39F6] border-l-2 border-r-2 border-t-2 border-[#4F39F6]' : 'text-indigo-600 bg-indigo-50 border-indigo-100'}`}>
                        <button
                          type="button"
                          onClick={() => openQuoteForReview('personalizada')}
                          className="text-inherit underline-offset-4 hover:underline"
                        >
                          Cotización Personalizada
                        </button>
                        <div className="mt-2 flex justify-center">
                          <input type="radio" name="compare_select" checked={quoteSelection === 'personalizada'} onChange={() => setQuoteSelection('personalizada')} className="w-4 h-4 cursor-pointer" style={{ accentColor: '#4F39F6' }} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { label: 'Valor asegurado', s: fmt(sug.valorAsegurado), p: fmt(per.valorAsegurado), bold: true },
                      { label: 'Vigencia', s: `${sug.vigencia} ${sug.vigencia === 1 ? 'año' : 'años'}`, p: `${per.vigencia} ${per.vigencia === 1 ? 'año' : 'años'}` },
                      { label: 'Tiempo de Pago', s: sug.tiempoPago, p: per.tiempoPago },
                      { label: 'Pago Anual', accentS: planPagoSugerida === 'Anual', accentP: planPagoPersonalizada === 'Anual', s: fmt(sug.cotizacionAnual), p: fmt(per.cotizacionAnual) },
                      { label: 'Pago Semestral', accentS: planPagoSugerida === 'Semestral', accentP: planPagoPersonalizada === 'Semestral', s: fmt(sug.cotizacionSemestral), p: fmt(per.cotizacionSemestral) },
                      { label: 'Pago Mensual', accentS: planPagoSugerida === 'Mensual', accentP: planPagoPersonalizada === 'Mensual', s: fmt(sug.cotizacionMensual), p: fmt(per.cotizacionMensual) },
                    ].map(row => {
                      const accentS = !!(row as any).accentS;
                      const accentP = !!(row as any).accentP;
                      const sugSelected = quoteSelection === 'sugerida';
                      const perSelected = quoteSelection === 'personalizada';

                      return (
                        <tr key={row.label} className="hover:bg-gray-50/60 transition-all relative">
                          <td className="px-5 py-3 text-xs font-semibold text-gray-600">{row.label}</td>
                          <td
                            className={`px-3 py-3 text-center transition-all ${
                              accentS ? 'bg-gray-200' : ''
                            } ${sugSelected ? 'border-l-2 border-r-2 border-[#4F39F6]' : ''}`}
                          >
                            <span className="flex flex-col items-center justify-center gap-0.5">
                              <span className={accentS ? 'text-sm font-black text-gray-700' : (row as any).bold ? 'text-xs font-bold text-gray-800' : 'text-xs text-gray-700'}>
                                {row.s}
                              </span>
                            </span>
                          </td>
                          <td
                            className={`px-3 py-3 text-center transition-all ${
                              accentP ? 'bg-gray-200' : ''
                            } ${perSelected ? 'border-l-2 border-r-2 border-[#4F39F6]' : ''}`}
                          >
                            <span className="flex flex-col items-center justify-center gap-0.5">
                              <span className={accentP ? 'text-sm font-black text-gray-700' : (row as any).bold ? 'text-xs font-bold text-gray-800' : 'text-xs text-gray-700'}>
                                {row.p}
                              </span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-100">
                      <td className="px-5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Coberturas</td>
                      <td className={`px-4 py-2 ${quoteSelection === 'sugerida' ? 'border-l-2 border-r-2 border-[#4F39F6]' : ''}`}></td>
                      <td className={`px-4 py-2 ${quoteSelection === 'personalizada' ? 'border-l-2 border-r-2 border-[#4F39F6]' : ''}`}></td>
                    </tr>
                    {allCoverages.map((cov, idx) => {
                      const inSug = sug.coberturas?.includes(cov);
                      const inPer = per.coberturas?.includes(cov);
                      const isLastCoverage = idx === allCoverages.length - 1;
                      return (
                        <tr key={cov} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-2.5 text-xs font-semibold text-gray-600">{cov}</td>
                          <td className={`px-4 py-2.5 ${quoteSelection === 'sugerida' ? `${isLastCoverage ? 'border-l-2 border-r-2 border-b-2 border-[#4F39F6]' : 'border-l-2 border-r-2 border-[#4F39F6]'}` : ''}`}>{inSug ? <Check /> : <Cross />}</td>
                          <td className={`px-4 py-2.5 ${quoteSelection === 'personalizada' ? `${isLastCoverage ? 'border-l-2 border-r-2 border-b-2 border-[#4F39F6]' : 'border-l-2 border-r-2 border-[#4F39F6]'}` : ''}`}>{inPer ? <Check /> : <Cross />}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center flex-shrink-0 bg-gray-50/50 gap-4">
                <div className="w-full md:w-auto" />
                <div className="flex space-x-3 w-full md:w-auto justify-end">
                  <button onClick={() => setIsCompareOpen(false)} className="px-5 py-2.5 rounded-full border-2 border-[#00008F] text-[#00008F] font-bold hover:bg-blue-50 transition-all text-[11px] active:scale-95">
                    Cancelar
                  </button>
                  {(() => {
                    const selectedPlan = quoteSelection === 'sugerida' ? planPagoSugerida : planPagoPersonalizada;
                    return (
                      <button
                        disabled={!quoteSelection || !selectedPlan || !hasBothQuotes}
                        onClick={() => {
                          if (quoteSelection === 'sugerida') {
                            setResultados(resultadosSugerida);
                            setPlanPago(planPagoSugerida);
                          } else if (quoteSelection === 'personalizada') {
                            setResultados(resultadosPersonalizada);
                            setPlanPago(planPagoPersonalizada);
                          }
                          setIsCompareOpen(false);
                          setIsFromComparison(true);
                          setIsModalOpen(true);
                        }}
                        className={`px-6 py-2.5 rounded-full bg-[#00008F] text-white font-bold transition-all shadow text-[11px] flex items-center active:scale-95 ${!quoteSelection || !selectedPlan || !hasBothQuotes ? 'opacity-50 cursor-not-allowed hover:bg-[#00008F]' : 'hover:bg-blue-900'}`}
                      >
                        Enviar cotización
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
