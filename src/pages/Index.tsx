
import { useState, useEffect } from 'react';
import { Play, Download, Calendar, BookOpen, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  image_url?: string;
  is_active: boolean;
}

const Index = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching testimonials:', error);
    } else {
      setTestimonials(data || []);
    }
  };

  // Fallback testimonials if none are found in the database
  const fallbackTestimonials = [
    {
      quote: "Kweku's teaching style made complex calculus concepts so much easier to understand. I improved from a C to an A* in A-Level Maths!",
      name: "Sarah M.",
      grade: "A-Level Student"
    },
    {
      quote: "The video lessons are incredibly clear and the past papers helped me prepare perfectly for my IGCSE exams.",
      name: "James K.",
      grade: "IGCSE Student"
    },
    {
      quote: "Additional Maths was my biggest challenge, but Kweku's step-by-step approach made it click. Highly recommended!",
      name: "Ama T.",
      grade: "Additional Maths Student"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const subjects = [
    { name: "IGCSE Mathematics", icon: "📊", description: "Core and Extended Mathematics" },
    { name: "A-Level Pure Maths", icon: "🔢", description: "AS & A2 Pure Mathematics" },
    { name: "A-Level Statistics", icon: "📈", description: "S1 & S2 Statistics" },
    { name: "A-Level Mechanics", icon: "⚙️", description: "M1 & M2 Mechanics" },
    { name: "Additional Mathematics", icon: "🧮", description: "Advanced problem solving" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-kweku-lightBg to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-12 items-center">
            <div className="animate-fade-in text-center">
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-kweku-blue mb-6">
                Master Mathematics with
                <span className="text-kweku-orange"> Expert Guidance</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                Professional tutoring for IGCSE, A-Level, and Additional Mathematics. 
                Get personalized lessons, comprehensive resources, and achieve your academic goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-kweku-blue hover:bg-kweku-blue/90">
                  <Link to="/video-lessons">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Video Lessons
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-kweku-orange text-kweku-orange hover:bg-kweku-orange hover:text-white">
                  <Link to="/past-papers">
                    <Download className="mr-2 h-5 w-5" />
                    Download Past Papers
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Buttons */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-kweku-orange">
              <CardContent className="p-8 text-center">
                <div className="bg-kweku-blue text-white p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Download size={32} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-4 text-kweku-blue">Download Past Papers</h3>
                <p className="text-gray-600 mb-6">Access comprehensive collection of past papers with mark schemes for all subjects.</p>
                <Button asChild className="bg-kweku-blue hover:bg-kweku-blue/90">
                  <Link to="/past-papers">Browse Papers</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-kweku-orange">
              <CardContent className="p-8 text-center">
                <div className="bg-kweku-orange text-white p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Play size={32} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-4 text-kweku-blue">Watch Video Lessons</h3>
                <p className="text-gray-600 mb-6">Step-by-step video tutorials covering all topics with detailed explanations.</p>
                <Button asChild className="bg-kweku-orange hover:bg-kweku-orange/90">
                  <Link to="/video-lessons">Watch Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-kweku-orange">
              <CardContent className="p-8 text-center">
                <div className="bg-green-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Calendar size={32} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-4 text-kweku-blue">Book a Session</h3>
                <p className="text-gray-600 mb-6">Schedule personalized one-on-one tutoring sessions tailored to your needs.</p>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/book-session">Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 bg-kweku-lightBg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-kweku-blue mb-4">
              Subjects We Cover
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Comprehensive mathematics education across all major examination boards and levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{subject.icon}</div>
                  <h3 className="font-semibold text-lg text-kweku-blue mb-2">{subject.name}</h3>
                  <p className="text-gray-600">{subject.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-kweku-blue mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-700">
              Success stories from our mathematics students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <Card key={testimonial.id || index} className="hover:shadow-lg transition-shadow duration-300 relative">
                <CardContent className="p-8">
                  <Quote className="text-kweku-orange mb-4" size={32} />
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="bg-kweku-blue text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-kweku-blue">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">
                        {testimonial.id ? 'Student' : (testimonial as any).grade}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
