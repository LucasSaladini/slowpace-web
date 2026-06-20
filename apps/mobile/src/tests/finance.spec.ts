import { test, expect } from '@playwright/test';

test.describe('US015 - Controle Financeiro Pessoal (Lançamentos)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('textbox', { name: 'E-mail' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Senha' }).fill('123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /sua constelação/i })).toBeVisible();
  });

  test('Deve barrar inputs inválidos em runtime exibindo mensagens do Zod', async ({ page }) => {
    const financeContainer = page.locator('form:has-text("Confirmar")');
    await expect(financeContainer).toBeVisible();

    await page.click('button:has-text("Confirmar")');

    await expect(page.locator('text=A descrição precisa de pelo menos 3 caracteres')).toBeVisible();
    await expect(page.locator('text=O valor deve ser maior que zero')).toBeVisible();

    await page.fill('input[id="description"]', 'Café da manhã');
    await page.fill('input[id="amount"]', '-5.50');
    await page.fill('input[id="category"]', 'Alimentação');

    await page.click('button:has-text("Confirmar")');

    await expect(page.locator('text=O valor deve ser maior que zero')).toBeVisible();
  });

  test('Deve registrar, editar e listar uma transação levemente', async ({ page }) => {
    await page.fill('input[id="description"]', 'Livro de Arquitetura');
    await page.fill('input[id="amount"]', '89.90');
    await page.fill('input[id="category"]', 'Educação');
    await page.click('button:has-text("Confirmar")');

    await expect(page.locator('text=Lançamento registrado de forma leve.')).toBeVisible();
    await expect(page.locator('text=Livro de Arquitetura')).toBeVisible();

    await page.locator('div[key] >> text=Livro de Arquitetura').hover();
    await page.click('button:has-text("Editar")');
    
    await page.fill('input[id="description"]', 'Livro de Arquitetura Clean');
    await page.click('button:has-text("Salvar Alteração")');

    await expect(page.locator('text=Lançamento ajustado com sucesso.')).toBeVisible();
    await expect(page.locator('text=Livro de Arquitetura Clean')).toBeVisible();
  });
});

test.describe('US015 - Segurança e Isolamento Lógico (Pentest/BOLA)', () => {

  test('Não deve permitir que o Usuário B manipule ou veja transações do Usuário A (BOLA)', async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: { email: 'usuario.b@lumeapp.com', password: 'SenhaSegura456' }
    });
    const { token: tokenB } = await loginResponse.json();

    const transactionIdUserA = 'b89c3a1d-72ee-488f-9d32-84196196a67f';

    const deleteAttempt = await request.delete(`/api/finance/transactions/${transactionIdUserA}`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });

    expect(deleteAttempt.status()).toBe(404);

    const updateAttempt = await request.put(`/api/finance/transactions/${transactionIdUserA}`, {
      headers: { 'Authorization': `Bearer ${tokenB}` },
      data: {
        description: 'Ataque de Alteração',
        amount: 10,
        type: 'INCOME',
        category: 'Invasão'
      }
    });

    expect(updateAttempt.status()).toBe(404);
  });
});