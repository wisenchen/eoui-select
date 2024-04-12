import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {
  // Go to http://localhost:4200/
  await page.goto('http://localhost:4200/');
  // Click eoui-select-top-control:has-text("Jack")
  await page.locator('eoui-select-top-control:has-text("Jack")').click();
  // Click eoui-option-container >> text=Jack
  await page.locator('eoui-option-container >> text=Jack').click();
  // Click div:has-text("Jack")
  await page.locator('div:has-text("Jack")').click();
  // Click text=Lucy
  await page.locator('text=Lucy').click();
  // Click .iconfont >> nth=0
  await page.locator('.iconfont').first().click();
  // Click eoui-select-top-control:has-text("请选择...") >> nth=0
  await page.locator('eoui-select-top-control:has-text("请选择...")').first().click();
  // Click text=Lucy
  await page.locator('text=Lucy').click();
  // Click eoui-select-top-control:has-text("1") >> nth=0
  await page.locator('eoui-select-top-control:has-text("1")').first().click();
  // Click [placeholder="搜索"]
  await page.locator('[placeholder="搜索"]').click();
  // Fill [placeholder="搜索"]
  await page.locator('[placeholder="搜索"]').fill('111');
  // Click eoui-option-item:nth-child(2) .eoui-select-checkbox-wrap .eoui-select-checkbox
  await page.locator('eoui-option-item:nth-child(2) .eoui-select-checkbox-wrap .eoui-select-checkbox').click();
  // Click eoui-option-item:nth-child(3) .eoui-select-checkbox-wrap
  await page.locator('eoui-option-item:nth-child(3) .eoui-select-checkbox-wrap').click();
  // Click text=1，1110，1111111111011111112111311141115111611171118 >> i
  await page.locator('text=1，1110，1111111111011111112111311141115111611171118 >> i').click();
  // Click [placeholder="搜索"]
  await page.locator('[placeholder="搜索"]').click();
  // Click text=所有功能-自定义下拉项内容
  await page.locator('text=所有功能-自定义下拉项内容').click();
  // Click eoui-select-top-control:has-text("请选择...") >> nth=0
  await page.locator('eoui-select-top-control:has-text("请选择...")').first().click();
});