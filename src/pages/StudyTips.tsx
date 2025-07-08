
import { useState, useEffect } from 'react';
import { Clock, Target, BookOpen, Lightbulb, TrendingUp, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  tags?: string[];
  category?: string;
  published: boolean;
  published_at?: string;
  read_time?: string;
  created_at: string;
}

const StudyTips = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
    } else {
      setBlogPosts(data || []);
    }
    setLoading(false);
  };

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const quickTips = [
    {
      icon: <Target className="h-6 w-6 text-kweku-orange" />,
      title: 'Set Clear Goals',
      tip: 'Break down large topics into smaller, manageable objectives'
    },
    {
      icon: <Clock className="h-6 w-6 text-kweku-orange" />,
      title: 'Practice Regularly',
      tip: 'Consistent daily practice is more effective than cramming'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-kweku-orange" />,
      title: 'Review Mistakes',
      tip: 'Learn from errors to avoid repeating them in exams'
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-kweku-orange" />,
      title: 'Understand Concepts',
      tip: 'Focus on why formulas work, not just memorizing them'
    }
  ];

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    
    const colors: { [key: string]: string } = {
      'Study Methods': 'bg-blue-100 text-blue-800',
      'Productivity': 'bg-green-100 text-green-800',
      'Problem Solving': 'bg-purple-100 text-purple-800',
      'Subject Focus': 'bg-orange-100 text-orange-800',
      'Exam Preparation': 'bg-red-100 text-red-800',
      'Learning Theory': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kweku-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading study tips...</p>
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
              Study Tips & Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert advice on mathematics learning, exam preparation, and academic success strategies
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {filteredPosts.length > 0 ? (
                <div className="grid gap-6">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category || 'General'}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-4 w-4" />
                            {post.read_time || '5 min read'}
                          </div>
                        </div>
                        
                        <h2 className="font-heading font-bold text-xl text-kweku-blue mb-3 hover:text-kweku-orange cursor-pointer transition-colors">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-4">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.tags?.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'Check back soon for new study tips and articles!'}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Quick Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-kweku-blue flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Quick Study Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quickTips.map((tip, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 mr-3">
                          {tip.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-kweku-blue mb-1">
                            {tip.title}
                          </h4>
                          <p className="text-xs text-gray-600">{tip.tip}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-kweku-blue">Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['A-Level', 'IGCSE', 'Exam Tips', 'Study Tips', 'Add Maths', 'Calculus', 'Problem Solving', 'Time Management'].map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-kweku-orange hover:text-white transition-colors"
                          onClick={() => setSearchTerm(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudyTips;
