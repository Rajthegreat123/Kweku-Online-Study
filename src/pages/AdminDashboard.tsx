
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Video, 
  BookOpen, 
  Download, 
  MessageSquare, 
  Users, 
  LogOut, 
  BarChart3,
  Home,
  Eye,
  Settings,
  Menu,
  X
} from 'lucide-react';
import PastPapersManager from '@/components/admin/PastPapersManager';
import VideoLessonsManager from '@/components/admin/VideoLessonsManager';
import BlogManager from '@/components/admin/BlogManager';
import ResourcesManager from '@/components/admin/ResourcesManager';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import ContactMessagesManager from '@/components/admin/ContactMessagesManager';

const AdminDashboard = () => {
  const { isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalPapers: 0,
    totalResources: 0,
    totalBlogs: 0,
    totalTestimonials: 0,
    totalMessages: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
      return;
    }

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, loading, navigate]);

  const fetchStats = async () => {
    const [videosResult, papersResult, resourcesResult, blogsResult, testimonialsResult, messagesResult] = await Promise.all([
      supabase.from('video_lessons').select('id', { count: 'exact' }),
      supabase.from('past_papers').select('id', { count: 'exact' }),
      supabase.from('resources').select('id', { count: 'exact' }),
      supabase.from('blog_posts').select('id', { count: 'exact' }),
      supabase.from('testimonials').select('id', { count: 'exact' }),
      supabase.from('contact_messages').select('id, is_read', { count: 'exact' })
    ]);

    const unreadCount = messagesResult.data?.filter(msg => !msg.is_read).length || 0;

    setStats({
      totalVideos: videosResult.count || 0,
      totalPapers: papersResult.count || 0,
      totalResources: resourcesResult.count || 0,
      totalBlogs: blogsResult.count || 0,
      totalTestimonials: testimonialsResult.count || 0,
      totalMessages: messagesResult.count || 0,
      unreadMessages: unreadCount
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kweku-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'papers', name: 'Past Papers', icon: FileText },
    { id: 'videos', name: 'Video Lessons', icon: Video },
    { id: 'resources', name: 'Resources', icon: Download },
    { id: 'blog', name: 'Blog Posts', icon: BookOpen },
    { id: 'testimonials', name: 'Testimonials', icon: Users },
    { id: 'messages', name: 'Messages', icon: MessageSquare, badge: stats.unreadMessages },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-kweku-blue mb-4">Dashboard Overview</h2>
              <p className="text-gray-600 mb-6">Welcome to Kweku Online Study Admin Panel. Manage your educational content and monitor website activity.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Video Lessons</CardTitle>
                  <Video className="h-5 w-5 text-kweku-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-kweku-blue">{stats.totalVideos}</div>
                  <p className="text-xs text-gray-500 mt-1">Published lessons</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Past Papers</CardTitle>
                  <FileText className="h-5 w-5 text-kweku-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-kweku-blue">{stats.totalPapers}</div>
                  <p className="text-xs text-gray-500 mt-1">Available papers</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Resources</CardTitle>
                  <Download className="h-5 w-5 text-kweku-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-kweku-blue">{stats.totalResources}</div>
                  <p className="text-xs text-gray-500 mt-1">Study materials</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Blog Posts</CardTitle>
                  <BookOpen className="h-5 w-5 text-kweku-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-kweku-blue">{stats.totalBlogs}</div>
                  <p className="text-xs text-gray-500 mt-1">Published posts</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Testimonials</CardTitle>
                  <Users className="h-5 w-5 text-kweku-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-kweku-blue">{stats.totalTestimonials}</div>
                  <p className="text-xs text-gray-500 mt-1">Student reviews</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Messages</CardTitle>
                  <MessageSquare className="h-5 w-5 text-kweku-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-kweku-blue">{stats.totalMessages}</div>
                  <p className="text-xs text-gray-500 mt-1">Contact inquiries</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Unread Messages</CardTitle>
                  <MessageSquare className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{stats.unreadMessages}</div>
                  <p className="text-xs text-red-500 mt-1">Needs attention</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-kweku-blue to-kweku-blue/80 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Live Website</CardTitle>
                  <Eye className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <Link to="/" target="_blank" className="block">
                    <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Site
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-kweku-blue">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => setActiveTab('videos')} className="bg-kweku-blue hover:bg-kweku-blue/90">
                    <Video className="h-4 w-4 mr-2" />
                    Add Video Lesson
                  </Button>
                  <Button onClick={() => setActiveTab('papers')} className="bg-kweku-orange hover:bg-kweku-orange/90">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Past Paper
                  </Button>
                  <Button onClick={() => setActiveTab('blog')} variant="outline" className="border-kweku-blue text-kweku-blue hover:bg-kweku-blue hover:text-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Write Blog Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'papers':
        return <PastPapersManager onUpdate={fetchStats} />;
      case 'videos':
        return <VideoLessonsManager onUpdate={fetchStats} />;
      case 'blog':
        return <BlogManager />;
      case 'resources':
        return <ResourcesManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'messages':
        return <ContactMessagesManager onUpdate={fetchStats} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`${sidebarOpen ? 'block' : 'hidden'} font-heading font-bold text-kweku-blue`}>
              <div className="text-lg">Kweku Online Study</div>
              <div className="text-xs text-kweku-orange">Admin Panel</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-kweku-blue"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-kweku-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-kweku-blue'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="ml-3 flex-1 text-left">{item.name}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className={`${sidebarOpen ? 'w-full' : 'w-8 h-8 p-0'} border-red-200 text-red-600 hover:bg-red-50`}
          >
            <LogOut size={16} />
            {sidebarOpen && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-kweku-blue">
                {sidebarItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">Manage your educational content</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" target="_blank">
                <Button variant="outline" size="sm" className="border-kweku-blue text-kweku-blue hover:bg-kweku-blue hover:text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Website
                </Button>
              </Link>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Welcome back, Admin</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
