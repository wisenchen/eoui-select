const { chromium } = require('playwright');
let context: any = null;
let browser: any = null;
describe('EouiSelectComponent', () => {
  jest.setTimeout(60000);
  it('1.测试搜索功能和选择功能', async () => {
    await initContext();
    const page = await getNewPage();
    // Click eoui-select-top-control:has-text("请选择...")
    await page.locator('eoui-select-top-control:has-text("请选择...")').click();
    // Click [placeholder="搜索"]
    await page.locator('[placeholder="搜索"]').click();
    // Fill [placeholder="搜索"]
    await page.locator('[placeholder="搜索"]').fill('66');
    // Click eoui-option-item:nth-child(2) .eoui-select-checkbox-wrap .eoui-select-checkbox
    await page.locator('eoui-option-item:nth-child(2) .eoui-select-checkbox-wrap .eoui-select-checkbox').click();
    const selectedLabel = await page.$eval('eoui-select-top-control', (el: any) => el.textContent);
    // 验证是否为选中第二条 166
    expect(selectedLabel).toBe('动态key--166');
    // Click .eoui-select-checkbox >> nth=0
    // 全选所有66
    await page.locator('.eoui-select-checkbox').first().click();
    const selectedAllSearchLabel = await page.$eval('eoui-select-top-control', (el: any) => el.textContent);
    // 是否选择所有10000以内的66 应为280
    expect(selectedAllSearchLabel.split('，').length).toBe(280);

    await page.locator('[placeholder="搜索"]').fill('');
    await page.locator('.eoui-select-checkbox').first().click();
    const allSelectedLabel = await page.$eval('eoui-select-top-control', (el: any) => el.textContent);
    // 是否选择所有下拉项
    expect(allSelectedLabel.split('，').length).toBe(10000);

    // await page.waitForTimeout(2000);
  });
  it('2.测试清除功能', async () => {
    const page = await getNewPage();
    // Click eoui-select-top-control:has-text("请选择...")
    await page.locator('eoui-select-top-control:has-text("请选择...")').click();
    // Click .eoui-select-checkbox >> nth=0
    await page.locator('.eoui-select-checkbox').first().click();
    const allSelectedLabel = await page.$eval('eoui-select-top-control', (el: any) => el.textContent);
    // 是否选择所有下拉项
    expect(allSelectedLabel.split('，').length).toBe(10000);
    // Click i
    await page.locator('i').click();
    const selectedLabel = await page.$eval('eoui-select-top-control', (el: any) => el.textContent);
    // 是否为默认选项
    expect(selectedLabel).toBe('请选择...');
  });

  it('3.测试虚拟滚动功能', async () => {
    const page = await getNewPage();
    await page.locator('eoui-select-top-control').click();
    await page.waitForTimeout(1000);
    // Click [placeholder="搜索"]
    await page.locator('[placeholder="搜索"]').click();
    // Fill [placeholder="搜索"]
    await page.locator('[placeholder="搜索"]').fill('66');
    for (let i = 0; i < 100; i++) {
      await page.$eval('.eoui-option-scroll', (el: HTMLElement) => el.scroll(0, el.scrollTop + 1000));
    }
    const optionItems = await page.$$('.eoui-option-item');
    // 10000以内数字包含66的应为280条
    expect(optionItems.length).toBe(280);
  });

  it('4.测试搜索框是否按预期出现或隐藏', async () => {
    const page = await getNewPage();
    // Fill input[type="text"]
    await page.locator('input[type="text"]').fill('7');
    // Click text=生成数据
    await page.locator('text=生成数据').click();
    // Click eoui-select-top-control:has-text("请选择...")
    await page.locator('eoui-select-top-control:has-text("请选择...")').click();
    let searchHandle = await page.$('.eoui-select-search');
    // 验证7条数据时搜索框是否默认隐藏
    expect(searchHandle).toBeNull();
    // Fill input[type="text"]
    await page.locator('input[type="text"]').fill('8');
    // Click text=生成数据
    await page.locator('text=生成数据').click();
    // Click eoui-select-top-control:has-text("请选择...")
    await page.locator('eoui-select-top-control:has-text("请选择...")').click();
    searchHandle = await page.$('.eoui-select-search');
    // 验证8条数据时搜索框是否显示
    expect(searchHandle).not.toBeNull();
    await context.close();
    await browser.close();
  });
});

async function initContext() {
  browser = await chromium.launch({
    // 默认为不打开浏览器，只在内部运行测试 设置false可打开浏览器，在开发时可使用
    // headless: false,
  });
  context = await browser.newContext();
}

async function getNewPage() {
  const page = await context.newPage();
  page.goto('http://localhost:4200/e2e');
  return page;
}
