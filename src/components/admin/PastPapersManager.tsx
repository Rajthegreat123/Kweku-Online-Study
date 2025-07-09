
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

interface PastPapersManagerProps {
  onUpdate: () => void;
}

const PastPapersManager = ({ onUpdate }: PastPapersManagerProps) => {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<PastPaper | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    paper_type: '',
    year: new Date().getFullYear(),
    session: '',
    question_paper_url: '',
    mark_scheme_url: ''
  });

  const subjects = [
    'IGCSE Mathematics',
    'Additional Mathematics',
    'Statistics S1',
    'Statistics S2',
    'Mechanics M1',
    'Mechanics M2',
    'AS Pure Mathematics',
    'A2 Pure Mathematics'
  ];

  const sessions = ['May/June', 'October/November', 'February/March'];

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    const { data, error } = await supabase
      .from('past_papers')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      toast.error('Failed to fetch past papers');
      return;
    }

    setPapers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPaper) {
      const { error } = await supabase
        .from('past_papers')
        .update(formData)
        .eq('id', editingPaper.id);

      if (error) {
        toast.error('Failed to update past paper');
        return;
      }

      toast.success('Past paper updated successfully');
    } else {
      const { error } = await supabase
        .from('past_papers')
        .insert(formData);

      if (error) {
        toast.error('Failed to create past paper');
        return;
      }

      toast.success('Past paper created successfully');
    }

    setIsDialogOpen(false);
    setEditingPaper(null);
    setFormData({
      title: '',
      subject: '',
      paper_type: '',
      year: new Date().getFullYear(),
      session: '',
      question_paper_url: '',
      mark_scheme_url: ''
    });
    fetchPapers();
    onUpdate();
  };

  const handleEdit = (paper: PastPaper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      subject: paper.subject,
      paper_type: paper.paper_type,
      year: paper.year,
      session: paper.session,
      question_paper_url: paper.question_paper_url || '',
      mark_scheme_url: paper.mark_scheme_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this past paper?')) return;

    const { error } = await supabase
      .from('past_papers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete past paper');
      return;
    }

    toast.success('Past paper deleted successfully');
    fetchPapers();
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Past Papers Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Past Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPaper ? 'Edit Past Paper' : 'Add New Past Paper'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="paper_type">Paper Type</Label>
                    <Input
                      id="paper_type"
                      value={formData.paper_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, paper_type: e.target.value }))}
                      placeholder="e.g., Paper 1, P1, M1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="session">Session</Label>
                    <Select
                      value={formData.session}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, session: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map(session => (
                          <SelectItem key={session} value={session}>{session}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="question_paper_url">Question Paper URL</Label>
                  <Input
                    id="question_paper_url"
                    value={formData.question_paper_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, question_paper_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="mark_scheme_url">Mark Scheme URL</Label>
                  <Input
                    id="mark_scheme_url"
                    value={formData.mark_scheme_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, mark_scheme_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingPaper(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPaper ? 'Update' : 'Create'}
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
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {papers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell>{paper.title}</TableCell>
                <TableCell>{paper.subject}</TableCell>
                <TableCell>{paper.paper_type}</TableCell>
                <TableCell>{paper.year}</TableCell>
                <TableCell>{paper.session}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(paper)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(paper.id)}>
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

export default PastPapersManager;
