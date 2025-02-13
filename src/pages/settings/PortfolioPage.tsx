import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, ExternalLink, Star, Code, Briefcase, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

type ExpertiseLevel = 'junior' | 'medior' | 'senior';

interface Portfolio {
  id: string;
  title: string;
  description: string;
  url: string;
  technologies: string[];
  images: string[];
  budget_range: string;
  completion_date: string;
  project_type: string;
  industry: string;
  team_size: number;
  development_time: number;
  client_testimonial: string;
  expertise_level: 'junior' | 'medior' | 'senior';
}

type NewPortfolio = Omit<Portfolio, 'id'>;

const projectTypes = [
  'Website',
  'Webshop',
  'Webapplicatie',
  'Mobile App',
  'CMS',
  'Maatwerk Software'
];

const industries = [
  'E-commerce',
  'Zakelijke Dienstverlening',
  'Horeca',
  'Gezondheidszorg',
  'Onderwijs',
  'Retail',
  'Tech',
  'Overheid',
  'Non-profit'
];

export default function PortfolioPage() {
  const { user } = useAuthStore();
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newPortfolio, setNewPortfolio] = React.useState<NewPortfolio>({
    title: '',
    description: '',
    url: '',
    technologies: [],
    images: [],
    budget_range: '',
    completion_date: '',
    project_type: '',
    industry: '',
    team_size: 1,
    development_time: 1,
    client_testimonial: '',
    expertise_level: 'medior'
  });

  React.useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      toast.error('Error bij het laden van portfolio items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('portfolios')
        .insert([{
          user_id: user?.id,
          ...newPortfolio,
          technologies: newPortfolio.technologies
        }]);

      if (error) throw error;
      
      toast.success('Portfolio item succesvol toegevoegd');
      fetchPortfolios();
      setNewPortfolio({
        title: '',
        description: '',
        url: '',
        technologies: [],
        images: [],
        budget_range: '',
        completion_date: '',
        project_type: '',
        industry: '',
        team_size: 1,
        development_time: 1,
        client_testimonial: '',
        expertise_level: 'medior',
      });
    } catch (error) {
      toast.error('Error bij het toevoegen van portfolio item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Portfolio item verwijderd');
      setPortfolios(portfolios.filter(p => p.id !== id));
    } catch (error) {
      toast.error('Error bij het verwijderen van portfolio item');
    }
  };

  const getExpertiseBadgeColor = (level: string) => {
    switch (level) {
      case 'junior':
        return 'bg-yellow-100 text-yellow-800';
      case 'medior':
        return 'bg-blue-100 text-blue-800';
      case 'senior':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const technologies = e.target.value.split(',').map((t: string) => t.trim());
    setNewPortfolio(prev => ({
      ...prev,
      technologies
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Beheer</h1>
          <p className="mt-1 text-sm text-gray-500">
            Voeg projecten toe aan je portfolio om je expertise te tonen en meer relevante leads te ontvangen
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Project Toevoegen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Project Toevoegen aan Portfolio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Project Titel</Label>
                <Input
                  id="title"
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="project_type">Type Project</Label>
                <Select
                  value={newPortfolio.project_type}
                  onValueChange={(value) => setNewPortfolio({ ...newPortfolio, project_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer type project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industrie</Label>
                <Select
                  value={newPortfolio.industry}
                  onValueChange={(value) => setNewPortfolio({ ...newPortfolio, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer industrie" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">Project URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={newPortfolio.url}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, url: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="technologies">Technologieën (komma-gescheiden)</Label>
                <Input
                  id="technologies"
                  value={newPortfolio.technologies.join(',')}
                  onChange={handleTechnologiesChange}
                  required
                  placeholder="React, TypeScript, Node.js, etc."
                />
              </div>

              <div>
                <Label htmlFor="expertise_level">Expertise Niveau</Label>
                <Select
                  value={newPortfolio.expertise_level}
                  onValueChange={(value: ExpertiseLevel) => 
                    setNewPortfolio({ ...newPortfolio, expertise_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior (1-3 jaar ervaring)</SelectItem>
                    <SelectItem value="medior">Medior (3-5 jaar ervaring)</SelectItem>
                    <SelectItem value="senior">Senior (5+ jaar ervaring)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team_size">Teamgrootte</Label>
                  <Input
                    id="team_size"
                    type="number"
                    min="1"
                    value={newPortfolio.team_size}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, team_size: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="development_time">Ontwikkeltijd (maanden)</Label>
                  <Input
                    id="development_time"
                    type="number"
                    min="1"
                    value={newPortfolio.development_time}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, development_time: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="budget_range">Budget Range</Label>
                <Select
                  value={newPortfolio.budget_range}
                  onValueChange={(value) => setNewPortfolio({ ...newPortfolio, budget_range: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500-1000">€500 - €1.000</SelectItem>
                    <SelectItem value="1000-2500">€1.000 - €2.500</SelectItem>
                    <SelectItem value="2500-5000">€2.500 - €5.000</SelectItem>
                    <SelectItem value="5000-10000">€5.000 - €10.000</SelectItem>
                    <SelectItem value="10000-20000">€10.000 - €20.000</SelectItem>
                    <SelectItem value="20000+">€20.000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="completion_date">Opleverdatum</Label>
                <Input
                  id="completion_date"
                  type="date"
                  value={newPortfolio.completion_date}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, completion_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="client_testimonial">Klant Testimonial</Label>
                <Textarea
                  id="client_testimonial"
                  value={newPortfolio.client_testimonial}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, client_testimonial: e.target.value })}
                  placeholder="Wat vond de klant van de samenwerking?"
                />
              </div>

              <Button type="submit" className="w-full">Project Toevoegen</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{portfolio.title}</span>
                <div className="flex space-x-2">
                  {portfolio.url && (
                    <a
                      href={portfolio.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(portfolio.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{portfolio.project_type}</span>
                  <span className="text-sm text-gray-500">• {portfolio.industry}</span>
                </div>

                <p className="text-sm text-gray-600">{portfolio.description}</p>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Expertise Niveau:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      getExpertiseBadgeColor(portfolio.expertise_level)
                    }`}>
                      {portfolio.expertise_level.charAt(0).toUpperCase() + portfolio.expertise_level.slice(1)}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">Technologieën:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {portfolio.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Team:</span>
                      <p>{portfolio.team_size} personen</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Doorlooptijd:</span>
                      <p>{portfolio.development_time} maanden</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">Budget:</span>
                    <p className="text-sm">€{portfolio.budget_range}</p>
                  </div>

                  {portfolio.client_testimonial && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Klant Feedback:</span>
                      <p className="text-sm italic mt-1">{portfolio.client_testimonial}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-medium text-gray-500">Opgeleverd:</span>
                    <p className="text-sm">
                      {new Date(portfolio.completion_date).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolios.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Geen portfolio items</h3>
          <p className="mt-2 text-sm text-gray-500">
            Voeg je eerste project toe om je expertise te tonen en meer relevante leads te ontvangen.
          </p>
        </div>
      )}
    </div>
  );
}