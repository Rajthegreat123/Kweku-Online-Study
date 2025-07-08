
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  replied: boolean;
  created_at: string;
}

interface ContactMessagesManagerProps {
  onUpdate: () => void;
}

const ContactMessagesManager = ({ onUpdate }: ContactMessagesManagerProps) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch contact messages');
      return;
    }

    setMessages(data || []);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      toast.error('Failed to mark message as read');
      return;
    }

    fetchMessages();
    onUpdate();
  };

  const markAsReplied = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ replied: true })
      .eq('id', id);

    if (error) {
      toast.error('Failed to mark message as replied');
      return;
    }

    toast.success('Message marked as replied');
    fetchMessages();
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete message');
      return;
    }

    toast.success('Message deleted successfully');
    fetchMessages();
    onUpdate();
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className={!message.is_read ? 'bg-blue-50' : ''}>
                <TableCell className="font-medium">{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.subject || 'No subject'}</TableCell>
                <TableCell>{formatDate(message.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Badge variant={message.is_read ? "default" : "destructive"}>
                      {message.is_read ? 'Read' : 'Unread'}
                    </Badge>
                    {message.replied && (
                      <Badge variant="secondary">Replied</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewMessage(message)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.location.href = `mailto:${message.email}?subject=Re: ${message.subject || 'Your inquiry'}`;
                        markAsReplied(message.id);
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">From:</h4>
                  <p>{selectedMessage.name} ({selectedMessage.email})</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Subject:</h4>
                  <p>{selectedMessage.subject || 'No subject'}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Date:</h4>
                  <p>{formatDate(selectedMessage.created_at)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Message:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your inquiry'}`;
                      markAsReplied(selectedMessage.id);
                    }}
                  >
                    Reply via Email
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContactMessagesManager;
