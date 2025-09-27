

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Mail,
  Phone,
  Award,
  GraduationCap,
  Shield,
  UserCheck,
  ChevronDown,
  Loader2
} from 'lucide-react';

interface Member {
  id: number;
  name: string;
  role: string;
  department?: string;
  major?: string;
  year?: string;
  image?: string;
  isLeader?: boolean;
  isActive?: boolean;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockMembers: Member[] = [
          {
            id: 1,
            name: 'Muhammed',
            role: 'رئيس الجالية',
            department: 'الإدارة',
            major: 'هندسة البرمجيات',
            year: 'السنة الرابعة',
            isLeader: true,
            isActive: true
          },
          {
            id: 2,
            name: 'أحمد محمد',
            role: 'رئيس الجالية',
            department: 'الإدارة',
            major: 'هندسة البرمجيات',
            year: 'السنة الرابعة',
            image: '/api/placeholder/150/150',
            isLeader: true,
            isActive: true
          },
          {
            id: 3,
            name: 'سارة أحمد',
            role: 'مسؤولة الفعاليات',
            department: 'الفعاليات',
            major: 'التصميم الجرافيكي',
            year: 'السنة الثانية',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 4,
            name: 'عمر حسن',
            role: 'مسؤول التقنية',
            department: 'التقنية',
            major: 'هندسة الحاسوب',
            year: 'السنة الرابعة',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 5,
            name: 'ليلى محمود',
            role: 'مسؤولة الإعلام',
            department: 'الإعلام',
            major: 'الإعلام الرقمي',
            year: 'السنة الثانية',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 6,
            name: 'خالد سالم',
            role: 'عضو',
            department: 'عام',
            major: 'الطب',
            year: 'السنة الأولى',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 7,
            name: 'خالد سالم',
            role: 'عضو',
            department: 'عام',
            major: 'الطب',
            year: 'السنة الأولى',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 8,
            name: 'خالد سالم',
            role: 'عضو',
            department: 'عام',
            major: 'الطب',
            year: 'السنة الأولى',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 9,
            name: 'خالد سالم',
            role: 'عضو',
            department: 'عام',
            major: 'الطب',
            year: 'السنة الأولى',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 10,
            name: 'خالد سالم',
            role: 'عضو',
            department: 'عام',
            major: 'الطب',
            year: 'السنة الأولى',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 11,
            name: 'خالد سالم',
            role: 'عضو',
            department: 'عام',
            major: 'الطب',
            year: 'السنة الأولى',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 12,
            name: 'خالد سالم',
            role: 'عضو',
            department: 'عام',
            major: 'الطب',
            year: 'السنة الأولى',
            image: '/api/placeholder/150/150',
            isActive: true
          },
          {
            id: 13,
            name: 'نور الدين',
            role: 'عضو',
            department: 'عام',
            major: 'الهندسة المدنية',
            year: 'السنة الثانية',
            image: '/api/placeholder/150/150',
            isActive: true
          }
        ];
        setMembers(mockMembers);
        setFilteredMembers(mockMembers);
        setIsLoading(false);
      }, 1500);
    };

    fetchMembers();
  }, []);

  // Filter members based on search and filters
  useEffect(() => {
    let filtered = members;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.major?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(member => member.role === selectedRole);
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(member => member.department === selectedDepartment);
    }

    setFilteredMembers(filtered);
  }, [searchTerm, selectedRole, selectedDepartment, members]);

  // Get unique roles and departments
  const roles = ['all', ...new Set(members.map(m => m.role))];
  const departments = ['all', ...new Set(members.map(m => m.department).filter(Boolean))];

  // Separate leaders and regular members
  const leaders = filteredMembers.filter(m => m.isLeader);
  const regularMembers = filteredMembers.filter(m => !m.isLeader);
  const displayedMembers = showMore ? regularMembers : regularMembers.slice(0, 15);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-page-enter">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-syria-green-500 to-syria-green-600 py-12 md:py-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10">
            <Users className="mx-auto h-12 w-12 md:h-16 md:w-16 mb-4 md:mb-6 " />
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 animate-slide-down">أعضاء الجالية</h1>
            <p className="text-base md:text-xl max-w-2xl mx-auto opacity-90 px-4">
              تعرف على الفريق الذي يعمل بجد لبناء مجتمع طلابي قوي ومترابط
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 md:-mt-10 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <Card className="bg-white border-syria-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 md:p-6 text-center">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-syria-green-600 mx-auto mb-1 md:mb-2" />
                <div className="text-xl md:text-3xl font-bold text-syria-green-700">{members.length}</div>
                <div className="text-syria-green-600 text-xs md:text-sm">إجمالي الأعضاء</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-syria-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 md:p-6 text-center">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-syria-green-600 mx-auto mb-1 md:mb-2" />
                <div className="text-xl md:text-3xl font-bold text-syria-green-700">{leaders.length}</div>
                <div className="text-syria-green-600 text-xs md:text-sm">مجلس الإدارة</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-syria-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 md:p-6 text-center">
                <UserCheck className="h-6 w-6 md:h-8 md:w-8 text-syria-green-600 mx-auto mb-1 md:mb-2" />
                <div className="text-xl md:text-3xl font-bold text-syria-green-700">
                  {members.filter(m => m.isActive).length}
                </div>
                <div className="text-syria-green-600 text-xs md:text-sm">أعضاء نشطون</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-syria-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 md:p-6 text-center">
                <Award className="h-6 w-6 md:h-8 md:w-8 text-syria-green-600 mx-auto mb-1 md:mb-2" />
                <div className="text-xl md:text-3xl font-bold text-syria-green-700">
                  {[...new Set(members.map(m => m.department))].length}
                </div>
                <div className="text-syria-green-600 text-xs md:text-sm">أقسام</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <Card className="border-syria-green-200 shadow-md">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="ابحث عن عضو..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 text-right border-syria-green-200 focus:border-syria-green-400"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 border border-syria-green-200 rounded-md bg-white text-syria-green-700 focus:border-syria-green-400 focus:ring-syria-green-400 text-right"
                >
                  <option value="all">جميع الأدوار</option>
                  {roles.slice(1).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>

                {/* Department Filter */}
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-syria-green-200 rounded-md bg-white text-syria-green-700 focus:border-syria-green-400 focus:ring-syria-green-400 text-right"
                >
                  <option value="all">جميع الأقسام</option>
                  {departments.slice(1).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-16">
          {isLoading ? (
            <div className="flex justify-center py-12 md:py-20">
              <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-syria-green-500" />
            </div>
          ) : (
            <>
              {/* Leadership Section */}
              {leaders.length > 0 && (
                <div className="mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-syria-green-700 text-center mb-6 md:mb-8">
                    الإدارة
                  </h2>
                  <div className={`grid gap-4 md:gap-6 ${leaders.length === 1
                      ? 'grid-cols-1 max-w-sm md:max-w-md mx-auto'
                      : leaders.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl md:max-w-3xl mx-auto'
                        : leaders.length === 4
                          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}>
                    {leaders.map((member, index) => (
                      <Card
                        key={member.id}
                        className="border-syria-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up relative overflow-hidden"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-4 md:p-6">
                          <div className="text-center">
                            {/* Profile Image */}
                            <div className="relative inline-block mb-3 md:mb-4">
                              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-syria-green-100 to-syria-green-200 rounded-full flex items-center justify-center shadow-md">
                                {member.image ? (
                                  <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-2xl md:text-4xl font-bold text-syria-green-600">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                )}
                              </div>
                              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-syria-green-600 text-white px-2 md:px-3 py-1 rounded-full text-xs">
                                {member.role}
                              </div>
                            </div>

                            {/* Member Info */}
                            <h3 className="text-lg md:text-xl font-bold text-syria-green-800 mt-4 md:mt-6 mb-2">{member.name}</h3>

                            {member.major && (
                              <div className="flex items-center justify-center text-gray-600 text-sm mb-2">
                                <GraduationCap className="h-4 w-4 ml-1 text-syria-green-500" />
                                {member.major}
                              </div>
                            )}

                            {member.year && (
                              <div className="text-syria-green-600 text-sm mb-4">
                                {member.year}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Members Section */}
              {regularMembers.length > 0 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-syria-green-700 text-center mb-6 md:mb-8">
                    الأعضاء
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {displayedMembers.map((member, index) => (
                      <Card
                        key={member.id}
                        className="border-syria-green-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-start gap-3 md:gap-4">
                            {/* Profile Image */}
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-syria-green-100 to-syria-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                              {member.image ? (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-lg md:text-2xl font-bold text-syria-green-600">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              )}
                            </div>

                            {/* Member Info */}
                            <div className="flex-1 text-right">
                              <h3 className="text-base md:text-lg font-bold text-syria-green-800 mb-1">{member.name}</h3>
                              <p className="text-syria-green-600 text-xs md:text-sm font-medium mb-2">{member.role}</p>

                              {member.major && (
                                <div className="flex items-center justify-end text-gray-600 text-xs md:text-sm mb-1">
                                  <GraduationCap className="h-3 w-3 md:h-4 md:w-4 mr-1 text-syria-green-500" />
                                  <span>{member.major}</span>
                                </div>
                              )}

                              {member.year && (
                                <p className="text-gray-500 text-xs md:text-sm">{member.year}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Show More Button */}
                  {regularMembers.length > 11 && (
                    <div className="text-center mt-6 md:mt-8">
                      <Button
                        onClick={() => setShowMore(!showMore)}
                        className="bg-syria-green-500 hover:bg-syria-green-600 text-white px-6 md:px-8 text-sm md:text-base"
                      >
                        {showMore ? 'عرض أقل' : `عرض المزيد (${regularMembers.length - 6} عضو آخر)`}
                        <ChevronDown className={`h-3 w-3 md:h-4 md:w-4 mr-2 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* No Results */}
              {filteredMembers.length === 0 && (
                <Card className="border-syria-green-200 bg-syria-green-50">
                  <CardContent className="py-8 md:py-12 text-center">
                    <Users className="mx-auto h-10 w-10 md:h-12 md:w-12 text-syria-green-400 mb-3 md:mb-4" />
                    <p className="text-syria-green-600 text-base md:text-lg">لا توجد نتائج تطابق بحثك</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Members;