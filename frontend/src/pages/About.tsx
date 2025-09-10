import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users, Target, Heart, BookOpen, GraduationCap, Globe,
  Mail, Languages, MessageCircle, Instagram, Facebook, ExternalLink
} from 'lucide-react';
import { useState } from 'react';

const About = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);

  // النصوص باللغتين
  const content = {
    ar: {
      heroTitle: "من نحن",
      heroSubtitle: "مجتمع متماسك من الطلاب والعائلات السورية في أيدن، نعمل معًا لبناء مستقبل أفضل",
      aboutTitle: "من نحن",
      aboutContent1: "نحن مجتمع من الطلاب والعائلات السورية المقيمين في مدينة أيدن التركية. تأسست مجموعتنا بهدف بناء جسور التواصل بين أفراد الجالية السورية وتقديم الدعم المتبادل.",
      aboutContent2: "نعمل على تنظيم الفعاليات والأنشطة الثقافية والاجتماعية والتعليمية التي تساهم في تعزيز الروابط بين أفراد المجتمع والحفاظ على الهوية الثقافية مع الاندماج الإيجابي في المجتمع المضيف.",
      aboutContent3: "يشرف على المجموعة فريق من المتطوعين الملتزمين بخدمة المجتمع وتلبية احتياجاته المختلفة.",
      goalsTitle: "إلى ماذا نسعى",
      goalsContent: "نسعى إلى بناء مجتمع سوري متماسك في أيدن، يدعم أفراده بعضهم البعض ويسهم في تقديم صورة إيجابية عن السوريين.",
      goalsSubtitle: "من أهدافنا الأساسية:",
      goal1: "تقديم الدعم للطلاب الجدد والمساعدة في تسهيل اندماجهم في الحياة الجامعية والمجتمعية",
      goal2: "تنظيم أنشطة ثقافية واجتماعية تعزز الروابط بين أفراد المجتمع",
      goal3: "تقديم المشورة والمساعدة في المسائل التعليمية والحياتية",
      goal4: "إنشاء منصة للتواصل وتبادل الخبرات والموارد",
      goal5: "التعاون مع المؤسسات التركية المحلية والمنظمات المجتمعية الأخرى",
      featuresTitle: "ميزات المجتمع",
      feature1Title: "مجتمع متماسك",
      feature1Desc: "نعمل على توحيد الجالية السورية في أيدن",
      feature2Title: "دعم الطلاب",
      feature2Desc: "نساعد الطلاب الجدد على الاندماج الأكاديمي والاجتماعي",
      feature3Title: "أنشطة مجتمعية",
      feature3Desc: "ننظم فعاليات ثقافية وترفيهية وتعليمية",
      joinTitle: "انضم إلى مجتمعنا",
      joinContent: "سواء كنت طالباً أو عائلة مقيمة في أيدن، نحن هنا لندعمك ونساعدك على الاندماج في المجتمع",
      contactButton: "تواصل معنا",
      hideButton: "إخفاء وسائل التواصل",
      contactMethodsTitle: "وسائل التواصل",
      chooseContact: "اختر الوسيلة المناسبة لك للتواصل معنا",
      availability: "نحن دائماً متاحون للرد على استفساراتكم خلال 24 ساعة",
      thanksTitle: "شكراً لزيارتكم!",
      thanksMessage: "هذا الموقع هو لكم ومن أجلكم. نجاحه يعتمد على مشاركتكم واقتراحاتكم. نتمنى أن يكون الموقع قد نال إعجابكم. لا تترددوا في التواصل معنا لأي استفسارات أو مقترحات",
      contactOptions: [
        { name: "البريد الإلكتروني", color: "bg-red-100 text-red-600 hover:bg-red-200" },
        { name: "واتساب", color: "bg-green-100 text-green-600 hover:bg-green-200" },
        { name: "إنستغرام", color: "bg-pink-100 text-pink-600 hover:bg-pink-200" },
        { name: "فيسبوك", color: "bg-blue-100 text-blue-600 hover:bg-blue-200" }
      ]
    },
    en: {
      heroTitle: "About Us",
      heroSubtitle: "A cohesive community of Syrian students and families in Aydın, working together to build a better future",
      aboutTitle: "Who We Are",
      aboutContent1: "We are a community of Syrian students and families residing in the Turkish city of Aydın. Our group was established with the aim of building bridges of communication between members of the Syrian community and providing mutual support.",
      aboutContent2: "We work to organize cultural, social, and educational events and activities that contribute to strengthening bonds between community members and preserving cultural identity while positively integrating into the host society.",
      aboutContent3: "The group is supervised by a team of volunteers committed to serving the community and meeting its various needs.",
      goalsTitle: "Our Goals",
      goalsContent: "We seek to build a cohesive Syrian community in Aydın, whose members support each other and contribute to presenting a positive image of Syrians.",
      goalsSubtitle: "Our main objectives:",
      goal1: "Providing support to new students and helping facilitate their integration into university and community life",
      goal2: "Organizing cultural and social activities that strengthen bonds between community members",
      goal3: "Providing advice and assistance in educational and life matters",
      goal4: "Creating a platform for communication and exchange of experiences and resources",
      goal5: "Cooperating with local Turkish institutions and other community organizations",
      featuresTitle: "Community Features",
      feature1Title: "Cohesive Community",
      feature1Desc: "We work to unite the Syrian community in Aydın",
      feature2Title: "Student Support",
      feature2Desc: "We help new students with academic and social integration",
      feature3Title: "Community Activities",
      feature3Desc: "We organize cultural, entertainment, and educational events",
      joinTitle: "Join Our Community",
      joinContent: "Whether you are a student or a family residing in Aydın, we are here to support you and help you integrate into the community",
      contactButton: "Contact Us",
      hideButton: "Hide Contact Methods",
      contactMethodsTitle: "Contact Methods",
      chooseContact: "Choose the appropriate method to contact us",
      availability: "We are always available to respond to your inquiries within 24 hours",
      thanksTitle: "Thank You for Visiting!",
      thanksMessage: "This website is for you and because of you. Its success depends on your participation and suggestions. We hope you liked the website. Feel free to contact us for any inquiries or suggestions.",
      contactOptions: [
        { name: "Email", color: "bg-red-100 text-red-600 hover:bg-red-200" },
        { name: "WhatsApp", color: "bg-green-100 text-green-600 hover:bg-green-200" },
        { name: "Instagram", color: "bg-pink-100 text-pink-600 hover:bg-pink-200" },
        { name: "Facebook", color: "bg-blue-100 text-blue-600 hover:bg-blue-200" }
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
      link: "mailto:syrian.community.aydin@example.com",
      color: currentContent.contactOptions[0].color
    },
    {
      id: 2,
      name: currentContent.contactOptions[1].name,
      icon: MessageCircle,
      link: "https://wa.me/905551234567",
      color: currentContent.contactOptions[1].color
    },
    {
      id: 3,
      name: currentContent.contactOptions[2].name,
      icon: Instagram,
      link: "https://instagram.com/syriancommunityaydin",
      color: currentContent.contactOptions[2].color
    },
    {
      id: 4,
      name: currentContent.contactOptions[3].name,
      icon: Facebook,
      link: "https://facebook.com/syriancommunityaydin",
      color: currentContent.contactOptions[3].color
    }
  ];

  return (
    <Layout>
      <div className="animate-page-enter bg-gray-50 min-h-screen" dir={textDirection}>
        {/* زر تبديل اللغة */}
        <div className="fixed top-20 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white shadow-md"
            onClick={() => setIsEnglish(!isEnglish)}
          >
            <Languages className="h-4 w-4 ml-1" />
            {isEnglish ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* الهيرو */}
        <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{currentContent.heroTitle}</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              {currentContent.heroSubtitle}
            </p>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
            <Card className="border-syria-green-100 shadow-sm">
              <CardContent className="pt-6">
                <div className={`flex items-center gap-3 mb-6 ${isEnglish ? 'flex-row-reverse' : ''}`}>
                  <div className="bg-syria-green-100 p-3 rounded-full">
                    <Users className="h-8 w-8 text-syria-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-syria-green-700">{currentContent.aboutTitle}</h2>
                </div>

                <div className={`space-y-4 ${isEnglish ? 'text-left' : 'text-right'}`}>
                  <p className="text-gray-700 leading-relaxed">
                    {currentContent.aboutContent1}
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    {currentContent.aboutContent2}
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    {currentContent.aboutContent3}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-syria-green-100 shadow-sm">
              <CardContent className="pt-6">
                <div className={`flex items-center gap-3 mb-6 ${isEnglish ? 'flex-row-reverse' : ''}`}>
                  <div className="bg-syria-green-100 p-3 rounded-full">
                    <Target className="h-8 w-8 text-syria-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-syria-green-700">{currentContent.goalsTitle}</h2>
                </div>

                <div className={`space-y-4 ${isEnglish ? 'text-left' : 'text-right'}`}>
                  <p className="text-gray-700 leading-relaxed">
                    {currentContent.goalsContent}
                  </p>

                  <p className="text-syria-green-700 font-semibold pt-2">{currentContent.goalsSubtitle}</p>

                  <ul className="space-y-3 text-gray-700 list-none">
                    <li className={`flex gap-3 items-start ${isEnglish ? 'flex-row-reverse' : ''}`}>
                      <GraduationCap className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>{currentContent.goal1}</span>
                    </li>
                    <li className={`flex gap-3 items-start ${isEnglish ? 'flex-row-reverse' : ''}`}>
                      <Heart className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>{currentContent.goal2}</span>
                    </li>
                    <li className={`flex gap-3 items-start ${isEnglish ? 'flex-row-reverse' : ''}`}>
                      <BookOpen className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>{currentContent.goal3}</span>
                    </li>
                    <li className={`flex gap-3 items-start ${isEnglish ? 'flex-row-reverse' : ''}`}>
                      <Globe className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>{currentContent.goal4}</span>
                    </li>
                    <li className={`flex gap-3 items-start ${isEnglish ? 'flex-row-reverse' : ''}`}>
                      <Users className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>{currentContent.goal5}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ميزات المجتمع */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-syria-green-700 text-center mb-8">
              {currentContent.featuresTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center border-syria-green-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="bg-syria-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-syria-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-syria-green-700 mb-2">{currentContent.feature1Title}</h3>
                  <p className="text-gray-600">{currentContent.feature1Desc}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-syria-green-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="bg-syria-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-syria-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-syria-green-700 mb-2">{currentContent.feature2Title}</h3>
                  <p className="text-gray-600">{currentContent.feature2Desc}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-syria-green-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="bg-syria-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-syria-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-syria-green-700 mb-2">{currentContent.feature3Title}</h3>
                  <p className="text-gray-600">{currentContent.feature3Desc}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* قسم التواصل معنا مشابه لصفحة المطور */}
          <Card className="mt-8 border-syria-green-200 bg-gradient-to-br from-syria-green-50 to-syria-green-100">
            <CardContent className="pt-8 text-center">
              <Heart className="h-12 w-12 text-syria-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-syria-green-700 mb-3">{currentContent.thanksTitle}</h3>
              <p className="text-gray-700 mb-6 text-lg">
                {currentContent.thanksMessage}
              </p>

              {/* زر التواصل الرئيسي */}
              <div className="relative inline-block">
                <Button
                  className="bg-gradient-to-r from-syria-green-500 to-syria-green-600 hover:from-syria-green-600 hover:to-syria-green-700 text-white shadow-md px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg text-lg mb-4"
                  onClick={() => setShowContactOptions(!showContactOptions)}
                >
                  <Mail className="ml-2 h-5 w-5" />
                  {showContactOptions ? currentContent.hideButton : currentContent.contactButton}
                </Button>
              </div>

              {/* مواقع التواصل تظهر بشكل كبير عند الضغط على الزر */}
              {showContactOptions && (
                <div className="animate-slide-up-large mt-6 p-6 bg-white rounded-2xl shadow-lg border border-syria-green-200">
                  <h4 className="text-xl font-semibold text-syria-green-700 mb-6">{currentContent.contactMethodsTitle}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <a
                          key={option.id}
                          href={option.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md ${option.color} border border-syria-green-100`}
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

                  <p className="text-syria-green-600 text-sm mt-6 text-center">
                    {currentContent.chooseContact}
                  </p>
                </div>
              )}

              <p className="text-syria-green-500 text-sm mt-6">
                {currentContent.availability}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;