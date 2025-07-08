
import { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const VideoLessons = () => {
  const [videosByUnit, setVideosByUnit] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data: videos, error } = await supabase
      .from('video_lessons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }

    // Group videos by unit
    const grouped = videos?.reduce((acc, video) => {
      const unit = video.unit || 'Other';
      if (!acc[unit]) {
        acc[unit] = [];
      }
      acc[unit].push(video);
      return acc;
    }, {} as Record<string, any[]>) || {};

    setVideosByUnit(grouped);
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const openYouTubeVideo = (url: string) => {
    window.open(url, '_blank');
  };

  const units = Object.keys(videosByUnit);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-kweku-blue mb-4">
              Video Lessons
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch comprehensive video tutorials on our YouTube channel covering all mathematics topics
            </p>
          </div>

          {units.length > 0 ? (
            <Tabs defaultValue={units[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                {units.slice(0, 4).map((unit) => (
                  <TabsTrigger key={unit} value={unit} className="text-xs sm:text-sm">
                    {unit}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {units.map((unit) => (
                <TabsContent key={unit} value={unit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videosByUnit[unit].map((video) => (
                      <Card 
                        key={video.id} 
                        className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => openYouTubeVideo(video.youtube_url)}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={getYouTubeThumbnail(video.youtube_url)}
                              alt={video.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                              <div className="bg-red-600 text-white p-3 rounded-full">
                                <Play size={24} fill="white" />
                              </div>
                            </div>
                            {video.duration && (
                              <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                                {video.duration}
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-kweku-blue mb-2 group-hover:text-kweku-orange transition-colors">
                              {video.title}
                            </h3>
                            {video.description && (
                              <p className="text-gray-600 text-sm mb-3">
                                {video.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{video.topic}</span>
                              <ExternalLink size={16} className="text-gray-400 group-hover:text-kweku-orange transition-colors" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No video lessons available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VideoLessons;
