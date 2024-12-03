import React from 'react';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { CollectionForm } from '../components/collections/CollectionForm';

export const CreateCollection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container className="py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">Create New Collection</h1>
          <CollectionForm />
        </div>
      </Container>
    </div>
  );
};