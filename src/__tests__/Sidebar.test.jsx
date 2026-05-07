import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

describe('Sidebar component', () => {
    test('renders all menu items', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Programs/i)).toBeInTheDocument();
        expect(screen.getByText(/Applications/i)).toBeInTheDocument();
        expect(screen.getByText(/Projects/i)).toBeInTheDocument();
        expect(screen.getByText(/Incentives/i)).toBeInTheDocument();
        expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    });

    test('highlights active route link', () => {
        render(
            <MemoryRouter initialEntries={["/projects"]}>
                <Sidebar />
            </MemoryRouter>
        );

        const activeLink = screen.getByText(/Projects/i);
        expect(activeLink.classList.contains('active')).toBe(true);
    });
});
