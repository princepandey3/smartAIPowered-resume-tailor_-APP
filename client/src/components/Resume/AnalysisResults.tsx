import React from 'react';
import { ResumeAnalysis } from '../../types';
import { CheckCircle, XCircle, TrendingUp, Target, AlertCircle, ArrowLeft } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
  onReset: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Analyze Another Resume</span>
        </button>
      </div>

      {/* ATS Score Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ATS Analysis Results</h2>
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
            <div className={`absolute inset-0 bg-gradient-to-r ${getScoreBackground(analysis.atsScore)} rounded-full`}></div>
            <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                  {analysis.atsScore}
                </div>
                <div className="text-sm text-gray-600">ATS Score</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{analysis.keywordMatchPercentage}%</div>
              <div className="text-sm text-blue-800">Keyword Match</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">{analysis.missingKeywords?.length || 0}</div>
              <div className="text-sm text-purple-800">Missing Keywords</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
          </div>
          <div className="space-y-3">
            {analysis.strengths?.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-green-800 text-sm">{strength}</p>
              </div>
            ))}
            {(!analysis.strengths || analysis.strengths.length === 0) && (
              <p className="text-gray-500 text-center py-4">No strengths identified</p>
            )}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <XCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-bold text-gray-900">Areas for Improvement</h3>
          </div>
          <div className="space-y-3">
            {analysis.weaknesses?.map((weakness, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-800 text-sm">{weakness}</p>
              </div>
            ))}
            {(!analysis.weaknesses || analysis.weaknesses.length === 0) && (
              <p className="text-gray-500 text-center py-4">No weaknesses identified</p>
            )}
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-900">Improvement Suggestions</h3>
        </div>
        <div className="space-y-4">
          {analysis.improvementSuggestions?.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-blue-800">{suggestion}</p>
            </div>
          ))}
          {(!analysis.improvementSuggestions || analysis.improvementSuggestions.length === 0) && (
            <p className="text-gray-500 text-center py-4">No suggestions available</p>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">Missing Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Consider incorporating these keywords naturally into your resume to improve ATS compatibility.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;