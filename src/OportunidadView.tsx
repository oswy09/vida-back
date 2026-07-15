import React, { useState } from 'react';
import { Settings, LayoutGrid, RotateCw, Edit2, PieChart, Filter, Search, ChevronDown, MapPin } from 'lucide-react';
import OportunidadDetailView from './OportunidadDetailView';
import CompletarDatosView from './CompletarDatosView';
import EnvioDocumentosView from './EnvioDocumentosView';

interface ProcesoEstado {
  vinculacionCompletada: boolean;
  firmaDocumentosHabilitada: boolean;
  firmaEnviada?: boolean;
  firmaConfirmada?: boolean;
}

const mockData = [
  { id: 1, name: "Cotización Juan Pérez", doc: "1020304050", stage: "Cotización enviada", closeDate: "15/05/2026", owner: "aperez", createdAt: "28/04/2026" },
  { id: 2, name: "Seguro Vida María Gómez", doc: "52456789", stage: "Negociación", closeDate: "20/05/2026", owner: "mgomez", createdAt: "29/04/2026" },
  { id: 3, name: "Cotización Sugerida Carlos", doc: "1010101010", stage: "Cerrada ganada", closeDate: "10/04/2026", owner: "aperez", createdAt: "05/04/2026" },
  { id: 4, name: "Póliza Inversión Ana", doc: "39485721", stage: "Análisis de necesidades", closeDate: "30/05/2026", owner: "mgomez", createdAt: "29/04/2026" }
];

interface OportunidadViewProps {
  initialOportunidadId?: number | null;
  onClearInitialId?: () => void;
}

export default function OportunidadView({ initialOportunidadId, onClearInitialId }: OportunidadViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOportunidad, setSelectedOportunidad] = useState<any>(null);

  React.useEffect(() => {
    if (initialOportunidadId) {
      const found = mockData.find(o => o.id === initialOportunidadId);
      if (found) {
        setSelectedOportunidad(found);
      }
      if (onClearInitialId) {
        onClearInitialId();
      }
    }
  }, [initialOportunidadId, onClearInitialId]);
  const [isCompletandoDatos, setIsCompletandoDatos] = useState(false);
  const [isFirmandoDocumentos, setIsFirmandoDocumentos] = useState(false);
  const [estadoProcesoById, setEstadoProcesoById] = useState<Record<number, ProcesoEstado>>({});

  if (isCompletandoDatos && selectedOportunidad) {
    return (
      <CompletarDatosView
        oportunidad={selectedOportunidad}
        onBack={() => setIsCompletandoDatos(false)}
        onComplete={() => {
          setEstadoProcesoById((prev) => ({
            ...prev,
            [selectedOportunidad.id]: {
              vinculacionCompletada: true,
              firmaDocumentosHabilitada: true,
            },
          }));
          setIsCompletandoDatos(false);
        }}
        onGoToOportunidadInicio={() => {
          setIsCompletandoDatos(false);
          setSelectedOportunidad(null);
        }}
      />
    );
  }

  if (isFirmandoDocumentos && selectedOportunidad) {
    return (
      <EnvioDocumentosView
        oportunidad={selectedOportunidad}
        onBack={() => setIsFirmandoDocumentos(false)}
        onConfirm={() => {
          setEstadoProcesoById((prev) => ({
            ...prev,
            [selectedOportunidad.id]: {
              ...prev[selectedOportunidad.id],
              firmaEnviada: true,
            },
          }));
          setIsFirmandoDocumentos(false);
        }}
      />
    );
  }

  if (selectedOportunidad) {
    return (
      <OportunidadDetailView 
        oportunidad={selectedOportunidad} 
        estadoProceso={estadoProcesoById[selectedOportunidad.id]}
        onBack={() => setSelectedOportunidad(null)} 
        onCompletarDatos={() => setIsCompletandoDatos(true)}
        onFirmarDocumentos={() => setIsFirmandoDocumentos(true)}
        onConfirmarFirma={() => {
          setEstadoProcesoById((prev) => ({
            ...prev,
            [selectedOportunidad.id]: {
              ...prev[selectedOportunidad.id],
              firmaConfirmada: true,
            },
          }));
        }}
      />
    );
  }

  const filteredData = mockData.filter(row => 
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.doc.includes(searchQuery) ||
    row.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[500px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FF6F30] rounded-md flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 22h20v-2H2v2zm19-15.5l-4.5 4.5L12 3l-4.5 8L3 6.5V18h18V6.5z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Oportunidades</p>
              <div className="flex items-center space-x-2">
                <h1 className="text-[17px] font-bold text-gray-800 font-serif">Vistos recientemente</h1>
                <ChevronDown className="w-4 h-4 text-gray-500 cursor-pointer" />
                <MapPin className="w-3.5 h-3.5 text-[#00008F] cursor-pointer ml-1" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-1.5 text-xs font-semibold text-[#00008F] border border-gray-300 rounded hover:bg-gray-50 transition-colors bg-white">
              Crear Oportunidad
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-2.5 border-t border-b border-gray-200 mb-4 gap-4">
          <p className="text-[11px] text-gray-500 font-medium">{filteredData.length} elementos • Se actualizó hace 2 minutos</p>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en esta lista..." 
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded w-60 focus:outline-none focus:ring-1 focus:ring-[#00008F] focus:border-[#00008F]"
              />
            </div>
            
            <div className="flex items-center space-x-0.5 border border-gray-300 rounded p-0.5 bg-white">
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors" title="Configuración"><Settings className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 flex items-center space-x-1 transition-colors" title="Vista de tabla">
                <LayoutGrid className="w-3.5 h-3.5" />
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors" title="Actualizar"><RotateCw className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors" title="Editar"><Edit2 className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors" title="Gráficos"><PieChart className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors" title="Filtros"><Filter className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border-b border-gray-200">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-200 text-gray-700 bg-white">
                <th className="px-3 py-2 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-[#00008F] focus:ring-[#00008F] cursor-pointer" />
                </th>
                <th className="px-3 py-2 text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <span>Nombre de la oportun...</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <span>Numero de Documento</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <span>Etapa</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <span>Fecha de cierre</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <span>Alias del propietario ...</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <span>Fecha de creación</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-3 py-2.5">
                      <input type="checkbox" className="rounded border-gray-300 text-[#00008F] focus:ring-[#00008F] cursor-pointer" />
                    </td>
                    <td 
                      className="px-3 py-2.5 text-[13px] text-[#00008F] font-medium cursor-pointer hover:underline"
                      onClick={() => setSelectedOportunidad(row)}
                    >
                      {row.name}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-gray-800">{row.doc}</td>
                    <td className="px-3 py-2.5 text-[13px] text-gray-800">{row.stage}</td>
                    <td className="px-3 py-2.5 text-[13px] text-gray-800">{row.closeDate}</td>
                    <td className="px-3 py-2.5 text-[13px] text-gray-800 hover:text-[#00008F] hover:underline cursor-pointer">{row.owner}</td>
                    <td className="px-3 py-2.5 text-[13px] text-gray-800">{row.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-500 text-sm">
                    No se encontraron oportunidades con "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
