// Mini test harness compatibile con Node >= 14 (node:test non è disponibile su Node 16.16).
const registry = [];

export function test(name, fn) {
  registry.push({ name, fn });
}

export async function runAll() {
  let failed = 0;
  for (const { name, fn } of registry) {
    try {
      await fn();
      console.log(`  \u2713 ${name}`);
    } catch (err) {
      failed++;
      console.log(`  \u2717 ${name}`);
      console.log(`      ${err && err.stack ? err.stack.split("\n").slice(0, 3).join("\n      ") : err}`);
    }
  }
  console.log(`\n${registry.length - failed}/${registry.length} test superati`);
  return failed;
}
