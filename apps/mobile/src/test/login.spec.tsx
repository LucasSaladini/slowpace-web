import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../app/(auth)/login/page';
import { authService } from '../app/services/auth-service';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../app/services/auth-service');
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('Login Page (US01)', () => {
    it('deve redirecionar para o dashboard após cadastro com sucesso', async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'alex@slowpace.com' } });
        fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(authService.signUp).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });
});