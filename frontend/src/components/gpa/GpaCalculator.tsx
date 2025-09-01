import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Plus, Trash, Calculator } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// مقياس المعدل التراكمي للجامعات التركية
const letterGradeMap: Record<string, number> = {
  AA: 4.0,
  BA: 3.5,
  BB: 3.0,
  CB: 2.5,
  CC: 2.0,
  DC: 1.5,
  DD: 1.0,
  FF: 0.0,
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
  grade: string; // درجة حرفية
  numericGrade?: number; // درجة رقمية (0-100)
}

const GpaCalculator = () => {
  const [activeTab, setActiveTab] = useState('letter');
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', credits: 3, grade: 'AA' },
  ]);
  const [gpa, setGpa] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addCourse = () => {
    const newId =
      courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    setCourses([...courses, { id: newId, name: '', credits: 3, grade: 'AA' }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const handleCourseChange = (
    id: number,
    field: keyof Course,
    value: string | number,
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course,
      ),
    );
  };

  const handleNumericGradeChange = (id: number, value: string) => {
    const numericValue = parseInt(value, 10);

    if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      setError('يجب أن تكون الدرجة بين 0 و 100');
      return;
    }

    setError(null);
    const letterGrade = numericGradeToLetterGrade(numericValue);

    setCourses(
      courses.map((course) =>
        course.id === id
          ? { ...course, numericGrade: numericValue, grade: letterGrade }
          : course,
      ),
    );
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
    <Card className="w-full max-w-4xl mx-auto border-syria-green-200 shadow-md">
      <CardHeader className="bg-syria-green-50 rounded-t-lg">
        <CardTitle className="text-syria-green-700 text-2xl text-right">
          <Calculator className="inline ml-2 mb-1 h-6 w-6" />
          حاسبة المعدل التراكمي
        </CardTitle>
        <CardDescription className="text-right text-syria-green-600">
          احسب معدلك التراكمي بناءً على نظام الدرجات في الجامعات التركية
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-syria-green-100">
            <TabsTrigger value="letter" className="data-[state=active]:bg-syria-green-500 data-[state=active]:text-white">
              الدرجات الحرفية
            </TabsTrigger>
            <TabsTrigger value="numeric" className="data-[state=active]:bg-syria-green-500 data-[state=active]:text-white">
              الدرجات الرقمية
            </TabsTrigger>
          </TabsList>

          <form onSubmit={calculateGpa}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* عناوين الأعمدة */}
              <div className="grid grid-cols-12 gap-4 text-right font-semibold text-syria-green-700 pb-2 border-b border-syria-green-100">
                <div className="col-span-4 md:col-span-5 pr-2">اسم المادة</div>
                <div className="col-span-3 md:col-span-2 pr-2">
                  الساعات المعتمدة
                  <br />
                  (ECTS Credit)
                </div>                <div className="col-span-3 md:col-span-3 pr-2">الدرجة</div>
                <div className="col-span-2"></div>
              </div>

              {courses.map((course) => (
                <div
                  key={course.id}
                  className="grid grid-cols-12 gap-4 items-center"
                >
                  <div className="col-span-4 md:col-span-5">
                    <Label htmlFor={`course-${course.id}`} className="sr-only">
                      المادة
                    </Label>
                    <Input
                      id={`course-${course.id}`}
                      placeholder="اسم المادة"
                      value={course.name}
                      onChange={(e) =>
                        handleCourseChange(course.id, 'name', e.target.value)
                      }
                      className="text-right"
                    />
                  </div>

                  <div className="col-span-3 md:col-span-2">
                    <Label htmlFor={`credits-${course.id}`} className="sr-only">
                      الساعات
                    </Label>
                    <Select
                      value={course.credits.toString()}
                      onValueChange={(value) =>
                        handleCourseChange(
                          course.id,
                          'credits',
                          parseInt(value, 10),
                        )
                      }
                    >
                      <SelectTrigger id={`credits-${course.id}`} className="text-right">
                        <SelectValue placeholder="الساعات" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((credit) => (
                          <SelectItem key={credit} value={credit.toString()} className="text-right">
                            {credit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3 md:col-span-3">
                    <Label htmlFor={`grade-${course.id}`} className="sr-only">
                      الدرجة
                    </Label>
                    {activeTab === 'letter' ? (
                      <Select
                        value={course.grade}
                        onValueChange={(value) =>
                          handleCourseChange(course.id, 'grade', value)
                        }
                      >
                        <SelectTrigger id={`grade-${course.id}`} className="text-right">
                          <SelectValue placeholder="الدرجة" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(letterGradeMap).map((letterGrade) => (
                            <SelectItem key={letterGrade} value={letterGrade} className="text-right">
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
                        onChange={(e) =>
                          handleNumericGradeChange(course.id, e.target.value)
                        }
                        className="text-right"
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
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
              className="mt-4 bg-syria-green-100 text-syria-green-700 hover:bg-syria-green-200 border-syria-green-200"
              onClick={addCourse}
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة مادة
            </Button>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full bg-syria-green-600 hover:bg-syria-green-700 text-white py-2 text-lg"
              >
                <Calculator className="ml-2 h-5 w-5" />
                حساب المعدل
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>

      {gpa !== null && (
        <CardFooter className="flex flex-col">
          <div className="bg-gradient-to-r from-syria-green-500 to-syria-green-600 p-6 rounded-md w-full text-center text-white shadow-md">
            <h3 className="text-xl font-semibold mb-3">معدلك التراكمي</h3>
            <div className="text-5xl font-bold">{gpa}</div>
            <p className="text-syria-green-100 mt-2">على مقياس 4.0</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default GpaCalculator;