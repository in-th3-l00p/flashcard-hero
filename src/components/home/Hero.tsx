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
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Master Any Subject with</span>
                <span className="block text-teal-400">Intelligent Flashcards</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Create, study, and master your learning materials with our intelligent flashcard system. 
                Perfect for students, professionals, and lifelong learners.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button
                    size="lg"
                    className="w-full inline-flex items-center justify-center"
                    onClick={() => navigate(currentUser ? '/dashboard' : '/signup')}
                  >
                    {currentUser ? 'Go to Dashboard' : 'Start Learning'} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/collections')}
                  >
                    Explore Collections
                  </Button>
                </div>
              </div>
            </div>
          </main>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-24">
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