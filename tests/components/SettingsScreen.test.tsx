import { render, screen, fireEvent } from '@testing-library/react';
import SettingsScreen from '../../src/components/SettingsScreen';
import { describe, it, expect, vi } from 'vitest';

describe('SettingsScreen', () => {
  const mockOnBack = vi.fn();
  const mockOnSettingsChange = vi.fn();

  it('renders the build version', () => {
    render(<SettingsScreen onBack={mockOnBack} onSettingsChange={mockOnSettingsChange} />);

    // Check if the version text is present
    // Since __BUILD_VERSION__ is dynamic, we check for the prefix "version:"
    const versionElement = screen.getByText(/version: v\d{8}-\d{4}/);
    expect(versionElement).toBeDefined();
  });

  it('calls onBack when back button is clicked', () => {
    render(<SettingsScreen onBack={mockOnBack} onSettingsChange={mockOnSettingsChange} />);

    const backButton = screen.getByText('← もどる');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
