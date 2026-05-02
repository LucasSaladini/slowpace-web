import { test, expect } from '@playwright/test';

test.describe('Dashboard - Gestão de Hobbies e Evolução', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'E-mail' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Senha' }).fill('test1234');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test.afterEach(async ({ page }) => {
    const handleDialog = (dialog) => dialog.accept().catch(() => {});
    page.on('dialog', handleDialog);
    
    try {
      const deleteButtons = page.locator('button[aria-label="Remover luz"]');
      for (let i = 0; i < 5; i++) {
        const count = await deleteButtons.count();
        if (count === 0) break;
        await deleteButtons.first().click({ force: true, timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(500);     
      }
    } finally {
      page.off('dialog', handleDialog);
    }
  });

  // --- US02: GESTÃO DE HOBBIES ---
  test.describe('US02: Gestão de Hobbies (O Espaço de Lazer)', () => {
    test('deve permitir cadastrar um novo hobby com sucesso', async ({ page }) => {
      const hobbyName = `Piano_${Date.now()}`;
      await page.getByPlaceholder(/novo hábito/i).fill(hobbyName);
      await page.selectOption('select', 'weekly');
      
      const colorBubble = page.locator('[style*="background-color: rgb(125, 211, 252)"]').first();
      await colorBubble.click({ force: true });
      
      await page.getByRole('button', { name: /adicionar/i }).click();

      await expect(page.getByRole('heading', { name: hobbyName, exact: true })).toBeVisible();
      await expect(page.getByText(/hobby iniciado com sucesso/i)).toBeVisible();
    });

    test('deve permitir excluir um hobby após confirmação', async ({ page }) => {
      const hobbyName = `DeleteMe_${Date.now()}`;
      await page.getByPlaceholder(/novo hábito/i).fill(hobbyName);
      await page.getByRole('button', { name: /adicionar/i }).click();

      page.on('dialog', dialog => dialog.accept());
      
      const hobbyCard = page.locator('div.group').filter({ hasText: hobbyName });
      await hobbyCard.getByLabel(/remover luz/i).click();
      
      await expect(page.getByText(/hobby removido/i)).toBeVisible();
      await expect(page.getByRole('heading', { name: hobbyName })).not.toBeVisible();
    });

    test('não deve permitir criar hobby com nome vazio', async ({ page }) => {
      const input = page.getByPlaceholder(/novo hábito/i);
      await input.fill('   ');
      await expect(page.getByRole('button', { name: /adicionar/i })).toBeDisabled();
    });

    test('deve resetar o formulário ao cancelar edição', async ({ page }) => {
      const hobbyName = `CancelEdit_${Date.now()}`;
      await page.getByPlaceholder(/novo hábito/i).fill(hobbyName);
      await page.getByRole('button', { name: /adicionar/i }).click();
      
      const hobbyCard = page.locator('div.group').filter({ hasText: hobbyName });
      await hobbyCard.getByLabel(/ajustar aura/i).click();
      
      const editInput = page.locator(`input[value="${hobbyName}"]`);
      await editInput.fill('Temp Name');
      
      await page.getByRole('button', { name: /cancelar/i }).or(page.locator('.lucide-x')).first().click();
      
      await expect(page.getByPlaceholder(/novo hábito/i)).toHaveValue('');
    });
  });

  // --- US03: REGISTRO DE PRÁTICA ---
  test.describe('US03: Registro de Prática (Log de Evolução)', () => {
    let sharedHobbyName: string;

    test.beforeEach(async ({ page }) => {
      sharedHobbyName = `LogTarget_${Date.now()}`;
      await page.getByPlaceholder(/novo hábito/i).fill(sharedHobbyName);
      await page.getByRole('button', { name: /adicionar/i }).click();
    });

    test('RN06: deve registrar prática com relato e exibir mensagem acolhedora', async ({ page }) => {
      const hobbyCard = page.locator('div.group').filter({ hasText: sharedHobbyName });
      await hobbyCard.getByLabel(/registrar prática/i).click();
      
      await page.getByRole('spinbutton').fill('45');
      await page.getByPlaceholder(/relato/i).fill('Hoje a prática foi fluida e relaxante.');
      await page.getByRole('button', { name: /confirmar cultivo/i }).click();

      await expect(page.locator('.toast')).toBeVisible();
    });

    test('deve permitir registro sem relato (apenas duração)', async ({ page }) => {
      const hobbyCard = page.locator('div.group').filter({ hasText: sharedHobbyName });
      await hobbyCard.getByLabel(/registrar prática/i).click();
      
      await page.getByRole('spinbutton').fill('20');
      await page.getByRole('button', { name: /confirmar cultivo/i }).click();

      await expect(page.getByRole('button', { name: 'Confirmar Cultivo' })).not.toBeVisible();
    });

    test('deve impedir registro com duração inválida', async ({ page }) => {
      const hobbyCard = page.locator('div.group').filter({ hasText: sharedHobbyName });
      await hobbyCard.getByLabel(/registrar prática/i).click();
      
      const durationInput = page.getByRole('spinbutton');
      const submitBtn = page.getByRole('button', { name: /confirmar cultivo/i });

      await durationInput.fill('0');
      await expect(submitBtn).toBeDisabled();
      
      await durationInput.fill('-10');
      await expect(submitBtn).toBeDisabled();
    });

    test('deve fechar o modal ao cancelar registro', async ({ page }) => {
      const hobbyCard = page.locator('div.group').filter({ hasText: sharedHobbyName });
      await hobbyCard.getByLabel(/registrar prática/i).click();
      await page.getByRole('button', { name: /cancelar/i }).click();
      await expect(page.getByRole('button', { name: /confirmar cultivo/i })).not.toBeVisible();
    });
  });

  // --- US04: VISUALIZAÇÃO DE IMPACTO ---
  test.describe('US04: Dashboard Acolhedor', () => {
    test('RN07: deve exibir tempo acumulado em horas e ocultar streaks', async ({ page }) => {
      await expect(page.locator('.text-7xl')).toBeVisible();
      await expect(page.getByText(/horas/i)).toBeVisible();

      await expect(page.getByText(/sequência/i)).not.toBeVisible();
      await expect(page.getByText('🔥')).not.toBeVisible();
    });

    test('deve exibir estrelas na constelação quando houver hobbies', async ({ page }) => {
      const hobbyName = `StarHobby_${Date.now()}`;
      await page.getByPlaceholder(/novo hábito/i).fill(hobbyName);
      await page.getByRole('button', { name: /adicionar/i }).click();

      const stars = page.locator('.animate-pulse');
      await expect(stars.first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/seu céu ainda não possui estrelas/i)).not.toBeVisible();
    });

    test.describe('Hobbies Flow', () => {
        test.describe.configure({ mode: 'serial' });
        
        test('deve permitir editar um hobby existente', async ({ page }) => {
        const hobbyName = `EditMe_${Date.now()}`;
        const newHobbyName = `Edited_${Date.now()}`;
        
        await page.getByPlaceholder(/novo hábito/i).fill(hobbyName);
        await page.getByRole('button', { name: /adicionar/i }).click();
        
        const hobbyCard = page.locator('div.group').filter({ hasText: hobbyName });
        await hobbyCard.getByLabel(/ajustar aura/i).click();
        
        await page.locator(`input[value="${hobbyName}"]`).fill(newHobbyName);
        await page.getByRole('button', { name: /salvar/i }).click();

        await expect(page.getByRole('heading', { name: newHobbyName })).toBeVisible();
        await expect(page.getByText(/hobby atualizado/i)).toBeVisible();
        });
    });

    test.describe('Timeline Serial Flow', () => {
      test.describe.configure({ mode: 'serial' });

      test('deve exibir o histórico de práticas na timeline', async ({ page }) => {
        const hobbyName = `TimelineTarget_${Date.now()}`;
        await page.getByPlaceholder(/novo hábito/i).fill(hobbyName);
        await page.getByRole('button', { name: /adicionar/i }).click();

        await page.waitForTimeout(2000);
        
        const hobbyCard = page.locator('div').filter({ hasText: hobbyName }).first();
        await hobbyCard.getByLabel('Registrar Prática').first().click();
        
        await page.getByRole('spinbutton').fill('30');
        await page.getByPlaceholder(/relato/i).fill('Li 20 páginas de um livro técnico.');
        await page.getByRole('button', { name: 'Confirmar Cultivo' }).click();

        await page.waitForTimeout(3000);

        const timeline = page.getByRole('complementary');
        await expect(timeline.getByText(hobbyName).first()).toBeVisible();
        await expect(timeline.getByText(/30 min/i).first()).toBeVisible();
        await expect(timeline.getByText(/Li 20 páginas/i).first()).toBeVisible();
      });
    });
  });
});