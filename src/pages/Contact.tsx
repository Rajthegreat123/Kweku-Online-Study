
import { useState } from 'react';
import { Mail, MessageCircle, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/233247219711', '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }]);

    setLoading(false);

    if (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } else {
      toast.success('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-kweku-blue mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our tutoring services? Need help with mathematics? 
              We're here to support your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-kweku-blue flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Your Name" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Input 
                        placeholder="Your Email" 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Input 
                      placeholder="Subject" 
                      required 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <Textarea 
                      placeholder="Your Message"
                      rows={6}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button type="submit" className="w-full bg-kweku-blue hover:bg-kweku-blue/90" size="lg" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-kweku-blue">Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Message on WhatsApp
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    Get instant responses for urgent queries
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-kweku-blue">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="text-kweku-orange mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+233 24 721 9711</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MessageCircle className="text-kweku-orange mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-gray-600">+233 24 721 9711</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="text-kweku-orange mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-gray-600">Within 2-4 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="text-kweku-orange mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">Online & In-Person Sessions Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-kweku-blue">Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-gray-600">9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-gray-600">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-gray-600">2:00 PM - 6:00 PM</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-kweku-lightBg rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> Emergency support available 24/7 via WhatsApp for urgent exam preparation queries.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-kweku-blue">Common Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">How quickly do you respond?</p>
                      <p className="text-sm text-gray-600">Usually within 2-4 hours during business hours.</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Do you offer online sessions?</p>
                      <p className="text-sm text-gray-600">Yes, we provide both online and in-person tutoring.</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">What subjects do you cover?</p>
                      <p className="text-sm text-gray-600">IGCSE, A-Level Pure, Statistics, Mechanics, and Additional Mathematics.</p>
                    </div>
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

export default Contact;
