import { test, expect } from '@playwright/test';

test.describe('US01: Autenticação e Identificação - E2E Scenarios', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // --- POSITIVE TESTS ---
  test.describe('Positive Scenarios', () => {
    test('deve realizar login com sucesso e redirecionar para o dashboard', async ({ page }) => {
      await page.getByRole('textbox', { name: 'E-mail' }).fill('test@test.com');
      await page.getByRole('textbox', { name: 'Senha' }).fill('test1234');
      
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/.*dashboard/);

      await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
      await expect(page.getByRole('heading', { name: /sua constelação/i })).toBeVisible();
    });

    test('deve realizar login pressionando a tecla Enter', async ({ page }) => {
      await page.getByRole('textbox', { name: 'E-mail' }).fill('test@test.com');
      const passwordInput = page.getByRole('textbox', { name: 'Senha' });
      await passwordInput.fill('test1234');
      
      await passwordInput.press('Enter');

      await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    });
  });

  // --- NEGATIVE TESTS ---
  test.describe('Negative Scenarios', () => {
    test('deve exibir feedback visual em caso de credenciais inválidas', async ({ page }) => {
      await page.getByRole('textbox', { name: 'E-mail' }).fill('errado@slowpace.com');
      await page.getByRole('textbox', { name: 'Senha' }).fill('wrongpassword');
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible();
      await expect(page).toHaveURL(/.*login/);
    });

    test('deve validar obrigatoriedade dos campos no formulário', async ({ page }) => {
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page.getByText('E-mail inválido')).toBeVisible();
      await expect(page.getByText('A senha deve ter pelo menos 6 caracteres')).toBeVisible();
    });

    test('deve impedir envio com formato incorreto de e-mail', async ({ page }) => {
      await page.getByRole('textbox', { name: 'E-mail' }).fill('email-invalido-sem-dominio');
      await page.getByRole('textbox', { name: 'Senha' }).fill('test1234');
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page).not.toHaveURL(/.*dashboard/);
    });
  });

  // --- EDGE TESTS ---
  test.describe('Edge Scenarios', () => {
    test('deve redirecionar para login se o token estiver ausente ou inválido', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
    });

    test('deve lidar com entradas extremamente longas sem quebrar a aplicação', async ({ page }) => {
      const longString = 'a'.repeat(256);
      const uniqueEmail = `${Date.now()}_${longString}@test.com`;
      await page.getByRole('textbox', { name: 'E-mail' }).fill(uniqueEmail);
      await page.getByRole('textbox', { name: 'Senha' }).fill(longString);
      await page.getByRole('button', { name: 'Entrar' }).click();

      await expect(page).not.toHaveURL(/.*dashboard/);
    });

    test('deve suportar navegação via teclado (Tab e Enter)', async ({ page }) => {
      await page.getByRole('textbox', { name: 'E-mail' }).focus();
      await page.keyboard.type('test@test.com');
      
      await page.keyboard.press('Tab');
      await page.keyboard.type('test1234');
      
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    });
  });
});