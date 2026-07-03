import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnderConstructionPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-brand-yellow-pale rounded-full flex items-center justify-center mb-8 animate-bounce">
        <Construction className="w-12 h-12 text-yellow-600" />
      </div>
      <h1 className="text-4xl font-bold text-brand-text mb-4">Under Construction</h1>
      <p className="text-brand-text-muted text-lg max-w-md mx-auto mb-8">
        We are working hard to bring you this feature. Please check back soon!
      </p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Go Back Home
      </Link>
    </div>
  );
}
