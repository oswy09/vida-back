import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, ChevronDown, Check, CheckCircle2, Wand2, Plus, Trash2, CircleX, Info } from 'lucide-react';

interface CompletarDatosViewProps {
  oportunidad: any;
  onBack: () => void;
  onGoToOportunidadInicio?: () => void;
  onComplete?: () => void;
}

const steps = [
  "Datos adicionales del asegurado",
  "Datos médicos del asegurado",
  "Datos tomador",
  "Datos beneficiarios"
];

const sidebarSteps = [
  "Datos del asegurado",
  "Datos médicos",
  "Datos tomador",
  "Datos beneficiarios"
];

const SARLAFT_STEP_TITLE = "Formato Conocimiento del Cliente (SARLAFT)";

const LabelWithTooltip = ({ label, tooltip, required = true }: { label: string; tooltip: string; required?: boolean }) => {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="block text-xs font-bold text-gray-500">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <div className="relative flex items-center group/tip" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center cursor-help flex-shrink-0 transition-transform hover:scale-110">
          <Info className="w-3.5 h-3.5 text-white" fill="#00008F" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 hidden group-hover/tip:block w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 text-center pointer-events-none border border-gray-700 leading-normal font-normal">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

function FormatoConocimientoClienteForm({ 
  data, 
  onChange, 
  subStep, 
  beneficiariosData, 
  onBeneficiariosChange 
}: { 
  data: SarlaftData; 
  onChange: (d: SarlaftData) => void; 
  subStep: 0 | 1 | 2; 
  beneficiariosData: BeneficiarioData[]; 
  onBeneficiariosChange: (d: BeneficiarioData[]) => void; 
}) {
  const pepQuestions = [
    { key: "esPep", label: "¿Eres una Persona Expuesta Políticamente (PEP)?" },
    { key: "esPepExtranjera", label: "¿Eres una Persona Expuesta Políticamente (PEP) extranjera?" },
    { key: "esPepOrganizacionInt", label: "¿Eres una persona expuesta políticamente (PEP) de organizaciones internacionales?" },
    { key: "tieneRelacionConyugalPep", label: "¿Tienes una relación conyugal o unión de hecho con una Persona Expuesta Políticamente (PEP)?" },
    { key: "tieneRelacionNegociosPep", label: "¿Tienes una relación cercana o de negocios con una Persona Expuesta Políticamente (PEP)?" },
    { key: "tieneFamiliarPep", label: "¿Tienes algún familiar que sea una Persona Expuesta Políticamente (PEP)?" },
    { key: "obligacionesFiscalesOtroPais", label: "¿Tienes obligaciones fiscales en otro país?" },
  ] as const;

  const requiresPepDetails =
    data.tieneRelacionConyugalPep === "si" ||
    data.tieneRelacionNegociosPep === "si" ||
    data.tieneFamiliarPep === "si";

  const isInvalidMonetary = (val: string) => !!val.trim() && !isMonetaryValue(val);
  const ingresosInvalido = isInvalidMonetary(data.ingresosMensualesPrincipales);
  const gastosInvalido = isInvalidMonetary(data.gastosMensuales);
  const otrosIngresosInvalido = isInvalidMonetary(data.valorOtrosIngresos);
  const activosInvalido = isInvalidMonetary(data.valorActivos);
  const pasivosInvalido = isInvalidMonetary(data.valorPasivos);
  const patrimonioInvalido = isInvalidMonetary(data.valorPatrimonio);

  const handleText = (key: keyof SarlaftData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const renderYesNoChecks = (key: keyof SarlaftData, label: string) => (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}<Req /></label>
      <div className="flex flex-wrap gap-4 pt-1">
        {[{ label: "Sí", value: "si" }, { label: "No", value: "no" }].map((opt) => (
          <label
            key={opt.value}
            onClick={() => onChange({ ...data, [key]: data[key] === opt.value ? "" : opt.value })}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer select-none hover:bg-gray-50 transition-all"
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                data[key] === opt.value
                  ? "bg-[#00008F] border border-[#00008F]"
                  : "bg-white border border-gray-300"
              }`}
            >
              {data[key] === opt.value && <Check className="w-3 h-3 text-white" strokeWidth={2.4} />}
            </div>
            <span className="text-sm font-medium text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (subStep === 0) {
    return (
      <div className="space-y-6 flex-1">
        <div>
          <h2 className={sectionTitleClass}>INFORMACION PERSONA EXPUESTA POLITICAMENTE (PEP)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pepQuestions.slice(0, 6).map((q) => (
              <div key={q.key}>{renderYesNoChecks(q.key, q.label)}</div>
            ))}

            {renderYesNoChecks("obligacionesFiscalesOtroPais", "¿Tienes obligaciones fiscales en otro país?")}
          </div>

          {requiresPepDetails && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 rounded-xl border border-blue-100 bg-blue-50/30 p-5">
              <div className="space-y-1.5">
                <label className={labelClass}>Nombre Completo<Req /></label>
                <input
                  type="text"
                  value={data.pepNombreCompleto}
                  onChange={(e) => handleText("pepNombreCompleto", e.target.value)}
                  placeholder="Nombre completo"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Cargo<Req /></label>
                <input
                  type="text"
                  value={data.pepCargo}
                  onChange={(e) => handleText("pepCargo", e.target.value)}
                  placeholder="Cargo"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (subStep === 2) {
    const handleBeneficiarioChange = (id: number, field: keyof BeneficiarioData, val: any) => {
      const updated = beneficiariosData.map(b => (b.id === id ? { ...b, [field]: val } : b));
      onBeneficiariosChange(updated);
    };

    const naturales = beneficiariosData.filter(b => b.tipoDocumento !== "NIT");
    const juridicas = beneficiariosData.filter(b => b.tipoDocumento === "NIT");

    return (
      <div className="space-y-6 flex-1">
        <div>
          <h2 className={sectionTitleClass}>INFORMACION DE BENEFICIARIOS</h2>
          <p className="text-xs text-gray-500 mb-6">
            Por favor, diligencia la siguiente información para cada beneficiario registrado:
          </p>

          <div className="space-y-8">
            {/* Sección Persona Natural */}
            {naturales.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 bg-gray-100/60 px-3 py-1.5 rounded border-l-4 border-[#00008F]">
                  Beneficiarios persona Natural
                </h3>
                <div className="space-y-4">
                  {naturales.map((b, idx) => (
                    <div key={b.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/20">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                        <span className="text-sm font-bold text-gray-800">{b.nombreBeneficiario?.trim() || `Beneficiario ${idx + 1}`}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                        {/* ¿Es PEP? */}
                        <div className="space-y-1.5">
                          <label className={labelClass}>¿Es una Persona Expuesta Políticamente (PEP)?<Req /></label>
                          <div className="flex gap-4 pt-1">
                            {[{ label: "Sí", value: "si" }, { label: "No", value: "no" }].map((opt) => (
                              <label
                                key={opt.value}
                                onClick={() => handleBeneficiarioChange(b.id, "esPep", b.esPep === opt.value ? "" : opt.value)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer select-none hover:bg-gray-50 transition-all"
                              >
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                    b.esPep === opt.value
                                      ? "bg-[#00008F] border border-[#00008F]"
                                      : "bg-white border border-gray-300"
                                  }`}
                                >
                                  {b.esPep === opt.value && <Check className="w-3 h-3 text-white" strokeWidth={2.4} />}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* ¿Es beneficiario de otra póliza? */}
                        <div className="space-y-1.5">
                          <label className={labelClass}>¿Actualmente es beneficiario de una póliza de vida o de una póliza con componente de ahorro e inversión?<Req /></label>
                          <div className="flex gap-4 pt-1">
                            {[{ label: "Sí", value: "si" }, { label: "No", value: "no" }].map((opt) => (
                              <label
                                key={opt.value}
                                onClick={() => handleBeneficiarioChange(b.id, "esBeneficiarioOtraPoliza", b.esBeneficiarioOtraPoliza === opt.value ? "" : opt.value)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer select-none hover:bg-gray-50 transition-all"
                              >
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                    b.esBeneficiarioOtraPoliza === opt.value
                                      ? "bg-[#00008F] border border-[#00008F]"
                                      : "bg-white border border-gray-300"
                                  }`}
                                >
                                  {b.esBeneficiarioOtraPoliza === opt.value && <Check className="w-3 h-3 text-white" strokeWidth={2.4} />}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Fecha de expedición */}
                        <div className="space-y-1.5">
                          <label className={labelClass}>Fecha de expedición del documento del beneficiario<Req /></label>
                          <input
                            type="date"
                            value={b.fechaExpedicion || ""}
                            onChange={(e) => handleBeneficiarioChange(b.id, "fechaExpedicion", e.target.value)}
                            className={`${inputClass} ${
                              b.fechaExpedicion && !isDateNotFuture(b.fechaExpedicion)
                                ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500"
                                : ""
                            }`}
                          />
                          {b.fechaExpedicion && !isDateNotFuture(b.fechaExpedicion) && (
                            <p className="text-xs font-semibold text-red-600 mt-1">La fecha de expedición no puede ser superior a la fecha actual.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sección Persona Jurídica */}
            {juridicas.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 bg-gray-100/60 px-3 py-1.5 rounded border-l-4 border-[#00008F]">
                  Beneficiarios persona Jurídica
                </h3>
                <div className="space-y-4">
                  {juridicas.map((b, idx) => (
                    <div key={b.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/20">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                        <span className="text-sm font-bold text-gray-800">{b.nombreBeneficiario?.trim() || `Beneficiario ${idx + 1}`}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                        {/* ¿Es beneficiario de otra póliza? */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className={labelClass}>¿Actualmente es beneficiario de una póliza de vida o de una póliza con componente de ahorro e inversión?<Req /></label>
                          <div className="flex gap-4 pt-1">
                            {[{ label: "Sí", value: "si" }, { label: "No", value: "no" }].map((opt) => (
                              <label
                                key={opt.value}
                                onClick={() => handleBeneficiarioChange(b.id, "esBeneficiarioOtraPoliza", b.esBeneficiarioOtraPoliza === opt.value ? "" : opt.value)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer select-none hover:bg-gray-50 transition-all"
                              >
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                    b.esBeneficiarioOtraPoliza === opt.value
                                      ? "bg-[#00008F] border border-[#00008F]"
                                      : "bg-white border border-gray-300"
                                  }`}
                                >
                                  {b.esBeneficiarioOtraPoliza === opt.value && <Check className="w-3 h-3 text-white" strokeWidth={2.4} />}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Nombre del Representante Legal */}
                        <div className="space-y-1.5">
                          <label className={labelClass}>Nombre Completo del Representante Legal<Req /></label>
                          <input
                            type="text"
                            value={b.nombreRepresentanteLegal || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^[A-Za-zÁéíóúáéíóúÑñüÜ\s.]+$/.test(val)) {
                                handleBeneficiarioChange(b.id, "nombreRepresentanteLegal", val);
                              }
                            }}
                            placeholder="Nombre del representante"
                            className={`${inputClass} ${
                              b.nombreRepresentanteLegal && !isValidRepresentanteName(b.nombreRepresentanteLegal)
                                ? "border-red-500 bg-red-50 text-red-700"
                                : ""
                            }`}
                          />
                          {b.nombreRepresentanteLegal && !isValidRepresentanteName(b.nombreRepresentanteLegal) && (
                            <p className="text-xs font-semibold text-red-600 mt-1">El nombre solo permite letras y puntos.</p>
                          )}
                        </div>

                        {/* Tipo de documento Representante Legal */}
                        <div className="space-y-1.5 relative z-20">
                          <label className={labelClass}>Tipo de documento del Representante Legal<Req /></label>
                          <SearchableSelect
                            value={b.tipoDocumentoRepresentanteLegal || ""}
                            onChange={(value) => handleBeneficiarioChange(b.id, "tipoDocumentoRepresentanteLegal", value)}
                            options={TIPOS_DOCUMENTO_REPRESENTANTE}
                            placeholder="Seleccione tipo"
                          />
                        </div>

                        {/* Número de documento Representante Legal */}
                        <div className="space-y-1.5">
                          <label className={labelClass}>Número de Documento del Representante Legal<Req /></label>
                          <input
                            type="text"
                            value={b.numeroDocumentoRepresentanteLegal || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^[A-Za-z0-9]+$/.test(val)) {
                                handleBeneficiarioChange(b.id, "numeroDocumentoRepresentanteLegal", val);
                              }
                            }}
                            placeholder="Número de documento"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex-1">
      <div>
        <h2 className={sectionTitleClass}>INFORMACION ECONOMICA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={labelClass}>Nombre de la empresa donde trabajas<Req /></label>
            <input type="text" value={data.empresaDondeTrabaja} onChange={(e) => handleText("empresaDondeTrabaja", e.target.value)} className={inputClass} placeholder="Empresa" />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Cargo<Req /></label>
            <input type="text" value={data.cargoLaboral} onChange={(e) => handleText("cargoLaboral", e.target.value)} className={inputClass} placeholder="Cargo" />
          </div>
          <div className="space-y-1.5">
            <LabelWithTooltip
              label="Ingresos mensuales principales (COP)"
              tooltip="Incluye ingresos provenientes de tu actividad económica principal, como salario, honorarios o pensión"
            />
            <input type="text" value={data.ingresosMensualesPrincipales} onChange={(e) => handleText("ingresosMensualesPrincipales", e.target.value)} className={`${inputClass} ${ingresosInvalido ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`} placeholder="Ej: 4000000" />
            {ingresosInvalido && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
          </div>
          <div className="space-y-1.5">
            <LabelWithTooltip
              label="Gastos mensuales (COP)"
              tooltip="Tener en cuenta la suma de los gastos mensuales como vivienda, servicios públicos, alimentación, transporte, educación y ocio"
            />
            <input type="text" value={data.gastosMensuales} onChange={(e) => handleText("gastosMensuales", e.target.value)} className={`${inputClass} ${gastosInvalido ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`} placeholder="Ej: 2500000" />
            {gastosInvalido && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
          </div>
          <div className="space-y-1.5">
            <LabelWithTooltip
              label="Valor de otros ingresos (COP)"
              tooltip="Incluye ingresos diferentes a tu actividad principal, como arriendos, comisiones, negocios o inversiones."
            />
            <input type="text" value={data.valorOtrosIngresos} onChange={(e) => handleText("valorOtrosIngresos", e.target.value)} className={`${inputClass} ${otrosIngresosInvalido ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`} placeholder="Ej: 500000" />
            {otrosIngresosInvalido && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Concepto de otros ingresos<Req /></label>
            <input type="text" value={data.conceptoOtrosIngresos} onChange={(e) => handleText("conceptoOtrosIngresos", e.target.value)} className={inputClass} placeholder="Describe el concepto" />
          </div>
          <div className="space-y-1.5">
            <LabelWithTooltip
              label="¿Cuál es el valor total de tus activos? (COP)"
              tooltip="Incluye propiedades, vehículos, ahorros, inversiones and demás bienes a tu nombre"
            />
            <input type="text" value={data.valorActivos} onChange={(e) => handleText("valorActivos", e.target.value)} className={`${inputClass} ${activosInvalido ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`} placeholder="Ej: 120000000" />
            {activosInvalido && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
          </div>
          <div className="space-y-1.5">
            <LabelWithTooltip
              label="¿Cuál es el valor total de tus pasivos? (COP)"
              tooltip="Incluye créditos, préstamos, tarjetas de crédito, hipotecas y demás deudas u obligaciones financieras."
            />
            <input type="text" value={data.valorPasivos} onChange={(e) => handleText("valorPasivos", e.target.value)} className={`${inputClass} ${pasivosInvalido ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`} placeholder="Ej: 20000000" />
            {pasivosInvalido && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
          </div>
          <div className="space-y-1.5">
            <LabelWithTooltip
              label="¿Cuál es el valor total de tu patrimonio? (COP)"
              tooltip="Tu patrimonio corresponde al valor de tus activos menos tus pasivos."
            />
            <input type="text" value={data.valorPatrimonio} onChange={(e) => handleText("valorPatrimonio", e.target.value)} className={`${inputClass} ${patrimonioInvalido ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`} placeholder="Ej: 100000000" />
            {patrimonioInvalido && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>¿Cuál es el origen de los fondos para adquirir el seguro?<Req /></label>
            <input type="text" value={data.origenFondosSeguro} onChange={(e) => handleText("origenFondosSeguro", e.target.value)} className={inputClass} placeholder="Origen de fondos" />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>¿El pago de la prima se realizará en moneda extranjera?<Req /></label>
            <SearchableSelect
              value={data.pagoPrimaMonedaExtranjera}
              onChange={(value) => onChange({ ...data, pagoPrimaMonedaExtranjera: value as "" | "si" | "no" })}
              options={YES_NO_OPTIONS}
              placeholder="Seleccione una opción"
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>¿El pago de la prima se realizará desde una cuenta del exterior?<Req /></label>
            <SearchableSelect
              value={data.pagoPrimaCuentaExterior}
              onChange={(value) => onChange({ ...data, pagoPrimaCuentaExterior: value as "" | "si" | "no" })}
              options={YES_NO_OPTIONS}
              placeholder="Seleccione una opción"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClass}>¿Qué producto o servicio ofrece la empresa donde trabajas o tú como independiente?<Req /></label>
            <input type="text" value={data.productoServicioEmpresa} onChange={(e) => handleText("productoServicioEmpresa", e.target.value)} className={inputClass} placeholder="Producto o servicio" />
          </div>
        </div>
      </div>
    </div>
  );
}

const ENFERMEDADES_LIST = [
  "Ninguna",
  "Hipertensión arterial",
  "Diabetes",
  "Enfermedades Hepáticas",
  "Trastornos Neurológicos",
  "Inmunológicas",
  "Infección por VIH o SIDA",
  "Accidente cerebrovascular",
  "Enfermedades Renales",
  "Enfermedades Pulmonares",
  "Trastornos Psiquiátricos",
  "Articulares",
  "Hepatitis B o C",
  "Obesidad y/o metabólicas",
  "Otra"
];

const DEPARTAMENTOS_COLOMBIA = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá",
  "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba",
  "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés y Providencia", "Santander", "Sucre", "Tolima",
  "Valle del Cauca", "Vaupés", "Vichada",
];

const CIUDADES_COLOMBIA = [
  "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga",
  "Pereira", "Manizales", "Santa Marta", "Ibagué", "Villavicencio", "Pasto",
  "Montería", "Cúcuta", "Armenia", "Neiva", "Sincelejo", "Popayán",
  "Calarcá", "La Tebaida", "Montenegro", "Circasia", "Quimbaya", "Salento"
];

const PAISES_NACIMIENTO = [
  "Colombia", "Venezuela", "Ecuador", "Perú", "Panamá", "México", "Estados Unidos", "España"
];

const NACIONALIDADES = [
  "Colombiana",
  "Venezolana",
  "Ecuatoriana",
  "Peruana",
  "Panameña",
  "Mexicana",
  "Estadounidense",
  "Española",
  "Otra"
];

const CIUDADES_POR_DEPARTAMENTO: Record<string, string[]> = {
  "Antioquia": ["Medellín"],
  "Atlántico": ["Barranquilla"],
  "Bolívar": ["Cartagena"],
  "Caldas": ["Manizales"],
  "Cauca": ["Popayán"],
  "Cundinamarca": ["Bogotá"],
  "Huila": ["Neiva"],
  "Magdalena": ["Santa Marta"],
  "Meta": ["Villavicencio"],
  "Nariño": ["Pasto"],
  "Norte de Santander": ["Cúcuta"],
  "Quindío": ["Armenia", "Calarcá", "La Tebaida", "Montenegro", "Circasia", "Quimbaya", "Salento"],
  "Risaralda": ["Pereira"],
  "Sucre": ["Sincelejo"],
  "Tolima": ["Ibagué"],
  "Valle del Cauca": ["Cali"],
  "Córdoba": ["Montería"],
};

const NACIONALIDADES_POR_PAIS: Record<string, string[]> = {
  "Colombia": ["Colombiana"],
  "Venezuela": ["Venezolana"],
  "Ecuador": ["Ecuatoriana"],
  "Perú": ["Peruana"],
  "Panamá": ["Panameña"],
  "México": ["Mexicana"],
  "Estados Unidos": ["Estadounidense"],
  "España": ["Española"],
};

const TIPOS_VIA = ["Carrera", "Calle", "Avenida", "Diagonal", "Transversal", "Circular", "Autopista", "Variante"];
const TIPOS_DOCUMENTO = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte", "Tarjeta de identidad", "Permiso por Protección Temporal", "NIT"];
const TIPOS_DOCUMENTO_BENEFICIARIO = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte", "Tarjeta de identidad", "Registro Civil", "Permiso por Protección Temporal", "NIT"];
const PARENTESCOS = ["Cónyuge", "Compañero(a) permanente", "Hijo(a)", "Padre", "Madre", "Hermano(a)", "Abuelo(a)", "Nieto(a)", "Otro"];
const EPS_OPTIONS = [
  "Nueva EPS",
  "Salud Total",
  "EPS Sanitas",
  "EPS Sura",
  "EPS Famisanar",
  "Aliansalud - Sanitas",
];
const FORMATO_ERROR = "Campo no cumple con el formato requerido";

const inputClass = "w-full bg-white border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00008F] transition-all";
const selectClass = inputClass + " appearance-none pr-10";
const labelClass = "block text-xs font-bold text-gray-500 mb-1.5";
const sectionTitleClass = "text-sm font-bold text-[#00008F] mb-4 pb-2 border-b border-blue-100";
const Req = () => <span className="text-red-500"> *</span>;

interface AseguradoData {
  departamento: string;
  ciudad: string;
  tipoVia: string;
  numeroVia: string;
  numeroFinal: string;
  complemento: string;
  fechaExpedicion: string;
  lugarNacimiento: string;
  nacionalidad: string;
}

interface TomadorData {
  esTomadorAsegurado: boolean | null;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreTomador: string;
  fechaExpedicion: string;
}

interface BeneficiarioData {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreBeneficiario: string;
  porcentajeBeneficio: string;
  parentesco: string;
  parentescoOtro?: string;
  esPep?: string;
  esBeneficiarioOtraPoliza?: string;
  fechaExpedicion?: string;
  nombreRepresentanteLegal?: string;
  tipoDocumentoRepresentanteLegal?: string;
  numeroDocumentoRepresentanteLegal?: string;
}

interface InformacionMedicaData {
  eps: string;
  peso: string;
  estatura: string;
  enfermedades: Record<string, boolean>;
  enfermedadOtra: string;
  diagnosticoCancer: "" | "si" | "no";
  detalleMedicoAdicional: string;
  cirugiaRealizada: "" | "si" | "no";
  fechaUltimaCirugia: string;
  tipoCirugiaRealizada: string;
  cirugiaPendiente: "" | "si" | "no";
  fechaCirugiaPendiente: string;
  tipoCirugiaPendiente: string;
  tomaMedicamentos: "" | "si" | "no";
  medicamentoCual: string;
  medicamentoMotivo: string;
  embarazada: "" | "si" | "no" | "no_aplica";
  mesesGestacion: string;
  limitacionFisica: "" | "si" | "no";
  limitacionDetalle: string;
  frecuenciaAlcohol: string;
  fumador: "" | "si" | "no";
  cigarrillosDiarios: string;
}

interface SarlaftData {
  esPep: "" | "si" | "no";
  esPepExtranjera: "" | "si" | "no";
  esPepOrganizacionInt: "" | "si" | "no";
  tieneRelacionConyugalPep: "" | "si" | "no";
  tieneRelacionNegociosPep: "" | "si" | "no";
  tieneFamiliarPep: "" | "si" | "no";
  pepNombreCompleto: string;
  pepCargo: string;
  obligacionesFiscalesOtroPais: "" | "si" | "no";
  cargoLaboral: string;
  empresaDondeTrabaja: string;
  ingresosMensualesPrincipales: string;
  gastosMensuales: string;
  valorOtrosIngresos: string;
  conceptoOtrosIngresos: string;
  valorActivos: string;
  valorPasivos: string;
  valorPatrimonio: string;
  origenFondosSeguro: string;
  pagoPrimaMonedaExtranjera: "" | "si" | "no";
  pagoPrimaCuentaExterior: "" | "si" | "no";
  productoServicioEmpresa: string;
}

const YES_NO_OPTIONS = ["si", "no"];

const DEMO_INFO_MEDICA: InformacionMedicaData = {
  eps: "EPS Sura",
  peso: "70",
  estatura: "175",
  enfermedades: { "Otra": true },
  enfermedadOtra: "Alergia a la penicilina",
  diagnosticoCancer: "no",
  detalleMedicoAdicional: "",
  cirugiaRealizada: "no",
  fechaUltimaCirugia: "",
  tipoCirugiaRealizada: "",
  cirugiaPendiente: "no",
  fechaCirugiaPendiente: "",
  tipoCirugiaPendiente: "",
  tomaMedicamentos: "no",
  medicamentoCual: "",
  medicamentoMotivo: "",
  embarazada: "no_aplica",
  mesesGestacion: "",
  limitacionFisica: "no",
  limitacionDetalle: "",
  frecuenciaAlcohol: "Ocasionalmente",
  fumador: "no",
  cigarrillosDiarios: "",
};

const DEMO_ASEGURADO: AseguradoData = {
  departamento: "Antioquia",
  ciudad: "Medellín",
  tipoVia: "Carrera",
  numeroVia: "45",
  numeroFinal: "12 - 30",
  complemento: "Apto 301",
  fechaExpedicion: "2010-03-15",
  lugarNacimiento: "Colombia",
  nacionalidad: "Colombiana",
};

const DEMO_TOMADOR: TomadorData = {
  esTomadorAsegurado: false,
  tipoDocumento: "Cédula de ciudadanía",
  numeroDocumento: "1020304050",
  nombreTomador: "María López",
  fechaExpedicion: "2008-06-20",
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isDocumentoNumeroValido(tipoDocumento: string, numeroDocumento: string) {
  const valor = numeroDocumento.trim();
  if (!valor) return true;
  if (tipoDocumento === "Pasaporte") {
    return /^[A-Za-z0-9]+$/.test(valor);
  }
  if (tipoDocumento === "NIT") {
    return /^[89]\d{8}$/.test(valor);
  }
  return /^\d+$/.test(valor);
}

function hasNumber(value: string) {
  return /\d/.test(value);
}

function exceedsImcLimit(d: InformacionMedicaData) {
  const peso = parseFloat(d.peso);
  const estaturaCm = parseFloat(d.estatura);
  if (isNaN(peso) || isNaN(estaturaCm) || estaturaCm <= 0) return false;
  const imc = peso / Math.pow(estaturaCm / 100, 2);
  return imc > 40;
}

function isMonetaryValue(value: string) {
  const normalized = value.trim().replace(/\./g, "").replace(/,/g, ".");
  return /^\d+(\.\d{1,2})?$/.test(normalized);
}

function isSarlaftPepStepValid(d: SarlaftData) {
  const baseAnswered =
    !!d.esPep &&
    !!d.esPepExtranjera &&
    !!d.esPepOrganizacionInt &&
    !!d.tieneRelacionConyugalPep &&
    !!d.tieneRelacionNegociosPep &&
    !!d.tieneFamiliarPep &&
    !!d.obligacionesFiscalesOtroPais;

  if (!baseAnswered) return false;

  const requiereDatosPep =
    d.tieneRelacionConyugalPep === "si" ||
    d.tieneRelacionNegociosPep === "si" ||
    d.tieneFamiliarPep === "si";

  if (!requiereDatosPep) return true;
  return !!d.pepNombreCompleto.trim() && !!d.pepCargo.trim();
}

function isSarlaftEconomicStepValid(d: SarlaftData) {
  return !!(
    d.cargoLaboral.trim() &&
    d.empresaDondeTrabaja.trim() &&
    d.ingresosMensualesPrincipales.trim() &&
    isMonetaryValue(d.ingresosMensualesPrincipales) &&
    d.gastosMensuales.trim() &&
    isMonetaryValue(d.gastosMensuales) &&
    d.valorOtrosIngresos.trim() &&
    isMonetaryValue(d.valorOtrosIngresos) &&
    d.conceptoOtrosIngresos.trim() &&
    d.valorActivos.trim() &&
    isMonetaryValue(d.valorActivos) &&
    d.valorPasivos.trim() &&
    isMonetaryValue(d.valorPasivos) &&
    d.valorPatrimonio.trim() &&
    isMonetaryValue(d.valorPatrimonio) &&
    d.origenFondosSeguro.trim() &&
    !!d.pagoPrimaMonedaExtranjera &&
    !!d.pagoPrimaCuentaExterior &&
    d.productoServicioEmpresa.trim()
  );
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [filterTerm, setFilterTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  function formatOptionLabel(option: string) {
    if (option === "si") return "Sí";
    if (option === "no") return "No";
    if (option === "no_aplica") return "No aplica";
    return option;
  }

  useEffect(() => {
    setQuery(formatOptionLabel(value));
    setFilterTerm("");
  }, [value]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery(formatOptionLabel(value));
        setFilterTerm("");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [value]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeText(filterTerm);
    if (!normalizedQuery) return options;
    return options.filter((option) => normalizeText(option).includes(normalizedQuery));
  }, [options, filterTerm]);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={query}
        onFocus={() => {
          setIsOpen(true);
          setFilterTerm("");
        }}
        onClick={() => {
          setIsOpen(true);
          setFilterTerm("");
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const nextValue = e.target.value;
          setQuery(nextValue);
          setFilterTerm(nextValue);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className={selectClass}
      />
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev: boolean) => !prev);
          setFilterTerm("");
        }}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-52 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option: string) => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setQuery(formatOptionLabel(option));
                      setFilterTerm("");
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
                  >
                    {formatOptionLabel(option)}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-400">Sin coincidencias</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function DatosAseguradoForm({ data, onChange }: { data: AseguradoData; onChange: (d: AseguradoData) => void }) {
  const [showAddressHelp, setShowAddressHelp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const ciudadNormalizada = normalizeText(data.ciudad);
  const isZonaRestringida = ciudadNormalizada === "monteria";
  const calleCarreraInvalida =
    !!data.numeroVia.trim() && !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s,.-]+$/.test(data.numeroVia.trim());
  const ciudadesDisponibles = CIUDADES_POR_DEPARTAMENTO[data.departamento] ?? CIUDADES_COLOMBIA;
  const nacionalidadesDisponibles = NACIONALIDADES_POR_PAIS[data.lugarNacimiento] ?? NACIONALIDADES;

  const handleDepartamentoChange = (departamento: string) => {
    const ciudades = CIUDADES_POR_DEPARTAMENTO[departamento] ?? CIUDADES_COLOMBIA;
    onChange({
      ...data,
      departamento,
      ciudad: ciudades.includes(data.ciudad) ? data.ciudad : "",
    });
  };

  const handlePaisNacimientoChange = (lugarNacimiento: string) => {
    const nacionalidades = NACIONALIDADES_POR_PAIS[lugarNacimiento] ?? NACIONALIDADES;
    onChange({
      ...data,
      lugarNacimiento,
      nacionalidad: nacionalidades.includes(data.nacionalidad) ? data.nacionalidad : "",
    });
  };

  return (
    <div className="space-y-8 flex-1">
      <div>
        <h2 className={sectionTitleClass}>Ubicación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={labelClass}>Departamento de Residencia<Req /></label>
            <SearchableSelect
              value={data.departamento}
              onChange={handleDepartamentoChange}
              options={DEPARTAMENTOS_COLOMBIA}
              placeholder="Escribe para filtrar y selecciona"
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Ciudad o Municipio de residencia<Req /></label>
            <SearchableSelect
              value={data.ciudad}
              onChange={(value) => onChange({ ...data, ciudad: value })}
              options={ciudadesDisponibles}
              placeholder="Escribe para filtrar y selecciona"
            />
            {isZonaRestringida && (
              <p className="text-xs font-semibold text-red-600 mt-1">
                No es posible continuar con el proceso. La zona seleccionada se encuentra restringida.
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClass}>Dirección</h2>
        <div className="mt-2 mb-4">
          <button
            type="button"
            onClick={() => setShowAddressHelp((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-500 text-[10px] font-bold text-gray-700">?</span>
            ¿Cómo diligencio este campo?
          </button>
          {showAddressHelp && (
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5">
              <p className="text-xs font-bold text-gray-700">Ejemplo de diligenciamiento</p>
              <p className="text-xs text-gray-600 mt-1">Tipo de vía: Transversal</p>
              <p className="text-xs text-gray-600">Número de la vía: 73G Bis</p>
              <p className="text-xs text-gray-600">Nomenclatura: 73C sur - 14</p>
              <p className="text-xs text-gray-600">Complemento: Torre 10 Mz 4 ap 702</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="space-y-1.5 md:col-span-3">
            <label className={labelClass}>Tipo de vía<Req /></label>
            <SearchableSelect
              value={data.tipoVia}
              onChange={(value) => onChange({ ...data, tipoVia: value })}
              options={TIPOS_VIA}
              placeholder="Ej: Transversal"
            />
          </div>
          <div className="space-y-1.5 md:col-span-3">
            <label className={labelClass}>Número de la vía<Req /></label>
            <input
              name="numeroVia"
              value={data.numeroVia}
              onChange={handleChange}
              type="text"
              placeholder="Ej: 73G Bis"
              className={`${inputClass} ${calleCarreraInvalida ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`}
            />
            {calleCarreraInvalida && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
          </div>
          <div className="flex md:col-span-1 justify-center pb-1 md:pb-3">
            <span className="text-lg font-bold text-gray-500">#</span>
          </div>
          <div className="space-y-1.5 md:col-span-3">
            <label className={labelClass}>Nomenclatura<Req /></label>
            <input name="numeroFinal" value={data.numeroFinal} onChange={handleChange} type="text" placeholder="Ej: 73C sur - 14" className={inputClass} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClass}>Complemento</label>
            <input name="complemento" value={data.complemento} onChange={handleChange} type="text" placeholder="Ej: Torre 10 Mz 4 ap 702" className={inputClass} />
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#00008F]">Vista previa de la dirección</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {[data.tipoVia, data.numeroVia, data.numeroFinal, data.complemento].filter(Boolean).join(" ") || "—"}
          </p>
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClass}>Información personal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className={labelClass}>Fecha de expedición del documento<Req /></label>
            <input name="fechaExpedicion" value={data.fechaExpedicion} onChange={handleChange} type="date" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>País de nacimiento<Req /></label>
            <SearchableSelect
              value={data.lugarNacimiento}
              onChange={handlePaisNacimientoChange}
              options={PAISES_NACIMIENTO}
              placeholder="Seleccione país"
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Nacionalidad<Req /></label>
            <SearchableSelect
              value={data.nacionalidad}
              onChange={(value) => onChange({ ...data, nacionalidad: value })}
              options={nacionalidadesDisponibles}
              placeholder="Seleccione nacionalidad"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InformacionMedicaForm({ data, onChange, subStep }: { data: InformacionMedicaData; onChange: (d: InformacionMedicaData) => void; subStep: 0 | 1 }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (enf: string) => {
    if (enf === "Ninguna") {
      if (!data.enfermedades["Ninguna"]) {
        const resetEnfermedades: Record<string, boolean> = { "Ninguna": true };
        onChange({
          ...data,
          enfermedades: resetEnfermedades,
          enfermedadOtra: ""
        });
      } else {
        onChange({
          ...data,
          enfermedades: { ...data.enfermedades, "Ninguna": false }
        });
      }
    } else {
      const updatedEnfermedades = {
        ...data.enfermedades,
        [enf]: !data.enfermedades[enf],
        "Ninguna": false
      };
      onChange({
        ...data,
        enfermedades: updatedEnfermedades,
        ...(enf === "Otra" && data.enfermedades["Otra"] ? { enfermedadOtra: "" } : {})
      });
    }
  };

  const calcularIMC = () => {
    const peso = parseFloat(data.peso);
    const estaturaCm = parseFloat(data.estatura);
    if (!isNaN(peso) && !isNaN(estaturaCm) && estaturaCm > 0) {
      const imc = peso / Math.pow(estaturaCm / 100, 2);
      return imc.toFixed(1);
    }
    return "";
  };
  const imcValue = calcularIMC();
  const isImcNoAsegurable = !!imcValue && parseFloat(imcValue) > 40;

  const isNingunaActive = !!data.enfermedades["Ninguna"];
  const isAnyOtherActive = Object.keys(data.enfermedades).some(
    k => k !== "Ninguna" && data.enfermedades[k]
  );

  const isEnfDisabled = (enf: string) => {
    if (enf === "Ninguna") return isAnyOtherActive;
    return isNingunaActive;
  };

  const shouldShowDetalleAdicional = isAnyOtherActive || data.diagnosticoCancer === "si";

  const handleCancerCheckbox = (value: "si" | "no") => {
    onChange({
      ...data,
      diagnosticoCancer: data.diagnosticoCancer === value ? "" : value,
    });
  };

  return (
    <div className="space-y-8 flex-1">
      {subStep === 0 ? (
        <>
          <div>
            <h2 className={sectionTitleClass}>Información física</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-1.5 lg:col-span-1 md:col-span-2">
                <label className={labelClass}>EPS<Req /></label>
                <SearchableSelect
                  value={data.eps}
                  onChange={(value) => onChange({ ...data, eps: value })}
                  options={EPS_OPTIONS}
                  placeholder="Seleccione EPS"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Peso (kg)<Req /></label>
                <input name="peso" value={data.peso} onChange={handleChange} type="number" placeholder="Ej: 70" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Estatura (cm)<Req /></label>
                <input name="estatura" value={data.estatura} onChange={handleChange} type="number" placeholder="Ej: 175" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>IMC</label>
                <input
                  value={imcValue}
                  readOnly
                  type="text"
                  placeholder="Auto"
                  className={`${inputClass} bg-gray-50 text-gray-500 font-semibold`}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className={sectionTitleClass}>Información médica</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={labelClass}>¿Padeces o has padecido alguna de las siguientes enfermedades?</label>
                <p className="text-xs text-gray-500">Selecciona una o varias opciones.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ENFERMEDADES_LIST.map((enf) => {
                  const disabled = isEnfDisabled(enf);
                  return (
                    <label
                      key={enf}
                      className={`flex items-start gap-3 p-3 border border-gray-100 rounded-lg transition-all ${
                        disabled
                          ? "opacity-50 cursor-not-allowed bg-gray-50/50"
                          : "cursor-pointer hover:bg-gray-50"
                      }`}
                      onClick={(e) => {
                        if (disabled) {
                          e.preventDefault();
                          return;
                        }
                      }}
                    >
                      <div className="mt-0.5">
                        <div
                          onClick={() => {
                            if (!disabled) handleCheckbox(enf);
                          }}
                          className={`w-5 h-5 rounded flex items-center justify-center transition-all border ${
                            disabled
                              ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                              : data.enfermedades[enf]
                                ? "bg-[#00008F] border-[#00008F] cursor-pointer"
                                : "bg-white border-gray-300 cursor-pointer"
                          }`}
                        >
                          {data.enfermedades[enf] && <Check className="w-3 h-3 text-white" strokeWidth={2.4} />}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{enf}</span>
                    </label>
                  );
                })}
              </div>

              {data.enfermedades["Otra"] && (
                <div className="mt-4 space-y-1.5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className={labelClass}>¿Cuál?<Req /></label>
                  <input name="enfermedadOtra" value={data.enfermedadOtra} onChange={handleChange} type="text" placeholder="Especifique la enfermedad" className={inputClass} />
                </div>
              )}

              <div className="space-y-5 pt-8">
                <label className={labelClass}>
                  ¿Has sido diagnosticado(a) con cáncer o recibido tratamiento relacionado con esta enfermedad en los últimos cuatro (4) años previos a la firma de esta solicitud? De acuerdo a lo dispuesto por la ley 2475 de 2025 (Olvido oncológico)<Req />
                </label>
                <div className="flex flex-wrap gap-4">
                  {[{ label: "Sí", value: "si" as const }, { label: "No", value: "no" as const }].map(opt => (
                    <label
                      key={opt.value}
                      onClick={() => handleCancerCheckbox(opt.value)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer select-none hover:bg-gray-50 transition-all"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                          data.diagnosticoCancer === opt.value
                            ? "bg-[#00008F] border border-[#00008F]"
                            : "bg-white border border-gray-300"
                        }`}
                      >
                        {data.diagnosticoCancer === opt.value && <Check className="w-3 h-3 text-white" strokeWidth={2.4} />}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {shouldShowDetalleAdicional && (
                <div className="mt-4 space-y-1.5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className={labelClass}>
                    Si seleccionaste alguna opción o respondiste "Sí", por favor amplía la información (diagnóstico, fecha del diagnóstico, tratamiento actual y médico tratante).<Req />
                  </label>
                  <textarea
                    name="detalleMedicoAdicional"
                    value={data.detalleMedicoAdicional}
                    onChange={handleChange}
                    placeholder="Ingresa el detalle médico"
                    rows={4}
                    className={inputClass + " resize-none"}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2 className={sectionTitleClass}>Información médica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className={labelClass}>¿Te han realizado alguna cirugía?<Req /></label>
              <SearchableSelect
                value={data.cirugiaRealizada}
                onChange={(value) => onChange({ ...data, cirugiaRealizada: value as "" | "si" | "no" })}
                options={["si", "no"]}
                placeholder="Seleccione una opción"
              />
            </div>
            {data.cirugiaRealizada === "si" && (
              <>
                <div className="space-y-1.5">
                  <LabelWithTooltip
                    label="Fecha"
                    tooltip="Ingresa la fecha de la última cirugía que te realizaron"
                  />
                  <input name="fechaUltimaCirugia" value={data.fechaUltimaCirugia} onChange={handleChange} type="date" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>¿Cuál?<Req /></label>
                  <input name="tipoCirugiaRealizada" value={data.tipoCirugiaRealizada} onChange={handleChange} type="text" placeholder="Describe la cirugía" className={inputClass} />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className={labelClass}>¿Tienes alguna cirugía pendiente?<Req /></label>
              <SearchableSelect
                value={data.cirugiaPendiente}
                onChange={(value) => onChange({ ...data, cirugiaPendiente: value as "" | "si" | "no" })}
                options={["si", "no"]}
                placeholder="Seleccione una opción"
              />
            </div>
            {data.cirugiaPendiente === "si" && (
              <>
                <div className="space-y-1.5">
                  <LabelWithTooltip
                    label="Fecha"
                    tooltip="Si tienes programada más de una cirugía, ingresa la fecha de la cirugía más cercana."
                  />
                  <input name="fechaCirugiaPendiente" value={data.fechaCirugiaPendiente} onChange={handleChange} type="date" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>¿Cuál?<Req /></label>
                  <input name="tipoCirugiaPendiente" value={data.tipoCirugiaPendiente} onChange={handleChange} type="text" placeholder="Describe la cirugía pendiente" className={inputClass} />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className={labelClass}>¿Actualmente tomas medicamentos para controlar alguna enfermedad?<Req /></label>
              <SearchableSelect
                value={data.tomaMedicamentos}
                onChange={(value) => onChange({ ...data, tomaMedicamentos: value as "" | "si" | "no" })}
                options={["si", "no"]}
                placeholder="Seleccione una opción"
              />
            </div>
            {data.tomaMedicamentos === "si" && (
              <>
                <div className="space-y-1.5">
                  <label className={labelClass}>¿Cuál?<Req /></label>
                  <input name="medicamentoCual" value={data.medicamentoCual} onChange={handleChange} type="text" placeholder="Nombre del medicamento" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>¿Por qué tomas el medicamento?<Req /></label>
                  <input name="medicamentoMotivo" value={data.medicamentoMotivo} onChange={handleChange} type="text" placeholder="Motivo" className={inputClass} />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className={labelClass}>¿Actualmente estás embarazada?<Req /></label>
              <SearchableSelect
                value={data.embarazada}
                onChange={(value) => onChange({ ...data, embarazada: value as "" | "si" | "no" | "no_aplica" })}
                options={["si", "no", "no_aplica"]}
                placeholder="Seleccione una opción"
              />
            </div>
            {data.embarazada === "si" && (
              <div className="space-y-1.5">
                <label className={labelClass}>Meses de gestación<Req /></label>
                <input name="mesesGestacion" value={data.mesesGestacion} onChange={handleChange} type="number" min="1" max="10" placeholder="Ej: 3" className={inputClass} />
              </div>
            )}

            <div className="space-y-1.5">
              <label className={labelClass}>¿Presentas alguna limitación física o discapacidad?<Req /></label>
              <SearchableSelect
                value={data.limitacionFisica}
                onChange={(value) => onChange({ ...data, limitacionFisica: value as "" | "si" | "no" })}
                options={["si", "no"]}
                placeholder="Seleccione una opción"
              />
            </div>
            {data.limitacionFisica === "si" && (
              <div className="space-y-1.5">
                <label className={labelClass}>¿Cuál?<Req /></label>
                <input name="limitacionDetalle" value={data.limitacionDetalle} onChange={handleChange} type="text" placeholder="Describe la limitación o discapacidad" className={inputClass} />
              </div>
            )}

            <div className="space-y-1.5">
              <label className={labelClass}>¿Con qué frecuencia consumes alcohol?<Req /></label>
              <SearchableSelect
                value={data.frecuenciaAlcohol}
                onChange={(value) => onChange({ ...data, frecuenciaAlcohol: value })}
                options={["Nunca", "Ocasionalmente", "1 a 2 veces por semana", "3 a 4 veces por semana", "Diario"]}
                placeholder="Seleccione una opción"
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>¿Eres fumador?<Req /></label>
              <SearchableSelect
                value={data.fumador}
                onChange={(value) => onChange({ ...data, fumador: value as "" | "si" | "no" })}
                options={["si", "no"]}
                placeholder="Seleccione una opción"
              />
            </div>
            {data.fumador === "si" && (
              <div className="space-y-1.5">
                <label className={labelClass}>Cantidad diaria de cigarrillos<Req /></label>
                <input name="cigarrillosDiarios" value={data.cigarrillosDiarios} onChange={handleChange} type="number" min="1" placeholder="Ej: 5" className={inputClass} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DatosTomadorForm({ data, onChange, aseguradoData }: { data: TomadorData; onChange: (d: TomadorData) => void; aseguradoData: AseguradoData }) {
  const numeroDocumentoInvalido = !isDocumentoNumeroValido(data.tipoDocumento, data.numeroDocumento);
  const nombreTomadorInvalido = !!data.nombreTomador.trim() && hasNumber(data.nombreTomador);

  const handleEsAsegurado = (value: boolean) => {
    const emptyTomador = {
      tipoDocumento: "",
      numeroDocumento: "",
      nombreTomador: "",
      fechaExpedicion: "",
    };

    const prefilledTomador = {
      tipoDocumento: DEMO_TOMADOR.tipoDocumento,
      numeroDocumento: DEMO_TOMADOR.numeroDocumento,
      nombreTomador: DEMO_TOMADOR.nombreTomador,
      fechaExpedicion: DEMO_TOMADOR.fechaExpedicion || aseguradoData.fechaExpedicion,
    };

    onChange({
      ...data,
      esTomadorAsegurado: value,
      ...(value ? prefilledTomador : emptyTomador),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "tipoDocumento") {
      const isNit = value === "NIT";
      onChange({
        ...data,
        tipoDocumento: value,
        numeroDocumento: isNit ? data.numeroDocumento.replace(/\D/g, "").slice(0, 9) : data.numeroDocumento,
        fechaExpedicion: isNit ? "" : data.fechaExpedicion,
      });
      return;
    }
    if (name === "numeroDocumento") {
      if (data.tipoDocumento === "NIT") {
        const digits = value.replace(/\D/g, "").slice(0, 9);
        onChange({
          ...data,
          numeroDocumento: digits,
          fechaExpedicion: "",
        });
        return;
      }
      onChange({
        ...data,
        numeroDocumento: value,
      });
      return;
    }
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-8 flex-1">
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
        <p className="text-sm font-bold text-gray-700 mb-4">
          ¿El tomador es el mismo asegurado? <Req />
        </p>
        <div className="flex gap-6">
          {[{ label: "Sí", value: true }, { label: "No", value: false }].map(opt => (
            <label
              key={opt.label}
              onClick={() => handleEsAsegurado(opt.value)}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  data.esTomadorAsegurado === opt.value
                    ? "bg-[#00008F] border-[#00008F]"
                    : "bg-white border-gray-300 group-hover:border-[#00008F]"
                }`}
              >
                {data.esTomadorAsegurado === opt.value && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm font-semibold text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {data.esTomadorAsegurado === false && (
        <div>
          <h2 className={sectionTitleClass}>Datos del tomador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className={labelClass}>Tipo de documento<Req /></label>
              <SearchableSelect
                value={data.tipoDocumento}
                onChange={(value) => {
                  const isNit = value === "NIT";
                  onChange({
                    ...data,
                    tipoDocumento: value,
                    numeroDocumento: isNit ? data.numeroDocumento.replace(/\D/g, "").slice(0, 9) : data.numeroDocumento,
                    fechaExpedicion: isNit ? "" : data.fechaExpedicion,
                  });
                }}
                options={TIPOS_DOCUMENTO.filter(d => d !== "Tarjeta de identidad")}
                placeholder="Seleccione tipo"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Número de documento<Req /></label>
              <input
                name="numeroDocumento"
                value={data.numeroDocumento}
                onChange={handleChange}
                type="text"
                placeholder={data.tipoDocumento === "NIT" ? "Ej: 900123456" : data.tipoDocumento === "Pasaporte" ? "Ej: AB12345" : "Ej: 1234567890"}
                className={`${inputClass} ${numeroDocumentoInvalido ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`}
              />
              {numeroDocumentoInvalido && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Nombre Completo o Razón Social<Req /></label>
              <input
                name="nombreTomador"
                value={data.nombreTomador}
                onChange={handleChange}
                type="text"
                placeholder="Nombre completo"
                className={`${inputClass} ${nombreTomadorInvalido ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`}
              />
              {nombreTomadorInvalido && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
            </div>
            {data.tipoDocumento !== "NIT" && (
              <div className="space-y-1.5">
                <label className={labelClass}>Fecha de expedición del documento<Req /></label>
                <input name="fechaExpedicion" value={data.fechaExpedicion} onChange={handleChange} type="date" className={inputClass} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DatosBeneficiarioForm({ data, onChange }: { data: BeneficiarioData[]; onChange: (d: BeneficiarioData[]) => void }) {
  const [blurredDocs, setBlurredDocs] = useState<Record<number, boolean>>({});
  const totalPct = data.reduce((sum, b) => sum + (parseFloat(b.porcentajeBeneficio) || 0), 0);

  const handleChange = (id: number, field: keyof BeneficiarioData, value: string) => {
    onChange(data.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handlePorcentajeChange = (id: number, value: string) => {
    const onlyDigits = value.replace(/\D/g, "");
    if (!onlyDigits) {
      handleChange(id, "porcentajeBeneficio", "");
      return;
    }
    const normalized = Math.min(100, parseInt(onlyDigits, 10));
    handleChange(id, "porcentajeBeneficio", String(normalized));
  };

  const addBeneficiario = () => {
    if (data.length >= 5) return;
    const remaining = Math.max(0, 100 - totalPct);
    onChange([...data, {
      id: Date.now(),
      tipoDocumento: "",
      numeroDocumento: "",
      nombreBeneficiario: "",
      porcentajeBeneficio: remaining > 0 ? String(remaining) : "",
      parentesco: "",
      parentescoOtro: "",
    }]);
  };

  const removeBeneficiario = (id: number) => {
    if (data.length <= 1) return;
    onChange(data.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6 flex-1">
      <div className="flex items-center justify-between">
        <div />
        {data.length < 5 && (
          <button type="button" onClick={addBeneficiario} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#00008F] border-2 border-[#00008F] rounded-full hover:bg-blue-50 transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" /> Agregar beneficiario
          </button>
        )}
      </div>

      <div className="space-y-5">
        {data.map((b, idx) => (
          <div key={b.id} className="border border-gray-200 rounded-xl overflow-visible">
            <div className={`px-5 py-3 flex items-center justify-between ${idx === 0 ? "bg-[#00008F]/5 border-b border-[#00008F]/10" : "bg-gray-50 border-b border-gray-100"}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700">Beneficiario</span>
              </div>
              {idx > 0 && (
                <button type="button" onClick={() => removeBeneficiario(b.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Tipo de documento<Req /></label>
                <SearchableSelect
                  value={b.tipoDocumento}
                  onChange={(value) => {
                    setBlurredDocs(prev => ({ ...prev, [b.id]: false }));
                    handleChange(b.id, "tipoDocumento", value);
                  }}
                  options={TIPOS_DOCUMENTO_BENEFICIARIO}
                  placeholder="Seleccione tipo"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Número de documento<Req /></label>
                <input
                  value={b.numeroDocumento}
                  onBlur={() => setBlurredDocs(prev => ({ ...prev, [b.id]: true }))}
                  onChange={e => {
                    let val = e.target.value;
                    if (b.tipoDocumento === "NIT") {
                      val = val.replace(/\D/g, "").slice(0, 9);
                    }
                    handleChange(b.id, "numeroDocumento", val);
                  }}
                  type="text"
                  placeholder={b.tipoDocumento === "Pasaporte" ? "Ej: AB12345" : b.tipoDocumento === "NIT" ? "Ej: 900123456" : "Ej: 1234567890"}
                  className={`${inputClass} ${blurredDocs[b.id] && !isDocumentoNumeroValido(b.tipoDocumento, b.numeroDocumento) ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`}
                />
                {blurredDocs[b.id] && !isDocumentoNumeroValido(b.tipoDocumento, b.numeroDocumento) && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Nombre Completo o Razón Social del Beneficiario<Req /></label>
                <input
                  value={b.nombreBeneficiario}
                  onChange={e => handleChange(b.id, "nombreBeneficiario", e.target.value)}
                  type="text"
                  placeholder="Nombre completo"
                  className={`${inputClass} ${!!b.nombreBeneficiario.trim() && hasNumber(b.nombreBeneficiario) ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500 focus:border-red-500" : ""}`}
                />
                {!!b.nombreBeneficiario.trim() && hasNumber(b.nombreBeneficiario) && <p className="text-xs font-semibold text-red-600 mt-1">{FORMATO_ERROR}</p>}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>% Beneficio asegurabilidad<Req /></label>
                <div className="relative flex items-center">
                  <input
                    value={b.porcentajeBeneficio}
                    onChange={e => handlePorcentajeChange(b.id, e.target.value)}
                    type="text"
                    inputMode="numeric"
                    placeholder="Ej: 100"
                    className={`${inputClass} pr-8`}
                  />
                  <span className="absolute right-3 text-sm font-bold text-gray-500 pointer-events-none">%</span>
                </div>
              </div>
              <div className="space-y-1.5 relative z-10">
                <label className={labelClass}>Parentesco<Req /></label>
                <SearchableSelect
                  value={b.parentesco}
                  onChange={(value) =>
                    onChange(
                      data.map((item) =>
                        item.id === b.id
                          ? { ...item, parentesco: value, parentescoOtro: value === "Otro" ? item.parentescoOtro ?? "" : "" }
                          : item
                      )
                    )
                  }
                  options={PARENTESCOS}
                  placeholder="Seleccione parentesco"
                />
              </div>
              {b.parentesco === "Otro" && (
                <div className="space-y-1.5">
                  <label className={labelClass}>¿Cuál?<Req /></label>
                  <input
                    value={b.parentescoOtro || ""}
                    onChange={e => handleChange(b.id, "parentescoOtro", e.target.value)}
                    type="text"
                    placeholder="Especifica el parentesco"
                    className={inputClass}
                  />
                </div>
              )}
            </div>
            
            {/* Advanced beneficiarios section has been moved to SARLAFT step */}
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
        La suma de los porcentajes del beneficio de asegurabilidad debe ser exactamente 100%.
      </p>
    </div>
  );
}

function StepContent({ step, medicalSubStep, sarlaftSubStep, aseguradoData, onAseguradoChange, infoMedicaData, onInfoMedicaChange, tomadorData, onTomadorChange, beneficiariosData, onBeneficiariosChange, sarlaftData, onSarlaftChange }: {
  step: number;
  medicalSubStep: 0 | 1;
  sarlaftSubStep: 0 | 1 | 2;
  aseguradoData: AseguradoData;
  onAseguradoChange: (d: AseguradoData) => void;
  infoMedicaData: InformacionMedicaData;
  onInfoMedicaChange: (d: InformacionMedicaData) => void;
  tomadorData: TomadorData;
  onTomadorChange: (d: TomadorData) => void;
  beneficiariosData: BeneficiarioData[];
  onBeneficiariosChange: (d: BeneficiarioData[]) => void;
  sarlaftData: SarlaftData;
  onSarlaftChange: (d: SarlaftData) => void;
}) {
  if (step === 0) return <DatosAseguradoForm data={aseguradoData} onChange={onAseguradoChange} />;
  if (step === 1) return <InformacionMedicaForm data={infoMedicaData} onChange={onInfoMedicaChange} subStep={medicalSubStep} />;
  if (step === 2) return <DatosTomadorForm data={tomadorData} onChange={onTomadorChange} aseguradoData={aseguradoData} />;
  if (step === 3) return <DatosBeneficiarioForm data={beneficiariosData} onChange={onBeneficiariosChange} />;
  if (step === 4) return (
    <FormatoConocimientoClienteForm 
      data={sarlaftData} 
      onChange={onSarlaftChange} 
      subStep={sarlaftSubStep} 
      beneficiariosData={beneficiariosData}
      onBeneficiariosChange={onBeneficiariosChange}
    />
  );
  return null;
}

function isAseguradoValid(d: AseguradoData) {
  const ciudadRestringida = normalizeText(d.ciudad) === "monteria";
  return !!(d.departamento && d.ciudad && d.tipoVia && d.numeroVia && d.numeroFinal && d.fechaExpedicion && d.lugarNacimiento && d.nacionalidad && !ciudadRestringida);
}

function isInformacionMedicaPaso1Valid(d: InformacionMedicaData) {
  if (!d.eps || !d.peso || !d.estatura) return false;
  if (d.enfermedades["Otra"] && !d.enfermedadOtra) return false;
  const anyOtherDiseaseSelected = Object.keys(d.enfermedades).some(
    k => k !== "Ninguna" && d.enfermedades[k]
  );
  if ((anyOtherDiseaseSelected || d.diagnosticoCancer === "si") && !d.detalleMedicoAdicional.trim()) return false;
  if (!d.diagnosticoCancer) return false;
  return true;
}

function isInformacionMedicaPaso2Valid(d: InformacionMedicaData) {
  if (!d.cirugiaRealizada || !d.cirugiaPendiente || !d.tomaMedicamentos || !d.embarazada || !d.limitacionFisica || !d.frecuenciaAlcohol || !d.fumador) return false;
  if (d.cirugiaRealizada === "si" && (!d.fechaUltimaCirugia || !d.tipoCirugiaRealizada.trim())) return false;
  if (d.cirugiaPendiente === "si" && (!d.fechaCirugiaPendiente || !d.tipoCirugiaPendiente.trim())) return false;
  if (d.tomaMedicamentos === "si" && (!d.medicamentoCual.trim() || !d.medicamentoMotivo.trim())) return false;
  if (d.embarazada === "si" && !d.mesesGestacion) return false;
  if (d.limitacionFisica === "si" && !d.limitacionDetalle.trim()) return false;
  if (d.fumador === "si" && !d.cigarrillosDiarios) return false;
  return true;
}

function isTomadorValid(d: TomadorData) {
  if (d.esTomadorAsegurado === null) return false;
  if (d.esTomadorAsegurado === true) return true;
  if (!isDocumentoNumeroValido(d.tipoDocumento, d.numeroDocumento)) return false;
  if (hasNumber(d.nombreTomador)) return false;
  if (d.tipoDocumento === "NIT") {
    return !!(d.tipoDocumento && d.numeroDocumento && d.nombreTomador);
  }
  return !!(d.tipoDocumento && d.numeroDocumento && d.nombreTomador && d.fechaExpedicion);
}

const TIPOS_DOCUMENTO_REPRESENTANTE = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte", "Permiso por Protección Temporal"];

function isDateNotFuture(dateStr: string) {
  if (!dateStr) return false;
  const selectedDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate <= today;
}

function isValidRepresentanteName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return false;
  return /^[A-Za-zÁéíóúáéíóúÑñüÜ\s.]+$/.test(trimmed);
}

function isBeneficiariosValid(list: BeneficiarioData[]) {
  const total = list.reduce((s, b) => s + (parseFloat(b.porcentajeBeneficio) || 0), 0);
  if (total !== 100) return false;
  return list.every(b => {
    return !!(
      b.tipoDocumento && 
      b.numeroDocumento && 
      isDocumentoNumeroValido(b.tipoDocumento, b.numeroDocumento) && 
      b.nombreBeneficiario && 
      !hasNumber(b.nombreBeneficiario) && 
      b.porcentajeBeneficio && 
      b.parentesco &&
      (b.parentesco !== "Otro" || !!b.parentescoOtro?.trim())
    );
  });
}

function isSarlaftBeneficiariosStepValid(list: BeneficiarioData[]) {
  return list.every(b => {
    if (b.tipoDocumento !== "NIT") {
      return !!(b.esPep && b.esBeneficiarioOtraPoliza && b.fechaExpedicion && isDateNotFuture(b.fechaExpedicion));
    } else {
      return !!(b.esBeneficiarioOtraPoliza && b.nombreRepresentanteLegal && isValidRepresentanteName(b.nombreRepresentanteLegal) && b.tipoDocumentoRepresentanteLegal && b.numeroDocumentoRepresentanteLegal);
    }
  });
}

const DEFAULT_BENEFICIARIO: BeneficiarioData = {
  id: 1,
  tipoDocumento: "",
  numeroDocumento: "",
  nombreBeneficiario: "",
  porcentajeBeneficio: "100",
  parentesco: "",
  parentescoOtro: "",
  esPep: "",
  esBeneficiarioOtraPoliza: "",
  fechaExpedicion: "",
  nombreRepresentanteLegal: "",
  tipoDocumentoRepresentanteLegal: "",
  numeroDocumentoRepresentanteLegal: "",
};

export default function CompletarDatosView({ oportunidad, onBack, onGoToOportunidadInicio, onComplete }: CompletarDatosViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [medicalSubStep, setMedicalSubStep] = useState<0 | 1>(0);
  const [sarlaftSubStep, setSarlaftSubStep] = useState<0 | 1 | 2>(0);
  const [showImcModal, setShowImcModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isMariaGomezFlow = normalizeText(String(oportunidad?.name || "")).includes("maria gomez");
  const flowSteps = isMariaGomezFlow ? [...steps, SARLAFT_STEP_TITLE] : steps;
  const flowSidebarSteps = isMariaGomezFlow
    ? ["Datos del asegurado", "Datos tomador", "Datos beneficiarios", "Formato Conocimiento del Cliente"]
    : ["Datos del asegurado", "Datos tomador", "Datos beneficiarios"];
  const sidebarCounters = isMariaGomezFlow ? ["1", "2", "3", "4"] : ["1", "2", "3"];
  const sidebarCurrentStep =
    currentStep <= 1
      ? 0
      : currentStep === 2
        ? 1
        : currentStep === 3
          ? 2
          : 3;
  const [aseguradoData, setAseguradoData] = useState<AseguradoData>({
    departamento: "", ciudad: "", tipoVia: "", numeroVia: "",
    numeroFinal: "", complemento: "", fechaExpedicion: "", lugarNacimiento: "",
    nacionalidad: "",
  });
  const [infoMedicaData, setInfoMedicaData] = useState<InformacionMedicaData>({
    eps: "", peso: "", estatura: "", enfermedades: {}, enfermedadOtra: "", diagnosticoCancer: "", detalleMedicoAdicional: "",
    cirugiaRealizada: "", fechaUltimaCirugia: "", tipoCirugiaRealizada: "",
    cirugiaPendiente: "", fechaCirugiaPendiente: "", tipoCirugiaPendiente: "",
    tomaMedicamentos: "", medicamentoCual: "", medicamentoMotivo: "",
    embarazada: "", mesesGestacion: "", limitacionFisica: "", limitacionDetalle: "",
    frecuenciaAlcohol: "", fumador: "", cigarrillosDiarios: "",
  });
  const [tomadorData, setTomadorData] = useState<TomadorData>({
    esTomadorAsegurado: null, tipoDocumento: "", numeroDocumento: "", nombreTomador: "", fechaExpedicion: "",
  });
  const [beneficiariosData, setBeneficiariosData] = useState<BeneficiarioData[]>(() => {
    const isGomez = normalizeText(String(oportunidad?.name || "")).includes("maria gomez");
    if (isGomez) {
      return [
        {
          id: 1,
          tipoDocumento: "Cédula de ciudadanía",
          numeroDocumento: "1020304050",
          nombreBeneficiario: "Juan Pérez Natural",
          porcentajeBeneficio: "50",
          parentesco: "Hijo(a)",
          parentescoOtro: "",
          esPep: "no",
          esBeneficiarioOtraPoliza: "no",
          fechaExpedicion: "2015-08-20",
          nombreRepresentanteLegal: "",
          tipoDocumentoRepresentanteLegal: "",
          numeroDocumentoRepresentanteLegal: "",
        },
        {
          id: 2,
          tipoDocumento: "NIT",
          numeroDocumento: "900123456",
          nombreBeneficiario: "Inversiones Latinoamericanas S.A.S.",
          porcentajeBeneficio: "50",
          parentesco: "Otro",
          parentescoOtro: "Empresa",
          esPep: "",
          esBeneficiarioOtraPoliza: "no",
          fechaExpedicion: "",
          nombreRepresentanteLegal: "Carlos Gomez. Representante",
          tipoDocumentoRepresentanteLegal: "Cédula de ciudadanía",
          numeroDocumentoRepresentanteLegal: "80123456",
        }
      ];
    }
    return [{
      id: Date.now(),
      tipoDocumento: "",
      numeroDocumento: "",
      nombreBeneficiario: "",
      porcentajeBeneficio: "100",
      parentesco: "",
      parentescoOtro: "",
      esPep: "",
      esBeneficiarioOtraPoliza: "",
      fechaExpedicion: "",
      nombreRepresentanteLegal: "",
      tipoDocumentoRepresentanteLegal: "",
      numeroDocumentoRepresentanteLegal: "",
    }];
  });
  const [sarlaftData, setSarlaftData] = useState<SarlaftData>({
    esPep: "",
    esPepExtranjera: "",
    esPepOrganizacionInt: "",
    tieneRelacionConyugalPep: "",
    tieneRelacionNegociosPep: "",
    tieneFamiliarPep: "",
    pepNombreCompleto: "",
    pepCargo: "",
    obligacionesFiscalesOtroPais: "",
    cargoLaboral: "",
    empresaDondeTrabaja: "",
    ingresosMensualesPrincipales: "",
    gastosMensuales: "",
    valorOtrosIngresos: "",
    conceptoOtrosIngresos: "",
    valorActivos: "",
    valorPasivos: "",
    valorPatrimonio: "",
    origenFondosSeguro: "",
    pagoPrimaMonedaExtranjera: "",
    pagoPrimaCuentaExterior: "",
    productoServicioEmpresa: "",
  });

  const autoFill = () => {
    const getRandomItem = <T,>(arr: readonly T[] | T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomBool = () => Math.random() > 0.5;

    if (currentStep === 0) {
      const departamento = getRandomItem(DEPARTAMENTOS_COLOMBIA);
      const ciudadesPorDepartamento = CIUDADES_POR_DEPARTAMENTO[departamento] ?? CIUDADES_COLOMBIA;
      const ciudadesValidas = ciudadesPorDepartamento.filter(c => normalizeText(c) !== "monteria");
      const paisNacimiento = getRandomItem(PAISES_NACIMIENTO);
      const nacionalidadesPorPais = NACIONALIDADES_POR_PAIS[paisNacimiento] ?? NACIONALIDADES;
      setAseguradoData({
        departamento,
        ciudad: getRandomItem(ciudadesValidas),
        tipoVia: getRandomItem(TIPOS_VIA),
        numeroVia: String(getRandomNumber(1, 150)),
        numeroFinal: `${getRandomNumber(1, 150)} - ${getRandomNumber(1, 99)}`,
        complemento: `Apto ${getRandomNumber(100, 900)}`,
        fechaExpedicion: `20${getRandomNumber(10, 23)}-0${getRandomNumber(1, 9)}-1${getRandomNumber(0, 9)}`,
        lugarNacimiento: paisNacimiento,
        nacionalidad: getRandomItem(nacionalidadesPorPais),
      });
    }
    if (currentStep === 1) {
      const cirugiaRealizada = getRandomBool() ? "si" : "no";
      const cirugiaPendiente = getRandomBool() ? "si" : "no";
      const tomaMedicamentos = getRandomBool() ? "si" : "no";
      const embarazada = getRandomItem(["no", "no_aplica"] as const);
      const limitacionFisica = getRandomBool() ? "si" : "no";
      const fumador = getRandomBool() ? "si" : "no";

      setInfoMedicaData({
        eps: getRandomItem(EPS_OPTIONS),
        peso: String(getRandomNumber(60, 85)),
        estatura: String(getRandomNumber(160, 190)),
        enfermedades: { "Ninguna": true },
        enfermedadOtra: "",
        diagnosticoCancer: "no",
        detalleMedicoAdicional: "",
        cirugiaRealizada,
        fechaUltimaCirugia: cirugiaRealizada === "si" ? `202${getRandomNumber(0, 3)}-0${getRandomNumber(1, 9)}-1${getRandomNumber(0, 9)}` : "",
        tipoCirugiaRealizada: cirugiaRealizada === "si" ? getRandomItem(["Apendicectomía", "Colecistectomía", "Hernioplastia"]) : "",
        cirugiaPendiente,
        fechaCirugiaPendiente: cirugiaPendiente === "si" ? `202${getRandomNumber(4, 5)}-0${getRandomNumber(1, 9)}-1${getRandomNumber(0, 9)}` : "",
        tipoCirugiaPendiente: cirugiaPendiente === "si" ? getRandomItem(["Retiro de material", "Corrección tabique", "Cirugía refractiva"]) : "",
        tomaMedicamentos,
        medicamentoCual: tomaMedicamentos === "si" ? getRandomItem(["Ibuprofeno", "Losartán", "Omeprazol"]) : "",
        medicamentoMotivo: tomaMedicamentos === "si" ? getRandomItem(["Hipertensión", "Dolor crónico", "Gastritis"]) : "",
        embarazada,
        mesesGestacion: "",
        limitacionFisica,
        limitacionDetalle: limitacionFisica === "si" ? "Miopía leve" : "",
        frecuenciaAlcohol: getRandomItem(["Nunca", "Ocasionalmente", "1 a 2 veces por semana"]),
        fumador,
        cigarrillosDiarios: fumador === "si" ? String(getRandomNumber(1, 5)) : "",
      });
    }
    if (currentStep === 2) {
      const esTomadorAsegurado = getRandomBool();
      setTomadorData({
        esTomadorAsegurado,
        tipoDocumento: esTomadorAsegurado ? "" : getRandomItem(TIPOS_DOCUMENTO.filter(d => d !== "NIT" && d !== "Tarjeta de identidad")),
        numeroDocumento: esTomadorAsegurado ? "" : String(getRandomNumber(10000000, 9999999999)),
        nombreTomador: esTomadorAsegurado ? "" : getRandomItem(["María López", "Carlos Pérez", "Ana Gómez", "Luis Rodríguez"]),
        fechaExpedicion: esTomadorAsegurado ? "" : `20${getRandomNumber(10, 23)}-0${getRandomNumber(1, 9)}-1${getRandomNumber(0, 9)}`,
      });
    }
    if (currentStep === 3) {
      if (isMariaGomezFlow) {
        setBeneficiariosData([
          {
            id: Date.now() + 1,
            tipoDocumento: "Cédula de ciudadanía",
            numeroDocumento: "1020304050",
            nombreBeneficiario: "Juan Pérez Natural",
            porcentajeBeneficio: "50",
            parentesco: "Hijo(a)",
            parentescoOtro: "",
            esPep: "no",
            esBeneficiarioOtraPoliza: "no",
            fechaExpedicion: "2015-08-20",
            nombreRepresentanteLegal: "",
            tipoDocumentoRepresentanteLegal: "",
            numeroDocumentoRepresentanteLegal: "",
          },
          {
            id: Date.now() + 2,
            tipoDocumento: "NIT",
            numeroDocumento: "900123456",
            nombreBeneficiario: "Inversiones Latinoamericanas S.A.S.",
            porcentajeBeneficio: "50",
            parentesco: "Otro",
            parentescoOtro: "Empresa",
            esPep: "",
            esBeneficiarioOtraPoliza: "no",
            fechaExpedicion: "",
            nombreRepresentanteLegal: "Carlos Gomez. Representante",
            tipoDocumentoRepresentanteLegal: "Cédula de ciudadanía",
            numeroDocumentoRepresentanteLegal: "80123456",
          }
        ]);
      } else {
        const numBeneficiarios = getRandomNumber(1, 3);
        const parts = Array.from({ length: numBeneficiarios }).map(() => Math.random());
        const sum = parts.reduce((a, b) => a + b, 0);
        const percentages = parts.map(p => Math.round((p / sum) * 100));
        const diff = 100 - percentages.reduce((a, b) => a + b, 0);
        percentages[0] += diff; // Ajustar el primero para que sume exactamente 100%

        const nombres = ["Carlos", "Ana", "Luis", "Marta", "Pedro"];
        const apellidos = ["Gómez", "Pérez", "López", "Díaz", "Martínez"];

        const nuevosBeneficiarios = percentages.map((pct, idx) => ({
          id: Date.now() + idx,
          tipoDocumento: getRandomItem(TIPOS_DOCUMENTO_BENEFICIARIO.filter(d => d !== "NIT")),
          numeroDocumento: String(getRandomNumber(10000000, 9999999999)),
          nombreBeneficiario: `${getRandomItem(nombres)} ${getRandomItem(apellidos)}`,
          porcentajeBeneficio: String(pct),
          parentesco: "Hijo(a)",
          parentescoOtro: "",
          esPep: "no",
          esBeneficiarioOtraPoliza: "no",
          fechaExpedicion: "2015-08-20",
          nombreRepresentanteLegal: "",
          tipoDocumentoRepresentanteLegal: "",
          numeroDocumentoRepresentanteLegal: "",
        }));
        setBeneficiariosData(nuevosBeneficiarios);
      }
    }
    if (currentStep === 4) {
      setSarlaftData({
        esPep: "no",
        esPepExtranjera: "no",
        esPepOrganizacionInt: "no",
        tieneRelacionConyugalPep: "no",
        tieneRelacionNegociosPep: "no",
        tieneFamiliarPep: "no",
        pepNombreCompleto: "",
        pepCargo: "",
        obligacionesFiscalesOtroPais: "no",
        cargoLaboral: getRandomItem(["Ingeniero", "Médico", "Abogado", "Arquitecto", "Docente"]),
        empresaDondeTrabaja: getRandomItem(["Tech Corp", "Salud Global", "Constructora ABC", "Colegio Nacional"]),
        ingresosMensualesPrincipales: String(getRandomNumber(3, 10) * 1000000),
        gastosMensuales: String(getRandomNumber(1, 3) * 1000000),
        valorOtrosIngresos: String(getRandomNumber(1, 5) * 500000),
        conceptoOtrosIngresos: getRandomItem(["Arriendos", "Rendimientos financieros", "Honorarios"]),
        valorActivos: String(getRandomNumber(50, 200) * 1000000),
        valorPasivos: String(getRandomNumber(10, 50) * 1000000),
        valorPatrimonio: String(getRandomNumber(40, 150) * 1000000),
        origenFondosSeguro: getRandomItem(["Salario", "Ahorros", "Rendimientos"]),
        pagoPrimaMonedaExtranjera: "no",
        pagoPrimaCuentaExterior: "no",
        productoServicioEmpresa: getRandomItem(["Tecnología", "Salud", "Construcción", "Educación"]),
      });
      if (isMariaGomezFlow) {
        setBeneficiariosData(prev => prev.map(b => {
          if (b.tipoDocumento === "NIT") {
            return {
              ...b,
              esBeneficiarioOtraPoliza: "no",
              nombreRepresentanteLegal: b.nombreRepresentanteLegal || "Carlos Gomez. Representante",
              tipoDocumentoRepresentanteLegal: b.tipoDocumentoRepresentanteLegal || "Cédula de ciudadanía",
              numeroDocumentoRepresentanteLegal: b.numeroDocumentoRepresentanteLegal || "80123456",
            };
          } else {
            return {
              ...b,
              esPep: "no",
              esBeneficiarioOtraPoliza: "no",
              fechaExpedicion: b.fechaExpedicion || "2015-08-20",
            };
          }
        }));
      }
    }
  };

  const stepValid = [
    isAseguradoValid(aseguradoData),
    true,
    isTomadorValid(tomadorData),
    isBeneficiariosValid(beneficiariosData),
    sarlaftSubStep === 0 
      ? isSarlaftPepStepValid(sarlaftData) 
      : sarlaftSubStep === 1 
        ? isSarlaftEconomicStepValid(sarlaftData) 
        : isSarlaftBeneficiariosStepValid(beneficiariosData),
  ];

  const isSarlaftStep = isMariaGomezFlow && currentStep === 4;
  const canNext = currentStep === 1
    ? (medicalSubStep === 0 ? isInformacionMedicaPaso1Valid(infoMedicaData) : isInformacionMedicaPaso2Valid(infoMedicaData))
    : (isSarlaftStep 
        ? (sarlaftSubStep === 0 
            ? isSarlaftPepStepValid(sarlaftData) 
            : sarlaftSubStep === 1 
              ? isSarlaftEconomicStepValid(sarlaftData) 
              : isSarlaftBeneficiariosStepValid(beneficiariosData)
          ) 
        : stepValid[currentStep]
      );

  const handleNext = () => {
    if (!canNext) return;
    if (currentStep === 1 && medicalSubStep === 0) {
      if (exceedsImcLimit(infoMedicaData)) {
        setShowImcModal(true);
        return;
      }
      setMedicalSubStep(1);
      return;
    }

    if (isSarlaftStep && sarlaftSubStep === 0) {
      setSarlaftSubStep(1);
      return;
    }

    if (isSarlaftStep && sarlaftSubStep === 1) {
      setSarlaftSubStep(2);
      return;
    }

    if (currentStep < flowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setShowSuccessModal(true);
  };

  const handleSuccessModalConfirm = () => {
    setShowSuccessModal(false);
    if (onComplete) {
      onComplete();
      return;
    }
    if (onGoToOportunidadInicio) {
      onGoToOportunidadInicio();
      return;
    }
    onBack();
  };

  const handleBack = () => {
    if (isSarlaftStep && sarlaftSubStep === 2) {
      setSarlaftSubStep(1);
      return;
    }

    if (isSarlaftStep && sarlaftSubStep === 1) {
      setSarlaftSubStep(0);
      return;
    }

    if (currentStep === 1 && medicalSubStep === 1) {
      setMedicalSubStep(0);
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(1);
      setMedicalSubStep(1);
      return;
    }
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <button onClick={onGoToOportunidadInicio || onBack} className="flex items-center text-sm font-semibold text-gray-500 hover:text-[#00008F] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver al inicio
      </button>

      <div className="flex flex-col md:flex-row gap-8">

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[500px] flex flex-col">
          <h1 className="text-2xl font-bold text-[#00008F] font-serif tracking-tight mb-8">
            {flowSteps[currentStep]}
          </h1>
          {currentStep === 3 && (
            <div className="-mt-4 mb-8">
              <p className="text-sm text-gray-600">
                Agrega entre 1 y 5 beneficiarios
              </p>
            </div>
          )}
          {isSarlaftStep && (
            <div className="-mt-4 mb-8 space-y-1">
              <p className="text-sm text-gray-600">
                A continuación, se mostrará el Formulario de Conocimiento del Cliente para su diligenciamiento, conforme a la normativa SARLAFT.
              </p>
            </div>
          )}

          <StepContent
            step={currentStep}
            medicalSubStep={medicalSubStep}
            sarlaftSubStep={sarlaftSubStep}
            aseguradoData={aseguradoData}
            onAseguradoChange={setAseguradoData}
            infoMedicaData={infoMedicaData}
            onInfoMedicaChange={setInfoMedicaData}
            tomadorData={tomadorData}
            onTomadorChange={setTomadorData}
            beneficiariosData={beneficiariosData}
            onBeneficiariosChange={setBeneficiariosData}
            sarlaftData={sarlaftData}
            onSarlaftChange={setSarlaftData}
          />

          <div className="flex justify-end items-center gap-3 mt-12 pt-6 border-t border-gray-100">
            {currentStep > 0 ? (
              <button onClick={handleBack} className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-[#00008F] border-2 border-[#00008F] rounded-full hover:bg-blue-50 transition-all active:scale-95">
                <ChevronLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
            ) : null}

            <button
              onClick={handleNext}
              disabled={!canNext}
              className={`flex items-center space-x-2 px-8 py-2.5 text-sm font-bold text-white bg-[#00008F] rounded-full shadow-md transition-all active:scale-95 ${!canNext ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-900"}`}
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 pb-4 border-b border-gray-100">
              Progreso del proceso
            </h3>
            <div className="space-y-3">
              {flowSidebarSteps.map((step, idx) => {
                const isActive = idx === sidebarCurrentStep;
                const isCompleted = idx < sidebarCurrentStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all cursor-default ${
                      isActive ? "border border-[#00008F] bg-blue-50/50 shadow-sm" : "border border-transparent hover:bg-gray-50/50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-colors ${
                      isActive ? "bg-[#00008F] text-white" : isCompleted ? "bg-[#00C853] text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} /> : sidebarCounters[idx]}
                    </div>
                    <span className={`font-bold text-sm transition-colors ${isActive || isCompleted ? "text-[#00008F]" : "text-gray-400"}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Botón demo autocompletar */}
      <button
        onClick={autoFill}
        className="fixed bottom-6 left-6 z-[90] bg-purple-600 hover:bg-purple-700 text-white p-3.5 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center justify-center group"
        title="Autocompletar (Modo Demo)"
      >
        <Wand2 className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-3 text-sm font-bold tracking-wide">Autocompletar</span>
      </button>

      {showImcModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-7 md:p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#C8102E]/10 text-[#C8102E] flex items-center justify-center mx-auto mb-5">
                <CircleX className="w-10 h-10" strokeWidth={2.4} />
              </div>
              <h2 className="text-2xl leading-tight font-bold text-[#C8102E] font-serif mb-6">
                No es posible continuar con el proceso.
              </h2>
              <p className="text-base text-gray-600 mb-8">
                El cliente reporta patologías no asegurables.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowImcModal(false);
                  if (onGoToOportunidadInicio) {
                    onGoToOportunidadInicio();
                    return;
                  }
                  onBack();
                }}
                className="w-full px-8 py-3 rounded-full bg-[#00008F] text-white font-bold hover:bg-blue-900 transition-all active:scale-95"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-7 md:p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-50 text-[#00C853] flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10" strokeWidth={2.4} />
              </div>
              <h2 className="text-2xl leading-tight font-bold text-[#00008F] font-serif mb-4">
                ¡Gracias!
                <span className="block mt-2 text-lg font-semibold text-gray-700">La información fue registrada correctamente</span>
              </h2>
              <p className="text-sm font-semibold text-gray-700 mb-2 leading-relaxed">
                Te invitamos a continuar con el proceso de envío de documentos para firma.
              </p>
              <button
                type="button"
                onClick={handleSuccessModalConfirm}
                className="w-full px-8 py-3 rounded-full bg-[#00008F] text-white font-bold hover:bg-blue-900 transition-all active:scale-95 shadow-md"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
