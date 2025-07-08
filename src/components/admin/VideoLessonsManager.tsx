
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface VideoLesson {
  id: string;
  title: string;
  youtube_url: string;
  topic: string;
  unit: string;
  description?: string;
  notes_url?: string;
  duration?: string;
}

interface VideoLessonsManagerProps {
  onUpdate: () => void;
}

const VideoLessonsManager = ({ onUpdate }: VideoLessonsManagerProps) => {
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    topic: '',
    unit: '',
    description: '',
    notes_url: '',
    duration: ''
  });

  const units = [
    'AS Pure Mathematics',
    'A2 Pure Mathematics',
    'Statistics S1',
    'Statistics S2',
    'Mechanics M1',
    'Mechanics M2',
    'IGCSE Mathematics',
    'Additional Mathematics'
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('video_lessons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch video lessons');
      return;
    }

    setVideos(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingVideo) {
      const { error } = await supabase
        .from('video_lessons')
        .update(formData)
        .eq('id', editingVideo.id);

      if (error) {
        toast.error('Failed to update video lesson');
        return;
      }

      toast.success('Video lesson updated successfully');
    } else {
      const { error } = await supabase
        .from('video_lessons')
        .insert(formData);

      if (error) {
        toast.error('Failed to create video lesson');
        return;
      }

      toast.success('Video lesson created successfully');
    }

    setIsDialogOpen(false);
    setEditingVideo(null);
    setFormData({
      title: '',
      youtube_url: '',
      topic: '',
      unit: '',
      description: '',
      notes_url: '',
      duration: ''
    });
    fetchVideos();
    onUpdate();
  };

  const handleEdit = (video: VideoLesson) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      youtube_url: video.youtube_url,
      topic: video.topic,
      unit: video.unit,
      description: video.description || '',
      notes_url: video.notes_url || '',
      duration: video.duration || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video lesson?')) return;

    const { error } = await supabase
      .from('video_lessons')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete video lesson');
      return;
    }

    toast.success('Video lesson deleted successfully');
    fetchVideos();
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Video Lessons Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Video Lesson
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingVideo ? 'Edit Video Lesson' : 'Add New Video Lesson'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="e.g., Differentiation"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notes_url">Notes URL (Optional)</Label>
                    <Input
                      id="notes_url"
                      value={formData.notes_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duration (Optional)</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 15 mins"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingVideo(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingVideo ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>{video.title}</TableCell>
                <TableCell>{video.topic}</TableCell>
                <TableCell>{video.unit}</TableCell>
                <TableCell>{video.duration || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(video.youtube_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(video.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VideoLessonsManager;
