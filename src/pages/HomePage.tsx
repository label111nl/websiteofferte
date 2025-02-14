import { Link } from '@tanstack/react-router';
import { 
  ArrowRight,
  Shield,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const features = [
  {
    icon: <Shield className="w-6 h-6 text-blue-600" />,
    title: "Betrouwbare Partners",
    description: "Alleen gecertificeerde en geverifieerde webdesign professionals"
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    title: "Snelle Response",
    description: "Ontvang binnen 24 uur meerdere offertes van gekwalificeerde bureaus"
  },
  {
    icon: <Sparkles className="w-6 h-6 text-blue-600" />,
    title: "AI-Matching",
    description: "Geavanceerde matching technologie voor de beste resultaten"
  }
];

const testimonials = [
  {
    name: "Jan de Vries",
    company: "Bakkerij De Vries",
    text: "Binnen een dag had ik 3 professionele offertes ontvangen. De website is nu precies wat ik wilde!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
  },
  {
    name: "Lisa Bakker",
    company: "Yoga Studio Zen",
    text: "Geweldige service! Het vergelijken van offertes heeft ons veel tijd en geld bespaard.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
  }
];

export function HomePage() {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-center mb-8">
              Website Offertes Aanvragen
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Vind de beste webontwikkelaars voor je project
            </p>
            <div className="flex justify-center">
                <Link to="/offerte-aanvragen">
                <Button size="lg">
                  Start Nu <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-2">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Wat Onze Klanten Zeggen
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-gray-600 mb-4">{testimonial.text}</p>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}