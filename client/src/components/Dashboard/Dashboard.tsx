import React, { useState } from 'react';
import { ResumeAnalysis } from '../../types';
import ResumeUpload from '../Resume/ResumeUpload';
import AnalysisResults from '../Resume/AnalysisResults';

const Dashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleAnalysisComplete = (analysisResult: ResumeAnalysis) => {
    setAnalysis(analysisResult);
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!analysis ? (
        <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
      ) : (
        <AnalysisResults analysis={analysis} onReset={handleReset} />
      )}
    </div>
  );
};

export default Dashboard;