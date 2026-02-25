import { chromium, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

const SITE_URL = process.env.SITE_URL || "https://competitor-signals-shop.onrender.com";
const PRODUCT_COUNT = 8;

function randomDelay(minMs = 1000, maxMs = 3000): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function randomIp(): string {
  const octet = () => Math.floor(Math.random() * 223) + 1; // 1-223 to avoid reserved ranges
  return `${octet()}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 254) + 1}`;
}

function pickRandomProducts(count: number): number[] {
  const ids = Array.from({ length: PRODUCT_COUNT }, (_, i) => i + 1);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, count);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPageReady(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
}

async function run() {
  const numProducts = Math.floor(Math.random() * 3) + 1; // 1-3 products
  const productIds = pickRandomProducts(numProducts);

  const fakeIp = randomIp();
  const fakeExternalId = faker.string.uuid();
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: "national" }),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode("#####"),
  };

  console.log(`\n--- Fake Traffic Run ---`);
  console.log(`Site:     ${SITE_URL}`);
  console.log(`IP:       ${fakeIp}`);
  console.log(`ExtID:    ${fakeExternalId}`);
  console.log(`Products: ${productIds.join(", ")} (${numProducts} items)`);
  console.log(`User:     ${user.firstName} ${user.lastName} <${user.email}>`);
  console.log(`Address:  ${user.address}, ${user.city}, ${user.state} ${user.zip}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: faker.internet.userAgent(),
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  // Pre-seed the external ID in localStorage before any page loads
  await context.addInitScript((extId: string) => {
    localStorage.setItem("signalshop_external_id", extId);
  }, fakeExternalId);

  // Intercept CAPI calls to inject the random IP into the request body
  await page.route("**/api/capi", async (route) => {
    const request = route.request();
    try {
      const body = JSON.parse(request.postData() || "{}");
      body.clientIpAddress = fakeIp;
      await route.continue({ postData: JSON.stringify(body) });
    } catch {
      await route.continue();
    }
  });

  try {
    // 1. Visit homepage
    console.log("[1/7] Visiting homepage...");
    await page.goto(SITE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await waitForPageReady(page);
    await sleep(randomDelay());

    // 2-3. Browse products and add to cart
    for (let i = 0; i < productIds.length; i++) {
      const pid = productIds[i];
      console.log(`[2/7] Viewing product ${pid} (${i + 1}/${numProducts})...`);
      await page.goto(`${SITE_URL}/product/${pid}`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await waitForPageReady(page);
      await sleep(randomDelay());

      console.log(`[3/7] Adding product ${pid} to cart...`);
      await page.getByRole("button", { name: "Add to Cart" }).click();
      await sleep(randomDelay(500, 1500));
    }

    // 4. Go to cart
    console.log("[4/7] Going to cart...");
    await page.goto(`${SITE_URL}/cart`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await waitForPageReady(page);
    await sleep(randomDelay());

    // 5. Proceed to checkout
    console.log("[5/7] Proceeding to checkout...");
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
    await waitForPageReady(page);
    await sleep(randomDelay());

    // 6. Fill checkout form
    console.log("[6/7] Filling checkout form...");
    await page.fill("#firstName", user.firstName);
    await page.fill("#lastName", user.lastName);
    await page.fill("#email", user.email);
    await page.fill("#phone", user.phone);
    await page.fill("#address", user.address);
    await page.fill("#city", user.city);
    await page.fill("#state", user.state);
    await page.fill("#zip", user.zip);
    await page.fill("#card", "4242 4242 4242 4242");
    await page.fill("#expiry", "12/28");
    await page.fill("#cvc", "123");
    await sleep(randomDelay(500, 1500));

    // 7. Place order
    console.log("[7/7] Placing order...");
    await page.getByRole("button", { name: "Place Order" }).click();

    await page.waitForURL("**/thank-you**", { timeout: 15000 });
    console.log("\nOrder completed! Landed on thank-you page.");

    await sleep(randomDelay(2000, 4000));

    console.log(`\n--- Run complete ---`);
    console.log(
      `Purchased ${numProducts} product(s) as ${user.firstName} ${user.lastName}\n`
    );
  } catch (error) {
    console.error("Error during fake traffic run:", error);
    const screenshotPath = `scripts/error-screenshot-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.error(`Screenshot saved to ${screenshotPath}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
