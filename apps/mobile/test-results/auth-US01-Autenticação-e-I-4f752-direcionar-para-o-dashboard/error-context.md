# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.tsx >> US01: Autenticação e Identificação - E2E Scenarios >> Positive Scenarios >> deve realizar login com sucesso e redirecionar para o dashboard
- Location: auth.spec.tsx:11:9

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*dashboard/
Received string:  "http://localhost:3000/login"

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    5 × unexpected value "http://localhost:3000/login"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('US01: Autenticação e Identificação - E2E Scenarios', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('http://localhost:3000');
  7  |   });
  8  | 
  9  |   // --- POSITIVE TESTS ---
  10 |   test.describe('Positive Scenarios', () => {
  11 |     test('deve realizar login com sucesso e redirecionar para o dashboard', async ({ page }) => {
  12 |       await page.getByRole('textbox', { name: 'E-mail' }).fill('test@test.com');
  13 |       await page.getByRole('textbox', { name: 'Senha' }).fill('test1234');
  14 |       
  15 |       await page.click('button[type="submit"]');
  16 | 
> 17 |       await expect(page).toHaveURL(/.*dashboard/);
     |                          ^ Error: expect(page).toHaveURL(expected) failed
  18 | 
  19 |       await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  20 |       await expect(page.getByRole('heading', { name: /sua constelação/i })).toBeVisible();
  21 |     });
  22 | 
  23 |     test('deve realizar login pressionando a tecla Enter', async ({ page }) => {
  24 |       await page.getByRole('textbox', { name: 'E-mail' }).fill('test@test.com');
  25 |       const passwordInput = page.getByRole('textbox', { name: 'Senha' });
  26 |       await passwordInput.fill('test1234');
  27 |       
  28 |       await passwordInput.press('Enter');
  29 | 
  30 |       await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  31 |     });
  32 |   });
  33 | 
  34 |   // --- NEGATIVE TESTS ---
  35 |   test.describe('Negative Scenarios', () => {
  36 |     test('deve exibir feedback visual em caso de credenciais inválidas', async ({ page }) => {
  37 |       await page.getByRole('textbox', { name: 'E-mail' }).fill('errado@slowpace.com');
  38 |       await page.getByRole('textbox', { name: 'Senha' }).fill('wrongpassword');
  39 |       await page.getByRole('button', { name: 'Entrar' }).click();
  40 | 
  41 |       await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible();
  42 |       await expect(page).toHaveURL(/.*login/);
  43 |     });
  44 | 
  45 |     test('deve validar obrigatoriedade dos campos no formulário', async ({ page }) => {
  46 |       await page.getByRole('button', { name: 'Entrar' }).click();
  47 | 
  48 |       await expect(page.getByText('E-mail inválido')).toBeVisible();
  49 |       await expect(page.getByText('A senha deve ter pelo menos 6 caracteres')).toBeVisible();
  50 |     });
  51 | 
  52 |     test('deve impedir envio com formato incorreto de e-mail', async ({ page }) => {
  53 |       await page.getByRole('textbox', { name: 'E-mail' }).fill('email-invalido-sem-dominio');
  54 |       await page.getByRole('textbox', { name: 'Senha' }).fill('test1234');
  55 |       await page.getByRole('button', { name: 'Entrar' }).click();
  56 | 
  57 |       await expect(page).not.toHaveURL(/.*dashboard/);
  58 |     });
  59 |   });
  60 | 
  61 |   // --- EDGE TESTS ---
  62 |   test.describe('Edge Scenarios', () => {
  63 |     test('deve redirecionar para login se o token estiver ausente ou inválido', async ({ page }) => {
  64 |       await page.goto('/dashboard');
  65 |       await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
  66 |     });
  67 | 
  68 |     test('deve lidar com entradas extremamente longas sem quebrar a aplicação', async ({ page }) => {
  69 |       const longString = 'a'.repeat(256);
  70 |       const uniqueEmail = `${Date.now()}_${longString}@test.com`;
  71 |       await page.getByRole('textbox', { name: 'E-mail' }).fill(uniqueEmail);
  72 |       await page.getByRole('textbox', { name: 'Senha' }).fill(longString);
  73 |       await page.getByRole('button', { name: 'Entrar' }).click();
  74 | 
  75 |       await expect(page).not.toHaveURL(/.*dashboard/);
  76 |     });
  77 | 
  78 |     test('deve suportar navegação via teclado (Tab e Enter)', async ({ page }) => {
  79 |       await page.getByRole('textbox', { name: 'E-mail' }).focus();
  80 |       await page.keyboard.type('test@test.com');
  81 |       
  82 |       await page.keyboard.press('Tab');
  83 |       await page.keyboard.type('test1234');
  84 |       
  85 |       await page.keyboard.press('Tab');
  86 |       await page.keyboard.press('Enter');
  87 | 
  88 |       await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  89 |     });
  90 |   });
  91 | });
```