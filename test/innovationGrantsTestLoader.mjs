const extensionless = /^(?:\.\.?\/|file:).*$/;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      shortCircuit: true,
      url: "data:text/javascript,export%20%7B%7D",
    };
  }

  if (specifier === "@/data/story-images.json") {
    return {
      shortCircuit: true,
      url: "data:text/javascript,export%20default%20%7Bthemes%3A%7B%7D%2CflatPool%3A%5B%5D%7D",
    };
  }

  if (specifier.startsWith("@/")) {
    const projectRelative = specifier.slice(2);
    try {
      return await nextResolve(new URL(`../${projectRelative}.ts`, import.meta.url).href, context);
    } catch {
      // Let Node report the original resolution error when no TypeScript file exists.
    }
  }

  if (extensionless.test(specifier) && !/[./][cm]?tsx?$/.test(specifier)) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      // Let Node report the original resolution error when no TypeScript file exists.
    }
  }

  return nextResolve(specifier, context);
}
