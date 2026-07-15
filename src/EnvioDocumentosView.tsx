import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';

interface EnvioDocumentosViewProps {
  oportunidad: any;
  onBack: () => void;
  onConfirm: () => void;
}

export default function EnvioDocumentosView({ oportunidad, onBack, onConfirm }: EnvioDocumentosViewProps) {
  const [showNotification, setShowNotification] = useState(false);

  const handleAceptar = () => {
    setShowNotification(true);
    setTimeout(() => {
      onConfirm();
    }, 2500); // Delay to show the notification
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-500 hover:text-[#00008F] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver al detalle
      </button>

      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
        <div className="space-y-6">
          <div className="flex items-center space-x-3.5 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-[#00008F]/10 rounded-lg flex items-center justify-center text-[#00008F] flex-shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#00008F] font-serif tracking-tight">
                Envío de Documentos
              </h1>
            </div>
          </div>

          <p className="text-base font-normal text-gray-700 leading-relaxed">
            Los documentos serán enviados al correo electrónico registrado del cliente, quien deberá revisarlos y completar el proceso de firma electrónica certificada.
          </p>

          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <span className="text-sm text-gray-650 leading-relaxed font-normal">
              El envío se realizará al siguiente correo electrónico: Juan.perez@correo.com
            </span>
          </div>
        </div>

        <button
          onClick={handleAceptar}
          className="w-full mt-8 bg-[#00008F] hover:bg-blue-900 text-white font-bold py-3.5 rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>Aceptar</span>
        </button>

        {/* Success Alert Overlay */}
        {showNotification && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 z-30">
            <div className="w-20 h-20 rounded-full bg-green-50 text-[#00C853] flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 className="w-12 h-12" strokeWidth={2.2} />
            </div>
            <h2 className="text-2xl font-bold text-[#00008F] font-serif mb-3">
              Documentos Enviados
            </h2>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed font-medium">
              Los documentos han sido enviados exitosamente al correo electrónico del asegurado. Redirigiendo al detalle...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
