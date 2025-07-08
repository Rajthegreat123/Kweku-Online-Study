
import { MessageCircle, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const BookSession = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/233247219711', '_blank');
  };

  const benefits = [
    'Personalized learning approach',
    'Flexible scheduling',
    'One-on-one attention',
    'Customized study materials',
    'Regular progress assessments',
    'Exam preparation strategies'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-kweku-blue mb-4">
              Book Your Tutoring Session
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized mathematics tutoring tailored to your learning needs and goals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Options */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-kweku-blue">Quick Booking via WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Get instant response and schedule your session immediately through WhatsApp.
                  </p>
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Book via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Benefits & Information */}
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-kweku-blue">Why Choose Personal Tutoring?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="text-green-600 mr-3 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-kweku-blue">Session Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="text-kweku-orange mr-3" size={20} />
                    <div>
                      <p className="font-medium">Session Duration</p>
                      <p className="text-sm text-gray-600">60-90 minutes per session</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="text-kweku-orange mr-3" size={20} />
                    <div>
                      <p className="font-medium">Flexible Scheduling</p>
                      <p className="text-sm text-gray-600">Weekdays & weekends available</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="text-kweku-orange mr-3" size={20} />
                    <div>
                      <p className="font-medium">Format Options</p>
                      <p className="text-sm text-gray-600">Online or in-person sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-kweku-blue">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-700">
                      <MessageCircle className="mr-2 text-kweku-orange" size={16} />
                      WhatsApp: +233 24 721 9711
                    </p>
                    <p className="text-sm text-gray-600">
                      Response time: Usually within 1-2 hours during business hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookSession;
