// This would be a more realistic example in a Node.js environment
// For the React demo, we'll create mock implementations

export class LazyUtilities {
  private static modules = new Map<string, any>()

  static async loadUtility(name: string): Promise<any> {
    if (this.modules.has(name)) {
      return this.modules.get(name)
    }

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))

    let module: any

    switch (name) {
      case 'lodash':
        module = {
          debounce: (fn: Function, delay: number) => {
            let timeoutId: NodeJS.Timeout
            return (...args: any[]) => {
              clearTimeout(timeoutId)
              timeoutId = setTimeout(() => fn.apply(null, args), delay)
            }
          },
          throttle: (fn: Function, delay: number) => {
            let lastCall = 0
            return (...args: any[]) => {
              const now = Date.now()
              if (now - lastCall >= delay) {
                lastCall = now
                fn.apply(null, args)
              }
            }
          },
          cloneDeep: (obj: any) => JSON.parse(JSON.stringify(obj))
        }
        break

      case 'date-fns':
        module = {
          format: (date: Date, pattern: string) => {
            const options: Intl.DateTimeFormatOptions = {}
            if (pattern.includes('yyyy')) options.year = 'numeric'
            if (pattern.includes('MM')) options.month = '2-digit'
            if (pattern.includes('dd')) options.day = '2-digit'
            return date.toLocaleDateString('en-US', options)
          },
          addDays: (date: Date, days: number) => {
            const result = new Date(date)
            result.setDate(result.getDate() + days)
            return result
          },
          differenceInDays: (dateLeft: Date, dateRight: Date) => {
            const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime())
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          }
        }
        break

      case 'validator':
        module = {
          isEmail: (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
          isURL: (str: string) => {
            try {
              new URL(str)
              return true
            } catch {
              return false
            }
          },
          isNumeric: (str: string) => /^\d+$/.test(str)
        }
        break

      default:
        throw new Error(`Unknown utility: ${name}`)
    }

    this.modules.set(name, module)
    return module
  }

  static clearCache() {
    this.modules.clear()
  }

  static getCacheStats() {
    return {
      size: this.modules.size,
      modules: Array.from(this.modules.keys())
    }
  }
}