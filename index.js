const REGEXP_OVER = /z-over\((?<param>.*)\)/
const REGEXP_UNDER = /z-under\((?<param>.*)\)/
const REGEXP_STACK = /z-stack\((?<value>.*)\)/

module.exports = () => {
  return {
    postcssPlugin: 'postcss-easy-z',
    prepare() {
      let stackedVariable

      return {
        Declaration(decl) {
          switch (true) {
            case decl.value.startsWith('z-over('): {
              decl.value = decl.value.replace(REGEXP_OVER, 'calc($<param> + 1)')
              return
            }

            case decl.value.startsWith('z-under('): {
              decl.value = decl.value.replace(REGEXP_UNDER, 'calc($<param> - 1)')
              return
            }

            case decl.variable && decl.value.startsWith('z-stack('): {
              const explicitValue = decl.value.match(REGEXP_STACK).groups.value
              const startingZ = explicitValue || '1'
              decl.value = stackedVariable ? (
                explicitValue !== '' ? explicitValue : `calc(var(${stackedVariable}) + 1)`
              ) : startingZ
              stackedVariable = decl.prop
              return
            }
          }
        },
        RuleExit() {
          stackedVariable = undefined
        }
      }
    },
  }
}
module.exports.postcss = true
