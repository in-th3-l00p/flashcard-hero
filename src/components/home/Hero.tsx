import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Sparkles, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';
import { useAuth } from '../../contexts/AuthContext';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white">
      <Container>
        <div className="relative z-10 pb-8 pt-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-4 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block">Master Any Subject with</span>
                <span className="block text-teal-400">Intelligent Flashcards</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-xl md:text-xl lg:mx-0">
                Create, study, and master your learning materials with our intelligent flashcard system. 
                Perfect for students, professionals, and lifelong learners.
              </p>
              <div className="mt-5 flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-x-3 sm:space-y-0 lg:justify-start">
                <Button
                  size="lg"
                  className="w-full inline-flex items-center justify-center sm:w-auto"
                  onClick={() => navigate(currentUser ? '/dashboard' : '/signup')}
                >
                  {currentUser ? 'Go to Dashboard' : 'Start Learning'} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/collections')}
                >
                  Explore Collections
                </Button>
              </div>
            </div>
          </main>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="Smart Learning"
              description="Adaptive learning system that focuses on what you need to review most"
            />
            <FeatureCard
              icon={Target}
              title="Track Progress"
              description="Monitor your learning progress with detailed statistics and insights"
            />
            <FeatureCard
              icon={Sparkles}
              title="Efficient Review"
              description="Optimize your study sessions with spaced repetition techniques"
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => {
  return (
    <div className="rounded-lg border border-teal-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
        <Icon className="h-6 w-6 text-teal-500" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
};