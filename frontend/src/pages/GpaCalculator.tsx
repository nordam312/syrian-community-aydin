
import Layout from '@/components/layout/Layout';
import GpaCalculator from '@/components/gpa/GpaCalculator';

const GpaCalculatorPage = () => {
  return (
    <Layout>
      <div className="bg-syria-green-50 py-12">
        <div className="page-container">
          <h1 className="text-4xl font-bold text-syria-green-700 text-center mb-2">GPA Calculator</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Calculate your GPA based on the Turkish university grading system. Simply enter your courses, credits, and grades.
          </p>
        </div>
      </div>
      
      <div className="page-container py-12">
        <GpaCalculator />
        
        <div className="mt-12">
          <h2 className="section-subtitle">How to Use the Calculator</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              This calculator uses the standard Turkish university grading system to compute your GPA on a 4.0 scale.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="font-semibold text-syria-green-600 mb-3">Letter Grade Mode</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Enter the name of your course (optional)</li>
                  <li>Select the number of credits for the course</li>
                  <li>Choose your letter grade (AA, BA, BB, etc.)</li>
                  <li>Add more courses as needed</li>
                  <li>Click "Calculate GPA" to see your result</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-syria-green-600 mb-3">Numeric Grade Mode</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Enter the name of your course (optional)</li>
                  <li>Select the number of credits for the course</li>
                  <li>Enter your numeric grade (0-100)</li>
                  <li>Add more courses as needed</li>
                  <li>Click "Calculate GPA" to see your result</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GpaCalculatorPage;
