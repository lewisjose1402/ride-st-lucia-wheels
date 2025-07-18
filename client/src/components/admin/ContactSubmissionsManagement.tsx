import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, Mail, Calendar, User, MessageSquare, Eye, Clock } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
  updatedAt: string;
}

export const ContactSubmissionsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['admin-contact-submissions', searchTerm, statusFilter],
    queryFn: async () => {
      const response = await fetch('/api/admin/contact-submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch contact submissions');
      }
      const data = await response.json();
      
      // Apply client-side filtering
      let filtered = data;
      
      if (searchTerm) {
        filtered = filtered.filter((submission: ContactSubmission) =>
          submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter((submission: ContactSubmission) => 
          submission.status === statusFilter
        );
      }
      
      return filtered;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/contact-submissions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update submission status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-submissions'] });
      toast({
        title: "Status updated",
        description: "Contact submission status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update submission status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">New</Badge>;
      case 'read':
        return <Badge variant="default">Read</Badge>;
      case 'responded':
        return <Badge variant="secondary">Responded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Contact Submissions</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contact Submissions
        </CardTitle>
        <CardDescription>
          Manage and respond to customer contact form submissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, subject, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-contact-submissions'] })}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading contact submissions...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No contact submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions?.map((submission: ContactSubmission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{submission.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{submission.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{submission.subject}</span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate" title={submission.message}>
                            {submission.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(submission.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(submission.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {submission.status === 'new' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(submission.id, 'read')}
                              disabled={updateStatusMutation.isPending}
                            >
                              Mark Read
                            </Button>
                          )}
                          {submission.status === 'read' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(submission.id, 'responded')}
                              disabled={updateStatusMutation.isPending}
                            >
                              Mark Responded
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <MessageSquare className="h-5 w-5" />
                                  Contact Submission Details
                                </DialogTitle>
                                <DialogDescription>
                                  Full details of the contact form submission
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Contact Information
                                    </h4>
                                    <div className="space-y-2">
                                      <p><span className="font-medium">Name:</span> {submission.name}</p>
                                      <p><span className="font-medium">Email:</span> {submission.email}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      Timeline
                                    </h4>
                                    <div className="space-y-2">
                                      <p><span className="font-medium">Submitted:</span> {formatDate(submission.createdAt)}</p>
                                      <p><span className="font-medium">Updated:</span> {formatDate(submission.updatedAt)}</p>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">Status:</span>
                                        {getStatusBadge(submission.status)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Subject</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded border">{submission.subject}</p>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Message</h4>
                                  <div className="text-sm bg-gray-50 p-4 rounded border max-h-60 overflow-y-auto">
                                    <p className="whitespace-pre-wrap">{submission.message}</p>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 pt-4 border-t">
                                  {submission.status === 'new' && (
                                    <Button
                                      onClick={() => handleStatusChange(submission.id, 'read')}
                                      disabled={updateStatusMutation.isPending}
                                      className="flex items-center gap-2"
                                    >
                                      <Eye className="h-4 w-4" />
                                      Mark as Read
                                    </Button>
                                  )}
                                  {submission.status === 'read' && (
                                    <Button
                                      onClick={() => handleStatusChange(submission.id, 'responded')}
                                      disabled={updateStatusMutation.isPending}
                                      className="flex items-center gap-2"
                                    >
                                      <MessageSquare className="h-4 w-4" />
                                      Mark as Responded
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject}`, '_blank')}
                                    className="flex items-center gap-2"
                                  >
                                    <Mail className="h-4 w-4" />
                                    Reply via Email
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {submissions && submissions.length > 0 && (
          <div className="text-sm text-gray-500 text-center">
            Showing {submissions.length} contact submission{submissions.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};