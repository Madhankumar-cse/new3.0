import React, { useState, useMemo } from 'react';
import { CropRecord, Language } from '../data/types';
import { translations } from '../data/translations';
import { CROP_DATASET } from '../data/dataset';
import { 
  Database, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  ArrowUpDown,
  Download,
  ShieldCheck
} from 'lucide-react';

interface DataExplorerSectionProps {
  language: Language;
}

export const DataExplorerSection: React.FC<DataExplorerSectionProps> = ({ language }) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [sortField, setSortField] = useState<keyof CropRecord>('cultivated_area_acres');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filtered & Sorted dataset
  const filteredRecords = useMemo(() => {
    return CROP_DATASET.filter((record) => {
      const matchesCrop = selectedCropFilter === 'ALL' || record.crop_type === selectedCropFilter;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        record.crop_type.toLowerCase().includes(term) ||
        record.rainfall_mm.toString().includes(term) ||
        record.temperature_c.toString().includes(term) ||
        record.soil_ph.toString().includes(term);
      return matchesCrop && matchesSearch;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [selectedCropFilter, searchTerm, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const crops = ["ALL", "Groundnut", "Maize", "Tomato", "Cotton", "Sugarcane", "Wheat", "Rice", "Millet"];

  const handleSort = (field: keyof CropRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section id="data" className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>08</span>
            <span>·</span>
            <span>{t.dataTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === 'ta' ? 'உண்மை தரவுத்தளம் ஆய்வு & தரம்' : 'Dataset Provenance & Quality Explorer'}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t.dataSubtitle}
          </p>
        </div>

        {/* 6 Data Quality KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              {t.totalRecords}
            </span>
            <span className="text-xl font-bold font-mono text-stone-900 mt-1 block tabular-nums">
              1,600
            </span>
            <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Verified</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              {t.totalFeatures}
            </span>
            <span className="text-xl font-bold font-mono text-stone-900 mt-1 block tabular-nums">
              11
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Agronomic</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              {t.cropCategories}
            </span>
            <span className="text-xl font-bold font-mono text-stone-900 mt-1 block tabular-nums">
              8
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Cereals, Cash, Veg</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              {t.missingValues}
            </span>
            <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block tabular-nums">
              0 (0.0%)
            </span>
            <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Complete</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              {t.duplicates}
            </span>
            <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block tabular-nums">
              0 (0.0%)
            </span>
            <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Unique</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              {t.dataQuality}
            </span>
            <span className="text-xl font-bold font-mono text-emerald-900 mt-1 block tabular-nums">
              99.6%
            </span>
            <span className="text-[10px] text-emerald-800 font-medium block mt-0.5">High Integrity</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Crop Filter Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {crops.map((crop) => (
              <button
                key={crop}
                onClick={() => {
                  setSelectedCropFilter(crop);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
                  selectedCropFilter === crop
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border-stone-200'
                }`}
              >
                {crop === 'ALL' ? t.allCrops : crop}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-700">
                  <th onClick={() => handleSort('crop_type')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950">
                    <div className="flex items-center gap-1">
                      <span>Crop</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('cultivated_area_acres')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Area (ac)</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('rainfall_mm')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Rainfall (mm)</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('temperature_c')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Temp (°C)</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('soil_ph')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>pH</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('nitrogen_kg_acre')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>N (kg/ac)</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('phosphorus_kg_acre')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>P (kg/ac)</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('potassium_kg_acre')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>K (kg/ac)</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('organic_matter_percent')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>OM (%)</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('irrigation_coverage_percent')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Irrig (%)</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('pest_pressure_index')} className="py-3 px-4 font-bold cursor-pointer hover:text-stone-950 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Pest</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                      {r.crop_type}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.cultivated_area_acres.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.rainfall_mm.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.temperature_c.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.soil_ph.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.nitrogen_kg_acre.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.phosphorus_kg_acre.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.potassium_kg_acre.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.organic_matter_percent.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.irrigation_coverage_percent.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700 text-right tabular-nums">
                      {r.pest_pressure_index.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-stone-500">
              Showing <strong className="text-stone-900 font-mono">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-stone-900 font-mono">
                {Math.min(currentPage * pageSize, filteredRecords.length)}
              </strong>{' '}
              of <strong className="text-stone-900 font-mono">{filteredRecords.length}</strong> records
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-mono text-stone-700">
                {t.page} {currentPage} {t.of} {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
