import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Lead } from '@/types';

interface LeadFormProps {
  onSubmit: (lead: Partial<Lead>) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit }) => {
  const [lead, setLead] = useState<Partial<Lead>>({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    project_description: '',
    budget_range: '',
    timeline: '',
    location: '',
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLead(prevLead => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(lead);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Bedrijfsnaam</label>
        <Input name="company_name" value={lead.company_name} onChange={handleChange} />
      </div>
      <div>
        <label>Contactpersoon</label>
        <Input name="contact_name" value={lead.contact_name} onChange={handleChange} />
      </div>
      <div>
        <label>Email</label>
        <Input name="email" value={lead.email} onChange={handleChange} />
      </div>
      <div>
        <label>Telefoon</label>
        <Input name="phone" value={lead.phone} onChange={handleChange} />
      </div>
      <div>
        <label>Projectbeschrijving</label>
        <Textarea name="project_description" value={lead.project_description} onChange={handleChange} />
      </div>
      <div>
        <label>Budgetbereik</label>
        <Input name="budget_range" value={lead.budget_range} onChange={handleChange} />
      </div>
      <div>
        <label>Tijdlijn</label>
        <Input name="timeline" value={lead.timeline} onChange={handleChange} />
      </div>
      <div>
        <label>Locatie</label>
        <Input name="location" value={lead.location} onChange={handleChange} />
      </div>
      <div>
        <label>Prijs</label>
        <Input name="price" type="number" value={lead.price} onChange={handleChange} />
      </div>
      <Button type="submit" className="mt-6">Verzenden</Button>
    </form>
  );
};

export default LeadForm;