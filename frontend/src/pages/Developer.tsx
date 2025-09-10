import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Github, Linkedin, Mail, Globe, Code, Heart,
  ExternalLink, MessageCircle, Instagram, Languages
} from 'lucide-react';
import { useState } from 'react';

const Developer = () => {
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);

  // رابط الصورة
  const developerImage = "/images/Developer.jpg";

  // النصوص باللغتين
  const content = {
    ar: {
      title: "مطور الصفحة",
      subtitle: "الشخص الذي عمل على إنشاء هذا الموقع لخدمة الجالية السورية",
      name: "محمد نور دملخي",
      job: "مطور ويب ومصمم واجهات المستخدم",
      quote: "هدفي خدمة مجتمعنا السوري في جامعة أيدن من خلال التكنولوجيا",
      aboutTitle: "عن المطور",
      bioTitle: "نبذة عني",
      bio: "أنا محمد نور دملخي، مطور ويب شغوف بإنشاء تطبيقات ويب حديثة وسريعة. أسعى دائماً لاستخدام التكنولوجيا في خدمة المجتمع وتسهيل حياة الناس. هذا الموقع هو أحد المشاريع التي قمت بتطويرها بدافع حبي لمساعدة المجتمع السوري في جامعة أيدن.",
      skillsTitle: "المهارات التقنية",
      projectsTitle: "الإبداعات والمشاريع",
      projects: [
        "منصة إدارة المهام - تطبيق ويب متكامل",
        "تطبيق متجر إلكتروني - مع دفع إلكتروني",
        "نظام حجوزات - للمطاعم والخدمات"
      ],
      contactTitle: "التواصل",
      thanksTitle: "شكراً لزيارتك!",
      thanksMessage: "هذا الموقع هو لكم ومن أجلكم. نجاحه يعتمد على مشاركتكم واقتراحاتكم. أتمنى أن يكون الموقع قد نال إعجابك. لا تتردد في التواصل معي لأي استفسارات أو مقترحات",
      contactButton: "تواصل معي",
      hideButton: "إخفاء وسائل التواصل",
      contactMethodsTitle: "وسائل التواصل",
      chooseContact: "اختر الوسيلة المناسبة لك للتواصل معي",
      availability: "أنا دائماً متاح للرد على استفساراتكم خلال 24 ساعة",
      contactOptions: [
        { name: "البريد الإلكتروني", color: "bg-red-100 text-red-600 hover:bg-red-200" },
        { name: "واتساب", color: "bg-green-100 text-green-600 hover:bg-green-200" },
        { name: "إنستغرام", color: "bg-pink-100 text-pink-600 hover:bg-pink-200" },
        { name: "لينكدإن", color: "bg-blue-100 text-blue-600 hover:bg-blue-200" }
      ]
    },
    en: {
      title: "Page Developer",
      subtitle: "The person who created this website to serve the Syrian community",
      name: "Mohammed Nour Damlakhi",
      job: "Web Developer & UI Designer",
      quote: "My goal is to serve our Syrian community in Aydın through technology",
      aboutTitle: "About the Developer",
      bioTitle: "About Me",
      bio: "I am Mohammed Nour Damlaki, a web developer passionate about creating modern and fast web applications. I always strive to use technology to serve the community and make people's lives easier. This website is one of the projects I developed out of my love for helping the Syrian community in Aydın.",
      skillsTitle: "Technical Skills",
      projectsTitle: "Creations & Projects",
      projects: [
        "Task Management Platform - Complete Web Application",
        "E-commerce Application - With Electronic Payment",
        "Reservation System - For Restaurants and Services"
      ],
      contactTitle: "Contact",
      thanksTitle: "Thank You for Visiting!",
      thanksMessage: "This website is for you and because of you. Its success depends on your participation and suggestions. I hope you liked the website. Feel free to contact me for any inquiries or suggestions.",
      contactButton: "Contact Me",
      hideButton: "Hide Contact Methods",
      contactMethodsTitle: "Contact Methods",
      chooseContact: "Choose the appropriate method to contact me",
      availability: "I am always available to respond to your inquiries within 24 hours",
      contactOptions: [
        { name: "Email", color: "bg-red-100 text-red-600 hover:bg-red-200" },
        { name: "WhatsApp", color: "bg-green-100 text-green-600 hover:bg-green-200" },
        { name: "Instagram", color: "bg-pink-100 text-pink-600 hover:bg-pink-200" },
        { name: "LinkedIn", color: "bg-blue-100 text-blue-600 hover:bg-blue-200" }
      ]
    }
  };

  const currentContent = isEnglish ? content.en : content.ar;
  const textDirection = isEnglish ? 'ltr' : 'rtl';

  const contactOptions = [
    {
      id: 1,
      name: currentContent.contactOptions[0].name,
      icon: Mail,
      link: "mailto:nordam312@gmail.com",
      color: currentContent.contactOptions[0].color
    },
    {
      id: 2,
      name: currentContent.contactOptions[1].name,
      icon: MessageCircle,
      link: "https://wa.me/905388647079",
      color: currentContent.contactOptions[1].color
    },
    {
      id: 3,
      name: currentContent.contactOptions[2].name,
      icon: Instagram,
      link: "https://instagram.com/mohammeddamlaki",
      color: currentContent.contactOptions[2].color
    },
    {
      id: 4,
      name: currentContent.contactOptions[3].name,
      icon: Linkedin,
      link: "https://www.linkedin.com/in/muhammednur-damlahi-59044b382/",
      color: currentContent.contactOptions[3].color
    }
  ];

  return (
    <Layout>
      <div className="animate-page-enter min-h-screen bg-gray-50" dir={textDirection}>
        {/* زر تبديل اللغة */}
        <div className="animate-scale-in stagger-delay-1 fixed top-20 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white shadow-md hover:bg-syria-green-50 hover-glow transition-all duration-300"
            onClick={() => setIsEnglish(!isEnglish)}
          >
            <Languages className="h-4 w-4 ml-1" />
            {isEnglish ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* الهيدر */}
        <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="animate-slide-up stagger-delay-2 text-4xl font-bold mb-4">{currentContent.title}</h1>
            <p className="animate-slide-up stagger-delay-3 text-xl">{currentContent.subtitle}</p>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* الصورة والمعلومات الأساسية */}
            <div className="lg:col-span-1">
              <Card className="animate-slide-in-left stagger-delay-4 text-center border-syria-green-200 shadow-md hover:shadow-lg hover-glow transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="animate-rotate-in stagger-delay-5 w-48 h-48 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src={developerImage}
                      alt={currentContent.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-r from-syria-green-300 to-syria-green-400 flex items-center justify-center text-white text-6xl font-bold">
                      {isEnglish ? 'M' : 'م'}
                    </div>
                  </div>
                  <h2 className="animate-slide-up stagger-delay-6 text-2xl font-bold text-syria-green-700 mb-2">{currentContent.name}</h2>
                  <p className="animate-slide-up stagger-delay-6 text-gray-600 mb-4">{currentContent.job}</p>

                  <div className="animate-scale-in stagger-delay-6 mb-4 p-3 bg-syria-green-50 rounded-lg border border-syria-green-100 hover:bg-syria-green-100 transition-colors duration-300">
                    <p className="text-sm text-syria-green-700">"{currentContent.quote}"</p>
                  </div>

                  <div className="animate-slide-up stagger-delay-6 flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-4 rounded-full border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50 hover:text-syria-green-800 hover-glow transition-all duration-300 transform hover:scale-110"
                      asChild
                    >
                      <a href="https://github.com/nordam312" target="_blank" rel="noopener noreferrer" title="GitHub">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50 hover:text-syria-green-800 hover-glow transition-all duration-300 transform hover:scale-110"
                      asChild
                    >
                      <a href="https://www.linkedin.com/in/muhammednur-damlahi-59044b382/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50 hover:text-syria-green-800 hover-glow transition-all duration-300 transform hover:scale-110"
                      asChild
                    >
                      <a href="mailto:nordam312@gmail.com" title="Email">
                        <Mail className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50 hover:text-syria-green-800 hover-glow transition-all duration-300 transform hover:scale-110"
                      asChild
                    >
                      <a href="https://github.com/nordam312" target="_blank" rel="noopener noreferrer" title="Personal Website">
                        <Globe className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* المعلومات التفصيلية */}
            <div className="lg:col-span-2">
              <Card className="animate-slide-in-right stagger-delay-4 border-syria-green-200 shadow-md hover:shadow-lg hover-glow transition-all duration-300">
                <CardContent className="pt-6">
                  <h3 className="animate-slide-up stagger-delay-5 text-xl font-semibold text-syria-green-700 mb-6" style={{ textAlign: isEnglish ? 'left' : 'right' }}>
                    {currentContent.aboutTitle}
                  </h3>

                  <div className="space-y-6" style={{ textAlign: isEnglish ? 'left' : 'right' }}>
                    <div className="animate-slide-up stagger-delay-5">
                      <h4 className="font-medium text-syria-green-600 mb-2">{currentContent.bioTitle}</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {currentContent.bio}
                      </p>
                    </div>

                    <div className="animate-slide-up stagger-delay-6">
                      <h4 className="font-medium text-syria-green-600 mb-2">{currentContent.skillsTitle}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <span className="animate-scale-in stagger-delay-1 bg-syria-green-100 text-syria-green-700 px-3 py-1 rounded-full text-sm text-center border border-syria-green-200 hover:bg-syria-green-200 hover:scale-105 transition-all duration-300 cursor-default">React & Next.js</span>
                        <span className="animate-scale-in stagger-delay-2 bg-syria-green-100 text-syria-green-700 px-3 py-1 rounded-full text-sm text-center border border-syria-green-200 hover:bg-syria-green-200 hover:scale-105 transition-all duration-300 cursor-default">TypeScript</span>
                        <span className="animate-scale-in stagger-delay-3 bg-syria-green-100 text-syria-green-700 px-3 py-1 rounded-full text-sm text-center border border-syria-green-200 hover:bg-syria-green-200 hover:scale-105 transition-all duration-300 cursor-default">Tailwind CSS</span>
                        <span className="animate-scale-in stagger-delay-4 bg-syria-green-100 text-syria-green-700 px-3 py-1 rounded-full text-sm text-center border border-syria-green-200 hover:bg-syria-green-200 hover:scale-105 transition-all duration-300 cursor-default">Laravel</span>
                        <span className="animate-scale-in stagger-delay-5 bg-syria-green-100 text-syria-green-700 px-3 py-1 rounded-full text-sm text-center border border-syria-green-200 hover:bg-syria-green-200 hover:scale-105 transition-all duration-300 cursor-default">PHP</span>
                        <span className="animate-scale-in stagger-delay-6 bg-syria-green-100 text-syria-green-700 px-3 py-1 rounded-full text-sm text-center border border-syria-green-200 hover:bg-syria-green-200 hover:scale-105 transition-all duration-300 cursor-default">MySQL</span>
                      </div>
                    </div>

                    <div className="animate-slide-up stagger-delay-6">
                      <h4 className="font-medium text-syria-green-600 mb-2" style={{ textAlign: isEnglish ? 'left' : 'right' }}>
                        {currentContent.projectsTitle}
                      </h4>
                      <div className="space-y-3">
                        {currentContent.projects.map((project, index) => (
                          <div key={index} className={`animate-slide-in-left stagger-delay-${index + 1} flex items-center justify-start text-gray-700 hover:text-syria-green-700 transition-colors duration-300 p-2 rounded-lg hover:bg-syria-green-50`}>
                            {isEnglish ? (
                              <>
                                <Code className="h-5 w-5 text-syria-green-500 mr-2" />
                                <span>{project}</span>
                              </>
                            ) : (
                              <>
                                <Code className="h-5 w-5 text-syria-green-500 ml-2" />
                                <span>{project}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-syria-green-600 mb-2">{currentContent.contactTitle}</h4>
                      <div className="space-y-2">
                        <div className={`flex items-center justify-start text-gray-700`}>
                          {isEnglish ? (
                            <>
                              <Mail className="h-4 w-4 text-syria-green-500 mr-2" />
                              <span className="text-gray-700">nordam312@gmail.com</span>
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4 text-syria-green-500 ml-2" />
                              <span className="text-gray-700">nordam312@gmail.com</span>
                            </>
                          )}
                        </div>
                        <div className={`flex items-center justify-start text-gray-700`}>
                          {isEnglish ? (
                            <>
                              <Github className="h-4 w-4 text-syria-green-500 mr-2" />
                              <span className="text-gray-700">github.com/nordam312</span>
                            </>
                          ) : (
                            <>
                              <Github className="h-4 w-4 text-syria-green-500 ml-2" />
                              <span className="text-gray-700">github.com/nordam312</span>
                            </>
                          )}
                        </div>
                        <div className={`flex items-center justify-start} text-gray-700`}>
                          {isEnglish ? (
                            <>
                              <Linkedin className="h-4 w-4 text-syria-green-500 mr-2" />
                              <span className="text-gray-700">linkedin.com/in/muhammednur-damlahi</span>
                            </>
                          ) : (
                            <>
                                <Linkedin className="h-4 w-4 text-syria-green-500 ml-2" />
                              <span className="text-gray-700">linkedin.com/in/muhammednur-damlahi</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* رسالة شكر */}
          <Card className="animate-slide-up stagger-delay-6 mt-8 border-syria-green-200 bg-gradient-to-br from-syria-green-50 to-syria-green-100 hover:shadow-lg hover-glow transition-all duration-300">
            <CardContent className="pt-8 text-center">
              <Heart className="animate-rotate-in stagger-delay-1 h-12 w-12 text-syria-green-600 mx-auto mb-4" />
              <h3 className="animate-slide-up stagger-delay-2 text-2xl font-semibold text-syria-green-700 mb-3">{currentContent.thanksTitle}</h3>
              <p className="animate-slide-up stagger-delay-3 text-gray-700 mb-6 text-lg">
                {currentContent.thanksMessage}
              </p>

              {/* زر التواصل الرئيسي */}
              <div className="animate-scale-in stagger-delay-4 relative inline-block">
                <Button
                  className="bg-gradient-to-r from-syria-green-500 to-syria-green-600 hover:from-syria-green-600 hover:to-syria-green-700 text-white shadow-md px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 text-lg mb-4 transform"
                  onClick={() => setShowContactOptions(!showContactOptions)}
                >
                  <Mail className="ml-2 h-5 w-5" />
                  {showContactOptions ? currentContent.hideButton : currentContent.contactButton}
                </Button>
              </div>

              {/* مواقع التواصل تظهر بشكل كبير عند الضغط على الزر */}
              {showContactOptions && (
                <div className="animate-scale-in mt-6 p-6 bg-white rounded-2xl shadow-lg border border-syria-green-200 hover-glow">
                  <h4 className="animate-slide-up stagger-delay-1 text-xl font-semibold text-syria-green-700 mb-6">{currentContent.contactMethodsTitle}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactOptions.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <a
                          key={option.id}
                          href={option.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`animate-slide-in-left stagger-delay-${index + 2} flex items-center justify-between p-5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:-translate-y-1 ${option.color} border border-syria-green-100`}
                        >
                          <div className="flex items-center">
                            <Icon className="h-8 w-8 ml-3" />
                            <span className="text-lg font-medium">{option.name}</span>
                          </div>
                          <ExternalLink className="h-5 w-5 text-syria-green-600" />
                        </a>
                      );
                    })}
                  </div>

                  <p className="animate-slide-up stagger-delay-6 text-syria-green-600 text-sm mt-6 text-center">
                    {currentContent.chooseContact}
                  </p>
                </div>
              )}

              <p className="animate-slide-up stagger-delay-5 text-syria-green-500 text-sm mt-6">
                {currentContent.availability}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Developer;