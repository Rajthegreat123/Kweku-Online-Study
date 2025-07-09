
import { useState, useEffect } from 'react';
import { Download, FileText, Calculator, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface Resource {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_size?: string;
  resource_type: string;
  subject?: string;
  downloads: number;
  created_at: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
      return;
    }

    setResources(data || []);
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Formula Sheet':
        return <Calculator className="h-5 w-5" />;
      case 'Summary Notes':
        return <BookOpen className="h-5 w-5" />;
      case 'Worksheet':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Formula Sheet':
        return 'bg-blue-100 text-blue-800';
      case 'Summary Notes':
        return 'bg-green-100 text-green-800';
      case 'Worksheet':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique filter options
  const resourceTypes = [...new Set(resources.map(r => r.resource_type))].sort();
  const subjects = [...new Set(resources.map(r => r.subject).filter((s): s is string => !!s))].sort();

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.resource_type === selectedType;
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    return matchesType && matchesSubject;
  });


  const handleDownload = (resource: Resource) => {
    if (resource.file_url) {
      let url = resource.file_url;
      // Ensure the URL has a protocol, otherwise it's treated as a relative path.
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      window.open(url, '_blank');

      // Increment download count
      supabase
        .from('resources')
        .update({ downloads: (resource.downloads || 0) + 1 })
        .eq('id', resource.id)
        .then(() => {
          fetchResources(); // Refresh to show updated count
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kweku-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading resources...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-kweku-blue mb-4">
              Learning Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Download comprehensive study materials, formula sheets, and practice worksheets 
              to enhance your mathematics learning
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-kweku-blue">
                <Filter className="mr-2" size={20} />
                Filter Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {resourceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getTypeIcon(resource.resource_type)}
                        <Badge className={`ml-2 ${getTypeColor(resource.resource_type)}`}>
                          {resource.resource_type}
                        </Badge>
                      </div>
                      {resource.subject && (
                        <Badge variant="outline">{resource.subject}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-kweku-blue text-lg">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resource.description && (
                      <p className="text-gray-600 mb-4">{resource.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{resource.downloads || 0} downloads</span>
                      {resource.file_size && <span>{resource.file_size}</span>}
                    </div>
                    
                    <Button 
                      onClick={() => handleDownload(resource)}
                      className="w-full bg-kweku-blue hover:bg-kweku-blue/90"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new resources.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
