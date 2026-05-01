import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/[locale]/page';
import { useTranslations, useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// Mock the translations
jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace) => (key) => key),
  useLocale: jest.fn(() => 'en'),
}));

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(async (namespace) => (key) => key),
}));

describe('HomePage', () => {
  it('renders the homepage without crashing', () => {
    render(<HomePage />);

    // Check if the main sections are rendered by checking for structural elements
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders emoji icons', () => {
    render(<HomePage />);
    expect(screen.getByText('📝')).toBeInTheDocument();
    expect(screen.getByText('🪄')).toBeInTheDocument();
    expect(screen.getByText('🏁')).toBeInTheDocument();
    expect(screen.getByText('🚬')).toBeInTheDocument();
  });
});
