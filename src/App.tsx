import React, { useState } from 'react';
import { CropRecord, Language, EvaluationResult } from './data/types';
import { calculateYieldPotential } from './data/scoringEngine';
import { DEMO_PROFILES, CROP_DATASET } from './data/dataset';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DashboardSection } from './components/DashboardSection';
import { AnalyzerSection } from './components/AnalyzerSection';
import { ExplainableAiSection } from './components/ExplainableAiSection';
import { WhatIfSection } from './components/WhatIfSection';
import { RiskRadarSection } from './components/RiskRadarSection';
import { ActionPlanSection } from './components/ActionPlanSection';
import { CropIntelligenceSection } from './components/CropIntelligenceSection';
import { DataExplorerSection } from './components/DataExplorerSection';
import { AiEngineSection } from './components/AiEngineSection';
import { JudgeModeModal } from './components/JudgeModeModal';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState<boolean>(false);

  // Default to the first realistic record from dataset
  const [currentRecord, setCurrentRecord] = useState<CropRecord>({
    crop_type: "Sugarcane",
    cultivated_area_acres: 45.0,
    rainfall_mm: 1450.0,
    temperature_c: 28.5,
    soil_ph: 6.8,
    nitrogen_kg_acre: 180.0,
    phosphorus_kg_acre: 95.0,
    potassium_kg_acre: 160.0,
    organic_matter_percent: 4.8,
    irrigation_coverage_percent: 88.0,
    pest_pressure_index: 0.16,
  });

  // Calculate dynamic evaluation based on actual indicators
  const evaluation: EvaluationResult = calculateYieldPotential(currentRecord);

  const handleSelectDemoProfile = (demoId: string) => {
    const found = DEMO_PROFILES.find(d => d.id === demoId);
    if (found) {
      setCurrentRecord(found.data as CropRecord);
      // Smooth scroll to analyzer or dashboard
      const elem = document.getElementById('intelligence');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTriggerQuickDemo = () => {
    // Cycle between profiles or pick water stress to show dramatic contrast
    handleSelectDemoProfile('water_stress');
  };

  const handleAnalyze = (newRecord: CropRecord) => {
    setCurrentRecord(newRecord);
    // Smooth scroll to intelligence
    const elem = document.getElementById('intelligence');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenJudgeMode={() => setIsJudgeModeOpen(true)}
        onTriggerDemo={handleTriggerQuickDemo}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          language={language}
          onAnalyzeClick={() => handleJumpToSection('analyzer')}
          onDemoClick={handleTriggerQuickDemo}
        />

        {/* Farm Intelligence Dashboard */}
        <DashboardSection
          evaluation={evaluation}
          language={language}
          onExploreFactorsClick={() => handleJumpToSection('explainable')}
          onOpenWhatIfClick={() => handleJumpToSection('whatif')}
        />

        {/* AI Farm Health Scan Form */}
        <AnalyzerSection
          currentRecord={currentRecord}
          evaluation={evaluation}
          language={language}
          onAnalyze={handleAnalyze}
          onSelectDemoProfile={handleSelectDemoProfile}
          onNavigateToWhatIf={() => handleJumpToSection('whatif')}
        />

        {/* Explainable AI (XAI) Feature Contributions */}
        <ExplainableAiSection
          evaluation={evaluation}
          language={language}
        />

        {/* Signature Feature: What-If Lab */}
        <WhatIfSection
          currentRecord={currentRecord}
          currentEvaluation={evaluation}
          language={language}
        />

        {/* Farm Risk Radar */}
        <RiskRadarSection
          evaluation={evaluation}
          language={language}
          onExploreMitigationClick={() => handleJumpToSection('action-plan')}
        />

        {/* Action Plan */}
        <ActionPlanSection
          evaluation={evaluation}
          language={language}
        />

        {/* Crop Intelligence Profiles & Comparison */}
        <CropIntelligenceSection
          language={language}
        />

        {/* Data Explorer */}
        <DataExplorerSection
          language={language}
        />

        {/* AI Methodology & Future ML Architecture */}
        <AiEngineSection
          language={language}
        />
      </main>

      {/* Judge Mode Modal */}
      <JudgeModeModal
        isOpen={isJudgeModeOpen}
        onClose={() => setIsJudgeModeOpen(false)}
        language={language}
        onJumpToSection={handleJumpToSection}
      />

      {/* Footer with Responsible AI Notices */}
      <Footer language={language} />
    </div>
  );
}
