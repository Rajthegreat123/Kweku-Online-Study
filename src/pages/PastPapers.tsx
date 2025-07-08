
import { useState, useEffect } from 'react';
import { Search, Download, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface PastPaper {
  id: string;
  title: string;
  subject: string;
  paper_type: string;
  year: number;
  session: string;
  question_paper_url?: string;
  mark_scheme_url?: string;
}

const PastPapers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('past_papers')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching papers:', error);
    } else {
      setPapers(data || []);
    }
    setLoading(false);
  };

  // Get unique years and subjects from the data
  const years = [...new Set(papers.map(paper => paper.year.toString()))].sort((a, b) => b.localeCompare(a));
  const subjects = [...new Set(papers.map(paper => paper.subject))].sort();

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.paper_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;
    const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;
    
    return matchesSearch && matchesYear && matchesSubject;
  });

  const handleDownload = (url: string | undefined, type: string, paper: PastPaper) => {
    if (url) {
      let correctedUrl = url;
      // Ensure the URL has a protocol, otherwise it's treated as a relative path.
      if (!correctedUrl.startsWith('http://') && !correctedUrl.startsWith('https://')) {
        correctedUrl = `https://${correctedUrl}`;
      }
      window.open(correctedUrl, '_blank');
    } else {
      console.log(`${type} not available for ${paper.title}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kweku-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading past papers...</p>
          </div>
        </div>
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
              Past Papers & Mark Schemes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access comprehensive collection of past examination papers with detailed mark schemes 
              for IGCSE, A-Level, and Additional Mathematics
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-kweku-blue">
                <Filter className="mr-2" size={20} />
                Filter Papers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search papers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
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

                <Button className="bg-kweku-blue hover:bg-kweku-blue/90" disabled>
                  Download Bundle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Papers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-kweku-blue mb-1">
                        {paper.title}
                      </h3>
                      <p className="text-gray-600">{paper.paper_type}</p>
                      <p className="text-sm text-gray-500">
                        {paper.year} • {paper.session}
                      </p>
                    </div>
                    <FileText className="text-kweku-orange" size={24} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => handleDownload(paper.question_paper_url, 'Question Paper', paper)}
                      className="flex-1 bg-kweku-blue hover:bg-kweku-blue/90"
                      size="sm"
                      disabled={!paper.question_paper_url}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Question Paper
                    </Button>
                    <Button
                      onClick={() => handleDownload(paper.mark_scheme_url, 'Mark Scheme', paper)}
                      variant="outline"
                      className="flex-1 border-kweku-orange text-kweku-orange hover:bg-kweku-orange hover:text-white"
                      size="sm"
                      disabled={!paper.mark_scheme_url}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Mark Scheme
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPapers.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new papers.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PastPapers;
