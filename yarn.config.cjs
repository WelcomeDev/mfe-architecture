// yarn.config.cjs
/** @type {import('@yarnpkg/types')} */
const {defineConfig} = require('@yarnpkg/types');

const workspaceDependencyRules = [
  {
    target: ["@app.lib/*", "@evo.contracts/*"],
    dependencies: {},
    peerDependencies: {
      "react": "^18",
      "react-dom": "^18"
    },
    devDependencies: {
      "vite": "^6.3.5",
      "@rollup/plugin-replace": "^6.0.2",
      "@vitejs/plugin-react": "^4.4.1",
      "vite-plugin-dts": "^4.5.3",
      "react": "^18",
      "react-dom": "^18",
      "@types/node": "^22",
      "@types/react": "^18",
      "@types/react-dom": "^18"
    }
  },
  {
    target: ['@evo.contracts/*'],
    peerDependencies: {
      "@app.lib/mfe-api-kit": "*",
    },
    devDependencies: {},
    dependencies: {},
  },
  {
    target: ["@mf/*"],
    dependencies: {},
    peerDependencies: {
      "@app.lib/ui-kit": "^1.0.0"
    },
    devDependencies: {
      "@app.lib/ui-kit": "^1.0.0",
      "@app/host-app": "*",
      "piral-cli-vite6": "latest",
      "piral-cli": "^1.8.5"
    }
  },
  {
    target: ['@app/bff', '@app/feed'],
    dependencies: {
      "cors": "^2.8.5",
      "express": "^5.1.0",
      "http-proxy-middleware": "^3.0.5",
      "serve-static": "^2.2.0"
    },
    devDependencies: {
      "@types/express": "^5.0.1"
    },
    peerDependencies: {}
  }
];

module.exports = defineConfig({
  async constraints({Yarn}) {
    const matches = (name, patterns) =>
      patterns.some(p => p.includes('*')
        ? new RegExp('^' + p.replace(/\*/g, '.*') + '$').test(name)
        : p === name
      );

    const getExpected = pkgName => {
      const acc = {dependencies: {}, devDependencies: {}, peerDependencies: {}};
      for (const rule of workspaceDependencyRules) {
        if (!matches(pkgName, rule.target)) continue;
        for (const type of ["dependencies", "devDependencies", "peerDependencies"]) {
          for (const [dep, ver] of Object.entries(rule[type] || {}))
            acc[type][dep] = ver;
        }
      }
      return acc;
    };

    for (const workspace of Yarn.workspaces()) {
      // Skip root
      if (workspace.manifest.name === "root") continue;
      const pkgName = workspace.manifest.name;
      const expected = getExpected(pkgName);
      const depsLength = ["dependencies", "devDependencies", "peerDependencies"].map(it => Object.keys(expected[it]).length)
                                                                                .reduce((x, y) => x + y, 0)
      if (!depsLength) continue;

      for (const depType of ["dependencies", "devDependencies", "peerDependencies"]) {
        for (const [dependencyName, dependencyRange] of Object.entries(expected[depType])) {
          // use workspace.set to add or update in one step
          workspace.set(`${depType}.${dependencyName}`, dependencyRange);
        }
      }
    }
  }
});
