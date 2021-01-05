import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import ErrorView from './ErrorView';
import { UIError } from '../types/error';

it('Renders a simple error', () => {
    const error: UIError = {
        code: 'test-error',
        source: 'unit-testing',
        message: 'This is a test'
    };
    render(<ErrorView error={error} />);
    expect(screen.queryByText('test-error')).toBeInTheDocument();
    expect(screen.queryByText('unit-testing')).toBeInTheDocument();
    expect(screen.getByText('This is a test')).toBeInTheDocument();
    expect(screen.queryByText('foo')).toBeNull();
});
