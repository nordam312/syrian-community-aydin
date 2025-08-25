
import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Plus, Trash } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// GPA Scale for Turkish universities
const letterGradeMap: Record<string, number> = {
  'AA': 4.0,
  'BA': 3.5,
  'BB': 3.0,
  'CB': 2.5,
  'CC': 2.0,
  'DC': 1.5,
  'DD': 1.0,
  'FF': 0.0,
};

const numericGradeToLetterGrade = (grade: number): string => {
  if (grade >= 90) return 'AA';
  if (grade >= 85) return 'BA';
  if (grade >= 80) return 'BB';
  if (grade >= 75) return 'CB';
  if (grade >= 70) return 'CC';
  if (grade >= 65) return 'DC';
  if (grade >= 60) return 'DD';
  return 'FF';
};

interface Course {
  id: number;
  name: string;
  credits: number;
  grade: string;  // letter grade
  numericGrade?: number; // numeric grade (0-100)
}

const GpaCalculator = () => {
  const [activeTab, setActiveTab] = useState('letter');
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', credits: 3, grade: 'AA' }
  ]);
  const [gpa, setGpa] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addCourse = () => {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    setCourses([...courses, { id: newId, name: '', credits: 3, grade: 'AA' }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const handleCourseChange = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const handleNumericGradeChange = (id: number, value: string) => {
    const numericValue = parseInt(value, 10);
    
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      setError('Grade must be a number between 0 and 100');
      return;
    }
    
    setError(null);
    const letterGrade = numericGradeToLetterGrade(numericValue);
    
    setCourses(courses.map(course => 
      course.id === id ? { ...course, numericGrade: numericValue, grade: letterGrade } : course
    ));
  };

  const calculateGpa = (e: FormEvent) => {
    e.preventDefault();
    
    let totalCredits = 0;
    let totalPoints = 0;
    
    for (const course of courses) {
      const credits = course.credits;
      const gradePoints = letterGradeMap[course.grade] || 0;
      
      totalCredits += credits;
      totalPoints += credits * gradePoints;
    }
    
    if (totalCredits === 0) {
      setGpa(0);
    } else {
      const calculatedGpa = totalPoints / totalCredits;
      setGpa(parseFloat(calculatedGpa.toFixed(2)));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-syria-green-700">GPA Calculator</CardTitle>
        <CardDescription>
          Calculate your GPA based on Turkish university grading system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="letter">Letter Grades</TabsTrigger>
            <TabsTrigger value="numeric">Numeric Grades</TabsTrigger>
          </TabsList>
          
          <form onSubmit={calculateGpa}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 md:col-span-5">
                    <Label htmlFor={`course-${course.id}`} className="sr-only">Course</Label>
                    <Input
                      id={`course-${course.id}`}
                      placeholder="Course Name"
                      value={course.name}
                      onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-3 md:col-span-2">
                    <Label htmlFor={`credits-${course.id}`} className="sr-only">Credits</Label>
                    <Select
                      value={course.credits.toString()}
                      onValueChange={(value) => handleCourseChange(course.id, 'credits', parseInt(value, 10))}
                    >
                      <SelectTrigger id={`credits-${course.id}`}>
                        <SelectValue placeholder="Credits" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((credit) => (
                          <SelectItem key={credit} value={credit.toString()}>
                            {credit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3 md:col-span-3">
                    <Label htmlFor={`grade-${course.id}`} className="sr-only">Grade</Label>
                    {activeTab === 'letter' ? (
                      <Select
                        value={course.grade}
                        onValueChange={(value) => handleCourseChange(course.id, 'grade', value)}
                      >
                        <SelectTrigger id={`grade-${course.id}`}>
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(letterGradeMap).map((letterGrade) => (
                            <SelectItem key={letterGrade} value={letterGrade}>
                              {letterGrade} ({letterGradeMap[letterGrade]})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={`numeric-grade-${course.id}`}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={course.numericGrade || ''}
                        onChange={(e) => handleNumericGradeChange(course.id, e.target.value)}
                      />
                    )}
                  </div>
                  
                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCourse(course.id)}
                      disabled={courses.length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={addCourse}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
            
            <div className="mt-6">
              <Button type="submit" className="w-full bg-syria-green-500 hover:bg-syria-green-600">
                Calculate GPA
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
      
      {gpa !== null && (
        <CardFooter className="flex flex-col">
          <div className="bg-syria-green-50 p-4 rounded-md w-full text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Your GPA</h3>
            <div className="text-4xl font-bold text-syria-green-700">{gpa}</div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default GpaCalculator;
