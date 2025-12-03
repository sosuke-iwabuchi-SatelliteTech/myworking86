
import { chromium } from 'playwright';

async function verifyGacha() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the app (assuming it's running on localhost:5173)
    await page.goto('http://localhost:5173');

    // Wait for the app to load and ensure we are on Welcome Screen or handle redirection
    // If redirected to registration, fill it out
    try {
      await page.waitForSelector('text=はじめまして！', { timeout: 3000 });
      console.log('Registration screen detected. Registering...');
      await page.fill('input[type="text"]', 'Tester');
      await page.selectOption('select', '1'); // Select Grade 1
      await page.click('button:has-text("はじめる")');
    } catch {
      console.log('Not on registration screen, proceeding...');
    }

    // Now we should be on Welcome Screen
    // Click the Gacha button (assuming there is one, likely an icon or text)
    // Based on previous knowledge, there is a Gacha button. Let's find it.
    // It might be an emoji button or labeled "ガチャ"
    // Checking GachaScreen invocation in WelcomeScreen would be ideal, but let's try to find the button.
    // Usually it is a gift icon or similar.

    // Let's list buttons on the page to be sure or just try clicking the one that looks like Gacha
    await page.waitForSelector('button', { state: 'visible' });

    // Finding the Gacha button. In WelcomeScreen it might be an icon.
    // Let's assume there is a button that leads to Gacha. 
    // If I look at the file list, there is `WelcomeScreen.tsx`.
    // I can read it to find the trigger, but I'll guess it's a button with an emoji or specific class.

    // Try to find a button with 'ガチャ' or similar, or just click the one that looks distinct.
    // Since I don't have the WelcomeScreen code in front of me right now (I read GachaScreen),
    // I will try to find a button that likely opens it.
    // Usually it's in the header or main menu.

    // Let's dump the text content of buttons to debug if needed.
    const buttons = await page.getByRole('button').allInnerTexts();
    console.log('Buttons found:', buttons);

    // Assuming one of them is the Gacha button.
    // If the Gacha button is an icon, it might not have text.
    // Let's try looking for a button that contains an SVG or emoji.

    // Let's try to find a button that has a specific aria-label if it exists, or just try the last one?
    // Or maybe I can navigate directly? No, it's SPA.

    // Let's click the button that looks like it's for Gacha.
    // In many apps it's a "Gift" icon.
    // Let's try clicking a button that has "ガチャ" in it if visible, or "Gacha".

    // If I can't find it, I'll fail and read WelcomeScreen.
    // But let's try a selector for a button that might be it.
    // In the previous code reading of GachaScreen, it had "どうぶつガチャ" as title.
    // So the button might look like a capsule or gift.

    // Let's try to click a button that contains 'ガチャ' text.
    const gachaBtn = page.getByRole('button', { name: /ガチャ/ });
    if (await gachaBtn.count() > 0) {
      await gachaBtn.click();
    } else {
      // Maybe it's an icon button without text.
      // Let's try clicking the button that is NOT the "Start" buttons (which select grades).
      // Let's take a screenshot of Welcome Screen to debug if I fail.
      await page.screenshot({ path: 'verification/welcome_debug.png' });

      // I'll try to guess it's a fixed position button or similar.
      // Let's look for a button with `aria-label="gacha"` or similar if added.
      // Since I didn't add it, I should check WelcomeScreen.
      console.log("Could not find Gacha button by text. Please check WelcomeScreen.");
      throw new Error("Gacha button not found");
    }

    // Wait for Gacha Screen to load
    await page.waitForSelector('text=どうぶつガチャ');
    console.log('Entered Gacha Screen');

    // Take screenshot of Initial State
    await page.screenshot({ path: 'verification/1_gacha_idle.png' });

    // Click "Spin"
    await page.click('button:has-text("ガチャをまわす")');

    // Wait 500ms for "Dropping" phase and screenshot
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verification/2_gacha_dropping.png' });

    // Wait 1.5s (total 2s) for "Shaking" phase and screenshot
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'verification/3_gacha_shaking.png' });

    // Wait 3s (total 5s) for "Result" and screenshot
    // The total sequence is 1s (drop) + 3s (shake) + 0.5s (open) = 4.5s.
    // So waiting another 3s should be enough to see result.
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'verification/4_gacha_result.png' });

    console.log('Verification screenshots captured.');

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
}

verifyGacha();
