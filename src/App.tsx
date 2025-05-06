import React, { useState } from "react";
import { Upload, AlertCircle, Loader2 } from "lucide-react";

interface PredictionResult {
  label: string;
  confidence: number;
  explanationUrl: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      // Replace with your actual API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Chest X-Ray Analysis
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Upload a chest X-ray image to detect pneumonia using explainable
              AI
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              {/* Upload Section */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                {/* Preview */}
                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">{error}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedFile || loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !selectedFile || loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Processing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </button>
              </form>

              {/* Results Section */}
              {result && (
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-lg font-medium text-gray-900">Results</h2>
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Diagnosis
                        </p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {result.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Confidence
                        </p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {(result.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* LIME Explanation */}
                    {result.explanationUrl && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Visual Explanation
                        </p>
                        <img
                          src={result.explanationUrl}
                          alt="LIME explanation"
                          className="w-full rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-sm text-gray-500 text-center">
            <p>
              This tool is for research purposes only and should not be used as
              a substitute for professional medical diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
