
import { CardContent, Card } from "@/components/ui/card";
import { UsersRound, CalendarRange, Image, Settings } from "lucide-react";

const roles = [
  {
    title: 'General Administration',
    description: 'Overseeing all community operations and strategic direction',
    icon: <Settings className="h-10 w-10 text-syria-green-500" />
  },
  {
    title: 'Social Media Managers',
    description: 'Managing our online presence and community engagement',
    icon: <UsersRound className="h-10 w-10 text-syria-green-500" />
  },
  {
    title: 'Event Organizers',
    description: 'Planning and executing community gatherings and activities',
    icon: <CalendarRange className="h-10 w-10 text-syria-green-500" />
  },
  {
    title: 'Programming/Technical Team',
    description: 'Maintaining our digital infrastructure and technical projects',
    icon: <Image className="h-10 w-10 text-syria-green-500" />
  }
];

const CommunityRoles = () => {
  return (
    <section className="section bg-gray-50">
      <div className="page-container">
        <h2 className="section-title text-center mb-12">Community Roles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <Card key={index} className="border border-syria-green-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="mb-4">{role.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-syria-green-700">{role.title}</h3>
                <p className="text-gray-600">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityRoles;
