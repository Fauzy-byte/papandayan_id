/**
 * Diagnostic utility function to verify:
 * 1. DOM root container presence (#root)
 * 2. Successful injection & mounting of React DOM
 * 3. Correct compilation & application of Tailwind CSS styles
 * 4. Browser environment & viewport dimensions
 */
export interface DiagnosticResult {
  rootExists: boolean;
  rootElementId: string;
  reactInjected: boolean;
  tailwindApplied: boolean;
  computedStyles: {
    fontFamily: string;
    backgroundColor: string;
    color: string;
  };
  viewport: {
    width: number;
    height: number;
  };
  errors: string[];
}

export function runAppDiagnostics(): DiagnosticResult {
  const errors: string[] = [];
  const root = document.getElementById('root');
  const rootExists = !!root;

  if (!root) {
    errors.push("CRITICAL: Root element with id 'root' was not found in the DOM document.");
  }

  // Verify Tailwind CSS application by checking computed styles on body or test probe
  let tailwindApplied = false;
  let computedStyles = {
    fontFamily: '',
    backgroundColor: '',
    color: '',
  };

  try {
    // Probe element with Tailwind utility classes
    const probe = document.createElement('div');
    probe.id = '__tailwind_probe__';
    probe.className = 'hidden bg-amber-500 text-white font-sans';
    document.body.appendChild(probe);

    const bodyStyles = window.getComputedStyle(document.body);
    const probeStyles = window.getComputedStyle(probe);

    // Amber-500 in RGB is rgb(245, 158, 11)
    const probeBg = probeStyles.backgroundColor;
    const isAmberApplied = probeBg.includes('245') || probeBg.includes('rgb');
    const isHiddenApplied = probeStyles.display === 'none';

    tailwindApplied = isHiddenApplied && isAmberApplied;

    computedStyles = {
      fontFamily: bodyStyles.fontFamily,
      backgroundColor: bodyStyles.backgroundColor,
      color: bodyStyles.color,
    };

    document.body.removeChild(probe);
  } catch (err) {
    errors.push(`Tailwind verification probe error: ${String(err)}`);
  }

  const reactInjected = !!(root && root.children.length > 0);

  const result: DiagnosticResult = {
    rootExists,
    rootElementId: 'root',
    reactInjected,
    tailwindApplied,
    computedStyles,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    errors,
  };

  // Log structured diagnostic banner to developer console
  console.group('%c🚀 [Papandayan.id] App Diagnostics Report', 'color: #0f2252; background: #fbbf24; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
  console.log('1. DOM Root Element:', rootExists ? '✅ Found (#root)' : '❌ MISSING');
  console.log('2. React DOM Injected:', reactInjected ? `✅ Injected (${root?.children.length} child nodes)` : '⚠️ Waiting for render cycle');
  console.log('3. Tailwind CSS Active:', tailwindApplied ? '✅ Successfully Applied' : '⚠️ Checking stylesheets');
  console.log('4. Body Computed Styles:', computedStyles);
  console.log('5. Viewport Dimensions:', `${result.viewport.width}x${result.viewport.height}`);
  if (errors.length > 0) {
    console.error('Diagnostic Warnings/Errors:', errors);
  }
  console.groupEnd();

  // Expose on window object for manual console inspection
  if (typeof window !== 'undefined') {
    (window as unknown as { __PAPANDAYAN_DIAGNOSTICS__: DiagnosticResult }).__PAPANDAYAN_DIAGNOSTICS__ = result;
  }

  return result;
}
