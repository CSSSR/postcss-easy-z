const postcss = require('postcss')

const plugin = require('./')

async function process(input, opts = {}) {
  return await postcss([plugin(opts)]).process(input, {from: undefined})
}

async function run(input, output, opts = {}) {
  let result = await process(input, opts)
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

describe('postcss-easy-z', () => {
  describe('z-stack', () => {
    it('creates z-indices based on order of appearance', async () => {
      const input = `
        :root {
          --z-body: z-stack();
          --z-header: z-stack();
          --z-popup: z-stack();
        }
      `

      const output = `
        :root {
          --z-body: 1;
          --z-header: calc(var(--z-body) + 1);
          --z-popup: calc(var(--z-header) + 1);
        }
      `

      await run(input, output)
    })

    it('starts counting z-indices from default value in a new scope', async () => {
      const input = `
        .a {
          --z-a1: z-stack();
          --z-a2: z-stack();
        }

        .b {
          --z-b1: z-stack();
          --z-b2: z-stack();
        }
      `

      const output = `
        .a {
          --z-a1: 1;
          --z-a2: calc(var(--z-a1) + 1);
        }

        .b {
          --z-b1: 1;
          --z-b2: calc(var(--z-b1) + 1);
        }
      `

      await run(input, output)
    })

    it('starts counting with a provided value', async () => {
      const input = `
        :root {
          --z-body: z-stack(10);
          --z-header: z-stack();
          --z-popup: z-stack();
        }
      `

      const output = `
        :root {
          --z-body: 10;
          --z-header: calc(var(--z-body) + 1);
          --z-popup: calc(var(--z-header) + 1);
        }
      `

      await run(input, output)
    })

    it('fails if starting value is not first', async () => {
      const input = `
        :root {
          --z-body: z-stack();
          --z-header: z-stack(10);
          --z-popup: z-stack();
        }
      `

      await expect(process(input)).rejects.toThrow('z-stack with starting value should be first')
    })
  })

  describe('z-over / z-under', () => {
    it('converts z-over usages', async () => {
      const input = `
        :root {
          --z-body: 1;
          --z-header: z-over(var(--z-body));
          --z-popup: z-over(var(--z-header));
        }
      `

      const output = `
        :root {
          --z-body: 1;
          --z-header: calc(var(--z-body) + 1);
          --z-popup: calc(var(--z-header) + 1);
        }
      `

      await run(input, output)
    })

    it('converts z-under usages', async () => {
      const input = `
        :root {
          --z-popup: 100;
          --z-header: z-under(var(--z-popup));
          --z-body: z-under(var(--z-header));
        }
      `

      const output = `
        :root {
          --z-popup: 100;
          --z-header: calc(var(--z-popup) - 1);
          --z-body: calc(var(--z-header) - 1);
        }
      `

      await run(input, output)
    })

    it('works for properties', async () => {
      const input = `
        .overBody {
          z-index: z-over(var(--z-body));
        }

        .underHeader {
          z-index: z-under(var(--z-header));
        }
      `

      const output = `
        .overBody {
          z-index: calc(var(--z-body) + 1);
        }

        .underHeader {
          z-index: calc(var(--z-header) - 1);
        }
      `

      await run(input, output)
    })
  })
})
