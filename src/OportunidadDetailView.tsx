import React, { useState } from 'react';
import { ChevronRight, Check, FileText, Send, Edit, PenTool, ArrowLeft, Shield, Calculator, Briefcase, X } from 'lucide-react';

interface OportunidadDetailViewProps {
  oportunidad: any;
  estadoProceso?: {
    vinculacionCompletada: boolean;
    firmaDocumentosHabilitada: boolean;
    firmaEnviada?: boolean;
    firmaConfirmada?: boolean;
  };
  onBack: () => void;
  onCompletarDatos: () => void;
  onFirmarDocumentos: () => void;
  onConfirmarFirma: () => void;
}

export default function OportunidadDetailView({ oportunidad, estadoProceso, onBack, onCompletarDatos, onFirmarDocumentos, onConfirmarFirma }: OportunidadDetailViewProps) {
  const [showResendModal, setShowResendModal] = useState(false);
  const [showFirmaConfirmadaModal, setShowFirmaConfirmadaModal] = useState(false);

  const getOpportunityEmail = (name: string) => {
    if (!name) return "cliente@correo.com";
    const cleaned = name
      .toLowerCase()
      .replace("cotización ", "")
      .replace("seguro vida ", "")
      .replace("póliza inversión ", "")
      .trim();
    const emailPrefix = cleaned
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, ".");
    return `${emailPrefix}@correo.com`;
  };
  const summary = {
    valorAsegurado: "60.000.000",
    primaAnual: "1.115.940",
    ocupacion: "Agente de administración tributaria"
  };

  const vinculacionCompletada = !!estadoProceso?.vinculacionCompletada;
  const firmaDocumentosHabilitada = !!estadoProceso?.firmaDocumentosHabilitada;
  const firmaEnviada = !!estadoProceso?.firmaEnviada;
  const firmaConfirmada = !!estadoProceso?.firmaConfirmada;

  const steps = [
    { label: "Análisis de nec...", status: "completed" },
    { label: "Cotización prese...", status: "completed" },
    { label: "Vinculación", status: vinculacionCompletada ? "completed" : "active" },
    { label: "Firma de documentos", status: firmaEnviada ? "completed" : (firmaDocumentosHabilitada ? "active" : "upcoming") },
    { label: "Confirmación de firma", status: firmaConfirmada ? "completed" : (firmaEnviada ? "active" : "upcoming") },
    { label: "Pendiente emisión", status: firmaConfirmada ? "active" : "upcoming" },
    { label: "Cerrada", status: "upcoming" }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header section with back button */}
      <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-500 hover:text-[#00008F] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver a Oportunidades
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#FF6F30] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 22h20v-2H2v2zm19-15.5l-4.5 4.5L12 3l-4.5 8L3 6.5V18h18V6.5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-0.5">Oportunidad</p>
              <h1 className="text-2xl font-medium text-[#00008F] font-serif tracking-tight">
                {oportunidad.name.replace("Cotización ", "").replace("Seguro Vida ", "").replace("Póliza Inversión ", "")}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 py-1 mb-8">
          <div className="flex items-center space-x-3 bg-blue-50/40 px-4 py-2.5 rounded-xl border border-blue-100/50">
            <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-[#00008F]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Valor asegurado</p>
              <p className="text-sm font-semibold text-gray-800">${summary.valorAsegurado}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-blue-50/40 px-4 py-2.5 rounded-xl border border-blue-100/50">
            <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-4 h-4 text-[#00008F]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total prima anual</p>
              <p className="text-sm font-semibold text-gray-800">${summary.primaAnual}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-blue-50/40 px-4 py-2.5 rounded-xl border border-blue-100/50">
            <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 text-[#00008F]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Ocupación</p>
              <p className="text-sm font-semibold text-[#00008F] hover:underline cursor-pointer">{summary.ocupacion}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-10 w-full">
          <div className="flex flex-wrap gap-4">
            {vinculacionCompletada ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-[#00008F] border-2 border-[#00008F] rounded-lg bg-white cursor-default select-none"
                >
                  <Edit className="w-4 h-4" />
                  <span>Completar datos</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block w-36 bg-gray-800 text-white text-xs p-2 rounded-lg shadow-xl z-30 text-center pointer-events-none border border-gray-700 leading-normal">
                  Proceso completado
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            ) : (
              <button onClick={onCompletarDatos} className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-[#00008F] border-2 border-[#00008F] rounded-lg hover:bg-blue-50 transition-all shadow-sm active:scale-95 bg-white">
                <Edit className="w-4 h-4" />
                <span>Completar datos</span>
              </button>
            )}
            
            {/* Botón Firmar documentos con Tooltip personalizado */}
            {firmaEnviada ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-[#00008F] border-2 border-[#00008F] rounded-lg bg-white cursor-default select-none"
                >
                  <FileText className="w-4 h-4" />
                  <span>Firmar documentos</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block w-36 bg-gray-800 text-white text-xs p-2 rounded-lg shadow-xl z-30 text-center pointer-events-none border border-gray-700 leading-normal">
                  Proceso completado
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            ) : firmaDocumentosHabilitada ? (
              <button
                type="button"
                onClick={onFirmarDocumentos}
                className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-[#00008F] border-2 border-[#00008F] rounded-lg hover:bg-blue-50 transition-all shadow-sm active:scale-95 bg-white"
              >
                <FileText className="w-4 h-4" />
                <span>Firmar documentos</span>
              </button>
            ) : (
              <div className="relative group">
                <button 
                  type="button"
                  className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-gray-400 border-2 border-gray-200 rounded-lg bg-gray-50/50 cursor-default"
                >
                  <FileText className="w-4 h-4" />
                  <span>Firmar documentos</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block w-72 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 text-center pointer-events-none border border-gray-700 leading-normal">
                  Opción disponible cuando la solicitud avance a la etapa de firma de documentos.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}

            {/* Botón Confirmar firma con Tooltip personalizado */}
            {firmaConfirmada ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-[#00008F] border-2 border-[#00008F] rounded-lg bg-white cursor-default select-none"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Confirmar firma</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block w-36 bg-gray-800 text-white text-xs p-2 rounded-lg shadow-xl z-30 text-center pointer-events-none border border-gray-700 leading-normal">
                  Proceso completado
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            ) : firmaEnviada ? (
              <button
                type="button"
                onClick={() => setShowFirmaConfirmadaModal(true)}
                className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-[#00008F] border-2 border-[#00008F] rounded-lg hover:bg-blue-50 transition-all shadow-sm active:scale-95 bg-white"
              >
                <PenTool className="w-4 h-4" />
                <span>Confirmar firma</span>
              </button>
            ) : (
              <div className="relative group">
                <button 
                  type="button"
                  className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-gray-400 border-2 border-gray-200 rounded-lg bg-gray-50/50 cursor-default"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Confirmar firma</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block w-72 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 text-center pointer-events-none border border-gray-700 leading-normal">
                  Opción disponible cuando la solicitud avance a la etapa de confirmación de firma.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
             <button 
               onClick={() => setShowResendModal(true)}
               className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-white border-2 border-[#00008F] rounded-full hover:bg-blue-900 transition-all shadow-sm active:scale-95 bg-[#00008F]"
             >
               <Send className="w-4 h-4" />
               <span>Reenviar cotización</span>
             </button>
            <button className="flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-[#00008F] border-2 border-[#00008F] rounded-full hover:bg-blue-50 transition-all shadow-sm active:scale-95 bg-white">
              <FileText className="w-4 h-4 text-[#00008F]" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* Chevron Path / Progress Bar */}
        <div className="flex w-full bg-white text-[11px] font-bold p-1.5 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {steps.map((step, idx) => {
            let bgClass = "bg-gray-100 text-gray-500 hover:bg-gray-200";
            if (step.status === "completed") bgClass = "bg-[#30a14b] text-white hover:bg-[#288a3f]"; 
            else if (step.status === "active") bgClass = "bg-[#00008F] text-white shadow-inner";
            
            const zIndex = steps.length - idx;
            const clipPath = idx === 0 
              ? 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)' 
              : idx === steps.length - 1 
                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%)' 
                : 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)';
                
            return (
              <div 
                key={idx} 
                className={`relative flex-1 flex items-center justify-center h-10 transition-colors cursor-pointer ${bgClass}`} 
                style={{
                  clipPath: clipPath,
                  marginLeft: idx === 0 ? '0' : '-11px',
                  zIndex: zIndex,
                }}
              >
                <div className="flex items-center justify-center space-x-1.5 px-3 truncate">
                  {step.status === "completed" && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                  <span className="truncate" title={step.label}>{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showResendModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setShowResendModal(false)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (X) */}
            <button
              type="button"
              onClick={() => setShowResendModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-full z-10"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-7 md:p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 text-[#00008F] flex items-center justify-center mx-auto mb-5">
                <Send className="w-10 h-10" />
              </div>
              <h2 className="text-2xl leading-tight font-bold text-[#00008F] font-serif mb-4">
                Reenviar Cotización
              </h2>
              <p className="text-sm font-semibold text-gray-700 mb-2 leading-relaxed">
                La cotización será reenviada al correo electrónico registrado del cliente:
              </p>
              <p className="text-base text-[#00008F] font-bold mb-8">
                {getOpportunityEmail(oportunidad.name)}
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResendModal(false)}
                  className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setShowResendModal(false)}
                  className="flex-1 px-6 py-3 rounded-full bg-[#00008F] text-white font-bold hover:bg-blue-900 transition-all active:scale-95 shadow-md text-sm"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFirmaConfirmadaModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setShowFirmaConfirmadaModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7 md:p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-50 text-[#00C853] flex items-center justify-center mx-auto mb-5">
                <Check className="w-10 h-10" strokeWidth={2.8} />
              </div>
              <h2 className="text-2xl leading-tight font-bold text-[#00008F] font-serif mb-4">
                Firma registrada con éxito
              </h2>
              <p className="text-sm font-normal text-gray-700 mb-8 leading-relaxed">
                Tu solicitud fue remitida como análisis de suscripción o emisión rápida.
              </p>
              <button
                type="button"
                onClick={() => {
                  onConfirmarFirma();
                  setShowFirmaConfirmadaModal(false);
                }}
                className="w-full px-6 py-3 rounded-full bg-[#00008F] text-white font-bold hover:bg-blue-900 transition-all active:scale-95 shadow-md text-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
